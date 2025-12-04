import {
  AuthProvider,
  DepartmentProvider,
  StaffUsersProvider,
  UserProvider,
} from "./context";

type ProviderProps = { children: React.ReactNode };

const providers = [
  AuthProvider,
  UserProvider,
  DepartmentProvider,
  StaffUsersProvider,
];

export const AppProviders = ({ children }: ProviderProps) => {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
};
