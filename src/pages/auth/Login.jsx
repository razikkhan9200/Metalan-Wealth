/* pages/auth/Login.jsx: application source file. See README.md for the folder responsibility. */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

import { ROUTES } from "../../constants/routes";
import { setAuthSession } from "../../utils/auth";

/**
 * Login page for Metalan Wealth.
 *
 * This page currently uses a temporary local authentication session
 * so that frontend routing and protected routes can be tested.
 *
 * Replace the temporary handleSubmit logic with the real
 * authentication API once the backend is integrated.
 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Controls the login button loading state.
  const [loading, setLoading] = useState(false);

  /**
   * Handles login form submission.
   *
   * Currently simulates an API request using a short delay.
   * After successful login, the user is redirected to:
   * - The previously requested protected route, if available.
   * - Otherwise, the main dashboard.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    // Temporary API simulation.
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create the temporary local authentication session.
    setAuthSession();

    // Return the user to the originally requested route
    // or redirect them to the dashboard.
    navigate(
      location.state?.from || ROUTES.DASHBOARD,
      {
        replace: true,
      }
    );
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ============================================================
          LOGIN INTRODUCTION PANEL
          Visible only on large screens.
      ============================================================ */}
      <div className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* Brand */}
        <Link
          to={ROUTES.HOME}
          className="text-xl font-bold"
        >
          Metalan Wealth
        </Link>

        {/* Introduction */}
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Private Access
          </p>

          <h1 className="mt-4 max-w-xl text-5xl font-semibold">
            Your connected wealth dashboard starts here.
          </h1>
        </div>

        {/* Security Message */}
        <p className="text-sm text-slate-500">
          Secure authentication and protected application routes.
        </p>
      </div>

      {/* ============================================================
          LOGIN FORM SECTION
      ============================================================ */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          {/* Welcome Text */}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Welcome Back
          </p>

          {/* Page Heading */}
          <Heading className="mt-3 text-4xl">
            Login
          </Heading>

          {/* Description */}
          <Text
            className="mt-3"
            color="muted"
          >
            Sign in to access your private Metalan Wealth dashboard.
          </Text>

          {/* ========================================================
              LOGIN FORM
          ======================================================== */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
            />

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Login
            </Button>
          </form>

          {/* ========================================================
              REGISTRATION LINK
          ======================================================== */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              className="font-semibold text-slate-950"
              to={ROUTES.REGISTER}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/*


Login flow :--

/login
   ↓
Login Form
   ↓
Submit
   ↓
Loading
   ↓
setAuthSession()
   ↓
Is there a previous protected route?
   ├── YES → /dashboard/properties
   └── NO  → /dashboard


*/