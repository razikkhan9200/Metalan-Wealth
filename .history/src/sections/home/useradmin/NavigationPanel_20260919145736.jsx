import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
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
  ShieldCheck,
  UserRound,
  PieChart,
} from "lucide-react";

const MAIN_NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Investments", icon: Briefcase },
  { label: "Properties", icon: Building2 },
  { label: "Portfolio", icon: PieChart },
  { label: "Wallet", icon: Wallet },
  { label: "Transactions", icon: ReceiptText },
  { label: "Exchange", icon: ArrowLeftRight },
];

const ACCOUNT_NAV = [
  { label: "Notifications", icon: Bell, badge: 2 },
  { label: "Settings", icon: Settings },
  { label: "Help & Support", icon: CircleHelp },
];

export default function NavigationPanel({
  active = "Dashboard",
  onNavigate = () => {},
  onLogout = () => {},
}) {
  const [collapsed, setCollapsed] = useState(false);

  const navButton = (selected) =>
    `group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
      selected
        ? "border border-cyan-400/15 bg-cyan-400/[0.07] text-white shadow-[inset_3px_0_0_#22d3ee]"
        : "border border-transparent text-slate-400 hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-slate-100"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/[0.07] bg-[#05080d]/95 shadow-[12px_0_45px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-[78px]" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex h-[82px] shrink-0 items-center border-b border-white/[0.06] px-4 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#d4af6a]/50 bg-[#0a1019] font-serif text-xl text-[#e2c17f] shadow-[0_0_25px_rgba(212,175,106,0.08)]">
            M
          </div>

          {!collapsed && (
            <div>
              <p className="font-serif text-[16px] font-semibold tracking-wide text-white">
                METALAN
              </p>
              <p className="mt-0.5 text-[9px] tracking-[0.28em] text-[#d4af6a]">
                WEALTH
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="px-3 pt-5">
        <button
          type="button"
          onClick={() => onNavigate("Profile")}
          title={collapsed ? "Andrew Doe" : undefined}
          className={`w-full rounded-2xl border border-white/[0.06] bg-[#0a1019]/90 p-3 transition-all hover:border-[#d4af6a]/20 hover:bg-white/[0.035] ${
            collapsed
              ? "flex justify-center"
              : "flex items-center gap-3 text-left"
          }`}
        >
          <div className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-[#d4af6a]/40 bg-[#d4af6a]/10 text-sm font-bold text-[#e2c17f]">
            <UserRound className="h-5 w-5" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0a1019] bg-emerald-400" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Andrew Doe
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] text-slate-500">
                  Verified Investor
                </span>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Main */}
      <nav className="mt-6 flex-1 overflow-y-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {!collapsed && (
          <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-600">
            Overview
          </p>
        )}

        <div className="space-y-1">
          {MAIN_NAV.map(({ label, icon: Icon }) => {
            const selected = active === label;

            return (
              <button
                key={label}
                type="button"
                title={collapsed ? label : undefined}
                onClick={() => onNavigate(label)}
                className={navButton(selected)}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    selected ? "text-cyan-300" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />

                {!collapsed && (
                  <span className="text-[13px] font-medium">{label}</span>
                )}

                {!collapsed && selected && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                )}
              </button>
            );
          })}
        </div>

        {!collapsed && (
          <p className="mb-2 mt-7 px-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-600">
            Account
          </p>
        )}

        <div className="space-y-1">
          {ACCOUNT_NAV.map(({ label, icon: Icon, badge }) => {
            const selected = active === label;

            return (
              <button
                key={label}
                type="button"
                title={collapsed ? label : undefined}
                onClick={() => onNavigate(label)}
                className={navButton(selected)}
              >
                <span className="relative">
                  <Icon className="h-[18px] w-[18px] text-slate-500 group-hover:text-slate-300" />

                  {badge && (
                    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[#d4af6a] px-1 text-[9px] font-bold text-[#1a1305]">
                      {badge}
                    </span>
                  )}
                </span>

                {!collapsed && (
                  <span className="text-[13px] font-medium">{label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Balance */}
      {!collapsed && (
        <div className="mx-3 mb-3 rounded-2xl border border-white/[0.06] bg-[#0a1019]/90 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Available FAIX
            </span>
            <Wallet className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mt-2 text-lg font-semibold tabular-nums text-white">
            42,500
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300">Portfolio active</span>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-500 transition hover:bg-rose-400/[0.05] hover:text-rose-300"
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed && (
            <span className="text-[13px] font-medium">Sign out</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 text-slate-600 transition hover:border-white/10 hover:text-slate-300"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-wider">
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
