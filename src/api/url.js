import axios from "axios";

const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";

const BACKEND_URL = axios.create({
  baseURL: `${BASE}/api/v1/noteapp`,
});

// Separate auth endpoint (no token interceptor)
export const AUTH_URL = axios.create({
  baseURL: `${BASE}/api/v1/auth`,
});

// attach token from localStorage if present
BACKEND_URL.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default BACKEND_URL;
