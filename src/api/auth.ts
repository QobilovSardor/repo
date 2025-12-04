import type { IUser } from "@/interface";
import { apiRequest } from "./apiClient";
import { API_PATHS } from "@/configs";

export const registerFunc = async (data: IUser) => {
  const res = await apiRequest(API_PATHS.REGISTER_AUTHOR, "POST", data);
  return res?.data;
};

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

export const updatePassword = async (data: object) =>
  await apiRequest("/user/password", "PUT", data);

export const updateProfile = async (data: Partial<IUser>) => {
  const response = await apiRequest("/user", "PUT", data);
  return response.data;
};
