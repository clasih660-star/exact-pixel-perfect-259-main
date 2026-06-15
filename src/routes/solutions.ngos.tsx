import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/solutions/ngos")({
  head: () => ({
    meta: [
      { title: "Klassruum for NGOs" },
      {
        name: "description",
        content:
          "Deliver quality, accessible education to underserved communities — even on low-cost devices and limited connectivity.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For NGOs"
      title="Quality teaching that reaches everyone"
      intro="Bring structured, accessible lessons to learners in underserved and remote communities. Klassruum is built to run on modest devices and patchy networks, with accessibility for learners who are too often left out."
      cta={{ label: "Start a programme", to: "/contact" }}
      sections={[
        {
          icon: "🌍",
          title: "Reaches remote learners",
          body: "Lightweight and browser-based, designed for low-cost hardware and limited bandwidth.",
        },
        {
          icon: "♿",
          title: "Inclusion at the core",
          body: "Modes for deaf, low-vision, dyslexia and more open lessons to learners with disabilities.",
        },
        {
          icon: "🗣️",
          title: "Local relevance",
          body: "Teach from materials and examples that fit the communities you serve.",
        },
        {
          icon: "📊",
          title: "Impact evidence",
          body: "Activity-based progress data helps demonstrate outcomes to funders.",
        },
        {
          icon: "🤝",
          title: "Train local facilitators",
          body: "Facilitators guide groups while the lesson does the structured teaching.",
        },
        {
          icon: "💛",
          title: "Mission-aligned pricing",
          body: "Flexible terms for non-profit and humanitarian programmes.",
        },
      ]}
    />
  ),
});
