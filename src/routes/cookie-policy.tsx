import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: [
      { title: "Cookie Policy - Klassruum" },
      {
        name: "description",
        content:
          "How Klassruum uses essential, preference and analytics cookies to run a secure learning platform.",
      },
    ],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-page-background">
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-heading">
            Klassruum
          </Link>
          <Link to="/privacy" className="text-sm font-semibold text-academic-blue">
            Privacy Policy
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-wider text-muted">Legal</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-heading">Cookie Policy</h1>
        <p className="mt-4 text-lg leading-8 text-body">
          Klassruum uses cookies and similar browser storage only where they help keep the platform
          secure, remember learner preferences, and understand product reliability.
        </p>

        <section className="mt-10 grid gap-5">
          {[
            {
              title: "Essential cookies",
              body: "Used for sign-in, session security, routing, accessibility preferences and classroom continuity.",
            },
            {
              title: "Preference storage",
              body: "Used to remember settings such as captions, learning mode, text size and focus preferences.",
            },
            {
              title: "Analytics and diagnostics",
              body: "Used only to understand page performance, errors and adoption of learning features. These should not be used for advertising profiles.",
            },
            {
              title: "Your choices",
              body: "You can manage browser cookies in your browser settings. Some essential classroom features may not work if required storage is blocked.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-white p-6">
              <h2 className="text-xl font-bold text-heading">{item.title}</h2>
              <p className="mt-2 leading-7 text-body">{item.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
