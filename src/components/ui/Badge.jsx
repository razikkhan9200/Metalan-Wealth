/* components/ui/Badge.jsx: application source file. See README.md for the folder responsibility. */
export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 ${className}`}
    >
      {children}
    </span>
  );
}
