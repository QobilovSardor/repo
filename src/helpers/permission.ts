import type { IUser } from "@/interface";

export const hasRole = (user: IUser, role: string) => {
  if (!user || !user.userRole) return false;
  return user.userRole.includes(role);
};
