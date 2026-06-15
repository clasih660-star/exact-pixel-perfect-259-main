/** Shared landing page primitives. */

import { Link } from "@tanstack/react-router";
import { Check, Minus, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  id,
  theme = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  id?: string;
  theme?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "lp-reveal",
        align === "center" ? "mx-auto max-w-[860px] text-center" : "max-w-[660px] text-left",
        className,
      )}
      data-reveal
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className={cn(
          "font-bold tracking-normal",
          theme === "dark" ? "text-white" : "text-[#0F172A]",
          "text-[28px] leading-tight sm:text-[34px] md:text-[42px]",
          eyebrow ? "mt-4" : "",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-[16px] leading-8 md:text-[17px]",
            theme === "dark" ? "text-slate-300" : "text-slate-600",
            align === "center" ? "mx-auto" : "",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

type CTAVariant = "primary" | "secondary" | "ghost" | "dark";
type CTASize = "sm" | "md" | "lg";

function ctaClasses(variant: CTAVariant, size: CTASize, className?: string) {
  return cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-md border font-semibold no-underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-px",
    size === "lg" && "min-h-12 px-5 py-3 text-[15px]",
    size === "md" && "min-h-10 px-4 py-2 text-[14px]",
    size === "sm" && "min-h-9 px-3 py-1.5 text-[13px]",
    variant === "primary" &&
      "border-emerald-300 bg-emerald-300 text-slate-950 shadow-sm hover:border-emerald-200 hover:bg-emerald-200",
    variant === "secondary" &&
      "border-white/15 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]",
    variant === "ghost" &&
      "border-transparent bg-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white",
    variant === "dark" &&
      "border-slate-700 bg-slate-950 text-white hover:border-slate-500 hover:bg-slate-900",
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
  showArrow,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: CTAVariant;
  size?: CTASize;
  className?: string;
  ariaLabel?: string;
  showArrow?: boolean;
}) {
  const cls = ctaClasses(variant, size, className);
  const inner = (
    <>
      {children}
      {showArrow && <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );

  if (to)
    return (
      <Link to={to as never} className={cls} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </Link>
    );
  if (href)
    return (
      <a href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

export function SurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
  theme?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-sm shadow-black/10 transition-colors duration-200 hover:border-emerald-300/30 hover:bg-slate-900/80",
        className,
      )}
      data-reveal
    >
      <div className="relative text-white">{children}</div>
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  theme?: "dark" | "light";
}) {
  return (
    <SurfaceCard className="h-full">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-300/10 text-emerald-300">
        {icon}
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-white transition-colors group-hover:text-emerald-200">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-slate-400">{description}</p>
    </SurfaceCard>
  );
}

export function StatCard({ value, label, hint }: { value: string; label: string; hint?: string }) {
  return (
    <div className="group relative rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors duration-200 hover:border-emerald-300/30">
      <div className="text-[26px] font-bold tracking-normal text-white transition-colors group-hover:text-emerald-200 sm:text-[32px]">{value}</div>
      <div className="mt-1 text-xs font-semibold text-slate-300 sm:text-sm">{label}</div>
      {hint ? <div className="mt-1 text-[11px] text-slate-400">{hint}</div> : null}
    </div>
  );
}

export function YesMark({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-emerald-300">
      <Check className="h-4 w-4" aria-hidden />
      {label ? (
        <span className="text-sm text-slate-300">{label}</span>
      ) : (
        <span className="sr-only">Yes</span>
      )}
    </span>
  );
}

export function NoMark({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-500">
      <Minus className="h-4 w-4" aria-hidden />
      {label ? (
        <span className="text-sm text-slate-400">{label}</span>
      ) : (
        <span className="sr-only">No</span>
      )}
    </span>
  );
}
