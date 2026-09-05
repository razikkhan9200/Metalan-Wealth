/* pages/errors/Unauthorized.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";

/**
 * Unauthorized page.
 *
 * Displayed when an authenticated user attempts to access
 * a page or resource for which they do not have permission.
 */
export default function Unauthorized() {
  return (
    <div className="mx-auto max-w-2xl py-24">
      {/* Page Heading */}
      <Heading className="text-5xl">
        Unauthorized
      </Heading>

      {/* Permission Error Message */}
      <p className="mt-4 text-slate-500">
        You do not have permission to access this page.
      </p>
    </div>
  );
}