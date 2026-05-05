import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';

/**
 * Enterprise-Grade API Client
 * Features: Silent Token Refresh, Request Queuing, Global Error Handling
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Access Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Lock mechanism for concurrent refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle Token Expiry (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If the refresh endpoint itself returns 401, the session is dead
      if (originalRequest.url?.includes('/admin/auth/refresh')) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Wait for the current refresh to finish and retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Robust refresh URL resolution
        const refreshPath = '/admin/auth/refresh';
        const refreshUrl = API_BASE_URL.endsWith('/api/v1') 
          ? `${API_BASE_URL}${refreshPath}` 
          : `/api/v1${refreshPath}`;

        const res = await axios.post(refreshUrl, {}, { withCredentials: true });
        const { accessToken } = res.data.data;

        // Update Global State
        useAuthStore.getState().setAccessToken(accessToken);

        // Notify all queued requests
        processQueue(null, accessToken);
        
        // Retry original request with new token
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        return api(originalRequest);

      } catch (refreshError) {
        // Full session cleanup on refresh failure
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        
        // Redirect to login if on admin route
        if (window.location.pathname.startsWith('/admin')) {
           window.location.href = '/admin/login?reason=session_expired';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
