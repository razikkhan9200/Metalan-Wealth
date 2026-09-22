"use client";
/**
 * Wallet.jsx — dedicated "Wallet" page for the Metalan platform.
 * Dummy data only, same visual language as UserAdmin.jsx (dark navy / gold / cyan).
 */
import { useEffect, useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Wallet as WalletIcon, Plus, ArrowLeftRight, ArrowDownToLine, Landmark, CreditCard, Check,
  Clock, Coins, ShieldCheck, Copy,
} from "lucide-react";
import { ACCENT, BTN, C, CARD, TX_META, fmt, fmt0, fmtDate } from "./shared/theme";
import {
  AmountField, FormError, InfoList, InfoRow, Modal, PageHeader, PageShell, SectionTitle, StatCard, Toast,
} from "./shared/ui";
import { get, post } from "../../services/Api";
import { mapTransaction } from "../../utils/apiMappers";

// Display-only — the fee that will apply once the Exchange feature
// (no backend endpoint yet) ships.
const EXCHANGE_FEE = 0.0025;

const METHODS = [
  { id: "Bank transfer", icon: Landmark },
  { id: "Card", icon: CreditCard },
  { id: "Crypto wallet", icon: WalletIcon },
];

// Deterministic 30-day balance trend ending at the live balance.
function buildBalanceSeries(current) {
  let seed = 771;
  const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const points = [];
  let v = current * 0.82;
  for (let i = 29; i >= 0; i--) {
    if (i === 0) v = current;
    else v = v * (1 + (rng() - 0.42) * 0.045);
    const d = new Date(Date.now() - i * 86400e3);
    points.push({ label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: Math.max(0, v) });
  }
  return points;
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1019]/95 px-3.5 py-2.5 shadow-2xl backdrop-blur">
      <p className="text-[11px] text-slate-400">{p.label}</p>
      <p className="mt-1 text-base font-semibold tabular-nums text-white">{fmt(p.value)} <span className="text-[11px] font-normal text-slate-500">FAIX</span></p>
    </div>
  );
}

export default function Wallet({ onNavigate = () => {} }) {
  const [faix, setFaix] = useState(0);
  // Exchange assets have no backend support yet (no swap/exchange
  // endpoint exists on the backend) — kept at zero rather than a
  // fabricated starting balance, and the Exchange flow below stays a
  // local-only "Coming soon" preview.
  const [exchange] = useState({ value: 0, cost: 0 });
  const [txs, setTxs] = useState([]);
  const [modal, setModal] = useState(null); // "deposit" | "withdraw" | "exchange" | null
  const [toast, setToast] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Real data: wallet/FAIX summary + recent transactions, replacing
  // the hardcoded faix=42500 and SEED_TXS dummy array this page used
  // to start from.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const [walletRes, txRes] = await Promise.all([
          get("/wallet/me"),
          get("/transactions?page=1&limit=20"),
        ]);
        if (cancelled) return;
        setFaix(walletRes.data.userTokenSummary.availableFaixToken);
        setTxs((txRes.data.records || []).map(mapTransaction));
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Couldn't load your wallet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const series = useMemo(() => buildBalanceSeries(faix), [faix]);
  const exchangeGain = exchange.value - exchange.cost;
  const totalWorth = faix + exchange.value;

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const addFunds = async ({ amount, method }) => {
    try {
      const res = await post("/wallet/deposit", { amount });
      const { userTokenSummary, transaction } = res.data;
      setFaix(userTokenSummary.availableFaixToken);
      setTxs((prev) => [mapTransaction(transaction), ...prev]);
      notify(res.message || `Added ${fmt0(amount)} FAIX via ${method}`);
    } catch (error) {
      notify(error.message || "Couldn't add funds. Please try again.");
    }
  };

  // Withdraw and Exchange have no backend endpoint yet — rather than
  // silently mutating local state as if money moved, both modals now
  // show a "Coming soon" message (see ComingSoon below).

  return (
    <PageShell active="Wallet" onNavigate={onNavigate}>
      <PageHeader
        icon={WalletIcon}
        tone="emerald"
        eyebrow="Wallet"
        title="Your FAIX balance and exchange assets"
        subtitle="Deposit, withdraw, and move value between your FAIX balance and exchange assets."
        right={
          <>
            <button type="button" onClick={() => onNavigate("Exchange")} className={BTN.cyanSoft}>
              <ArrowLeftRight className="h-4 w-4" /> Exchange <span className="rounded-full bg-[#d4af6a]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#e2c17f]">Soon</span>
            </button>
            <button type="button" onClick={() => setModal("deposit")} className={BTN.gold}>
              <Plus className="h-4 w-4" /> Add funds
            </button>
          </>
        }
      />

      {/* balance hero */}
      <section className={`${CARD} grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_1fr] lg:items-center`}>
        <div>
          <p className="text-sm text-slate-400">Total wallet worth</p>
          <p className="mt-2 text-4xl font-semibold tabular-nums text-white sm:text-5xl">
            {fmt0(totalWorth)} <span className="ml-1 text-base font-medium text-slate-400 sm:text-lg">FAIX</span>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Available {fmt0(faix)} FAIX
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-200">
              <Coins className="h-3.5 w-3.5 text-[#e2c17f]" /> Exchange {fmt0(exchange.value)} FAIX
            </span>
          </div>
          <button
            type="button"
            onClick={() => { navigator.clipboard?.writeText("FAIX-WALLET-8231-9940"); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            <Copy className="h-3.5 w-3.5" /> {copied ? "Copied wallet ID" : "FAIX-WALLET-8231-9940"}
          </button>
        </div>
        <div className="h-40 w-full [&_*]:outline-none sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="walletFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.cyan} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" hide />
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Tooltip content={<ChartTooltip />} />
              <Area dataKey="value" type="monotone" stroke={C.cyan} strokeWidth={2} fill="url(#walletFill)" dot={false} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="mt-1 text-center text-[11px] text-slate-500">FAIX balance — last 30 days</p>
        </div>
      </section>

      {/* stats */}
      <section aria-label="Wallet overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={WalletIcon} tone="cyan" label="Available FAIX" value={fmt0(faix)} unit="FAIX" note="Ready to invest or withdraw" />
        <StatCard icon={Coins} tone="gold" label="Exchange assets" value={fmt0(exchange.value)} unit="FAIX" change={exchange.cost > 0 ? (exchangeGain / exchange.cost) * 100 : 0} note="Value of swapped assets" />
        <StatCard icon={ArrowDownToLine} tone="emerald" label="Deposited (30d)" value={fmt0(txs.filter((t) => t.type === "Deposit").reduce((s, t) => s + t.amount, 0))} unit="FAIX" note="Total top-ups" />
        <StatCard icon={ArrowLeftRight} tone="violet" label="Exchange fee" value={`${(EXCHANGE_FEE * 100).toFixed(2)}%`} note="Applied per swap" />
      </section>

      {/* quick actions */}
      <section aria-label="Wallet actions" className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <button type="button" onClick={() => setModal("deposit")} className={`${CARD} flex items-center gap-3 p-4 text-left transition-colors hover:border-white/15`}>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT.emerald}`}><Plus className="h-5 w-5" /></span>
          <span><span className="block text-sm font-semibold text-white">Add funds</span><span className="hidden text-xs text-slate-500 sm:block">Top up your FAIX balance</span></span>
        </button>
        <button type="button" onClick={() => setModal("withdraw")} className={`${CARD} flex items-center gap-3 p-4 text-left transition-colors hover:border-white/15`}>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT.rose}`}><ArrowDownToLine className="h-5 w-5" /></span>
          <span><span className="block text-sm font-semibold text-white">Withdraw <span className="ml-1 rounded-full bg-[#d4af6a]/15 px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wide text-[#e2c17f]">Soon</span></span><span className="hidden text-xs text-slate-500 sm:block">Send FAIX to bank or crypto</span></span>
        </button>
        <button type="button" onClick={() => onNavigate("Exchange")} className={`${CARD} flex items-center gap-3 p-4 text-left transition-colors hover:border-white/15`}>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT.violet}`}><ArrowLeftRight className="h-5 w-5" /></span>
          <span><span className="block text-sm font-semibold text-white">Exchange <span className="ml-1 rounded-full bg-[#d4af6a]/15 px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wide text-[#e2c17f]">Soon</span></span><span className="hidden text-xs text-slate-500 sm:block">Token exchange is coming soon</span></span>
        </button>
      </section>

      {/* recent activity */}
      <section className={`${CARD} p-5`}>
        <SectionTitle icon={Clock} tone="cyan" title="Recent wallet activity" subtitle="Latest deposits, withdrawals and exchanges" />
        {loading && <p className="py-6 text-center text-sm text-slate-500">Loading…</p>}
        {!loading && loadError && <p className="py-6 text-center text-sm text-rose-300">{loadError}</p>}
        {!loading && !loadError && txs.filter((t) => ["Deposit", "Withdraw", "Exchange"].includes(t.type)).length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">No wallet activity yet.</p>
        )}
        <div className="divide-y divide-white/[0.05]">
          {!loading && !loadError && txs.filter((t) => ["Deposit", "Withdraw", "Exchange"].includes(t.type)).slice(0, 6).map((t) => {
            const { icon: Icon, tone } = TX_META[t.type];
            return (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}><Icon className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-100">{t.type}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500"><Clock className="h-3 w-3" />{fmtDate(t.date)}</p>
                </div>
                <p className={`shrink-0 text-sm font-semibold tabular-nums ${t.amount >= 0 ? "text-emerald-300" : "text-slate-200"}`}>
                  {t.amount >= 0 ? "+" : "−"}{fmt0(Math.abs(t.amount))}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {modal === "deposit" && (
        <Modal title="Add funds" subtitle="Top up your FAIX balance." icon={Plus} tone="emerald" onClose={() => setModal(null)}>
          {(close) => <DepositForm faix={faix} onSubmit={(p) => { addFunds(p); close(); }} />}
        </Modal>
      )}
      {modal === "withdraw" && (
        <Modal title="Withdraw" subtitle="Send FAIX to a bank or crypto wallet." icon={ArrowDownToLine} tone="rose" onClose={() => setModal(null)}>
          {() => <ComingSoon text="Withdrawals are coming soon. Our team will notify you once this is live." />}
        </Modal>
      )}
      {modal === "exchange" && (
        <Modal title="Exchange" subtitle="Move value between FAIX and exchange assets." icon={ArrowLeftRight} tone="violet" onClose={() => setModal(null)}>
          {() => <ComingSoon text="Exchange assets are coming soon. Your FAIX balance is unaffected." />}
        </Modal>
      )}

      {toast && <Toast message={toast} />}
    </PageShell>
  );
}

function DepositForm({ faix, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(METHODS[0].id);
  const amt = Math.max(0, parseFloat(amount) || 0);
  const error = amt > 1_000_000 ? "The maximum single deposit is 1,000,000 FAIX." : "";
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
        <InfoRow label="Current balance" value={`${fmt(faix)} FAIX`} />
        <InfoRow label="Balance after" value={`${fmt(faix + (error ? 0 : amt))} FAIX`} accent="text-emerald-300" />
      </InfoList>
      <FormError>{error}</FormError>
      <button type="button" disabled={amt <= 0 || !!error} onClick={() => onSubmit({ amount: amt, method })} className={`${BTN.gold} w-full`}>
        <Plus className="h-4 w-4" /> Add funds
      </button>
    </div>
  );
}

// Shown in place of the Withdraw/Exchange forms until the backend
// grows the matching endpoints.
function ComingSoon({ text }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-400">
        <Clock className="h-5 w-5" />
      </span>
      <p className="max-w-xs text-sm text-slate-400">{text}</p>
    </div>
  );
}
