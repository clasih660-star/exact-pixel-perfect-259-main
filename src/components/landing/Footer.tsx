import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { openCookieSettings } from "@/lib/cookie-consent";

type FooterLink =
  | { label: string; to: string; href?: undefined; onClick?: undefined }
  | { label: string; href: string; to?: undefined; onClick?: undefined }
  | { label: string; onClick: () => void; to?: undefined; href?: undefined };

export function Footer() {
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: "Platform",
      links: [
        { label: "AI Classroom", to: "/demo/classroom" },
        { label: "Smart Board", to: "/demo/classroom" },
        { label: "Accessibility", href: "#accessibility" },
        { label: "Pricing plans", href: "#pricing" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Schools", to: "/solutions/schools" },
        { label: "Universities", to: "/solutions/universities" },
        { label: "Training", to: "/solutions/training-providers" },
        { label: "NGOs", to: "/solutions/ngos" },
        { label: "Online Academies", to: "/solutions/online-academies" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help center", to: "/help" },
        { label: "Documentation", to: "/docs" },
        { label: "Blog", to: "/blog" },
        { label: "Contact sales", to: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy policy", to: "/privacy" },
        { label: "Terms of service", to: "/terms" },
        { label: "Cookie settings", onClick: openCookieSettings },
        { label: "Cookie policy", to: "/cookie-policy" },
      ],
    },
  ];

  return (
    <footer className="bg-dark-section text-white/60 py-16 lg:py-20 text-left relative z-10">
      <div className="container-editorial">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_repeat(4,1fr)] gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center mb-4" aria-label="Klassruum home">
              <Logo size={28} variant="light" />
            </Link>
            <p className="text-[13px] text-white/40 leading-relaxed max-w-[280px] mb-4">
              An AI-powered virtual classroom engine built for serious, accessible, and structured
              learning.
            </p>
            <div className="text-[11px] text-green-400 font-medium flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                aria-hidden="true"
              />
              <span>GDPR &amp; WCAG 2.2 compliant</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-2.5">
              <h4 className="text-[13px] font-semibold text-white mb-1">{col.title}</h4>
              <ul className="space-y-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} className="text-[13px]">
                    {link.to ? (
                      <Link
                        to={link.to as any}
                        className="text-white/40 hover:text-white/70 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : link.href ? (
                      <a
                        href={link.href}
                        className="text-white/40 hover:text-white/70 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={link.onClick}
                        className="text-white/40 hover:text-white/70 transition-colors border-none bg-none p-0 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-section rounded"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-white/30">
          <div>&copy; {new Date().getFullYear()} Klassruum Technologies. All rights reserved.</div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
            <button
              onClick={openCookieSettings}
              className="hover:text-white/50 transition-colors border-none bg-none p-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/30 rounded"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
