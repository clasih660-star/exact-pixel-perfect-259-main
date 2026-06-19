import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/brand/Logo";
import { Mail, MessageSquare, MapPin, Clock, Send } from "lucide-react";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Get in touch with the Klassruum team. Ask about demos, institutional plans, partnerships, or anything else.",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Contact Us — Klassruum" },
      { property: "og:url", content: `${SITE_URL}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would POST to an API endpoint
    console.log("Contact form submitted:", { name, email, institution, message });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-page-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-soft-green flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8 text-education-green" />
          </div>
          <h1 className="text-2xl font-bold text-heading mb-3">Message sent!</h1>
          <p className="text-body leading-relaxed mb-6">
            Thank you for reaching out. We'll get back to you within one business day.
          </p>
          <Link to="/" className="btn-primary-academic text-sm inline-flex">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-background">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={30} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-body">
            <Link to="/features" className="hidden hover:text-heading sm:inline">
              Features
            </Link>
            <Link to="/pricing" className="hidden hover:text-heading sm:inline">
              Pricing
            </Link>
            <Link to="/demo/classroom" className="hidden hover:text-heading sm:inline">
              Demo
            </Link>
            <Link to="/auth" className="btn-primary-academic text-sm px-4 py-2">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-page-background-alt">
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <span className="inline-flex items-center rounded-full bg-soft-blue px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted">
            Contact
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-heading sm:text-5xl">
            Get in touch
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-body">
            Whether you want a demo, have questions about pricing, or want to explore a partnership
            — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact options */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_OPTIONS.map((opt) => (
            <div key={opt.title} className="rounded-xl border border-border bg-white p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft-blue text-academic-blue">
                {opt.icon}
              </div>
              <h2 className="mt-4 text-base font-semibold text-heading">{opt.title}</h2>
              <p className="mt-1 text-[15px] font-medium text-academic-blue">{opt.body}</p>
              <p className="mt-2 text-sm leading-relaxed text-body">{opt.description}</p>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="mt-16 rounded-2xl border border-border bg-white p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-heading">Send us a message</h2>
              <p className="mt-3 leading-7 text-body">
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
                  <div key={item} className="flex items-start gap-2.5 text-sm text-body">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-academic-blue" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-heading">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-page-background px-4 py-3 text-sm text-heading outline-none transition-colors focus:border-heading focus:ring-2 focus:ring-heading/10"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-heading">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-xl border border-border bg-page-background px-4 py-3 text-sm text-heading outline-none transition-colors focus:border-heading focus:ring-2 focus:ring-heading/10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-heading">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-page-background px-4 py-3 text-sm text-heading outline-none transition-colors focus:border-heading focus:ring-2 focus:ring-heading/10"
                  placeholder="Your school, university, or organization"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-heading">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-1.5 w-full rounded-xl border border-border bg-page-background px-4 py-3 text-sm text-heading outline-none transition-colors focus:border-heading focus:ring-2 focus:ring-heading/10"
                  placeholder="Tell us about your needs..."
                />
              </div>
              <button type="submit" className="btn-primary-academic w-full py-3 text-[15px]">
                Send message
              </button>
              <p className="text-xs text-muted">We'll respond within one business day.</p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
