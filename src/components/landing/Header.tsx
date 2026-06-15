import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown, ChevronRight, Sparkles, Layout, Captions, Shield, Users, Building, School, Users2, Landmark, Target } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { openCookieSettings } from "@/lib/cookie-consent";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavSubItem {
  label: string;
  description: string;
  href: string;
  icon: any;
}

const PRODUCT_ITEMS: NavSubItem[] = [
  { label: "AI Teacher", description: "Structured lesson delivery with guided explanation", href: "/demo/classroom", icon: LogoMark },
  { label: "Smart Whiteboard", description: "Step-by-step board work for real classroom teaching", href: "/demo/classroom", icon: Layout },
  { label: "Live Captions", description: "Accessible delivery with captions, transcripts, and review", href: "/demo/classroom", icon: Captions },
  { label: "Session Intelligence", description: "Notes, checkpoints, and revision evidence captured automatically", href: "/demo/classroom", icon: Sparkles },
  { label: "Admin Dashboard", description: "Institution review, governance, and curriculum control", href: "/institutions/register", icon: Shield }
];

const SOLUTIONS_ITEMS: NavSubItem[] = [
  { label: "Schools", description: "Secondary and primary institution deployment", href: "/#use-cases", icon: School },
  { label: "Universities", description: "Higher education cohorts & lecture delivery", href: "/#use-cases", icon: Building },
  { label: "Tutoring Centers", description: "Individual learning paths & practice sets", href: "/#use-cases", icon: Users },
  { label: "Exam Preparation", description: "Curriculum checkpoints & mock assessments", href: "/#use-cases", icon: Target },
  { label: "NGOs", description: "Accessible remote training and community aid", href: "/#use-cases", icon: Landmark },
  { label: "Corporate Training", description: "Professional certification and upskilling", href: "/#use-cases", icon: Users2 }
];

export function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"product" | "solutions" | null>(null);
  const scrolled = scrollProgress > 0.02;

  useEffect(() => {
    const onScroll = () => setScrollProgress(Math.min(window.scrollY / 100, 1));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header transition-all duration-300 ${
        scrolled
          ? "border-b border-color-border bg-white shadow-sm"
          : "bg-transparent border-b-transparent shadow-none"
      }`}
      style={{ position: "fixed", width: "100%", top: 0, left: 0, right: 0 }}
    >
      <nav
        className="container navbar"
        aria-label="Primary navigation"
      >
        {/* Left Logo */}
        <Link
          to="/"
          className="brand"
          aria-label="Klassruum home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <LogoMark size={32} className="brand-logo" />
          <span>Klassruum</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links hidden lg:flex">
          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("product")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className="nav-link flex items-center gap-1 py-3 focus:outline-none"
              style={{ color: activeDropdown === "product" ? "var(--color-primary)" : "var(--color-text-secondary)" }}
            >
              Product <ChevronDown className="h-4 w-4" />
            </button>
            
            {activeDropdown === "product" && (
              <div 
                className="absolute top-[44px] left-1/2 -translate-x-1/2 w-[340px] rounded-xl border border-color-border bg-white p-4 shadow-xl animate-kr-pop"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-color-text-muted mb-1 px-2" style={{ color: "var(--color-text-muted)" }}>
                    Classroom Features
                  </div>
                  {PRODUCT_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href as any}
                      className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-color-surface-soft text-left"
                    >
                      <item.icon className="h-5 w-5 text-color-primary shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
                      <div>
                        <div className="text-sm font-bold text-color-text-primary" style={{ color: "var(--color-text-primary)" }}>{item.label}</div>
                        <div className="text-xs text-color-text-secondary mt-0.5 leading-snug" style={{ color: "var(--color-text-secondary)" }}>{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("solutions")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              className="nav-link flex items-center gap-1 py-3 focus:outline-none"
              style={{ color: activeDropdown === "solutions" ? "var(--color-primary)" : "var(--color-text-secondary)" }}
            >
              Solutions <ChevronDown className="h-4 w-4" />
            </button>

            {activeDropdown === "solutions" && (
              <div 
                className="absolute top-[44px] left-1/2 -translate-x-1/2 w-[380px] rounded-xl border border-color-border bg-white p-4 shadow-xl animate-kr-pop"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="grid grid-cols-1 gap-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-color-text-muted mb-1 px-2" style={{ color: "var(--color-text-muted)" }}>
                    Learning Environments
                  </div>
                  {SOLUTIONS_ITEMS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-color-surface-soft text-left"
                    >
                      <item.icon className="h-5 w-5 text-color-success shrink-0 mt-0.5" style={{ color: "var(--color-success)" }} />
                      <div>
                        <div className="text-sm font-bold text-color-text-primary" style={{ color: "var(--color-text-primary)" }}>{item.label}</div>
                        <div className="text-xs text-color-text-secondary mt-0.5 leading-snug" style={{ color: "var(--color-text-secondary)" }}>{item.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Regular Links */}
          <a href="#classroom" className="nav-link">
            Classroom
          </a>
          
          <a href="#accessibility" className="nav-link">
            Accessibility
          </a>

          <Link to="/pricing" className="nav-link">
            Plans
          </Link>

          <Link to="/docs" className="nav-link">
            Resources
          </Link>
        </div>

        {/* Right Desktop CTA */}
        <div className="nav-actions hidden lg:flex">
          <Link
            to="/auth"
            className="nav-link font-semibold"
          >
            Sign in
          </Link>
          <ThemeToggle />
          <Link
            to="/demo/classroom"
            className="btn btn-primary"
            style={{ minHeight: "44px", padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
          >
            Explore Classroom
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-color-border bg-white text-color-text-primary transition-colors hover:bg-color-surface-soft"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((v) => !v)}
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Full-Screen Layout) */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-[76px] bottom-0 z-40 bg-white border-t border-color-border/60 flex flex-col justify-between overflow-y-auto"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
            {/* Products Group */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-color-text-secondary px-3 mb-2" style={{ color: "var(--color-text-secondary)" }}>
                Product
              </div>
              <div className="grid grid-cols-1 gap-1">
                {PRODUCT_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href as any}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-semibold text-color-text-primary hover:bg-color-surface-soft"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-color-primary" style={{ color: "var(--color-primary)" }} />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-color-text-muted" style={{ color: "var(--color-text-muted)" }} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Solutions Group */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-color-text-secondary px-3 mb-2" style={{ color: "var(--color-text-secondary)" }}>
                Solutions
              </div>
              <div className="grid grid-cols-1 gap-1">
                {SOLUTIONS_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-semibold text-color-text-primary hover:bg-color-surface-soft"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-color-success" style={{ color: "var(--color-success)" }} />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-color-text-muted" style={{ color: "var(--color-text-muted)" }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Other Direct Links */}
            <div className="border-t border-color-border/60 pt-4 space-y-1" style={{ borderColor: "var(--color-border)" }}>
              <a
                href="#classroom"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-semibold text-color-text-primary hover:bg-color-surface-soft"
              >
                Classroom
                <ChevronRight className="h-4 w-4 text-color-text-muted" style={{ color: "var(--color-text-muted)" }} />
              </a>

              <a
                href="#accessibility"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-semibold text-color-text-primary hover:bg-color-surface-soft"
              >
                Accessibility
                <ChevronRight className="h-4 w-4 text-color-text-muted" style={{ color: "var(--color-text-muted)" }} />
              </a>

              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-semibold text-color-text-primary hover:bg-color-surface-soft"
              >
                Pricing
                <ChevronRight className="h-4 w-4 text-color-text-muted" style={{ color: "var(--color-text-muted)" }} />
              </Link>

              <Link
                to="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-semibold text-color-text-primary hover:bg-color-surface-soft"
              >
                Resources
                <ChevronRight className="h-4 w-4 text-color-text-muted" style={{ color: "var(--color-text-muted)" }} />
              </Link>
            </div>
          </div>

          {/* Bottom Fixed Action Panel */}
          <div className="border-t border-color-border/60 bg-color-surface-soft p-4 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-secondary w-full"
              style={{ minHeight: "48px" }}
            >
              Sign in
            </Link>
            <Link
              to="/demo/classroom"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary w-full"
              style={{ minHeight: "48px" }}
            >
              Explore Demo
            </Link>
            <div className="text-center">
              <button
                type="button"
                onClick={() => { openCookieSettings(); setMobileMenuOpen(false); }}
                className="text-[11px] font-bold text-color-text-secondary hover:text-color-text-primary"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Privacy & Cookies Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
