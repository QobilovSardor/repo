import type { IUser } from "@/interface";
import { apiRequest } from "./apiClient";

export const loginFunc = async (data: {
  username: string;
  password: string;
}) => {
  const response = await apiRequest("/authenticate", "POST", data);
  return response;
};

export const getUserData = async () => {
  const response = await apiRequest("/user", "GET");
  return response?.data;
};

export const updatePassword = async (data: object) => {
  const res = await apiRequest("/user/password", "PUT", data);
  return res;
};

export const updateProfile = async (data: Partial<IUser>) => {
  const response = await apiRequest("/user", "PUT", data);
  return response.data;
};
