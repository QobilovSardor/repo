import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

import {
  getAllDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/api/department";
import type { IDepartment } from "@/interface/department";

interface DepartmentContextType {
  departments: IDepartment[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;

  fetchDepartments: () => Promise<void>;
  addDepartment: (data: Partial<IDepartment>) => Promise<void>;
  editDepartment: (id: number, data: Partial<IDepartment>) => Promise<void>;
  removeDepartment: (id: number) => Promise<void>;
  clearMessages: () => void;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined
);

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

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

  const fetchDepartments = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    clearMessages();

    try {
      const res = await getAllDepartment();
      setDepartments(res.data.payload || []);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        showMessage("error", "Bo'limlarni yuklashda xato");
        console.error("Fetch departments error:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [clearMessages, showMessage]);

  const addDepartment = useCallback(
    async (data: Partial<IDepartment>) => {
      clearMessages();
      setLoading(true);

      try {
        const res = await createDepartment(data);
        setDepartments((prev) => [...prev, res.data.payload]);
        showMessage("success", "Bo'lim muvaffaqiyatli qo'shildi!");
      } catch (err: unknown) {
        showMessage("error", "Bo'limni qo'shishda xato");
        console.error("Add department error:", err);
      } finally {
        setLoading(false);
      }
    },
    [showMessage, clearMessages]
  );

  const editDepartment = useCallback(
    async (id: number, data: Partial<IDepartment>) => {
      clearMessages();
      setLoading(true);

      try {
        const res = await updateDepartment(id, data);
        setDepartments((prev) =>
          prev.map((d) => (d.id === id ? res.data?.payload : d))
        );
        showMessage("success", "Bo'lim muvaffaqiyatli o'zgartirildi!");
      } catch (err: unknown) {
        showMessage("error", "Bo'limni o'chirishda xato");
        console.error("Edit department error:", err);
      } finally {
        setLoading(false);
      }
    },
    [showMessage, clearMessages]
  );

  const removeDepartment = useCallback(
    async (id: number) => {
      clearMessages();

      try {
        await deleteDepartment(id);
        setDepartments((prev) => prev.filter((d) => d.id !== id));
        showMessage("success", "Bo'lim muvaffaqiyatli o'chirildi!");
      } catch (err: unknown) {
        showMessage("error", "Bo'limni o'chirishda xato");
        console.error("Delete department error:", err);
      }
    },
    [showMessage, clearMessages]
  );

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

  const value: DepartmentContextType = {
    departments,
    loading,
    error,
    successMessage,
    fetchDepartments,
    addDepartment,
    editDepartment,
    removeDepartment,
    clearMessages,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDepartments = () => {
  const ctx = useContext(DepartmentContext);
  if (!ctx)
    throw new Error("useDepartments must be used within DepartmentProvider");
  return ctx;
};
