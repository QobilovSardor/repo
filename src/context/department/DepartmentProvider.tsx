import {
  createDepartment,
  deleteDepartment,
  getAllDepartment,
  updateDepartment,
} from "@/api/department";
import type { IDepartment } from "@/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  DepartmentContext,
  type DepartmentContextType,
} from "./DepartmentContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { PATHS } from "@/configs";

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<IDepartment[], Error>({
    queryKey: ["departments"],
    queryFn: getAllDepartment,
    select: (res) => res || [],
    staleTime: 5 * 60 * 1000,
    enabled: [PATHS.DEPARTMENT, PATHS.USER_DASHBOARD, PATHS.REGISTER_AUTHOR].includes(
      location.pathname
    ),
  });

  const addMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IDepartment> }) =>
      updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const value: DepartmentContextType = {
    departments: data || [],
    loading: isLoading,
    error: error?.message || null,
    addDepartment: async (data) => {
      await addMutation.mutateAsync(data);
      toast.success("The department has been successfully created!");
    },
    editDepartment: async (id, data) => {
      await editMutation.mutateAsync({ id, data });
      toast.success("Department successfully changed");
    },
    removeDepartment: async (id) => {
      await removeMutation.mutateAsync(id);
      toast.success("Department deleted");
    },
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};
