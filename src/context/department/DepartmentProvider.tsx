import {
  createDepartment,
  deleteDepartment,
  getAllDepartment,
  updateDepartment,
} from "@/api/department";
import type { IDepartment } from "@/interface/department";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  DepartmentContext,
  type DepartmentContextType,
} from "./DepartmentContext";

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<IDepartment[], Error>({
    queryKey: ["departments"],
    queryFn: getAllDepartment,
    select: (res) => res || [],
    staleTime: 5 * 60 * 1000,
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
    },
    editDepartment: async (id, data) => {
      await editMutation.mutateAsync({ id, data });
    },
    removeDepartment: async (id) => {
      await removeMutation.mutateAsync(id);
    },
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};
