import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Building2,
  Wallet,
  ArrowLeftRight,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Investments", icon: TrendingUp },
  { label: "Properties", icon: Building2 },
  { label: "Wallet", icon: Wallet },
  { label: "Exchange", icon: ArrowLeftRight },
];

function NavigationPanel({
  active = "Dashboard",
  onNavigate,
  onLogout,
  onExpandChange,
}) {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    const next = !expanded;
    setExpanded(next);
    onExpandChange?.(next);
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-white/[0.07]
      bg-[#060b10]/95 backdrop-blur-xl transition-all duration-300
      ${expanded ? "w-[250px]" : "w-[76px]"}`}
    >
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div
          className={`flex h-[82px] items-center border-b border-white/[0.06]
          ${expanded ? "justify-between px-5" : "justify-center"}`}
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl
            border border-[#d4af6a]/60 bg-[#0d1716] text-[#d4af6a]
            shadow-[0_0_25px_rgba(212,175,106,0.08)]"
          >
            <span className="font-serif text-2xl">M</span>
          </div>

          {expanded && (
            <div className="ml-3 min-w-0">
              <p className="whitespace-nowrap font-serif text-lg text-white">
                METALAN
              </p>
              <p className="text-[9px] tracking-[0.32em] text-[#d4af6a]">
                INVEST. OWN. GROW.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-3 py-5">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = active === label;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onNavigate?.(label)}
                title={!expanded ? label : undefined}
                className={`group flex w-full items-center rounded-xl
                  transition-all duration-200
                  ${expanded ? "gap-3 px-3" : "justify-center px-2"}
                  h-12
                  ${
                    isActive
                      ? "border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300"
                      : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg
                  ${
                    isActive
                      ? "bg-cyan-400/10 text-cyan-300"
                      : "bg-white/[0.025]"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>

                {expanded && (
                  <span className="whitespace-nowrap text-sm font-medium">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] p-3">

          <button
            type="button"
            title={!expanded ? "Profile" : undefined}
            className={`mb-2 flex h-12 w-full items-center rounded-xl
              text-slate-500 transition hover:bg-white/[0.04] hover:text-white
              ${expanded ? "gap-3 px-3" : "justify-center"}`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.025]">
              <User className="h-[18px] w-[18px]" />
            </span>

            {expanded && (
              <span className="text-sm font-medium">
                Andrew Doe
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onLogout}
            title={!expanded ? "Logout" : undefined}
            className={`flex h-12 w-full items-center rounded-xl
              text-slate-500 transition hover:bg-rose-400/[0.06] hover:text-rose-300
              ${expanded ? "gap-3 px-3" : "justify-center"}`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.025]">
              <LogOut className="h-[18px] w-[18px]" />
            </span>

            {expanded && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>

          {/* Expand button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className={`mt-2 flex h-10 w-full items-center rounded-xl
              border border-white/[0.06] bg-white/[0.025]
              text-slate-500 transition hover:border-cyan-400/20
              hover:text-cyan-300
              ${expanded ? "justify-end px-3" : "justify-center"}`}
          >
            {expanded ? (
              <X className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

        </div>
      </div>
    </aside>
  );
}

export default NavigationPanel;