/* routes/AppRoutes.jsx: application source file. See README.md for the folder responsibility. */
import { Route, Routes } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

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

// Authentication Pages
import Login from "../pages/auth/Login";


// Dashboard Pages
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardProperties from "../pages/dashboard/Properties";
import DashboardFunds from "../pages/dashboard/Funds";
import DashboardExchange from "../pages/dashboard/Exchange";
import DashboardWallet from "../pages/dashboard/Wallet";
import Transactions from "../pages/dashboard/Transactions";
import Profile from "../pages/dashboard/Profile";
import Referrals from "../pages/dashboard/Referrals";
import Settings from "../pages/dashboard/Settings";

// Error Pages
import NotFound from "../pages/errors/NotFound";

/**
 * Application route configuration.
 *
 * Route groups:
 * 1. Public Routes
 *    Accessible to all visitors.
 *
 * 2. Authentication Routes
 *    Accessible only to unauthenticated users.
 *
 * 3. Protected Dashboard Routes
 *    Accessible only to authenticated users.
 *
 * 4. Fallback Route
 *    Handles all undefined URLs.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ============================================================
          PUBLIC WEBSITE ROUTES
          These pages are accessible without authentication.
      ============================================================ */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />

        <Route path={ROUTES.ABOUT} element={<About />} />

        <Route path={ROUTES.PROPERTIES} element={<Properties />} />

        <Route path={ROUTES.FUNDS} element={<Funds />} />

        <Route path={ROUTES.EXCHANGE} element={<Exchange />} />

        <Route
          path={ROUTES.HOW_IT_WORKS}
          element={<HowItWorks />}
        />

        <Route path={ROUTES.CONTACT} element={<Contact />} />
      </Route>

      {/* ============================================================
          AUTHENTICATION ROUTES
          PublicRoute prevents authenticated users from
          accessing login and registration pages.
      ============================================================ */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<Login />} />

      </Route>

      {/* ============================================================
          PROTECTED DASHBOARD ROUTES
          ProtectedRoute ensures that only authenticated users
          can access the dashboard.
      ============================================================ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Dashboard Home */}
          <Route
            path={ROUTES.DASHBOARD}
            element={<Dashboard />}
          />

          {/* Property Investments */}
          <Route
            path={ROUTES.DASHBOARD_PROPERTIES}
            element={<DashboardProperties />}
          />

          {/* Investment Funds */}
          <Route
            path={ROUTES.DASHBOARD_FUNDS}
            element={<DashboardFunds />}
          />

          {/* Token Exchange */}
          <Route
            path={ROUTES.DASHBOARD_EXCHANGE}
            element={<DashboardExchange />}
          />

          {/* Wallet */}
          <Route
            path={ROUTES.DASHBOARD_WALLET}
            element={<DashboardWallet />}
          />

          {/* Transactions */}
          <Route
            path={ROUTES.DASHBOARD_TRANSACTIONS}
            element={<Transactions />}
          />

          {/* User Profile / KYC */}
          <Route
            path={ROUTES.DASHBOARD_PROFILE}
            element={<Profile />}
          />





          {/* Referral Program */}
          <Route
            path={ROUTES.DASHBOARD_REFERRALS}
            element={<Referrals />}
          />

          {/* Account Settings */}
          <Route
            path={ROUTES.DASHBOARD_SETTINGS}
            element={<Settings />}
          />
        </Route>
      </Route>

      {/* ============================================================
          404 FALLBACK
          Matches every URL that does not exist.
      ============================================================ */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}