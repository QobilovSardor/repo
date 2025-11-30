// @/api/admin-users.ts
import { apiRequest } from "./apiClient";

interface FilterParams {
  key?: string;
  userRole?: string;
  limit?: number;
  page?: number;
}

export const getAllUsersFilter = async (params: FilterParams = {}) => {
  const { key = "string", userRole = "STAFF", limit = 100, page = 1 } = params;

  const query = new URLSearchParams({
    key,
    userRole,
    limit: limit.toString(),
    page: page.toString(),
  }).toString();

  return apiRequest(`/admin/user/find-by?${query}`, "GET");
};

// Create staff user
export const registerStaffUser = async (data: object) =>
  apiRequest("/admin/user/register/staff", "POST", data);

// Delete staff user
export const deleteStaffUser = async (userId: number) =>
  apiRequest(`/admin/user/delete/${userId}`, "DELETE");

// Update staff user
export const updateStaffUser = async (userId: number, data: object) =>
  apiRequest(`/admin/user/update/${userId}`, "PUT", data);
