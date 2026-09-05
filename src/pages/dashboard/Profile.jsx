/* pages/dashboard/Profile.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";

/**
 * Profile dashboard page.
 *
 * Allows users to manage their account information
 * and view their verification status.
 *
 * The page is currently prepared for API integration.
 * User profile data and KYC information will be loaded
 * from the backend once the required endpoints are available.
 */
export default function Profile() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Profile
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        Manage account information and verification status.
      </Text>

      {/* ============================================================
          PROFILE MODULE
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