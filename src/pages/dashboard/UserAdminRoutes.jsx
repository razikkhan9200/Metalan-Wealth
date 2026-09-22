import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import UserAdmin from "./UserAdmin";
import FundInvestments from "./FundInvestments";
import PropertyInvestments from "./PropertyInvestments";
import Transactions from "./Transactions";
import Wallet from "./Wallet";
import Users from "./Users";
import Exchange from "./Exchange";

import {
  USER_ADMIN_BASE,
  useUserAdminNav,
} from "./shared/nav";

function DashboardPage({ go }) {
  const { state } = useLocation();

  const section =
    state?.section ?? "Dashboard";

  return (
    <UserAdmin
      key={section}
      onNavigateAway={go}
      initialSection={section}
    />
  );
}

export default function UserAdminRoutes() {
  const go = useUserAdminNav();

  return (
    <Routes>
      <Route
        index
        element={
          <DashboardPage go={go} />
        }
      />

      <Route
        path="investments"
        element={
          <FundInvestments
            onNavigate={go}
          />
        }
      />

      <Route
        path="properties"
        element={
          <PropertyInvestments
            onNavigate={go}
          />
        }
      />

      <Route
        path="wallet"
        element={
          <Wallet
            onNavigate={go}
          />
        }
      />

      <Route
        path="transactions"
        element={
          <Transactions
            onNavigate={go}
          />
        }
      />

      <Route
        path="users"
        element={
          <Users
            onNavigate={go}
          />
        }
      />

      <Route
        path="exchange"
        element={
          <Exchange
            onNavigate={go}
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={USER_ADMIN_BASE}
            replace
          />
        }
      />
    </Routes>
  );
}