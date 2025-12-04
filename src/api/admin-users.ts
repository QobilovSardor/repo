import { apiRequest } from "./apiClient";

export interface FilterParams {
  key?: string;
  userRole?: string;
  limit?: number;
  page?: number;
}

export const getAllUsersFilter = async (params: FilterParams = {}) => {
  const { key = "", limit = 100, page = 0 } = params;
  // userRole = "STAFF",
  const query = new URLSearchParams({
    key,
    // userRole,
    limit: limit.toString(),
    page: page.toString(),
  });

  return apiRequest(`/admin/user/find-by?${query.toString()}`, "GET");
};

export const registerStaffUser = async (data: object) =>
  apiRequest("/admin/user/register/staff", "POST", data);

export const deleteStaffUser = async (userId: number) =>
  apiRequest(`/admin/user/${userId}`, "DELETE");

export const blockStaffUser = async (userId: number) =>
  apiRequest(`/admin/user/${userId}/block`, "PUT");

export const updateStaffPassword = async (userId: number, data: object) =>
  apiRequest(`/admin/user/${userId}/password`, "PUT", data);

export const updateStaffUser = async (userId: number, data: object) =>
  apiRequest(`/admin/user/update/${userId}`, "PUT", data);
