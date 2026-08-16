import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full rounded-xl border border-border bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted transition-colors focus:border-pharmacy focus:bg-surface focus:outline-none disabled:opacity-50";

export function Label({
  children,
  htmlFor,
  required,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-soft">
      {children}
      {required && <span className="text-rx"> *</span>}
    </label>
  );
}

export function HelperText({ children, error }: { children: ReactNode; error?: boolean }) {
  return (
    <p className={`mt-1.5 text-xs ${error ? "text-rx" : "text-muted"}`}>{children}</p>
  );
}

export function Input({
  className = "",
  error,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...rest}
      className={`${fieldBase} ${error ? "border-rx focus:border-rx" : ""} ${className}`}
    />
  );
}

export function Textarea({
  className = "",
  error,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...rest}
      className={`${fieldBase} ${error ? "border-rx focus:border-rx" : ""} ${className}`}
    />
  );
}

export function Select({
  className = "",
  error,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...rest}
      className={`${fieldBase} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%236b7a75"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/></svg>')] bg-no-repeat bg-[right_0.9rem_center] pr-10 ${
        error ? "border-rx focus:border-rx" : ""
      } ${className}`}
    >
      {children}
    </select>
  );
}
