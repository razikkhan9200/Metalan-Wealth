/* components/ui/Spinner.jsx: application source file. See README.md for the folder responsibility. */
export default function Spinner({ className = "h-5 w-5" }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-slate-200 border-t-slate-900 ${className}`} />;
}