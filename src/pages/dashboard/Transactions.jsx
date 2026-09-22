"use client";
/**
 * Transactions.jsx — dedicated "Transactions" page for the Metalan platform.
 * Dummy data only, same visual language as UserAdmin.jsx (dark navy / gold / cyan).
 */
import { useEffect, useMemo, useState } from "react";
import {
  ReceiptText, Search, Download, Clock, ArrowDownToLine, ArrowUpRight, ChevronLeft, ChevronRight,
} from "lucide-react";
import { ACCENT, CARD, TX_META, fmt0, fmtDate } from "./shared/theme";
import { PageHeader, PageShell, SectionTitle, StatCard } from "./shared/ui";
import { get } from "../../services/Api";
import { mapTransaction } from "../../utils/apiMappers";

const TYPES = ["All", "Deposit", "Withdraw", "Investment", "Buy", "Exchange"];
const STATUSES = ["All", "Completed", "Pending", "Failed"];
const PAGE_SIZE = 6;

export default function Transactions({ onNavigate = () => {} }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(0);

  // Fetched once (a generous limit, since the type/status filters
  // below are applied client-side to match the existing UI) rather
  // than the SEED_TXS dummy array this page used to read from
  // directly. See Backend/src/routes/transaction.routes.js for
  // GET /transactions.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        // Backend caps `limit` at 100 (see Backend/src/controllers/
        // transaction.controller.js) — asking for more just gets
        // clamped, so requesting exactly the max here.
        const res = await get("/transactions?page=1&limit=100");
        if (!cancelled) setTxs((res.data.records || []).map(mapTransaction));
      } catch (error) {
        if (!cancelled) setLoadError(error.message || "Couldn't load your transactions.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return txs.filter((t) => {
      if (type !== "All" && t.type !== type) return false;
      if (status !== "All" && t.status !== status) return false;
      if (query && !`${t.asset} ${t.type} ${t.ref}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [txs, type, status, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const totalIn = txs.filter((t) => t.amount > 0 && t.status === "Completed").reduce((s, t) => s + t.amount, 0);
  const totalOut = txs.filter((t) => t.amount < 0 && t.status === "Completed").reduce((s, t) => s + Math.abs(t.amount), 0);
  const pending = txs.filter((t) => t.status === "Pending").length;

  return (
    <PageShell active="Transactions" onNavigate={onNavigate}>
      <PageHeader
        icon={ReceiptText}
        tone="violet"
        eyebrow="Transactions"
        title="Every deposit, investment and purchase, in one place"
        subtitle="Track fund investments, property purchases, exchanges, deposits and withdrawals across your account."
        right={
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:border-cyan-400/40 hover:text-cyan-200">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      {/* stats */}
      <section aria-label="Transaction summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={ReceiptText} tone="cyan" label="Total transactions" value={String(txs.length)} note="All time" />
        <StatCard icon={ArrowDownToLine} tone="emerald" label="Total inflows" value={fmt0(totalIn)} unit="FAIX" note="Deposits & exchanges in" />
        <StatCard icon={ArrowUpRight} tone="gold" label="Total outflows" value={fmt0(totalOut)} unit="FAIX" note="Investments, buys & withdrawals" />
        <StatCard icon={Clock} tone="rose" label="Pending" value={String(pending)} note="Awaiting settlement" />
      </section>

      {/* filters */}
      <section className={`${CARD} flex flex-wrap items-center gap-3 p-4`}>
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }} placeholder="Search by asset, type or reference"
            className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
          />
        </div>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(0); }}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-400/50">
          {TYPES.map((t) => <option key={t} value={t} className="bg-[#0a1019]">{t === "All" ? "All types" : t}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }}
          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-400/50">
          {STATUSES.map((s) => <option key={s} value={s} className="bg-[#0a1019]">{s === "All" ? "All statuses" : s}</option>)}
        </select>
      </section>

      {/* list */}
      <section className={CARD}>
        <div className="p-5 pb-0">
          <SectionTitle icon={ReceiptText} tone="violet" title="History" subtitle={`${filtered.length} matching transactions`} />
        </div>
        <div className="divide-y divide-white/[0.05] px-2 pb-2 sm:px-3">
          {loading && <div className="p-8 text-center text-sm text-slate-500">Loading transactions…</div>}
          {!loading && loadError && <div className="p-8 text-center text-sm text-rose-300">{loadError}</div>}
          {!loading && !loadError && pageItems.map((t) => {
            const { icon: Icon, tone } = TX_META[t.type];
            return (
              <div key={t.id} className="flex items-center gap-4 px-3 py-4">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ${ACCENT[tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <p className="truncate text-sm font-medium text-white">{t.asset}</p>
                    <p className={`text-sm font-semibold tabular-nums ${t.amount >= 0 ? "text-emerald-300" : "text-slate-200"}`}>
                      {t.amount >= 0 ? "+" : "−"}{fmt0(Math.abs(t.amount))} <span className="text-[11px] font-normal text-slate-500">FAIX</span>
                    </p>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span>{t.type}</span>
                    <span className="text-slate-700">•</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDate(t.date)}</span>
                    <span className="text-slate-700">•</span>
                    <span className="tabular-nums text-slate-600">{t.ref}</span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  t.status === "Completed" ? "bg-emerald-400/10 text-emerald-300" : t.status === "Pending" ? "bg-amber-400/10 text-amber-300" : "bg-rose-400/10 text-rose-300"
                }`}>
                  {t.status}
                </span>
              </div>
            );
          })}
          {!loading && !loadError && pageItems.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">No transactions match your filters.</div>
          )}
        </div>

        {/* pagination */}
        {filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3.5">
            <p className="text-[11px] text-slate-500">Page {page + 1} of {pageCount}</p>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
