import { ReactNode } from "react";

type Variant = "neutral" | "success" | "danger" | "warning" | "brand";

const variantClasses: Record<Variant, string> = {
  neutral: "bg-paper-deep text-ink-soft",
  success: "bg-pharmacy-light text-pharmacy-deep",
  danger: "bg-rx-light text-rx-deep",
  warning: "bg-amber-light text-amber",
  brand: "bg-pharmacy text-white",
};

export default function Badge({
  children,
  variant = "neutral",
  icon,
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="[&>svg]:h-3 [&>svg]:w-3">{icon}</span>}
      {children}
    </span>
  );
}
