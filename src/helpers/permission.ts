import type { IUser } from "@/interface/user";

export const hasRole = (user: IUser, role: string) => {
  if (!user || !user.userRole) return false;
  return user.userRole.includes(role);
};
