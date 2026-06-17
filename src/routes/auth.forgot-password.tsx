import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/forgot-password")({
  component: () => (
    <div className="auth-tech-page flex min-h-screen items-center justify-center px-6 py-12">
      <div className="auth-tech-panel w-full max-w-md space-y-6 p-8">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">Forgot Password</h1>
        <p className="text-sm text-[var(--gray-600)]">This page is coming soon.</p>
        <div className="rounded-lg border border-dashed border-[var(--gray-300)] p-6 text-center">
          <p className="text-sm text-[var(--gray-400)]">Coming soon</p>
        </div>
        <div className="text-center text-sm text-[var(--gray-500)]">
          <Link to="/auth" className="text-[var(--primary)] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  ),
});
