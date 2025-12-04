import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { StaffUsersContext, type StaffContextType } from "./StaffUsersContext";
import React from "react";
import {
  blockStaffUser,
  deleteStaffUser,
  getAllUsersFilter,
  registerStaffUser,
  updateStaffPassword,
  updateStaffUser,
} from "@/api/admin-users";
import type { IStaffUser } from "@/interface";
import { handleAxiosError } from "@/helpers";
import { useAuth } from "../auth/useAuth";
import { PATHS } from "@/configs";

interface StaffUsersProviderProps {
  children: ReactNode;
}

export const StaffUsersProvider = ({ children }: StaffUsersProviderProps) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery<IStaffUser[], Error>({
    queryKey: ["staffUsers"],
    queryFn: async () => {
      const res = await getAllUsersFilter();
      return res.data?.payload?.clientList || [];
    },
    select: (res) => res || [],
    staleTime: 5 * 60 * 1000,
    enabled:
      isAuthenticated &&
      [PATHS.DEPARTMENT, PATHS.USER_DASHBOARD].includes(location.pathname),
  });

  const addMutation = useMutation({
    mutationFn: registerStaffUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["staffUsers"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      updateStaffUser(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["staffUsers"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteStaffUser(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["staffUsers"] }),
  });

  const blockMutation = useMutation({
    mutationFn: (id: number) => blockStaffUser(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["staffUsers"] }),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      updateStaffPassword(id, data),
  });

  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const clearMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const value: StaffContextType = {
    staffUsers: data || [],
    loading: isLoading,
    error: error?.message || errorMessage,
    successMessage,
    fetchUsers: () =>
      queryClient.invalidateQueries({ queryKey: ["staffUsers"] }),
    createUser: async (data) => {
      clearMessages();
      try {
        await addMutation.mutateAsync(data);
        setSuccessMessage("Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi!");
      } catch (error: unknown) {
        const message = handleAxiosError(error, {
          2003: "Foydalanuvchi nomi alaqachon mavjud",
        });
        setErrorMessage(message);
      }
    },
    deleteUser: async (id) => {
      clearMessages();
      try {
        await deleteMutation.mutateAsync(id);
        setSuccessMessage("Foydalanuvchi muvaffaqiyatli o'chirildi!");
      } catch {
        setErrorMessage("Foydalanuvchini o'chirishda xato");
      }
    },
    blockUser: async (id) => {
      clearMessages();
      try {
        await blockMutation.mutateAsync(id);
        setSuccessMessage("Foydalanuvchi holati o'zgartirildi!");
      } catch {
        setErrorMessage("Foydalanuvchini blokirovka qilishda xato");
      }
    },
    updateUser: async (id, data) => {
      clearMessages();
      try {
        await editMutation.mutateAsync({ id, data });
        setSuccessMessage("Foydalanuvchi muvaffaqiyatli o'zgartirildi!");
      } catch {
        setErrorMessage("Foydalanuvchini o'chirishda xato");
      }
    },
    updatePassword: async (id, data) => {
      clearMessages();
      try {
        await updatePasswordMutation.mutateAsync({ id, data });
        setSuccessMessage("Parol muvaffaqiyatli o'zgartirildi!");
      } catch {
        setErrorMessage("Parolni o'zgartirishda xato");
      }
    },
    clearMessages,
  };

  return (
    <StaffUsersContext.Provider value={value}>
      {children}
    </StaffUsersContext.Provider>
  );
};
