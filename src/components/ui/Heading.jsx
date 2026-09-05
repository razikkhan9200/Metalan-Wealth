/* components/ui/Heading.jsx: application source file. See README.md for the folder responsibility. */
export default function Heading({
  children,
  level = 2,
  className = "",
}) {
  const Tag = `h${level}`;

  return (
    <Tag className={`font-semibold tracking-tight text-slate-950 ${className}`}>
      {children}
    </Tag>
  );
}