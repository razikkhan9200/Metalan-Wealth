/* components/ui/Card.jsx: application source file. See README.md for the folder responsibility. */
export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}