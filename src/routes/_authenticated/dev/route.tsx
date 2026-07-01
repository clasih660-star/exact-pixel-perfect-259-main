import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dev")({
  component: () => (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 p-2 text-xs text-yellow-800">
        ⚠️ Development-only routes — not shown in production navigation
      </div>
      <Outlet />
    </div>
  ),
});
