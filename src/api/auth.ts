import { apiRequest } from "./apiClient";

export const loginFunc = async (data: { username: string; password: string }) => {
  const response = await apiRequest("/authenticate", "POST", data);
  return response;
};

export const getUserData = async () => {
  const response = await apiRequest("/user", "GET");
  const data = JSON.stringify(response.data?.payload);
  localStorage.setItem("user", data);
  return response;
};

export const updatePassword = async (data: object) =>
  await apiRequest("/user/password", "PUT", data);

export const updateProfile = async (data: object) =>
  await apiRequest("/user", "PUT", data);
