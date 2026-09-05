/* pages/dashboard/Referrals.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";

/**
 * Referrals dashboard page.
 *
 * Allows users to manage their Metalan Wealth referral
 * activity and referral-related information.
 *
 * The page is currently prepared for API integration.
 * Referral statistics, users, rewards, and referral history
 * will be loaded from the backend once the required
 * endpoints are available.
 */
export default function Referrals() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
      ============================================================ */}
      <p className="text-sm font-medium text-slate-400">
        Private Area
      </p>

      <Heading className="mt-1 text-4xl">
        Referrals
      </Heading>

      <Text
        className="mt-3 max-w-2xl"
        color="muted"
      >
        Manage your Metalan Wealth referral experience.
      </Text>

      {/* ============================================================
          REFERRAL MODULE
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