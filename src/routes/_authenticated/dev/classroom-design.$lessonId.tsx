import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dev/classroom-design/$lessonId")({
  component: () => (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      <h1 className="text-xl font-bold">Classroom Design</h1>
      <p className="mt-2 text-sm text-gray-500">Development / testing page.</p>
      <div className="mt-4 rounded border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
        Placeholder — use for dev testing only
      </div>
    </div>
  ),
});
