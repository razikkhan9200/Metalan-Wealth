/* pages/dashboard/wallet/Wallet.jsx: application source file. FAIX wallet overview + transaction history. */
import { useRef, useState } from "react";

// lucide-react icons
import {
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Percent,
  TrendingUp,
} from "lucide-react";

// Components
import Navbar from "../../../layouts/DashboardNavbar";
import Text from "../../../components/ui/Text";
import Pagination from "../../../components/ui/Pagination";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import WalletAddressModal from "./WalletAddressModal";

// Shared brand colors — same values used across Dashboard/Funds/Property/Exchange
// so this page's palette stays identical rather than drifting if edited
// in isolation.
const ACCENT = "#1A3C34";
const GOLD = "#e8b46a";

// Top summary stats. `badge` is optional — only TOTAL AMOUNT has a
// change indicator in the source design.
const SUMMARY_STATS = [
  { label: "TOTAL AMOUNT", value: "$134,850.40", badge: "+3.84%" },
  { label: "USED TOKEN", value: "10,200.00", suffix: "FAIX" },
  { label: "PROFILE AMOUNT", value: "$134,850.40" },
];

// Balance-history chart. `value` is relative (0–1) so the chart below
// can scale it to any pixel height; `amount` is the display figure shown
// in the hover tooltip and the "Current" pill. Wire this to a real
// balance-history endpoint once one exists.
const CHART_DATA = [
  { month: "Jan", value: 0.18, amount: "$98,200.10" },
  { month: "Feb", value: 0.32, amount: "$108,400.00" },
  { month: "Mar", value: 0.28, amount: "$104,900.50" },
  { month: "Apr", value: 0.52, amount: "$118,700.25" },
  { month: "May", value: 0.48, amount: "$116,200.80" },
  { month: "Jun", value: 0.78, amount: "$128,300.60" },
  { month: "Jul", value: 0.96, amount: "$134,850.40" },
];
const CHART_RANGES = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

// Quick-action cards above the transaction table.
const QUICK_ACTIONS = [
  {
    id: "deposit",
    icon: ArrowDownLeft,
    title: "Deposit FAIX",
    description: "Add funds to your secure wallet storage instantly",
  },
  {
    id: "withdraw",
    icon: ArrowUpRight,
    title: "Withdraw FAIX",
    description: "Transfer capital assets out of the Metalan network safely",
  },
  {
    id: "address",
    icon: QrCode,
    title: "Wallet Address",
    description: "View and share public ledger cryptographic address",
  },
];

// Recent ledger entries. `direction` drives the icon/amount color,
// `status` drives the pill color at the end of the row.
const TRANSACTIONS = [
  {
    id: "tx-1",
    type: "Deposit",
    direction: "in",
    amount: "12,500.00",
    date: "Jul 24, 2026 - 14:32:05",
    status: "Confirmed",
  },
  {
    id: "tx-2",
    type: "Withdrawal",
    direction: "out",
    amount: "4,200.00",
    date: "Jul 22, 2026 - 09:15:44",
    status: "Confirmed",
  },
  {
    id: "tx-3",
    type: "Deposit",
    direction: "in",
    amount: "8,000.00",
    date: "Jul 18, 2026 - 18:24:11",
    status: "Pending",
  },
  {
    id: "tx-4",
    type: "Withdrawal",
    direction: "out",
    amount: "1,500.00",
    date: "Jul 15, 2026 - 11:04:19",
    status: "Failed",
  },
  {
    id: "tx-5",
    type: "Deposit",
    direction: "in",
    amount: "15,350.00",
    date: "Jul 10, 2026 - 08:45:30",
    status: "Confirmed",
  },
  {
    id: "tx-6",
    type: "Withdrawal",
    direction: "out",
    amount: "2,800.00",
    date: "Jul 04, 2026 - 16:12:02",
    status: "Confirmed",
  },
  {
    id: "tx-7",
    type: "Deposit",
    direction: "in",
    amount: "6,750.00",
    date: "Jun 29, 2026 - 10:02:18",
    status: "Confirmed",
  },
  {
    id: "tx-8",
    type: "Withdrawal",
    direction: "out",
    amount: "3,100.00",
    date: "Jun 25, 2026 - 19:44:37",
    status: "Confirmed",
  },
  {
    id: "tx-9",
    type: "Deposit",
    direction: "in",
    amount: "9,900.00",
    date: "Jun 20, 2026 - 07:58:02",
    status: "Pending",
  },
  {
    id: "tx-10",
    type: "Withdrawal",
    direction: "out",
    amount: "750.00",
    date: "Jun 14, 2026 - 22:31:50",
    status: "Confirmed",
  },
  {
    id: "tx-11",
    type: "Deposit",
    direction: "in",
    amount: "20,000.00",
    date: "Jun 09, 2026 - 13:20:11",
    status: "Confirmed",
  },
  {
    id: "tx-12",
    type: "Withdrawal",
    direction: "out",
    amount: "5,400.00",
    date: "Jun 03, 2026 - 08:05:29",
    status: "Failed",
  },
];

// How many transaction rows to show per pagination page.
const TRANSACTIONS_PER_PAGE = 6;

export default function Wallet() {
  const [range, setRange] = useState("1M");
  const [hoverPoint, setHoverPoint] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const activePoint = hoverPoint ?? CHART_DATA.at(-1);

  const totalTransactionPages = Math.ceil(TRANSACTIONS.length / TRANSACTIONS_PER_PAGE);
  const visibleTransactions = TRANSACTIONS.slice(
    (transactionsPage - 1) * TRANSACTIONS_PER_PAGE,
    transactionsPage * TRANSACTIONS_PER_PAGE
  );

  // Maps each quick-action card's id to what clicking it does. Kept
  // separate from the QUICK_ACTIONS data array (module scope) since
  // these close over component state/setters.
  const quickActionHandlers = {
    deposit: () => setDepositOpen(true),
    withdraw: () => setWithdrawOpen(true),
    address: () => setAddressOpen(true),
  };

  return (
    <div className="min-h-screen w-full bg-[#0E1211] pb-16">
      <Navbar
        faixBalance="24,850.00"
        notificationCount={3}
        user={{ name: "Arjun Mehta", email: "arjun@metalanwealth.com", balance: "24,850.00" }}
      />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-10">
        {/* ============================================================
            SUMMARY STATS + BALANCE CHART
        ============================================================ */}
        <div className="rounded-3xl border border-white/10 bg-[#18211E] p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SUMMARY_STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  "relative border-white/10 pl-4 " +
                  (index > 0 ? "sm:border-l sm:pl-6" : "")
                }
              >
                <span
                  className="absolute -left-px -top-2 h-2.5 w-2.5 rounded-full"
                  style={{ background: GOLD }}
                />
                <p className="text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
                  {stat.label}
                </p>
                <p className="mt-2 flex items-baseline gap-2 font-mono text-lg font-bold text-white sm:text-xl">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-sm font-medium text-white/40">{stat.suffix}</span>
                  )}
                  {stat.badge && (
                    <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-sans text-[11px] font-semibold text-emerald-400">
                      {stat.badge}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-8">
            <div className="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-xs backdrop-blur">
              <span className="text-white/40">{hoverPoint ? hoverPoint.month : "Current"}</span>
              <span className="font-mono font-semibold text-white">{activePoint.amount}</span>
            </div>

            <BalanceChart data={CHART_DATA} onHoverChange={setHoverPoint} />

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-8 text-xs text-white/30">
                {CHART_DATA.slice(0, -1).map((point) => (
                  <span
                    key={point.month}
                    className={point.month === activePoint.month ? "font-semibold" : undefined}
                    style={point.month === activePoint.month ? { color: GOLD } : undefined}
                  >
                    {point.month}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="mr-1 text-xs text-white/30"
                  style={CHART_DATA.at(-1).month === activePoint.month ? { color: GOLD, fontWeight: 600 } : undefined}
                >
                  {CHART_DATA.at(-1).month}
                </span>
                {CHART_RANGES.map((option) => {
                  const isActive = option === range;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRange(option)}
                      aria-pressed={isActive}
                      className={
                        "flex h-6 items-center justify-center rounded-full px-2.5 text-[11px] font-semibold transition-colors " +
                        (isActive
                          ? "text-[#241608]"
                          : "text-white/40 hover:text-white/70")
                      }
                      style={isActive ? { background: GOLD } : undefined}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            QUICK ACTIONS
        ============================================================ */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={quickActionHandlers[action.id]}
              className="rounded-2xl border border-white/10 bg-[#18211E] p-5 text-left transition-colors hover:border-white/20"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: `${GOLD}1f`, color: GOLD }}
              >
                <action.icon size={18} />
              </span>
              <p className="mt-4 text-sm font-semibold text-white">{action.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/40">{action.description}</p>
            </button>
          ))}

          {/* Est. Annual Yield is display-only, not an action, so it's a
              div rather than a button unlike the three cards above. */}
          <div className="rounded-2xl border border-white/10 bg-[#18211E] p-5">
            <div className="flex items-start justify-between">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ background: `${GOLD}1f`, color: GOLD }}
              >
                <Percent size={18} />
              </span>
              <span
                className="rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide"
                style={{ borderColor: `${GOLD}66`, color: GOLD }}
              >
                LIVE
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold text-white">Est. Annual Yield</p>
            <p className="mt-1 text-xs leading-relaxed text-white/40">
              Yield calculated on current asset reserves
            </p>
            <p className="mt-3 flex items-center gap-2 font-mono text-2xl font-bold" style={{ color: GOLD }}>
              <TrendingUp size={20} className="text-emerald-400" />
              12.45%
            </p>
          </div>
        </div>

        {/* ============================================================
            TRANSACTION HISTORY
        ============================================================ */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-[#18211E] p-6 sm:p-8">
          <div>
            <Text size="xl" weight="semibold" color="white" className="font-serif text-3xl">
              Transaction History
            </Text>
            <Text size="sm" className="mt-1 !text-white/40">
              Ledger of FAIX deposits, withdrawals, and platform settlement events.
            </Text>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-black/40">
                  <th className="rounded-l-lg px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
                    TYPE
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
                    ASSET
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
                    AMOUNT
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
                    DATE / TIME
                  </th>
                  <th className="rounded-r-lg px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: GOLD }}>
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleTransactions.map((tx, index) => (
                  <TransactionRow key={tx.id} tx={tx} striped={index % 2 === 1} />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={transactionsPage}
            totalPages={totalTransactionPages}
            onPageChange={setTransactionsPage}
          />
        </div>
      </main>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <WalletAddressModal open={addressOpen} onClose={() => setAddressOpen(false)} />
    </div>
  );
}

// Per-status pill color for a transaction row.
const STATUS_STYLES = {
  Confirmed: "bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/30",
  Pending: "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30",
  Failed: "bg-rose-400/10 text-rose-400 ring-1 ring-rose-400/30",
};

/** One row of the transaction history table. */
function TransactionRow({ tx, striped }) {
  const isDeposit = tx.direction === "in";

  return (
    <tr
      className={
        "transition-colors hover:bg-[#e8b46a]/[0.06] " +
        (striped ? "bg-[#18211E]" : "")
      }
    >
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <span
            className={
              "flex h-7 w-7 items-center justify-center rounded-full ring-1 " +
              (isDeposit
                ? "bg-emerald-400/10 text-emerald-400 ring-emerald-400/30"
                : "bg-rose-400/10 text-rose-400 ring-rose-400/30")
            }
          >
            {isDeposit ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
          </span>
          <span className="text-sm font-semibold text-white">{tx.type}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
          FAIX
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={"font-mono text-sm font-semibold " + (isDeposit ? "text-emerald-400" : "text-rose-400")}>
          {isDeposit ? "+ " : "- "}
          {tx.amount}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="font-mono text-xs text-white/40">{tx.date}</span>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${STATUS_STYLES[tx.status]}`}>
          {tx.status}
        </span>
      </td>
    </tr>
  );
}

/**
 * Balance-history line chart. Pure SVG (no charting library) for the
 * grid/line/area, plus an absolutely-positioned HTML overlay that
 * tracks the pointer to draw a guideline, a highlighted dot, and a
 * tooltip for the nearest month — calls `onHoverChange` with that
 * month's data point (or `null` on mouse-leave) so the parent can sync
 * the "Current" pill and axis labels to whatever's being hovered.
 */
function BalanceChart({ data, onHoverChange }) {
  const width = 1000;
  const height = 260;
  const padX = 20;
  const padTop = 20;
  const padBottom = 20;

  const containerRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const points = data.map((point, index) => {
    const x = padX + (index / (data.length - 1)) * (width - padX * 2);
    const y = padTop + (1 - point.value) * (height - padTop - padBottom);
    return { ...point, x, y };
  });

  const linePath = points
    .map((p, index) => `${index === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");

  const areaPath =
    `M${points[0].x},${height} ` +
    points.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${points.at(-1).x},${height} Z`;

  const activeIndex = hoverIndex ?? points.length - 1;
  const active = points[activeIndex];

  function updateHover(clientX) {
    const rect = containerRef.current.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    const clamped = Math.min(Math.max(fraction, 0), 1);
    const index = Math.round(clamped * (points.length - 1));
    setHoverIndex(index);
    onHoverChange?.(data[index]);
  }

  function clearHover() {
    setHoverIndex(null);
    onHoverChange?.(null);
  }

  // Tooltip flips to the left of the dot once it would otherwise run
  // past the right edge of the chart, so it never clips out of view.
  const tooltipAlign = active.x / width > 0.82 ? "right" : "left";

  return (
    <div
      ref={containerRef}
      className="relative h-56 w-full cursor-crosshair sm:h-64"
      onMouseMove={(event) => updateHover(event.clientX)}
      onMouseLeave={clearHover}
      onTouchStart={(event) => updateHover(event.touches[0].clientX)}
      onTouchMove={(event) => updateHover(event.touches[0].clientX)}
      onTouchEnd={clearHover}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="walletChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal + vertical grid lines */}
        {[0.25, 0.5, 0.75, 1].map((fraction) => (
          <line
            key={fraction}
            x1={padX}
            x2={width - padX}
            y1={padTop + fraction * (height - padTop - padBottom)}
            y2={padTop + fraction * (height - padTop - padBottom)}
            stroke="#ffffff10"
            strokeWidth="1"
          />
        ))}
        {points.slice(0, -1).map((p, index) => (
          <line key={index} x1={p.x} x2={p.x} y1={padTop} y2={height - padBottom} stroke="#ffffff08" strokeWidth="1" />
        ))}

        <path d={areaPath} fill="url(#walletChartFill)" />
        <path
          d={linePath}
          fill="none"
          stroke={GOLD}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover guideline, drawn behind the dots */}
        {hoverIndex !== null && (
          <line
            x1={active.x}
            x2={active.x}
            y1={padTop}
            y2={height - padBottom}
            stroke={GOLD}
            strokeOpacity="0.35"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Static end-of-line dot, dimmed while a different point is hovered */}
        <circle
          cx={points.at(-1).x}
          cy={points.at(-1).y}
          r={hoverIndex === null || hoverIndex === points.length - 1 ? 5 : 3}
          fill={GOLD}
          stroke="#0a0910"
          strokeWidth="2"
          opacity={hoverIndex === null || hoverIndex === points.length - 1 ? 1 : 0.5}
        />

        {/* Active hover dot */}
        {hoverIndex !== null && hoverIndex !== points.length - 1 && (
          <circle cx={active.x} cy={active.y} r="5" fill={GOLD} stroke="#0a0910" strokeWidth="2" />
        )}
      </svg>

      {/* Tooltip — positioned in percent so it tracks the SVG's own
          non-uniform (preserveAspectRatio="none") scaling exactly. */}
      {hoverIndex !== null && (
        <div
          className={
            "pointer-events-none absolute z-20 -translate-y-full rounded-lg border border-white/10 bg-black/90 px-3 py-2 shadow-lg backdrop-blur " +
            (tooltipAlign === "right" ? "-translate-x-full" : "")
          }
          style={{
            left: `${(active.x / width) * 100}%`,
            top: `${(active.y / height) * 100}%`,
            marginTop: "-10px",
          }}
        >
          <p className="text-[11px] text-white/40">{active.month}</p>
          <p className="font-mono text-sm font-semibold text-white">{active.amount}</p>
        </div>
      )}
    </div>
  );
}
