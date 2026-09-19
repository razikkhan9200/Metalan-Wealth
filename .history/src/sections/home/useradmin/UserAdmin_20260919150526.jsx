"use client";
/**
 * UserAdmin.jsx — Metalan investor dashboard (single page, dummy data only)
 *
 * Dependencies:  npm i gsap recharts lucide-react
 * Theme:         colors are Tailwind arbitrary values (#05080d base, cyan accent, #d4af6a gold).
 * Images:        Unsplash hotlinks (plain <img>, so no next/image config needed). Every image has a
 *                graceful fallback, so a dead link never breaks the layout. Swap URLs in IMAGES / PROPERTIES.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Area, CartesianGrid, Cell, ComposedChart, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Activity, ArrowDownRight, ArrowDownToLine, ArrowLeftRight, ArrowUpRight, Bell, Briefcase, Building2,
  CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Coins, Cpu, CreditCard, Landmark, Layers, Leaf, MapPin,
  PieChart as PieChartIcon, Plus, Search, ShieldCheck, TrendingUp, Wallet, X,
} from "lucide-react";


import NavigationPanel from "./NavigationPanel";

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
  "mt-hide-scroll -mx-4 flex select-none snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-4 pt-2 scroll-pl-4 sm:-mx-1 sm:px-1 sm:scroll-pl-1";

const STYLES = `
.mt-hide-scroll{
  scrollbar-width:none;
  -ms-overflow-style:none;
  cursor:grab;
  scroll-behavior:smooth;
}

.mt-hide-scroll:active{
  cursor:grabbing;
}

.mt-hide-scroll::-webkit-scrollbar{
  display:none;
  width:0;
  height:0;
}

.mt-thin{
  scrollbar-width:thin;
  scrollbar-color:rgba(255,255,255,.16) transparent;
}

.mt-thin::-webkit-scrollbar{
  height:6px;
  width:6px;
}

.mt-thin::-webkit-scrollbar-track{
  background:transparent;
}

.mt-thin::-webkit-scrollbar-thumb{
  background:rgba(255,255,255,.14);
  border-radius:999px;
}

.mt-thin::-webkit-scrollbar-thumb:hover{
  background:rgba(34,211,238,.45);
}
`;

/* ────────────────────────────── images ────────────────────────────── */

const U = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
const IMAGES = {
  hero: U("photo-1477959858617-67f85cf4f1df", 1800), // city skyline at night
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=240&h=240&q=80",
};

/* ────────────────────────────── dummy data ────────────────────────────── */

const FUNDS = [
  { id: "growth", name: "Metalan Growth Fund", category: "Equity growth", nav: 12.485, growth: 18.4, risk: "Moderate", status: "Open", min: 100, icon: TrendingUp },
  { id: "income", name: "Sovereign Income Fund", category: "Fixed income", nav: 10.213, growth: 7.2, risk: "Low", status: "Open", min: 100, icon: ShieldCheck },
  { id: "realty", name: "Prime Realty REIT Fund", category: "Real estate", nav: 24.76, growth: 11.6, risk: "Moderate", status: "Limited", min: 250, icon: Building2 },
  { id: "digital", name: "Digital Assets Alpha", category: "Digital assets", nav: 8.942, growth: 26.9, risk: "High", status: "Open", min: 100, icon: Coins },
  { id: "tech", name: "Global Tech Leaders Fund", category: "Technology equity", nav: 15.372, growth: 21.3, risk: "High", status: "Open", min: 100, icon: Cpu },
  { id: "green", name: "Green Energy Transition", category: "Sustainable energy", nav: 9.318, growth: 14.1, risk: "Moderate", status: "Open", min: 150, icon: Leaf },
];

const PROPERTIES = [
  { id: "marina", name: "Azure Marina Residences", location: "Dubai Marina, UAE", value: 4850000, tokenPrice: 250, total: 19400, available: 7420, yield: 6.2, img: U("photo-1512453979798-5ea266f8880c") },
  { id: "bkc", name: "Central Park Offices", location: "Bandra Kurla, Mumbai", value: 3200000, tokenPrice: 200, total: 16000, available: 5180, yield: 7.4, img: U("photo-1486406146926-c627a92ad1ab") },
  { id: "aldwych", name: "The Aldwych Suites", location: "Covent Garden, London", value: 6400000, tokenPrice: 500, total: 12800, available: 3960, yield: 4.9, img: U("photo-1513635269975-59663e0ac1ad") },
  { id: "palm", name: "Palm Grove Villas", location: "Phuket, Thailand", value: 1950000, tokenPrice: 150, total: 13000, available: 4310, yield: 8.1, img: U("photo-1613490493576-7fde63acd811") },
  { id: "sg", name: "Marina Bay Towers", location: "Marina Bay, Singapore", value: 5600000, tokenPrice: 400, total: 14000, available: 5230, yield: 5.4, img: U("photo-1525625293386-3f8f99389edd") },
  { id: "bali", name: "Emerald Bay Resort", location: "Ubud, Bali", value: 2300000, tokenPrice: 120, total: 19200, available: 6840, yield: 9.0, img: U("photo-1582719508461-905c673771fd") },
];

const INITIAL_FUNDS = { growth: { units: 2400, cost: 26400 }, income: { units: 3000, cost: 29700 }, realty: { units: 500, cost: 10950 } };
const INITIAL_PROPS = { marina: { tokens: 30, cost: 7200 }, bkc: { tokens: 40, cost: 7600 } };

const ago = (hours) => new Date(Date.now() - hours * 3600e3);
const SEED_TXS = [
  { id: 1, asset: "Metalan Growth Fund", type: "Investment", amount: -5000, date: ago(5), status: "Completed" },
  { id: 2, asset: "FAIX Wallet", type: "Deposit", amount: 15000, date: ago(29), status: "Completed" },
  { id: 3, asset: "Azure Marina Residences", type: "Buy", amount: -3750, date: ago(76), status: "Completed" },
  { id: 4, asset: "Exchange Wallet", type: "Exchange", amount: -2500, date: ago(120), status: "Completed" },
  { id: 5, asset: "Sovereign Income Fund", type: "Investment", amount: -8000, date: ago(190), status: "Completed" },
  { id: 6, asset: "Central Park Offices", type: "Buy", amount: -4000, date: ago(310), status: "Completed" },
];

const TX_META = {
  Deposit: { icon: ArrowDownToLine, tone: "emerald" },
  Investment: { icon: TrendingUp, tone: "cyan" },
  Buy: { icon: Building2, tone: "gold" },
  Exchange: { icon: ArrowLeftRight, tone: "violet" },
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

/* ────────────────────────── chart data generation ──────────────────────────
 * Deterministic, seeded history for each filter. Each period ends where the
 * newer one starts, so paging back through time stays continuous. The latest
 * period always ends at the live portfolio value.
 */

const RANGES = {
  daily: { label: "Daily", points: 24, growth: [0.004, 0.012] },
  weekly: { label: "Weekly", points: 7, growth: [0.012, 0.035] },
  monthly: { label: "Monthly", points: 30, growth: [0.03, 0.08] },
  yearly: { label: "Yearly", points: 12, growth: [0.14, 0.32] },
};
const MAX_OFFSET = 5;

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seedFor = (range, k) => (Object.keys(RANGES).indexOf(range) + 1) * 1000 + k * 17 + 5;
function periodGrowth(range, k) {
  const [lo, hi] = RANGES[range].growth;
  return 1 + lo + rng(seedFor(range, k))() * (hi - lo);
}

function pointMeta(range, offset, i, n) {
  const now = new Date();
  const [y, m, d] = [now.getFullYear(), now.getMonth(), now.getDate()];
  const fmtD = (date, opts) => date.toLocaleDateString("en-US", opts);
  if (range === "daily") {
    const date = new Date(y, m, d - offset, i);
    const hh = `${String(i).padStart(2, "0")}:00`;
    return { date, label: hh, full: `${fmtD(date, { weekday: "short", month: "short", day: "numeric" })}, ${hh}` };
  }
  if (range === "yearly") {
    const date = new Date(y, m - offset * 12 - (n - 1 - i), 1);
    return { date, label: fmtD(date, { month: "short" }), full: fmtD(date, { month: "long", year: "numeric" }) };
  }
  const step = range === "weekly" ? 7 : 30;
  const date = new Date(y, m, d - offset * step - (n - 1 - i));
  return {
    date,
    label: range === "weekly" ? fmtD(date, { weekday: "short" }) : fmtD(date, { month: "short", day: "numeric" }),
    full: fmtD(date, { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
  };
}

function buildSeries(range, offset, anchor, delta) {
  const n = RANGES[range].points;
  let end = anchor;
  for (let k = 0; k < offset; k++) end /= periodGrowth(range, k);
  const g = periodGrowth(range, offset);
  const start = end / g;

  const r = rng(seedFor(range, offset) + 999);
  const [p1, p2, f1, f2] = [r() * 6.28, r() * 6.28, 1.5 + r() * 1.5, 3 + r() * 2];
  const amp = (g - 1) * 0.45 + 0.002;
  const values = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const wave = 0.65 * Math.sin(2 * Math.PI * f1 * t + p1) + 0.35 * Math.sin(2 * Math.PI * f2 * t + p2);
    return start * (1 + (g - 1) * t + amp * wave * Math.sin(Math.PI * t));
  });

  // Live activity (deposits, NAV moves, fees) shows up as a ramp over the latest points.
  if (offset === 0 && delta) {
    const m = Math.max(2, Math.ceil(n * 0.25));
    for (let i = n - m; i < n; i++) values[i] += delta * ((i - (n - m - 1)) / m);
  }

  const data = values.map((value, i) => ({ ...pointMeta(range, offset, i, n), value, baseline: start }));
  const [a, b] = [data[0].date, data[n - 1].date];
  const short = { month: "short", day: "numeric" };
  const rangeText =
    range === "daily" ? a.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : range === "yearly" ? `${a.toLocaleDateString("en-US", { month: "short", year: "numeric" })} – ${b.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
    : `${a.toLocaleDateString("en-US", short)} – ${b.toLocaleDateString("en-US", { ...short, year: "numeric" })}`;
  return { data, rangeText };
}

/* ────────────────────────────── hooks ────────────────────────────── */

/**
 * Horizontal carousel helper: scroll-snap + arrow buttons + mouse drag-to-scroll.
 * Touch / trackpad / shift+wheel scrolling work natively.
 */
function useCarousel() {
  const ref = useRef(null);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0, blockClick: false });
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const next = { start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 };
    setEdge((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [update]);

  const scrollByPage = useCallback((dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  }, []);

  const finish = useCallback(() => {
    const d = drag.current;
    const el = ref.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved && el) {
      el.style.scrollSnapType = "";
      el.style.cursor = "";
      d.blockClick = true;
      setTimeout(() => { d.blockClick = false; }, 60);
    }
    d.moved = false;
  }, []);

  const handlers = {
    onPointerDown: (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
      Object.assign(drag.current, { down: true, moved: false, startX: e.clientX, startLeft: ref.current.scrollLeft });
    },
    onPointerMove: (e) => {
      const d = drag.current;
      const el = ref.current;
      if (!d.down || !el) return;
      if (e.buttons !== 1) return finish();
      const dx = e.clientX - d.startX;
      if (!d.moved) {
        if (Math.abs(dx) < 6) return;
        d.moved = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
        try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      }
      el.scrollLeft = d.startLeft - dx;
    },
    onPointerUp: finish,
    onPointerCancel: finish,
    // A drag must never count as a click on a card button.
    onClickCapture: (e) => {
      if (drag.current.blockClick) { e.preventDefault(); e.stopPropagation(); }
    },
    onDragStart: (e) => e.preventDefault(),
  };

  return { ref, edge, scrollByPage, handlers };
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
  if (c.edge.start && c.edge.end) return null; // everything fits, nothing to scroll
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={`Scroll ${label} left`} disabled={c.edge.start} onClick={() => c.scrollByPage(-1)} className={ARROW_BTN}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button type="button" aria-label={`Scroll ${label} right`} disabled={c.edge.end} onClick={() => c.scrollByPage(1)} className={ARROW_BTN}>
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
    gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    gsap.fromTo(panel.current, { opacity: 0, y: 28, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" });
    panel.current?.focus({ preventScroll: true });
  }, []);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    gsap.to(panel.current, { opacity: 0, y: 16, scale: 0.97, duration: 0.2, ease: "power2.in" });
    gsap.to(overlay.current, { opacity: 0, duration: 0.24, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [close]);

  return (
    
    <div
      ref={overlay}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className="mt-thin max-h-[92vh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#0a1019] p-6 shadow-2xl outline-none sm:max-w-md sm:rounded-3xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}><Icon className="h-5 w-5" /></span>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={close} aria-label="Close" className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
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
    if (list && el) list.scrollTop = Math.max(0, el.offsetTop - 8);
  }, []);
  return (
    <div ref={listRef} className="mt-thin relative grid max-h-64 gap-2 overflow-y-auto overscroll-contain pr-1">
      {options.map((o) => (
        <button key={o.id} type="button" data-selected={o.id === value} onClick={() => onChange(o.id)}
          className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${o.id === value ? "border-cyan-400/50 bg-cyan-400/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white">{o.title}</span>
            <span className="block text-xs text-slate-500">{o.sub}</span>
          </span>
          <span className="shrink-0 text-xs tabular-nums text-slate-400">{o.meta}</span>
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
  const [id, setId] = useState(initialId || FUNDS[0].id);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const fund = FUNDS.find((f) => f.id === id);
  const nav = ctx.navs[id];
  const amt = Math.max(0, parseFloat(amount) || 0);
  const units = amt / nav; // units = investmentAmount / NAV
  const error = busy || !amt ? "" : amt > ctx.faix ? "Amount is higher than your available FAIX." : amt < fund.min ? `Minimum for this fund is ${fmt0(fund.min)} FAIX.` : "";
  const valid = amt > 0 && !error;

  const submit = () => {
    if (!valid || busy) return;
    setBusy(true);
    ctx.actions.investInFund({ fund, amount: amt, units });
    done();
  };

  return (
    <div className="space-y-5">
      <OptionList value={id} onChange={setId}
        options={FUNDS.map((f) => ({ id: f.id, title: f.name, sub: f.category, meta: `NAV ${fmt(ctx.navs[f.id], 4)}` }))} />
      <AmountField label="Investment amount" unit="FAIX" value={amount} onChange={setAmount} hint={`Min ${fmt0(fund.min)}`}
        chips={[1000, 5000, 10000].filter((v) => v <= ctx.faix).map((v) => ({ label: fmt0(v), value: v })).concat({ label: "Max", value: Math.floor(ctx.faix) })} />
      <InfoList>
        <InfoRow label="Current NAV" value={`${fmt(nav, 4)} FAIX`} />
        <InfoRow label="Units you receive" value={fmt(units, 4)} accent="text-cyan-300" />
        <InfoRow label="Available FAIX" value={fmt(ctx.faix)} />
        <InfoRow label="Balance after" value={amt > 0 && amt <= ctx.faix ? fmt(ctx.faix - amt) : "-"} />
      </InfoList>
      <FormError>{error}</FormError>
      <button type="button" data-hover="btn" disabled={!valid || busy} onClick={submit} className={`${BTN.gold} w-full`}>
        <Check className="h-4 w-4" /> Confirm investment
      </button>
    </div>
  );
}

function PropertyForm({ ctx, initialId, done }) {
  const [id, setId] = useState(initialId || ctx.properties.find((p) => p.available > 0)?.id || ctx.properties[0].id);
  const [qtyText, setQtyText] = useState("");
  const [busy, setBusy] = useState(false);
  const property = ctx.properties.find((p) => p.id === id);
  const qty = Math.max(0, Math.floor(parseFloat(qtyText) || 0));
  const amount = qty * property.tokenPrice;
  const maxQty = Math.max(0, Math.min(property.available, Math.floor(ctx.faix / property.tokenPrice)));
  const error = busy || !qty ? "" : qty > property.available ? `Only ${fmt0(property.available)} tokens are available.` : amount > ctx.faix ? "Purchase amount is higher than your available FAIX." : "";
  const valid = qty > 0 && !error;

  const submit = () => {
    if (!valid || busy) return;
    setBusy(true);
    ctx.actions.buyProperty({ property, qty, amount });
    done();
  };

  return (
    <div className="space-y-5">
      <OptionList value={id} onChange={setId}
        options={ctx.properties.map((p) => ({ id: p.id, title: p.name, sub: p.location, meta: `${fmt0(p.tokenPrice)} FAIX / token` }))} />
      <AmountField label="FAIX token quantity" unit="tokens" step={1} value={qtyText} onChange={setQtyText} hint={`${fmt0(property.available)} available`}
        chips={[1, 5, 10].filter((v) => v <= maxQty).map((v) => ({ label: String(v), value: v })).concat({ label: "Max", value: maxQty })} />
      <InfoList>
        <InfoRow label="Token value" value={`${fmt0(property.tokenPrice)} FAIX`} />
        <InfoRow label="Purchase amount" value={`${fmt(amount)} FAIX`} accent="text-[#e2c17f]" />
        <InfoRow label="Ownership share" value={`${((qty / property.total) * 100).toFixed(4)}%`} />
        <InfoRow label="Available FAIX" value={fmt(ctx.faix)} />
      </InfoList>
      <FormError>{error}</FormError>
      <button type="button" data-hover="btn" disabled={!valid || busy} onClick={submit} className={`${BTN.gold} w-full`}>
        <Check className="h-4 w-4" /> Confirm purchase
      </button>
    </div>
  );
}

const METHODS = [
  { id: "Bank transfer", icon: Landmark },
  { id: "Card", icon: CreditCard },
  { id: "Crypto wallet", icon: Wallet },
];

function DepositForm({ ctx, done }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0].id);
  const [busy, setBusy] = useState(false);
  const amt = Math.max(0, parseFloat(amount) || 0);
  const error = amt > 1_000_000 ? "The maximum single deposit is 1,000,000 FAIX." : "";
  const submit = () => {
    if (amt <= 0 || error || busy) return;
    setBusy(true);
    ctx.actions.addFunds({ amount: amt, method });
    done();
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map(({ id, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setMethod(id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition-colors ${method === id ? "border-cyan-400/50 bg-cyan-400/[0.06] text-white" : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20"}`}>
            <Icon className="h-4 w-4" />{id}
          </button>
        ))}
      </div>
      <AmountField label="Amount to add" unit="FAIX" value={amount} onChange={setAmount}
        chips={[1000, 5000, 10000, 25000].map((v) => ({ label: fmt0(v), value: v }))} />
      <InfoList>
        <InfoRow label="Current balance" value={`${fmt(ctx.faix)} FAIX`} />
        <InfoRow label="Balance after" value={`${fmt(ctx.faix + (error ? 0 : amt))} FAIX`} accent="text-emerald-300" />
      </InfoList>
      <FormError>{error}</FormError>
      <button type="button" data-hover="btn" disabled={amt <= 0 || !!error || busy} onClick={submit} className={`${BTN.gold} w-full`}>
        <Plus className="h-4 w-4" /> Add funds
      </button>
    </div>
  );
}

const EXCHANGE_FEE = 0.0025;

function ExchangeForm({ ctx, done }) {
  const [dir, setDir] = useState("in");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const source = dir === "in" ? ctx.faix : ctx.exchange.value;
  const amt = Math.max(0, parseFloat(amount) || 0);
  const fee = amt * EXCHANGE_FEE;
  const net = amt - fee;
  const error = busy || !amt ? "" : amt > source ? `Amount is higher than your ${dir === "in" ? "available FAIX" : "exchange balance"}.` : "";
  const submit = () => {
    if (amt <= 0 || error || busy) return;
    setBusy(true);
    ctx.actions.swap({ dir, amount: amt, net });
    done();
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/20 p-1">
        {[["in", "FAIX to Exchange"], ["out", "Exchange to FAIX"]].map(([k, label]) => (
          <button key={k} type="button" onClick={() => { setDir(k); setAmount(""); }}
            className={`rounded-lg py-2 text-xs font-medium transition-colors ${dir === k ? "bg-white/10 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            {label}
          </button>
        ))}
      </div>
      <AmountField label="Amount" unit="FAIX" value={amount} onChange={setAmount} hint={`Balance ${fmt(source)}`}
        chips={[25, 50].map((p) => ({ label: `${p}%`, value: Math.floor(source * p) / 100 })).concat({ label: "Max", value: Math.floor(source * 100) / 100 })} />
      <InfoList>
        <InfoRow label="Fee (0.25%)" value={`${fmt(fee)} FAIX`} />
        <InfoRow label={dir === "in" ? "Added to exchange assets" : "Added to FAIX balance"} value={`${fmt(net)} FAIX`} accent="text-indigo-300" />
        <InfoRow label="Available FAIX" value={fmt(ctx.faix)} />
      </InfoList>
      <FormError>{error}</FormError>
      <button type="button" data-hover="btn" disabled={amt <= 0 || !!error || busy} onClick={submit} className={`${BTN.gold} w-full`}>
        <ArrowLeftRight className="h-4 w-4" /> Confirm exchange
      </button>
    </div>
  );
}

const MODAL_CFG = {
  invest: { title: "Invest in fund", subtitle: "Units are allocated at the current NAV.", icon: TrendingUp, tone: "cyan" },
  property: { title: "Buy property tokens", subtitle: "Own a fraction of the property with FAIX.", icon: Building2, tone: "gold" },
  deposit: { title: "Add funds", subtitle: "Top up your FAIX balance.", icon: Plus, tone: "emerald" },
  exchange: { title: "Exchange", subtitle: "Move value between FAIX and exchange assets.", icon: ArrowLeftRight, tone: "violet" },
};

function ActionModal({ modal, ctx, onClose }) {
  const cfg = MODAL_CFG[modal.type];
  return (
    <Modal {...cfg} onClose={onClose}>
      {(done) => {
        if (modal.type === "invest") return <InvestForm ctx={ctx} initialId={modal.id} done={done} />;
        if (modal.type === "property") return <PropertyForm ctx={ctx} initialId={modal.id} done={done} />;
        if (modal.type === "deposit") return <DepositForm ctx={ctx} done={done} />;
        return <ExchangeForm ctx={ctx} done={done} />;
      }}
    </Modal>
  );
}

/* ────────────────────────────── the page ────────────────────────────── */

function Dashboard() {
  const root = useRef(null);
  const chartWrap = useRef(null);
  const notifRef = useRef(null);
  const fundsCar = useCarousel();
  const propsCar = useCarousel();

  // Portfolio state (all dummy, all local)
  const [faix, setFaix] = useState(42500);
  const [fundPos, setFundPos] = useState(INITIAL_FUNDS);
  const [propPos, setPropPos] = useState(INITIAL_PROPS);
  const [properties, setProperties] = useState(PROPERTIES);
  const [exchange, setExchange] = useState({ value: 9800, cost: 9200 });
  const [navs, setNavs] = useState(() => Object.fromEntries(FUNDS.map((f) => [f.id, f.nav])));
  const [txs, setTxs] = useState(SEED_TXS);
  
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // UI state
  const [range, setRange] = useState("monthly");
  const [offset, setOffset] = useState(0);
  const [animateChart, setAnimateChart] = useState(true);
  const [modal, setModal] = useState(null);
  const [activeSlice, setActiveSlice] = useState(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(2);
  const [toast, setToast] = useState(null);

  /* ── derived portfolio numbers ── */
  const { fundsValue, fundsCost, propsValue, propsCost } = useMemo(() => {
    let fv = 0, fc = 0, pv = 0, pc = 0;
    FUNDS.forEach((f) => { const p = fundPos[f.id]; if (p) { fv += p.units * navs[f.id]; fc += p.cost; } });
    properties.forEach((p) => { const h = propPos[p.id]; if (h) { pv += h.tokens * p.tokenPrice; pc += h.cost; } });
    return { fundsValue: fv, fundsCost: fc, propsValue: pv, propsCost: pc };
  }, [fundPos, navs, propPos, properties]);

  const holdings = fundsValue + propsValue + exchange.value;
  const invested = fundsCost + propsCost + exchange.cost;
  const total = faix + holdings;
  const returns = holdings - invested;
  const returnsPct = invested ? (returns / invested) * 100 : 0;
  const fundCount = Object.values(fundPos).filter((p) => p.units > 0).length;
  const propCount = Object.values(propPos).filter((p) => p.tokens > 0).length;
  const tokenCount = Object.values(propPos).reduce((s, p) => s + p.tokens, 0);
  const positions = fundCount + propCount + (exchange.value > 0 ? 1 : 0);
  const pctOf = (part, whole) => (whole ? (part / whole) * 100 : 0);

  /* ── chart ── */
  const anchor = useRef(total).current; // portfolio value when the page loaded
  const series = useMemo(() => buildSeries(range, offset, anchor, total - anchor), [range, offset, anchor, total]);
  const monthly = useMemo(() => buildSeries("monthly", 0, anchor, total - anchor).data, [anchor, total]);
  const monthGrowth = (monthly[monthly.length - 1].value / monthly[0].value - 1) * 100;
  const monthChange = monthly[monthly.length - 1].value - monthly[0].value;

  const vals = series.data.map((d) => d.value);
  const first = vals[0];
  const last = vals[vals.length - 1];
  const growth = (last / first - 1) * 100;
  const peak = Math.max(...vals);
  const [yMin, yMax] = useMemo(() => {
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * 0.2 || hi * 0.01;
    return [Math.floor((lo - pad) / 100) * 100, Math.ceil((hi + pad) / 100) * 100];
  }, [series]); // eslint-disable-line react-hooks/exhaustive-deps
  const investTxs = txs.filter((t) => t.type === "Investment" || t.type === "Buy");
  const avgInvestment = investTxs.length ? investTxs.reduce((s, t) => s + Math.abs(t.amount), 0) / investTxs.length : 0;

  const alloc = [
    { name: "Funds", value: fundsValue, color: C.cyan },
    { name: "Property", value: propsValue, color: C.gold },
    { name: "Exchange", value: exchange.value, color: C.violet },
  ];

  /* ── actions ── */
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);
  const closeModal = useCallback(() => setModal(null), []);

  const pushTx = useCallback((asset, type, amount) => {
    const id = Date.now() + Math.random();
    setTxs((t) => [{ id, asset, type, amount, date: new Date(), status: "Pending" }, ...t]);
    setUnread((u) => u + 1);
    setTimeout(() => setTxs((t) => t.map((x) => (x.id === id ? { ...x, status: "Completed" } : x))), 2500);
  }, []);

  const actions = {
    investInFund: ({ fund, amount, units }) => {
      setFaix((b) => b - amount);
      setFundPos((p) => ({ ...p, [fund.id]: { units: (p[fund.id]?.units || 0) + units, cost: (p[fund.id]?.cost || 0) + amount } }));
      pushTx(fund.name, "Investment", -amount);
      notify(`Invested ${fmt(amount)} FAIX in ${fund.name}`);
    },
    buyProperty: ({ property, qty, amount }) => {
      setFaix((b) => b - amount);
      setPropPos((p) => ({ ...p, [property.id]: { tokens: (p[property.id]?.tokens || 0) + qty, cost: (p[property.id]?.cost || 0) + amount } }));
      setProperties((list) => list.map((p) => (p.id === property.id ? { ...p, available: p.available - qty } : p)));
      pushTx(property.name, "Buy", -amount);
      notify(`Bought ${fmt0(qty)} tokens of ${property.name}`);
    },
    addFunds: ({ amount, method }) => {
      setFaix((b) => b + amount);
      pushTx(`FAIX Wallet (${method})`, "Deposit", amount);
      notify(`Added ${fmt(amount)} FAIX to your balance`);
    },
    swap: ({ dir, amount, net }) => {
      if (dir === "in") {
        setFaix((b) => b - amount);
        setExchange((ex) => ({ value: ex.value + net, cost: ex.cost + amount }));
      } else {
        setFaix((b) => b + net);
        setExchange((ex) => ({ value: ex.value - amount, cost: ex.cost * ((ex.value - amount) / ex.value) }));
      }
      pushTx("Exchange Wallet", "Exchange", dir === "in" ? -amount : net);
      notify(dir === "in" ? `Moved ${fmt(amount)} FAIX to exchange assets` : `Moved ${fmt(net)} FAIX back to your balance`);
    },
  };
  const ctx = { faix, navs, fundPos, properties, propPos, exchange, actions };

  /* ── live market tick ── */
  useEffect(() => {
    const id = setInterval(() => {
      const drift = (amp) => 1 + (Math.random() - 0.47) * amp;
      setNavs((n) => Object.fromEntries(Object.entries(n).map(([k, v]) => [k, v * drift(0.002)])));
      setExchange((ex) => ({ ...ex, value: ex.value * drift(0.003) }));
    }, 5000);
    return () => clearInterval(id);
  }, []);

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

  const fundsReturn = pctOf(fundsValue - fundsCost, fundsCost);
  const propsReturn = pctOf(propsValue - propsCost, propsCost);
  const stats = [
    { label: "Total portfolio value", value: total, unit: "FAIX", icon: Landmark, tone: "gold", change: monthGrowth, note: "Change over the last 30 days" },
    { label: "Available FAIX", value: faix, unit: "FAIX", icon: Wallet, tone: "cyan", badge: `${pctOf(faix, total).toFixed(1)}% liquid`, note: "Ready to deploy" },
    { label: "Invested amount", value: invested, unit: "FAIX", icon: Briefcase, tone: "violet", badge: `${pctOf(invested, total).toFixed(1)}% of total`, note: `Across ${positions} positions` },
    { label: "Total returns", value: returns, unit: "FAIX", icon: TrendingUp, tone: "emerald", change: returnsPct, note: "On invested capital" },
    { label: "Properties", value: propCount, unit: "", fmt: (n) => String(Math.round(n)), icon: Building2, tone: "gold", change: propsReturn, note: `${fmt0(tokenCount)} tokens, ${fmt0(propsValue)} FAIX` },
    { label: "Fund investments", value: fundsValue, unit: "FAIX", icon: PieChartIcon, tone: "cyan", change: fundsReturn, note: `${fundCount} active funds` },
  ];
  const kpis = [
    { label: "Total revenue", value: fmt0(last - first), unit: "FAIX", icon: Coins, tone: "gold", note: "Gain in this period" },
    { label: "Overall growth", value: signedPct(growth), icon: TrendingUp, tone: growth >= 0 ? "emerald" : "violet", note: "Start to end of period" },
    { label: "Average investment", value: fmt0(avgInvestment), unit: "FAIX", icon: Briefcase, tone: "cyan", note: `${investTxs.length} investments` },
    { label: "Peak portfolio value", value: fmt0(peak), unit: "FAIX", icon: Activity, tone: "violet", note: "Highest point in period" },
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
  active="Dashboard"
  onNavigate={(page) => console.log(page)}
  onLogout={() => console.log("logout")}
  onExpandChange={setSidebarExpanded}
/>
    <div
  ref={root}
  className={`min-h-screen bg-[#05080d] text-slate-200 antialiased
    transition-[margin] duration-300
    ${sidebarExpanded ? "ml-[250px]" : "ml-[76px]"}`}
  style={{ backgroundImage: BG }}
>
      <style>{STYLES}</style>
      <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ───────── hero ───────── */}
        <header data-anim="header" className="relative z-30 rounded-3xl border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
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
                    AA
                    <Photo src={IMAGES.avatar} alt="Andrew Alex" eager className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#05080d] bg-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{greeting}</p>
                  <h1 className="text-xl font-semibold text-white sm:text-2xl">Andrew Alex</h1>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#e2c17f]"><ShieldCheck className="h-3 w-3" />Verified investor</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" aria-label="Search transactions" onClick={() => { setSearchOpen((o) => !o); setQuery(""); }} className={`${ICON_BTN} ${searchOpen ? "border-cyan-400/40 text-cyan-200" : ""}`}>
                  <Search className="h-[18px] w-[18px]" />
                </button>
                <div ref={notifRef} className="relative">
                  <button type="button" aria-label="Notifications" className={ICON_BTN} onClick={() => { setNotifOpen((o) => !o); setUnread(0); }}>
                    <Bell className="h-[18px] w-[18px]" />
                    {unread > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-[#d4af6a] px-1 text-[10px] font-bold text-[#1a1305]">{unread}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-[#0a1019] p-2 shadow-2xl">
                      <p className="px-3 py-2 text-xs font-medium text-slate-400">Recent activity</p>
                      {txs.slice(0, 5).map((t) => {
                        const { icon: Icon, tone } = TX_META[t.type];
                        return (
                          <div key={t.id} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/[0.03]">
                            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ring-1 ${ACCENT[tone]}`}><Icon className="h-4 w-4" /></span>
                            <div className="min-w-0">
                              <p className="truncate text-sm text-slate-100">{t.asset}</p>
                              <p className="text-xs text-slate-500">{t.type} of {fmt0(Math.abs(t.amount))} FAIX, {t.status.toLowerCase()}</p>
                            </div>
                          </div>
                        );
                      })}
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

        {/* ───────── quick actions ───────── */}
        <section aria-label="Quick actions" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <button key={a.key} type="button" data-anim="action" data-hover="lift" onClick={() => setModal({ type: a.key })}
              className={`${CARD} flex items-center gap-3 p-4 text-left transition-colors hover:border-white/15`}>
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT[a.tone]}`}><a.icon className="h-5 w-5" /></span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{a.label}</span>
                <span className="hidden text-xs text-slate-500 sm:block">{a.hint}</span>
              </span>
            </button>
          ))}
        </section>

        {/* ───────── portfolio overview ───────── */}
        <section aria-label="Portfolio overview" className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} data-anim="stat" data-hover="lift" className={`${CARD} p-4 transition-colors hover:border-white/15`}>
              <div className="flex items-center justify-between">
                <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${ACCENT[s.tone]}`}><s.icon className="h-4 w-4" /></span>
                {s.change != null ? <Delta value={s.change} /> : <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">{s.badge}</span>}
              </div>
              <p className="mt-4 text-xs text-slate-400">{s.label}</p>
              <p className="mt-1 whitespace-nowrap text-[22px] font-semibold leading-none tabular-nums text-white">
                <AnimatedNumber value={s.value} format={s.fmt || fmt0} />
                {s.unit && <span className="ml-1 text-xs font-medium text-slate-500">{s.unit}</span>}
              </p>
              <p className="mt-2 truncate text-[11px] text-slate-500">{s.note}</p>
            </div>
          ))}
        </section>

        {/* ───────── chart + allocation/summary ───────── */}
        <div className="grid gap-6 xl:grid-cols-3">
          <section data-anim="chart" className={`${CARD} p-5 sm:p-6 xl:col-span-2`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">Portfolio growth</h2>
                  {offset === 0 ? (
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

              <div className="flex flex-wrap items-center gap-2">
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

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 lg:grid-cols-4">
              {kpis.map((k) => (
                <div key={k.label} className="flex items-start gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${ACCENT[k.tone]}`}><k.icon className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">{k.label}</p>
                    <p className="whitespace-nowrap text-[15px] font-semibold tabular-nums text-white">
                      {k.value}{k.unit && <span className="ml-1 text-[11px] font-medium text-slate-500">{k.unit}</span>}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">{k.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            {/* asset allocation */}
            <section data-anim="section" className={`${CARD} p-5`}>
              <SectionTitle icon={PieChartIcon} tone="gold" title="Asset allocation" subtitle="Share of invested holdings" />
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
                      <p className="text-xs text-slate-500">Total holdings</p>
                      <p className="text-xl font-semibold tabular-nums text-white">{fmt0(holdings)}</p>
                      <p className="text-[11px] text-slate-500">FAIX</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400">{alloc[activeSlice].name}</p>
                      <p className="text-xl font-semibold tabular-nums text-white">{pctOf(alloc[activeSlice].value, holdings).toFixed(1)}%</p>
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
                      <span className="font-medium text-white">{pctOf(a.value, holdings).toFixed(1)}%</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* portfolio summary */}
            <section data-anim="section" className={`${CARD} p-5`}>
              <SectionTitle icon={Landmark} tone="cyan" title="Portfolio summary" />
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

        {/* ───────── fund investments (scrollable) ───────── */}
        <section data-anim="section">
          <SectionTitle icon={Layers} tone="cyan" title="Fund investments" subtitle="Units are issued at the live NAV. Swipe or drag to see more."
            right={
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400 md:inline-flex"><Activity className="h-3 w-3 text-emerald-300" />NAV updates every few seconds</span>
                <CarouselArrows c={fundsCar} label="funds" />
              </div>
            } />
          <div ref={fundsCar.ref} {...fundsCar.handlers} className={CAROUSEL}>
        {FUNDS.map((f) => {
  const pos = fundPos[f.id];
  const currentNav = navs[f.id];

  const images = {
    growth:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=85",

    income:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",

    realty:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85",

    digital:
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=900&q=85",

    frontier:
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=1000&q=85",
    crypto: ""

  };

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
        <img
          src={images[f.id]}
          alt={f.name}
          className="
            h-full w-full object-cover
            opacity-70
            transition duration-500
            group-hover:scale-110 group-hover:opacity-85
          "
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#091118] via-[#091118]/30 to-black/10" />

        {/* Risk */}
        <span
          className={`
            absolute right-3 top-3
            rounded-full px-2 py-1
            text-[9px] font-semibold
            backdrop-blur-md
            ring-1 ring-inset
            ${RISK[f.risk]}
          `}
        >
          {f.risk} risk
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
        <section data-anim="section">
          <SectionTitle icon={Building2} tone="gold" title="Property investment" subtitle="Buy tokens that represent a share of each property. Swipe or drag to see more."
            right={<CarouselArrows c={propsCar} label="properties" />} />
          <div ref={propsCar.ref} {...propsCar.handlers} className={CAROUSEL}>
            {properties.map((p) => {
              const held = propPos[p.id]?.tokens || 0;
              const sold = ((p.total - p.available) / p.total) * 100;
              return (
                <article key={p.id} data-hover="lift" className={`${CARD} group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden transition-colors hover:border-[#d4af6a]/25 sm:w-[310px]`}>
                  <div className="relative h-40 overflow-hidden bg-[#0d1520]">
                    <Building2 className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-[#d4af6a]/60" strokeWidth={1.25} />
                    <Photo src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1019] via-[#0a1019]/10 to-black/40" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] text-slate-100 backdrop-blur"><MapPin className="h-3 w-3" />{p.location}</span>
                    <span className={`absolute right-3 top-3 rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset backdrop-blur ${ACCENT.emerald}`}>{p.yield}% yield</span>
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
                      <div className="mb-1.5 flex justify-between text-[11px] text-slate-500"><span>Tokens sold</span><span className="tabular-nums">{sold.toFixed(1)}%</span></div>
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
        <section data-anim="section" className={CARD}>
          <div className="p-5 pb-2">
            <SectionTitle icon={Clock} tone="violet" title="Recent transactions"
              subtitle={q ? `${visibleTxs.length} results for "${query.trim()}"` : "Your latest activity"} />
          </div>
          <div className="hidden grid-cols-[2.2fr_1fr_1fr_1.3fr_1fr] gap-4 border-y border-white/5 px-5 py-2.5 text-xs text-slate-500 md:grid">
            <span>Asset</span><span>Type</span><span>Amount</span><span>Date</span><span>Status</span>
          </div>
          <ul>
            {visibleTxs.map((t) => {
              const { icon: Icon, tone } = TX_META[t.type];
              const pending = t.status === "Pending";
              return (
                <li key={t.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-white/5 px-5 py-3.5 last:border-0 md:grid-cols-[2.2fr_1fr_1fr_1.3fr_1fr]">
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
    </div>

    </>
 );
}

/**
 * Client-only gate: the dashboard depends on the current time / timezone (greeting, chart labels, tx dates),
 * so it renders after mount. This avoids hydration mismatches in Next.js and is harmless in plain React.
 */
export default function UserAdmin() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted ? <Dashboard /> : <div className="min-h-screen bg-[#05080d]" />;
}