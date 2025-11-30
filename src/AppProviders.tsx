import { UserProvider } from "./context/UserContext";

type ProviderProps = { children: React.ReactNode };

const providers = [UserProvider];

export const AppProviders = ({ children }: ProviderProps) => {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
};
