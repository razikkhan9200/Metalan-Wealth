/* Transactions.jsx — responsive + polished filters */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReceiptText,
  Search,
  Download,
  Clock,
  ArrowDownToLine,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ACCENT, CARD, TX_META, fmtDate } from "./shared/theme";
import { PageHeader, PageShell, SectionTitle, StatCard } from "./shared/ui";
import { get } from "../../services/Api";
import { mapTransaction } from "../../utils/apiMappers";

const TYPES = ["All", "Deposit", "Withdraw", "Investment", "Buy", "Exchange"];
const STATUSES = ["All", "Completed", "Pending", "Failed"];
const PAGE_SIZE = 6;

const FILTER_THEME_CSS = `
  .mt-root .mt-filter-trigger {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
    border-color: rgba(255,255,255,.10) !important;
  }

  .mt-root .mt-filter-trigger:hover {
    border-color: rgba(255,255,255,.18) !important;
  }

  .mt-root .mt-filter-trigger:focus {
    border-color: rgba(212,175,106,.45) !important;
    box-shadow: 0 0 0 1px rgba(212,175,106,.12);
  }

  .mt-root .mt-filter-menu {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
    border-color: rgba(255,255,255,.10) !important;
  }

  .mt-root[data-mt-theme="light"] .mt-filter-trigger {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
    border-color: rgba(15,23,42,.10) !important;
  }

  .mt-root[data-mt-theme="light"] .mt-filter-menu {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
    border-color: rgba(15,23,42,.10) !important;
  }
`;

const formatFaix = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

function SelectField({ value, onChange, options, allLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentLabel = value === "All" ? allLabel : value;

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        if (document.activeElement === ref.current?.querySelector("button")) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const choose = (option) => {
    onChange({ target: { value: option } });
    setOpen(false);
  };

  return (
    <>
      <style>{FILTER_THEME_CSS}</style>
      <div
        ref={ref}
      className={`relative w-full sm:w-auto sm:min-w-[150px] ${
        open ? "z-[100]" : "z-0"
      }`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border bg-[#080d14] px-3.5 text-left text-sm font-medium outline-none transition-all duration-200 ${
          open
            ? "border-[#d4af6a]/45 bg-[var(--mt-surface)] text-white ring-1 ring-[#d4af6a]/15"
            : "border-white/10 bg-[var(--mt-surface)] text-slate-200 hover:border-white/15"
        }`}
      >
        <span className="truncate">{currentLabel}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180 text-[#d4af6a]" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={allLabel}
          className="mt-filter-menu absolute left-0 right-0 top-[calc(100%+6px)] z-[110] overflow-hidden rounded-xl border border-white/10 bg-[var(--mt-surface)] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ring-1 ring-black/10"
        >
          {options.map((option) => {
            const label = option === "All" ? allLabel : option;
            const selected = option === value;

            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => choose(option)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selected
                    ? "bg-cyan-400/10 text-cyan-200"
                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span>{label}</span>
                {selected && (
                  <span className="ml-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d4af6a]" />
                )}
              </button>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
}

function TransactionRow({ transaction }) {
  const { icon: Icon, tone = "cyan" } =
    TX_META[transaction.type] || TX_META.Exchange || {};
  const isCredit = transaction.amount >= 0;

  return (
    <article className="px-3 py-4 sm:px-4">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 sm:h-11 sm:w-11 ${
            ACCENT[tone] || ACCENT.cyan
          }`}
        >
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <ReceiptText className="h-5 w-5" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p className="min-w-0 truncate text-sm font-medium text-white">
              {transaction.asset}
            </p>

            <p
              className={`shrink-0 text-left text-sm font-semibold tabular-nums sm:text-right ${
                isCredit ? "text-emerald-300" : "text-slate-200"
              }`}
            >
              {isCredit ? "+" : "−"}
              {formatFaix(Math.abs(transaction.amount))}{" "}
              <span className="text-[11px] font-normal text-slate-500">
                FAIX
              </span>
            </p>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[11px] text-slate-500">
            <span>{transaction.type}</span>
            <span className="text-slate-700">•</span>

            <span className="inline-flex min-w-0 items-center gap-1">
              <Clock className="h-3 w-3 shrink-0" />
              <span className="truncate">{fmtDate(transaction.date)}</span>
            </span>

            <span className="hidden text-slate-700 xs:inline">•</span>
            <span className="max-w-full break-all tabular-nums text-slate-600">
              {transaction.ref}
            </span>
          </div>
        </div>

        <span
          className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
            transaction.status === "Completed"
              ? "bg-emerald-400/10 text-emerald-300"
              : transaction.status === "Pending"
                ? "bg-amber-400/10 text-amber-300"
                : "bg-rose-400/10 text-rose-300"
          }`}
        >
          {transaction.status}
        </span>
      </div>
    </article>
  );
}

export default function Transactions({ onNavigate = () => {} }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");

      try {
        const res = await get("/transactions?page=1&limit=100");

        if (!cancelled) {
          setTxs((res.data?.records || []).map(mapTransaction));
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error.message || "Couldn't load your transactions."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return txs.filter((transaction) => {
      if (type !== "All" && transaction.type !== type) return false;
      if (status !== "All" && transaction.status !== status) return false;

      if (
        normalizedQuery &&
        !`${transaction.asset} ${transaction.type} ${transaction.ref}`
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        return false;
      }

      return true;
    });
  }, [txs, type, status, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );

  const totalIn = txs
    .filter((t) => t.amount > 0 && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = txs
    .filter((t) => t.amount < 0 && t.status === "Completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const pending = txs.filter((t) => t.status === "Pending").length;

  return (
    <PageShell active="Transactions" onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-5 overflow-x-hidden sm:space-y-6">
        <PageHeader
          icon={ReceiptText}
          tone="violet"
          eyebrow="Transactions"
          title="Every deposit, investment and purchase, in one place"
          subtitle="Track fund investments, property purchases, exchanges, deposits and withdrawals across your account."
          right={
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:border-cyan-400/40 hover:text-cyan-200 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          }
        />

        {/* Stats */}
        <section
          aria-label="Transaction summary"
          className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            icon={ReceiptText}
            tone="cyan"
            label="Total transactions"
            value={String(txs.length)}
            note="All time"
          />

          <StatCard
            icon={ArrowDownToLine}
            tone="emerald"
            label="Total inflows"
            value={formatFaix(totalIn)}
            unit="FAIX"
            note="Deposits & exchanges in"
          />

          <StatCard
            icon={ArrowUpRight}
            tone="gold"
            label="Total outflows"
            value={formatFaix(totalOut)}
            unit="FAIX"
            note="Investments, buys & withdrawals"
          />

          <StatCard
            icon={Clock}
            tone="rose"
            label="Pending"
            value={String(pending)}
            note="Awaiting settlement"
          />
        </section>

        {/* Filters */}
        <section
          className={`${CARD} relative z-[90] overflow-visible flex flex-col gap-3 p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:p-4`}
        >
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 transition-colors focus-within:border-cyan-400/50">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="Search by asset, type or reference"
              className="min-w-0 w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <SelectField
            value={type}
            options={TYPES}
            allLabel="All types"
            onChange={(event) => {
              setType(event.target.value);
              setPage(0);
            }}
          />

          <SelectField
            value={status}
            options={STATUSES}
            allLabel="All statuses"
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          />
        </section>

        {/* List */}
        <section className={`${CARD} relative z-0 min-w-0 overflow-hidden`}>
          <div className="p-4 pb-0 sm:p-5 sm:pb-0">
            <SectionTitle
              icon={ReceiptText}
              tone="violet"
              title="History"
              subtitle={`${filtered.length} matching transactions`}
            />
          </div>

          <div className="divide-y divide-white/[0.05] px-1.5 pb-1.5 sm:px-3 sm:pb-2">
            {loading && (
              <div className="p-8 text-center text-sm text-slate-500">
                Loading transactions…
              </div>
            )}

            {!loading && loadError && (
              <div className="p-8 text-center text-sm text-rose-300">
                {loadError}
              </div>
            )}

            {!loading &&
              !loadError &&
              pageItems.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}

            {!loading && !loadError && pageItems.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                No transactions match your filters.
              </div>
            )}
          </div>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3.5 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between sm:px-5">
              <p className="text-center text-[11px] text-slate-500 min-[430px]:text-left">
                Page {safePage + 1} of {pageCount}
              </p>

              <div className="flex items-center justify-center gap-2 min-[430px]:justify-end">
                <button
                  type="button"
                  disabled={safePage === 0}
                  onClick={() =>
                    setPage((current) => Math.max(0, current - 1))
                  }
                  aria-label="Previous page"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  disabled={safePage >= pageCount - 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(pageCount - 1, current + 1)
                    )
                  }
                  aria-label="Next page"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}