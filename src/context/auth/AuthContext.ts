import { createContext } from "react";
import type { ILoginForm, IUser } from "@/interface/user";

export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (user: ILoginForm) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
