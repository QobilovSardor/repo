import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { IUser } from "@/interface";
import {
  getUserData,
  loginFunc,
  registerFunc,
  updateProfile,
} from "@/api/auth";
import { PATHS, USER_ROLES } from "@/configs/constants";
import { handleAxiosError } from "@/helpers";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState<IUser | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [authError, setError] = useState<string | null>(null);

  // register function
  const register: AuthContextType["login"] = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await registerFunc(formData as IUser);
      const userData = res?.payload;
      if (!userData) throw new Error("User data not found");
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate(PATHS.HOME);
    } catch (error) {
      const message = handleAxiosError(error, {
        2001: "Invalid username or password",
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // login function
  const login: AuthContextType["login"] = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      await loginFunc(formData);
      const res = await getUserData();
      const userData = res?.payload;
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
    } catch (error) {
      const message = handleAxiosError(error, {
        2001: "Invalid username or password",
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // update profile
  const updateProfileFunc = async (updatedData: Partial<IUser>) => {
    try {
      setLoading(true);
      setError(null);

      const res = await updateProfile(updatedData);
      const updatedUser = res?.payload as IUser;
      console.log(res, "update res");
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.log(error);
      setError("An error occurred while updating the data!");
    } finally {
      setLoading(false);
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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        register,
        login,
        logout,
        loading,
        authError,
        updateProfileFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
