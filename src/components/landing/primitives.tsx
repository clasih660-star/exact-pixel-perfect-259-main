/**
 * Klassruum landing — reusable primitives.
 *
 * Small, composable building blocks shared across the landing sections so the
 * design system (spacing, radius, colour, shadow) stays consistent everywhere.
 *
 * Brand tokens are written as literal Tailwind arbitrary values because the app
 * theme globally zeroes the radius scale and remaps colours; literals guarantee
 * the premium look specified in the brand guide.
 */

import { Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ── Layout container ─────────────────────────────────────────────── */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

/* ── Eyebrow / kicker label ───────────────────────────────────────── */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Section header (eyebrow + h2 + supporting copy) ──────────────── */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "lp-fade-up",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className={cn(
          "text-[#0F172A] font-bold tracking-tight",
          "text-[28px] leading-[1.15] sm:text-[34px] md:text-[40px]",
          eyebrow ? "mt-4" : "",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-[17px] leading-relaxed text-[#475569]", align === "center" ? "mx-auto" : "")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ── CTA button (Link, anchor, or button) ─────────────────────────── */
type CTAVariant = "primary" | "secondary" | "ghost";
type CTASize = "md" | "lg";

function ctaClasses(variant: CTAVariant, size: CTASize, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2",
    size === "lg" ? "h-12 px-6 text-[15px]" : "h-11 px-5 text-sm",
    variant === "primary" &&
      "bg-[#1F7C80] text-white shadow-lg shadow-teal-500/25 hover:bg-[#1A5256] hover:shadow-xl hover:shadow-teal-500/30",
    variant === "secondary" &&
      "border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:border-zinc-300 hover:bg-zinc-50",
    variant === "ghost" && "text-[#1F7C80] hover:bg-teal-50",
    className,
  );
}

export function CTAButton({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: CTAVariant;
  size?: CTASize;
  className?: string;
  ariaLabel?: string;
}) {
  const cls = ctaClasses(variant, size, className);
  if (to) {
    // Cast: landing links target real, existing routes.
    return (
      <Link to={to as never} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/* ── Premium surface card ─────────────────────────────────────────── */
export function SurfaceCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "lp-lift rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-300 hover:shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── Feature card ─────────────────────────────────────────────────── */
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <SurfaceCard className="h-full">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-[#1F7C80]">
        {icon}
      </div>
      <h3 className="mt-5 text-[17px] font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-500">{description}</p>
    </SurfaceCard>
  );
}

/* ── Stat card ────────────────────────────────────────────────────── */
export function StatCard({
  value,
  label,
  hint,
}: {
  value: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-[28px] font-bold tracking-tight text-zinc-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-zinc-900">{label}</div>
      {hint ? <div className="mt-1 text-xs text-zinc-400">{hint}</div> : null}
    </div>
  );
}

/* ── Inline check / cross used in lists and tables ────────────────── */
export function YesMark({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#1F7C80]">
      <Check className="h-4 w-4" aria-hidden />
      {label ? <span className="text-sm text-zinc-500">{label}</span> : <span className="sr-only">Yes</span>}
    </span>
  );
}

export function NoMark({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-zinc-300">
      <Minus className="h-4 w-4" aria-hidden />
      {label ? <span className="text-sm text-zinc-300">{label}</span> : <span className="sr-only">No</span>}
    </span>
  );
}
