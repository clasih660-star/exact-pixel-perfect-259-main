import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/brand/Logo";
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Get in touch with the Klassruum team. Ask about demos, institutional plans, partnerships, or anything else — we'd love to hear from you.",
      },
      {
        name: "keywords",
        content:
          "contact Klassruum, get in touch, AI classroom demo, institutional pricing, partnership inquiry",
      },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Contact Us — Klassruum" },
      {
        property: "og:description",
        content:
          "Get in touch with the Klassruum team for demos, pricing, partnerships, or support.",
      },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Klassruum",
          url: `${SITE_URL}/contact`,
        }),
      },
    ],
  }),
  component: ContactPage,
});

const CONTACT_OPTIONS = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Email us",
    body: "hello@klassruum.com",
    description: "For general inquiries, demos, and partnership discussions.",
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Request a demo",
    body: "Book a walkthrough",
    description: "See Klassruum in action with a guided session for your team.",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Location",
    body: "Remote-first",
    description: "We work with institutions worldwide.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Response time",
    body: "Within 24 hours",
    description: "We aim to respond to all inquiries within one business day.",
  },
];

function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#475569]">
            <Link to="/features" className="hidden hover:text-[#1A5256] sm:inline">
              Features
            </Link>
            <Link to="/pricing" className="hidden hover:text-[#1A5256] sm:inline">
              Pricing
            </Link>
            <Link to="/demo/classroom" className="hidden hover:text-[#1A5256] sm:inline">
              Demo
            </Link>
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
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1A5256]">
            Contact
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#475569]">
            Whether you want a demo, have questions about pricing, or want to explore a partnership
            — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_OPTIONS.map((opt) => (
            <div
              key={opt.title}
              className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#1F7C80]">
                {opt.icon}
              </div>
              <h2 className="mt-4 text-[16px] font-semibold text-[#0F172A]">{opt.title}</h2>
              <p className="mt-1 text-[15px] font-medium text-[#1F7C80]">{opt.body}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{opt.description}</p>
            </div>
          ))}
        </div>

        {/* Contact form placeholder */}
        <div className="mt-16 rounded-[24px] border border-[#E2E8F0] bg-white p-8 shadow-[0_12px_32px_rgba(15,23,42,0.10)] sm:p-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Send us a message</h2>
              <p className="mt-3 leading-7 text-[#475569]">
                Tell us about your institution and what you're looking for. We'll get back to you
                within one business day.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  "Schools & universities looking to deploy AI classrooms",
                  "Tutoring centers wanting to scale with structured lessons",
                  "NGOs reaching underserved communities",
                  "Training providers turning courseware into lessons",
                  "Technology partners exploring integration",
                  "Anyone curious about how Klassruum works",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-[#475569]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1F7C80]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#0F172A]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1.5 w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#0F172A]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1.5 w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-[#0F172A]">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  className="mt-1.5 w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  placeholder="Your school, university, or organization"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#0F172A]">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1.5 w-full rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#1F7C80] focus:ring-2 focus:ring-[#1F7C80]/10"
                  placeholder="Tell us about your needs..."
                />
              </div>
              <button
                type="button"
                className="w-full rounded-[12px] bg-[#1F7C80] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.25)] transition-colors hover:bg-[#1A5256]"
              >
                Send message
              </button>
              <p className="text-xs text-[#94A3B8]">We'll respond within one business day.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
