/* FundInvestments.jsx — dedicated "Fund Investments" page for the Metalan platform.
 * Dummy data only, same visual language as UserAdmin.jsx (dark navy / gold / cyan).
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase, Search, SlidersHorizontal, TrendingUp, Layers, Wallet, Check, Sparkles,
  ChevronDown,
} from "lucide-react";
import {
  ACCENT, BTN, CARD, RISK, fmt, fmt0,
} from "./shared/theme";
import {
  AmountField, FormError, InfoList, InfoRow, Modal, OptionList, PageHeader, PageShell,
  SectionTitle, StatCard, Toast,
} from "./shared/ui";
import { get, post } from "../../services/Api";
import { mapFund, TOKEN_VALUE } from "../../utils/apiMappers";

const RISK_LEVELS = ["All", "Low", "Moderate", "High"];


function FilterSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!event.target.closest?.("[data-filter-select]")) setOpen(false);
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
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-sm font-medium outline-none transition-all duration-200 ${
          open
            ? "border-cyan-400/50 bg-[#0b111a] text-white ring-1 ring-cyan-400/15"
            : "border-white/10 bg-[#080d14] text-slate-200 hover:border-white/15"
        }`}
      >
        <span className="min-w-0 truncate">
          {value === "All"
            ? label
            : value}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180 text-cyan-300" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[110] overflow-hidden rounded-xl border border-white/10 bg-[#0a1019] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.45)] ring-1 ring-black/30"
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
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selected
                    ? "bg-cyan-400/10 text-cyan-200"
                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="truncate">
                  {option === "All" ? label : option}
                </span>

                {selected && (
                  <Check className="h-4 w-4 shrink-0 text-cyan-300" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
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
        setFunds(fundsRes.data.funds.map(mapFund));

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
      if (query && !f.name.toLowerCase().includes(query.toLowerCase())) {
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

    return { fundsValue: fv, fundsCost: fc };
  }, [funds, fundPos, navs]);

  const returns = fundsValue - fundsCost;
  const returnsPct = fundsCost > 0 ? (returns / fundsCost) * 100 : 0;
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
        res.message || `Invested ${fmt0(amount)} FAIX in ${fund.name}`
      );
    } catch (error) {
      setToast(error.message || "Couldn't complete the investment.");
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
          tone="cyan"
          eyebrow="Fund Investments"
          title="Grow your wealth across curated funds"
          subtitle="Invest FAIX into professionally managed equity, income, real estate, digital asset and thematic funds at today's NAV."
          right={
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-left backdrop-blur-md sm:text-right">
                <p className="text-[11px] text-slate-400">
                  Available FAIX
                </p>

                <p className="text-lg font-semibold tabular-nums text-white">
                  {fmt(faix, 4)}
                </p>
              </div>

              <button
                type="button"
                disabled={funds.length === 0}
                onClick={() => setModalId(funds[0].id)}
                className={BTN.gold}
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
            tone="cyan"
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
          <section className={`${CARD} min-w-0 overflow-hidden p-4 sm:p-5`}>
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
                    <th className="px-3 py-2 font-medium">Fund</th>
                    <th className="px-3 py-2 font-medium">Units</th>
                    <th className="px-3 py-2 font-medium">Cost</th>
                    <th className="px-3 py-2 font-medium">Value</th>
                    <th className="px-3 py-2 font-medium">
                      Gain / loss
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(fundPos).map(([id, pos]) => {
                    const fund = funds.find((f) => f.id === id);
                    const value = pos.units * navs[id];
                    const gain = value - pos.cost;

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
          className={`${CARD} relative z-[90] overflow-visible flex flex-col gap-3 p-3.5 sm:flex-row sm:flex-wrap sm:items-center sm:p-4`}
        >
          <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 transition-colors focus-within:border-cyan-400/50">
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
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-500" />

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
            tone="cyan"
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

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {!loading &&
              !loadError &&
              filtered.map((f) => {
                const held = fundPos[f.id];

                return (
                  <div
                    key={f.id}
                    className={`${CARD} min-w-0 flex flex-col p-4 transition-colors hover:border-white/15 sm:p-5`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl ring-1 bg-cyan-400/10 text-cyan-300 ring-cyan-400/20">
                        <f.icon className="h-5 w-5" />
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ring-inset ${RISK[f.risk]}`}
                      >
                        {f.risk} risk
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-white">
                      {f.name}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {f.category}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500">NAV</p>
                        <p className="mt-0.5 font-medium tabular-nums text-white">
                          {fmt(f.nav, 3)} FAIX
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">1Y growth</p>
                        <p className="mt-0.5 font-medium tabular-nums text-emerald-300">
                          +{f.growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {held && (
                      <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2 text-[11px] text-cyan-200">
                        You hold {fmt(held.units, 4)} units ·{" "}
                        {fmt(held.units * f.nav, 4)} FAIX
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Min {fmt(f.min, 4)} FAIX</span>

                      <span
                        className={
                          f.status === "Open"
                            ? "text-emerald-300"
                            : "text-amber-300"
                        }
                      >
                        {f.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setModalId(f.id)}
                      className={`${BTN.cyanSoft} mt-4 w-full`}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Invest
                    </button>
                  </div>
                );
              })}

            {!loading &&
              !loadError &&
              filtered.length === 0 && (
                <div
                  className={`${CARD} col-span-full p-8 text-center text-sm text-slate-500`}
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
            tone="cyan"
            onClose={() => setModalId(null)}
          >
            {(close) => (
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
            )}
          </Modal>
        )}

        {toast && <Toast message={toast} />}
      </div>
    </PageShell>
  );
}

function InvestForm({ faix, funds, navs, initialId, onSubmit }) {
  const [id, setId] = useState(initialId || funds[0]?.id);
  const [amount, setAmount] = useState("");

  const fund = funds.find((f) => f.id === id);
  const nav = navs[id];
  const amt = Math.max(0, parseFloat(amount) || 0);
  const units = amt / nav;

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
        />

        <InfoRow
          label="Units you receive"
          value={fmt(units, 4)}
          accent="text-cyan-300"
        />

        <InfoRow
          label="Available FAIX"
          value={fmt(faix)}
        />

        <InfoRow
          label="Balance after"
          value={
            amt > 0 && amt <= faix
              ? fmt(faix - amt)
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
        className={`${BTN.gold} w-full`}
      >
        <Check className="h-4 w-4" />
        Confirm investment
      </button>
    </div>
  );
}