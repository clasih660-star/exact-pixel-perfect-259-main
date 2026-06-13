/**
 * Footer — site footer with product/solution/resource/company/legal columns and
 * the Klassruum positioning statement.
 */

import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

type FooterLink = { label: string; to?: string; href?: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Classroom", to: "/classroom" },
      { label: "Accessibility", to: "/accessibility" },
      { label: "Pricing", to: "/pricing" },
      { label: "Demo", to: "/demo/classroom" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Schools", to: "/solutions/schools" },
      { label: "For Universities", to: "/solutions/universities" },
      { label: "For Tutoring Centers", to: "/solutions/tutoring-centers" },
      { label: "For NGOs", to: "/solutions/ngos" },
      { label: "For Training Providers", to: "/solutions/training-providers" },
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
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Partners", to: "/partners" },
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
  const cls = "text-sm text-[#475569] transition-colors hover:text-[#1A5256]";
  if (link.to) {
    return (
      <Link to={link.to as never} className={cls}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.href} className={cls}>
      {link.label}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand + statement */}
          <div className="col-span-2 lg:col-span-1">
            <Logo size={34} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#64748B]">
              Klassruum is an AI-powered virtual classroom platform that helps institutions deliver structured,
              accessible, teacher-led learning experiences.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#0F172A]">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#E2E8F0] pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-[#64748B]">© {new Date().getFullYear()} Klassruum. All rights reserved.</p>
          <p className="text-sm text-[#64748B]">Built for schools, universities, tutors, NGOs &amp; training providers.</p>
        </div>
      </div>
    </footer>
  );
}
