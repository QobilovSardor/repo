import { Route, Routes } from "react-router-dom";
import { Home } from "./pages";

export const AppRoutes = () => (
  <Routes>
    {routes?.map((route) => {
      const Component = route.component;
      return (
        <Route key={route.path} path={route.path} element={<Component />} />
      );
    })}
  </Routes>
);

const routes = [
  {
    path: "/",
    component: Home,
  },
];
