/* pages/dashboard/Dashboard.jsx: application source file. See README.md for the folder responsibility. */
import {
  ArrowLeftRight,
  ArrowUpRight,
  Building2,
  Coins,
  Wallet,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

/**
 * Dashboard summary statistics.
 *
 * The values are currently static placeholders.
 * They will be replaced with real API data once
 * the dashboard APIs are integrated.
 */
const stats = [
  {
    label: "Available Balance",
    value: "₹0.00",
    icon: Wallet,
  },
  {
    label: "Property",
    value: "0",
    icon: Building2,
  },
  {
    label: "Funds",
    value: "0",
    icon: Coins,
  },
  {
    label: "Exchange",
    value: "Ready",
    icon: ArrowLeftRight,
  },
];

/**
 * Dashboard overview page.
 *
 * Displays:
 * - Account summary statistics
 * - Available balance
 * - Property investment count
 * - Investment fund count
 * - Exchange status
 * - Recent account activity
 *
 * Real balances, investments and activity will be
 * fetched from APIs in the future.
 */
export default function Dashboard() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Overview
      </p>

      <Heading className="mt-1 text-4xl">
        Dashboard
      </Heading>

      <Text
        className="mt-2"
        color="muted"
      >
        Monitor your connected Metalan Wealth experience.
      </Text>

      {/* ============================================================
          DASHBOARD STATISTICS
      ============================================================ */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {label}
              </span>

              <Icon size={19} />
            </div>

            {/* Statistic Value */}
            <p className="mt-6 text-2xl font-semibold">
              {value}
            </p>

            {/* Details Link */}
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
              <span>View details</span>
              <ArrowUpRight size={13} />
            </div>
          </Card>
        ))}
      </div>

      {/* ============================================================
          RECENT ACTIVITY
      ============================================================ */}
      <Card className="mt-6 min-h-72">
        <Heading className="text-2xl">
          Recent Activity
        </Heading>

        <Text
          className="mt-2"
          color="muted"
        >
          Transactions, deposits, withdrawals and other account
          activity will appear here.
        </Text>
      </Card>
    </div>
  );
}