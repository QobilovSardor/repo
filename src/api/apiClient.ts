import axios from "axios";
import API from "./api";
import { handleLogout } from "@/helpers/logout";

const api = axios.create({
  baseURL: API.BASE,
  withCredentials: true,
});

// Request interceptor - token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token qo'shildi:", token);
  }

  return config;
});

// Response interceptor - xatolarni handle qilish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 - Unauthorized (token expiration)
    if (error.response?.status === 401) {
      console.log("Token expired - logout qililyapti");
      handleLogout();
      // Login sahifasiga yo'naltirish
      window.location.href = "/login";
    }

    // 403 - Forbidden (role xatosi)
    if (error.response?.status === 403) {
      console.log("Ruxsatsuzi - 403");
    }

    return Promise.reject(error);
  }
);

export default api;

// apiRequest helper function
export const apiRequest = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
  data?: any,
  config?: any
) => {
  return api({
    url,
    method,
    data,
    ...config,
  });
};
