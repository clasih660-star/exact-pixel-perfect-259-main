/**
 * InfoPage — a shared, branded layout for marketing / informational pages
 * (Solutions, Resources, Legal, Company). Keeps every secondary page visually
 * consistent with a header, hero, optional feature/section list and footer.
 */

import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/landing/Footer";

export interface InfoSection {
  title: string;
  body: string;
  icon?: string;
}

export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
  cta,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections?: InfoSection[];
  cta?: { label: string; to: string };
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link to="/features" className="hidden hover:text-[#1A5256] sm:inline">Features</Link>
            <Link to="/pricing" className="hidden hover:text-[#1A5256] sm:inline">Pricing</Link>
            <Link to="/demo/classroom" className="hidden hover:text-[#1A5256] sm:inline">Demo</Link>
            <Link
              to="/auth"
              className="rounded-lg bg-[#1F7C80] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#1A5256]"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1A5256]">
            {eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#475569]">{intro}</p>
          {cta && (
            <Link
              to={cta.to as never}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#1F7C80] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1A5256]"
            >
              {cta.label}
            </Link>
          )}
        </div>
      </section>

      {/* Sections */}
      {sections && sections.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {s.icon && <div className="text-2xl">{s.icon}</div>}
                <h3 className="mt-3 text-lg font-bold text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {children && (
        <section className="mx-auto max-w-[840px] px-5 py-12 sm:px-8">{children}</section>
      )}

      <Footer />
    </div>
  );
}
