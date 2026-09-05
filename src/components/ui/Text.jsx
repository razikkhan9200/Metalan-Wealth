/* components/ui/Text.jsx: application source file. See README.md for the folder responsibility. */
export default function Text({
  children,
  size = "md",
  weight = "normal",
  color = "default",
  className = "",
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colors = {
    default: "text-slate-700",
    muted: "text-slate-500",
    dark: "text-slate-950",
    white: "text-white",
  };

  return (
    <p className={`${sizes[size]} ${weights[weight]} ${colors[color]} ${className}`}>
      {children}
    </p>
  );
}