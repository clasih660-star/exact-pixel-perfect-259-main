import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/student/classrooms")({
  component: () => (
    <RouteStubPage
      role="Student"
      title="My Classrooms"
      description="See the classrooms you can enter right now, with progress, current lesson, and a direct continue action."
      primary={{ label: "Back to dashboard", to: "/student/dashboard" }}
      secondary={{ label: "Open courses", to: "/student/courses" }}
      items={[
        {
          label: "Mathematics Form 2 Classroom",
          to: "/student/courses",
          description: "Demo Academy • Quadratic Equations • Continue learning",
        },
        {
          label: "KCSE Chemistry Revision",
          to: "/student/courses",
          description: "Demo Academy • Chemical Reactions • Study session ready",
        },
        {
          label: "English Speaking Practice",
          to: "/student/courses",
          description: "Demo Academy • Speaking drills • Focus mode supported",
        },
      ]}
    />
  ),
});
