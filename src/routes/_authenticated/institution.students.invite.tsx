import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/students/invite")({
  component: () => (
    <RouteStubPage
      role="Institution Admin"
      title="Invite Students"
      description="A route prepared for inviting learners individually or in bulk to your institution."
      primary={{ label: "Students", to: "/institution/students" }}
      secondary={{ label: "Enrollments", to: "/institution/enrollments" }}
      items={[
        {
          label: "All students",
          to: "/institution/students",
          description: "Browse learners already in your institution.",
        },
        {
          label: "Enrollments",
          to: "/institution/enrollments",
          description: "Manage course enrollments and pending invites.",
        },
        {
          label: "Courses",
          to: "/institution/courses",
          description: "Pick a course to enroll invited students into.",
        },
      ]}
    />
  ),
});
