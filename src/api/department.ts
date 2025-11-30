import type { IDepartment } from "@/interface/department";
import { apiRequest } from "./apiClient";

export const getAllDepartment = async () =>
  await apiRequest("/admin/department", "GET");

export const createDepartment = async (data: Partial<IDepartment>) =>
  await apiRequest("/admin/department", "POST", data);

export const updateDepartment = async (
  id: number,
  data: Partial<IDepartment>
) => await apiRequest(`/admin/department/${id}`, "PUT", data);

export const deleteDepartment = async (id: number) =>
  await apiRequest(`/admin/department/${id}`, "DELETE");
