import { Route, Routes } from "react-router-dom";
import { Dashboard, Home, Login, Profile, UsersDashboard } from "./pages";

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
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/users-dashboard",
    component: UsersDashboard,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/profile",
    component: Profile,
  },
];
