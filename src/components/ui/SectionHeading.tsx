export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-pharmacy-deep">
          {align === "center" && <span className="h-px w-6 bg-pharmacy-deep/40" />}
          {eyebrow}
          {align === "left" && <span className="h-px w-6 bg-pharmacy-deep/40" />}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      {description && (
        <p className={`mt-3 text-base text-ink-soft ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
