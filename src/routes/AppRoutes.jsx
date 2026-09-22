/* routes/AppRoutes.jsx: application source file. See README.md for the folder responsibility. */

import {
  Route,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useEffect } from "react";

// Layouts
import PublicLayout from "../layouts/PublicLayout";

// Route Guards
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Route Constants
import { ROUTES } from "../constants/routes";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Properties from "../pages/public/Properties";
import Funds from "../pages/public/Funds";
import Exchange from "../pages/public/Exchange";
import HowItWorks from "../pages/public/HowItWorks";
import Contact from "../pages/public/Contact";

// Authentication
import Login from "../pages/auth/Login";

// Dashboard
import UserAdmin from "../pages/dashboard/UserAdmin";
import DashboardProperties from "../pages/dashboard/PropertyInvestments";
import DashboardFunds from "../pages/dashboard/FundInvestments";
import DashboardExchange from "../pages/dashboard/Exchange";
import DashboardWallet from "../pages/dashboard/Wallet";
import Profile from "../pages/dashboard/UserProfilePanel";
import UserAdminRoutes from "../pages/dashboard/UserAdminRoutes";

// Theme
import { ThemeProvider } from "../pages/dashboard/shared/ThemeContext";

// Error
import NotFound from "../pages/errors/NotFound";

/* ============================================================
   SCROLL TO TOP
============================================================ */

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ============================================================
   PROTECTED THEME LAYOUT

   ThemeProvider yahan rakha hai so that:
   /dashboard
   /user-admin/*
   /investments
   /properties
   /wallet
   /transactions
   /exchange

   sab same theme context use karein.
============================================================ */

function ProtectedThemeLayout() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
}

/* ============================================================
   APP ROUTES
============================================================ */

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* ======================================================
            PUBLIC WEBSITE
        ======================================================= */}

        <Route element={<PublicLayout />}>
          <Route
            path={ROUTES.HOME}
            element={<Home />}
          />

          <Route
            path={ROUTES.ABOUT}
            element={<About />}
          />

          <Route
            path={ROUTES.PROPERTIES}
            element={<Properties />}
          />

          <Route
            path={ROUTES.FUNDS}
            element={<Funds />}
          />

          <Route
            path={ROUTES.EXCHANGE}
            element={<Exchange />}
          />

          <Route
            path={ROUTES.HOW_IT_WORKS}
            element={<HowItWorks />}
          />

          <Route
            path={ROUTES.CONTACT}
            element={<Contact />}
          />
        </Route>


        {/* ======================================================
            AUTHENTICATION
        ======================================================= */}

        <Route element={<PublicRoute />}>
          <Route
            path={ROUTES.LOGIN}
            element={<Login />}
          />
        </Route>


        {/* ======================================================
            PROTECTED INVESTOR AREA

            ProtectedRoute
                  ↓
            ThemeProvider
                  ↓
            all dashboard pages
        ======================================================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedThemeLayout />}>

            {/* -----------------------------------------------
                USER ADMIN NESTED AREA
            ------------------------------------------------ */}

            <Route
              path="/user-admin/*"
              element={<UserAdminRoutes />}
            />


            {/* -----------------------------------------------
                DASHBOARD HOME
            ------------------------------------------------ */}

            <Route
              path={ROUTES.DASHBOARD}
              element={<UserAdmin />}
            />


            {/* -----------------------------------------------
                PROPERTY INVESTMENTS
            ------------------------------------------------ */}

            <Route
              path={ROUTES.DASHBOARD_PROPERTIES}
              element={<DashboardProperties />}
            />


            {/* -----------------------------------------------
                FUND INVESTMENTS
            ------------------------------------------------ */}

            <Route
              path={ROUTES.DASHBOARD_FUNDS}
              element={<DashboardFunds />}
            />


            {/* -----------------------------------------------
                EXCHANGE
            ------------------------------------------------ */}

            <Route
              path={ROUTES.DASHBOARD_EXCHANGE}
              element={<DashboardExchange />}
            />


            {/* -----------------------------------------------
                WALLET
            ------------------------------------------------ */}

            <Route
              path={ROUTES.DASHBOARD_WALLET}
              element={<DashboardWallet />}
            />


            {/* -----------------------------------------------
                PROFILE
            ------------------------------------------------ */}

            <Route
              path={ROUTES.DASHBOARD_PROFILE}
              element={<Profile />}
            />

          </Route>
        </Route>


        {/* ======================================================
            404
        ======================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}