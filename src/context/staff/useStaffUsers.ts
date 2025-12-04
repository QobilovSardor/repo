import { useContext } from "react";
import { StaffUsersContext, type StaffContextType } from "./StaffUsersContext";

export const useStaffUsers = (): StaffContextType => {
  const context = useContext(StaffUsersContext);
  if (!context)
    throw new Error("useStaffUsers must be used inside StaffUsersProvider");
  return context;
};
