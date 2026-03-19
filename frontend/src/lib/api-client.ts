import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const publicApiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateApiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const AUTH_REFRESH_SKIP_PATHS = [
  '/users/login',
  '/users/register',
  '/users/forgot-password',
  '/users/reset-password',
  '/users/verify-email',
  '/users/verify-email/send',
  '/users/refresh-token',
];

// Optionally, we can set up an interceptor to refresh tokens
// For HTTP-only cookies, the server handles refresh logic on its end usually,
// but if we have a dedicated /refresh endpoint, we can call it on 401:

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

privateApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const requestUrl = originalRequest?.url ?? '';
    const shouldSkipRefresh =
      !originalRequest ||
      originalRequest.skipAuthRefresh ||
      AUTH_REFRESH_SKIP_PATHS.some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !shouldSkipRefresh && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return privateApiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token using HTTP-only cookie
        await axios.post(`${API_URL}/users/refresh-token`, {}, { withCredentials: true });
        
        processQueue(null);
        return privateApiClient(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError, null);
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

          if (!isAuthPath) {
            const next = `${window.location.pathname}${window.location.search}`;
            window.location.assign(`/login?redirect=${encodeURIComponent(next)}`);
          }
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = privateApiClient;
