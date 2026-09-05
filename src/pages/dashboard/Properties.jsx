/* pages/dashboard/Properties.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";

/**
 * Properties dashboard page.
 *
 * Allows users to view and manage property opportunities
 * and their property investment portfolio.
 *
 * The page is currently prepared for API integration.
 * Property listings, tokenized properties, investments,
 * and portfolio data will be loaded from the backend
 * once the required endpoints are available.
 */
export default function Properties() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Properties
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        Manage property opportunities and your property portfolio.
      </Text>

      {/* ============================================================
          PROPERTIES MODULE
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