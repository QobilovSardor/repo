import { createContext } from "react";
import type { ILoginForm, IUser } from "@/interface";

export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (user: ILoginForm) => void;
  logout: () => void;
  updateProfileFunc: (updateData: IUser) => void;
  loading: boolean;
  authError: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
