/* components/ui/Modal.jsx: application source file. See README.md for the folder responsibility. */
import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Generic centered modal: dark backdrop + a bordered dark panel, closes
 * on Escape, backdrop click, or the corner "X". Renders nothing when
 * `open` is false rather than mounting hidden, so modal-only state
 * (e.g. a wizard step) always starts fresh next time it opens.
 *
 * Rendered through a portal straight into `document.body` rather than
 * in place in the component tree. `position: fixed` is only guaranteed
 * to cover the full viewport when none of its ancestors introduce a
 * transform/filter/perspective (each of those creates a new containing
 * block) — a portal sidesteps that entirely, so this always covers the
 * full screen regardless of what CSS the page it's opened from happens
 * to have further up the tree (this app's Lenis smooth-scroll, sticky
 * headers, etc. included).
 *
 * This is presentation-only — callers own whatever step/form state
 * lives inside `children` (see DepositModal/WithdrawModal for the
 * two-step "form → success" pattern used across the wallet).
 */
export default function Modal({ open, onClose, children, className = "" }) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", handleKeyDown);

    // Lock background scroll (and Lenis's smooth-scroll along with it)
    // while the modal is open, so scrolling the page underneath isn't
    // possible — and restore whatever the body's overflow was before,
    // rather than assuming it was empty.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-16 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        // data-lenis-prevent stops Lenis from hijacking wheel/touch
        // input meant for scrolling inside the modal panel itself.
        data-lenis-prevent
        className={
          "relative w-full max-w-[440px] rounded-3xl border border-white/10 bg-[#0d0c12] p-6 shadow-2xl sm:p-7 " +
          className
        }
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
