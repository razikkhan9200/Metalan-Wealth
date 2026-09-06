/* pages/dashboard/exchange/Exchange.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../../components/ui/Heading";
import Text from "../../../components/ui/Text";
import Card from "../../../components/ui/Card";

/**
 * Exchange dashboard page.
 *
 * This page is currently a placeholder for the exchange module.
 * Exchange functionality will be connected to the backend service
 * once the required API endpoints are available.
 */
export default function Exchange() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Exchange
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        Access supported exchange functionality.
      </Text>

      {/* ============================================================
          EXCHANGE MODULE
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