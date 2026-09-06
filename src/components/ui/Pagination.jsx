/* components/ui/Pagination.jsx: reusable pagination control. */
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination
 *
 * Generic, presentation-only page selector. It has no idea what it's
 * paginating — the parent owns the actual data slicing and just tells
 * this component how many pages exist and which one is active. That
 * keeps it reusable anywhere a list needs paging (activity feed,
 * transactions, store listings, etc.) without duplicating this markup.
 *
 * Page-number buttons collapse with "…" ellipses once there are more
 * than a handful of pages, so this stays usable even with e.g. 40 pages
 * of activity, rather than rendering 40 buttons in a row.
 *
 * Props:
 * - currentPage: 1-indexed number of the active page.
 * - totalPages: total number of pages available.
 * - onPageChange(page): called with the new 1-indexed page number
 *   whenever the user picks a different page. The parent is responsible
 *   for updating its own `currentPage` state in response.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Nothing to page through — render nothing rather than a useless
  // single "1" button with disabled arrows on both sides.
  if (totalPages <= 1) return null;

  const goTo = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    if (clamped !== currentPage) onPageChange(clamped);
  };

  const pageItems = buildPageList(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4"
    >
      <p className="hidden text-xs text-white/40 sm:block">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-1 items-center justify-center gap-1.5 sm:flex-initial">
        <PageButton
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </PageButton>

        {pageItems.map((item, index) =>
          item === ELLIPSIS ? (
            <span
              // Two ellipses can appear (one on each side of the current
              // page), so the array index disambiguates their React keys.
              key={`ellipsis-${index}`}
              className="px-1.5 text-xs text-white/30"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <PageButton
              key={item}
              onClick={() => goTo(item)}
              active={item === currentPage}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </PageButton>
          )
        )}

        <PageButton
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </PageButton>
      </div>
    </nav>
  );
}

// Sentinel value used inside the generated page list to mark where a
// run of skipped page numbers should render as "…" instead of a button.
const ELLIPSIS = "ellipsis";

/**
 * Builds the list of page buttons to render, collapsing the middle into
 * an ellipsis once there are enough pages that showing every number
 * would overflow the control. Always keeps the first page, the last
 * page, and a small window around the current page visible, e.g. for
 * page 7 of 20: [1, …, 6, 7, 8, …, 20].
 */
function buildPageList(currentPage, totalPages) {
  const maxVisible = 7; // total slots including first/last and ellipses
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items = [1];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) items.push(ELLIPSIS);
  for (let page = windowStart; page <= windowEnd; page++) items.push(page);
  if (windowEnd < totalPages - 1) items.push(ELLIPSIS);

  items.push(totalPages);
  return items;
}

/** Shared button styling for both the numbered pages and the arrows. */
function PageButton({ children, active, disabled, ...rest }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={
        "flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors " +
        (active
          ? "bg-[#e8b46a] text-[#241608]"
          : disabled
          ? "cursor-not-allowed text-white/20"
          : "text-white/50 hover:bg-white/10 hover:text-white/80")
      }
      {...rest}
    >
      {children}
    </button>
  );
}