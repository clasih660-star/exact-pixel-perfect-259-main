import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/help")({
  component: () => (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="border-b border-[var(--gray-200)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[var(--gray-900)]">← Klassruum</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--gray-900)]">Help Center</h1>
        <p className="mt-4 text-lg text-[var(--gray-600)]">Guides, FAQs, and support resources.</p>
        <div className="mt-8 rounded-lg border border-dashed border-[var(--gray-300)] bg-white p-8 text-center">
          <p className="text-sm text-[var(--gray-400)]">This page is under construction.</p>
        </div>
      </main>
    </div>
  ),
});
