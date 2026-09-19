import React, { useMemo, useState } from "react";

const funds = [
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
  "1D": [68, 72, 70, 76, 74, 82, 86],
  "1W": [58, 62, 60, 67, 64, 73, 79],
  "1M": [48, 55, 52, 61, 58, 70, 78],
  "1Y": [32, 38, 35, 47, 44, 61, 78],
};

export default function UserAdmin() {
  const [balance, setBalance] = useState(18181);
  const [invested, setInvested] = useState(6240);
  const [propertiesOwned, setPropertiesOwned] = useState(2);
  const [fundsOwned, setFundsOwned] = useState(3);

  const [period, setPeriod] = useState("1M");

  const [showFundModal, setShowFundModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const [selectedFund, setSelectedFund] = useState(funds[0]);
  const [selectedProperty, setSelectedProperty] = useState(properties[0]);

  const [fundAmount, setFundAmount] = useState(500);
  const [propertyTokens, setPropertyTokens] = useState(10);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      name: "Metals Strength Fund",
      type: "Fund Investment",
      amount: "$400",
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
      amount: "$500",
      status: "Completed",
    },
  ]);

  const units = useMemo(() => {
    return Number(fundAmount || 0) / selectedFund.nav;
  }, [fundAmount, selectedFund]);

  const propertyCost = useMemo(() => {
    return Number(propertyTokens || 0) * selectedProperty.tokenValue;
  }, [propertyTokens, selectedProperty]);

  const graphPoints = useMemo(() => {
    const data = graphData[period];

    const width = 700;
    const height = 250;
    const padding = 20;

    const min = Math.min(...data);
    const max = Math.max(...data);

    return data
      .map((value, index) => {
        const x =
          padding +
          (index * (width - padding * 2)) / (data.length - 1);

        const y =
          height -
          padding -
          ((value - min) / (max - min || 1)) *
            (height - padding * 2);

        return `${x},${y}`;
      })
      .join(" ");
  }, [period]);

  const buyFund = () => {
    const amount = Number(fundAmount);

    if (!amount || amount <= 0) return;

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

    setShowFundModal(false);
  };

  const buyProperty = () => {
    const tokens = Number(propertyTokens);

    if (!tokens || tokens <= 0) return;

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

    setShowPropertyModal(false);
  };

  return (
    <div className="min-h-screen bg-[#06111f] text-white px-4 py-6 md:px-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-cyan-400">USER ADMIN</p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Welcome back, Test User
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage your portfolio, investments and FAIX assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-slate-700 bg-[#0b192b] px-4 py-2 text-sm text-slate-300 hover:border-cyan-500">
            🔔
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#0b192b] px-4 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400">
              TU
            </div>

            <div>
              <p className="text-sm font-medium">Test User</p>
              <p className="text-xs text-slate-500">Investor</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Available FAIX"
          value={balance.toLocaleString()}
          subtitle="Available balance"
          icon="₣"
        />

        <StatCard
          title="Portfolio Value"
          value={`$${(invested + 8200).toLocaleString()}`}
          subtitle="+12.8% this month"
          positive
          icon="↗"
        />

        <StatCard
          title="Invested Amount"
          value={`$${invested.toLocaleString()}`}
          subtitle="Across all assets"
          icon="◈"
        />

        <StatCard
          title="Total Holdings"
          value={propertiesOwned + fundsOwned}
          subtitle={`${propertiesOwned} properties • ${fundsOwned} funds`}
          icon="◆"
        />

      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* GRAPH */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a1728] p-5 xl:col-span-2">

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>
              <p className="text-sm text-slate-400">
                Portfolio Performance
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                $14,440.00
              </h2>

              <span className="text-sm text-emerald-400">
                +12.8% ↗
              </span>
            </div>

            <div className="flex rounded-xl border border-slate-700 bg-[#071321] p-1">
              {["1D", "1W", "1M", "1Y"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    period === item
                      ? "bg-cyan-500 text-[#06111f]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          <div className="overflow-hidden rounded-xl bg-[#071321] p-3">

            <svg
              viewBox="0 0 700 250"
              className="h-[260px] w-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="areaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#22d3ee"
                    stopOpacity="0.25"
                  />

                  <stop
                    offset="100%"
                    stopColor="#22d3ee"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {[40, 90, 140, 190].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="700"
                  y2={y}
                  stroke="#1e293b"
                  strokeWidth="1"
                />
              ))}

              <polyline
                points={graphPoints}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

            </svg>

          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a1728] p-5">

          <p className="text-sm text-slate-400">
            Quick Actions
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Grow your portfolio
          </h2>

          <div className="mt-6 space-y-3">

            <button
              onClick={() => setShowFundModal(true)}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#071321] p-4 text-left transition hover:border-cyan-500"
            >
              <div>
                <p className="font-medium">Invest in Fund</p>
                <p className="mt-1 text-xs text-slate-500">
                  Explore managed funds
                </p>
              </div>

              <span className="text-cyan-400 transition group-hover:translate-x-1">
                →
              </span>
            </button>

            <button
              onClick={() => setShowPropertyModal(true)}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#071321] p-4 text-left transition hover:border-cyan-500"
            >
              <div>
                <p className="font-medium">Buy Property</p>
                <p className="mt-1 text-xs text-slate-500">
                  Invest using FAIX
                </p>
              </div>

              <span className="text-cyan-400 transition group-hover:translate-x-1">
                →
              </span>
            </button>

            <button
              onClick={() => {
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
              }}
              className="group flex w-full items-center justify-between rounded-xl border border-slate-700 bg-[#071321] p-4 text-left transition hover:border-cyan-500"
            >
              <div>
                <p className="font-medium">Add Funds</p>
                <p className="mt-1 text-xs text-slate-500">
                  Add dummy FAIX balance
                </p>
              </div>

              <span className="text-cyan-400">+</span>
            </button>

          </div>

        </div>
      </div>

      {/* INVESTMENTS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* FUNDS */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a1728] p-5">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Investment Funds
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Popular Funds
              </h2>
            </div>

            <span className="text-xs text-cyan-400">
              LIVE NAV
            </span>
          </div>

          <div className="mt-5 space-y-3">

            {funds.map((fund) => (
              <div
                key={fund.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#071321] p-4"
              >
                <div>
                  <p className="font-medium">{fund.name}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    {fund.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ${fund.nav}
                  </p>

                  <p className="text-xs text-emerald-400">
                    +{fund.growth}%
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedFund(fund);
                    setShowFundModal(true);
                  }}
                  className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-medium text-[#06111f] hover:bg-cyan-400"
                >
                  Invest
                </button>
              </div>
            ))}

          </div>
        </div>

        {/* ASSET ALLOCATION */}
        <div className="rounded-2xl border border-slate-800 bg-[#0a1728] p-5">

          <p className="text-sm text-slate-400">
            Portfolio
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Asset Allocation
          </h2>

          <div className="mt-6 flex items-center gap-8">

            <div
              className="flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#22d3ee 0 45%, #818cf8 45% 75%, #34d399 75% 100%)",
              }}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0a1728]">
                <span className="text-sm text-slate-400">
                  Portfolio
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm">

              <AllocationItem
                label="Funds"
                value="45%"
              />

              <AllocationItem
                label="Property"
                value="30%"
              />

              <AllocationItem
                label="Exchange"
                value="25%"
              />

            </div>

          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0a1728] p-5">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Activity
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Recent Transactions
            </h2>
          </div>

          <button className="text-sm text-cyan-400 hover:text-cyan-300">
            View all →
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">

          <table className="w-full min-w-[600px] text-left text-sm">

            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase text-slate-500">
                <th className="pb-3">Asset</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.slice(0, 5).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-slate-800/70"
                >
                  <td className="py-4 font-medium">
                    {transaction.name}
                  </td>

                  <td className="py-4 text-slate-400">
                    {transaction.type}
                  </td>

                  <td className="py-4">
                    {transaction.amount}
                  </td>

                  <td className="py-4">
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

      {/* FUND MODAL */}
      {showFundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0a1728] p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-cyan-400">
                  FUND INVESTMENT
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedFund.name}
                </h2>
              </div>

              <button
                onClick={() => setShowFundModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-[#071321] p-4">

              <div className="flex justify-between">
                <span className="text-sm text-slate-400">
                  Current NAV
                </span>

                <span className="font-semibold">
                  ${selectedFund.nav}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-sm text-slate-400">
                  Growth
                </span>

                <span className="text-emerald-400">
                  +{selectedFund.growth}%
                </span>
              </div>

            </div>

            <label className="mt-5 block text-sm text-slate-400">
              Investment Amount
            </label>

            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-[#071321] px-4 py-3 outline-none focus:border-cyan-500"
            />

            <div className="mt-4 flex justify-between rounded-xl border border-slate-800 p-4">

              <span className="text-slate-400">
                Estimated Units
              </span>

              <span className="font-semibold text-cyan-400">
                {units.toFixed(2)}
              </span>

            </div>

            <button
              onClick={buyFund}
              className="mt-5 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-[#06111f] hover:bg-cyan-400"
            >
              Confirm Investment
            </button>

          </div>
        </div>
      )}

      {/* PROPERTY MODAL */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0a1728] p-6 shadow-2xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-cyan-400">
                  PROPERTY PURCHASE
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedProperty.name}
                </h2>
              </div>

              <button
                onClick={() => setShowPropertyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              {selectedProperty.location}
            </p>

            <div className="mt-5 rounded-xl bg-[#071321] p-4">

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Property Value
                </span>

                <span>
                  ${selectedProperty.price.toLocaleString()}
                </span>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-slate-400">
                  Token Value
                </span>

                <span>
                  {selectedProperty.tokenValue} FAIX
                </span>
              </div>

            </div>

            <label className="mt-5 block text-sm text-slate-400">
              FAIX Tokens
            </label>

            <input
              type="number"
              min="1"
              value={propertyTokens}
              onChange={(e) => setPropertyTokens(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-[#071321] px-4 py-3 outline-none focus:border-cyan-500"
            />

            <div className="mt-4 flex justify-between rounded-xl border border-slate-800 p-4">

              <span className="text-slate-400">
                Purchase Amount
              </span>

              <span className="font-semibold text-cyan-400">
                {propertyCost} FAIX
              </span>

            </div>

            <button
              onClick={buyProperty}
              className="mt-5 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-[#06111f] hover:bg-cyan-400"
            >
              Confirm Purchase
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  positive,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0a1728] p-5 transition hover:-translate-y-0.5 hover:border-cyan-500/40">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {value}
          </h2>

          <p
            className={`mt-1 text-xs ${
              positive
                ? "text-emerald-400"
                : "text-slate-500"
            }`}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-lg text-cyan-400">
          {icon}
        </div>

      </div>
    </div>
  );
}

function AllocationItem({ label, value }) {
  return (
    <div className="flex w-32 items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}