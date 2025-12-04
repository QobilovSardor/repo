import { Route, Routes } from "react-router-dom";
import {
  Login,
  UsersDashboard,
  DepartmentDashboard,
  Dashboard,
  Profile,
  Home,
  Register,
} from "@/pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { PATHS } from "@/configs";

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
  { path: PATHS.HOME, component: Home, protected: false },
  { path: PATHS.LOGIN, component: Login, protected: false },
  { path: PATHS.REGISTER_AUTHOR, component: Register, protected: false },
  { path: PATHS.USER_DASHBOARD, component: UsersDashboard, protected: true },
  {
    path: PATHS.DEPARTMENT,
    component: DepartmentDashboard,
    protected: true,
  },
  { path: PATHS.DASHBOARD, component: Dashboard, protected: true },
  { path: PATHS.ADMIN, component: Profile, protected: true },
];
