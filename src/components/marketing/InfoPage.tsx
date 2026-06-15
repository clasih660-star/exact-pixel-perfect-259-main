/**
 * InfoPage — a shared, branded layout for marketing / informational pages
 * (Solutions, Resources, Legal, Company). Keeps every secondary page visually
 * consistent with a header, hero, optional feature/section list and footer.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/landing/Footer";
import { CTAButton } from "@/components/landing/primitives";
import { CinematicCursor } from "@/components/landing/CinematicCursor";
import { InteractionLayer } from "@/components/landing/InteractionLayer";
import "@/styles/landing.css";

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
  const proofPoints = ["Institution-ready", "Accessible by design", "AI teacher workflow"];

  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f7fbfc_0%,#ffffff_22%,#f7fbfc_68%,#eef6f7_100%)] text-[#0F172A]">
      <CinematicCursor />
      <InteractionLayer />
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCE7EC] bg-white/84 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1760px] items-center justify-between px-5 sm:px-8 xl:px-12">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7C80] focus-visible:ring-offset-2"
          >
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link
              to="/features"
              className="hidden transition-colors hover:text-[#1A5256] sm:inline"
            >
              Features
            </Link>
            <Link to="/pricing" className="hidden transition-colors hover:text-[#1A5256] sm:inline">
              Pricing
            </Link>
            <Link
              to="/demo/classroom"
              className="hidden transition-colors hover:text-[#1A5256] sm:inline"
            >
              Demo
            </Link>
            <CTAButton to="/auth" size="md" className="h-10 px-4">
              Get started
            </CTAButton>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate border-b border-white/70">
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,#F7FBFC_0%,#FFFFFF_62%,#F2F8F8_100%)]"
          aria-hidden
        />
        <div className="lp-grid-glow absolute inset-x-0 top-0 h-[520px] opacity-60" aria-hidden />
        <div
          className="lp-blob lp-aurora-blob -left-28 -top-28 h-[360px] w-[360px] bg-[#A3D9D8]"
          aria-hidden
        />
        <div
          className="lp-blob lp-aurora-blob right-[-120px] top-4 h-[420px] w-[420px] bg-[#C7D2FE] [animation-delay:-8s]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-[1760px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 xl:px-12 lg:grid-cols-[1fr_390px]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1A5256] shadow-[0_12px_32px_rgba(31,124,128,0.10)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> {eyebrow}
            </span>
            <h1 className="mt-5 max-w-4xl text-[42px] font-black leading-[1.02] tracking-[-0.045em] text-[#0A1F22] sm:text-6xl lg:text-[68px]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-[1.75] text-[#475569] sm:text-xl">
              {intro}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/75 px-3.5 py-2 text-sm font-semibold text-[#334155] shadow-sm backdrop-blur"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#1F7C80]" aria-hidden />
                  {point}
                </span>
              ))}
            </div>

            {cta && (
              <CTAButton
                to={cta.to as never}
                size="lg"
                showArrow
                className="mt-9"
              >
                {cta.label}
              </CTAButton>
            )}
          </div>

          <aside className="relative hidden lg:block lp-reveal" aria-label="Klassruum platform highlights" data-reveal>
            <div
              className="absolute -inset-6 rounded-[36px] bg-[linear-gradient(135deg,rgba(31,124,128,0.18),rgba(99,102,241,0.10),rgba(14,165,233,0.14))] blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/78 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.15)] ring-1 ring-slate-950/[0.04] backdrop-blur-xl lp-magnetic lp-parallax" data-magnetic data-magnetic-strength="14" data-parallax="0.18">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F7C80]">
                    Live workspace
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">Voice, board, captions, notes</p>
                </div>
                <span className="rounded-full bg-[#E8F5F5] px-3 py-1 text-xs font-bold text-[#1A5256]">
                  Online
                </span>
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200/80 bg-[#081116] p-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-[#5EEAD4] shadow-[0_0_0_5px_rgba(94,234,212,0.13)]" />
                  AI teacher explaining
                </div>
                <div className="mt-4 rounded-xl bg-white p-4 text-[#0F172A]">
                  <p className="font-[Caveat,cursive] text-2xl font-bold text-[#1F7C80]">
                    x² + 5x + 6 = 0
                  </p>
                  <p className="mt-2 text-sm text-[#475569]">
                    Factor, explain, caption, and save every step.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  ["68%", "progress"],
                  ["14", "notes"],
                  ["2", "questions"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200/70 bg-white/80 p-3"
                  >
                    <div className="text-lg font-black text-[#0A1F22]">{value}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Sections */}
      {sections && sections.length > 0 && (
        <section className="relative mx-auto max-w-[1760px] px-5 py-16 sm:px-8 xl:px-12 lg:py-20">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s, index) => (
              <div
                key={s.title}
                className="lp-lift lp-premium-card lp-reveal lp-magnetic rounded-[24px] border border-white/70 bg-white/82 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.07)] ring-1 ring-slate-950/[0.03] backdrop-blur transition-all hover:border-teal-200/80 hover:shadow-[0_24px_64px_rgba(15,23,42,0.11)]"
                style={{ animationDelay: `${index * 45}ms` }}
                data-reveal
                data-magnetic
              >
                {s.icon && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#E8F5F5,#FFFFFF)] text-2xl shadow-inner ring-1 ring-teal-100">
                    {s.icon}
                  </div>
                )}
                <h3 className="mt-5 text-xl font-extrabold tracking-tight text-[#0A1F22]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {children && (
        <section className="mx-auto max-w-[1120px] px-5 py-12 sm:px-8">{children}</section>
      )}

      <Footer />
    </div>
  );
}
