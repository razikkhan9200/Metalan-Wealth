/* utils/toast.js: application source file.
 *
 * A tiny, dependency-free toast store. Kept separate from the
 * <Toaster /> component (components/ui/Toaster.jsx) so it can be
 * called from ANYWHERE — inside a component, inside a plain JS
 * service file (services/Api.js, services/UserService.js), even
 * outside of React entirely — not just from components that render
 * the Toaster itself.
 *
 * EXAMPLE USAGE:
 *
 *   import { toast } from "../../utils/toast";
 *
 *   // Fire-and-forget states
 *   toast.success("Profile updated.");
 *   toast.error("Couldn't save your changes.");
 *   const id = toast.loading("Signing you in...");
 *   toast.dismiss(id);
 *
 *   // The common case — one call covers waiting / success / failed:
 *   await toast.promise(
 *     post("/auth/login", { username, password }),
 *     {
 *       loading: "Signing you in...",
 *       success: "Welcome back!",
 *       error: (err) => err.message || "Invalid username or password.",
 *     }
 *   );
 */

// Module-level state + subscriber list. This is the same "external
// store" shape React's own useSyncExternalStore expects, which is
// exactly how components/ui/Toaster.jsx reads it — no Context
// Provider needed, so the app doesn't have to wrap itself in one
// just to show a toast.
let toasts = [];
const listeners = new Set();
const timers = new Map();

let uid = 0;
function generateId() {
  uid += 1;
  return `toast_${Date.now()}_${uid}`;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function clearTimer(id) {
  if (timers.has(id)) {
    clearTimeout(timers.get(id));
    timers.delete(id);
  }
}

// Loading toasts stay up until explicitly resolved/dismissed;
// everything else auto-dismisses after its `duration`.
function scheduleAutoDismiss(toastEntry) {
  clearTimer(toastEntry.id);
  if (toastEntry.type === "loading" || toastEntry.duration === Infinity) {
    return;
  }
  const timer = setTimeout(() => dismiss(toastEntry.id), toastEntry.duration);
  timers.set(toastEntry.id, timer);
}

function upsert(partialToast) {
  const id = partialToast.id || generateId();
  const defaults = { type: "default", duration: 4000 };
  const existing = toasts.find((entry) => entry.id === id);

  const nextToast = { ...defaults, ...existing, ...partialToast, id };
  toasts = existing
    ? toasts.map((entry) => (entry.id === id ? nextToast : entry))
    : [...toasts, nextToast];

  emitChange();
  scheduleAutoDismiss(nextToast);
  return id;
}

function dismiss(id) {
  if (id === undefined) {
    toasts.forEach((entry) => clearTimer(entry.id));
    toasts = [];
  } else {
    clearTimer(id);
    toasts = toasts.filter((entry) => entry.id !== id);
  }
  emitChange();
}

// --- The external-store contract Toaster.jsx subscribes to ---------

export function subscribeToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastSnapshot() {
  return toasts;
}

// --- The public, imperative API -------------------------------------

export const toast = {
  /** Waiting state — e.g. a request in flight. Stays open until you
   * dismiss it or resolve it with toast.success/toast.error, unless
   * you pass an explicit `duration`. */
  loading(message, options = {}) {
    return upsert({ type: "loading", message, duration: Infinity, ...options });
  },

  success(message, options = {}) {
    return upsert({ type: "success", message, duration: 4000, ...options });
  },

  error(message, options = {}) {
    return upsert({ type: "error", message, duration: 5000, ...options });
  },

  info(message, options = {}) {
    return upsert({ type: "info", message, duration: 4000, ...options });
  },

  /** Update an existing toast in place — how promise() below turns a
   * loading toast into a success/error toast without it re-animating
   * in as a brand new one. */
  update(id, partialToast) {
    upsert({ ...partialToast, id });
  },

  dismiss(id) {
    dismiss(id);
  },

  /**
   * Wires a promise (or an async function) up to all three states in
   * one call: shows `messages.loading` immediately, then flips the
   * SAME toast to `messages.success` or `messages.error` depending on
   * how the promise settles. `success`/`error` may be strings or
   * `(value) => string` functions, so the message can use the
   * resolved data or the caught error.
   *
   * Returns the original promise so callers can still await it / let
   * it throw.
   */
  promise(promiseOrFn, messages = {}, options = {}) {
    const id = upsert({
      type: "loading",
      message: messages.loading || "Loading...",
      duration: Infinity,
      ...options,
    });

    const runningPromise = typeof promiseOrFn === "function" ? promiseOrFn() : promiseOrFn;

    return runningPromise.then(
      (result) => {
        const text =
          typeof messages.success === "function"
            ? messages.success(result)
            : messages.success || "Done.";
        upsert({ id, type: "success", message: text, duration: options.duration ?? 4000 });
        return result;
      },
      (err) => {
        const text =
          typeof messages.error === "function"
            ? messages.error(err)
            : messages.error || err?.message || "Something went wrong.";
        upsert({ id, type: "error", message: text, duration: options.duration ?? 5000 });
        throw err;
      }
    );
  },
};
