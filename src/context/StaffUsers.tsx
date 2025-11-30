import {
  blockStaffUser,
  deleteStaffUser,
  getAllUsersFilter,
  registerStaffUser,
  updateStaffPassword,
  updateStaffUser,
} from "@/api/admin-users";
import type { IStaffUser } from "@/interface/user";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface StaffContextType {
  staffUsers: IStaffUser[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  fetchUsers: () => void;
  createUser: (data: object) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  blockUser: (id: number) => Promise<void>;
  updatePassword: (id: number, pass: object) => Promise<void>;
  updateUser: (id: number, data: object) => Promise<void>;
  clearMessages: () => void;
}

const StaffUsersContext = createContext<StaffContextType | undefined>(
  undefined
);

export const StaffUsersProvider = ({ children }: { children: ReactNode }) => {
  const [staffUsers, setStaffUsers] = useState<IStaffUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersFilter();
      setStaffUsers(res.data?.payload?.clientList);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (data: object) => {
    setLoading(true);
    try {
      await registerStaffUser(data);
      setSuccessMessage("User registered successfully!");
      fetchUsers();
    } catch {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await deleteStaffUser(id);
      setSuccessMessage("User deleted");
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    }
  };

  const blockUser = async (id: number) => {
    try {
      await blockStaffUser(id);
      setSuccessMessage("User blocked/unblocked");
      fetchUsers();
    } catch {
      setError("Failed to update status");
    }
  };

  const updatePassword = async (id: number, data: object) => {
    try {
      await updateStaffPassword(id, data);
      setSuccessMessage("Password updated");
    } catch {
      setError("Failed to update password");
    }
  };

  const updateUser = async (id: number, data: object) => {
    try {
      await updateStaffUser(id, data);
      setSuccessMessage("User updated");
      fetchUsers();
    } catch {
      setError("Failed to update user");
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

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
        blockUser,
        updatePassword,
        updateUser,
        clearMessages,
      }}
    >
      {children}
    </StaffUsersContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStaffUsers = () => {
  const ctx = useContext(StaffUsersContext);
  if (!ctx) throw new Error("useStaffUsers must be inside StaffUsersProvider");
  return ctx;
};
