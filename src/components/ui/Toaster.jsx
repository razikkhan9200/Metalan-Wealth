/* components/ui/Toaster.jsx: application source file. See README.md
 * for the folder responsibility.
 *
 * Renders whatever is currently in the toast store (utils/toast.js)
 * as a fixed stack of cards. Mount this ONCE, high up in the tree
 * (App.jsx does this, outside <AppRoutes />, so it survives page
 * navigation) — every `toast.success(...)` / `toast.error(...)` /
 * `toast.loading(...)` call anywhere in the app will then show up
 * here automatically, no prop drilling or context required.
 */
import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2, Info, X } from "lucide-react";
import { subscribeToasts, getToastSnapshot, toast } from "../../utils/toast";

// Kept in sync with the brand accent used across Login/Dashboard so
// the toast stack doesn't look like a bolted-on third-party widget.
const GOLD = "#e8b46a";

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  error: <XCircle className="h-5 w-5 text-red-400" />,
  loading: <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />,
  info: <Info className="h-5 w-5 text-sky-400" />,
  default: <Info className="h-5 w-5 text-white/50" />,
};

// Left accent-bar color per status — kept as literal hex values (not
// built from a template string) so this stays readable and doesn't
// rely on Tailwind's arbitrary-value scanner picking up a dynamic
// class name.
const BAR_COLOR = {
  success: "#34d399",
  error: "#f87171",
  loading: GOLD,
  info: "#38bdf8",
  default: "rgba(255,255,255,0.25)",
};

const POSITION_CLASSES = {
  "top-right": "top-4 right-4 items-end sm:top-6 sm:right-6",
  "top-left": "top-4 left-4 items-start sm:top-6 sm:left-6",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center sm:top-6",
  "bottom-right": "bottom-4 right-4 items-end sm:bottom-6 sm:right-6",
  "bottom-left": "bottom-4 left-4 items-start sm:bottom-6 sm:left-6",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center sm:bottom-6",
};

export default function Toaster({ position = "top-right" }) {
  // useSyncExternalStore is the correct way to subscribe a component
  // to state that lives outside React (our module-level `toasts`
  // array) without ad-hoc useEffect + useState wiring.
  const allToasts = useSyncExternalStore(subscribeToasts, getToastSnapshot, getToastSnapshot);
  const fromBottom = position.startsWith("bottom");

  // Bottom stacks read naturally with the newest toast nearest the
  // edge the user's eye returns to, so the newest entry renders last
  // (closest to the screen edge) rather than pushing older ones down.
  const orderedToasts = fromBottom ? [...allToasts].reverse() : allToasts;

  return (
    <div
      className={`pointer-events-none fixed z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5 ${
        POSITION_CLASSES[position] || POSITION_CLASSES["top-right"]
      }`}
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {orderedToasts.map((entry) => (
          <ToastCard key={entry.id} entry={entry} fromBottom={fromBottom} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ entry, fromBottom }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: fromBottom ? 16 : -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, x: 24, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      role={entry.type === "error" ? "alert" : "status"}
      className="pointer-events-auto flex w-full items-start gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#121614]/95 py-3.5 pl-3.5 pr-3 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
      style={{ borderLeft: `3px solid ${BAR_COLOR[entry.type] || BAR_COLOR.default}` }}
    >
      <span className="mt-0.5 shrink-0">{ICONS[entry.type] || ICONS.default}</span>

      <div className="min-w-0 flex-1">
        {entry.title && (
          <p className="text-sm font-semibold leading-snug text-white">{entry.title}</p>
        )}
        <p className="text-sm leading-snug text-white/70">{entry.message}</p>
      </div>

      {/* Loading toasts resolve on their own (into success/error) or
          get dismissed programmatically, so there's nothing useful
          for a manual close button to do while one is in flight. */}
      {entry.type !== "loading" && (
        <button
          type="button"
          onClick={() => toast.dismiss(entry.id)}
          aria-label="Dismiss notification"
          className="mt-0.5 shrink-0 rounded-md p-1 text-white/30 transition hover:bg-white/10 hover:text-white/70"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
