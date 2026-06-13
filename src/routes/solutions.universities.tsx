import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/solutions/universities")({
  head: () => ({
    meta: [
      { title: "Klassruum for Universities" },
      { name: "description", content: "Scalable, accessible teaching for higher education — lectures, tutorials and labs delivered as structured, interactive lessons." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Universities"
      title="Lectures and tutorials that scale without losing the teacher"
      intro="Deliver large-cohort modules as structured, interactive lessons grounded in your faculty's own material — so students get consistent teaching, accessible content, and meaningful practice at any scale."
      cta={{ label: "Talk to our team", to: "/contact" }}
      sections={[
        { icon: "🎓", title: "Faculty-grounded", body: "Lessons teach from your approved course material, keeping academic accuracy and tone." },
        { icon: "👥", title: "Built for large cohorts", body: "Thousands of students get the same high-quality teaching and individual question support." },
        { icon: "🧪", title: "Lectures, tutorials, labs", body: "Model different session types — from concept lectures to worked tutorial problems." },
        { icon: "♿", title: "Accessibility compliance", body: "Captions, transcripts and learning modes help meet accessibility obligations out of the box." },
        { icon: "📊", title: "Engagement analytics", body: "Understand where cohorts struggle with activity-based evidence, not just exam scores." },
        { icon: "🔗", title: "Fits your stack", body: "Designed to complement your VLE and existing course delivery." },
      ]}
    />
  ),
});
