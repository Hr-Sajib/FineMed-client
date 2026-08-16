"use client";

import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-pharmacy text-white hover:bg-pharmacy-deep active:bg-pharmacy-deep shadow-[0_1px_2px_rgba(16,35,29,0.08)]",
  secondary: "bg-pharmacy-light text-pharmacy-deep hover:bg-[#d3ecdd]",
  outline: "bg-transparent text-pharmacy border border-pharmacy hover:bg-pharmacy-light",
  ghost: "bg-transparent text-ink-soft hover:bg-paper-deep",
  destructive: "bg-rx text-white hover:bg-rx-deep",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-1.5 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-base px-7 py-3.5 gap-2.5",
};

/**
 * The one button component for the whole app. Always pill-shaped
 * (rounded-full) — a deliberate, consistent shape language distinct from
 * the squarer "blister pack" cards used for content.
 */
export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    loading = false,
    fullWidth = false,
    children,
    className = "",
  } = props;

  const classes = [
    "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
      ) : (
        icon && iconPosition === "left" && <span className="[&>svg]:h-[1em] [&>svg]:w-[1em]">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="[&>svg]:h-[1em] [&>svg]:w-[1em]">{icon}</span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        onClick={props.onClick}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      {...buttonProps}
      disabled={buttonProps.disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
}
