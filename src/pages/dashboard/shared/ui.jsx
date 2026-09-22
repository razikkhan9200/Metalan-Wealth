/**
 * ui.jsx — shared building blocks for the Metalan pages.
 * Mirrors the Modal / AmountField / OptionList / InfoList patterns already used
 * in UserAdmin.jsx so Fund Investments, Property Investments, Transactions and
 * Wallet feel like the same app, not bolted-on screens.
 */
"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, ArrowDownRight, ArrowRight, Check, X } from "lucide-react";
import NavigationPanel from "../NavigationPanel";
import { useLogout } from "./nav";
import { ACCENT, BG, CARD, STYLES } from "./theme";

/* ────────────────────────────── page shell ────────────────────────────── */
/** Wraps every non-Dashboard page with the same sidebar + background as UserAdmin.jsx. */
export function PageShell({ active, onNavigate, onLogout, children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const logout = useLogout();
  return (
    <>
      <NavigationPanel
        active={active}
        onNavigate={onNavigate}
        onLogout={onLogout ?? logout}
        onExpandChange={setSidebarExpanded}
      />
      <div
        className={`min-h-screen bg-[#05080d] text-slate-200 antialiased transition-[margin] duration-300 ${
          sidebarExpanded ? "md:ml-[250px]" : "md:ml-[76px]"
        }`}
        style={{ backgroundImage: BG }}
      >
        <style>{STYLES}</style>
        <div className="mx-auto max-w-[1440px] space-y-6 px-4 pb-10 pt-[96px] sm:px-6 md:py-8 lg:px-8">
          {children}
        </div>
      </div>
    </>
  );
}

/** Compact hero-style header used at the top of each page (title + subtitle + right-side content). */
export function PageHeader({ icon: Icon, eyebrow, title, subtitle, tone = "cyan", right }) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080d15] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)] sm:p-8">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[#d4af6a]/10 blur-3xl" />
      </div>
      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${ACCENT[tone]}`}>
            <Icon className="h-6 w-6" />
          </span>
          <div>
            {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{eyebrow}</p>}
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 max-w-xl text-sm text-slate-400">{subtitle}</p>}
          </div>
        </div>
        {right && <div className="flex flex-wrap items-center gap-3">{right}</div>}
      </div>
    </header>
  );
}

/* ────────────────────────────── small pieces ────────────────────────────── */

export function Delta({ value }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${up ? ACCENT.emerald : "bg-rose-400/10 text-rose-300 ring-rose-400/20"}`}>
      <Icon className="h-3 w-3" />
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}

export function SectionTitle({ icon: Icon, tone = "cyan", title, subtitle, right }) {
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

export function StatCard({ icon: Icon, tone = "cyan", label, value, unit, change, note }) {
  return (
    <div className={`${CARD} p-4 transition-colors hover:border-white/15`}>
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${ACCENT[tone]}`}><Icon className="h-4 w-4" /></span>
        {change != null && <Delta value={change} />}
      </div>
      <p className="mt-4 text-xs text-slate-400">{label}</p>
      <p className="mt-1 whitespace-nowrap text-[22px] font-semibold leading-none tabular-nums text-white">
        {value}{unit && <span className="ml-1 text-xs font-medium text-slate-500">{unit}</span>}
      </p>
      {note && <p className="mt-2 truncate text-[11px] text-slate-500">{note}</p>}
    </div>
  );
}

/** "View all" link-button used in section headers. */
export function ViewAllButton({ onClick, label = "View all", tone = "cyan" }) {
  const hover = tone === "gold" ? "hover:border-[#d4af6a]/40 hover:text-[#e2c17f]" : "hover:border-cyan-400/40 hover:text-cyan-200";
  return (
    <button type="button" onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors ${hover}`}>
      {label}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/** Rank chip (1-5) for leaderboards: gold, silver, bronze, then neutral. */
export function RankBadge({ rank }) {
  const cls = rank === 1 ? "bg-[#d4af6a]/15 text-[#e2c17f] ring-[#d4af6a]/30"
    : rank === 2 ? "bg-slate-400/15 text-slate-300 ring-slate-400/30"
    : rank === 3 ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
    : "bg-white/[0.04] text-slate-400 ring-white/10";
  return <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-semibold tabular-nums ring-1 ${cls}`}>{rank}</span>;
}

export function Toast({ message }) {
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

export function Modal({ title, subtitle, icon: Icon, tone, onClose, children }) {
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
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  return (
    <div
      ref={overlay}
      onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onWheel={(e) => { e.stopPropagation(); if (panel.current) panel.current.scrollTop += e.deltaY; }}
        className="scrollbar-hide max-h-[92vh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#0a1019] p-6 shadow-2xl outline-none sm:max-w-md sm:rounded-3xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}>
              <Icon className="h-5 w-5" />
            </span>
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

export function AmountField({ label, value, onChange, unit, chips = [], step = "any", hint }) {
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
            <button key={c.label} type="button" onClick={() => onChange(String(c.value))}
              className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200">
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function OptionList({ options, value, onChange }) {
  const listRef = useRef(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector('[data-selected="true"]');
    if (list && el) list.scrollTop = Math.max(0, el.offsetTop - 8);
  }, []);
  return (
    <div
      ref={listRef}
      className="scrollbar-hide relative grid max-h-64 gap-2 overflow-y-auto overscroll-contain pr-1 cursor-grab select-none scroll-smooth"
      onWheel={(e) => { e.stopPropagation(); if (listRef.current) listRef.current.scrollTop += e.deltaY; }}
    >
      {options.map((o) => (
        <button key={o.id} type="button" data-selected={o.id === value} onClick={() => onChange(o.id)}
          className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
            o.id === value ? "border-cyan-400/50 bg-cyan-400/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/20"
          }`}>
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

export const InfoList = ({ children }) => <div className="divide-y divide-white/5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4">{children}</div>;
export const InfoRow = ({ label, value, accent = "text-slate-100" }) => (
  <div className="flex items-center justify-between py-2.5 text-sm">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium tabular-nums ${accent}`}>{value}</span>
  </div>
);
export const FormError = ({ children }) => (children ? <p className="text-xs text-rose-300">{children}</p> : null);
