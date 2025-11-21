import axios from "axios";

// Vite uses import.meta.env. variable must start with VITE_
const API_URL = import.meta.env.VITE_API_URL;

// Strict check to prevent silent failures in production
if (!API_URL) {
  throw new Error(
    "FATAL ERROR: VITE_API_URL is not defined. Check your .env file."
  );
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    // localStorage is synchronous; no await needed
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;