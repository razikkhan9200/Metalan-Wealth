/* pages/errors/NotFound.jsx: application source file. See README.md for the folder responsibility. */
import Heading from "../../components/ui/Heading";

/**
 * 404 Not Found page.
 *
 * Displayed when the user navigates to a route
 * that does not exist in the application.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-24">
      {/* Page Heading */}
      <Heading className="text-5xl">
        Page Not Found
      </Heading>

      {/* Error Message */}
      <p className="mt-4 text-slate-500">
        The page you requested does not exist.
      </p>
    </div>
  );
}