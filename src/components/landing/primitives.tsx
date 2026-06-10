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
        "inline-flex items-center gap-2 rounded-[999px] border border-[#E2E8F0] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]",
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
    "inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
    size === "lg" ? "h-12 px-6 text-[15px]" : "h-11 px-5 text-sm",
    variant === "primary" &&
      "bg-[#2563EB] text-white shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:bg-[#1D4ED8] hover:shadow-[0_12px_32px_rgba(37,99,235,0.30)]",
    variant === "secondary" &&
      "border border-[#E2E8F0] bg-white text-[#0F172A] shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
    variant === "ghost" && "text-[#1D4ED8] hover:bg-[#EFF6FF]",
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
        "lp-lift rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:border-[#CBD5E1] hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]",
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
      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#2563EB]">
        {icon}
      </div>
      <h3 className="mt-5 text-[17px] font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{description}</p>
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
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <div className="text-[28px] font-bold tracking-tight text-[#0F172A]">{value}</div>
      <div className="mt-1 text-sm font-medium text-[#0F172A]">{label}</div>
      {hint ? <div className="mt-1 text-xs text-[#64748B]">{hint}</div> : null}
    </div>
  );
}

/* ── Inline check / cross used in lists and tables ────────────────── */
export function YesMark({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#16A34A]">
      <Check className="h-4 w-4" aria-hidden />
      {label ? <span className="text-sm text-[#475569]">{label}</span> : <span className="sr-only">Yes</span>}
    </span>
  );
}

export function NoMark({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
      <Minus className="h-4 w-4" aria-hidden />
      {label ? <span className="text-sm text-[#94A3B8]">{label}</span> : <span className="sr-only">No</span>}
    </span>
  );
}
