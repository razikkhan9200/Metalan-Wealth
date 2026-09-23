/* FundInvestments.jsx — dedicated "Fund Investments" page for the Metalan platform.
 * Dummy data only, same visual language as UserAdmin.jsx (dark navy / gold / cyan).
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Layers,
  Wallet,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  ACCENT,
  BTN,
  CARD,
  RISK,
  fmt,
  fmt0,
} from "./shared/theme";
import {
  AmountField,
  FormError,
  InfoList,
  InfoRow,
  Modal,
  OptionList,
  PageHeader,
  PageShell,
  SectionTitle,
  StatCard,
  Toast,
} from "./shared/ui";
import { get, post } from "../../services/Api";
import { mapFund, TOKEN_VALUE } from "../../utils/apiMappers";

const RISK_LEVELS = ["All", "Low", "Moderate", "High"];

const FILTER_THEME_CSS = `
  .mt-root .mt-filter-trigger {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
    border-color: rgba(255,255,255,.10) !important;
  }

  .mt-root[data-mt-theme="light"] .mt-filter-trigger {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
    border-color: rgba(15,23,42,.10) !important;
  }

  .mt-root .mt-filter-menu {
    background: var(--mt-surface) !important;
    color: var(--color-slate-200) !important;
  }
`;

const GOLD_MODAL_THEME_CSS = `
  .mt-gold-modal {
    --mt-gold: #d4af6a;
    --mt-gold-light: #e2c17f;
    --mt-gold-soft: rgba(212,175,106,.10);
    --mt-gold-border: rgba(212,175,106,.28);
  }

  .mt-gold-modal [class*="border-cyan-400"] {
    border-color: rgba(212,175,106,.42) !important;
  }

  .mt-gold-modal [class*="ring-cyan-400"] {
    --tw-ring-color: rgba(212,175,106,.20) !important;
  }

  .mt-gold-modal [class*="bg-cyan-400"] {
    background-color: rgba(212,175,106,.10) !important;
  }

  .mt-gold-modal [class*="text-cyan-300"],
  .mt-gold-modal [class*="text-cyan-200"] {
    color: #d4af6a !important;
  }

  .mt-gold-modal [data-selected="true"] {
    border-color: rgba(212,175,106,.45) !important;
    background: rgba(212,175,106,.08) !important;
  }

  .mt-gold-modal [data-selected="true"]:hover {
    background: rgba(212,175,106,.12) !important;
  }

  .mt-gold-modal input {
    color: #111827 !important;
    caret-color: #b18b45 !important;
  }

  .mt-gold-modal input::placeholder {
    color: #94a3b8 !important;
  }

  .mt-gold-modal button:hover {
    border-color: rgba(212,175,106,.35);
  }
`;

function FilterSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!event.target.closest?.("[data-filter-select]")) {
        setOpen(false);
      }
    };

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <style>{FILTER_THEME_CSS}</style>

      <div
        data-filter-select
        className={`relative w-full sm:w-auto sm:min-w-[165px] ${
          open ? "z-[100]" : "z-0"
        }`}
      >
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`mt-filter-trigger flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm font-medium outline-none transition-all duration-200 ${
            open
              ? "border-[#d4af6a]/45 bg-[var(--mt-surface)] text-white ring-1 ring-[#d4af6a]/15"
              : "border-white/10 bg-[var(--mt-surface)] text-slate-200 hover:border-[#d4af6a]/25"
          }`}
        >
          <span className="min-w-0 truncate">
            {value === "All" ? label : value}
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
              open ? "rotate-180 text-[#d4af6a]" : ""
            }`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="mt-filter-menu absolute left-0 right-0 top-[calc(100%+6px)] z-[110] overflow-hidden rounded-xl border border-[#d4af6a]/25 bg-[var(--mt-surface)] p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] ring-1 ring-black/10"
          >
            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                    selected
                      ? "bg-[#d4af6a]/10 text-[#b18b45]"
                      : "text-slate-300 hover:bg-[#d4af6a]/7 hover:text-[#b18b45]"
                  }`}
                >
                  <span className="truncate">
                    {option === "All" ? label : option}
                  </span>

                  {selected && (
                    <Check className="h-4 w-4 shrink-0 text-[#d4af6a]" />
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

export default function FundInvestments({ onNavigate = () => {} }) {
  const [faix, setFaix] = useState(0);
  const [funds, setFunds] = useState([]);
  const [fundPos, setFundPos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [category, setCategory] = useState("All");
  const [risk, setRisk] = useState("All");
  const [query, setQuery] = useState("");
  const [modalId, setModalId] = useState(null); // fund id being invested in, or null
  const [toast, setToast] = useState(null);

  const navs = useMemo(
    () => Object.fromEntries(funds.map((f) => [f.id, f.nav])),
    [funds]
  );

  const CATEGORIES = useMemo(
    () => ["All", ...Array.from(new Set(funds.map((f) => f.category)))],
    [funds]
  );

  // Real data: available FAIX (wallet), the fund catalog, and the
  // user's own existing fund investments — replacing the FUNDS/
  // INITIAL_FUNDS dummy arrays this page used to import from
  // shared/theme.js. Calls hit the backend directly via get/post from
  // services/Api.js — see Backend/src/routes/wallet.routes.js and
  // Backend/src/routes/fund.routes.js for the endpoints.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");

      try {
        const [walletRes, fundsRes, investmentsRes] = await Promise.all([
          get("/wallet/me"),
          get("/funds"),
          get("/funds/investments"),
        ]);

        if (cancelled) return;

        setFaix(walletRes.data.userTokenSummary.availableFaixToken);

        const mappedFunds = fundsRes.data.funds.map((rawFund) => {
          const mapped = mapFund(rawFund);

          return {
            ...mapped,
            img:
              rawFund?.imageUrl ||
              rawFund?.image ||
              rawFund?.coverImage ||
              mapped?.img ||
              "",
          };
        });

        setFunds(mappedFunds);

        // Aggregate every investment into this fund into one
        // { units, cost } position — a user can invest in the same
        // fund more than once, and the backend returns each of those
        // as a separate FundInvestment record.
        const positions = {};

        investmentsRes.data.investments.forEach((inv) => {
          const fundId = inv.fund;
          const existing = positions[fundId];

          positions[fundId] = existing
            ? {
                units: existing.units + inv.units,
                cost: existing.cost + inv.investmentAmount,
              }
            : {
                units: inv.units,
                cost: inv.investmentAmount,
              };
        });

        setFundPos(positions);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Couldn't load funds.");
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
    return funds.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (risk !== "All" && f.risk !== risk) return false;

      if (
        query &&
        !f.name.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [funds, category, risk, query]);

  const { fundsValue, fundsCost } = useMemo(() => {
    let fv = 0;
    let fc = 0;

    funds.forEach((f) => {
      const p = fundPos[f.id];

      if (p) {
        fv += p.units * navs[f.id];
        fc += p.cost;
      }
    });

    return {
      fundsValue: fv,
      fundsCost: fc,
    };
  }, [funds, fundPos, navs]);

  const returns = fundsValue - fundsCost;
  const returnsPct =
    fundsCost > 0 ? (returns / fundsCost) * 100 : 0;

  const positions = Object.keys(fundPos).length;

  // `amount` is a FAIX quantity (matches the form's own "Available
  // FAIX" validation) — converted to a ₹ investmentAmount using the
  // same fixed 1 FAIX = ₹11 rate the backend uses everywhere, since
  // POST /funds/invest wants both figures explicitly.
  const investInFund = async ({ fund, amount, units }) => {
    try {
      const investmentAmount = amount * TOKEN_VALUE;

      const res = await post("/funds/invest", {
        fundName: fund.name,
        investmentAmount,
        faixTokenUsed: amount,
      });

      setFaix((v) => Math.max(v - amount, 0));

      setFundPos((prev) => {
        const existing = prev[fund.id];

        return {
          ...prev,
          [fund.id]: existing
            ? {
                units: existing.units + units,
                cost: existing.cost + investmentAmount,
              }
            : {
                units,
                cost: investmentAmount,
              },
        };
      });

      setToast(
        res.message ||
          `Invested ${fmt0(amount)} FAIX in ${fund.name}`
      );
    } catch (error) {
      setToast(
        error.message ||
          "Couldn't complete the investment."
      );
    } finally {
      setTimeout(() => setToast(null), 3200);
    }
  };

  const modalFund = modalId
    ? funds.find((f) => f.id === modalId)
    : null;

  return (
    <PageShell active="Investments" onNavigate={onNavigate}>
      <div className="mx-auto w-full max-w-7xl min-w-0 space-y-5 overflow-x-hidden sm:space-y-6">

        <PageHeader
          icon={Briefcase}
          tone="gold"
          eyebrow="Fund Investments"
          title="Grow your wealth across curated funds"
          subtitle="Invest FAIX into professionally managed equity, income, real estate, digital asset and thematic funds at today's NAV."
          right={
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-[#d4af6a]/20 bg-[#d4af6a]/[0.04] px-4 py-2.5 text-left backdrop-blur-md sm:text-right">
                <p className="text-[11px] text-slate-400">
                  Available FAIX
                </p>

                <p className="text-lg font-semibold tabular-nums text-[#d4af6a]">
                  {fmt(faix, 4)}
                </p>
              </div>

              <button
                type="button"
                disabled={funds.length === 0}
                onClick={() => setModalId(funds[0].id)}
                className={`${BTN.gold} shadow-[0_8px_24px_rgba(212,175,106,.16)]`}
              >
                <TrendingUp className="h-4 w-4" />
                Invest now
              </button>
            </div>
          }
        />

        {/* stats */}
        <section
          aria-label="Fund portfolio overview"
          className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            icon={Briefcase}
            tone="violet"
            label="Invested (cost)"
            value={fmt(fundsCost)}
            unit="FAIX"
            note="Across all fund positions"
          />

          <StatCard
            icon={Sparkles}
            tone="gold"
            label="Current value"
            value={fmt(fundsValue)}
            unit="FAIX"
            note="Live NAV valuation"
          />

          <StatCard
            icon={TrendingUp}
            tone="emerald"
            label="Total returns"
            value={`${returns >= 0 ? "+" : ""}${fmt(returns)}`}
            unit="FAIX"
            change={returnsPct}
            note="Since first investment"
          />

          <StatCard
            icon={Layers}
            tone="gold"
            label="Fund positions"
            value={String(positions)}
            note={`Out of ${funds.length} available funds`}
          />
        </section>

        {/* holdings */}
        {positions > 0 && (
          <section
            className={`${CARD} min-w-0 overflow-hidden border-[#d4af6a]/10 p-4 sm:p-5`}
          >
            <SectionTitle
              icon={Layers}
              tone="gold"
              title="Your fund holdings"
              subtitle="Units held at today's NAV"
            />

            <div className="mt-1 overflow-x-auto mt-thin">
              <table className="w-full min-w-[620px] border-separate border-spacing-y-1 text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-2 font-medium">
                      Fund
                    </th>
                    <th className="px-3 py-2 font-medium">
                      Units
                    </th>
                    <th className="px-3 py-2 font-medium">
                      Cost
                    </th>
                    <th className="px-3 py-2 font-medium">
                      Value
                    </th>
                    <th className="px-3 py-2 font-medium">
                      Gain / loss
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(fundPos).map(([id, pos]) => {
                    const fund = funds.find(
                      (f) => f.id === id
                    );

                    if (!fund) return null;

                    const value =
                      pos.units * navs[id];

                    const gain =
                      value - pos.cost;

                    return (
                      <tr
                        key={id}
                        className="rounded-xl bg-white/[0.02] text-slate-200"
                      >
                        <td className="rounded-l-xl px-3 py-3 font-medium text-white">
                          {fund.name}
                        </td>

                        <td className="px-3 py-3 tabular-nums text-slate-400">
                          {fmt(pos.units, 4)}
                        </td>

                        <td className="px-3 py-3 tabular-nums text-slate-400">
                          {fmt(pos.cost, 4)}
                        </td>

                        <td className="px-3 py-3 tabular-nums text-white">
                          {fmt(value, 4)}
                        </td>

                        <td
                          className={`rounded-r-xl px-3 py-3 tabular-nums font-medium ${
                            gain >= 0
                              ? "text-emerald-300"
                              : "text-rose-300"
                          }`}
                        >
                          {gain >= 0 ? "+" : ""}
                          {fmt(gain, 4)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* filters */}
        <section
          className={`${CARD} relative z-[90] flex flex-col gap-3 overflow-visible border-[#d4af6a]/10 p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:p-4`}
        >
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 transition-colors focus-within:border-[#d4af6a]/40">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search funds"
              className="min-w-0 w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="hidden h-9 w-px bg-white/[0.06] sm:block" />

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#d4af6a]" />

            <span className="text-xs font-medium text-slate-500 sm:hidden">
              Filters
            </span>
          </div>

          <FilterSelect
            value={category}
            options={CATEGORIES}
            label="All categories"
            onChange={(value) => setCategory(value)}
          />

          <FilterSelect
            value={risk}
            options={RISK_LEVELS}
            label="All risk levels"
            onChange={(value) => setRisk(value)}
          />
        </section>

        {/* fund grid */}
        <section aria-label="Available funds">
          <SectionTitle
            icon={Briefcase}
            tone="gold"
            title="Available funds"
            subtitle={`${filtered.length} of ${funds.length} funds`}
          />

          {loading && (
            <div
              className={`${CARD} p-8 text-center text-sm text-slate-500`}
            >
              Loading funds…
            </div>
          )}

          {!loading && loadError && (
            <div
              className={`${CARD} p-8 text-center text-sm text-rose-300`}
            >
              {loadError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {!loading &&
              !loadError &&
              filtered.map((f) => {
                const held = fundPos[f.id];

                const currentValue = held
                  ? held.units * f.nav
                  : 0;

                const gain = held
                  ? currentValue - held.cost
                  : 0;

                const riskClass =
                  RISK[f.risk] ||
                  "bg-white/[0.04] text-slate-300 ring-white/10";

                const soldPercent = Math.max(
                  0,
                  Math.min(
                    100,
                    Number(f.soldPercent) || 0
                  )
                );

                return (
                  <article
                    key={f.id}
                    className="
                      group relative min-w-0 overflow-hidden
                      rounded-2xl border border-white/[0.07]
                      bg-[#0a1019]
                      shadow-[0_12px_40px_rgba(0,0,0,.18)]
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-[#d4af6a]/30
                      hover:shadow-[0_18px_50px_rgba(212,175,106,.10)]
                    "
                  >
                    {/* Fund image */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,106,.16),transparent_36%),linear-gradient(135deg,#141c28,#080d14)]">
                      {f.img ? (
                        <img
                          src={f.img}
                          alt={f.name}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="
                            absolute inset-0 z-10
                            h-full w-full object-cover
                            transition-transform duration-700
                            ease-out
                            group-hover:scale-105
                          "
                          onError={(event) => {
                            event.currentTarget.style.opacity = "0";
                          }}
                        />
                      ) : null}

                      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#071019] via-[#071019]/45 to-black/5" />

                      <div className="absolute inset-x-3 top-3 z-30 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
                        <span className="max-w-[62%] truncate rounded-full border border-[#d4af6a]/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-[#e2c17f] backdrop-blur-md">
                          {f.category}
                        </span>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${riskClass}`}
                        >
                          {f.risk || "Standard"} risk
                        </span>
                      </div>

                      <div className="absolute inset-x-3 bottom-3 z-30 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.18em] text-white/55">
                            Investment fund
                          </p>

                          <h3 className="mt-0.5 truncate text-base font-semibold text-white sm:text-lg">
                            {f.name}
                          </h3>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            f.status === "Open"
                              ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20"
                              : "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20"
                          }`}
                        >
                          {f.status}
                        </span>
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="p-4 sm:p-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                          <p className="text-[9px] uppercase tracking-[0.13em] text-slate-500">
                            NAV
                          </p>

                          <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                            {fmt(f.nav, 4)}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-500">
                            FAIX / unit
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#d4af6a]/10 bg-[#d4af6a]/[0.035] p-3">
                          <p className="text-[9px] uppercase tracking-[0.13em] text-slate-500">
                            1Y growth
                          </p>

                          <p className="mt-1 text-sm font-semibold tabular-nums text-emerald-300">
                            {f.growth >= 0 ? "+" : ""}
                            {Number(f.growth || 0).toFixed(1)}%
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-500">
                            Performance
                          </p>
                        </div>
                      </div>

                      {/* allocation */}
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between gap-3 text-[10px]">
                          <span className="text-slate-500">
                            Fund allocation
                          </span>

                          <span className="shrink-0 tabular-nums text-[#b18b45]">
                            {soldPercent.toFixed(0)}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#a37b37] via-[#d4af6a] to-[#e2c17f] transition-all duration-700"
                            style={{
                              width: `${soldPercent}%`,
                            }}
                          />
                        </div>
                      </div>

                      {held && (
                        <div className="mt-4 rounded-xl border border-[#d4af6a]/15 bg-[#d4af6a]/[0.035] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[9px] uppercase tracking-[0.13em] text-slate-500">
                                Your position
                              </p>

                              <p className="mt-1 truncate text-xs font-medium text-[#e2c17f]">
                                {fmt(
                                  held.units,
                                  4
                                )}{" "}
                                units
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-[9px] text-slate-500">
                                Current value
                              </p>

                              <p className="mt-1 text-xs font-semibold tabular-nums text-white">
                                {fmt(
                                  currentValue,
                                  4
                                )}{" "}
                                FAIX
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3 text-[10px]">
                            <span className="text-slate-500">
                              Gain / loss
                            </span>

                            <span
                              className={
                                gain >= 0
                                  ? "font-medium text-emerald-300"
                                  : "font-medium text-rose-300"
                              }
                            >
                              {gain >= 0 ? "+" : ""}
                              {fmt(gain, 4)} FAIX
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.12em] text-slate-500">
                            Minimum investment
                          </p>

                          <p className="mt-1 text-xs font-semibold tabular-nums text-slate-200">
                            {fmt(f.min, 4)} FAIX
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setModalId(f.id)
                          }
                          className="
                            inline-flex min-h-10 shrink-0
                            items-center justify-center gap-2
                            rounded-xl
                            border border-[#d4af6a]/40
                            bg-[#d4af6a]
                            px-4 py-2
                            text-xs font-semibold
                            text-[#1a1305]
                            shadow-[0_8px_24px_rgba(212,175,106,.12)]
                            transition-all duration-200
                            hover:bg-[#e2c17f]
                            hover:shadow-[0_10px_30px_rgba(212,175,106,.20)]
                            active:scale-[0.98]
                          "
                        >
                          <TrendingUp className="h-4 w-4" />
                          Invest
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

            {!loading &&
              !loadError &&
              filtered.length === 0 && (
                <div
                  className={`${CARD} col-span-full p-10 text-center text-sm text-slate-500`}
                >
                  No funds match your filters.
                </div>
              )}
          </div>
        </section>

        {modalFund && (
          <Modal
            title="Invest in a fund"
            subtitle="Confirm your investment amount"
            icon={TrendingUp}
            tone="gold"
            onClose={() => setModalId(null)}
          >
            {(close) => (
              <>
                <style>{GOLD_MODAL_THEME_CSS}</style>

                <div className="mt-gold-modal">
                  <div className="mb-4 rounded-xl border border-[#d4af6a]/15 bg-[#d4af6a]/[0.035] px-3.5 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                      Selected fund
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-semibold text-slate-900">
                        {modalFund.name}
                      </p>

                      <span className="shrink-0 rounded-full bg-[#d4af6a]/10 px-2.5 py-1 text-[10px] font-medium text-[#a37b37] ring-1 ring-[#d4af6a]/20">
                        {modalFund.category}
                      </span>
                    </div>
                  </div>

                  <InvestForm
                    faix={faix}
                    funds={funds}
                    navs={navs}
                    initialId={modalFund.id}
                    onSubmit={(payload) => {
                      investInFund(payload);
                      close();
                    }}
                  />
                </div>
              </>
            )}
          </Modal>
        )}

        {toast && <Toast message={toast} />}
      </div>
    </PageShell>
  );
}

function InvestForm({
  faix,
  funds,
  navs,
  initialId,
  onSubmit,
}) {
  const [id, setId] = useState(
    initialId || funds[0]?.id
  );

  const [amount, setAmount] = useState("");

  const fund = funds.find(
    (f) => f.id === id
  );

  const nav = navs[id];

  const amt = Math.max(
    0,
    parseFloat(amount) || 0
  );

  const units =
    nav > 0 ? amt / nav : 0;

  const error = !amt
    ? ""
    : amt > faix
      ? "Amount is higher than your available FAIX."
      : amt < fund.min
        ? `Minimum for this fund is ${fmt0(fund.min)} FAIX.`
        : "";

  const valid = amt > 0 && !error;

  return (
    <div className="space-y-4 sm:space-y-5">
      <OptionList
        value={id}
        onChange={setId}
        options={funds.map((f) => ({
          id: f.id,
          title: f.name,
          sub: f.category,
          meta: `NAV ${fmt(navs[f.id], 4)}`,
        }))}
      />

      <AmountField
        label="Investment amount"
        unit="FAIX"
        value={amount}
        onChange={setAmount}
        hint={`Min ${fmt(fund.min, 4)}`}
        chips={[1000, 5000, 10000]
          .filter((v) => v <= faix)
          .map((v) => ({
            label: fmt0(v),
            value: v,
          }))
          .concat({
            label: "Max",
            value: Math.floor(faix),
          })}
      />

      <InfoList>
        <InfoRow
          label="Current NAV"
          value={`${fmt(nav, 4)} FAIX`}
          accent="text-[#a37b37]"
        />

        <InfoRow
          label="Units you receive"
          value={fmt(units, 4)}
          accent="text-[#b18b45]"
        />

        <InfoRow
          label="Available FAIX"
          value={fmt(faix, 4)}
        />

        <InfoRow
          label="Balance after"
          value={
            amt > 0 && amt <= faix
              ? fmt(faix - amt, 4)
              : "-"
          }
        />
      </InfoList>

      <FormError>{error}</FormError>

      <button
        type="button"
        disabled={!valid}
        onClick={() =>
          onSubmit({
            fund,
            amount: amt,
            units,
          })
        }
        className={`${BTN.gold} w-full shadow-[0_10px_28px_rgba(212,175,106,.16)]`}
      >
        <Check className="h-4 w-4" />
        Confirm investment
      </button>
    </div>
  );
}