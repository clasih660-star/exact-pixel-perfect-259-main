import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, Building2, LifeBuoy, ShieldCheck, UserRoundCheck, Wrench } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center | Klassruum Support for Schools, Teachers and Learners" },
      {
        name: "description",
        content:
          "Find Klassruum help resources for institution setup, lesson preparation, learner access, troubleshooting, accessibility, privacy, and support escalation.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Help Center"
      title="Support for rollout, teaching, and day-to-day use"
      intro="The Klassruum Help Center is for institutions, teachers, and learners who need guidance on setup, lesson delivery, access, and common platform questions."
      cta={{ label: "Contact support", to: "/contact" }}
      sections={[
        {
          icon: <Building2 size={20} />,
          title: "Institution setup help",
          body: "Support for registration, course structure, teacher invitation, and staged rollout planning.",
        },
        {
          icon: <BookOpenText size={20} />,
          title: "Lesson preparation guidance",
          body: "Learn how to prepare resources, ground the classroom, and structure AI-supported teaching.",
        },
        {
          icon: <UserRoundCheck size={20} />,
          title: "Learner access support",
          body: "Help students enter lessons, use transcripts, and understand the main classroom interface.",
        },
        {
          icon: <Wrench size={20} />,
          title: "Troubleshooting",
          body: "Work through browser issues, access problems, classroom playback questions, and session behavior.",
        },
        {
          icon: <ShieldCheck size={20} />,
          title: "Privacy and governance help",
          body: "Understand where to look for privacy, compliance, and institution-facing review expectations.",
        },
        {
          icon: <LifeBuoy size={20} />,
          title: "Escalation path",
          body: "Know when to use documentation, when to contact support, and when to involve your institution team.",
        },
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="lp-premium-card p-6">
            <h2 className="text-heading text-2xl font-extrabold">Choose the right help route</h2>
            <div className="text-body mt-4 space-y-4 text-sm leading-8">
              <p>
                If you are evaluating the platform, start with institution onboarding. If you are
                already using Klassruum, the next best route depends on whether the issue is teaching,
                learner access, browser behavior, or operational support.
              </p>
              <p>
                The goal of this page is to make support easier to navigate for both education teams
                and implementation stakeholders.
              </p>
            </div>
          </div>
          <div className="lp-premium-card p-6">
            <h3 className="text-heading text-xl font-bold">Common reasons people visit this page</h3>
            <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
              <li>Setting up a school or department rollout</li>
              <li>Preparing the first AI-taught lesson</li>
              <li>Helping learners access classroom sessions</li>
              <li>Fixing browser or classroom playback issues</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "For institutions",
              body: "Use this if you are evaluating rollout, inviting staff, or preparing governance and course setup.",
              link: "/institutions/register",
              label: "Institution registration",
            },
            {
              title: "For teachers",
              body: "Use this if you are preparing materials, supervising lessons, or reviewing learner progress.",
              link: "/docs",
              label: "Documentation",
            },
            {
              title: "Direct support",
              body: "Use this if you are blocked on onboarding, procurement, or technical support and need the team directly.",
              link: "/contact",
              label: "Contact Klassruum",
            },
          ].map((card) => (
            <div key={card.title} className="lp-premium-card p-6">
              <h3 className="text-heading text-xl font-bold">{card.title}</h3>
              <p className="text-body mt-2 text-sm leading-7">{card.body}</p>
              <Link to={card.link} className="text-learning-blue mt-4 inline-flex text-sm font-semibold hover:text-academic-blue">
                {card.label}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </InfoPage>
  ),
});

