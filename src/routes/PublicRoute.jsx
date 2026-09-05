/* routes/PublicRoute.jsx: application source file. See README.md for the folder responsibility. */
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "../constants/routes";
import { isAuthenticated } from "../utils/auth";

/**
 * Prevents authenticated users from accessing
 * public authentication pages such as Login and Register.
 *
 * Authenticated users are redirected to the dashboard,
 * while unauthenticated users can access the requested route.
 */
export default function PublicRoute() {
  // Redirect authenticated users to the dashboard.
  if (isAuthenticated()) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
      />
    );
  }

  // Render the requested public/authentication route.
  return <Outlet />;
}

/*

Flow


User opens /login
       ↓
 PublicRoute
       ↓
isAuthenticated()
   ↙           ↘
 true          false
  ↓              ↓
/dashboard    <Outlet />
                 ↓
              Login


*/