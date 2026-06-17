import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { BookOpen, Plug, Landmark, Handshake, Globe, Lightbulb } from "lucide-react";

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
          icon: <BookOpen size={20} />,
          title: "Content partners",
          body: "Publishers and educators who want their material taught well at scale.",
        },
        {
          icon: <Plug size={20} />,
          title: "Technology partners",
          body: "Platforms and tools that integrate with the Klassruum classroom.",
        },
        {
          icon: <Landmark size={20} />,
          title: "Government & policy",
          body: "Ministries and agencies expanding equitable access to education.",
        },
        {
          icon: <Handshake size={20} />,
          title: "Impact & NGO partners",
          body: "Organisations reaching underserved and remote communities.",
        },
        {
          icon: <Globe size={20} />,
          title: "Distribution partners",
          body: "Resellers and regional partners bringing Klassruum to new markets.",
        },
        {
          icon: <Lightbulb size={20} />,
          title: "Research partners",
          body: "Institutions studying accessible, AI-supported learning.",
        },
      ]}
    />
  ),
});
