/* pages/dashboard/Dashboard.jsx: application source file. */
import { useEffect, useMemo, useState } from "react";

// lucide-react icons 
import {
  Home,
  TrendingUp,
  ShoppingCart,
  Repeat,
  BarChart3,
  ArrowRight,
} from "lucide-react";

// components
import Navbar from "../../pages/dashboard/Navbar";
import Pagination from "../../components/ui/Pagination";
import heroBg from "../../../public/images/dashboard-hero-bg.png";
import axis3d from "../../../public/images/axis-3d.svg";
import Text from "../../../src/components/ui/Text";

// How many activity rows are shown per page. Pulled out as a constant
// so both the slicing logic and any future "rows per page" UI stay in
// sync with a single number.
const ACTIVITY_PAGE_SIZE = 3;

// Brand colors reused across cards, badges, and the chart below, kept as
// constants so the whole page's palette stays in one place.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// The four primary things a user can do from the dashboard. Each entry
// doubles as: (1) the quick-action card rendered in the grid below, and
// (2) the key into `ACTIVITY_BY_CATEGORY` that filters the "Recent
// Activity" list — clicking a card both selects it and re-filters the
// feed underneath, so `action.id` must match a key in that map.
const ACTIONS = [
  {
    id: "property",
    icon: Home,
    title: "Property Investment",
    description: "Own premium prime real estate fractions starting at F500",
    cta: "Browse Assets",
  },
  {
    id: "funds",
    icon: TrendingUp,
    title: "Fund Investment",
    description: "Diversified luxury forex and property yield indexes",
    cta: "Invest Funds",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-Commerce Portal",
    description: "Exclusive luxury assets and physical asset tokens",
    cta: "Browse Store",
  },
  {
    id: "exchange",
    icon: Repeat,
    title: "Token Exchange",
    description: "Instant swap FAIX with global premier pairs",
    cta: "Exchange FAIX",
  },
];

// Static placeholder activity feed, one list per action category. Swap
// this whole object for an API response (e.g. keyed the same way, by
// action id) once transaction history is wired up to the backend.
const ACTIVITY_BY_CATEGORY = {
  property: [
    {
      id: "p1",
      title: "Property Dividend",
      subtitle: "Yield payout: Marina Bay Residences",
      amount: "+F 450",
      positive: true,
      dot: "#4ADE80",
    },
    {
      id: "p2",
      title: "Investment",
      subtitle: "Fraction buyout: London Penthouse",
      amount: "-F 8,500",
      positive: false,
      dot: GOLD,
    },
    {
      id: "p3",
      title: "Property Dividend",
      subtitle: "Yield payout: Dubai Marina Tower",
      amount: "+F 210",
      positive: true,
      dot: "#4ADE80",
    },
    {
      id: "p4",
      title: "Investment",
      subtitle: "Fraction buyout: Singapore Skyloft",
      amount: "-F 4,200",
      positive: false,
      dot: GOLD,
    },
    {
      id: "p5",
      title: "Property Dividend",
      subtitle: "Yield payout: Zurich Lakeview Suites",
      amount: "+F 315",
      positive: true,
      dot: "#4ADE80",
    },
    {
      id: "p6",
      title: "Investment",
      subtitle: "Fraction buyout: Manhattan Sky Loft",
      amount: "-F 6,750",
      positive: false,
      dot: GOLD,
    },
    {
      id: "p7",
      title: "Property Dividend",
      subtitle: "Yield payout: Tokyo Bay Residences",
      amount: "+F 180",
      positive: true,
      dot: "#4ADE80",
    },
  ],
  funds: [
    {
      id: "f1",
      title: "Wallet Deposit",
      subtitle: "Deposited via bank IMPS transfer",
      amount: "+F 5,000",
      positive: true,
      dot: "#4ADE80",
    },
    {
      id: "f2",
      title: "Fund Investment",
      subtitle: "Allocated to Global Forex Index",
      amount: "-F 3,000",
      positive: false,
      dot: GOLD,
    },
    {
      id: "f3",
      title: "Yield Payout",
      subtitle: "Quarterly return: Prime Yield Fund",
      amount: "+F 620",
      positive: true,
      dot: "#4ADE80",
    },
    {
      id: "f4",
      title: "Fund Investment",
      subtitle: "Allocated to Emerging Markets Basket",
      amount: "-F 1,800",
      positive: false,
      dot: GOLD,
    },
    {
      id: "f5",
      title: "Wallet Deposit",
      subtitle: "Deposited via UPI transfer",
      amount: "+F 2,500",
      positive: true,
      dot: "#4ADE80",
    },
  ],
  ecommerce: [
    {
      id: "e1",
      title: "Store Purchase",
      subtitle: "Bought luxury asset token: Timepiece Vault",
      amount: "-F 2,150",
      positive: false,
      dot: GOLD,
    },
    {
      id: "e2",
      title: "Refund",
      subtitle: "Order cancelled: Coastal Villa Decor",
      amount: "+F 340",
      positive: true,
      dot: "#4ADE80",
    },
  ],
  exchange: [
    {
      id: "x1",
      title: "Token Swap",
      subtitle: "Exchanged FAIX to USDT",
      amount: "-F 1,200",
      positive: false,
      dot: GOLD,
    },
    {
      id: "x2",
      title: "Exchange",
      subtitle: "Bought FAIX via BTC collateral",
      amount: "+F 12,000",
      positive: true,
      dot: "#4ADE80",
    },
  ],
};

// Time ranges for the portfolio growth chart's filter pills.
// NOTE: selecting a range currently only updates the pill's highlighted
// state — see the `range` TODO near `WaveChart` below for what's needed
// to make it actually re-plot different data windows.
const RANGES = ["1W", "1M", "3M", "6M", "1Y", "ALL"];

export default function Dashboard() {
  // Which time window is highlighted under the growth chart.
  const [range, setRange] = useState("1Y");

  // Which quick-action card is highlighted, which also drives which
  // activity list is shown below (see ACTIONS / ACTIVITY_BY_CATEGORY).
  const [selectedAction, setSelectedAction] = useState("funds");

  // 1-indexed page currently shown in the Recent Activity list. Lives
  // here (not inside a separate ActivityList component) because it
  // needs to reset whenever `selectedAction` changes — see the effect
  // below — otherwise switching from "Funds" page 2 to "Property" would
  // land on Property's page 2 instead of starting back at page 1.
  const [activityPage, setActivityPage] = useState(1);

  const activeAction = ACTIONS.find((action) => action.id === selectedAction);
  const activity = ACTIVITY_BY_CATEGORY[selectedAction] || [];

  const totalActivityPages = Math.max(
    1,
    Math.ceil(activity.length / ACTIVITY_PAGE_SIZE)
  );
  const visibleActivity = activity.slice(
    (activityPage - 1) * ACTIVITY_PAGE_SIZE,
    activityPage * ACTIVITY_PAGE_SIZE
  );

  // Whenever the selected action category changes, its activity list is
  // a different length, so jump back to page 1 rather than risk landing
  // on a page number that doesn't exist for the new category.
  useEffect(() => {
    setActivityPage(1);
  }, [selectedAction]);

  return (
    <div className="min-h-screen w-full bg-[#0a0910] pb-16">
      {/* ============================================================
          TOP NAV
      ============================================================ */}
      {/* `user` replaces the old `userInitial` letter-avatar prop — see
          UserProfileMenu, which Navbar should render in its place. Swap
          this static object for the authenticated user's real profile
          once available. */}
      <Navbar
        faixBalance="24,850.00"
        notificationCount={3}
        user={{ name: "Arjun Mehta", email: "arjun@metalanwealth.com", balance: "24,850.00" }}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        {/* ============================================================
            HERO BANNER
            Photo + a left-to-right dark gradient scrim so the white
            welcome text and balance stay legible over whatever image is
            used, regardless of where the busiest part of the photo is.
        ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5">
          <div
            className="h-52 w-full bg-cover bg-center sm:h-64"
            style={{ backgroundImage: `url(${heroBg})` }}
            role="presentation"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,9,16,0.92) 0%, rgba(10,9,16,0.55) 45%, rgba(10,9,16,0.15) 100%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6 sm:px-10">
            <div>
              {/* TODO(user-data): "Arjun" is hardcoded; replace with the
                  authenticated user's display name once available. */}
              <h1 className="font-serif text-3xl text-white sm:text-4xl">
                Welcome back, Arjun
              </h1>
              <p className="mt-2 max-w-md text-sm text-white/60">
                Command center active. All systems tokenized and secured.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-white/10"
                style={{ background: `${ACCENT}66` }}
              >
                <TrendingUp size={18} className="text-[#e8b46a]" />
              </span>
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#e8b46a]">
                  AVAILABLE LIQUID WEALTH
                </p>
                {/* TODO(wallet-api): balance is hardcoded to match the
                    Navbar's `faixBalance` prop; source both from the same
                    wallet-balance query once the API exists. */}
                <p className="mt-1 flex items-baseline gap-2 font-mono text-2xl font-bold text-white sm:text-3xl">
                  F 24,850.00
                  <span className="font-sans text-sm font-normal text-white/40">
                    FAIX
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            ACTIONS + PORTFOLIO PULSE
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ACTIONS.map((action) => {
                const Icon = action.icon;
                const isActive = action.id === selectedAction;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => setSelectedAction(action.id)}
                    aria-pressed={isActive}
                    className={
                      "group rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] " +
                      (isActive
                        ? "border-[#e8b46a]/70 bg-white/[0.03] shadow-[0_0_35px_-10px_rgba(232,180,106,0.45)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]")
                    }
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/10 transition-colors"
                      style={{
                        background: isActive ? `${GOLD}22` : `${ACCENT}55`,
                      }}
                    >
                      <Icon
                        size={17}
                        className={isActive ? "text-[#e8b46a]" : "text-white/70 group-hover:text-white"}
                      />
                    </span>

                    <Text
                      size="lg"
                      weight="semibold"
                      color="white"
                      className="mt-4 font-serif"
                    >
                      {action.title}
                    </Text>
                    <Text
                      size="sm"
                      color="muted"
                      className="mt-2 !text-xs !text-white/45 leading-relaxed"
                    >
                      {action.description}
                    </Text>

                    {/* Each ACTIONS entry defines a `cta` label (e.g.
                        "Browse Assets") that was previously unused. It's
                        surfaced here so every card communicates its next
                        step, and highlighted gold to match the active
                        card's accent when selected. */}
                    <span
                      className={
                        "mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors " +
                        (isActive
                          ? "text-[#e8b46a]"
                          : "text-white/40 group-hover:text-white/70")
                      }
                    >
                      {action.cta}
                      <ArrowRight size={13} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Recent activity: filtered by whichever action card is
                currently selected above. */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-baseline gap-2">
                <Text size="lg" weight="semibold" color="white" className="font-serif">
                  Recent Activity
                </Text>
                {activeAction && (
                  <Text size="sm" color="muted" className="!text-white/40">
                    · {activeAction.title}
                  </Text>
                )}
              </div>

              {activity.length > 0 ? (
                <ul className="mt-4 divide-y divide-white/5">
                  {visibleActivity.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3.5">
                      {/* Small status dot: green for incoming/positive
                          amounts, gold for outgoing/spend, set per-item
                          in ACTIVITY_BY_CATEGORY above. */}
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: item.dot }}
                      />
                      <div className="min-w-0 flex-1">
                        <Text size="sm" weight="medium" color="white" className="truncate">
                          {item.title}
                        </Text>
                        <Text size="sm" color="muted" className="!text-xs !text-white/40 truncate">
                          {item.subtitle}
                        </Text>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <Text
                          size="sm"
                          weight="medium"
                          className={
                            "font-mono " +
                            (item.positive ? "!text-emerald-400" : "!text-white/80")
                          }
                        >
                          {item.amount}
                        </Text>
                        {/* Static "Success" badge — every seeded activity
                            item is a completed transaction. Once real
                            transaction data lands, this should read from
                            an item.status field (pending/failed/success)
                            instead of being hardcoded. */}
                        <Text
                          size="sm"
                          weight="medium"
                          color="muted"
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-1 !text-[10px] !text-white/60"
                        >
                          Success
                        </Text>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text size="sm" color="muted" className="mt-4 py-6 text-center !text-white/40">
                  No recent activity in this category yet.
                </Text>
              )}

              {/* Only worth showing pagination controls once there's
                  more than one page — Pagination itself also guards
                  against this, but skipping the render entirely avoids
                  the top border/spacing appearing for a single-page list. */}
              {activity.length > 0 && (
                <Pagination
                  currentPage={activityPage}
                  totalPages={totalActivityPages}
                  onPageChange={setActivityPage}
                />
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Portfolio pulse: top-line net worth summary, independent
                of whichever action card is selected on the left. */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-[0.15em] text-white/40">
                    TOTAL TOKENIZED VALUE
                  </p>
                  <h2 className="mt-2 font-mono text-2xl font-bold text-white sm:text-3xl">
                    $128,450.00
                  </h2>
                </div>
                <BarChart3 size={26} className="mt-1 text-emerald-400/70" />
              </div>

              <hr className="my-5 border-white/10" />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-black/30 p-3">
                  <p className="text-[11px] text-white/40">FAIX Tokens Held</p>
                  <p className="mt-1 font-mono text-base font-semibold text-white">
                    24,850
                  </p>
                </div>
                <div className="rounded-xl bg-black/30 p-3">
                  <p className="text-[11px] text-white/40">Active Yield Props</p>
                  <p className="mt-1 font-mono text-base font-semibold text-white">
                    3 Premium
                  </p>
                </div>
              </div>
            </div>

            {/* Portfolio growth / 3D wave */}
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-serif text-base text-white">
                  <img src={axis3d} alt="" className="h-4 w-4" />
                  Portfolio Growth · 3D Wave
                </h2>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>

              <div className="relative mt-4 h-44 overflow-hidden rounded-xl">
                {/* `range` is passed through so the chart has access to
                    the selected window; it isn't used to change the
                    plotted curve yet.
                    TODO(chart-data): once historical balances are
                    available per range, fetch/select the matching series
                    here instead of always drawing the same static wave. */}
                <WaveChart range={range} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    aria-pressed={range === r}
                    className={
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
                      (range === r
                        ? "bg-[#e8b46a] text-[#241608]"
                        : "bg-white/5 text-white/50 hover:bg-white/10")
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Decorative "3D wave" visualization behind the portfolio growth card.
 *
 * Renders a smooth trend line plus a scattered field of small dots whose
 * vertical position and opacity fake a sense of depth/motion. The dot
 * layout is randomized once per mount via `useMemo` (not recomputed on
 * every render) so the pattern doesn't visibly jitter/reshuffle every
 * time unrelated dashboard state changes (e.g. switching action cards)
 * causes this component to re-render.
 *
 * `range` is accepted so a future real-data version can key the memo on
 * it and redraw for the selected time window; it's currently unused.
 */
function WaveChart({ range }) {
  const dots = useMemo(() => {
    const generated = [];
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 10; j++) {
        const x = 20 + i * 24;
        const baseY = 90 - Math.sin((i / 25) * Math.PI * 1.3) * 45 - Math.cos(j * 0.8) * 6;
        const y = baseY + j * 2.5;
        const opacity = 0.15 + (j / 10) * 0.5 + Math.random() * 0.15;
        generated.push(
          <circle key={`${i}-${j}`} cx={x} cy={y} r="1.1" fill="#e8b46a" opacity={opacity} />
        );
      }
    }
    return generated;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally
    // stable: dots should only reshuffle when `range` changes, once the
    // chart actually has per-range data to plot.
  }, [range]);

  return (
    <svg viewBox="0 0 660 180" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <radialGradient id="waveBg" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#0f2d26" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="660" height="180" fill="url(#waveBg)" />

      <path
        d="M20 150 L640 150"
        stroke="#e8b46a"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      <path
        d="M20 95 C 140 40, 220 150, 340 70 S 560 30, 640 95"
        fill="none"
        stroke="#e8b46a"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />

      {dots}

      <text x="500" y="45" fill="#ffffff" fontSize="13" fontWeight="600">
        $128K
      </text>
      <text x="565" y="45" fill="#4ADE80" fontSize="11">
        +12.4%
      </text>
    </svg>
  );
}