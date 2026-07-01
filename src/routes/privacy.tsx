import { createFileRoute } from "@tanstack/react-router";
import { Database, Eye, Lock, ShieldCheck, Users, Workflow } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Learner Data, Access Controls and Governance | Klassruum" },
      {
        name: "description",
        content:
          "Understand how Klassruum approaches learner data, privacy controls, role-based access, teaching records, and institution-facing governance.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Privacy policy"
      title="How Klassruum handles data and privacy"
      intro="Klassruum is designed for institutional learning environments, which means privacy, access control, and responsible handling of learner information are part of the product conversation from the beginning."
      cta={{ label: "Read terms of service", to: "/terms" }}
      sections={[
        {
          icon: <Database size={20} />,
          title: "Educational data context",
          body: "The platform uses the data needed to run lessons, manage access, and provide useful visibility back to institutions.",
        },
        {
          icon: <Lock size={20} />,
          title: "Role-based access controls",
          body: "Learner, teacher, and admin visibility can be separated so access reflects institutional responsibilities.",
        },
        {
          icon: <Users size={20} />,
          title: "Institution governance responsibilities",
          body: "Institutions remain responsible for account management, uploaded course materials, and internal governance decisions.",
        },
        {
          icon: <Eye size={20} />,
          title: "Teaching visibility and evidence",
          body: "Lesson activity, participation signals, and learner questions can help staff understand what happened during delivery.",
        },
        {
          icon: <Workflow size={20} />,
          title: "Operational processing",
          body: "Information may support classroom delivery, accessibility features, support workflows, and account operations.",
        },
        {
          icon: <ShieldCheck size={20} />,
          title: "Security-minded handling",
          body: "The platform aims to protect data through sensible restrictions, operational safeguards, and institution-aware controls.",
        },
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lp-premium-card p-6 sm:p-8">
          <h2 className="text-heading text-2xl font-extrabold">Privacy summary for education teams</h2>
          <div className="text-body mt-4 space-y-4 text-sm leading-8 sm:text-base">
            <p>
              This page gives a high-level explanation of how Klassruum thinks about privacy in an AI
              teaching environment. It is written for schools, universities, procurement teams, and
              implementation stakeholders who need a quick understanding before deeper review.
            </p>
            <p>
              In practice, institutions often want to know what information supports delivery, who can
              see what, and how teaching records help with oversight. That is why role separation,
              learner context, and operational safeguards matter here.
            </p>
          </div>
        </div>

        <div className="lp-premium-card p-6">
          <h3 className="text-heading text-xl font-bold">Usually reviewed alongside</h3>
          <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
            <li>Institution procurement review</li>
            <li>Internal governance policies</li>
            <li>Accessibility and safeguarding expectations</li>
            <li>Formal commercial or deployment agreements</li>
          </ul>
        </div>
      </section>
    </InfoPage>
  ),
});

