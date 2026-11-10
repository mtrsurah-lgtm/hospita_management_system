import axios from 'axios';
import { handleLocalRequest } from './localDatabase';

const isRemoteHost =
  typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1';

// If running in cloud/mobile/remote deployment (e.g. *.vercel.app or another device/network)
// and no remote backend API URL is configured, ALWAYS activate the in-browser local DB engine!
let isBackendOffline = Boolean(isRemoteHost && !import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Proactively check if local backend is reachable when testing on localhost
const detectBackendAvailability = async () => {
  if (isRemoteHost && !import.meta.env.VITE_API_BASE_URL) {
    isBackendOffline = true;
    console.info('[HMS Engine] Remote deployment detected (Vercel/Cloud/Mobile). Running in Autonomous In-Browser DB Mode.');
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('http://localhost:5000/health', { signal: controller.signal });
    clearTimeout(timeoutId);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.status === 'healthy') {
        isBackendOffline = false;
        return;
      }
    }
  } catch {
    // Localhost:5000 not responding
  }

  isBackendOffline = true;
  console.info('[HMS Engine] Operating in Autonomous In-Browser Database Mode (No localhost server required).');
};

detectBackendAvailability();

// Request Interceptor: Attach JWT Token & Route directly to local database if offline
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always route directly to In-Browser Local Database if backend is offline or on remote host without API
    if (isBackendOffline || (isRemoteHost && !import.meta.env.VITE_API_BASE_URL)) {
      config.adapter = async (cfg) => {
        try {
          const localData = await handleLocalRequest(cfg);
          return {
            data: localData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: cfg,
          };
        } catch (localErr) {
          const status = localErr.response?.status || 400;
          const data = localErr.response?.data || { success: false, message: localErr.message };
          return Promise.reject({
            config: cfg,
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

// Response Interceptor: Global 401 & 403 handling + Seamless Local DB Fallback on Any Network Error
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const config = error.config;

    // Any network failure or error connecting to backend -> fall back to local database immediately
    if (config) {
      isBackendOffline = true;
      try {
        console.warn(
          `[HMS Engine] Network/backend connection failed (${error.message || error.code}). Serving from In-Browser Local DB: ${config.method?.toUpperCase()} ${config.url}`
        );
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
