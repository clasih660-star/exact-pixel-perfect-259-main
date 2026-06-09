import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/reset-password")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)]">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-[var(--gray-200)] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">Reset Password</h1>
        <p className="text-sm text-[var(--gray-600)]">This page is coming soon.</p>
        <div className="rounded-lg border border-dashed border-[var(--gray-300)] p-6 text-center">
          <p className="text-sm text-[var(--gray-400)]">Coming soon</p>
        </div>
        <div className="text-center text-sm text-[var(--gray-500)]">
          <Link to="/auth" className="text-[var(--primary)] hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  ),
});
