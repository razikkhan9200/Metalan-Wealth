import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Bell,
  Search,
  Wallet,
  TrendingUp,
  Building2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Landmark,
  Plus,
  X,
  CheckCircle2,
  ShoppingBag,
  CircleDollarSign,
  Activity,
} from "lucide-react";

/* =========================
   DUMMY DATA
========================= */

const funds = [
  {
    id: 1,
    name: "Oil Grow Fund",
    category: "Growth",
    nav: 10,
    growth: 15.3,
    risk: "Moderate",
  },
  {
    id: 2,
    name: "Metals Strength Fund",
    category: "Commodity",
    nav: 20,
    growth: 12.5,
    risk: "Medium",
  },
  {
    id: 3,
    name: "Classic Opportunity",
    category: "Balanced",
    nav: 14,
    growth: 9.8,
    risk: "Low",
  },
];

const properties = [
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

const graphData = {
  Daily: [
    { label: "9 AM", value: 180000, baseline: 175000 },
    { label: "10 AM", value: 187000, baseline: 178000 },
    { label: "11 AM", value: 184000, baseline: 181000 },
    { label: "12 PM", value: 198000, baseline: 185000 },
    { label: "1 PM", value: 205000, baseline: 189000 },
    { label: "2 PM", value: 218000, baseline: 194000 },
    { label: "3 PM", value: 225000, baseline: 200000 },
  ],

  Weekly: [
    { label: "Mon", value: 158000, baseline: 145000 },
    { label: "Tue", value: 174000, baseline: 152000 },
    { label: "Wed", value: 166000, baseline: 158000 },
    { label: "Thu", value: 192000, baseline: 168000 },
    { label: "Fri", value: 208000, baseline: 176000 },
    { label: "Sat", value: 216000, baseline: 184000 },
    { label: "Sun", value: 225000, baseline: 192000 },
  ],

  Monthly: [
    { label: "Jan", value: 18000, baseline: 20000 },
    { label: "Feb", value: 34000, baseline: 25000 },
    { label: "Mar", value: 29000, baseline: 32000 },
    { label: "Apr", value: 82000, baseline: 45000 },
    { label: "May", value: 68000, baseline: 60000 },
    { label: "Jun", value: 118000, baseline: 72000 },
    { label: "Jul", value: 92000, baseline: 85000 },
    { label: "Aug", value: 241789, baseline: 98000 },
    { label: "Sep", value: 204000, baseline: 125000 },
    { label: "Oct", value: 216000, baseline: 153000 },
    { label: "Nov", value: 202000, baseline: 170000 },
    { label: "Dec", value: 215000, baseline: 185000 },
  ],

  Yearly: [
    { label: "2022", value: 72000, baseline: 65000 },
    { label: "2023", value: 108000, baseline: 85000 },
    { label: "2024", value: 156000, baseline: 110000 },
    { label: "2025", value: 241789, baseline: 180000 },
    { label: "2026", value: 268000, baseline: 210000 },
  ],
};

/* =========================
   MAIN
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

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [selectedProperty, setSelectedProperty] = useState(
    properties[0]
  );

  const [fundAmount, setFundAmount] = useState(500);
  const [propertyTokens, setPropertyTokens] = useState(10);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Metals Strength Fund",
      type: "Fund Investment",
      amount: 400,
    },
    {
      id: 2,
      name: "Green Valley Apartments",
      type: "Property Purchase",
      amount: 110,
    },
    {
      id: 3,
      name: "Oil Grow Fund",
      type: "Fund Investment",
      amount: 500,
    },
  ]);

  /* =========================
     GSAP
  ========================= */

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-item", {
        y: -25,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".stat-item", {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".panel-item", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.3,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* =========================
     CALCULATIONS
  ========================= */

  const units = Number(fundAmount || 0) / selectedFund.nav;

  const propertyCost =
    Number(propertyTokens || 0) *
    selectedProperty.tokenValue;

  const portfolioValue = invested + 8200;

  /* =========================
     FUND PURCHASE
  ========================= */

  const buyFund = () => {
    const amount = Number(fundAmount);

    if (!amount || amount <= 0) {
      alert("Enter a valid amount.");
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
        amount,
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
        amount: tokens,
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
        amount: 1000,
      },
      ...prev,
    ]);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#07100e] px-4 py-6 text-white md:px-8 lg:px-10"
    >
      {/* =========================
          HEADER
      ========================= */}

      <div className="hero-item mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              Portfolio Growth
            </h1>

            <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Welcome back, Test User. Track and manage your investments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-800 bg-[#101a17] p-3 text-slate-400 transition hover:border-cyan-400/40 hover:text-white">
            <Search size={18} />
          </button>

          <button className="rounded-xl border border-slate-800 bg-[#101a17] p-3 text-slate-400 transition hover:border-cyan-400/40 hover:text-white">
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#101a17] px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-400">
              TU
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium">
                Test User
              </p>

              <p className="text-xs text-slate-600">
                Investor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<Coins size={19} />}
          title="AVAILABLE FAIX"
          value={balance.toLocaleString()}
          sub="Available balance"
        />

        <Stat
          icon={<TrendingUp size={19} />}
          title="PORTFOLIO VALUE"
          value={`₣ ${portfolioValue.toLocaleString()}`}
          sub="+18.5% vs last year"
          positive
        />

        <Stat
          icon={<Wallet size={19} />}
          title="INVESTED AMOUNT"
          value={`₣ ${invested.toLocaleString()}`}
          sub="Across all assets"
        />

        <Stat
          icon={<Building2 size={19} />}
          title="TOTAL HOLDINGS"
          value={propertiesOwned + fundsOwned}
          sub={`${propertiesOwned} properties • ${fundsOwned} funds`}
        />
      </div>

      {/* =========================
          CHART
      ========================= */}

      <div className="panel-item mt-5">
        <PortfolioChart
          period={period}
          setPeriod={setPeriod}
        />
      </div>

      {/* =========================
          ACTIONS + FUNDS
      ========================= */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="panel-item rounded-[24px] border border-slate-800 bg-[#101a17] p-6">
          <p className="text-xs uppercase tracking-widest text-slate-600">
            Quick Actions
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Manage Portfolio
          </h2>

          <div className="mt-6 space-y-3">
            <Action
              icon={<TrendingUp size={18} />}
              title="Invest in Fund"
              sub="Explore managed funds"
              onClick={() => setFundModal(true)}
            />

            <Action
              icon={<Building2 size={18} />}
              title="Buy Property"
              sub="Invest using FAIX"
              onClick={() => setPropertyModal(true)}
            />

            <Action
              icon={<Plus size={18} />}
              title="Add Funds"
              sub="Add 1,000 FAIX"
              onClick={addFunds}
            />
          </div>
        </div>

        <div className="panel-item rounded-[24px] border border-slate-800 bg-[#101a17] p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-600">
                Investments
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
            {funds.map((fund) => (
              <div
                key={fund.id}
                className="rounded-2xl border border-slate-800 bg-[#0b1412] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Landmark size={18} />
                  </div>

                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <ArrowUpRight size={13} />
                    {fund.growth}%
                  </span>
                </div>

                <h3 className="mt-5 text-sm font-medium">
                  {fund.name}
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  {fund.category} • {fund.risk} Risk
                </p>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-600">
                      NAV
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
                    className="rounded-lg bg-[#eab35f] px-3 py-2 text-xs font-semibold text-[#141914] transition hover:bg-[#f2c574]"
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
        <div className="panel-item rounded-[24px] border border-slate-800 bg-[#101a17] p-6">
          <p className="text-xs uppercase tracking-widest text-slate-600">
            Portfolio
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Asset Allocation
          </h2>

          <div className="mt-7 flex justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#eab35f 0 45%, #22d3ee 45% 75%, #34d399 75% 100%)",
              }}
            >
              <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-[#101a17]">
                <PieChart
                  size={20}
                  className="text-slate-500"
                />

                <span className="mt-1 text-sm font-semibold">
                  100%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <Allocation
              color="bg-[#eab35f]"
              name="Funds"
              value="45%"
            />

            <Allocation
              color="bg-cyan-400"
              name="Property"
              value="30%"
            />

            <Allocation
              color="bg-emerald-400"
              name="Exchange"
              value="25%"
            />
          </div>
        </div>

        <div className="panel-item rounded-[24px] border border-slate-800 bg-[#101a17] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-600">
                Activity
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Recent Transactions
              </h2>
            </div>

            <Activity
              size={19}
              className="text-cyan-400"
            />
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-600">
                  <th className="pb-3">Asset</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {transactions.slice(0, 6).map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800/70"
                  >
                    <td className="py-4 text-sm font-medium">
                      {item.name}
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      {item.type}
                    </td>

                    <td className="py-4 text-sm">
                      {item.amount} FAIX
                    </td>

                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                        <CheckCircle2 size={12} />
                        Completed
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
        <Modal close={() => setFundModal(false)}>
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">
              Fund Investment
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {selectedFund.name}
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              {selectedFund.category}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-[#0a1210] p-4">
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
            onChange={(e) =>
              setFundAmount(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0a1210] px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 p-4">
            <span className="text-sm text-slate-500">
              Estimated Units
            </span>

            <span className="font-semibold text-cyan-400">
              {units.toFixed(2)}
            </span>
          </div>

          <button
            onClick={buyFund}
            className="mt-5 w-full rounded-xl bg-[#eab35f] py-3 font-semibold text-[#151914] transition hover:bg-[#f2c574]"
          >
            Confirm Investment
          </button>
        </Modal>
      )}

      {/* =========================
          PROPERTY MODAL
      ========================= */}

      {propertyModal && (
        <Modal close={() => setPropertyModal(false)}>
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Property Purchase
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {selectedProperty.name}
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            {selectedProperty.location}
          </p>

          <div className="mt-6 rounded-2xl bg-[#0a1210] p-4">
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
            onChange={(e) =>
              setPropertyTokens(e.target.value)
            }
            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0a1210] px-4 py-3 text-white outline-none focus:border-cyan-400"
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
            className="mt-5 w-full rounded-xl bg-[#eab35f] py-3 font-semibold text-[#151914] transition hover:bg-[#f2c574]"
          >
            Confirm Purchase
          </button>
        </Modal>
      )}
    </div>
  );
}

/* =========================
   PORTFOLIO CHART
========================= */

function PortfolioChart({
  period,
  setPeriod,
}) {
  const data = graphData[period];

  return (
    <div className="rounded-[24px] border border-slate-800 bg-[#101a17] p-6 md:p-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-3">
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

        <div className="flex flex-wrap gap-2 rounded-full bg-[#19221f] p-1">
          {["Daily", "Weekly", "Monthly", "Yearly"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`rounded-full px-4 py-2 text-sm transition-all ${
                  period === item
                    ? "bg-[#eab35f] text-[#151914]"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-8 h-[330px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="portfolioFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#eab35f"
                  stopOpacity={0.3}
                />

                <stop
                  offset="100%"
                  stopColor="#eab35f"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#26312e"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#65706b",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#65706b",
                fontSize: 11,
              }}
              tickFormatter={(value) =>
                `₣${Math.round(value / 1000)}K`
              }
            />

            <Tooltip
              cursor={{
                stroke: "#eab35f",
                strokeDasharray: "4 5",
              }}
              content={<CustomTooltip />}
            />

            {/* BASELINE */}

            <Area
              type="monotone"
              dataKey="baseline"
              stroke="#707974"
              strokeWidth={2}
              strokeDasharray="4 6"
              fill="none"
              dot={false}
              activeDot={false}
            />

            {/* MAIN LINE */}

            <Area
              type="monotone"
              dataKey="value"
              stroke="#eab35f"
              strokeWidth={3}
              fill="url(#portfolioFill)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#eab35f",
                stroke: "#101a17",
                strokeWidth: 3,
              }}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

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

function CustomTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload.find(
    (item) => item.dataKey === "value"
  )?.value;

  return (
    <div className="rounded-2xl border border-[#735b39] bg-[#15131a] px-5 py-4 shadow-2xl">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        ₣ {Number(value).toLocaleString()}
      </p>

      <p className="mt-1 flex items-center gap-1 text-sm text-emerald-400">
        <ArrowUpRight size={14} />
        +18.5%
      </p>
    </div>
  );
}

/* =========================
   STAT
========================= */

function Stat({
  icon,
  title,
  value,
  sub,
  positive,
}) {
  return (
    <div className="stat-item rounded-2xl border border-slate-800 bg-[#101a17] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest text-slate-600">
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
            {positive && "▲ "}
            {sub}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================
   ACTION
========================= */

function Action({
  icon,
  title,
  sub,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-[#0b1412] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {sub}
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={17}
        className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
      />
    </button>
  );
}

/* =========================
   ALLOCATION
========================= */

function Allocation({
  color,
  name,
  value,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className={`h-2.5 w-2.5 rounded-full ${color}`}
        />

        <span className="text-sm text-slate-400">
          {name}
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
  close,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#101a17] p-6 shadow-2xl">
        <div className="flex justify-end">
          <button
            onClick={close}
            className="text-slate-600 transition hover:text-white"
          >
            <X size={20} />
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
    <div className="rounded-2xl border border-slate-800 bg-[#0c1512] p-5">
      <p className="text-xs tracking-widest text-slate-600">
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