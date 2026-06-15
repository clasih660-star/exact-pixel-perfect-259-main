import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Klassruum" },
      {
        name: "description",
        content:
          "Work with Klassruum — content, distribution, technology and impact partnerships to widen access to quality education.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Partners"
      title="Let's widen access to great teaching, together"
      intro="We partner with content creators, technology providers, governments and impact organisations to bring structured, accessible, teacher-led learning to more people."
      cta={{ label: "Become a partner", to: "/contact" }}
      sections={[
        {
          icon: "📚",
          title: "Content partners",
          body: "Publishers and educators who want their material taught well at scale.",
        },
        {
          icon: "🔌",
          title: "Technology partners",
          body: "Platforms and tools that integrate with the Klassruum classroom.",
        },
        {
          icon: "🏛️",
          title: "Government & policy",
          body: "Ministries and agencies expanding equitable access to education.",
        },
        {
          icon: "🤝",
          title: "Impact & NGO partners",
          body: "Organisations reaching underserved and remote communities.",
        },
        {
          icon: "🌐",
          title: "Distribution partners",
          body: "Resellers and regional partners bringing Klassruum to new markets.",
        },
        {
          icon: "💡",
          title: "Research partners",
          body: "Institutions studying accessible, AI-supported learning.",
        },
      ]}
    />
  ),
});
