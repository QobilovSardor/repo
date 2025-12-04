import axios from "axios";
import API from "./api";
import { handleLogout } from "@/helpers/logout";
import { notifyError } from "@/interface/notify";

const api = axios.create({
  baseURL: API.BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
interface FailedRequest {
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await api.post("/refresh-token");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleLogout();
        notifyError("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Qolgan xatolar
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 403:
        notifyError("You do not have permission.");
        break;
      default:
        notifyError(data?.message || "Unexpected error");
    }

    return Promise.reject(error);
  }
);

export default api;

export const apiRequest = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any
) => {
  return api({
    url,
    method,
    data,
    ...config,
  });
};
