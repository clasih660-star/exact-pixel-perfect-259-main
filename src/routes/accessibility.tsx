import { createFileRoute } from "@tanstack/react-router";
import { Captions, Eye, Keyboard, NotebookText, Volume2, WholeWord } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility | Inclusive AI Learning and Classroom Support | Klassruum" },
      {
        name: "description",
        content:
          "Discover Klassruum accessibility features including captions, transcript-first learning, readable visuals, keyboard-friendly navigation, and adaptable AI lesson delivery.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Accessibility"
      title="Built so more learners can stay with the same lesson"
      intro="Klassruum supports inclusive digital learning with accessibility features that help learners follow AI-taught lessons through voice, text, readable presentation, and alternative interaction modes."
      cta={{ label: "See the classroom demo", to: "/demo/classroom" }}
      sections={[
        {
          icon: <Captions size={20} />,
          title: "Live captions during teaching",
          body: "Learners can follow spoken delivery as readable text while the lesson is happening.",
        },
        {
          icon: <NotebookText size={20} />,
          title: "Transcript-first learning mode",
          body: "A text-led route helps learners review information at their own pace without losing context.",
        },
        {
          icon: <Eye size={20} />,
          title: "Readable visual explanation",
          body: "Board content and lesson visuals are designed to keep explanation focused, legible, and easier to process.",
        },
        {
          icon: <WholeWord size={20} />,
          title: "Adaptable lesson presentation",
          body: "Different display patterns can support comprehension, pacing, and attention across varied learner needs.",
        },
        {
          icon: <Keyboard size={20} />,
          title: "Keyboard-friendly interaction",
          body: "Core navigation patterns support learners and staff who rely on non-mouse input.",
        },
        {
          icon: <Volume2 size={20} />,
          title: "Voice plus text support",
          body: "Learners are not forced into a single format; spoken and written teaching can work together throughout the session.",
        },
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="lp-premium-card p-6 sm:p-8">
          <h2 className="text-heading text-2xl font-extrabold">Accessibility in a real teaching workflow</h2>
          <div className="text-body mt-4 space-y-4 text-sm leading-8 sm:text-base">
            <p>
              Accessibility in Klassruum is not treated as a separate afterthought. The aim is to let
              more learners participate in the same lesson through multiple support layers built into
              the classroom experience.
            </p>
            <p>
              That includes text support, clearer visual presentation, adaptable pacing, and learning
              modes that reduce the need for students to leave the main teaching flow just to keep up.
            </p>
          </div>
        </div>

        <div className="lp-premium-card p-6">
          <h3 className="text-heading text-xl font-bold">Relevant for institutions that need</h3>
          <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
            <li>More inclusive online classroom delivery</li>
            <li>Text-supported AI teaching</li>
            <li>Accessible blended learning tools</li>
            <li>Better support for varied learner needs</li>
          </ul>
        </div>
      </section>
    </InfoPage>
  ),
});
