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
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

interface StaffContextType {
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

const StaffUsersContext = createContext<StaffContextType | undefined>(
  undefined
);

export const StaffUsersProvider = ({ children }: { children: ReactNode }) => {
  const [staffUsers, setStaffUsers] = useState<IStaffUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pending requestlarni kuzatish
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  // Auto-clear messages
  const showMessage = useCallback(
    (type: "error" | "success", message: string) => {
      if (type === "error") {
        setError(message);
      } else {
        setSuccessMessage(message);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        clearMessages();
      }, 3000);
    },
    [clearMessages]
  );

  const fetchUsers = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    clearMessages();

    try {
      const res = await getAllUsersFilter();
      setStaffUsers(res.data?.payload?.clientList || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        showMessage("error", "Foydalanuvchilarni yuklashda xato");
        console.error("Fetch users error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [clearMessages, showMessage]);

  const createUser = useCallback(
    async (data: object) => {
      setLoading(true);
      clearMessages();

      try {
        await registerStaffUser(data);
        showMessage(
          "success",
          "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi!"
        );
        await fetchUsers();
      } catch (err: unknown) {
        showMessage("error", "Foydalanuvchini yaratishda xato");
        console.error("Create user error:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers, showMessage, clearMessages]
  );

  const deleteUser = useCallback(
    async (id: number) => {
      clearMessages();

      try {
        await deleteStaffUser(id);
        showMessage("success", "Foydalanuvchi muvaffaqiyatli o'chirildi!");
        await fetchUsers();
      } catch (err: unknown) {
        showMessage("error", "Foydalanuvchini o'chirishda xato");
        console.error("Delete user error:", err);
      }
    },
    [fetchUsers, showMessage, clearMessages]
  );

  const blockUser = useCallback(
    async (id: number) => {
      clearMessages();

      try {
        await blockStaffUser(id);
        showMessage("success", "Foydalanuvchi holati o'zgartirildi!");
        await fetchUsers();
      } catch (err: unknown) {
        showMessage("error", "Foydalanuvchini blokirovka qilishda xato");
        console.error("Block user error:", err);
      }
    },
    [fetchUsers, showMessage, clearMessages]
  );

  const updatePassword = useCallback(
    async (id: number, data: object) => {
      clearMessages();

      try {
        await updateStaffPassword(id, data);
        showMessage("success", "Parol muvaffaqiyatli o'zgartirildi!");
      } catch (err: unknown) {
        showMessage("error", "Parolni o'chirishda xato");
        console.error("Update password error:", err);
      }
    },
    [showMessage, clearMessages]
  );

  const updateUser = useCallback(
    async (id: number, data: object) => {
      clearMessages();

      try {
        await updateStaffUser(id, data);
        showMessage("success", "Foydalanuvchi muvaffaqiyatli o'zgartirildi!");
        await fetchUsers();
      } catch (err: unknown) {
        showMessage("error", "Foydalanuvchini o'chirishda xato");
        console.error("Update user error:", err);
      }
    },
    [fetchUsers, showMessage, clearMessages]
  );

  // Cleanup: unmount bo'lganda pending requestlarni bekor qilish
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value: StaffContextType = {
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
  };

  return (
    <StaffUsersContext.Provider value={value}>
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
