import api, { apiRequest } from "./apiClient";

export const login = async (data: { username: string; password: string }) => {
  const response = await apiRequest("/authenticate", "POST", data);

  if (response.data?.payload) {
    const { accessToken, refreshToken } = response.data.payload;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

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
