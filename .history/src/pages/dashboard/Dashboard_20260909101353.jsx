/* pages/dashboard/Dashboard.jsx: application source file. */
import { useEffect, useMemo, useRef, useState } from "react";
import dashboardHero from "../../../public/images/dashboard-hero-bg.png";
// lucide-react icons
import {
  Search,
  Bell,
  Download,
  Home as HomeIcon,
  TrendingUp,
  Wallet,
  CreditCard,
  Activity,
  Link2,
  ArrowRight,
  ChevronDown,
  Building2,
  Waves,
  TreePine,
  Landmark,
  ShieldCheck,
  Zap,
  BarChart3,
  Star,
  Crown,
  Target,
} from "lucide-react";

// components
import Navbar from "../../layouts/DashboardNavbar";
import Pagination from "../../components/ui/Pagination";
import Text from "../../../src/components/ui/Text";

// Brand colors reused across cards, badges, and the chart below, kept as
// constants so the whole page's palette stays in one place.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";
const POSITIVE = "#4ADE80";
const NEGATIVE = "#F87171";

// Shared hover treatment for the page's top-level cards: a gentle lift
// plus a soft gold-tinted shadow, so hovering any card gives the same
// tactile feedback instead of each one inventing its own effect.
const CARD_HOVER =
  "transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_32px_-14px_rgba(232,180,106,0.35)]";

// How many transaction rows are shown per page.
const TRANSACTIONS_PAGE_SIZE = 8;

// ============================================================
// STATIC PLACEHOLDER DATA
// Swap each of these for the matching API response once the
// corresponding backend endpoints exist; every shape below is a
// stand-in for what that response should look like.
// ============================================================

const HERO_STATS = [
  { id: "properties", icon: HomeIcon, count: "8", label: "Properties", value: "F 168,450" },
  { id: "funds", icon: TrendingUp, count: "12", label: "Funds Joined", value: "F 395,500" },
];

const METRICS = [
  {
    id: "total",
    icon: Wallet,
    iconBg: `${ACCENT}80`,
    iconColor: "#6EE7B7",
    label: "Total Amount",
    value: "F 2,45,800",
    change: "+18.5%",
    positive: true,
    sub: "Total portfolio value",
  },
  {
    id: "used",
    icon: CreditCard,
    iconBg: `${ACCENT}80`,
    iconColor: "#6EE7B7",
    label: "Used Amount",
    value: "F 1,17,350",
    change: "47.7%",
    positive: true,
    sub: "Currently invested share",
  },
  {
    id: "profit",
    icon: TrendingUp,
    iconBg: `${ACCENT}80`,
    iconColor: "#6EE7B7",
    label: "Total Profit Amount",
    value: "F 48,250",
    change: "+22.4%",
    positive: true,
    sub: "Net earnings this year",
  },
  {
    id: "growth",
    icon: Activity,
    iconBg: "rgba(248,113,113,0.16)",
    iconColor: "#f2a65a",
    label: "Monthly Growth",
    value: "12.8%",
    change: "+4.6%",
    positive: true,
    sub: "vs 8.2% last month",
  },
];

// Chart series: one point per month. `primary` is the account's actual
// tokenized value; `baseline` is a comparison series (e.g. a market
// index) the chart plots underneath it as a dotted reference line.
const CHART_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_DATA = [
  { primary: 18000, baseline: 20000 },
  { primary: 32000, baseline: 24000 },
  { primary: 25000, baseline: 35000 },
  { primary: 78000, baseline: 42000 },
  { primary: 65000, baseline: 58000 },
  { primary: 120000, baseline: 72000 },
  { primary: 95000, baseline: 88000 },
  { primary: 245800, baseline: 96000 },
  { primary: 205000, baseline: 122000 },
  { primary: 215000, baseline: 152000 },
  { primary: 198000, baseline: 168000 },
  { primary: 210000, baseline: 182000 },
];
const CHART_MAX = 250000;
const CHART_HIGHLIGHT_INDEX = 7; // Aug — matches the "Total Revenue" figure below.

// Amplitude (in F units) of the idle "breathing" wave animation applied
// to the primary line when the user isn't actively hovering/tapping.
const WAVE_AMPLITUDE = 4200;
// Radians/ms — controls how fast the wave oscillates.
const WAVE_SPEED = 0.0016;

const CHART_RANGE_OPTIONS = ["Last 12 Months", "Last 6 Months", "Last 3 Months", "This Year"];
const CHART_GRANULARITIES = ["Daily", "Weekly", "Monthly", "Yearly"];

const CHART_SUMMARY = [
  { id: "revenue", icon: Wallet, label: "Total Revenue", value: "F 245,800", note: "+18.5% vs last year", positive: true },
  { id: "growth", icon: TrendingUp, label: "Overall Growth", value: "+18.5%", note: "Annualized return rate", positive: true },
  { id: "avg", icon: Target, label: "Avg Investment", value: "F 12,500", note: "Per asset position", positive: null },
  { id: "peak", icon: Star, label: "Peak Value", value: "F 128,450", note: "Aug 2025 record high", positive: null },
];

const TOP_PROPERTIES = [
  { id: "pr1", name: "London Penthouse", location: "Prime Central", icon: Building2, iconBg: "#8a6d3b", value: "F 45,000", change: "+12.4%" },
  { id: "pr2", name: "Dubai Marina Villa", location: "Waterfront", icon: Waves, iconBg: "#1f7a72", value: "F 38,500", change: "+8.7%" },
  { id: "pr3", name: "Singapore Condo", location: "Orchard", icon: TreePine, iconBg: "#2f8f5b", value: "F 32,000", change: "+5.2%" },
  { id: "pr4", name: "Tokyo Apartment", location: "Shibuya", icon: Building2, iconBg: "#6d4fc2", value: "F 28,750", change: "+3.8%" },
  { id: "pr5", name: "Paris Loft", location: "Le Marais", icon: Landmark, iconBg: "#b3435a", value: "F 24,200", change: "+2.1%" },
];

const TOP_FUNDS = [
  { id: "fd1", name: "Metalan Growth Fund", tag: "Growth", tagColor: "#e8b46a", icon: TrendingUp, iconBg: "#4a3a1f", value: "F 125,000", change: "+15.3%" },
  { id: "fd2", name: "Real Estate Index", tag: "Index", tagColor: "#7aa7e8", icon: BarChart3, iconBg: "#1f3a5c", value: "F 98,500", change: "+11.2%" },
  { id: "fd3", name: "Crypto Balanced", tag: "Balanced", tagColor: "#4ADE80", icon: Activity, iconBg: "#1f4a33", value: "F 76,200", change: "+22.8%" },
  { id: "fd4", name: "Stable Yield", tag: "Fixed", tagColor: "#b8b8c2", icon: ShieldCheck, iconBg: "#33333d", value: "F 54,000", change: "+6.5%" },
  { id: "fd5", name: "Commodity Tracker", tag: "Commodity", tagColor: "#f0925a", icon: Zap, iconBg: "#4a2f1f", value: "F 41,800", change: "+9.1%" },
];

const TOP_INVESTORS = [
  { id: "iv1", rank: 1, initials: "AP", avatarBg: "#e8b46a", name: "Arjun Patel", meta: "Since Jan 2024", detail: "8 Properties · 12 Funds · 5 Tokens", change: "+18.5% this month", positive: true, value: "F 128,450", isLeader: true },
  { id: "iv2", rank: 2, initials: "SC", avatarBg: "#2f8f7a", name: "Sarah Chen", meta: "Member since Mar 2023", change: "+12.3%", positive: true, value: "F 115,200" },
  { id: "iv3", rank: 3, initials: "MW", avatarBg: "#6d5fc2", name: "Marcus Webb", meta: "Member since Jun 2023", change: "-2.1%", positive: false, value: "F 98,750" },
  { id: "iv4", rank: 4, initials: "PS", avatarBg: "#c25f8f", name: "Priya Sharma", meta: "Member since Sep 2023", change: "+7.8%", positive: true, value: "F 87,300" },
  { id: "iv5", rank: 5, initials: "DK", avatarBg: "#4a7fc2", name: "David Kim", meta: "Member since Nov 2023", change: "+5.2%", positive: true, value: "F 72,500" },
];

const TRANSACTION_TYPE_STYLES = {
  Buy: { bg: "rgba(74,222,128,0.12)", color: "#4ADE80" },
  Sell: { bg: "rgba(248,113,113,0.12)", color: "#F87171" },
  Swap: { bg: "rgba(122,167,232,0.14)", color: "#7aa7e8" },
  Dividend: { bg: "rgba(167,139,250,0.14)", color: "#a78bfa" },
  Deposit: { bg: "rgba(103,232,249,0.14)", color: "#67e8f9" },
  Stake: { bg: "rgba(240,146,90,0.14)", color: "#f0925a" },
};

const STATUS_STYLES = {
  Completed: "#4ADE80",
  Processing: "#7aa7e8",
  Pending: "#f2c94c",
};

const TRANSACTIONS = [
  { id: 1, date: "Jan 15, 2025", type: "Buy", asset: "FAIX", amount: "5,000", price: "F 1.00", total: "F 5,000", status: "Completed" },
  { id: 2, date: "Jan 14, 2025", type: "Sell", asset: "BTC", amount: "0.5", price: "F 42,850", total: "F 21,425", status: "Completed" },
  { id: 3, date: "Jan 14, 2025", type: "Swap", asset: "ETH→FAIX", amount: "2.0", price: "F 2,250", total: "F 4,500", status: "Completed" },
  { id: 4, date: "Jan 13, 2025", type: "Dividend", asset: "MBR", amount: "-", price: "F 450", total: "F 450", status: "Completed" },
  { id: 5, date: "Jan 13, 2025", type: "Deposit", asset: "FAIX", amount: "10,000", price: "F 1.00", total: "F 10,000", status: "Processing" },
  { id: 6, date: "Jan 12, 2025", type: "Buy", asset: "SOL", amount: "50", price: "F 98.40", total: "F 4,920", status: "Completed" },
  { id: 7, date: "Jan 12, 2025", type: "Stake", asset: "FAIX", amount: "8,000", price: "F 1.00", total: "F 8,000", status: "Pending" },
  { id: 8, date: "Jan 11, 2025", type: "Buy", asset: "ETH", amount: "1.5", price: "F 2,250", total: "F 3,375", status: "Completed" },
];
const TOTAL_TRANSACTIONS = 156;

/**
 * Builds a CSV string from a list of transaction rows and triggers a
 * browser download. Kept outside the component so it has no dependency
 * on render state — just pass it the rows you want exported.
 */
function downloadTransactionsCsv(rows) {
  if (!rows.length) return;

  const headers = ["#", "Date", "Type", "Asset", "Amount", "Price", "Total", "Status"];
  const escapeCell = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const lines = [
    headers.join(","),
    ...rows.map((tx, index) =>
      [index + 1, tx.date, tx.type, tx.asset, tx.amount, tx.price, tx.total, tx.status]
        .map(escapeCell)
        .join(",")
    ),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `transactions-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  // Which time window is highlighted on the portfolio growth chart.
  const [chartGranularity, setChartGranularity] = useState("Monthly");
  const [chartRange, setChartRange] = useState("Last 12 Months");
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false);

  // Pagination for the transaction history table. The 8 rows above are
  // page 1's placeholder data; wire this up to a real fetch keyed on
  // `transactionsPage` once the transactions API exists.
  const [transactionsPage, setTransactionsPage] = useState(1);

  // Live search over the currently-loaded transaction rows. Once the
  // transactions API exists, swap this for a server-side query keyed on
  // `searchTerm` + `transactionsPage` instead of filtering client-side.
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return TRANSACTIONS;
    return TRANSACTIONS.filter((tx) =>
      [tx.date, tx.type, tx.asset, tx.amount, tx.price, tx.total, tx.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm]);

  const totalTransactionPages = searchTerm.trim()
    ? Math.max(1, Math.ceil(filteredTransactions.length / TRANSACTIONS_PAGE_SIZE))
    : Math.ceil(TOTAL_TRANSACTIONS / TRANSACTIONS_PAGE_SIZE);

  const totalTransactionsForDisplay = searchTerm.trim() ? filteredTransactions.length : TOTAL_TRANSACTIONS;

  const handleExport = () => downloadTransactionsCsv(filteredTransactions);

  return (
    <div className="min-h-screen w-full bg-[#0a0910] pb-16">
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
            HERO: LIVE PORTFOLIO SUMMARY
        ============================================================ */}
        <div className={"mt-6 rounded-3xl border border-[#e8b46a]/20 bg-gradient-to-br from-[#171018] to-[#0d0c12] p-6 sm:p-8 " + CARD_HOVER}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:max-w-md">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                LIVE PORTFOLIO
              </span>

              {/* TODO(user-data): "Arjun" is hardcoded; replace with the
                  authenticated user's display name once available. */}
              <h2 className="mt-3 font-serif text-3xl text-white">Welcome back, Arjun</h2>
              <p className="mt-2 text-sm text-white/50">
                Your portfolio is performing well today. Check updated fractional reserves below.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ring-white/10"
                  style={{ background: `${ACCENT}66` }}
                >
                  <Link2 size={18} className="text-[#e8b46a]" />
                </span>
                <div>
                  <p className="text-[11px] tracking-[0.15em] text-[#e8b46a]">AVAILABLE BALANCE</p>
                  {/* TODO(wallet-api): source from the same wallet-balance
                      query used everywhere else on the page. */}
                  <p className="mt-1 flex items-baseline gap-2 font-mono text-2xl font-bold text-white">
                    F 24,850.00
                    <span className="font-sans text-sm font-normal text-white/40">FAIX</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-[420px]">
              {HERO_STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className={"rounded-2xl border border-white/10 bg-black/20 p-5 " + CARD_HOVER}>
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/10"
                      style={{ background: `${ACCENT}66` }}
                    >
                      <Icon size={18} className="text-[#e8b46a]" />
                    </span>
                    <p className="mt-4 font-mono text-2xl font-bold text-white">{stat.count}</p>
                    <p className="mt-1 text-xs text-white/40">{stat.label}</p>
                    <p className="mt-1 font-mono text-sm text-white/60">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            HEADLINE METRICS
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        {/* ============================================================
            PORTFOLIO GROWTH CHART
        ============================================================ */}
        <div className={"mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 " + CARD_HOVER}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Text size="lg" weight="semibold" color="white" className="font-serif">
                  Portfolio Growth
                </Text>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  LIVE
                </span>
              </div>
              <Text size="sm" color="muted" className="mt-1 !text-white/40">
                Showing assets development comparing to baseline
              </Text>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Range dropdown. Selecting an option currently only
                  updates the label — wire this to a real per-range fetch
                  once historical balances are available. */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRangeMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/70 hover:border-white/20"
                >
                  {chartRange}
                  <ChevronDown size={13} />
                </button>
                {rangeMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#15121a] shadow-xl">
                    {CHART_RANGE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setChartRange(option);
                          setRangeMenuOpen(false);
                        }}
                        className="block w-full px-3 py-2 text-left text-xs text-white/70 hover:bg-white/5 hover:text-white"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 rounded-full bg-white/5 p-1">
                {CHART_GRANULARITIES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setChartGranularity(g)}
                    aria-pressed={chartGranularity === g}
                    className={
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
                      (chartGranularity === g
                        ? "bg-[#e8b46a] text-[#241608]"
                        : "text-white/50 hover:text-white/80")
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <PortfolioChart />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CHART_SUMMARY.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={"rounded-xl border border-white/10 bg-black/20 p-4 " + CARD_HOVER}>
                  <div className="flex items-center gap-2 text-white/40">
                    <Icon size={13} />
                    <span className="text-[11px] tracking-[0.1em]">{item.label.toUpperCase()}</span>
                  </div>
                  <p className="mt-2 font-mono text-lg font-bold text-white">{item.value}</p>
                  <p
                    className="mt-1 text-xs"
                    style={{ color: item.positive === false ? NEGATIVE : item.positive ? POSITIVE : "rgba(255,255,255,0.4)" }}
                  >
                    {item.positive && "▲ "}
                    {item.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            TOP PROPERTIES + TOP FUNDS
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={"rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 " + CARD_HOVER}>
            <div className="flex items-center justify-between">
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Top Properties
              </Text>
              <a href="#" className="flex items-center gap-1 text-xs font-semibold text-[#e8b46a] hover:opacity-80">
                View All <ArrowRight size={13} />
              </a>
            </div>

            <ul className="mt-4 divide-y divide-white/5">
              {TOP_PROPERTIES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="flex items-center gap-3 py-3.5">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                      style={{ background: `${GOLD}22`, color: GOLD }}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: item.iconBg }}
                    >
                      <Icon size={17} className="text-white" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Text size="sm" weight="medium" color="white" className="truncate">
                        {item.name}
                      </Text>
                      <Text size="sm" color="muted" className="!text-xs !text-white/40 truncate">
                        {item.location}
                      </Text>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-semibold text-white">{item.value}</p>
                      <p className="mt-0.5 text-xs font-medium" style={{ color: POSITIVE }}>
                        {item.change}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={"rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 " + CARD_HOVER}>
            <div className="flex items-center justify-between">
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Top Funds
              </Text>
              <a href="#" className="flex items-center gap-1 text-xs font-semibold text-[#e8b46a] hover:opacity-80">
                View All <ArrowRight size={13} />
              </a>
            </div>

            <ul className="mt-4 divide-y divide-white/5">
              {TOP_FUNDS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="flex items-center gap-3 py-3.5">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: item.iconBg }}
                    >
                      <Icon size={17} style={{ color: item.tagColor }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Text size="sm" weight="medium" color="white" className="truncate">
                        {item.name}
                      </Text>
                      <span
                        className="mt-1 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                        style={{ background: `${item.tagColor}22`, color: item.tagColor }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-semibold text-white">{item.value}</p>
                      <p className="mt-0.5 text-xs font-medium" style={{ color: POSITIVE }}>
                        {item.change}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* ============================================================
            TOP INVESTORS LEADERBOARD
        ============================================================ */}
        <div className={"mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 " + CARD_HOVER}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Top Investors
              </Text>
              <Text size="sm" color="muted" className="mt-1 !text-white/40">
                Portfolio leaderboard - this month
              </Text>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/70 hover:border-white/20"
            >
              This Month <ChevronDown size={13} />
            </button>
          </div>

          <ul className="mt-4 divide-y divide-white/5">
            {TOP_INVESTORS.map((investor) => (
              <li
                key={investor.id}
                className={
                  "flex items-center gap-4 rounded-xl px-3 py-4 transition-colors duration-150 " +
                  (investor.isLeader
                    ? "border border-[#e8b46a]/30 bg-[#e8b46a]/[0.06] hover:bg-[#e8b46a]/[0.1]"
                    : "hover:bg-white/[0.04]")
                }
              >
                <span className="flex w-5 shrink-0 items-center justify-center text-sm font-semibold text-white/40">
                  {investor.isLeader ? <Crown size={16} className="text-[#e8b46a]" /> : investor.rank}
                </span>
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ background: investor.avatarBg }}
                >
                  {investor.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <Text size="sm" weight="semibold" color="white" className="truncate">
                    {investor.name}
                  </Text>
                  <Text size="sm" color="muted" className="!text-xs !text-white/40 truncate">
                    {investor.meta}
                    {investor.detail ? ` · ${investor.detail}` : ""}
                  </Text>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  style={{
                    background: investor.positive ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
                    color: investor.positive ? POSITIVE : NEGATIVE,
                  }}
                >
                  {investor.change}
                </span>
                <p className="w-28 shrink-0 text-right font-mono text-sm font-semibold text-white">
                  {investor.value}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-white/40">Showing top 5 of 2,400+ investors</span>
            <a href="#" className="flex items-center gap-1 font-semibold text-[#e8b46a] hover:opacity-80">
              View Full Leaderboard <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* ============================================================
            TRANSACTION HISTORY
        ============================================================ */}
        <div className={"mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 " + CARD_HOVER}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Text size="lg" weight="semibold" color="white" className="font-serif">
                Transaction History
              </Text>
              <Text size="sm" color="muted" className="mt-1 !text-xs !text-white/40 tracking-[0.1em]">
                ALL TIME · {TOTAL_TRANSACTIONS} RECORDS
              </Text>
            </div>

            {/* Filter button removed. Search now actually filters the
                visible rows, and Export downloads whatever is currently
                filtered as a CSV file. */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setTransactionsPage(1);
                  }}
                  placeholder="Search transactions..."
                  className="w-52 rounded-full border border-white/10 bg-black/20 py-2 pl-9 pr-3 text-xs text-white/70 placeholder:text-white/30 focus:border-[#e8b46a]/50 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={filteredTransactions.length === 0}
                className="flex items-center gap-2 rounded-full bg-[#e8b46a] px-4 py-2 text-xs font-semibold text-[#241608] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={13} />
                Export
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="text-[11px] tracking-[0.1em] text-white/40">
                  <th className="pb-3 pr-3 font-medium">#</th>
                  <th className="pb-3 pr-3 font-medium">DATE</th>
                  <th className="pb-3 pr-3 font-medium">TYPE</th>
                  <th className="pb-3 pr-3 font-medium">ASSET</th>
                  <th className="pb-3 pr-3 font-medium">AMOUNT</th>
                  <th className="pb-3 pr-3 font-medium">PRICE</th>
                  <th className="pb-3 pr-3 font-medium">TOTAL</th>
                  <th className="pb-3 font-medium">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-sm text-white/40">
                      No transactions match "{searchTerm}".
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, index) => {
                    const typeStyle = TRANSACTION_TYPE_STYLES[tx.type];
                    const statusColor = STATUS_STYLES[tx.status];
                    return (
                      <tr key={tx.id} className="text-sm transition-colors duration-150 hover:bg-white/[0.04]">
                        <td className="py-3.5 pr-3 text-white/30">{String(index + 1).padStart(2, "0")}</td>
                        <td className="py-3.5 pr-3 text-white/70">{tx.date}</td>
                        <td className="py-3.5 pr-3">
                          <span
                            className="rounded-md px-2 py-1 text-[11px] font-semibold"
                            style={{ background: typeStyle.bg, color: typeStyle.color }}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3.5 pr-3 font-mono text-white/80">{tx.asset}</td>
                        <td className="py-3.5 pr-3 font-mono text-white/60">{tx.amount}</td>
                        <td className="py-3.5 pr-3 font-mono text-white/60">{tx.price}</td>
                        <td className="py-3.5 pr-3 font-mono font-semibold text-white">{tx.total}</td>
                        <td className="py-3.5">
                          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: statusColor }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} />
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-white/40">
              Showing {totalTransactionsForDisplay === 0 ? 0 : (transactionsPage - 1) * TRANSACTIONS_PAGE_SIZE + 1}-
              {Math.min(transactionsPage * TRANSACTIONS_PAGE_SIZE, totalTransactionsForDisplay)} of{" "}
              {totalTransactionsForDisplay} transactions
            </span>
            <Pagination
              currentPage={transactionsPage}
              totalPages={totalTransactionPages}
              onPageChange={setTransactionsPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * One headline metric card (Total Amount, Used Amount, etc). Pulled out
 * of the main render so the METRICS array above is the single source of
 * truth for both the copy and the layout.
 */
function MetricCard({ metric }) {
  const Icon = metric.icon;
  return (
    <div className={"rounded-2xl border border-white/10 bg-white/[0.02] p-5 " + CARD_HOVER}>
      <div className="flex items-start justify-between">
        <p className="text-[11px] tracking-[0.15em] text-white/40">{metric.label.toUpperCase()}</p>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: metric.iconBg }}
        >
          <Icon size={15} style={{ color: metric.iconColor }} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-mono text-2xl font-bold text-white">{metric.value}</p>
        <span
          className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
          style={{
            background: metric.positive ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
            color: metric.positive ? POSITIVE : NEGATIVE,
          }}
        >
          {metric.change}
        </span>
      </div>
      <p className="mt-2 text-xs text-white/40">{metric.sub}</p>
    </div>
  );
}

/**
 * Portfolio growth line chart: a solid "primary" series plotted over a
 * dotted "baseline" comparison series.
 *
 * Two behaviors layered on top of the base line:
 * - Idle animation: when nobody is interacting, the primary line gently
 *   "breathes" up and down via a continuous sine-wave offset, driven by
 *   a requestAnimationFrame loop (WAVE_AMPLITUDE / WAVE_SPEED above).
 * - Tap/hover: on both mouse move and touch, the wave animation pauses
 *   and the line snaps to the real data for the nearest point, with a
 *   tooltip — this works identically on desktop hover and mobile tap.
 */
function PortfolioChart() {
  const [activeIndex, setActiveIndex] = useState(CHART_HIGHLIGHT_INDEX);
  const [isInteracting, setIsInteracting] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const rafRef = useRef(null);

  const width = 1160;
  const height = 260;
  const paddingLeft = 56;
  const paddingRight = 20;
  const paddingTop = 24;
  const paddingBottom = 28;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const xForIndex = (index) => paddingLeft + (index / (CHART_DATA.length - 1)) * plotWidth;
  const yForValue = (value) => paddingTop + plotHeight - (value / CHART_MAX) * plotHeight;

  // Continuous animation loop for the idle "wave" effect. Runs whenever
  // the user isn't actively hovering/tapping the chart, and is cleaned
  // up on unmount or when interaction starts.
  useEffect(() => {
    if (isInteracting) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    let start = performance.now();
    const tick = (now) => {
      setWavePhase((now - start) * WAVE_SPEED);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInteracting]);

  const { primaryPath, baselinePath, areaPath } = useMemo(() => {
    const wavedPrimary = (d, i) =>
      isInteracting ? d.primary : d.primary + Math.sin(wavePhase + i * 0.7) * WAVE_AMPLITUDE;

    const smooth = (accessor) => {
      const pts = CHART_DATA.map((d, i) => [xForIndex(i), yForValue(accessor(d, i))]);
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[i + 1];
        const midX = (x0 + x1) / 2;
        d += ` C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`;
      }
      return d;
    };
    const primary = smooth(wavedPrimary);
    const baseline = smooth((d) => d.baseline);
    const area = `${primary} L ${xForIndex(CHART_DATA.length - 1)} ${paddingTop + plotHeight} L ${xForIndex(0)} ${paddingTop + plotHeight} Z`;
    return { primaryPath: primary, baselinePath: baseline, areaPath: area };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wavePhase, isInteracting]);

  const gridValues = [0, 50000, 100000, 150000, 200000, 250000];

  // Shared handler for both mouse and touch: resolves a clientX position
  // to the nearest month index.
  const resolveIndexFromClientX = (svg, clientX) => {
    const rect = svg.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * width;
    const ratio = (relativeX - paddingLeft) / plotWidth;
    const index = Math.round(ratio * (CHART_DATA.length - 1));
    return Math.min(Math.max(index, 0), CHART_DATA.length - 1);
  };

  const handleMouseMove = (event) => {
    setIsInteracting(true);
    setActiveIndex(resolveIndexFromClientX(event.currentTarget, event.clientX));
  };
  const handleMouseLeave = () => {
    setIsInteracting(false);
    setActiveIndex(CHART_HIGHLIGHT_INDEX);
  };

  // Touch handlers make taps/drags on mobile behave the same as hover
  // on desktop, instead of the chart only responding to mouse events.
  const handleTouchStart = (event) => {
    setIsInteracting(true);
    const touch = event.touches[0];
    if (touch) setActiveIndex(resolveIndexFromClientX(event.currentTarget, touch.clientX));
  };
  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (touch) setActiveIndex(resolveIndexFromClientX(event.currentTarget, touch.clientX));
  };
  const handleTouchEnd = () => {
    // Keep the tapped point's tooltip visible briefly on mobile instead
    // of snapping straight back to the idle wave.
    setTimeout(() => setIsInteracting(false), 1200);
  };

  const active = CHART_DATA[activeIndex];
  const activeValue = isInteracting
    ? active.primary
    : active.primary + Math.sin(wavePhase + activeIndex * 0.7) * WAVE_AMPLITUDE;
  const activeX = xForIndex(activeIndex);
  const activeY = yForValue(activeValue);
  const tooltipOnRight = activeIndex > CHART_DATA.length - 3;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full touch-none sm:h-64"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <defs>
          <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.28" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines + F-value labels */}
        {gridValues.map((value) => (
          <g key={value}>
            <line
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={yForValue(value)}
              y2={yForValue(value)}
              stroke="#ffffff"
              strokeOpacity="0.06"
            />
            <text x={paddingLeft - 10} y={yForValue(value) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.35)">
              {value === 0 ? "F 0" : `F ${value / 1000}K`}
            </text>
          </g>
        ))}

        {/* Month labels */}
        {CHART_MONTHS.map((month, i) => (
          <text
            key={month}
            x={xForIndex(i)}
            y={height - 6}
            textAnchor="middle"
            fontSize="10"
            fill={i === activeIndex ? GOLD : "rgba(255,255,255,0.35)"}
            fontWeight={i === activeIndex ? "600" : "400"}
          >
            {month}
          </text>
        ))}

        <path d={areaPath} fill="url(#portfolioArea)" />
        <path d={baselinePath} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d={primaryPath} fill="none" stroke={GOLD} strokeWidth="2" />

        {/* Hover/tap guide + point */}
        <line
          x1={activeX}
          x2={activeX}
          y1={paddingTop}
          y2={paddingTop + plotHeight}
          stroke={GOLD}
          strokeOpacity="0.35"
          strokeDasharray="3 4"
        />
        <circle cx={activeX} cy={activeY} r="4.5" fill={GOLD} stroke="#0a0910" strokeWidth="2" />
      </svg>

      {/* Tooltip, positioned to follow the active point */}
      <div
        className="pointer-events-none absolute top-2 rounded-xl border border-[#e8b46a]/40 bg-[#15121a]/95 px-3.5 py-2.5 shadow-lg"
        style={{
          left: `${(activeX / width) * 100}%`,
          transform: tooltipOnRight ? "translateX(-105%)" : "translateX(10px)",
        }}
      >
        <p className="text-[10px] tracking-[0.1em] text-white/40">
          {CHART_MONTHS[activeIndex].toUpperCase()} 2025
        </p>
        <p className="mt-0.5 font-mono text-sm font-bold text-white">
          F {Math.round(activeValue).toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs font-medium" style={{ color: POSITIVE }}>
          ▲ +18.5%
        </p>
      </div>
    </div>
  );
}