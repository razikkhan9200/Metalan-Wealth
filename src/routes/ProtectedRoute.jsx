/* routes/ProtectedRoute.jsx: application source file. See README.md for the folder responsibility. */
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "../constants/routes";
import { isAuthenticated } from "../utils/auth";

/**
 * Protects all private dashboard routes.
 *
 * If the user is not authenticated, they are redirected
 * to the login page and the requested route is preserved
 * so it can be used after successful authentication.
 */
export default function ProtectedRoute() {
  const location = useLocation();

  // Redirect unauthenticated users to the login page.
  if (!isAuthenticated()) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Render the requested protected route.
  return <Outlet />;
}





/* 

Why this setup is proper :--- 

 User visits /dashboard
         ↓
 ProtectedRoute
         ↓
 isAuthenticated()
    ↙           ↘
  false          true
   ↓              ↓
 /login       <Outlet />
                  ↓
           Dashboard Page

 */