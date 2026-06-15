import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/solutions/training-providers")({
  head: () => ({
    meta: [
      { title: "Klassruum for Training Providers" },
      {
        name: "description",
        content:
          "Turn your courseware into interactive, teacher-led lessons for professional and vocational training — consistent and certifiable.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Training Providers"
      title="Consistent, engaging training at scale"
      intro="Convert your courseware into interactive, teacher-led lessons that every cohort experiences the same way. Ideal for professional, vocational and compliance training where consistency and completion matter."
      cta={{ label: "Request a walkthrough", to: "/contact" }}
      sections={[
        {
          icon: "📦",
          title: "Your content, taught",
          body: "Bring your existing material and let Klassruum deliver it as a structured, spoken lesson.",
        },
        {
          icon: "✅",
          title: "Consistent delivery",
          body: "Every trainee gets the same accurate, well-paced session — no variability between instructors.",
        },
        {
          icon: "🧩",
          title: "Practice & checks",
          body: "Built-in worked examples and understanding checks reinforce learning as it happens.",
        },
        {
          icon: "📜",
          title: "Completion evidence",
          body: "Track participation and practice to support certificates and compliance records.",
        },
        {
          icon: "♿",
          title: "Accessible to all staff",
          body: "Captions, audio and learning modes make training inclusive across your workforce.",
        },
        {
          icon: "⚡",
          title: "Fast to launch",
          body: "Stand up new courses quickly without rebuilding your delivery from scratch.",
        },
      ]}
    />
  ),
});
