import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, BarChart3, BookOpen, Captions, MessagesSquare, Presentation } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Klassruum Features | AI Classroom, Accessibility, Reporting and Whiteboard Teaching" },
      {
        name: "description",
        content:
          "Explore Klassruum features including AI classroom delivery, interactive teaching board, captions, transcripts, learner questions, lesson grounding, and institutional reporting.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Platform features"
      title="The tools that make Klassruum feel like teaching"
      intro="Klassruum combines AI lesson delivery, classroom-style explanation, accessibility tools, and institutional visibility in one browser-based teaching environment."
      cta={{ label: "See pricing", to: "/pricing" }}
      sections={[
        {
          icon: <Presentation size={20} />,
          title: "AI classroom delivery",
          body: "The platform leads lessons in a guided sequence so students are not left alone in an open-ended prompt flow.",
        },
        {
          icon: <BookOpen size={20} />,
          title: "Grounded lesson materials",
          body: "Course content can be taught from approved resources to keep explanations aligned to the institution's own material.",
        },
        {
          icon: <MessagesSquare size={20} />,
          title: "Learner clarification during the lesson",
          body: "Students can ask questions in context without breaking the rhythm of the session or leaving the learning flow.",
        },
        {
          icon: <Captions size={20} />,
          title: "Captions and transcripts",
          body: "Text support makes lessons easier to follow live and easier to review afterwards.",
        },
        {
          icon: <Accessibility size={20} />,
          title: "Accessibility-aware presentation",
          body: "Different delivery modes help support learners with varied reading, vision, motor, or processing needs.",
        },
        {
          icon: <BarChart3 size={20} />,
          title: "Institution reporting",
          body: "Teachers and admins can review progress, participation, and lesson evidence without creating a separate admin burden.",
        },
      ]}
    >
      <section className="grid gap-6 xl:grid-cols-3">
        <div className="lp-premium-card p-6 xl:col-span-2">
          <h2 className="text-heading text-2xl font-extrabold">Feature areas that matter in practice</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Virtual whiteboard", "Explain visually with equations, steps, and worked examples during live lesson delivery."],
              ["Lesson progression", "Move from explanation to checks for understanding with a clearer instructional rhythm."],
              ["Teacher oversight", "Review what learners did, what they asked, and where follow-up teaching is needed."],
              ["Browser-based access", "Deploy through the web without depending on specialist classroom hardware."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-border bg-page-background-alt p-5">
                <h3 className="text-heading text-lg font-bold">{title}</h3>
                <p className="text-body mt-2 text-sm leading-7">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-premium-card p-6">
          <h2 className="text-heading text-2xl font-extrabold">Best suited for</h2>
          <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
            <li>Online classrooms</li>
            <li>Blended learning teams</li>
            <li>Institutions scaling teaching quality</li>
            <li>Accessibility-conscious delivery</li>
            <li>Programmes needing clearer evidence</li>
          </ul>
        </div>
      </section>
    </InfoPage>
  ),
});

