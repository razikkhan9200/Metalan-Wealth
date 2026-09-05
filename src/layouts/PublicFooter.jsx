/* layouts/PublicFooter.jsx: application source file. See README.md for the folder responsibility. */
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
/** Shared public footer. */
export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <Link to={ROUTES.HOME} className="text-lg font-bold">
            Metalan Wealth
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Digital access to a connected wealth ecosystem.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-slate-400">
          <Link to={ROUTES.ABOUT}>About</Link>
          <Link to={ROUTES.PROPERTIES}>Properties</Link>
          <Link to={ROUTES.FUNDS}>Funds</Link>
          <Link to={ROUTES.EXCHANGE}>Exchange</Link>
          <Link to={ROUTES.LOGIN}>Login</Link>
        </div>
      </div>
    </footer>
  );
}
