import { AppProviders } from "./AppProviders";
import { Container } from "./components";
import { Header } from "./layouts";
import { AppRoutes } from "./routes";

export const App = () => {
  return (
    <div className="overflow-hidden">
      <AppProviders>
        <Header />
        <Container>
          <AppRoutes />
        </Container>
      </AppProviders>
    </div>
  );
};
