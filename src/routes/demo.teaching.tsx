/**
 * demo.teaching.tsx
 *
 * Demo page showcasing the real-teacher teaching flow.
 * Teaches quadratic equations using the pattern:
 *   Write → Read → Explain → Warn → Check → Next
 *
 * Visit: /demo/teaching
 */

import { createFileRoute } from "@tanstack/react-router";
import { TeachingFlowUI } from "@/components/classroom/TeachingFlowUI";

export const Route = createFileRoute("/demo/teaching")({
  component: DemoTeachingPage,
});

function DemoTeachingPage() {
  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <TeachingFlowUI autoPlay={true} />
    </div>
  );
}