import { HTMLAttributes, ReactNode } from "react";

/**
 * The shared content container — a soft, slightly rounded "blister pack"
 * cell. Distinct from Button's pill shape on purpose: pills = actions,
 * rounded squares = content.
 */
export default function Card({
  children,
  className = "",
  hoverable = false,
  padding = "md",
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }[padding];

  return (
    <div
      {...rest}
      className={`bg-surface border border-border rounded-2xl shadow-[var(--shadow-card)] ${
        hoverable
          ? "transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)]"
          : ""
      } ${paddingClasses} ${className}`}
    >
      {children}
    </div>
  );
}
