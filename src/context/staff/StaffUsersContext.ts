import type { IStaffUser } from "@/interface";
import { createContext } from "react";

export interface StaffContextType {
  staffUsers: IStaffUser[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (data: object) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  blockUser: (id: number) => Promise<void>;
  updatePassword: (id: number, pass: object) => Promise<void>;
  updateUser: (id: number, data: object) => Promise<void>;
  clearMessages: () => void;
}

export const StaffUsersContext = createContext<StaffContextType | undefined>(
  undefined
);
