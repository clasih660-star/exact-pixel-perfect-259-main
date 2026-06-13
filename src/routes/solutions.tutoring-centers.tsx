import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/solutions/tutoring-centers")({
  head: () => ({
    meta: [
      { title: "Klassruum for Tutoring Centers" },
      { name: "description", content: "Extend your tutors' reach with consistent, branded, one-to-one style lessons that adapt to each student." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Tutoring Centers"
      title="Give every student a patient, one-to-one lesson"
      intro="Scale the personal attention your tutors are known for. Klassruum teaches each student step by step, answers their questions, and adapts the pace — so your centre can serve more learners without diluting quality."
      cta={{ label: "Partner with us", to: "/contact" }}
      sections={[
        { icon: "🎯", title: "Adapts to each learner", body: "Pace, examples and hints adjust to the student in front of the screen." },
        { icon: "🕒", title: "Available any hour", body: "Students can revise and practise outside session times, with the same teaching quality." },
        { icon: "🏷️", title: "Your brand", body: "Deliver lessons under your centre's identity and curriculum." },
        { icon: "📈", title: "Progress you can show", body: "Share clear activity and practice evidence with parents and students." },
        { icon: "💬", title: "Question support", body: "Students ask freely and get grounded, on-topic answers — never left stuck." },
        { icon: "💸", title: "Better economics", body: "Reach more students per tutor while keeping outcomes high." },
      ]}
    />
  ),
});
