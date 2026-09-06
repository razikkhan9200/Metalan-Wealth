/* pages/funds/Funds.jsx: application source file. Expert-managed capital funds marketplace. */
import { useMemo, useState } from "react";

import Navbar from "../../pages/dashboard/Navbar";
import Text from "../../components/ui/Text";

import heroBg from "../../../public/images/funds-hero.png";

// Shared brand colors — same values used across Login/Dashboard/Property
// so this page's palette stays identical rather than drifting if edited
// in isolation.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// Category filter pills shown above the fund grid. "All Funds" is
// always first and always matches every fund, the same way "Global"
// works as the no-op option in the Property page's location filter.
const CATEGORIES = ["All Funds", "Real Estate", "Forex", "Mixed Allocation", "High Yield"];

// The funds on offer. `category` drives the filter pills above the
// grid; `risk` is shown as a badge on the card (styling is the same
// for every risk tier by design — see FundCard — it's informational,
// not color-coded). `barTrend` is a small set of relative bar heights
// (0–1) for the decorative sparkline, with the last value always meant
// to read as the "current" period and rendered in gold.
//
// NOTE: category assignments here are a reasonable mapping from each
// fund's description (e.g. a hospitality real-estate syndicate is
// filed under "Real Estate"), not values pulled from a real backend —
// swap this whole array for an API response once fund data is live.
const FUNDS = [
  {
    id: "re-growth",
    name: "Metalan Real Estate Growth Fund",
    manager: "Sarah Jenkins",
    risk: "Moderate",
    category: "Real Estate",
    netAum: "$12.4M",
    currentNav: "F125.40",
    yield1y: 18.4,
    minFaix: 500,
    barTrend: [0.4, 0.5, 0.45, 0.55, 0.6, 0.7, 0.8],
  },
  {
    id: "forex-yield",
    name: "Global Forex Yield Index Fund",
    manager: "Pierre Dubois",
    risk: "High Risk",
    category: "Forex",
    netAum: "$24.1M",
    currentNav: "F98.10",
    yield1y: 22.1,
    minFaix: 500,
    barTrend: [0.35, 0.4, 0.5, 0.45, 0.6, 0.65, 0.85],
  },
  {
    id: "sovereign-shield",
    name: "Sovereign Bond Sovereign Shield",
    manager: "Alistair Sterling",
    risk: "Low Risk",
    category: "Mixed Allocation",
    netAum: "$45.0M",
    currentNav: "F105.00",
    yield1y: 6.8,
    minFaix: 500,
    barTrend: [0.4, 0.42, 0.4, 0.45, 0.48, 0.5, 0.55],
  },
  {
    id: "hospitality-syndicate",
    name: "Luxury Hospitality Syndicate",
    manager: "Yuki Tanaka",
    risk: "Moderate",
    category: "Real Estate",
    netAum: "$8.9M",
    currentNav: "F150.20",
    yield1y: 14.2,
    minFaix: 500,
    barTrend: [0.3, 0.4, 0.5, 0.55, 0.5, 0.6, 0.75],
  },
  {
    id: "multi-strategy",
    name: "Metalan Multi-Strategy Liquid Fund",
    manager: "Arjun Mehta",
    risk: "Moderate",
    category: "Mixed Allocation",
    netAum: "$18.5M",
    currentNav: "F112.50",
    yield1y: 15.9,
    minFaix: 500,
    barTrend: [0.35, 0.45, 0.5, 0.5, 0.6, 0.65, 0.78],
  },
  {
    id: "tech-vc",
    name: "Tech token VC Yield Fund",
    manager: "Zack Snyder",
    risk: "High Risk",
    category: "High Yield",
    netAum: "$31.2M",
    currentNav: "F210.40",
    yield1y: 29.4,
    minFaix: 500,
    barTrend: [0.3, 0.35, 0.45, 0.5, 0.65, 0.7, 0.9],
  },
];

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

export default function Funds() {
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
            Same photo-plus-gradient-scrim pattern as Dashboard/Property:
            the abstract data-visualization photo sits behind a dark
            scrim so the heading/copy stay legible regardless of which
            part of the image lands under the text.
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
            {/* Category pills: unlike Property's dropdown filters, this
                page's source design uses a single-select pill row, so
                that's what's reproduced here rather than forcing the
                same dropdown pattern onto a different design. */}
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
                  <FundCard key={fund.id} fund={fund} />
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

            {/* Allocation tip: filled emerald background (not just a
                bordered card, unlike the other sidebar panels) so it
                reads as an editorial callout rather than another data
                widget. */}
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
 * One fund's card: name/manager, a risk badge, the AUM/NAV/yield row,
 * a small decorative trend bar chart, minimum investment, and a CTA.
 *
 * Pure presentation over a single `fund` object — no internal state —
 * so it's easy to reuse elsewhere (e.g. a "my funds" holdings page)
 * without dragging along the grid/filter logic from the parent.
 */
function FundCard({ fund }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Text size="lg" weight="semibold" color="white" className="font-serif leading-snug">
            {fund.name}
          </Text>
          <p className="mt-1 text-xs text-white/40">Managed by {fund.manager}</p>
        </div>

        {/* Risk badge: same styling regardless of risk tier in the
            source design — it's a label, not a severity indicator, so
            resist the temptation to color-code it red/amber/green. */}
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
          <p className="mt-0.5 font-mono text-sm font-semibold text-white">{fund.currentNav}</p>
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
        <button
          type="button"
          className="rounded-lg border px-4 py-2 text-xs font-semibold text-[#e8b46a] transition-colors hover:bg-white/5"
          style={{ borderColor: `${GOLD}99` }}
        >
          VIEW FUND
        </button>
      </div>
    </div>
  );
}

/**
 * Small decorative bar row used as a stand-in for a real performance
 * sparkline. Every bar but the last renders in the muted brand-green;
 * the last one is gold, reading as "current period" against the
 * trailing history — matching the reference design's convention across
 * every fund card regardless of that fund's actual trend.
 *
 * `values` are relative heights from 0–1; this component doesn't fetch
 * or compute anything, so swapping in a real NAV-history series later
 * is a matter of passing different numbers in, not rewriting this.
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