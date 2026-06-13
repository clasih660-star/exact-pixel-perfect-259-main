import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Klassruum" },
      { name: "description", content: "Ideas on accessible, teacher-led learning, classroom technology and education for everyone." },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Blog"
      title="Notes on teaching, technology and inclusion"
      intro="Perspectives from the Klassruum team on building classrooms that teach like real teachers, reaching learners everyone else leaves behind, and what accessible education really takes."
      sections={[
        { icon: "🧑‍🏫", title: "Teaching that feels human", body: "Why structured, spoken, board-led lessons beat walls of text — and how we build them." },
        { icon: "♿", title: "Designing for every learner", body: "Lessons on accessibility that goes deeper than colour contrast and captions." },
        { icon: "🌍", title: "Education without barriers", body: "Reaching learners on modest devices and limited connectivity, from grade one to tertiary." },
      ]}
    >
      <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
        <p className="text-sm font-medium text-[#475569]">Our first articles are on the way.</p>
        <p className="mt-1 text-sm text-[#64748B]">Check back soon, or reach out if you'd like to hear when we publish.</p>
      </div>
    </InfoPage>
  ),
});
