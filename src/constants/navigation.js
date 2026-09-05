/* constants/navigation.js: application source file. See README.md for the folder responsibility. */
import { ROUTES } from "./routes";

/**
 * Public website navigation.
 *
 * These links are available to unauthenticated users
 * across the public-facing Metalan Wealth website.
 */
export const publicNavigation = [
  {
    label: "About",
    href: ROUTES.ABOUT,
  },
  {
    label: "Properties",
    href: ROUTES.PROPERTIES,
  },
  {
    label: "Funds",
    href: ROUTES.FUNDS,
  },
  {
    label: "Exchange",
    href: ROUTES.EXCHANGE,
  },
  {
    label: "How It Works",
    href: ROUTES.HOW_IT_WORKS,
  },
];

/**
 * Dashboard navigation.
 *
 * These links are available to authenticated users
 * inside the private Metalan Wealth dashboard.
 */
export const dashboardNavigation = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
  },
  {
    label: "Properties",
    href: ROUTES.DASHBOARD_PROPERTIES,
  },
  {
    label: "Funds",
    href: ROUTES.DASHBOARD_FUNDS,
  },
  {
    label: "Exchange",
    href: ROUTES.DASHBOARD_EXCHANGE,
  },
  {
    label: "Wallet",
    href: ROUTES.DASHBOARD_WALLET,
  },
  {
    label: "Transactions",
    href: ROUTES.DASHBOARD_TRANSACTIONS,
  },
  {
    label: "Profile",
    href: ROUTES.DASHBOARD_PROFILE,
  },
];