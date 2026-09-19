import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* =========================
   DUMMY DATA
========================= */

const fundData = [
  {
    id: 1,
    name: "Oil Grow Fund",
    category: "Growth",
    nav: 10,
    growth: 15.3,
  },
  {
    id: 2,
    name: "Metals Strength Fund",
    category: "Commodity",
    nav: 20,
    growth: 12.5,
  },
  {
    id: 3,
    name: "Classic Opportunity Fund",
    category: "Balanced",
    nav: 14,
    growth: 9.8,
  },
];

const propertyData = [
  {
    id: 1,
    name: "Green Valley Apartments",
    location: "Toronto, ON",
    price: 500000,
    tokenValue: 11,
  },
  {
    id: 2,
    name: "Lakeview Residences",
    location: "Mississauga, ON",
    price: 750000,
    tokenValue: 11,
  },
];

const chartData = {
  Daily: [
    { name: "09:00", value: 185000, baseline: 180000 },
    { name: "10:00", value: 191000, baseline: 184000 },
    { name: "11:00", value: 188000, baseline: 187000 },
    { name: "12:00", value: 198000, baseline: 190000 },
    { name: "13:00", value: 205000, baseline: 194000 },
    { name: "14:00", value: 218000, baseline: 199000 },
    { name: "15:00", value: 225000, baseline: 203000 },
  ],

  Weekly: [
    { name: "Mon", value: 158000, baseline: 145000 },
    { name: "Tue", value: 174000, baseline: 153000 },
    { name: "Wed", value: 166000, baseline: 160000 },
    { name: "Thu", value: 192000, baseline: 168000 },
    { name: "Fri", value: 208000, baseline: 177000 },
    { name: "Sat", value: 216000, baseline: 184000 },
    { name: "Sun", value: 225000, baseline: 190000 },
  ],

  Monthly: [
    { name: "Jan", value: 18000, baseline: 20000 },
    { name: "Feb", value: 34000, baseline: 25000 },
    { name: "Mar", value: 29000, baseline: 32000 },
    { name: "Apr", value: 82000, baseline: 45000 },
    { name: "May", value: 68000, baseline: 60000 },
    { name: "Jun", value: 118000, baseline: 72000 },
    { name: "Jul", value: 92000, baseline: 85000 },
    { name: "Aug", value: 241789, baseline: 98000 },
    { name: "Sep", value: 204000, baseline: 125000 },
    { name: "Oct", value: 216000, baseline: 153000 },
    { name: "Nov", value: 202000, baseline: 170000 },
    { name: "Dec", value: 215000, baseline: 185000 },
  ],

  Yearly: [
    { name: "2022", value: 72000, baseline: 65000 },
    { name: "2023", value: 108000, baseline: 85000 },
    { name: "2024", value: 156000, baseline: 110000 },
    { name: "2025", value: 241789, baseline: 180000 },
    { name: "2026", value: 268000, baseline: 210000 },
  ],
};

/* =========================
   MAIN COMPONENT
========================= */

export default function UserAdmin() {
  const pageRef = useRef(null);

  const [period, setPeriod] = useState("Monthly");

  const [balance, setBalance] = useState(18181);
  const [invested, setInvested] = useState(6240);

  const [propertiesOwned, setPropertiesOwned] = useState(2);
  const [fundsOwned, setFundsOwned] = useState(3);

  const [fundModal, setFundModal] = useState(false);
  const [propertyModal, setPropertyModal] = useState(false);

  const [selectedFund, setSelectedFund] = useState(fundData[0]);
  const [selectedProperty, setSelectedProperty] = useState(
    propertyData[0]
  );

  const [fundAmount, setFundAmount] = useState(500);
  const [propertyTokens, setPropertyTokens] = useState(10);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Metals Strength Fund",
      type: "Fund Investment",
      amount: "400 FAIX",
      status: "Completed",
    },
    {
      id: 2,
      name: "Green Valley Apartments",
      type: "Property Purchase",
      amount: "110 FAIX",
      status: "Completed",
    },
    {
      id: 3,
      name: "Oil Grow Fund",
      type: "Fund Investment",
      amount: "500 FAIX",
      status: "Completed",
    },
  ]);

  /* =========================
     GSAP PAGE ANIMATION
  ========================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".admin-header", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".stat-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".dashboard-card", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.35,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* =========================
     CALCULATIONS
  ========================= */

  const units = useMemo(() => {
    return Number(fundAmount || 0) / selectedFund.nav;
  }, [fundAmount, selectedFund]);

  const propertyCost = useMemo(() => {
    return Number(propertyTokens || 0) * selectedProperty.tokenValue;
  }, [propertyTokens, selectedProperty]);

  const portfolioValue = invested + 8200;

  /* =========================
     FUND PURCHASE
  ========================= */

  const buyFund = () => {
    const amount = Number(fundAmount);

    if (!amount || amount <= 0) {
      alert("Enter a valid investment amount.");
      return;
    }

    if (amount > balance) {
      alert("Insufficient FAIX balance.");
      return;
    }

    setBalance((prev) => prev - amount);
    setInvested((prev) => prev + amount);
    setFundsOwned((prev) => prev + 1);

    setTransactions((prev) => [
      {
        id: Date.now(),
        name: selectedFund.name,
        type: "Fund Investment",
        amount: `${amount} FAIX`,
        status: "Completed",
      },
      ...prev,
    ]);

    setFundModal(false);
  };

  /* =========================
     PROPERTY PURCHASE
  ========================= */

  const buyProperty = () => {
    const tokens = Number(propertyTokens);

    if (!tokens || tokens <= 0) {
      alert("Enter valid FAIX tokens.");
      return;
    }

    if (tokens > balance) {
      alert("Insufficient FAIX balance.");
      return;
    }

    setBalance((prev) => prev - tokens);
    setInvested((prev) => prev + propertyCost);
    setPropertiesOwned((prev) => prev + 1);

    setTransactions((prev) => [
      {
        id: Date.now(),
        name: selectedProperty.name,
        type: "Property Purchase",
        amount: `${tokens} FAIX`,
        status: "Completed",
      },
      ...prev,
    ]);

    setPropertyModal(false);
  };

  /* =========================
     ADD FUNDS
  ========================= */

  const addFunds = () => {
    setBalance((prev) => prev + 1000);

    setTransactions((prev) => [
      {
        id: Date.now(),
        name: "Wallet Deposit",
        type: "Deposit",
        amount: "+1000 FAIX",
        status: "Completed",
      },
      ...prev,
    ]);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#08110f] px-4 py-6 text-white md:px-8"
    >
      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-header mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Portfolio
            </h1>

            <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Welcome back, Test User. Manage your assets and investments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-700/70 bg-[#111b18] px-4 py-3 text-slate-400 transition hover:border-cyan-500/50 hover:text-white">
            🔔
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700/70 bg-[#111b18] px-4 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-400">
              TU
            </div>

            <div>
              <p className="text-sm font-medium">Test User</p>
              <p className="text-xs text-slate-500">Investor</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="AVAILABLE FAIX"
          value={balance.toLocaleString()}
          sub="Available balance"
          icon="₣"
        />

        <StatCard
          title="PORTFOLIO VALUE"
          value={`₣ ${portfolioValue.toLocaleString()}`}
          sub="+18.5% this year"
          positive
          icon="↗"
        />

        <StatCard
          title="INVESTED AMOUNT"
          value={`₣ ${invested.toLocaleString()}`}
          sub="Across all assets"
          icon="◈"
        />

        <StatCard
          title="TOTAL HOLDINGS"
          value={propertiesOwned + fundsOwned}
          sub={`${propertiesOwned} properties • ${fundsOwned} funds`}
          icon="◆"
        />
      </div>

      {/* =========================
          PORTFOLIO GRAPH
      ========================= */}

      <div className="dashboard-card mt-5">
        <PortfolioGrowthChart
          period={period}
          setPeriod={setPeriod}
        />
      </div>

      {/* =========================
          QUICK ACTIONS + FUNDS
      ========================= */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* QUICK ACTIONS */}

        <div className="dashboard-card rounded-[24px] border border-slate-700/50 bg-[#111b18] p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Quick actions
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Grow your portfolio
          </h2>

          <div className="mt-6 space-y-3">
            <ActionButton
              title="Invest in Fund"
              subtitle="Explore managed funds"
              icon="↗"
              onClick={() => setFundModal(true)}
            />

            <ActionButton
              title="Buy Property"
              subtitle="Invest using FAIX"
              icon="⌂"
              onClick={() => setPropertyModal(true)}
            />

            <ActionButton
              title="Add Funds"
              subtitle="Add 1,000 FAIX"
              icon="+"
              onClick={addFunds}
            />
          </div>
        </div>

        {/* FUNDS */}

        <div className="dashboard-card rounded-[24px] border border-slate-700/50 bg-[#111b18] p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Investment funds
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Popular Funds
              </h2>
            </div>

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              LIVE NAV
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {fundData.map((fund) => (
              <div
                key={fund.id}
                className="rounded-2xl border border-slate-700/50 bg-[#0c1512] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    ◈
                  </div>

                  <span className="text-xs text-emerald-400">
                    +{fund.growth}%
                  </span>
                </div>

                <h3 className="mt-5 text-sm font-medium">
                  {fund.name}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {fund.category}
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Current NAV
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      ₣ {fund.nav}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedFund(fund);
                      setFundModal(true);
                    }}
                    className="rounded-lg bg-[#efb866] px-3 py-2 text-xs font-medium text-[#151a17] transition hover:bg-[#f3c77d]"
                  >
                    Invest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================
          ALLOCATION + TRANSACTIONS
      ========================= */}

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ALLOCATION */}

        <div className="dashboard-card rounded-[24px] border border-slate-700/50 bg-[#111b18] p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Portfolio
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Asset Allocation
          </h2>

          <div className="mt-7 flex items-center justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#efb866 0 45%, #22d3ee 45% 75%, #34d399 75% 100%)",
              }}
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#111b18]">
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Portfolio
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    100%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <AllocationItem
              label="Funds"
              value="45%"
              dot="bg-[#efb866]"
            />

            <AllocationItem
              label="Property"
              value="30%"
              dot="bg-cyan-400"
            />

            <AllocationItem
              label="Exchange"
              value="25%"
              dot="bg-emerald-400"
            />
          </div>
        </div>

        {/* TRANSACTIONS */}

        <div className="dashboard-card rounded-[24px] border border-slate-700/50 bg-[#111b18] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Activity
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Recent Transactions
              </h2>
            </div>

            <span className="text-xs text-cyan-400">
              {transactions.length} transactions
            </span>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-600">
                  <th className="pb-3">Asset</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.slice(0, 6).map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-800/70 transition hover:bg-white/[0.02]"
                  >
                    <td className="py-4 text-sm font-medium">
                      {transaction.name}
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      {transaction.type}
                    </td>

                    <td className="py-4 text-sm">
                      {transaction.amount}
                    </td>

                    <td className="py-4">
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================
          FUND MODAL
      ========================= */}

      {fundModal && (
        <Modal onClose={() => setFundModal(false)}>
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Fund Investment
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {selectedFund.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedFund.category}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-[#0b1411] p-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Current NAV
              </span>

              <span className="font-semibold">
                ₣ {selectedFund.nav}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-sm text-slate-500">
                Growth
              </span>

              <span className="text-emerald-400">
                +{selectedFund.growth}%
              </span>
            </div>
          </div>

          <label className="mt-6 block text-sm text-slate-400">
            Investment Amount
          </label>

          <input
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-[#0b1411] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />

          <div className="mt-4 flex justify-between rounded-xl border border-slate-800 p-4">
            <span className="text-sm text-slate-500">
              Estimated Units
            </span>

            <span className="font-semibold text-cyan-400">
              {units.toFixed(2)}
            </span>
          </div>

          <button
            onClick={buyFund}
            className="mt-5 w-full rounded-xl bg-[#efb866] py-3 font-semibold text-[#151a17] transition hover:bg-[#f3c77d]"
          >
            Confirm Investment
          </button>
        </Modal>
      )}

      {/* =========================
          PROPERTY MODAL
      ========================= */}

      {propertyModal && (
        <Modal onClose={() => setPropertyModal(false)}>
          <div>
            <p className="text-xs uppercase tracking-wider text-cyan-400">
              Property Purchase
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {selectedProperty.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {selectedProperty.location}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-[#0b1411] p-4">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Property Value
              </span>

              <span>
                ₣ {selectedProperty.price.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-sm text-slate-500">
                Token Value
              </span>

              <span>
                {selectedProperty.tokenValue} FAIX
              </span>
            </div>
          </div>

          <label className="mt-6 block text-sm text-slate-400">
            FAIX Tokens
          </label>

          <input
            type="number"
            min="1"
            value={propertyTokens}
            onChange={(e) => setPropertyTokens(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-[#0b1411] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />

          <div className="mt-4 flex justify-between rounded-xl border border-slate-800 p-4">
            <span className="text-sm text-slate-500">
              Purchase Amount
            </span>

            <span className="font-semibold text-cyan-400">
              {propertyCost} FAIX
            </span>
          </div>

          <button
            onClick={buyProperty}
            className="mt-5 w-full rounded-xl bg-[#efb866] py-3 font-semibold text-[#151a17] transition hover:bg-[#f3c77d]"
          >
            Confirm Purchase
          </button>
        </Modal>
      )}
    </div>
  );
}

/* =========================
   PORTFOLIO GRAPH
========================= */

function PortfolioGrowthChart({
  period,
  setPeriod,
}) {
  const data = chartData[period];

  return (
    <div className="rounded-[24px] border border-slate-700/50 bg-[#111b18] p-6 md:p-8">
      {/* GRAPH HEADER */}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold">
              Portfolio Growth
            </h2>

            <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Showing assets development comparing to baseline
          </p>
        </div>

        {/* CONTROLS */}

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full border border-slate-700 bg-[#17211d] px-5 py-2.5 text-sm text-slate-300">
            Last 12 Months
            <span className="ml-3">⌄</span>
          </button>

          <div className="flex rounded-full bg-[#1a2420] p-1">
            {["Daily", "Weekly", "Monthly", "Yearly"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                    period === item
                      ? "bg-[#efb866] text-[#151a17] shadow-lg"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* GRAPH */}

      <div className="mt-8 h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 15,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="portfolioArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#efb866"
                  stopOpacity={0.32}
                />

                <stop
                  offset="100%"
                  stopColor="#efb866"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#26312d"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#66716c",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#66716c",
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                `₣${value >= 1000 ? `${Math.round(value / 1000)}K` : value}`
              }
            />

            <Tooltip
              cursor={{
                stroke: "#efb866",
                strokeDasharray: "4 5",
              }}
              content={<PortfolioTooltip />}
            />

            {/* BASELINE */}

            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#6f7873"
              strokeWidth={2}
              strokeDasharray="4 6"
              fill="none"
              dot={false}
              activeDot={false}
            />

            {/* MAIN AREA */}

            <Area
              type="monotone"
              dataKey="value"
              stroke="#efb866"
              strokeWidth={3}
              fill="url(#portfolioArea)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#efb866",
                stroke: "#111b18",
                strokeWidth: 3,
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* GRAPH STATS */}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <ChartStat
          title="TOTAL REVENUE"
          value="₣ 245,800"
          sub="▲ +18.5% vs last year"
          positive
        />

        <ChartStat
          title="OVERALL GROWTH"
          value="+18.5%"
          sub="▲ Annualized return rate"
          positive
        />

        <ChartStat
          title="AVG INVESTMENT"
          value="₣ 12,500"
          sub="Per asset position"
        />

        <ChartStat
          title="PEAK VALUE"
          value="₣ 241,789"
          sub="Aug 2025 record high"
        />
      </div>
    </div>
  );
}

/* =========================
   TOOLTIP
========================= */

function PortfolioTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const mainValue = payload.find(
    (item) => item.dataKey === "value"
  )?.value;

  return (
    <div className="rounded-2xl border border-[#765b38] bg-[#15131a] px-5 py-4 shadow-2xl">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        ₣ {Number(mainValue).toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-emerald-400">
        ▲ +18.5%
      </p>
    </div>
  );
}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  sub,
  icon,
  positive,
}) {
  return (
    <div className="stat-card rounded-2xl border border-slate-700/50 bg-[#111b18] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-wider text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            {value}
          </h2>

          <p
            className={`mt-2 text-xs ${
              positive
                ? "text-emerald-400"
                : "text-slate-500"
            }`}
          >
            {sub}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================
   ACTION BUTTON
========================= */

function ActionButton({
  title,
  subtitle,
  icon,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-2xl border border-slate-700/60 bg-[#0c1512] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/40"
    >
      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400 transition group-hover:translate-x-1">
        {icon}
      </span>
    </button>
  );
}

/* =========================
   ALLOCATION
========================= */

function AllocationItem({
  label,
  value,
  dot,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dot}`}
        />

        <span className="text-sm text-slate-400">
          {label}
        </span>
      </div>

      <span className="text-sm font-medium">
        {value}
      </span>
    </div>
  );
}

/* =========================
   MODAL
========================= */

function Modal({
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/70 bg-[#111b18] p-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-slate-500 transition hover:text-white"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* =========================
   CHART STAT
========================= */

function ChartStat({
  title,
  value,
  sub,
  positive,
}) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-[#0d1512] p-5 transition duration-300 hover:border-slate-600">
      <p className="text-xs tracking-wider text-slate-500">
        {title}
      </p>

      <h3 className="mt-4 text-xl font-semibold">
        {value}
      </h3>

      <p
        className={`mt-2 text-sm ${
          positive
            ? "text-emerald-400"
            : "text-slate-500"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}