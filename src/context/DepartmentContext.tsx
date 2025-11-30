import {
  createContext,
  useContext,
  useState,
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

  fetchDepartments: () => Promise<void>;
  addDepartment: (data: Partial<IDepartment>) => Promise<void>;
  editDepartment: (id: number, data: Partial<IDepartment>) => Promise<void>;
  removeDepartment: (id: number) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined
);

export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await getAllDepartment();
      setDepartments(res.data.payload);
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (data: Partial<IDepartment>) => {
    const res = await createDepartment(data);
    setDepartments((prev) => [...prev, res.data.payload]);
  };

  const editDepartment = async (id: number, data: Partial<IDepartment>) => {
    const res = await updateDepartment(id, data);

    setDepartments((prev) => prev.map((d) => (d.id === id ? res.data?.payload : d)));
  };

  const removeDepartment = async (id: number) => {
    await deleteDepartment(id);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        loading,
        fetchDepartments,
        addDepartment,
        editDepartment,
        removeDepartment,
      }}
    >
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
