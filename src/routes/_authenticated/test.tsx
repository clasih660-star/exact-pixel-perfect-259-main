import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/test")({
  component: TestDashboard,
});

function TestDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[var(--gray-900)]">Test Dashboard</h1>
      <p className="text-[var(--gray-600)]">If you can see this, the routing works!</p>
      <div className="mt-4 rounded-lg border border-[var(--gray-200)] bg-[var(--gray-50)] p-4">
        <p>CSS variables test:</p>
        <p className="text-[var(--primary)]">Primary color test</p>
        <p className="text-[var(--gray-900)]">Gray 900 color test</p>
      </div>
    </div>
  );
}