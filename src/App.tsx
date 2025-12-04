import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "./AppProviders";
import { Container } from "./components";
import { Header } from "./layouts";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/route";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <div className="overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />
      <QueryClientProvider client={queryClient}>
        <AppProviders>
          <Header />
          <Container>
            <AppRoutes />
          </Container>
        </AppProviders>
      </QueryClientProvider>
    </div>
  );
};
