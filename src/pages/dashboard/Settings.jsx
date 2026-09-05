/* pages/dashboard/Settings.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";

/**
 * Settings dashboard page.
 *
 * Allows users to manage their Metalan Wealth account
 * and application preferences.
 *
 * The page is currently prepared for API integration.
 * Account settings and user preferences will be loaded
 * and updated through the backend once the required
 * endpoints are available.
 */
export default function Settings() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Settings
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        Manage your Metalan Wealth settings and preferences.
      </Text>

      {/* ============================================================
          SETTINGS MODULE
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