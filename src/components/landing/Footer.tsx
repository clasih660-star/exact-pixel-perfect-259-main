import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { openCookieSettings } from "@/lib/cookie-consent";
import { CheckCircle2 } from "lucide-react";

type FooterLink =
  | { label: string; to: string; href?: undefined; onClick?: undefined }
  | { label: string; href: string; to?: undefined; onClick?: undefined }
  | { label: string; onClick: () => void; to?: undefined; href?: undefined };

export function Footer() {
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: "Platform",
      links: [
        { label: "Classroom demo", to: "/demo/classroom" },
        { label: "Teaching engine", to: "/classroom" },
        { label: "Accessibility", href: "#accessibility" },
        { label: "Pricing", href: "#pricing" },
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
        { label: "Contact", to: "/contact" },
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
    <footer className="relative z-10 border-t border-slate-800 bg-[#07111f] py-14 text-left text-slate-400 lg:py-16">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-[minmax(260px,1.35fr)_minmax(0,2.65fr)]">
          <div className="max-w-sm">
            <Link to="/" className="mb-5 flex items-center" aria-label="Klassruum home">
              <Logo size={28} variant="light" />
            </Link>
            <p className="text-sm leading-7 text-slate-300">
              Structured AI classroom delivery for institutions that need consistent teaching,
              accessibility, and evidence of learning.
            </p>

            <div className="mt-6 grid gap-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#7dd3fc]" />
                GDPR-aligned workflows
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#7dd3fc]" />
                WCAG 2.2 accessibility practices
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {col.title}
                </h4>
                <ul className="grid gap-3" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.links.map((link) => (
                    <li key={link.label} className="text-sm">
                      {link.to ? (
                        <Link
                          to={link.to as any}
                          className="text-slate-300 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ) : link.href ? (
                        <a
                          href={link.href}
                          className="text-slate-300 transition-colors hover:text-white"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <button
                          onClick={link.onClick}
                          className="cursor-pointer border-none bg-transparent p-0 text-left text-sm text-slate-300 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
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
        </div>

        <div className="mt-12 border-y border-slate-800 py-5">
          <div className="grid gap-4 text-sm leading-6 text-slate-400 md:grid-cols-3">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Teaching model
              </span>
              Teacher-led sessions, board work, checks, notes, and transcripts.
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Institution control
              </span>
              Roles, materials, courses, reporting, and governance stay organized.
            </div>
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Learner access
              </span>
              Captions, readable board content, transcripts, and replay support.
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-xs text-slate-500 md:flex-row md:items-center">
          <div>&copy; {new Date().getFullYear()} Klassruum Technologies. All rights reserved.</div>
          <div className="flex flex-wrap gap-5">
            <Link to="/privacy" className="transition-colors hover:text-slate-300">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-slate-300">
              Terms
            </Link>
            <button
              onClick={openCookieSettings}
              className="cursor-pointer border-none bg-transparent p-0 transition-colors hover:text-slate-300 focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
