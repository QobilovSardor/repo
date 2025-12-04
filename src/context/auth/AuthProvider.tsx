import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { IUser } from "@/interface/user";
import { getUserData, loginFunc } from "@/api/auth";
import { PATHS, USER_ROLES } from "@/configs/constants";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState<IUser | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);
  const navigate = useNavigate();

  // login function
  const login: AuthContextType["login"] = async (formData) => {
    await loginFunc(formData);
    const res = await getUserData();
    const userData = res?.data?.payload;

    if (!userData) throw new Error("User data not found");
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData));

    switch (userData.userRole) {
      case USER_ROLES.ADMIN:
        navigate(PATHS.ADMIN);
        break;
      case USER_ROLES.STAFF:
        navigate(PATHS.STAFF);
        break;
      default:
        navigate(PATHS.USER);
    }
  };

  // logout function
  const logout: AuthContextType["logout"] = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
