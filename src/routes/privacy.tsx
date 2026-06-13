import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/Footer";
import { Logo } from "@/components/brand/Logo";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Klassruum's privacy policy. How we collect, use, protect, and control learner and institution data on our AI-powered virtual classroom platform.",
      },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Privacy Policy — Klassruum" },
      { property: "og:description", content: "How Klassruum handles your data and privacy." },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PrivacyPolicy",
          name: "Klassruum Privacy Policy",
          url: `${SITE_URL}/privacy`,
        }),
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-[#475569]">
            <Link to="/terms" className="hover:text-[#1A5256]">Terms</Link>
            <Link to="/cookie-policy" className="hover:text-[#1A5256]">Cookies</Link>
            <Link to="/data-protection" className="hover:text-[#1A5256]">Data Protection</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1F7C80]">Legal</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A]">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[#64748B]">Last updated: June 2026</p>
        <p className="mt-6 text-lg leading-8 text-[#475569]">
          This Privacy Policy explains how Klassruum collects, uses, and protects information when institutions, teachers,
          learners, and visitors use our AI-powered virtual classroom platform.
        </p>

        <section className="mt-10 space-y-8">
          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">1. Information we collect</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              We collect information that institutions provide when registering, including institution name, administrator
              contact details, and teacher and learner account information. We also collect classroom activity data such as
              lessons started and completed, questions asked, notes generated, transcripts, and progress records.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">2. How we use information</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Information is used to provide and improve the platform, deliver lessons, generate transcripts and notes,
              track learner progress, and support institutions. We do not use learner data for advertising or sell
              personal information to third parties.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">3. Data ownership</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Institutions own their course content, classroom records, and learner data. Klassruum acts as a data
              processor on behalf of institutions. Institutions control access, retention, and deletion of their data.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">4. Data security</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              All data is encrypted in transit and at rest. We use role-based access controls, audit logging, and
              enterprise-grade cloud infrastructure. We conduct regular security reviews and maintain appropriate
              technical and organizational measures.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">5. Data retention</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Institutions configure retention policies according to their requirements. Data is retained for as long as
              the institution's account is active or as required by law. Institutions can request export or deletion of
              their data at any time.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">6. Cookies and storage</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              We use essential cookies for sign-in, session security, and accessibility preferences. Analytics cookies
              are used only to understand product performance. See our{" "}
              <Link to="/cookie-policy" className="text-[#1F7C80] hover:underline">Cookie Policy</Link> for details.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">7. Children's privacy</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              For K-12 deployments, institutions are responsible for obtaining necessary parental or guardian consent
              as required by applicable law. Klassruum supports institutional compliance with COPPA, FERPA, and
              equivalent regulations.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">8. Your rights</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Depending on your jurisdiction, you may have rights to access, correct, export, or delete your data.
              Contact your institution administrator or email us at privacy@klassruum.com to exercise these rights.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">9. Changes to this policy</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              We may update this policy from time to time. We will notify institutions of material changes by email
              or through the platform. Continued use after changes constitutes acceptance of the updated policy.
            </p>
          </article>

          <article className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#0F172A]">10. Contact</h2>
            <p className="mt-3 leading-7 text-[#475569]">
              Questions about this policy? Email us at privacy@klassruum.com or{" "}
              <Link to="/contact" className="text-[#1F7C80] hover:underline">contact us</Link>.
            </p>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
