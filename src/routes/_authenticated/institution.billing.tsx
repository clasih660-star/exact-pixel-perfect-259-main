import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("/_authenticated/institution/billing")({
  component: () => (
    <RouteStubPage
      role="Institution Admin"
      title="Billing"
      description="A route prepared for your institution's plan, invoices, and payment details."
      primary={{ label: "Institution dashboard", to: "/institution/dashboard" }}
      secondary={{ label: "Settings", to: "/institution/settings" }}
      items={[
        {
          label: "Current plan",
          to: "/institution/billing",
          description: "Your subscription tier and limits.",
        },
        {
          label: "Invoices",
          to: "/institution/billing",
          description: "Past and upcoming payments.",
        },
        {
          label: "Settings",
          to: "/institution/settings",
          description: "Manage institution-wide configuration.",
        },
      ]}
    />
  ),
});
