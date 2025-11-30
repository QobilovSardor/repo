import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getAllUsersFilter,
  registerStaffUser,
  deleteStaffUser,
} from "@/api/admin-users";

interface StaffUser {
  id: number;
  username: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  role: string;
  status: "active" | "inactive";
  departmentId?: number;
}

interface CreateStaffUserPayload {
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  departmentId?: string;
}

interface StaffUsersContextType {
  staffUsers: StaffUser[];
  loading: boolean;
  error: string;
  successMessage: string;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateStaffUserPayload) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  clearMessages: () => void;
}

const StaffUsersContext = createContext<StaffUsersContextType | undefined>(
  undefined
);

export const StaffUsersProvider = ({ children }: { children: ReactNode }) => {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllUsersFilter({
        userRole: "STAFF",
        limit: 100,
        page: 1,
      });
      setStaffUsers(res.data?.payload?.clientList || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch staff users";
      setError(errorMsg);
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(
    async (data: CreateStaffUserPayload) => {
      try {
        setLoading(true);
        setError("");

        await registerStaffUser({
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          departmentId: data.departmentId,
        });

        setSuccessMessage("Staff user registered successfully!");

        // Users listini yangilash
        await fetchUsers();

        // Success message'ni 3 sekunddan so'ng o'chirish
        setTimeout(() => setSuccessMessage(""), 3000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to register user";
        setError(errorMsg);
        console.error("Create user error:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (userId: number) => {
      try {
        setError("");
        await deleteStaffUser(userId);
        setSuccessMessage("User deleted successfully!");
        await fetchUsers();
        setTimeout(() => setSuccessMessage(""), 3000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || "Failed to delete user";
        setError(errorMsg);
        console.error("Delete user error:", err);
      }
    },
    [fetchUsers]
  );

  const clearMessages = useCallback(() => {
    setError("");
    setSuccessMessage("");
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <StaffUsersContext.Provider
      value={{
        staffUsers,
        loading,
        error,
        successMessage,
        fetchUsers,
        createUser,
        deleteUser,
        clearMessages,
      }}
    >
      {children}
    </StaffUsersContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStaffUsers = () => {
  const context = useContext(StaffUsersContext);
  if (!context)
    throw new Error("useStaffUsers must be used within StaffUsersProvider");
  return context;
};
