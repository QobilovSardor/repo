import { useAuth } from "@/context";
import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
