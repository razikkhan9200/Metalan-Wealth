/* pages/dashboard/Transactions.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";

/**
 * Transactions dashboard page.
 *
 * Allows users to review their account transactions
 * and complete activity history.
 *
 * The page is currently prepared for API integration.
 * Transaction records will be fetched from the backend
 * once the required transaction endpoints are available.
 */
export default function Transactions() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Transactions
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        Review account transactions and activity history.
      </Text>

      {/* ============================================================
          TRANSACTIONS MODULE
      ============================================================ */}
      <Card className="mt-8 min-h-72">
        <p className="text-sm font-medium text-slate-500">
          Module ready for API integration
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Connect this page to its service layer when backend
          endpoints are available.
        </p>
      </Card>
    </div>
  );
}