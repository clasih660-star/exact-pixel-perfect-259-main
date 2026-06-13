/**
 * Header — sticky, translucent top navigation for the Klassruum landing page.
 * Includes the brand mark, primary nav, sign-in, a Try-Demo CTA, and an
 * accessible mobile menu.
 */

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CTAButton } from "./primitives";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Classroom", href: "#classroom" },
  { label: "For Schools", href: "#institutions" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-50 w-full border-b transition-colors duration-200 " +
        (scrolled
          ? "border-[#E2E8F0] bg-white/85 backdrop-blur-md"
          : "border-transparent bg-[#F8FAFC]/60 backdrop-blur-sm")
      }
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <Link to="/" className="flex items-center" aria-label="Klassruum home">
          <Logo size={34} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[10px] px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#EFF6FF] hover:text-[#1A5256]"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/pricing"
            className="rounded-[10px] px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#EFF6FF] hover:text-[#1A5256]"
          >
            Pricing
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/auth"
            className="rounded-[10px] px-3 py-2 text-sm font-semibold text-[#0F172A] transition-colors hover:text-[#1A5256]"
          >
            Sign in
          </Link>
          <CTAButton to="/demo/classroom" size="md">
            Try Demo
          </CTAButton>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-[#0F172A] hover:bg-[#EFF6FF] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-[#E2E8F0] bg-white lg:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-4 sm:px-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1A5256]"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="rounded-[10px] px-3 py-2.5 text-[15px] font-medium text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1A5256]"
            >
              Pricing
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-[#E2E8F0] pt-3">
              <CTAButton to="/auth" variant="secondary" size="md">
                Sign in
              </CTAButton>
              <CTAButton to="/demo/classroom" size="md">
                Try Demo Classroom
              </CTAButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
