/* pages/dashboard/funds/Funddetails.jsx: application source file. Single-fund detail + investment page. */
import { useMemo, useState } from "react";

// React Router
import { useParams, Link } from "react-router-dom";

// UI components
import Navbar from "../../../layouts/DashboardNavbar";
import Text from "../../../components/ui/Text";

// Data & constants
import { ROUTES } from "../../../constants/routes";
import { getFundBySlug } from "../../../data/funds";

// Shared brand colors — same values used across every other page so
// this one's palette stays identical rather than drifting in isolation.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// Time windows for the historical NAV chart's tab row. Purely a display
// toggle for now — see NavAppreciationChart's note on why it doesn't
// redraw per range yet.
const RANGES = ["1M", "3M", "6M", "1Y", "3Y", "ALL"];

/**
 * Detail + investment page for a single fund, reached by clicking
 * "View Fund" on the Funds marketplace grid (see fundDetailPath() in
 * Funds.jsx) at a URL like `/dashboard/funds/re-growth`.
 *
 * The fund is looked up here — via `useParams()` + `getFundBySlug()` —
 * rather than passed in as a prop, so this page works from a real
 * route/back-button/bookmark, not just when rendered directly by a
 * parent that happens to already have the fund object in hand.
 */
export default function FundDetails() {
  const { slug } = useParams();
  const fund = getFundBySlug(slug);

  // No matching fund for this slug (bad/old link, typo'd URL, etc.) —
  // show a real "not found" state with a way back, instead of either
  // crashing on `fund.name` below or silently rendering a wrong fund.
  if (!fund) {
    return (
      <div className="min-h-screen w-full bg-[#0E1211] pb-16">
        <Navbar
          faixBalance="24,850.00"
          notificationCount={3}
          user={{ name: "Arjun Mehta", email: "arjun@metalanwealth.com", balance: "24,850.00" }}
        />
        <main className="mx-auto max-w-2xl px-4 pt-16 text-center sm:px-6">
          <Text size="lg" weight="semibold" color="white" className="font-serif">
            Fund not found
          </Text>
          <Text size="sm" color="muted" className="mt-2 !text-white/40">
            "{slug}" doesn't match any fund we currently offer.
          </Text>
          <Link
            to={ROUTES.DASHBOARD_FUNDS || "/dashboard/funds"}
            className="mt-5 inline-block rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:border-white/30 hover:bg-white/5"
          >
            Back to Funds
          </Link>
        </main>
      </div>
    );
  }

  return <FundDetailsContent fund={fund} />;
}

/**
 * Split from the default export so the "fund not found" branch above
 * can return early without this component's hooks (useState for range
 * and commitment capital) ever needing to run for a fund that doesn't
 * exist — keeps the hooks unconditional, which React requires.
 */
function FundDetailsContent({ fund }) {
  const [range, setRange] = useState("1Y");

  // Starts at a suggested default commitment (matching the reference
  // design's F 10,000) rather than 0, so the estimate fields have
  // something meaningful to show before the user types anything.
  const [commitmentCapital, setCommitmentCapital] = useState(10000);

  const estimatedUnits = useMemo(() => {
    if (!commitmentCapital || !fund.currentNav) return 0;
    return commitmentCapital / fund.currentNav;
  }, [commitmentCapital, fund.currentNav]);

  const estimatedAppreciation = useMemo(
    () => (commitmentCapital || 0) * (fund.yield1y / 100),
    [commitmentCapital, fund.yield1y]
  );

  return (
    <div className="min-h-screen w-full bg-[#0E1211] pb-16">
      <Navbar
        faixBalance="24,850.00"
        notificationCount={3}
        user={{ name: "Arjun Mehta", email: "arjun@metalanwealth.com", balance: "24,850.00" }}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        {/* ============================================================
            HEADER: badges, title, principal, current NAV
        ============================================================ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap gap-2">
                {fund.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className="rounded-md border px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em]"
                    style={
                      badge.tone === "gold"
                        ? { borderColor: `${GOLD}80`, color: GOLD }
                        : { borderColor: "rgba(52,211,153,0.5)", color: "#6ee7b7" }
                    }
                  >
                    {badge.label.toUpperCase()}
                  </span>
                ))}
              </div>

              <h1 className="mt-3 font-serif text-2xl text-white sm:text-3xl">{fund.name}</h1>

              <div className="mt-3 flex items-center gap-2.5">
                <span
                  className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-cover bg-center ring-1 ring-white/10"
                  style={
                    fund.principalAvatar
                      ? { backgroundImage: `url(${fund.principalAvatar})` }
                      : { background: `${ACCENT}88` }
                  }
                  role="img"
                  aria-label={fund.manager}
                />
                <p className="text-sm text-white/50">
                  Fund Principal: {fund.manager} — {fund.principalTitle}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[11px] tracking-[0.2em] text-white/40">CURRENT FUND NAV</p>
              <p className="mt-1 font-mono text-3xl font-bold sm:text-4xl" style={{ color: GOLD }}>
                F {fund.currentNav.toFixed(2)}{" "}
                <span className="text-lg font-normal text-white/40">FAIX</span>
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            MAIN GRID: chart + stats + allocation | invest + commentary
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Historical NAV chart */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Text size="lg" weight="semibold" color="white" className="font-serif">
                  Historical NAV Appreciation Map
                </Text>

                <div className="flex gap-1 rounded-lg bg-black/30 p-1">
                  {RANGES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      aria-pressed={range === r}
                      className={
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors " +
                        (range === r
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "text-white/40 hover:text-white/70")
                      }
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mt-4 h-52 overflow-hidden rounded-xl">
                <NavAppreciationChart range={range} />
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatBox label="NET AUM" value={fund.netAum} />
              <StatBox label="1Y APPRECIATION" value={`+${fund.yield1y}% YTD`} tone="positive" />
              <StatBox
                label="3Y RETURN"
                value={`+${fund.return3yPercent}% Cumulative`}
                tone="positive"
              />
              <StatBox label="EXPENSE RATIO" value={`${fund.expenseRatioPercent}% per annum`} />
            </div>

            {/* Allocation breakdown */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Fund Assets Under Management Allocation
              </Text>

              <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
                <AllocationDonut allocation={fund.allocation} />

                <ul className="w-full flex-1 divide-y divide-white/5">
                  {fund.allocation.map((item) => (
                    <li key={item.label} className="flex items-center gap-3 py-2.5 text-sm">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="flex-1 text-white/60">{item.label}</span>
                      <span className="font-semibold text-white">{item.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Invest panel */}
            <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: `${GOLD}80` }}>
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Invest in this Fund
              </Text>
              <hr className="my-4 border-white/10" />

              <label className="block">
                <span className="text-[11px] tracking-[0.15em] text-white/40">
                  COMMITMENT CAPITAL
                </span>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="flex items-center gap-2 font-mono text-lg font-semibold text-white">
                    <span style={{ color: GOLD }}>F</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={commitmentCapital}
                      onChange={(event) =>
                        setCommitmentCapital(Math.max(0, Number(event.target.value) || 0))
                      }
                      className="w-32 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </span>
                  <span className="text-xs text-white/40">FAIX</span>
                </div>
              </label>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Estimated Fund Units Purchase</span>
                  <span className="font-mono font-semibold text-white">
                    {estimatedUnits.toFixed(2)} UNITS
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40">Estimated 1Y Appreciation</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    +F{" "}
                    {estimatedAppreciation.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}{" "}
                    FAIX
                  </span>
                </div>
              </div>

              {/* TODO(invest-api): wire this to a real deposit/commit
                  endpoint; it currently has no onClick behavior. */}
              <button
                type="button"
                className="mt-5 w-full rounded-xl py-3.5 text-sm font-extrabold tracking-wide text-[#241608] shadow-[0_15px_35px_-10px_rgba(184,115,51,0.7)] transition-all hover:brightness-105"
                style={{ background: `linear-gradient(90deg, #f2c380, ${GOLD}, #d9822f)` }}
              >
                CONFIRM ASSET DEPOSIT
              </button>
            </div>

            {/* Manager commentary */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Manager's Commentary
              </Text>
              <p className="mt-3 text-sm italic leading-relaxed text-white/50">
                &ldquo;{fund.managerCommentary}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** One of the four small metric tiles under the NAV chart. */
function StatBox({ label, value, tone = "default" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[10px] tracking-[0.1em] text-white/40">{label}</p>
      <p
        className={
          "mt-1.5 text-sm font-semibold sm:text-base " +
          (tone === "positive" ? "text-emerald-400" : "text-white")
        }
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Proportional donut chart for the AUM allocation breakdown, built from
 * plain SVG `<circle>` stroke-dasharray segments rather than a charting
 * library — a handful of segments is simple enough that pulling in a
 * dependency (e.g. recharts) for one static donut isn't worth it.
 */
function AllocationDonut({ allocation }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-32 w-32 shrink-0 -rotate-90"
      role="img"
      aria-label="Asset allocation breakdown"
    >
      <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      {allocation.map((item) => {
        const segmentLength = (item.percent / 100) * circumference;
        const circle = (
          <circle
            key={item.label}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={item.color}
            strokeWidth="10"
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offsetSoFar}
            strokeLinecap="butt"
          />
        );
        offsetSoFar += segmentLength;
        return circle;
      })}
    </svg>
  );
}

/**
 * Decorative wireframe "terrain" chart standing in for a real NAV
 * history plot. `range` changes which tab is highlighted above it but
 * doesn't redraw the mesh yet — wire it to real per-range NAV history
 * once that data exists, keyed off this prop.
 */
function NavAppreciationChart({ range }) {
  const ridgeLines = [
    { d: "M0 150 C 80 130, 160 160, 240 140 S 400 120, 480 145 S 640 100, 720 130 S 860 90, 940 120", color: ACCENT, opacity: 0.35 },
    { d: "M0 145 C 90 120, 170 150, 250 125 S 410 105, 490 135 S 650 85, 730 115 S 870 70, 950 105", color: ACCENT, opacity: 0.5 },
    { d: "M0 138 C 100 110, 180 140, 260 110 S 420 90, 500 122 S 660 65, 740 100 S 880 45, 960 88", color: "#2f6f5e", opacity: 0.65 },
    { d: "M0 130 C 110 100, 190 128, 270 95 S 430 72, 510 108 S 670 40, 750 82 S 890 20, 970 68", color: GOLD, opacity: 0.85 },
  ];

  return (
    <svg viewBox="0 0 980 200" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="navChartBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f1f1b" />
          <stop offset="100%" stopColor="#050506" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="980" height="200" fill="url(#navChartBg)" />

      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1={i * 75} y1="0" x2={i * 75} y2="200" stroke="#ffffff" strokeOpacity="0.03" />
      ))}

      {ridgeLines.map((ridge, index) => (
        <path
          key={index}
          d={ridge.d}
          fill="none"
          stroke={ridge.color}
          strokeOpacity={ridge.opacity}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
