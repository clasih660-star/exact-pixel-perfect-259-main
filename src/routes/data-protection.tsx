import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/data-protection")({
  head: () => ({
    meta: [
      { title: "Data Protection - Klassruum" },
      {
        name: "description",
        content: "Klassruum data protection commitments for institutions, teachers, learners and families.",
      },
    ],
  }),
  component: DataProtectionPage,
});

function DataProtectionPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="border-b border-[#E2E8F0] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[#0F172A]">
            Klassruum
          </Link>
          <Link to="/contact" className="text-sm font-semibold text-[#1F7C80]">
            Contact us
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1F7C80]">Legal</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A]">Data Protection</h1>
        <p className="mt-4 text-lg leading-8 text-[#475569]">
          Klassruum is designed for schools and institutions that need clear control over learner records, classroom
          activity, transcripts, notes and lesson evidence.
        </p>

        <section className="mt-10 grid gap-5">
          {[
            {
              title: "Institution control",
              body: "Institutions manage courses, users and classroom records according to their own responsibilities and policies.",
            },
            {
              title: "Purpose-limited records",
              body: "Learning data should be used to support teaching, accessibility, progress review and safeguarding of the classroom experience.",
            },
            {
              title: "Access and permissions",
              body: "Teachers, learners, administrators and guardians should only see the information needed for their role.",
            },
            {
              title: "Retention and deletion",
              body: "Deployment teams should configure retention, export and deletion workflows to match institutional requirements.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#0F172A]">{item.title}</h2>
              <p className="mt-2 leading-7 text-[#475569]">{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
