import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  // Track scroll position for nav background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
        toggleRef.current?.focus();
      }
    },
    [isMobileOpen],
  );

  // Trap focus within mobile menu when open
  useEffect(() => {
    if (!isMobileOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    previousBodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflowRef.current ?? "";
      previousBodyOverflowRef.current = null;
    };
  }, [isMobileOpen, handleKeyDown]);

  const navLinks = [
    { href: "#how-it-works", label: "Platform" },
    { href: "#solutions", label: "Solutions" },
    { href: "#accessibility", label: "Accessibility" },
    { href: "#institutions", label: "Institutions" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <nav
      className={`landing-nav ${scrolled ? "landing-nav--scrolled" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-editorial h-full flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" aria-label="Klassruum home">
          <Logo size={34} variant={scrolled ? "default" : "light"} />
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link-academic ${scrolled ? "" : "nav-link-academic--light"}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            to="/auth"
            className={`text-[13px] font-medium transition-colors ${
              scrolled ? "text-body hover:text-heading" : "text-white/70 hover:text-white"
            }`}
          >
            Sign in
          </Link>
          <Link
            to="/demo/classroom"
            className={`text-[13px] py-2 px-4 rounded-full font-medium transition-all ${
              scrolled
                ? "btn-primary-academic"
                : "bg-white text-navy hover:bg-white/90 shadow-lg hover:shadow-xl"
            }`}
          >
            Enter Classroom
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`md:hidden p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-learning-blue focus-visible:ring-offset-2 rounded-lg transition-colors ${
            scrolled ? "text-heading" : "text-white"
          }`}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="menu"
          className="absolute top-[72px] left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-border p-5 shadow-lg md:hidden flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setIsMobileOpen(false)}
              className="text-[15px] font-medium text-heading py-1 focus-visible:ring-2 focus-visible:ring-learning-blue focus-visible:ring-offset-2 rounded"
            >
              {link.label}
            </a>
          ))}
          <hr className="border-border" />
          <Link
            to="/auth"
            role="menuitem"
            onClick={() => setIsMobileOpen(false)}
            className="text-center py-2 font-medium text-heading text-[15px]"
          >
            Sign in
          </Link>
          <Link
            to="/demo/classroom"
            role="menuitem"
            onClick={() => setIsMobileOpen(false)}
            className="btn-primary-academic text-center w-full text-[13px]"
          >
            Enter Classroom
          </Link>
        </div>
      )}
    </nav>
  );
}
