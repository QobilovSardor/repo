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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error", error);
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        console.log("Unauthorized - logout");
        handleLogout();
        window.location.href = "/login";
        break;
      case 403:
        console.log("Forbidden - insufficient permissions");
        break;
      default:
        console.error("API error", error.response.data || status);
    }
    switch (status) {
      case 401:
        notifyError("Session expired. Redirecting to login...");
        handleLogout();
        window.location.href = "/login";
        break;
      case 403:
        notifyError("You do not have permission to perform this action.");
        break;
      default: {
        const message =
          (data && (data.message || JSON.stringify(data))) ||
          "Something went wrong. Please try again.";
        notifyError(message);
      }
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
