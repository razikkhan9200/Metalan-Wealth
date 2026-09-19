import { useState } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Building2,
  Wallet,
  ArrowLeftRight,
  ReceiptText,
  Bell,
  Settings,
  CircleHelp,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserRound,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Investments", icon: BriefcaseBusiness },
  { label: "Properties", icon: Building2 },
  { label: "Wallet", icon: Wallet },
  { label: "Transactions", icon: ReceiptText },
  { label: "Exchange", icon: ArrowLeftRight },
];

const ACCOUNT_ITEMS = [
  { label: "Notifications", icon: Bell, badge: 3 },
  { label: "Settings", icon: Settings },
  { label: "Help & Support", icon: CircleHelp },
];

export default function NavigationPanel({
  active = "Dashboard",
  onNavigate = () => {},
  onLogout = () => {},
}) {
  const [collapsed, setCollapsed] = useState(false);

  const itemClass = (isActive) =>
    `group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
      isActive
        ? "bg-[#d4af6a]/10 text-[#e2c17f] ring-1 ring-[#d4af6a]/20"
        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/[0.07] bg-[#07100d]/95 px-3 py-4 shadow-[10px_0_40px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[82px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } px-2`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#d4af6a]/50 bg-[#d4af6a]/10 text-xl font-serif text-[#e2c17f]">
            M
          </div>

          {!collapsed && (
            <div>
              <p className="font-serif text-[17px] font-semibold tracking-wide text-white">
                METALAN
              </p>
              <p className="text-[9px] tracking-[0.3em] text-[#d4af6a]">
                WEALTH
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <button
        type="button"
        onClick={() => onNavigate("Profile")}
        className={`mt-7 flex items-center rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 text-left transition hover:border-[#d4af6a]/20 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#d4af6a] to-[#87682e] text-sm font-bold text-[#171207]">
          AD
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Andrew Doe
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span className="text-[11px] text-slate-500">Verified Investor</span>
            </div>
          </div>
        )}
      </button>

      {/* Main navigation */}
      <div className="mt-7">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Workspace
          </p>
        )}

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;

            return (
              <button
                key={item.label}
                type="button"
                title={collapsed ? item.label : undefined}
                onClick={() => onNavigate(item.label)}
                className={itemClass(isActive)}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${
                    isActive ? "text-[#e2c17f]" : ""
                  }`}
                />

                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}

                {!collapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d4af6a]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account */}
      <div className="mt-7">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Account
          </p>
        )}

        <nav className="space-y-1">
          {ACCOUNT_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;

            return (
              <button
                key={item.label}
                type="button"
                title={collapsed ? item.label : undefined}
                onClick={() => onNavigate(item.label)}
                className={itemClass(isActive)}
              >
                <span className="relative">
                  <Icon className="h-[18px] w-[18px]" />

                  {item.badge && (
                    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#d4af6a] px-1 text-[9px] font-bold text-[#171207]">
                      {item.badge}
                    </span>
                  )}
                </span>

                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Wallet mini card */}
      {!collapsed && (
        <div className="mb-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              Available FAIX
            </span>
            <Wallet className="h-4 w-4 text-emerald-400" />
          </div>

          <p className="mt-2 text-lg font-semibold tabular-nums text-white">
            17,181
          </p>

          <p className="mt-1 text-[10px] text-emerald-400">
            +18.5% portfolio growth
          </p>
        </div>
      )}

      {/* Logout */}
      <button
        type="button"
        onClick={onLogout}
        className={itemClass(false)}
      >
        <LogOut className="h-[18px] w-[18px] text-rose-400" />
        {!collapsed && (
          <span className="text-sm font-medium text-slate-400">
            Sign out
          </span>
        )}
      </button>

      {/* Collapse */}
      <button
        type="button"
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        onClick={() => setCollapsed((value) => !value)}
        className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 text-slate-500 transition hover:border-white/15 hover:text-white"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <span className="flex items-center gap-2 text-xs">
            <ChevronLeft className="h-4 w-4" />
            Collapse
          </span>
        )}
      </button>
    </aside>
  );
}
