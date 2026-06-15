import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/webinars")({
  head: () => ({
    meta: [
      { title: "Webinars — Klassruum" },
      {
        name: "description",
        content:
          "Live and recorded sessions on getting the most out of Klassruum for your institution.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Webinars"
      title="Learn Klassruum, live"
      intro="Join our team for practical sessions on launching Klassruum, authoring great lessons, and making learning accessible — with time for your questions."
      cta={{ label: "Request an invite", to: "/contact" }}
      sections={[
        {
          icon: "🎬",
          title: "Getting started live",
          body: "A guided walkthrough of setting up your institution and first course.",
        },
        {
          icon: "✍️",
          title: "Authoring masterclass",
          body: "How to turn your materials into lessons that teach well.",
        },
        {
          icon: "♿",
          title: "Accessibility deep dive",
          body: "Configuring learning modes and inclusive settings for diverse cohorts.",
        },
      ]}
    >
      <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
        <p className="text-sm font-medium text-[#475569]">No sessions are scheduled just yet.</p>
        <p className="mt-1 text-sm text-[#64748B]">
          Tell us what you'd like covered and we'll invite you to the next one.
        </p>
      </div>
    </InfoPage>
  ),
});
