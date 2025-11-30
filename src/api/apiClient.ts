import axios from "axios";
import API from "./api";
import { handleLogout } from "@/helpers/logout";

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Token expired - logout");
      handleLogout();
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.log("Error - 403");
    }

    return Promise.reject(error);
  }
);

export default api;

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
