/* Exchange.jsx */
"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Bell,
  BellRing,
  Check,
  Clock,
  Coins,
  Droplets,
  LayoutDashboard,
  Percent,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { BTN, CARD } from "./shared/theme";
import { PageHeader, PageShell, SectionTitle, Toast } from "./shared/ui";

const FEATURES = [
  {
    icon: Zap,
    tone: "cyan",
    title: "Instant swaps",
    text: "Move value between your FAIX balance and exchange assets in a couple of taps.",
  },
  {
    icon: Percent,
    tone: "gold",
    title: "Low, flat fee",
    text: "A transparent 0.25% fee per swap, shown before you confirm.",
  },
  {
    icon: Droplets,
    tone: "violet",
    title: "Deep liquidity",
    text: "Pooled liquidity so larger orders fill without surprise slippage.",
  },
  {
    icon: ShieldCheck,
    tone: "emerald",
    title: "Secure by design",
    text: "Every swap is settled against your verified wallet and logged in Transactions.",
  },
];

const ACCENTS = {
  cyan: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
  gold: "bg-[#d4af6a]/10 text-[#e2c17f] ring-[#d4af6a]/25",
  violet: "bg-indigo-400/10 text-indigo-300 ring-indigo-400/20",
  emerald: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
};

const ROADMAP = [
  {
    label: "Waitlist open",
    text: "Register interest to get early access.",
    done: true,
  },
  {
    label: "Private beta",
    text: "Platinum and Gold members swap first.",
    done: false,
  },
  {
    label: "General availability",
    text: "Exchange opens to every verified investor.",
    done: false,
  },
];

function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <article
      className={`${CARD} group flex h-full flex-col p-4 sm:p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white/15`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 sm:h-11 sm:w-11 ${ACCENTS[feature.tone]}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="mt-4 text-sm font-semibold text-white">
        {feature.title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">
        {feature.text}
      </p>
    </article>
  );
}

function RoadmapCard({ item, index }) {
  return (
    <li
      className={`relative rounded-2xl border p-4 sm:p-5 ${
        item.done
          ? "border-emerald-400/25 bg-emerald-400/[0.05]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      {index < ROADMAP.length - 1 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[calc(100%+6px)] top-1/2 hidden h-px w-3 bg-white/10 lg:block"
        />
      )}

      <div className="flex items-start gap-3">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold ring-1 ring-inset ${
            item.done
              ? "bg-emerald-400/15 text-emerald-300 ring-emerald-400/20"
              : "bg-white/[0.05] text-slate-400 ring-white/10"
          }`}
        >
          {item.done ? <Check className="h-3.5 w-3.5" /> : index + 1}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-white">
            {item.label}
          </p>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            {item.text}
          </p>
        </div>
      </div>
    </li>
  );
}

export default function Exchange({ onNavigate = () => {} }) {
  const [notify, setNotify] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggle = () => {
    const next = !notify;
    setNotify(next);
    setToast(
      next
        ? "You're on the list — we'll let you know when Exchange launches."
        : "Removed from the Exchange waitlist."
    );
  };

  return (
    <PageShell active="Exchange" onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-7xl space-y-6 overflow-x-hidden sm:space-y-7">
        <PageHeader
          icon={ArrowLeftRight}
          tone="violet"
          eyebrow="Exchange"
          title="Token Exchange is coming soon"
          subtitle="Swap between your FAIX balance and exchange assets right from your account. We're putting the finishing touches on it."
          right={
            <span className="inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full bg-[#d4af6a]/10 px-3 py-1.5 text-xs font-semibold text-[#e2c17f] ring-1 ring-inset ring-[#d4af6a]/25">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Launching soon</span>
            </span>
          }
        />

        <section
          className={`${CARD} relative overflow-hidden p-5 sm:p-7 lg:p-10`}
        >
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-3xl sm:h-64 sm:w-64" />
            <div className="absolute -bottom-20 -right-8 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl sm:-bottom-24 sm:right-10 sm:h-56 sm:w-56" />
            <div className="absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-[#d4af6a]/10 blur-3xl sm:-bottom-24 sm:left-10 sm:h-56 sm:w-56" />
          </div>

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/20 sm:h-16 sm:w-16">
              <Sparkles className="h-7 w-7 sm:h-8 sm:w-8" />
            </span>

            <h2 className="mt-4 text-xl font-semibold leading-tight text-white sm:mt-5 sm:text-2xl lg:text-3xl">
              Something new is on the way
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Exchange isn't live yet. Join the waitlist and we'll notify you
              the moment swaps open — your FAIX balance, holdings and history
              stay exactly as they are.
            </p>

            <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-2.5 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3">
              <button
                type="button"
                onClick={toggle}
                className={`${notify ? BTN.ghost : BTN.gold} min-h-11 w-full sm:w-auto`}
              >
                {notify ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>You're on the waitlist</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    <span>Notify me at launch</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate("Dashboard")}
                className={`${BTN.ghost} min-h-11 w-full sm:w-auto`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Back to dashboard</span>
              </button>
            </div>

            {notify && (
              <p className="mt-3 inline-flex max-w-full items-center justify-center gap-1.5 text-xs text-emerald-300">
                <BellRing className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Notifications on</span>
              </p>
            )}
          </div>
        </section>

        <section aria-label="What to expect">
          <SectionTitle
            icon={Coins}
            tone="gold"
            title="What to expect"
            subtitle="A first look at Exchange"
          />

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </section>

        <section className={`${CARD} p-4 sm:p-5`}>
          <SectionTitle
            icon={Clock}
            tone="violet"
            title="Rollout"
            subtitle="How Exchange will open up"
          />

          <ol className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            {ROADMAP.map((item, index) => (
              <RoadmapCard key={item.label} item={item} index={index} />
            ))}
          </ol>
        </section>

        {toast && <Toast message={toast} />}
      </div>
    </PageShell>
  );
}
