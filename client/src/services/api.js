import axios from 'axios';
import { handleLocalRequest } from './localDatabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isBackendOffline = false;

// Proactively check if backend is reachable (e.g. when not running localhost)
const detectBackendAvailability = async () => {
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch('/health', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        isBackendOffline = false;
        return;
      }
    } catch {
      // Backend not responding
    }

    // Backend is offline or not responding
    isBackendOffline = true;
    console.info('[HMS Engine] Operating in Autonomous In-Browser Database Mode (No localhost server required).');
  }
};

detectBackendAvailability();

// Request Interceptor: Attach JWT Token & Route directly to local database if offline
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If backend is known to be offline, bypass network call directly
    if (isBackendOffline) {
      config.adapter = async () => {
        try {
          const localData = await handleLocalRequest(config);
          return {
            data: localData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          };
        } catch (localErr) {
          const status = localErr.response?.status || 400;
          const data = localErr.response?.data || { success: false, message: localErr.message };
          return Promise.reject({
            config,
            response: { status, data, headers: {} },
            message: localErr.message,
          });
        }
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 & 403 handling + Seamless Local DB Fallback on Network Error
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const config = error.config;

    // If server is unreachable, connection refused, or 404 on API endpoint
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error');
    const isApi404 = error.response && error.response.status === 404;

    if (config && (isNetworkError || isApi404)) {
      isBackendOffline = true;
      try {
        console.warn(`[HMS Engine] Backend connection unavailable (${error.message || '404'}). Falling back to In-Browser Local DB for ${config.method?.toUpperCase()} ${config.url}`);
        const localData = await handleLocalRequest(config);
        return localData;
      } catch (localErr) {
        return Promise.reject(localErr);
      }
    }

    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Prevent redirect loop if already on auth routes
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
