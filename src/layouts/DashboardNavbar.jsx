/* layouts/DashboardNavbar.jsx: application source file. Top navigation bar for the authenticated dashboard area. */
import { Link, useLocation } from "react-router-dom";

// lucide-react icons
import { Bell } from "lucide-react";

// Routes
import { ROUTES } from "../constants/routes";


const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

const NAV_LINKS = [
  { label: "Dashboard", to: ROUTES.DASHBOARD || "#" },
  { label: "Property", to: ROUTES.DASHBOARD_PROPERTIES || "#" },
  { label: "Funds", to: ROUTES.DASHBOARD_FUNDS || "#" },
  { label: "Exchange", to: ROUTES.EXCHANGE || "#" },
  { label: "Wallet", to: ROUTES.WALLET || "#" },
];

/**
 * Top navigation bar for the authenticated app shell.
 *
 * Active link is derived from the current route, so it stays correct
 * as the user moves between Dashboard / Property / Funds / etc.
 * without needing to be told which page it's on.
 *
 * Props:
 * - faixBalance: string | number — shown in the balance pill (default "24,850.00")
 * - notificationCount: number — shown on the bell badge, hidden if 0 (default 3)
 * - user: { name, email, avatarUrl?, balance? } — passed straight through
 *   to UserProfileMenu, which renders the profile icon button and its
 *   modal. Replaces the old single-letter avatar entirely: there's no
 *   letter fallback anymore — UserProfileMenu shows a User icon instead
 *   whenever `avatarUrl` isn't provided.
 * - onSignOut: called when "Sign out" is chosen inside the profile
 *   modal; forwarded to UserProfileMenu unchanged.
 */
export default function Navbar({
  faixBalance = "24,850.00",
  notificationCount = 3,
  user,
  onSignOut,
}) {
  const location = useLocation();

  return (
    <header className="border-b border-white/5 px-4 py-4 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to={ROUTES.HOME || "#"} className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-serif text-[#e8c99a] shadow-md shadow-black/40 ring-1 ring-white/10"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #0e211c)` }}
          >
            M
          </span>
          <span className="hidden font-serif text-lg tracking-wide text-white sm:inline">
            METALAN WEALTH
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={
                  "relative pb-1 text-sm transition-colors " +
                  (isActive
                    ? "font-medium text-[#e8b46a]"
                    : "text-white/50 hover:text-white/80")
                }
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-[1px] left-0 h-[2px] w-full rounded-full"
                    style={{ background: GOLD }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold text-white sm:flex"
            style={{ borderColor: `${ACCENT}99`, background: `${ACCENT}33` }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e8b46a]/20 text-[9px] text-[#e8b46a]">
              F
            </span>
            FAIX {faixBalance}
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 hover:text-white"
          >
            <Bell size={17} />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e8b46a] text-[10px] font-bold text-[#241608]">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>

          {/* Profile icon + its modal. UserProfileMenu owns its own
              open/closed state internally, so Navbar just hands it the
              user data and a sign-out callback — see
              components/ui/UserProfileMenu.jsx. */}
          {/* <UserProfileMenu user={user} onSignOut={onSignOut} /> */}
        </div>
      </div>
    </header>
  );
}