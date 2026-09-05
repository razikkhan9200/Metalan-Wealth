/**
 * Central route map.
 *
 * Keep all application URL definitions in one place
 * to avoid hardcoded routes across components.
 */
export const ROUTES = {
  // ============================================================
  // PUBLIC ROUTES
  // ============================================================

  HOME: "/",
  ABOUT: "/about",
  PROPERTIES: "/properties",
  FUNDS: "/funds",
  EXCHANGE: "/exchange",
  HOW_IT_WORKS: "/how-it-works",
  CONTACT: "/contact",

  // ============================================================
  // AUTHENTICATION ROUTES
  // ============================================================

  LOGIN: "/login",
  REGISTER: "/register",

  // ============================================================
  // DASHBOARD ROUTES
  // ============================================================

  DASHBOARD: "/dashboard",
  DASHBOARD_PROPERTIES: "/dashboard/properties",
  DASHBOARD_FUNDS: "/dashboard/funds",
  DASHBOARD_EXCHANGE: "/dashboard/exchange",
  DASHBOARD_WALLET: "/dashboard/wallet",
  DASHBOARD_TRANSACTIONS: "/dashboard/transactions",
  DASHBOARD_PROFILE: "/dashboard/profile",
};