/**
 * demo.ai-video.tsx
 *
 * Demo route for the Level 1 AI Video Classroom.
 * Access at: http://localhost:8081/demo/ai-video
 */

import { createFileRoute } from "@tanstack/react-router";
import { AIVideoClassroom } from "@/components/classroom/AIVideoClassroom";

export const Route = createFileRoute("/demo/ai-video")({
  component: AIVideoDemoPage,
});

function AIVideoDemoPage() {
  return <AIVideoClassroom autoPlay />;
}
