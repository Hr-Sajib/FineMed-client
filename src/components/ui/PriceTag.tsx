/**
 * Every price in the app renders through this component so the "label
 * data" typographic treatment (mono, like the print on a real medicine
 * label) stays identical everywhere — shop cards, cart, checkout, admin.
 */
export default function PriceTag({
  value,
  size = "md",
  className = "",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <span className={`font-mono font-semibold text-pharmacy-deep ${sizeClasses} ${className}`}>
      ৳{value.toFixed(2)}
    </span>
  );
}
