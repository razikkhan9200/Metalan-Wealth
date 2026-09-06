/* pages/auth/Login.jsx: application source file. See README.md for the folder responsibility. */
import { useState } from "react";

// React Router
import { Link, useLocation, useNavigate } from "react-router-dom";

// UI Components
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

// Constants
import { ROUTES } from "../../constants/routes";
import { setAuthSession } from "../../utils/auth";

// Images
import loginHeroBg from "../../../public/images/login-hero-bg.png";

// Brand accent color, reused across the gradient logo mark, the focus-ring
// color of inputs, and the active-tab outline. Centralized here so the
// whole page's "green" stays in sync if the brand palette ever changes.
const ACCENT = "#1A3C34";

// The three supported sign-in methods. Each tab id doubles as the `tab`
// state value and as the key used to decide which field(s) to render below,
// so keep these ids in sync with the `tab === "..."` checks further down.
const TABS = [
  { id: "email", label: "Email" },
  { id: "username", label: "Username" },
  { id: "otp", label: "Mobile OTP" },
];

// Shared overrides so the shared Input/Button primitives (built for the
// light-theme app shell) render correctly on this dark, photo-backed page.
// The "!" (important) modifiers guarantee these win over the component's
// own baked-in Tailwind classes regardless of stylesheet order.
const darkInputClass =
  "!border-white/10 !bg-black/40 !text-white placeholder:!text-white/30 " +
  "focus:!border-transparent focus:!ring-2";
const darkInputStyle = { "--tw-ring-color": `${ACCENT}99` };

// Centralized field-level validation. Kept outside the component so it has
// no closures over React state and can be unit-tested (or reused by a
// signup form later) without rendering anything.
function validateFields(tab, fields) {
  const errors = {};

  if (tab === "email") {
    if (!fields.email.trim()) {
      errors.email = "Enter your corporate email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = "Enter a valid email address.";
    }
  }

  if (tab === "username") {
    if (!fields.username.trim()) {
      errors.username = "Enter your username.";
    }
  }

  if (tab === "otp") {
    if (!fields.mobile.trim()) {
      errors.mobile = "Enter your mobile number.";
    } else if (!/^\+?[0-9\s]{7,15}$/.test(fields.mobile)) {
      errors.mobile = "Enter a valid mobile number.";
    }
  }

  // Password is only required for the email/username flows; the OTP flow
  // authenticates via a code sent to the phone instead of a password.
  if (tab !== "otp" && !fields.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

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

  // Which sign-in method is active. Drives both the tab highlight and
  // which input field(s) are rendered in the form below.
  const [tab, setTab] = useState("email");

  // Toggles the password field between masked ("password") and
  // plain-text ("text") rendering when the eye icon is clicked.
  const [showPassword, setShowPassword] = useState(false);

  // True while the (currently simulated) sign-in request is in flight.
  // Disables/animates the submit button so users can't double-submit.
  const [loading, setLoading] = useState(false);

  // A single object holds every possible field across all three tabs
  // (email, username, mobile, password) rather than one useState per
  // field. This keeps the component's state surface small and makes it
  // trivial to serialize the whole form (e.g. for the real API payload)
  // once the backend is wired up: `JSON.stringify(fields)`.
  const [fields, setFields] = useState({
    email: "",
    username: "",
    mobile: "",
    password: "",
  });

  // Validation messages keyed by field name, populated on submit attempt
  // and cleared as soon as the user edits the corresponding field again.
  const [errors, setErrors] = useState({});

  // Generic change handler shared by every input: `name` matches a key in
  // `fields` (via the `name` attribute we set on each <Input>), so one
  // function can update any field without a dedicated handler per input.
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFields((previous) => ({ ...previous, [name]: value }));

    // Clear the error for this field as soon as the user starts fixing
    // it, rather than making them wait for the next submit to see it go.
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  /**
   * Handles login form submission.
   *
   * Validates the fields relevant to the active tab, then currently
   * simulates an API request using a short delay. After successful
   * login, the user is redirected to:
   * - The previously requested protected route, if available.
   * - Otherwise, the main dashboard.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateFields(tab, fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // Temporary API simulation.
      // TODO(auth-integration): replace this delay with a real request,
      // e.g. `await api.post("/auth/login", { tab, ...fields })`, and
      // surface any server-side error into `setErrors` instead of
      // assuming success.
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create the temporary local authentication session.
      setAuthSession();

      // Return the user to the originally requested route
      // or redirect them to the dashboard.
      navigate(location.state?.from || ROUTES.DASHBOARD, {
        replace: true,
      });
    } finally {
      // Always clear the loading state, even if the (future) real
      // request throws, so the button doesn't get stuck spinning.
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0b0710]">
      {/* ============================================================
          BACKGROUND PHOTO
          `fixed` + `inset-0` locks this to the actual browser viewport
          (the initial containing block), not the flex content below.
          That's what stops the image from resizing/jumping when a
          mobile keyboard opens on tap, when the URL bar hides on
          scroll, or on any dvh/vh recalculation. Kept as its own
          layer, separate from the scrollable content.
      ============================================================ */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-no-repeat bg-[center_top] sm:bg-center"
        style={{ backgroundImage: `url(${loginHeroBg})` }}
        role="presentation"
      />
      {/* Dark gradient scrim over the photo: darkest at the bottom so the
          card and its shadow read clearly against busy image detail,
          lighter at the top so the hero photo still shows through. */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,7,16,0.35) 0%, rgba(11,7,16,0.25) 35%, rgba(11,7,16,0.55) 70%, rgba(11,7,16,0.85) 100%)",
        }}
      />

      {/* ============================================================
          LOGIN FORM SECTION
      ============================================================ */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        {/* Brand mark: links back to the marketing home page, not the
            dashboard, since a logged-out visitor has no dashboard yet. */}
        <Link
          to={ROUTES.HOME}
          className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg shadow-black/40 ring-1 ring-white/10 sm:h-14 sm:w-14 sm:rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${ACCENT}, #0e211c)` }}
        >
          <span className="font-serif text-xl text-[#e8c99a] sm:text-2xl">M</span>
        </Link>

        <Heading
          level={1}
          className="mt-4 text-center !text-white font-serif text-3xl sm:mt-5 sm:text-4xl lg:text-5xl"
        >
          Metalan Wealth
        </Heading>

        <Text
          color="white"
          size="sm"
          className="mt-2 text-center !text-white/50 text-[10px] tracking-[0.3em] sm:text-xs sm:tracking-[0.35em]"
        >
          PRESTIGE DIGITAL TOKENIZATION
        </Text>

        {/* Card */}
        <div
          className="mt-8 w-full max-w-[380px] rounded-2xl border bg-[#121614] p-5 shadow-[0_40px_90px_-15px_rgba(26,60,52,0.85),0_18px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:mt-10 sm:max-w-md sm:rounded-3xl sm:p-8 lg:max-w-[420px]"
          style={{ borderColor: `${ACCENT}99` }}
        >
          {/* Tabs: switching tabs only changes which fields are shown; it
              intentionally does NOT clear `fields`, so if a user tries
              email, switches to username, then back to email, their
              typed email is still there. */}
          <div className="mb-5 flex rounded-xl bg-black/30 p-1 sm:mb-6">
            {TABS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTab(option.id)}
                className={
                  "min-h-[40px] flex-1 rounded-xl px-2 text-[13px] transition-colors sm:text-sm " +
                  (tab === option.id
                    ? "bg-white/10 font-semibold text-white"
                    : "text-white/40 hover:text-white/70")
                }
                style={tab === option.id ? { boxShadow: `inset 0 0 0 1px ${ACCENT}66` } : undefined}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* ========================================================
              LOGIN FORM
              `noValidate` disables the browser's native validation
              bubbles so our own `errors` messages (styled to match the
              dark theme) are the only feedback the user sees.
          ======================================================== */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {tab === "email" && (
              <div>
                <label htmlFor="login-email" className="mb-2 block text-[11px] font-medium tracking-[0.15em] text-white/40">
                  CORPORATE EMAIL
                </label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={fields.email}
                  onChange={handleFieldChange}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "login-email-error" : undefined}
                  className={darkInputClass}
                  style={darkInputStyle}
                />
                {errors.email && (
                  <p id="login-email-error" className="mt-1.5 text-xs text-[#e8a655]">
                    {errors.email}
                  </p>
                )}
              </div>
            )}

            {tab === "username" && (
              <div>
                <label htmlFor="login-username" className="mb-2 block text-[11px] font-medium tracking-[0.15em] text-white/40">
                  USERNAME
                </label>
                <Input
                  id="login-username"
                  name="username"
                  type="text"
                  placeholder="your.username"
                  required
                  autoComplete="username"
                  value={fields.username}
                  onChange={handleFieldChange}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? "login-username-error" : undefined}
                  className={darkInputClass}
                  style={darkInputStyle}
                />
                {errors.username && (
                  <p id="login-username-error" className="mt-1.5 text-xs text-[#e8a655]">
                    {errors.username}
                  </p>
                )}
              </div>
            )}

            {tab === "otp" && (
              <div>
                <label htmlFor="login-mobile" className="mb-2 block text-[11px] font-medium tracking-[0.15em] text-white/40">
                  MOBILE NUMBER
                </label>
                <Input
                  id="login-mobile"
                  name="mobile"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={fields.mobile}
                  onChange={handleFieldChange}
                  aria-invalid={Boolean(errors.mobile)}
                  aria-describedby={errors.mobile ? "login-mobile-error" : undefined}
                  className={darkInputClass}
                  style={darkInputStyle}
                />
                {errors.mobile && (
                  <p id="login-mobile-error" className="mt-1.5 text-xs text-[#e8a655]">
                    {errors.mobile}
                  </p>
                )}
              </div>
            )}

            {/* Password is shared by the email and username flows (OTP
                logs in with a one-time code instead), so it lives outside
                the tab-specific blocks above rather than being duplicated
                in each one. */}
            {tab !== "otp" && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="login-password" className="text-[11px] font-medium tracking-[0.15em] text-white/40">
                    SECURE PASSWORD
                  </label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-[11px] font-medium text-white/40 hover:text-white/70"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    value={fields.password}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    className={`${darkInputClass} pr-11`}
                    style={darkInputStyle}
                  />
                  {/* Positioned absolutely inside the input's relative
                      wrapper so it overlaps the field itself rather than
                      taking up its own layout space next to it. */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white/40 hover:text-white/70"
                  >
                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" className="mt-1.5 text-xs text-[#e8a655]">
                    {errors.password}
                  </p>
                )}
              </div>
            )}

            {/* Submit: label changes because the OTP tab doesn't log the
                user in directly — it triggers sending a one-time code, a
                separate step from the actual sign-in. */}
            <Button
              type="submit"
              loading={loading}
              className="mt-1 h-12 w-full !rounded-xl !bg-gradient-to-r from-[#f2c380] via-[#e8a655] to-[#d9822f] !text-[#241608] text-base font-extrabold tracking-wide shadow-lg transition-all duration-300 hover:!brightness-105 hover:scale-[1.03] hover:shadow-[0_20px_45px_-8px_rgba(184,115,51,0.85)] active:scale-[0.98] sm:mt-2 sm:text-lg"
            >
              {tab === "otp" ? "SEND OTP" : "SIGN IN TO PORTAL"}
            </Button>
          </form>

          <hr className="my-5 border-white/10 sm:my-6" />

          {/* Secondary action: sending a first-time visitor to account
              creation instead of leaving them stuck on a login-only card. */}
          <Text size="sm" className="text-center !text-white/50">
            Don&apos;t have an account?{" "}
            <Link
              to={ROUTES.SIGNUP}
              className="font-semibold !text-[#e8a655] hover:!text-[#f2c380]"
            >
              Create one
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a20.4 20.4 0 0 1-3.22 4.5M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}