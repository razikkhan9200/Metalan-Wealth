"use client";
/**
 * UserAdmin.jsx — Metalan investor dashboard (API-integrated)
 *
 * Dependencies:  npm i gsap recharts lucide-react
 * Theme:         colors are Tailwind arbitrary values (#05080d base, cyan accent, #d4af6a gold).
 * Images:        Design/hero image is static; investor/property/fund data comes from the authenticated API.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Area, CartesianGrid, Cell, ComposedChart, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Activity, ArrowDownRight, ArrowDownToLine, ArrowLeftRight, ArrowUpRight, Bell, Briefcase, Building2,
  CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Coins, Cpu, CreditCard, Landmark, Layers, Leaf, MapPin,
  PieChart as PieChartIcon, Plus, Search, ShieldCheck, Trophy, TrendingUp, Users as UsersIcon, Wallet, X,
} from "lucide-react";
import Lenis from "lenis";

import NavigationPanel from "./NavigationPanel";
import { useLogout } from "./shared/nav";
import { RankBadge, ViewAllButton } from "./shared/ui";
import { initials } from "./shared/theme";
import { get, post } from "../../services/api";

/* ────────────────────────────── design tokens ────────────────────────────── */

const C = { cyan: "#22d3ee", gold: "#d4af6a", violet: "#8b9cf7" };

const BG =
  "radial-gradient(60rem 28rem at 90% -8%, rgba(34,211,238,0.06), transparent 60%), radial-gradient(48rem 26rem at -8% 6%, rgba(212,175,106,0.05), transparent 60%)";
const CARD = "rounded-2xl border border-white/[0.06] bg-[#0a1019]/90 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-sm";
const ICON_BTN =
  "relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/30 text-slate-200 backdrop-blur transition-colors hover:border-cyan-400/40 hover:text-cyan-200";
const ARROW_BTN =
  "grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-slate-300";
const ACCENT = {
  cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
  gold: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  violet: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
};
const BTN_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const BTN = {
  gold: `${BTN_BASE} bg-[#d4af6a] text-[#1a1305] hover:bg-[#e2c17f]`,
  goldSoft: `${BTN_BASE} border border-[#d4af6a]/40 bg-[#d4af6a]/10 text-[#e2c17f] hover:bg-[#d4af6a]/20`,
  cyanSoft: `${BTN_BASE} border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20`,
};
const RISK = {
  Low: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
  Moderate: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  High: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
};

// Horizontal snap carousel (used for fund + property cards).
const CAROUSEL =
  "mt-hide-scroll flex min-w-0 max-w-full select-none gap-5 overflow-x-auto px-2 pb-5 pt-3";

const STYLES = `
.mt-hide-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  scroll-behavior: auto;
  touch-action: pan-y;
  overscroll-behavior-x: contain;
  overscroll-behavior-y: auto;
}

.mt-hide-scroll:active {
  cursor: grabbing;
}

.mt-hide-scroll::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.mt-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.16) transparent;
}

.mt-thin::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.mt-thin::-webkit-scrollbar-track {
  background: transparent;
}

.mt-thin::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,.14);
  border-radius: 999px;
}

.mt-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(212,175,106,.45);
}
`;

/* ────────────────────────────── images ────────────────────────────── */

const U = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const IMAGES = {
  hero: U("photo-1477959858617-67f85cf4f1df", 1800), // dashboard design background
};

/* ────────────────────────────── API data sources ────────────────────────────── */

const TX_META = {
  Deposit: { icon: ArrowDownToLine, tone: "emerald" },
  Investment: { icon: TrendingUp, tone: "cyan" },
  Buy: { icon: Building2, tone: "gold" },
  Exchange: { icon: ArrowLeftRight, tone: "violet" },
  Sell: { icon: ArrowUpRight, tone: "emerald" },
  Dividend: { icon: Coins, tone: "emerald" },
  Withdraw: { icon: ArrowDownToLine, tone: "gold" },
  Stake: { icon: TrendingUp, tone: "cyan" },
};

const QUICK_ACTIONS = [
  { key: "invest", label: "Invest in Fund", hint: "Put FAIX into a fund at today's NAV", icon: TrendingUp, tone: "cyan" },
  { key: "property", label: "Buy Property", hint: "Own a share of tokenized real estate", icon: Building2, tone: "gold" },
  { key: "deposit", label: "Add Funds", hint: "Top up your FAIX balance", icon: Plus, tone: "emerald" },
  { key: "exchange", label: "Exchange", hint: "Move value to or from exchange assets", icon: ArrowLeftRight, tone: "violet" },
];

/* ────────────────────────────── formatting ────────────────────────────── */

const fmt = (n, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmt0 = (n) => fmt(n, 0);
const compact = (n) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
const signedPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
const fmtDate = (d) =>
  `${d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

/* ────────────────────────────── API mapping ────────────────────────────── */

const FAIX_TOKEN_VALUE = 11;

const FUND_ICON_MAP = {
  "trending-up": TrendingUp,
  "shield-check": ShieldCheck,
  building2: Building2,
  coins: Coins,
  cpu: Cpu,
  leaf: Leaf,
};

function mapApiFund(fund) {
  const iconKey = String(fund?.icon || "").toLowerCase();
  const id = String(fund?._id || fund?.id || fund?.name || "fund");

  const totalUnits = Number(fund?.totalUnits ?? fund?.totalFundUnits ?? fund?.issuedUnits) || 0;
  const soldUnits = Number(fund?.soldUnits ?? fund?.usedUnits ?? fund?.investedUnits) || 0;
  const soldPercent = Number.isFinite(Number(fund?.soldPercent))
    ? Number(fund.soldPercent)
    : totalUnits > 0
      ? (Math.max(0, soldUnits) / totalUnits) * 100
      : 0;

  return {
    id,
    name: fund?.name || "Fund",
    category: fund?.category || "Investment fund",
    nav: Number(fund?.nav) || 0,
    growth: Number(fund?.growthPercent) || 0,
    status: fund?.isActive ? "Open" : "Closed",
    min: 0,
    totalUnits: Math.max(0, totalUnits),
    soldUnits: Math.max(0, soldUnits),
    soldPercent: Math.max(0, Math.min(100, soldPercent)),
    icon: FUND_ICON_MAP[iconKey] || TrendingUp,
    soldFaixToken: Number(fund?.soldFaixToken ?? fund?.soldTokens ?? fund?.faixTokenSold) || 0,
    img: fund?.imageUrl || fund?.image || fund?.coverImage || "",
    apiId: fund?._id || fund?.id,
  };
}

function mapApiProperty(property, index) {
  const total = Math.max(0, Number(property?.totalFaixToken) || 0);
  const available = Math.max(0, Number(property?.availableFaixToken) || 0);
  const sold = Math.max(0, Number(property?.soldFaixToken) || Math.max(total - available, 0));
  const soldPercent = total > 0 ? Math.max(0, Math.min(100, (sold / total) * 100)) : 0;
  const tokenPrice = Math.max(0, Number(property?.tokenValue ?? property?.faixTokenValue ?? FAIX_TOKEN_VALUE) || FAIX_TOKEN_VALUE);

  return {
    id: String(property?._id || property?.id || property?.propertyName || `property-${index}`),
    name: property?.propertyName || "Property",
    location: property?.location || "",
    value: Number(property?.totalPropertyCost) || 0,
    tokenPrice,
    total,
    available,
    sold,
    soldPercent,
    status: property?.status || "Available",
    propertyType: property?.propertyType || "",
    description: property?.description || "",
    img: property?.propertyImage || property?.images?.find((image) => image?.url)?.url || "",
    apiId: property?._id || property?.id,
  };
}

function mapApiTransaction(transaction, index) {
  const rawType = transaction?.type || "Transaction";
  const typeMap = {
    Swap: "Exchange",
    Stake: "Investment",
  };
  const type = typeMap[rawType] || rawType;
  const meta = Number.isFinite(Number(transaction?.total))
    ? Number(transaction.total)
    : Number(transaction?.amount) || 0;
  const credit = rawType === "Deposit" || rawType === "Dividend" || rawType === "Sell" || rawType === "Withdraw";

  return {
    id: String(transaction?._id || transaction?.id || `transaction-${index}`),
    asset: transaction?.asset || "Transaction",
    type,
    amount: credit ? Math.abs(meta) : -Math.abs(meta),
    date: new Date(transaction?.date || transaction?.createdAt || Date.now()),
    status: transaction?.status || "Pending",
  };
}

/* ────────────────────────── API chart data ────────────────────────── */

const RANGES = {
  daily: { label: "Daily", points: 24, hours: 24 },
  weekly: { label: "Weekly", points: 7, days: 7 },
  monthly: { label: "Monthly", points: 30, days: 30 },
  yearly: { label: "Yearly", points: 12, months: 12 },
};
const MAX_OFFSET = 5;

function addRangeStep(date, range, amount) {
  const d = new Date(date);
  if (range === "daily") d.setHours(d.getHours() + amount);
  else if (range === "yearly") d.setMonth(d.getMonth() + amount);
  else d.setDate(d.getDate() + amount);
  return d;
}

function formatChartPoint(date, range) {
  if (range === "daily") {
    return {
      label: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      full: date.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  }
  if (range === "yearly") {
    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }
  return {
    label: range === "weekly" ? date.toLocaleDateString("en-US", { weekday: "short" }) : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    full: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
  };
}

function buildSeries(range, offset, currentTotal, history = []) {
  const cfg = RANGES[range];
  const source = Array.isArray(history) ? history : [];
  const apiPoints = source
    .map((point) => {
      const date = new Date(point?.date || point?.timestamp || point?.createdAt);
      const value = Number(point?.value ?? point?.totalAmount ?? point?.portfolioValue);
      return Number.isFinite(date.getTime()) && Number.isFinite(value) ? { date, value } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);

  if (apiPoints.length >= 2) {
    const last = apiPoints[apiPoints.length - 1];
    const shiftedLast = addRangeStep(last.date, range, -offset * (range === "yearly" ? 12 : range === "daily" ? 24 : cfg.points));
    const windowStart = addRangeStep(shiftedLast, range, -(cfg.points - 1));
    const windowEnd = shiftedLast;
    const filtered = apiPoints.filter((p) => p.date >= windowStart && p.date <= windowEnd);

    if (filtered.length >= 2) {
      const data = filtered.map((p) => ({ ...p, ...formatChartPoint(p.date, range), baseline: filtered[0].value }));
      return {
        data,
        rangeText: `${filtered[0].date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – ${filtered[filtered.length - 1].date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      };
    }
  }

  // No portfolio-history endpoint data: keep the chart honest and use the latest
  // API portfolio value as the only known value rather than inventing growth.
  const anchor = Math.max(0, Number(currentTotal) || 0);
  const end = new Date();
  const shiftedEnd = addRangeStep(end, range, -offset * (range === "yearly" ? 12 : range === "daily" ? 24 : cfg.points));
  const data = Array.from({ length: cfg.points }, (_, i) => {
    const date = addRangeStep(shiftedEnd, range, -(cfg.points - 1 - i));
    return { ...formatChartPoint(date, range), date, value: anchor, baseline: anchor };
  });

  return {
    data,
    rangeText: `${data[0].full} – ${data[data.length - 1].full}`,
  };
}

/* ────────────────────────────── hooks ────────────────────────────── */

/**
 * Horizontal carousel helper: scroll-snap + arrow buttons + mouse drag-to-scroll.
 * Touch / trackpad / shift+wheel scrolling work natively.
 */
function useCarousel() {
  const ref = useRef(null);

  const drag = useRef({
    down: false,
    moved: false,
    startX: 0,
    startLeft: 0,
    blockClick: false,
  });

  const tween = useRef(null);

  const [edge, setEdge] = useState({
    start: true,
    end: false,
  });

  const getMaxScroll = useCallback(() => {
    const el = ref.current;
    return el ? Math.max(0, el.scrollWidth - el.clientWidth) : 0;
  }, []);

  const clamp = useCallback(
    (value) => Math.max(0, Math.min(getMaxScroll(), value)),
    [getMaxScroll]
  );

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  const stopTween = useCallback(() => {
    tween.current?.kill?.();
    tween.current = null;
  }, []);

  const animateTo = useCallback(
    (target, duration = 0.5) => {
      const el = ref.current;
      if (!el) return;

      const next = clamp(target);

      stopTween();

      tween.current = gsap.to(el, {
        scrollLeft: next,
        duration,
        ease: "power3.out",
        overwrite: true,
        onUpdate: update,
        onComplete: () => {
          tween.current = null;
          update();
        },
      });
    },
    [clamp, stopTween, update]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    update();

    const onScroll = () => update();
    const onResize = () => update();

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      stopTween();
    };
  }, [stopTween, update]);

  const scrollByPage = useCallback(
    (dir) => {
      const el = ref.current;
      if (!el) return;

      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const current = Math.max(0, Math.min(max, el.scrollLeft));
      const amount = Math.max(260, el.clientWidth * 0.72);
      const target = Math.max(0, Math.min(max, current + dir * amount));

      if (Math.abs(target - current) < 1) {
        update();
        return;
      }

      animateTo(target, 0.5);
    },
    [animateTo, update]
  );

  const finish = useCallback(
    (e) => {
      const d = drag.current;
      const el = ref.current;

      if (!d.down) return;

      d.down = false;

      if (d.moved) {
        if (el) {
          el.style.cursor = "grab";
          el.style.scrollSnapType = "";
        }

        d.blockClick = true;

        setTimeout(() => {
          d.blockClick = false;
        }, 120);
      }

      d.moved = false;

      try {
        el?.releasePointerCapture?.(e.pointerId);
      } catch {}
    },
    []
  );

  const handlers = {
    onPointerDown: (e) => {
      if (
        e.pointerType !== "mouse" ||
        e.button !== 0 ||
        !ref.current
      ) {
        return;
      }

      const el = ref.current;

      stopTween();

      el.style.scrollSnapType = "none";
      el.style.cursor = "grabbing";

      drag.current = {
        ...drag.current,
        down: true,
        moved: false,
        startX: e.clientX,
        startLeft: el.scrollLeft,
      };
    },

    onPointerMove: (e) => {
      const d = drag.current;
      const el = ref.current;

      if (!d.down || !el) return;

      if (e.buttons !== 1) {
        finish(e);
        return;
      }

      const distance = e.clientX - d.startX;

      if (!d.moved) {
        if (Math.abs(distance) < 6) return;

        d.moved = true;

        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
      }

      el.scrollLeft = clamp(d.startLeft - distance);
    },

    onPointerUp: finish,
    onPointerCancel: finish,

    onClickCapture: (e) => {
      if (drag.current.blockClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    // Vertical wheel scrolls the page through Lenis.
    // Horizontal wheel/trackpad input is blocked so carousels
    // move only with arrows or mouse drag.
    onWheelCapture: (e) => {
      const dx = Math.abs(e.deltaX || 0);
      const dy = Math.abs(e.deltaY || 0);

      if (dx > dy && dx > 1) {
        e.preventDefault();
        e.stopPropagation();
      }
    },

    onDragStart: (e) => {
      e.preventDefault();
    },

  };

  return {
    ref,
    edge,
    scrollByPage,
    handlers,
  };
}

/* ────────────────────────────── small UI pieces ────────────────────────────── */

/** Image that fades in once loaded and quietly disappears if the URL is dead (the layer behind it is the fallback). */
function Photo({ src, alt = "", className = "", eager = false }) {
  const [state, setState] = useState("loading");
  if (state === "error") return null;
  return (
    <img
      src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} referrerPolicy="no-referrer"
      aria-hidden={alt ? undefined : true}
      onLoad={() => setState("ready")} onError={() => setState("error")}
      className={`${className} transition-[opacity,transform] duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/** Counts smoothly to its new value whenever `value` changes. */
function AnimatedNumber({ value, format = fmt0, duration = 0.8 }) {
  const ref = useRef(null);
  const current = useRef({ v: 0 });
  const initial = useRef(format(0)).current;
  useEffect(() => {
    const tween = gsap.to(current.current, {
      v: value, duration, ease: "power2.out",
      onUpdate: () => { if (ref.current) ref.current.textContent = format(current.current.v); },
    });
    return () => tween.kill();
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{initial}</span>;
}

function Delta({ value }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${up ? ACCENT.emerald : "bg-rose-400/10 text-rose-300 ring-rose-400/20"}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function SectionTitle({ icon: Icon, tone = "cyan", title, subtitle, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}><Icon className="h-[18px] w-[18px]" /></span>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

function CarouselArrows({ c, label }) {
  if (c.edge.start && c.edge.end) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Scroll ${label} left`}
        disabled={c.edge.start}
        onClick={() => c.scrollByPage(-1)}
        className={ARROW_BTN}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label={`Scroll ${label} right`}
        disabled={c.edge.end}
        onClick={() => c.scrollByPage(1)}
        className={ARROW_BTN}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const diff = (p.value / p.baseline - 1) * 100;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1019]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur">
      <p className="text-[11px] text-slate-400">{p.full}</p>
      <p className="mt-1 text-base font-semibold tabular-nums text-white">
        {fmt(p.value)} <span className="text-[11px] font-normal text-slate-500">FAIX</span>
      </p>
      <div className="mt-1 flex items-center gap-3 text-[11px]">
        <span className="text-slate-500">Baseline {fmt0(p.baseline)}</span>
        <span className={diff >= 0 ? "text-emerald-300" : "text-rose-300"}>{signedPct(diff)}</span>
      </div>
    </div>
  );
}

function Toast({ message }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    gsap.fromTo(ref.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
  }, []);
  return (
    <div ref={ref} className="fixed bottom-6 right-4 z-[60] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-emerald-400/20 bg-[#0a1019] px-4 py-3 text-sm text-slate-100 shadow-2xl sm:right-6">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300"><Check className="h-3.5 w-3.5" /></span>
      {message}
    </div>
  );
}

/* ────────────────────────────── modal + forms ────────────────────────────── */
function Modal({ title, subtitle, icon: Icon, tone, onClose, children }) {
  const overlay = useRef(null);
  const panel = useRef(null);
  const closing = useRef(false);

  useLayoutEffect(() => {
    gsap.fromTo(
      overlay.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25 }
    );

    gsap.fromTo(
      panel.current,
      { opacity: 0, y: 28, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      }
    );

    panel.current?.focus({ preventScroll: true });
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;

    closing.current = true;

    gsap.to(panel.current, {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.2,
      ease: "power2.in",
    });

    gsap.to(overlay.current, {
      opacity: 0,
      duration: 0.24,
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };

    const prev = document.body.style.overflow;

    document.addEventListener("keydown", onKey);

    // Background scroll lock
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  return (
    <div
      ref={overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          close();
        }
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onWheel={(e) => {
          // Current modal hi scroll hoga
          e.stopPropagation();

          if (panel.current) {
            panel.current.scrollTop += e.deltaY;
          }
        }}
        className="
            scrollbar-hide
            max-h-[92vh]
            w-full
            overflow-y-auto
            overscroll-contain
            rounded-t-3xl
            border border-white/10
            bg-[#0a1019]
            p-6
            shadow-2xl
            outline-none
            sm:max-w-md
            sm:rounded-3xl

        "
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {title}
              </h3>

              <p className="text-xs text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children(close)}
      </div>
    </div>
  );
}

function AmountField({ label, value, onChange, unit, chips = [], step = "any", hint }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs font-medium text-slate-400">
        <label>{label}</label>
        {hint && <span className="text-slate-500">{hint}</span>}
      </div>
      <div className="flex items-center rounded-xl border border-white/10 bg-black/30 px-4 focus-within:border-cyan-400/50">
        <input
          type="number" inputMode="decimal" min="0" step={step} value={value} placeholder="0.00"
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 text-lg font-semibold text-white outline-none placeholder:text-slate-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-xs font-medium text-slate-500">{unit}</span>
      </div>
      {chips.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button key={c.label} type="button" data-hover="btn" onClick={() => onChange(String(c.value))}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200">
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Scrollable list of choices; the selected one is scrolled into view when the modal opens. */
function OptionList({ options, value, onChange }) {
  const listRef = useRef(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector('[data-selected="true"]');

    if (list && el) {
      list.scrollTop = Math.max(0, el.offsetTop - 8);
    }
  }, []);

  return (
    <div
      ref={listRef}
     className="
        scrollbar-hide
        relative
        grid
        max-h-64
        gap-2
        overflow-y-auto
        overscroll-contain
        pr-1
        cursor-grab
        select-none
        scroll-smooth
        "
      onWheel={(e) => {
        e.stopPropagation();

        if (listRef.current) {
          listRef.current.scrollTop += e.deltaY;
        }
      }}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          data-selected={o.id === value}
          onClick={() => onChange(o.id)}
          className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
            o.id === value
              ? "border-cyan-400/50 bg-cyan-400/[0.06]"
              : "border-white/10 bg-white/[0.02] hover:border-white/20"
          }`}
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white">
              {o.title}
            </span>

            <span className="block text-xs text-slate-500">
              {o.sub}
            </span>
          </span>

          <span className="shrink-0 text-xs tabular-nums text-slate-400">
            {o.meta}
          </span>
        </button>
      ))}
    </div>
  );
}

const InfoList = ({ children }) => <div className="divide-y divide-white/5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4">{children}</div>;
const InfoRow = ({ label, value, accent = "text-slate-100" }) => (
  <div className="flex items-center justify-between py-2.5 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium tabular-nums ${accent}`}>{value}</span>
  </div>
);
const FormError = ({ children }) => (children ? <p className="text-xs text-rose-300">{children}</p> : null);

function InvestForm({ ctx, initialId, done }) {
  const funds = ctx.funds || [];
  const [id, setId] = useState(initialId || funds[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fund = funds.find((f) => f.id === id);

  if (!fund) {
    return <p className="py-10 text-center text-sm text-slate-500">No active funds are available right now.</p>;
  }

  const nav = ctx.navs[id] || fund.nav || 0;
  const amt = Math.max(0, parseFloat(amount) || 0);
  const investmentAmount = amt * FAIX_TOKEN_VALUE;
  const units = nav > 0 ? investmentAmount / nav : 0;
  const error = busy || !amt ? ""
    : amt > ctx.faix ? "Investment is higher than your available FAIX."
    : fund.min > 0 && amt < fund.min ? `Minimum for this fund is ${fmt0(fund.min)} FAIX.`
    : nav <= 0 ? "This fund has no valid NAV yet." : "";
  const valid = amt > 0 && !error;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setSubmitError("");

    try {
      await ctx.actions.investInFund({ fund, amount: amt, units });
      done();
    } catch (error) {
      setBusy(false);
      setSubmitError(error?.message || "Investment failed.");
    }
  };

  return (
    <div className="space-y-5">
      <OptionList value={id} onChange={setId}
        options={funds.map((f) => ({ id: f.id, title: f.name, sub: f.category, meta: `NAV ${fmt(ctx.navs[f.id] || f.nav, 4)}` }))} />
      <AmountField label="FAIX tokens to invest" unit="FAIX" value={amount} onChange={setAmount} hint={`Min ${fmt0(fund.min)}`}
        chips={[1000, 5000, 10000].filter((v) => v <= ctx.faix).map((v) => ({ label: fmt0(v), value: v })).concat({ label: "Max", value: Math.floor(ctx.faix) })} />
      <InfoList>
        <InfoRow label="Current NAV" value={`${fmt(nav, 4)} / unit`} />
        <InfoRow label="Investment value" value={`₹${fmt(investmentAmount, 2)}`} accent="text-[#e2c17f]" />
        <InfoRow label="Units you receive" value={fmt(units, 4)} accent="text-cyan-300" />
        <InfoRow label="Available FAIX" value={fmt(ctx.faix)} />
        <InfoRow label="Balance after" value={amt > 0 && amt <= ctx.faix ? fmt(ctx.faix - amt) : "-"} />
      </InfoList>
      <FormError>{submitError || error}</FormError>
      <button type="button" data-hover="btn" disabled={!valid || busy} onClick={submit} className={`${BTN.gold} w-full`}>
        <Check className="h-4 w-4" /> {busy ? "Processing..." : "Confirm investment"}
      </button>
    </div>
  );
}

function PropertyForm({ ctx, initialId, done }) {
  const properties = ctx.properties || [];
  const [id, setId] = useState(initialId || properties.find((p) => p.available > 0)?.id || properties[0]?.id || "");
  const [qtyText, setQtyText] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const property = properties.find((p) => p.id === id);

  if (!property) return <p className="py-10 text-center text-sm text-slate-500">No properties are available right now.</p>;

  const qty = Math.max(0, Math.floor(parseFloat(qtyText) || 0));
  const amount = qty * property.tokenPrice;
  const maxQty = Math.max(0, Math.min(property.available, Math.floor(ctx.faix / (property.tokenPrice || 1))));
  const error = busy || !qty ? "" : qty > property.available ? `Only ${fmt0(property.available)} tokens are available.` : amount > ctx.faix ? "Purchase amount is higher than your available FAIX." : "";
  const valid = qty > 0 && !error;

  const submit = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setSubmitError("");
    try {
      await ctx.actions.buyProperty({ property, qty, amount });
      done();
    } catch (error) {
      setBusy(false);
      setSubmitError(error?.message || "Purchase failed.");
    }
  };

  return (
    <div className="space-y-5">
      <OptionList value={id} onChange={setId}
        options={properties.map((p) => ({ id: p.id, title: p.name, sub: p.location, meta: `${fmt0(p.tokenPrice)} FAIX / token` }))} />
      <AmountField label="FAIX token quantity" unit="tokens" step={1} value={qtyText} onChange={setQtyText} hint={`${fmt0(property.available)} available`}
        chips={[1, 5, 10].filter((v) => v <= maxQty).map((v) => ({ label: String(v), value: v })).concat({ label: "Max", value: maxQty })} />
      <InfoList>
        <InfoRow label="Token value" value={`${fmt0(property.tokenPrice)} FAIX`} />
        <InfoRow label="Purchase amount" value={`${fmt(amount)} FAIX`} accent="text-[#e2c17f]" />
        <InfoRow label="Ownership share" value={`${((qty / (property.total || 1)) * 100).toFixed(4)}%`} />
        <InfoRow label="Available FAIX" value={fmt(ctx.faix)} />
      </InfoList>
      <FormError>{submitError || error}</FormError>
      <button type="button" data-hover="btn" disabled={!valid || busy} onClick={submit} className={`${BTN.gold} w-full`}>
        <Check className="h-4 w-4" /> {busy ? "Processing..." : "Confirm purchase"}
      </button>
    </div>
  );
}

const MODAL_CFG = {
  invest: { title: "Invest in fund", subtitle: "Units are allocated at the current NAV.", icon: TrendingUp, tone: "cyan" },
  property: { title: "Buy property tokens", subtitle: "Own a fraction of the property with FAIX.", icon: Building2, tone: "gold" },
};

function ActionModal({ modal, ctx, onClose }) {
  const cfg = MODAL_CFG[modal.type];
  return (
    <Modal {...cfg} onClose={onClose}>
      {(done) => modal.type === "invest"
        ? <InvestForm ctx={ctx} initialId={modal.id} done={done} />
        : <PropertyForm ctx={ctx} initialId={modal.id} done={done} />}
    </Modal>
  );
}

/* ────────────────────────────── the page ────────────────────────────── */

const DEDICATED_PAGES = ["Investments", "Properties", "Users", "Wallet", "Transactions", "Exchange"];
const SECTION_IDS = { Dashboard: "dashboard", Portfolio: "portfolio" };

function Dashboard({ onNavigateAway = () => {}, initialSection = "Dashboard", lenisRef }) {
  const logout = useLogout();
  const root = useRef(null);
  const chartWrap = useRef(null);
  const notifRef = useRef(null);
  const fundsCar = useCarousel();
  const propsCar = useCarousel();

  // Portfolio state
  const [faix, setFaix] = useState(0);
  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [fundPos, setFundPos] = useState({});
  const [propPos, setPropPos] = useState({});
  const [funds, setFunds] = useState([]);
  const [properties, setProperties] = useState([]);
  const [navs, setNavs] = useState({});
  const [txs, setTxs] = useState([]);

  // Dashboard API state
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const refreshDashboard = useCallback(async () => {
    try {
      setDashboardLoading(true);

      const [dashboardResult, fundsResult, investmentsResult, propertiesResult] =
        await Promise.allSettled([
          get("/dashboard"),
          get("/funds"),
          get("/funds/investments"),
          get("/properties"),
        ]);

      if (dashboardResult.status === "rejected") throw dashboardResult.reason;

      const data = dashboardResult.value?.data || null;
      setDashboardData(data);

      const apiFunds =
        fundsResult.status === "fulfilled"
          ? fundsResult.value?.data?.funds || []
          : data?.topFunds || [];

      const fundInvestments =
        investmentsResult.status === "fulfilled"
          ? investmentsResult.value?.data?.investments || []
          : [];

      const allProperties =
        propertiesResult.status === "fulfilled"
          ? propertiesResult.value?.data?.properties || []
          : data?.topProperties || [];

      setFunds(apiFunds.map(mapApiFund));
      setProperties(allProperties.map(mapApiProperty));

      const nextFundPositions = Object.fromEntries(
        fundInvestments.map((item) => {
          const fundKey = String(
            item?.fund?._id || item?.fund || item?.fundId || item?._id || ""
          );
          return [
            fundKey,
            {
              units: Number(item?.units) || 0,
              tokens: Number(item?.faixTokenUsed) || 0,
              cost: Number(item?.faixTokenUsed) || 0,
              investmentAmount: Number(item?.investmentAmount) || 0,
              nav: Number(item?.nav) || 0,
            },
          ];
        }).filter(([key]) => key && key !== "undefined"),
      );

      setFundPos(nextFundPositions);
      setDashboardError("");
      return data;
    } catch (error) {
      setDashboardError(error?.message || "Unable to load dashboard data.");
      throw error;
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard().catch(() => {});
  }, [refreshDashboard]);

  const apiWelcome = dashboardData?.welcome || {};
  const apiSummary = dashboardData?.summary || {};

  const apiTotal = Number(
    apiSummary.totalAmount ?? apiWelcome.totalFaixToken ?? 0
  ) || 0;
  const apiUsed = Number(
    apiSummary.usedAmount ?? apiWelcome.usedFaixToken ?? 0
  ) || 0;
  const apiAvailable = Number(
    apiSummary.availableFaixToken ?? apiWelcome.availableFaixToken ?? 0
  ) || 0;
  const apiProfit = Number(
    apiSummary.totalProfitAmount ?? apiWelcome.totalProfitAmount ?? 0
  ) || 0;
  const apiMonthlyGrowth = Number(apiSummary.monthlyGrowthPercent ?? 0) || 0;
  const apiPropertiesCount = Number(apiWelcome.propertiesCount) || 0;
  const apiFundsCount = Number(apiWelcome.fundsJoinedCount) || 0;
  const investorName = apiWelcome.fullName || "Investor";

  useEffect(() => {
    if (!dashboardData) return;

    const nextTransactions = (dashboardData.transactionHistory?.records || []).map(mapApiTransaction);

    setFaix(apiAvailable);
    setPortfolioTotal(apiTotal);
    setNavs((current) =>
      Object.fromEntries(funds.map((fund) => [fund.id, fund.nav]))
    );
    setTxs(nextTransactions);
    setUnread(0);
  }, [dashboardData, apiAvailable, apiTotal, funds]);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activePage, setActivePage] = useState(initialSection);

  // Investments, Properties, Wallet, Exchange and Transactions have their own
  // dedicated pages (see App.jsx) — hand navigation to those off up the tree.
  // Dashboard and Portfolio stay as smooth-scrolls to sections on this page.
  const scrollToSection = useCallback((page) => {
    const id = SECTION_IDS[page];
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(el, { offset: -20 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [lenisRef]);
  const handleNavigate = useCallback((page) => {
    if (DEDICATED_PAGES.includes(page)) {
      onNavigateAway(page);
      return;
    }
    if (!SECTION_IDS[page]) {
      // Notifications / Settings / Help / Profile have no page yet — ignore
      // instead of highlighting a nav item that shows nothing new.
      return;
    }
    setActivePage(page);
    scrollToSection(page);
  }, [onNavigateAway, scrollToSection]);

  // Arriving from another page (e.g. Wallet -> Portfolio): jump to that section once.
  useEffect(() => {
    if (initialSection === "Dashboard") return;
    const t = setTimeout(() => scrollToSection(initialSection), 350);
    return () => clearTimeout(t);
  }, [initialSection, scrollToSection]);

  // UI state
  const [range, setRange] = useState("monthly");
  const [offset, setOffset] = useState(0);
  const [animateChart, setAnimateChart] = useState(true);
  const [modal, setModal] = useState(null);
  const [activeSlice, setActiveSlice] = useState(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null);

  /* ── derived portfolio numbers ── */
  const { fundsValue, fundsCost, propsValue, propsCost } = useMemo(() => {
    let fv = 0, fc = 0, pv = 0, pc = 0;
    funds.forEach((f) => {
      const p = fundPos[f.id];
      if (p) {
        const currentNav = navs[f.id] || f.nav || p.nav || 0;
        const currentMoneyValue = p.units * currentNav;
        fv += currentMoneyValue / FAIX_TOKEN_VALUE;
        fc += p.cost;
      }
    });
    properties.forEach((p) => {
      const h = propPos[p.id];
      if (h) {
        pv += h.tokens * p.tokenPrice;
        pc += h.cost;
      }
    });
    return { fundsValue: fv, fundsCost: fc, propsValue: pv, propsCost: pc };
  }, [funds, fundPos, navs, propPos, properties]);

  const total = portfolioTotal;
  const holdings = Math.max(0, total - faix);
  const invested = Math.max(apiUsed, holdings);
  const returns = apiProfit;
  const returnsPct = invested ? (returns / invested) * 100 : 0;
  const fundCount = Math.max(
    apiFundsCount,
    Object.values(fundPos).filter((p) => p.units > 0).length
  );
  const propCount = Math.max(
    apiPropertiesCount,
    Object.values(propPos).filter((p) => p.tokens > 0).length
  );
  const tokenCount = Object.values(propPos).reduce((s, p) => s + p.tokens, 0);
  const positions = fundCount + propCount;
  const pctOf = (part, whole) => (whole ? (part / whole) * 100 : 0);

  /* ── chart ── */
  const apiHistory = dashboardData?.portfolioHistory || dashboardData?.portfolioGrowth || [];
  const series = useMemo(() => buildSeries(range, offset, total, apiHistory), [range, offset, total, apiHistory]);
  const monthly = useMemo(() => buildSeries("monthly", 0, total, apiHistory).data, [total, apiHistory]);
  const monthGrowth = apiMonthlyGrowth;
  const monthChange = apiMonthlyGrowth > -100 && total > 0
    ? total - total / (1 + apiMonthlyGrowth / 100)
    : 0;

  const vals = series.data.map((d) => d.value);
  const first = vals[0] || 0;
  const last = vals[vals.length - 1] || total;
  const growth = apiMonthlyGrowth;
  const peak = Math.max(...vals);
  const [yMin, yMax] = useMemo(() => {
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * 0.2 || hi * 0.01 || 1;
    return [Math.floor((lo - pad) / 100) * 100, Math.ceil((hi + pad) / 100) * 100];
  }, [series, vals]); // eslint-disable-line react-hooks/exhaustive-deps
  const investTxs = txs.filter((t) => t.type === "Investment" || t.type === "Buy");
  const avgInvestment = investTxs.length ? investTxs.reduce((s, t) => s + Math.abs(t.amount), 0) / investTxs.length : 0;

  const alloc = [
    { name: "Invested", value: invested, color: C.cyan },
    { name: "Available", value: faix, color: C.gold },
  ];

  /* ── actions ── */
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const actions = {
    investInFund: async ({ fund, amount }) => {
      const response = await post("/funds/invest", {
        fundName: fund.name,
        investmentAmount: amount * FAIX_TOKEN_VALUE,
        faixTokenUsed: amount,
      });
      await refreshDashboard();
      notify(`Invested ${fmt(amount)} FAIX in ${fund.name}`);
      return response;
    },
    buyProperty: async ({ property, qty }) => {
      if (!property.name) throw new Error("Property name is missing.");
      const response = await post("/properties/purchase", {
        propertyName: property.name,
        purchasedFaixToken: qty,
      });
      await refreshDashboard();
      notify(`Bought ${fmt0(qty)} tokens of ${property.name}`);
      return response;
    },
  };
  const ctx = { faix, navs, fundPos, funds, properties, propPos, actions };

  /* ── animation ── */
  useLayoutEffect(() => {
    const ctxG = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out", clearProps: "transform,opacity" } })
        .from("[data-anim=header]", { y: -18, opacity: 0, duration: 0.7 })
        .from("[data-anim=action]", { y: 14, opacity: 0, duration: 0.5, stagger: 0.06 }, "-=0.3")
        .from("[data-anim=stat]", { y: 22, opacity: 0, duration: 0.6, stagger: 0.07 }, "-=0.3")
        .from("[data-anim=chart]", { y: 26, opacity: 0, duration: 0.7 }, "-=0.35")
        .from("[data-anim=section]", { y: 22, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.45");
    }, root);
    return () => ctxG.revert();
  }, []);

  // Redraw the chart smoothly whenever the filter or period changes.
  useEffect(() => {
    setAnimateChart(true);
    if (chartWrap.current) gsap.fromTo(chartWrap.current, { opacity: 0.35, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" });
    const t = setTimeout(() => setAnimateChart(false), 1100);
    return () => clearTimeout(t);
  }, [range, offset]);

  // Hover micro-interactions (delegated so they also apply to elements added later).
  useEffect(() => {
    const el = root.current;
    const move = (e, enter) => {
      const t = e.target.closest?.("[data-hover]");
      if (!t || !el.contains(t) || t.disabled || t.contains(e.relatedTarget)) return;
      if (t.dataset.hover === "btn") gsap.to(t, { scale: enter ? 1.03 : 1, duration: 0.2, overwrite: "auto" });
      else gsap.to(t, { y: enter ? -4 : 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    };
    const over = (e) => move(e, true);
    const out = (e) => move(e, false);
    el.addEventListener("mouseover", over);
    el.addEventListener("mouseout", out);
    return () => { el.removeEventListener("mouseover", over); el.removeEventListener("mouseout", out); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!notifOpen) return;
    const h = (e) => { if (!notifRef.current?.contains(e.target)) setNotifOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [notifOpen]);

  /* ── view data ── */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const q = query.trim().toLowerCase();
  const visibleTxs = txs.filter((t) => `${t.asset} ${t.type} ${t.status}`.toLowerCase().includes(q)).slice(0, 8);

  /* ── top 5 leaderboards ── */
  const topProperties = [...properties]
    .sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0))
    .slice(0, 5);
  const topFunds = [...funds]
    .sort((a, b) => (Number(b.soldUnits) || 0) - (Number(a.soldUnits) || 0))
    .slice(0, 5);
  const topUsers = (dashboardData?.topInvestors?.list || []).slice(0, 5).map((u) => ({
    id: u.id,
    userId: u.userId || u.shortUserId || u.id,
    name: u.fullName,
    initials: u.initials,
    invested: Number(u.usedFaixToken) || 0,
    returns: Number(u.monthlyGrowthPercent) || 0,
    propertiesCount: Number(u.propertiesCount) || 0,
    fundsJoinedCount: Number(u.fundsJoinedCount) || 0,
  }));
  const topInvestments = [
    ...funds.filter((f) => fundPos[f.id]).map((f) => ({
      id: `fund-${f.id}`, kind: "Fund", name: f.name, sub: f.category, icon: f.icon,
      value: (fundPos[f.id].units * (navs[f.id] || f.nav || fundPos[f.id].nav || 0)) / FAIX_TOKEN_VALUE,
      cost: fundPos[f.id].cost,
    })),
    ...properties.filter((p) => propPos[p.id]).map((p) => ({
      id: `prop-${p.id}`, kind: "Property", name: p.name, sub: p.location, icon: Building2,
      value: propPos[p.id].tokens * p.tokenPrice, cost: propPos[p.id].cost,
    })),
  ]
    .map((i) => ({ ...i, gain: pctOf(i.value - i.cost, i.cost) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const AVATAR_TONES = [ACCENT.cyan, ACCENT.gold, ACCENT.violet, ACCENT.emerald, ACCENT.cyan];

  const fundsReturn = pctOf(fundsValue - fundsCost, fundsCost);
  const propsReturn = pctOf(propsValue - propsCost, propsCost);
  const stats = [
    { label: "Total portfolio value", value: total, unit: "FAIX", icon: Landmark, tone: "gold", change: monthGrowth, note: "Current total FAIX value" },
    { label: "Available FAIX", value: faix, unit: "FAIX", icon: Wallet, tone: "cyan", badge: `${pctOf(faix, total).toFixed(1)}% liquid`, note: "Ready to deploy" },
    { label: "Invested amount", value: invested, unit: "FAIX", icon: Briefcase, tone: "violet", badge: `${pctOf(invested, total).toFixed(1)}% of total`, note: `Across ${positions} positions` },
    { label: "Total returns", value: returns, unit: "FAIX", icon: TrendingUp, tone: "emerald", change: returnsPct, note: "Total profit" },
    { label: "Properties", value: propCount, unit: "", fmt: (n) => String(Math.round(n)), icon: Building2, tone: "gold", change: propsReturn, note: `${fmt0(tokenCount)} tokens owned` },
    { label: "Fund investments", value: fundCount, unit: "", fmt: (n) => String(Math.round(n)), icon: PieChartIcon, tone: "cyan", change: fundsReturn, note: `${apiFundsCount} funds joined` },
  ];
  const kpis = [
    { label: "Total profit", value: fmt0(apiProfit), unit: "FAIX", icon: Coins, tone: "gold", note: "Profit earned" },
    { label: "Monthly growth", value: signedPct(apiMonthlyGrowth), icon: TrendingUp, tone: apiMonthlyGrowth >= 0 ? "emerald" : "violet", note: "From dashboard API" },
    { label: "Used amount", value: fmt0(invested), unit: "FAIX", icon: Briefcase, tone: "cyan", note: `${investTxs.length} API activity records` },
    { label: "Portfolio value", value: fmt0(total), unit: "FAIX", icon: Activity, tone: "violet", note: "Current value" },
  ];
  const summaryRows = [
    { label: "Invested", value: `${fmt(invested)} FAIX`, icon: Briefcase, tone: "violet" },
    { label: "Available", value: `${fmt(faix)} FAIX`, icon: Wallet, tone: "cyan" },
    { label: "Returns", value: `${returns >= 0 ? "+" : ""}${fmt(returns)} FAIX`, icon: TrendingUp, tone: "emerald", accent: returns >= 0 ? "text-emerald-300" : "text-rose-300" },
    { label: "Holdings", value: `${positions} positions, ${fmt0(holdings)} FAIX`, icon: Layers, tone: "gold" },
  ];

  return (
      <>
    <NavigationPanel
      active={activePage}
      onNavigate={handleNavigate}
      onLogout={logout}
      onExpandChange={setSidebarExpanded}
      userName={investorName}
      profileImage={dashboardData?.welcome?.profileImage || ""}
    />
    <div
  id="dashboard"
  ref={root}
  className={`min-h-screen bg-[#05080d] text-slate-200 antialiased
    transition-[margin] duration-300
    ${sidebarExpanded ? "md:ml-[250px]" : "md:ml-[76px]"}`}
  style={{ backgroundImage: BG }}
>
      <style>{STYLES}</style>
      <div className="mx-auto max-w-[1440px] space-y-6 px-4 pb-6 pt-[88px] sm:px-6 md:py-6 lg:px-8">
        {/* ───────── hero ───────── */}
        <header data-anim="header" className="mt-dark-zone relative z-30 rounded-3xl border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          {/* background layers (clipped separately so the notification dropdown can overflow the hero) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl bg-[#080d15]" aria-hidden>
            <Photo src={IMAGES.hero} eager className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(105deg,#05080d_12%,rgba(5,8,13,0.88)_44%,rgba(5,8,13,0.45)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05080d]/80 to-transparent" />
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#d4af6a]/10 blur-3xl" />
          </div>

          <div className="relative p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
                  <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#e2c17f] to-cyan-400/60 opacity-80" />
                  <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-2 border-[#05080d] bg-[#1a1710] text-sm font-semibold text-[#e2c17f]">
                    {initials(investorName)}
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#05080d] bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{greeting}</p>
                  <h1 className="text-xl font-semibold text-white sm:text-2xl">{investorName}</h1>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#e2c17f]"><ShieldCheck className="h-3 w-3" />Verified investor</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" aria-label="Search transactions" onClick={() => { setSearchOpen((o) => !o); setQuery(""); }} className={`${ICON_BTN} ${searchOpen ? "border-cyan-400/40 text-cyan-200" : ""}`}>
                  <Search className="h-[18px] w-[18px]" />
                </button>
               <div ref={notifRef} className="relative">
  <button
    type="button"
    aria-label="Notifications"
    onClick={() => {
      setNotifOpen((o) => !o);
      setUnread(0);
    }}
    className={`${ICON_BTN} ${
      notifOpen ? "border-cyan-400/40 bg-cyan-400/[0.06] text-cyan-200" : ""
    }`}
  >
    <Bell className="h-[18px] w-[18px]" />

    {unread > 0 && (
      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-400 px-1 text-[9px] font-bold text-white ring-2 ring-[#05080d]">
        {unread}
      </span>
    )}
  </button>

  {notifOpen && (
    <div className="absolute right-0 z-50 mt-3 w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1019] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-white">
            Notifications
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Latest account activity
          </p>
        </div>

        <span className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] font-medium text-cyan-300 ring-1 ring-cyan-400/20">
          {txs.length} updates
        </span>
      </div>

      {/* Notifications */}
      <div className="max-h-[340px] overflow-y-auto scrollbar-hide p-2">
        {txs.slice(0, 5).map((t) => {
          const { icon: Icon, tone } = TX_META[t.type] || TX_META.Investment;

          return (
            <div
              key={t.id}
              className="group flex gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.035]"
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-100">
                    {t.asset}
                  </p>

                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                      t.status === "Completed"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="mt-1 truncate text-[11px] text-slate-500">
                  {t.type} • {fmt0(Math.abs(t.amount))} FAIX
                </p>

                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-600">
                  <Clock className="h-3 w-3" />
                  {fmtDate(t.date)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-2.5 text-center">
        <button
          type="button"
          onClick={() => setNotifOpen(false)}
          className="text-[11px] font-medium text-cyan-300 transition hover:text-cyan-200"
        >
          Close notifications
        </button>
      </div>
    </div>
  )}
</div>

              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:mt-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
              <div>
                <p className="text-sm text-slate-300">Your portfolio is worth</p>
                <p className="mt-2 text-4xl font-semibold tabular-nums text-white sm:text-5xl">
                  <AnimatedNumber value={total} format={fmt0} />
                  <span className="ml-2 text-base font-medium text-slate-400 sm:text-lg">FAIX</span>
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Delta value={monthGrowth} />
                  <span className="text-xs text-slate-400">over the last 30 days</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200 backdrop-blur">
                    <ShieldCheck className={`h-3.5 w-3.5 ${monthGrowth >= 0 ? "text-emerald-300" : "text-rose-300"}`} />
                    {monthGrowth >= 0 ? "Performing well" : "Below trend"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-md">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Last 30 days</p>
                    <p className="text-lg font-semibold tabular-nums text-white">
                      {monthChange >= 0 ? "+" : "−"}{fmt0(Math.abs(monthChange))} <span className="text-xs font-normal text-slate-500">FAIX</span>
                    </p>
                  </div>
                  <p className="text-right text-[11px] text-slate-500">Liquid {pctOf(faix, total).toFixed(1)}%<br />Invested {pctOf(holdings, total).toFixed(1)}%</p>
                </div>
                <div className="mt-2 h-24 w-full [&_*]:outline-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthly} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis hide dataKey="label" />
                      <YAxis hide domain={["dataMin", "dataMax"]} />
                      <Area dataKey="value" type="monotone" stroke={C.cyan} strokeWidth={2} fill="url(#heroFill)" dot={false} activeDot={false} isAnimationActive={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </header>

        {searchOpen && (
          <div className="flex items-center gap-3 rounded-xl border border-cyan-400/30 bg-[#0a1019] px-4">
            <Search className="h-4 w-4 text-slate-500" />
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions by asset, type or status"
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600" />
            {query && <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="text-slate-500 hover:text-white"><X className="h-4 w-4" /></button>}
          </div>
        )}

        {dashboardError && (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm text-rose-200">
            {dashboardError}
          </div>
        )}

        {dashboardLoading && !dashboardData && (
          <div className="rounded-xl border border-white/[0.06] bg-[#0a1019]/80 px-4 py-3 text-sm text-slate-500">
            Loading dashboard data...
          </div>
        )}

                {/* ───────── portfolio overview ───────── */}
          <section
            aria-label="Portfolio overview"
            className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                data-anim="stat"
                data-hover="lift"
                className={`${CARD} p-4 transition-colors hover:border-white/15`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${ACCENT[s.tone]}`}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                  {s.change != null ? (
                    <Delta value={s.change} />
                  ) : (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                      {s.badge}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-xs text-slate-400">{s.label}</p>
                <p className="mt-1 whitespace-nowrap text-[22px] font-semibold leading-none tabular-nums text-white">
                  <AnimatedNumber value={s.value} format={s.fmt || fmt0} />
                  {s.unit && (
                    <span className="ml-1 text-xs font-medium text-slate-500">
                      {s.unit}
                    </span>
                  )}
                </p>
                <p className="mt-2 truncate text-[11px] text-slate-500">
                  {s.note}
                </p>
              </div>
            ))}
          </section>

        <div className="grid items-start gap-6 xl:grid-cols-3">
          <div className="min-w-0 space-y-6 xl:col-span-2">
        {/* ───────── quick actions ───────── */}
        <section id="exchange" aria-label="Quick actions" className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.key} type="button" data-anim="action" data-hover="lift" onClick={() => (a.key === "exchange" ? onNavigateAway("Exchange") : a.key === "deposit" ? onNavigateAway("Wallet") : setModal({ type: a.key }))}
              className={`${CARD} flex items-center gap-3 p-4 text-left transition-colors hover:border-white/15`}>
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT[a.tone]}`}><a.icon className="h-5 w-5" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">
                  {a.label}
                  {a.key === "exchange" && <>{" "}<span className="rounded-full bg-[#d4af6a]/15 px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wide text-[#e2c17f]">Open</span></>}
                </span>
                <span className="hidden text-xs text-slate-500 sm:block">{a.key === "exchange" ? "Open exchange" : a.key === "deposit" ? "Open wallet to add funds" : a.hint}</span>
              </span>
            </button>
          ))}
        </section>

          <section data-anim="chart" className={`${CARD} p-5 sm:p-6 xl:col-span-2`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">Portfolio growth</h2>
                  {offset === 0 && dashboardData ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      </span>
                      LIVE
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">Past period</span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <p className="text-3xl font-semibold tabular-nums text-white">
                    <AnimatedNumber value={last} format={fmt0} />
                    <span className="ml-1.5 text-sm font-medium text-slate-500">FAIX</span>
                  </p>
                  <Delta value={growth} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.02]">
                  <button type="button" aria-label="Earlier period" disabled={offset >= MAX_OFFSET} onClick={() => setOffset((o) => o + 1)} className="p-2.5 text-slate-400 transition-colors hover:text-white disabled:opacity-30">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="flex min-w-[9.5rem] items-center justify-center gap-2 px-1 text-xs text-slate-300">
                    <CalendarDays className="h-3.5 w-3.5 text-[#d4af6a]" />{series.rangeText}
                  </span>
                  <button type="button" aria-label="Later period" disabled={offset === 0} onClick={() => setOffset((o) => o - 1)} className="p-2.5 text-slate-400 transition-colors hover:text-white disabled:opacity-30">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div role="group" aria-label="Time filter" className="flex rounded-xl border border-white/10 bg-white/[0.02] p-1">
                  {Object.entries(RANGES).map(([key, r]) => (
                    <button key={key} type="button" aria-pressed={range === key} onClick={() => { setRange(key); setOffset(0); }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${range === key ? "bg-cyan-400/15 text-cyan-200" : "text-slate-400 hover:text-white"}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-2"><span className="h-0.5 w-5 rounded bg-cyan-400" />Portfolio value</span>
              <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-[#d4af6a]" />Baseline</span>
            </div>

            <div ref={chartWrap} className="mt-3 h-[280px] w-full sm:h-[340px] lg:h-[380px] [&_*]:outline-none">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart key={`${range}-${offset}`} data={series.data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.cyan} stopOpacity={0.26} />
                      <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }} minTickGap={24} dy={8} />
                  <YAxis domain={[yMin, yMax]} width={52} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(v)} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(34,211,238,0.35)", strokeDasharray: "3 3" }} />
                  <Line dataKey="baseline" type="linear" stroke={C.gold} strokeWidth={1.25} strokeDasharray="5 5" strokeOpacity={0.7} dot={false} activeDot={false} isAnimationActive={false} />
                  <Area dataKey="value" type="monotone" stroke={C.cyan} strokeWidth={2.25} fill="url(#pvFill)"
                    activeDot={{ r: 5, fill: "#05080d", stroke: C.cyan, strokeWidth: 2 }}
                    isAnimationActive={animateChart} animationDuration={900} animationEasing="ease-out" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

      <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2 xl:grid-cols-4">
  {kpis.map((k) => (
    <div
      key={k.label}
      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0b121c] px-4 py-3 transition-all duration-200 hover:border-white/[0.12] hover:bg-[#0d1520]"
    >
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-slate-500">
          {k.label}
        </p>

        <div className="mt-1.5 flex min-w-0 items-baseline gap-1.5">
          <span className="truncate text-lg font-semibold leading-none text-white">
            {k.value}
          </span>

          {k.unit && (
            <span className="shrink-0 text-[10px] text-slate-500">
              {k.unit}
            </span>
          )}
        </div>

        <p className="mt-1.5 truncate text-[10px] text-slate-500">
          {k.note}
        </p>
      </div>

      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${ACCENT[k.tone]}`}
      >
        <k.icon className="h-4 w-4" />
      </span>
    </div>
  ))}
</div>
          </section>
          </div>

          <div className="space-y-6">
            {/* asset allocation */}
            <section id="portfolio" data-anim="section" className={`${CARD} p-5`}>
              <SectionTitle icon={PieChartIcon} tone="gold" title="Asset allocation" subtitle="Current FAIX allocation" />
              <div className="relative h-56 [&_*]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={alloc} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="92%" paddingAngle={3} stroke="none"
                      startAngle={90} endAngle={-270} animationDuration={900}
                      onMouseEnter={(_, i) => setActiveSlice(i)} onMouseLeave={() => setActiveSlice(null)}>
                      {alloc.map((a, i) => (
                        <Cell key={a.name} fill={a.color} fillOpacity={activeSlice === null || activeSlice === i ? 1 : 0.3} style={{ transition: "fill-opacity .2s", cursor: "pointer" }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  {activeSlice === null ? (
                    <>
                      <p className="text-xs text-slate-500">Total portfolio</p>
                      <p className="text-xl font-semibold tabular-nums text-white">{fmt0(total)}</p>
                      <p className="text-[11px] text-slate-500">FAIX</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400">{alloc[activeSlice].name}</p>
                      <p className="text-xl font-semibold tabular-nums text-white">{pctOf(alloc[activeSlice].value, total).toFixed(1)}%</p>
                      <p className="text-[11px] tabular-nums text-slate-500">{fmt0(alloc[activeSlice].value)} FAIX</p>
                    </>
                  )}
                </div>
              </div>
              <ul className="mt-3 space-y-1">
                {alloc.map((a, i) => (
                  <li key={a.name} onMouseEnter={() => setActiveSlice(i)} onMouseLeave={() => setActiveSlice(null)}
                    className={`flex cursor-default items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${activeSlice === i ? "bg-white/[0.04]" : ""}`}>
                    <span className="flex items-center gap-2.5 text-slate-300"><span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />{a.name}</span>
                    <span className="tabular-nums text-slate-400">
                      <span className="mr-3 text-xs text-slate-500">{fmt0(a.value)}</span>
                      <span className="font-medium text-white">{pctOf(a.value, total).toFixed(1)}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* portfolio summary */}
            <section id="wallet" data-anim="section" className={`${CARD} p-5`}>
              <SectionTitle icon={Landmark} tone="cyan" title="Portfolio summary" right={<ViewAllButton label="Open wallet" onClick={() => onNavigateAway("Wallet")} />} />
              <p className="text-xs text-slate-400">Current balance</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
                <AnimatedNumber value={total} format={fmt} />
                <span className="ml-1.5 text-sm font-medium text-slate-500">FAIX</span>
              </p>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/5" aria-hidden>
                <div className="bg-cyan-400/80 transition-[width] duration-700" style={{ width: `${pctOf(holdings, total)}%` }} />
                <div className="flex-1 bg-[#d4af6a]/70" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>Invested {pctOf(holdings, total).toFixed(1)}%</span>
                <span>Cash {pctOf(faix, total).toFixed(1)}%</span>
              </div>
              <ul className="mt-4 divide-y divide-white/5">
                {summaryRows.map((r) => (
                  <li key={r.label} className="flex items-center justify-between gap-3 py-3">
                    <span className="flex items-center gap-3 text-sm text-slate-400">
                      <span className={`grid h-8 w-8 place-items-center rounded-lg ring-1 ${ACCENT[r.tone]}`}><r.icon className="h-4 w-4" /></span>
                      {r.label}
                    </span>
                    <span className={`text-right text-sm font-medium tabular-nums ${r.accent || "text-slate-100"}`}>{r.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
        </div>

        {/* ───────── top performers ───────── */}
        <section
          id="leaders"
          aria-label="Top performers"
          className="mx-4 sm:mx-6 lg:mx-8"
        >
          <SectionTitle
            icon={Trophy}
            tone="gold"
            title="Top performers"
            subtitle="Leading properties, investors, funds and investments"
          />

          <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-4">

            {/* TOP PROPERTIES */}
            <div data-anim="section" className={`${CARD} overflow-hidden`}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Top 5 Properties</p>
                    <p className="mt-1 text-[11px] text-slate-500">By property value</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25">
                    <Building2 className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {topProperties.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                    <RankBadge rank={i + 1} />

                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-[#0d1520]">
                      <Building2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-[#d4af6a]/60" />
                      {p.img && <Photo src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{p.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500">{p.location}</p>
                      <p className="mt-1 text-[10px] text-slate-600">{fmt0(p.sold)} tokens sold</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums text-white">{compact(p.value)}</p>
                      <p className="mt-1 text-[10px] text-[#d4af6a]">FAIX</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP USERS */}
            <div data-anim="section" className={`${CARD} overflow-hidden`}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Top 5 Investors</p>
                    <p className="mt-1 text-[11px] text-slate-500">By invested amount</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 bg-cyan-400/10 text-cyan-300 ring-cyan-400/20">
                    <UsersIcon className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {topUsers.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                    <RankBadge rank={i + 1} />

                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold ring-1 ${AVATAR_TONES[i % AVATAR_TONES.length]}`}>
                      {u.initials || initials(u.name)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{u.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500">User ID: {u.userId}</p>
                      <p className="mt-1 truncate text-[10px] text-slate-600">
                        {u.propertiesCount} properties · {u.fundsJoinedCount} funds
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums text-white">
                        {compact(u.invested)}
                        <span className="ml-1 text-[10px] font-normal text-slate-500">FAIX</span>
                      </p>
                      <p className={`mt-1 text-[10px] tabular-nums ${u.returns >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                        {u.returns >= 0 ? "+" : ""}{u.returns.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP FUNDS */}
            <div data-anim="section" className={`${CARD} overflow-hidden`}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Top 5 Funds</p>
                    <p className="mt-1 text-[11px] text-slate-500">By issued / sold units</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 bg-indigo-400/10 text-indigo-300 ring-indigo-400/20">
                    <Layers className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {topFunds.map((fund, i) => (
                  <div key={fund.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                    <RankBadge rank={i + 1} />

                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 bg-cyan-400/10 text-cyan-300 ring-cyan-400/20">
                      <fund.icon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{fund.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500">{fund.category}</p>
                      <p className="mt-1 truncate text-[10px] text-slate-600">
                        NAV {fmt(fund.nav, 4)} · {fmt0(fund.soldUnits)} sold
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums text-white">{fmt0(fund.soldPercent)}%</p>
                      <p className="mt-1 text-[10px] text-slate-500">{fund.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP INVESTMENTS */}
            <div data-anim="section" className={`${CARD} overflow-hidden`}>
              <div className="border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Top 5 Investments</p>
                    <p className="mt-1 text-[11px] text-slate-500">Your largest positions</p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 bg-indigo-400/10 text-indigo-300 ring-indigo-400/20">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {topInvestments.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <TrendingUp className="mx-auto h-7 w-7 text-slate-600" />
                  <p className="mt-3 text-sm text-slate-500">No investments yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {topInvestments.map((inv, i) => (
                    <div key={inv.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
                      <RankBadge rank={i + 1} />

                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ${inv.kind === "Fund" ? ACCENT.cyan : ACCENT.gold}`}>
                        <inv.icon className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{inv.name}</p>
                        <p className="mt-0.5 truncate text-[10px] text-slate-500">{inv.kind} · {inv.sub}</p>
                        <p className="mt-1 text-[10px] text-slate-600">Cost {fmt0(inv.cost)} FAIX</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold tabular-nums text-white">{fmt0(inv.value)}</p>
                        <p className="mt-1 text-[10px] tabular-nums text-slate-500">{signedPct(inv.gain)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ───────── fund investments (scrollable) ───────── */}
        <section id="investments" data-anim="section" className="mx-4 sm:mx-6 my-6 lg:mx-8 my-8">
          <SectionTitle icon={Layers} tone="cyan" title="Fund investments" subtitle="Units are issued at the live NAV. Swipe or drag to see more."
            right={
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400 md:inline-flex"><Activity className="h-3 w-3 text-emerald-300" />Live NAV from API</span>
                <ViewAllButton onClick={() => onNavigateAway("Investments")} />
                <CarouselArrows c={fundsCar} label="funds" />
              </div>
            } />
          <div ref={fundsCar.ref} {...fundsCar.handlers} className={`${CAROUSEL} mt-1`}>
        {funds.length === 0 ? (
          <div className="px-2 py-10 text-sm text-slate-500">No active funds are available right now.</div>
        ) : funds.map((f) => {
  const pos = fundPos[f.id];
  const currentNav = navs[f.id] || f.nav;

  return (
    <article
      key={f.id}
      className="
        group relative w-[245px] shrink-0 overflow-hidden
        rounded-2xl border border-white/[0.07]
        bg-[#091118]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-cyan-400/25
        hover:shadow-[0_18px_45px_rgba(0,0,0,.35)]
        sm:w-[260px]
        lg:w-[275px]
      "
    >

      {/* IMAGE */}
      <div className="relative h-[105px] overflow-hidden">
        {f.img && <img
          src={f.img}
          alt={f.name}
          className="
            h-full w-full object-cover
            opacity-70
            transition duration-500
            group-hover:scale-110 group-hover:opacity-85
          "
        />}

        <div className="absolute inset-0 bg-gradient-to-t from-[#091118] via-[#091118]/30 to-black/10" />

        {/* Status */}
        <span
          className={`
            absolute right-3 top-3
            rounded-full px-2 py-1
            text-[9px] font-semibold
            backdrop-blur-md
            ring-1 ring-inset
            ${f.status === "Open" ? ACCENT.emerald : ACCENT.gold}
          `}
        >
          {f.status}
        </span>

        {/* Icon */}
        <div className="
          absolute bottom-3 left-3
          grid h-9 w-9 place-items-center
          rounded-xl
          border border-cyan-300/20
          bg-[#071017]/80
          backdrop-blur-md
        ">
          <f.icon className="h-4 w-4 text-cyan-300" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">

        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-semibold text-white">
            {f.name}
          </h3>

          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {f.category}
          </p>
        </div>

        {/* NAV */}
        <div className="
          mt-3 flex items-end justify-between
          rounded-xl border border-white/[0.05]
          bg-white/[0.02] p-3
        ">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-slate-600">
              NAV
            </p>

            <p className="mt-1 text-lg font-semibold tabular-nums text-white">
              {fmt(currentNav, 4)}
            </p>
          </div>

          <div className="text-right">
            <Delta value={f.growth} />
            <p className="mt-1 text-[9px] text-slate-600">
              1Y growth
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="mt-3 flex items-center justify-between text-[10px]">

          <div>
            <span className="text-slate-600">
              Your units
            </span>

            <p className="mt-0.5 font-medium text-slate-200">
              {pos ? fmt(pos.units, 2) : "None"}
            </p>
          </div>

          <div className="text-right">
            <span className="text-slate-600">
              Sold tokens
            </span>
            <p className="mt-0.5 font-medium text-[#e2c17f]">{fmt0(f.soldFaixToken)}</p>
            <span className="mt-1 block text-slate-600">
              Status
            </span>

            <p className="mt-0.5 flex items-center justify-end gap-1.5 text-slate-200">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  f.status === "Open"
                    ? "bg-emerald-400"
                    : "bg-amber-300"
                }`}
              />
              {f.status}
            </p>
          </div>

        </div>

        {/* INVEST */}
        <button
          type="button"
          onClick={() =>
            setModal({
              type: "invest",
              id: f.id,
            })
          }
          className="
            mt-3 flex w-full items-center
            justify-center gap-2
            rounded-xl
            border border-cyan-400/20
            bg-cyan-400/[0.06]
            py-2.5
            text-xs font-semibold
            text-cyan-300
            transition
            hover:border-cyan-300/40
            hover:bg-cyan-400/[0.12]
          "
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Invest
        </button>

      </div>
    </article>
  );
})}
          </div>
        </section>

        {/* ───────── property investment (scrollable) ───────── */}
        <section id="properties" data-anim="section" className="mx-4 sm:mx-6 lg:mx-8">
          <SectionTitle icon={Building2} tone="gold" title="Property investment" subtitle="Buy tokens that represent a share of each property. Swipe or drag to see more."
            right={
              <div className="flex items-center gap-3">
                <ViewAllButton tone="gold" onClick={() => onNavigateAway("Properties")} />
                <CarouselArrows c={propsCar} label="properties" />
              </div>
            } />
          <div ref={propsCar.ref} {...propsCar.handlers} className={`${CAROUSEL} mt-1`}>
            {properties.map((p) => {
              const held = propPos[p.id]?.tokens || 0;
              const sold = Number.isFinite(Number(p.soldPercent)) ? Number(p.soldPercent) : (p.total > 0 ? ((p.total - p.available) / p.total) * 100 : 0);
              return (
                <article key={p.id} data-hover="lift" className={`${CARD} group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden transition-colors hover:border-[#d4af6a]/25 sm:w-[310px]`}>
                  <div className="relative h-40 overflow-hidden bg-[#0d1520]">
                    <Building2 className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-[#d4af6a]/60" strokeWidth={1.25} />
                    {p.img && <Photo src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1019] via-[#0a1019]/10 to-black/40" />
                    <span className="mt-dark-zone absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] text-slate-100 backdrop-blur"><MapPin className="h-3 w-3" />{p.location}</span>
                    <span className={`absolute right-3 top-3 rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset backdrop-blur ${p.status === "Available" ? ACCENT.emerald : ACCENT.gold}`}>{p.status}</span>
                    {held > 0 && <span className="absolute bottom-3 left-3 rounded-full bg-[#d4af6a]/20 px-2.5 py-1 text-[11px] font-medium text-[#f0d69a] ring-1 ring-inset ring-[#d4af6a]/30 backdrop-blur">You own {fmt0(held)} tokens</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[15px] font-semibold text-white">{p.name}</h3>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-xs">
                      <div><dt className="text-slate-500">Property value</dt><dd className="mt-0.5 text-sm font-medium tabular-nums text-white">{compact(p.value)} FAIX</dd></div>
                      <div><dt className="text-slate-500">FAIX token value</dt><dd className="mt-0.5 text-sm font-medium tabular-nums text-white">{fmt0(p.tokenPrice)} FAIX</dd></div>
                      <div><dt className="text-slate-500">Available tokens</dt><dd className="mt-0.5 text-sm font-medium tabular-nums text-white">{fmt0(p.available)}</dd></div>
                      <div><dt className="text-slate-500">Your tokens</dt><dd className="mt-0.5 text-sm font-medium tabular-nums text-[#e2c17f]">{held ? fmt0(held) : "None yet"}</dd></div>
                    </dl>
                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-[11px] text-slate-500"><span>{fmt0(p.sold)} tokens sold</span><span className="tabular-nums">{sold.toFixed(1)}%</span></div>
                      <div className="h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-[#d4af6a]/80 transition-[width] duration-700" style={{ width: `${sold}%` }} /></div>
                    </div>
                    <button type="button" data-hover="btn" disabled={p.available === 0} onClick={() => setModal({ type: "property", id: p.id })} className={`${BTN.goldSoft} mt-5`}>
                      <Building2 className="h-4 w-4" /> {p.available === 0 ? "Sold out" : "Buy tokens"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ───────── recent transactions ───────── */}
        <section id="transactions" data-anim="section" className={`${CARD} mx-4 mb-8 overflow-hidden sm:mx-6 lg:mx-8`}>
          <div className="p-6 pb-3">
            <SectionTitle icon={Clock} tone="violet" title="Recent transactions"
              subtitle={q ? `${visibleTxs.length} results for "${query.trim()}"` : "Your latest activity"}
              right={<ViewAllButton onClick={() => onNavigateAway("Transactions")} />} />
          </div>
          <div className="hidden grid-cols-[2.2fr_1fr_1fr_1.3fr_1fr] gap-5 border-y border-white/5 px-6 py-3 text-xs text-slate-500 md:grid">
            <span>Asset</span><span>Type</span><span>Amount</span><span>Date</span><span>Status</span>
          </div>
          <ul>
            {visibleTxs.map((t) => {
              const { icon: Icon, tone } = TX_META[t.type] || TX_META.Investment;
              const pending = t.status === "Pending";
              return (
                <li key={t.id} className="grid grid-cols-[1fr_auto] items-center gap-x-5 gap-y-2 border-b border-white/5 px-6 py-4 last:border-0 md:grid-cols-[2.2fr_1fr_1fr_1.3fr_1fr]">
                  <div className="flex min-w-0 items-center gap-3 md:order-1">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${ACCENT[tone]}`}><Icon className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{t.asset}</p>
                      <p className="text-xs text-slate-500 md:hidden">{t.type}, {fmtDate(t.date)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 md:contents">
                    <span className="hidden text-sm text-slate-300 md:order-2 md:block">{t.type}</span>
                    <span className={`text-sm font-medium tabular-nums md:order-3 ${t.amount > 0 ? "text-emerald-300" : "text-slate-100"}`}>
                      {t.amount > 0 ? "+" : "−"}{fmt(Math.abs(t.amount))} <span className="text-[11px] font-normal text-slate-500">FAIX</span>
                    </span>
                    <span className="hidden text-xs text-slate-400 md:order-4 md:block">{fmtDate(t.date)}</span>
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset md:order-5 ${pending ? ACCENT.gold : ACCENT.emerald}`}>
                      {pending ? <Clock className="h-3 w-3" /> : <Check className="h-3 w-3" />}{t.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          {visibleTxs.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-slate-500">No transactions match your search. Try an asset name like "Growth" or a type like "Deposit".</p>
          )}
        </section>
      </div>

      {modal && <ActionModal key={`${modal.type}-${modal.id || ""}`} modal={modal} ctx={ctx} onClose={closeModal} />}
      {toast && <Toast key={toast.id} message={toast.message} />}
    </>
 );
}

/**
 * Client-only gate: the dashboard depends on the current time / timezone (greeting, chart labels, tx dates),
 * so it renders after mount. This avoids hydration mismatches in Next.js and is harmless in plain React.
 */
export default function UserAdmin({ onNavigateAway = () => {}, initialSection = "Dashboard" }) {
  const lenisRef = useRef(null);

    useEffect(() => {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
    autoRaf: false,
  });

  lenisRef.current = lenis;

  let rafId;

  const raf = (time) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };

  rafId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
    lenisRef.current = null;
  };
}, []);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted ? <Dashboard onNavigateAway={onNavigateAway} initialSection={initialSection} lenisRef={lenisRef} /> : <div className="min-h-screen bg-[#05080d]" />;
}