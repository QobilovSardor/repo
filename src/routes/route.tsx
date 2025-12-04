import { Route, Routes } from "react-router-dom";
import {
  Login,
  UsersDashboard,
  DepartmentDashboard,
  Dashboard,
  Profile,
  Home,
} from "@/pages";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => (
  <Routes>
    {routes?.map((route) => {
      const Component = route.component;
      const element = route.protected ? (
        <ProtectedRoute>
          <Component />
        </ProtectedRoute>
      ) : (
        <Component />
      );

      return <Route key={route.path} path={route.path} element={element} />;
    })}
  </Routes>
);

const routes = [
  { path: "/", component: Home, protected: false },
  { path: "/login", component: Login, protected: false },
  { path: "/users-dashboard", component: UsersDashboard, protected: true },
  {
    path: "/department-dashboard",
    component: DepartmentDashboard,
    protected: true,
  },
  { path: "/dashboard", component: Dashboard, protected: true },
  { path: "/profile", component: Profile, protected: true },
];
