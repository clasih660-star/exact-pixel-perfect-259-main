import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/brand/Logo";
import { openCookieSettings } from "@/lib/cookie-consent";

type FooterLink = { label: string; to?: string; href?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/#features" },
      { label: "Classroom", to: "/#classroom" },
      { label: "Accessibility", to: "/#accessibility" },
      { label: "Pricing", to: "/pricing" },
      { label: "Demo Classroom", to: "/demo/classroom" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Schools", to: "/#use-cases" },
      { label: "For Universities", to: "/#use-cases" },
      { label: "For Tutoring Centers", to: "/#use-cases" },
      { label: "For NGOs", to: "/#use-cases" },
      { label: "For Corporate Training", to: "/#use-cases" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", to: "/help" },
      { label: "Documentation", to: "/docs" },
      { label: "Blog", to: "/blog" },
      { label: "Webinars", to: "/webinars" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact Sales", to: "/contact" },
      { label: "Partners Program", to: "/partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookie-policy" },
      { label: "Data Protection", to: "/data-protection" },
    ],
  },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <Link to={link.to as any} className="footer-link">
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Banner panel inside footer */}
        <div className="footer-banner mb-12 rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-2xl text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-color-green-500" style={{ color: "var(--color-green-500)" }}>
                Institution-Ready Classroom Delivery
              </p>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl font-headings" style={{ color: "var(--color-white)" }}>
                Structured AI teaching with the governance, accessibility, and trust institutions expect.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-300" style={{ color: "rgba(255, 255, 255, 0.72)" }}>
                Klassruum helps institutions move from static content and fragmented tools to guided classroom delivery with learner evidence, accessibility controls, and administrator oversight.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                {[
                  "Structured classroom teaching",
                  "Accessibility from lesson one",
                  "Governance and evidence built in",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 text-slate-300"
                    style={{ color: "rgba(255, 255, 255, 0.72)" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-color-green-500" style={{ backgroundColor: "var(--color-green-500)" }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:min-w-[320px] shrink-0">
              <Link
                to="/demo/classroom"
                className="btn btn-primary"
                style={{ minHeight: "46px" }}
              >
                Explore demo classroom
              </Link>
              <Link
                to="/institutions/register"
                className="btn btn-secondary bg-white/5 text-white border-white/10 hover:bg-white/10"
                style={{ minHeight: "46px", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "var(--color-white)" }}
              >
                Register institution
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          {/* Brand + statement */}
          <div className="footer-brand">
            <div className="flex items-center gap-2">
              <LogoMark size={28} className="brand-logo text-color-primary" style={{ color: "var(--color-primary)" }} />
              <span className="text-lg font-headings font-bold text-white">Klassruum</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-300" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              Klassruum is an AI-powered virtual classroom platform that helps institutions deliver
              structured, accessible, teacher-led learning experiences with governance and measurable learner progress.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-color-green-500" style={{ color: "var(--color-green-500)" }}>
              <span className="h-2 w-2 rounded-full bg-color-green-500 animate-pulse" style={{ backgroundColor: "var(--color-green-500)" }} />
              GDPR & WCAG 2.2 compliant
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="footer-column">
              <h3>{col.title}</h3>
              <div className="footer-links">
                {col.links.map((link) => (
                  <FooterAnchor key={link.label} link={link} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
          <div>
            <p className="text-xs text-slate-300" style={{ color: "rgba(255, 255, 255, 0.62)" }}>© {new Date().getFullYear()} Klassruum. All rights reserved.</p>
            <p className="mt-1 text-xs text-slate-400" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
              Built for schools, universities, tutors, NGOs &amp; training providers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={openCookieSettings}
              className="inline-flex items-center justify-center text-xs font-bold text-slate-300 transition-colors hover:text-white"
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255, 255, 255, 0.62)" }}
            >
              Cookie settings
            </button>
            <Link
              to="/cookie-policy"
              className="text-xs font-bold text-color-green-500 hover:text-color-primary transition-colors text-decoration-none"
              style={{ color: "var(--color-green-500)" }}
            >
              Review cookie policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
