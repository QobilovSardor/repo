export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  userRole: string;
  password: string;
  departmentId?: string | number | null;
  hemisId?: string | null;
  orcid?: string | null;
  ror?: string | null;
  email?: string;
}
export interface ILoginForm {
  username: string;
  password: string;
}
export interface IStaffUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
  status: string;
  departmentId: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  payload: T;
}

export interface IListResponse<T> {
  success: boolean;
  message: string;
  payload: {
    data: T[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface FilterParams {
  key?: string;
  userRole?: string;
  limit?: number;
  page?: number;
}
