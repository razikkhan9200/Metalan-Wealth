/* App.jsx */
import { useEffect } from "react";
import {
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import useLenis from "./hooks/useLenis";
import Toaster from "./components/ui/Toaster";
import { getToken, clearAuthSession } from "./utils/auth";

function AuthWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();

      // Already on login page -> nothing to do
      if (location.pathname === "/login") {
        return;
      }

      // Token removed / missing -> clear session + redirect
      if (!token) {
        clearAuthSession();

        navigate("/login", {
          replace: true,
          state: {
            from: location.pathname,
            reason: "session-expired",
          },
        });
      }
    };

    // Initial check
    checkAuth();

    // Detect storage changes from another tab/window
    const handleStorage = (event) => {
      if (event.key === "metalan_access_token") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorage);

    // Detect manual removal from DevTools/current tab also.
    // `storage` event does not reliably fire for same-document changes.
    const interval = window.setInterval(checkAuth, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.clearInterval(interval);
    };
  }, [location.pathname, navigate]);

  return null;
}

export default function App() {
  useLenis();

  return (
    <BrowserRouter>
      <AuthWatcher />

      <AppRoutes />

      <Toaster />
    </BrowserRouter>
  );
}