/* pages/dashboard/Funds.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";

/**
 * Funds dashboard page.
 *
 * Displays the user's structured investment funds and
 * fund positions.
 *
 * The page is currently prepared for API integration.
 * Real fund data will be loaded once the backend
 * endpoints are available.
 */
export default function Funds() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Funds
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        View structured funds and your fund positions.
      </Text>

      {/* ============================================================
          FUNDS MODULE
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