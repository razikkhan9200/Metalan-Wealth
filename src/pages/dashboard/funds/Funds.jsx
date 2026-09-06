/* pages/dashboard/funds/Funds.jsx: application source file. Expert-managed capital funds marketplace. */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../layouts/DashboardNavbar";
import Text from "../../../components/ui/Text";
import Button from "../../../components/ui/Button";
import { ROUTES } from "../../../constants/routes";
import { FUNDS } from "../../../data/funds";

import heroBg from "../../../../public/images/funds-hero.png";

// Shared brand colors — same values used across Login/Dashboard/Property
// so this page's palette stays identical rather than drifting if edited
// in isolation.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// Category filter pills shown above the fund grid. "All Funds" is
// always first and always matches every fund, the same way "Global"
// works as the no-op option in the Property page's location filter.
const CATEGORIES = ["All Funds", "Real Estate", "Forex", "Mixed Allocation", "High Yield"];

// Curated leaderboard for the sidebar. Deliberately a separate, hand-
// picked list rather than "top 3 of FUNDS by yield1y" — it references
// underlying sub-strategies (e.g. "Tech Token VC Pool") that don't map
// 1:1 to the fund cards above, matching the source design. Wire this to
// a real leaderboard endpoint once one exists.
const TOP_PERFORMING_FUNDS = [
  { name: "Global Forex Yield", change: "+22.1%" },
  { name: "Tech Token VC Pool", change: "+19.4%" },
  { name: "Metalan RE Growth", change: "+18.4%" },
];

/**
 * Builds `/dashboard/funds/:slug` for a given fund. Centralized here
 * (rather than inlined at each call site) so there's exactly one place
 * to update if the URL shape ever changes, matching how
 * ROUTES.PROPERTY_DETAIL is used as a fallback-able constant in
 * AppRoutes.jsx for the equivalent property route.
 */
function fundDetailPath(slug) {
  return (ROUTES.FUND_DETAIL || "/dashboard/funds/:slug").replace(":slug", slug);
}

export default function Funds() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All Funds");

  const visibleFunds = useMemo(
    () =>
      category === "All Funds"
        ? FUNDS
        : FUNDS.filter((fund) => fund.category === category),
    [category]
  );

  return (
    <div className="min-h-screen w-full bg-[#0a0910] pb-16">
      <Navbar
        faixBalance="24,850.00"
        notificationCount={3}
        user={{ name: "Arjun Mehta", email: "arjun@metalanwealth.com", balance: "24,850.00" }}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        {/* ============================================================
            HERO BANNER
        ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5">
          <div
            className="h-44 w-full bg-cover bg-center sm:h-52"
            style={{ backgroundImage: `url(${heroBg})` }}
            role="presentation"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,9,16,0.92) 0%, rgba(10,9,16,0.65) 45%, rgba(10,9,16,0.25) 100%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 sm:px-10">
            <h1 className="font-serif text-2xl text-white sm:text-3xl lg:text-4xl">
              Expert-Managed Capital Funds
            </h1>
            <p className="max-w-lg text-sm" style={{ color: `${GOLD}cc` }}>
              Commit reserve assets into luxury index pools and automated
              algorithmic yield structures curated by our tier-1 asset
              managers.
            </p>
          </div>
        </div>

        {/* ============================================================
            CATEGORY FILTER + FUND GRID / SIDEBAR
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((option) => {
                const isActive = option === category;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    aria-pressed={isActive}
                    className={
                      "rounded-xl border px-4 py-2 text-sm font-medium transition-colors " +
                      (isActive
                        ? "border-[#e8b46a]/70 text-[#e8b46a]"
                        : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80")
                    }
                    style={isActive ? { background: `${GOLD}14` } : undefined}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {visibleFunds.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {visibleFunds.map((fund) => (
                  <FundCard
                    key={fund.slug}
                    fund={fund}
                    onViewFund={() => navigate(fundDetailPath(fund.slug))}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center">
                <Text size="sm" color="muted" className="!text-white/40">
                  No funds in this category yet.
                </Text>
              </div>
            )}
          </div>

          {/* Sidebar: leaderboard + allocation guidance */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Top Performing Funds
              </Text>

              <ul className="mt-4 divide-y divide-white/5">
                {TOP_PERFORMING_FUNDS.map((entry, index) => (
                  <li key={entry.name} className="flex items-center gap-3 py-3">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/40"
                      style={{ background: `${ACCENT}88` }}
                    >
                      {index + 1}
                    </span>
                    <Text size="sm" color="white" className="flex-1 truncate">
                      {entry.name}
                    </Text>
                    <span className="font-mono text-sm font-semibold text-emerald-400">
                      {entry.change}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{ borderColor: `${GOLD}66`, background: `${ACCENT}55` }}
            >
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Fund Allocation Tip
              </Text>
              <Text size="sm" className="mt-2 !text-white/70 leading-relaxed">
                Diversifying your portfolio across distinct asset classes is
                fundamental. We advise allocating 60% of liquid wealth to
                low-volatility real estate syndicates, 30% to high-return
                indices, and 10% cash equivalent FAIX reserves.
              </Text>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * One fund's card. `onViewFund` is called (not a bare `<Link>`) so the
 * parent decides how navigation happens — currently `navigate()` from
 * react-router, but this keeps the card itself router-agnostic if it's
 * ever reused somewhere that navigates differently.
 */
function FundCard({ fund, onViewFund }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Text size="lg" weight="semibold" color="white" className="font-serif leading-snug">
            {fund.name}
          </Text>
          <p className="mt-1 text-xs text-white/40">Managed by {fund.manager}</p>
        </div>

        <span className="shrink-0 rounded-md bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
          {fund.risk}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div>
          <p className="text-[11px] text-white/40">NET AUM</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-white">{fund.netAum}</p>
        </div>
        <div>
          <p className="text-[11px] text-white/40">CURRENT NAV</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-white">
            F{fund.currentNav.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-white/40">1Y YIELD</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-emerald-400">
            +{fund.yield1y}%
          </p>
        </div>
      </div>

      <MiniBarChart values={fund.barTrend} />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-white/40">Min: F {fund.minFaix} FAIX</p>
       <Button
  type="button"
  variant="outline"
  size="sm"
  onClick={onViewFund}
  className="!border-[#e8b46a99] !text-xs !font-semibold !text-[#e8b46a] hover:!bg-white/5"
>
  VIEW FUND
</Button>
      </div>
    </div>
  );
}

/**
 * Small decorative bar row used as a stand-in for a real performance
 * sparkline. `values` are relative heights from 0–1; swapping in a real
 * NAV-history series later is a matter of passing different numbers in.
 */
function MiniBarChart({ values }) {
  return (
    <div className="mt-4 flex h-6 items-end gap-1.5" aria-hidden="true">
      {values.map((value, index) => {
        const isLast = index === values.length - 1;
        return (
          <div
            key={index}
            className="flex-1 rounded-sm"
            style={{
              height: `${Math.max(value, 0.15) * 100}%`,
              background: isLast ? GOLD : `${ACCENT}cc`,
            }}
          />
        );
      })}
    </div>
  );
}
