import type { IDepartment } from "@/interface";
import { createContext } from "react";

export interface DepartmentContextType {
  departments: IDepartment[];
  loading: boolean;
  error: string | null;
  addDepartment: (data: Partial<IDepartment>) => Promise<void>;
  editDepartment: (id: number, data: Partial<IDepartment>) => Promise<void>;
  removeDepartment: (id: number) => Promise<void>;
}

export const DepartmentContext = createContext<DepartmentContextType | null>(
  null
);
