/**
 * nav.js — URL mapping + navigation helpers for the /user-admin area.
 * NavigationPanel talks in labels ("Wallet", "Portfolio"…); this turns them into real routes.
 */
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { clearAuthSession } from "../../../utils/auth";

export const USER_ADMIN_BASE = "/user-admin";

// label -> { path, section }. `section` is the Dashboard section to scroll to on arrival.
export const NAV_TARGETS = {
  Dashboard: { path: USER_ADMIN_BASE, section: "Dashboard" },
  Portfolio: { path: USER_ADMIN_BASE, section: "Portfolio" },
  Investments: { path: `${USER_ADMIN_BASE}/investments` },
  Properties: { path: `${USER_ADMIN_BASE}/properties` },
  Users: { path: `${USER_ADMIN_BASE}/users` },
  Wallet: { path: `${USER_ADMIN_BASE}/wallet` },
  Exchange: { path: `${USER_ADMIN_BASE}/exchange` }, // "coming soon" page
  Transactions: { path: `${USER_ADMIN_BASE}/transactions` },
};

/** Returns a `go(label)` function for NavigationPanel's onNavigate. */
export function useUserAdminNav() {
  const navigate = useNavigate();
  return useCallback(
    (label) => {
      const target = NAV_TARGETS[label];
      if (!target) return; // Notifications / Settings / Help / Profile: no page yet
      navigate(target.path, { state: { section: target.section ?? "Dashboard" } });
    },
    [navigate]
  );
}

/** Clears the demo session and returns to the login page. */
export function useLogout() {
  const navigate = useNavigate();
  return useCallback(() => {
    clearAuthSession();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);
}