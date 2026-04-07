import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const SKIP_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/verify-email/send",
  "/auth/refresh-token",
  "/users/me",
];

const PUBLIC_AUTH_PAGES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";
const REFRESH_FAILURE_COOLDOWN_MS = 30_000;

let refreshPromise: Promise<void> | null = null;
let refreshBlockedUntil = 0;

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
    const shouldSkipRefresh = SKIP_REFRESH_ENDPOINTS.some((path) => requestUrl.includes(path));
    if (shouldSkipRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (Date.now() < refreshBlockedUntil) {
        throw error;
      }

      if (!refreshPromise) {
        refreshPromise = apiClient
          .post("/auth/refresh-token", {})
          .then(() => {
            refreshBlockedUntil = 0;
          })
          .catch((refreshError) => {
            refreshBlockedUntil = Date.now() + REFRESH_FAILURE_COOLDOWN_MS;
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      return apiClient(originalRequest);
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const isAuthPath = PUBLIC_AUTH_PAGES.some((path) => pathname === path || pathname.startsWith(`${path}/`));

        if (!isAuthPath) {
          const next = `${window.location.pathname}${window.location.search}`;
          window.location.assign(`/login?redirect=${encodeURIComponent(next)}`);
        }
      }

      return Promise.reject(refreshError);
    }
  },
);
