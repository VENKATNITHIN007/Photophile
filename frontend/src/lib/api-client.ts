import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/verify-email/send",
  "/auth/refresh-token",
];

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";

const getCookieValue = (cookieName: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    if (name === cookieName) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const method = (config.method ?? "GET").toUpperCase();

  if (SAFE_METHODS.has(method) || typeof window === "undefined") {
    return config;
  }

  let csrfToken = getCookieValue(CSRF_COOKIE_NAME);
  if (!csrfToken) {
    try {
      await apiClient.get("/auth/csrf");
      csrfToken = getCookieValue(CSRF_COOKIE_NAME);
    } catch {
      return config;
    }
  }

  if (!csrfToken) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers);
  headers.set(CSRF_HEADER_NAME, csrfToken);
  config.headers = headers;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => requestUrl.includes(path));
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/register");

        if (!isAuthPath) {
          const next = `${window.location.pathname}${window.location.search}`;
          window.location.assign(`/login?redirect=${encodeURIComponent(next)}`);
        }
      }

      return Promise.reject(refreshError);
    }
  },
);
