import { createFileRoute } from "@tanstack/react-router";
import { Building2, Brain, GraduationCap, ShieldCheck, Sparkles, Users } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Klassruum | AI Teaching Platform for Schools and Universities" },
      {
        name: "description",
        content:
          "Learn how Klassruum helps schools, universities, and training providers deliver structured AI teaching with accessibility, oversight, and measurable learner progress.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="About Klassruum"
      title="Built for institutions that need real teaching, not just content delivery"
      intro="Klassruum is an AI teaching platform designed for schools, universities, academies, and training providers that want lessons to stay structured, accessible, and reviewable at scale."
      cta={{ label: "Talk to our team", to: "/contact" }}
      sections={[
        {
          icon: <Brain size={20} />,
          title: "Teaching-first product design",
          body: "Klassruum is built around explanation, board work, reinforcement, and learner understanding instead of a generic chat interface.",
        },
        {
          icon: <Building2 size={20} />,
          title: "Institutional control",
          body: "Schools and universities keep control of who teaches, what materials are used, and how courses are structured and reviewed.",
        },
        {
          icon: <GraduationCap size={20} />,
          title: "Curriculum-grounded delivery",
          body: "Lesson delivery can stay aligned to approved teaching materials rather than drifting into unverified responses.",
        },
        {
          icon: <Users size={20} />,
          title: "Support for diverse learners",
          body: "Voice, captions, transcript-first learning, and readable visual explanation help more learners stay engaged in the same session.",
        },
        {
          icon: <ShieldCheck size={20} />,
          title: "Oversight and evidence",
          body: "Institutions can review lesson activity, learner questions, and participation signals to support intervention and governance.",
        },
        {
          icon: <Sparkles size={20} />,
          title: "Practical use of AI",
          body: "The goal is dependable educational workflow, not novelty for its own sake.",
        },
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="lp-premium-card p-6 sm:p-8">
          <h2 className="text-heading text-3xl font-extrabold tracking-tight">Why Klassruum exists</h2>
          <div className="text-body mt-4 space-y-4 text-sm leading-8 sm:text-base">
            <p>
              Many institutions want the efficiency of AI, but they do not want to lose the structure
              of good teaching. Klassruum was created to close that gap by making AI feel closer to a
              guided classroom than an open chat window.
            </p>
            <p>
              The platform focuses on turning institutional materials into lessons that explain,
              demonstrate, respond, and leave behind usable evidence. That matters for course leaders,
              teaching teams, accessibility leads, and the learners themselves.
            </p>
            <p>
              For schools, universities, and training organisations, the value is not just faster
              content generation. It is more consistent delivery, clearer learner support, and better
              visibility into what happened during the teaching process.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="lp-premium-card p-6">
            <h3 className="text-heading text-xl font-bold">Who we build for</h3>
            <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
              <li>Schools running digital or blended learning</li>
              <li>Universities supporting scale and consistency</li>
              <li>Training providers delivering repeatable instruction</li>
              <li>Institutions with accessibility and reporting needs</li>
            </ul>
          </div>
          <div className="lp-premium-card p-6">
            <h3 className="text-heading text-xl font-bold">What makes it different</h3>
            <p className="text-body mt-3 text-sm leading-7">
              Klassruum is not positioned as a chatbot for homework help. It is an AI-powered lesson
              environment built to support teaching workflows, learner progression, and institutional
              accountability.
            </p>
          </div>
        </div>
      </section>
    </InfoPage>
  ),
});

