"use client";
/**
 * Exchange.jsx — "Coming soon" page for the token Exchange.
 * The swap flow is not live yet; this page previews it and lets the user join the waitlist (local state only).
 */
import { useState } from "react";
import {
  ArrowLeftRight, Bell, BellRing, Check, Clock, Coins, Droplets, LayoutDashboard, Percent, ShieldCheck, Sparkles, Zap,
} from "lucide-react";
import { BTN, CARD } from "./shared/theme";
import { PageHeader, PageShell, SectionTitle, Toast } from "./shared/ui";

const FEATURES = [
  { icon: Zap, tone: "cyan", title: "Instant swaps", text: "Move value between your FAIX balance and exchange assets in a couple of taps." },
  { icon: Percent, tone: "gold", title: "Low, flat fee", text: "A transparent 0.25% fee per swap, shown before you confirm." },
  { icon: Droplets, tone: "violet", title: "Deep liquidity", text: "Pooled liquidity so larger orders fill without surprise slippage." },
  { icon: ShieldCheck, tone: "emerald", title: "Secure by design", text: "Every swap is settled against your verified wallet and logged in Transactions." },
];
const ACCENTS = {
  cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
  gold: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  violet: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
  emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
};
const ROADMAP = [
  { label: "Waitlist open", text: "Register interest to get early access.", done: true },
  { label: "Private beta", text: "Platinum and Gold members swap first.", done: false },
  { label: "General availability", text: "Exchange opens to every verified investor.", done: false },
];

export default function Exchange({ onNavigate = () => {} }) {
  const [notify, setNotify] = useState(false);
  const [toast, setToast] = useState(null);

  const toggle = () => {
    const next = !notify;
    setNotify(next);
    setToast(next ? "You're on the list — we'll let you know when Exchange launches." : "Removed from the Exchange waitlist.");
    setTimeout(() => setToast(null), 3200);
  };

  return (
    <PageShell active="Exchange" onNavigate={onNavigate}>
      <PageHeader
        icon={ArrowLeftRight}
        tone="violet"
        eyebrow="Exchange"
        title="Token Exchange is coming soon"
        subtitle="Swap between your FAIX balance and exchange assets right from your account. We're putting the finishing touches on it."
        right={<span className="inline-flex items-center gap-1.5 rounded-full bg-[#d4af6a]/10 px-3 py-1.5 text-xs font-semibold text-[#e2c17f] ring-1 ring-inset ring-[#d4af6a]/25"><Clock className="h-3.5 w-3.5" />Launching soon</span>}
      />

      {/* hero */}
      <section className={`${CARD} relative overflow-hidden p-8 text-center sm:p-12`}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[#d4af6a]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-xl">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/20">
            <Sparkles className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold text-white sm:text-3xl">Something new is on the way</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Exchange isn't live yet. Join the waitlist and we'll notify you the moment swaps open — your FAIX balance, holdings and history stay exactly as they are.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={toggle} className={notify ? BTN.ghost : BTN.gold}>
              {notify ? <><Check className="h-4 w-4" /> You're on the waitlist</> : <><Bell className="h-4 w-4" /> Notify me at launch</>}
            </button>
            <button type="button" onClick={() => onNavigate("Dashboard")} className={BTN.ghost}>
              <LayoutDashboard className="h-4 w-4" /> Back to dashboard
            </button>
          </div>
          {notify && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-300"><BellRing className="h-3.5 w-3.5" />Notifications on</p>}
        </div>
      </section>

      {/* features */}
      <section aria-label="What to expect">
        <SectionTitle icon={Coins} tone="gold" title="What to expect" subtitle="A first look at Exchange" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className={`${CARD} p-5 transition-colors hover:border-white/15`}>
              <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${ACCENTS[f.tone]}`}><f.icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* roadmap */}
      <section className={`${CARD} p-5`}>
        <SectionTitle icon={Clock} tone="violet" title="Rollout" subtitle="How Exchange will open up" />
        <ol className="grid gap-3 md:grid-cols-3">
          {ROADMAP.map((r, i) => (
            <li key={r.label} className={`rounded-xl border p-4 ${r.done ? "border-emerald-400/25 bg-emerald-400/[0.05]" : "border-white/[0.06] bg-white/[0.02]"}`}>
              <div className="flex items-center gap-2.5">
                <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${r.done ? "bg-emerald-400/15 text-emerald-300" : "bg-white/[0.05] text-slate-400"}`}>
                  {r.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <p className="text-sm font-semibold text-white">{r.label}</p>
              </div>
              <p className="mt-2 text-xs text-slate-500">{r.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {toast && <Toast message={toast} />}
    </PageShell>
  );
}
