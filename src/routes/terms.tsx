import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/brand/Logo";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Klassruum's terms of service. Read the terms and conditions for using the Klassruum AI-powered virtual classroom platform.",
      },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Terms of Service — Klassruum" },
      {
        property: "og:description",
        content: "Terms and conditions for using the Klassruum platform.",
      },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Klassruum Terms of Service",
          url: `${SITE_URL}/terms`,
        }),
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[#475569]">
            <Link to="/privacy" className="hover:text-[#1A5256]">
              Privacy
            </Link>
            <Link to="/cookie-policy" className="hover:text-[#1A5256]">
              Cookies
            </Link>
            <Link to="/data-protection" className="hover:text-[#1A5256]">
              Data Protection
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1F7C80]">Legal</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A]">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[#64748B]">Last updated: June 2026</p>
        <p className="mt-6 text-lg leading-8 text-[#475569]">
          These Terms of Service govern your use of the Klassruum platform. By using Klassruum, you
          agree to these terms.
        </p>

        <section className="mt-10 space-y-8">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">1. Acceptance of terms</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              By accessing or using Klassruum, you agree to be bound by these Terms of Service. If
              you are using Klassruum on behalf of an institution, you represent that you have
              authority to bind that institution.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">2. Description of service</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Klassruum is an AI-powered virtual classroom platform. Institutions upload course
              materials, generate structured lessons, and deliver those lessons through an AI
              teacher with interactive whiteboard, voice, captions, notes, transcripts, and progress
              tracking.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">3. Accounts and access</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Institutions register an administrator account, which is used to manage teachers and
              learners. Each user is responsible for maintaining the confidentiality of their
              account credentials. Institutions are responsible for all activity under their
              accounts.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">4. Content ownership</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Institutions retain ownership of all course materials, content, and classroom records
              they create or upload to Klassruum. Klassruum does not claim ownership of
              institutional content.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">5. Acceptable use</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              You agree to use Klassruum only for lawful educational purposes. You will not upload
              harmful content, attempt to breach security measures, or use the platform in ways that
              could damage or impair its functionality.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">6. AI-generated content</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Lessons, notes, and transcripts generated by the AI teacher are based on the
              institution's uploaded materials. Institutions should review AI-generated content
              before publishing. Klassruum does not guarantee the accuracy of AI-generated material.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">7. Payment and billing</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              The demo classroom is free. Institutional plans are billed per institution per year as
              agreed at the time of purchase. All fees are non-refundable unless otherwise stated.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">8. Limitation of liability</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Klassruum is provided "as is" without warranties of any kind. We are not liable for
              indirect, incidental, or consequential damages. Our total liability shall not exceed
              the fees paid in the twelve months preceding the claim.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">9. Termination</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Either party may terminate the agreement with written notice. Upon termination,
              institutions can export their data within 30 days. After that period, data may be
              deleted in accordance with our retention policies.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">10. Changes to these terms</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              We may update these terms from time to time. We will notify institutions of material
              changes. Continued use after changes constitutes acceptance of the updated terms.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">11. Contact</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Questions about these terms?{" "}
              <Link to="/contact" className="text-[#1F7C80] hover:underline">
                Contact us
              </Link>
              .
            </p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
