import { createFileRoute } from "@tanstack/react-router";
import { Ban, BookMarked, Building2, FileCheck2, Scale, Shield } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Platform Use, Access and Responsibilities | Klassruum" },
      {
        name: "description",
        content:
          "Read the main Klassruum terms covering platform access, acceptable use, institutional responsibilities, content ownership, and service limitations.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Terms of service"
      title="The main rules for using Klassruum"
      intro="These terms outline how institutions and users are expected to access Klassruum, what responsibilities remain with the customer, and how the platform should be used responsibly in educational settings."
      cta={{ label: "Contact our team", to: "/contact" }}
      sections={[
        {
          icon: <Building2 size={20} />,
          title: "Institutional platform use",
          body: "Klassruum is intended for schools, universities, and training organisations managing teaching, learners, and course delivery.",
        },
        {
          icon: <BookMarked size={20} />,
          title: "Content responsibility",
          body: "Institutions remain responsible for the materials they upload and the workflows they configure around teaching delivery.",
        },
        {
          icon: <FileCheck2 size={20} />,
          title: "Acceptable use expectations",
          body: "Users should use the platform lawfully and in ways that support teaching, learning, administration, and agreed organisational objectives.",
        },
        {
          icon: <Shield size={20} />,
          title: "Access and account controls",
          body: "Organisations are responsible for managing users, permissions, and internal governance around platform access.",
        },
        {
          icon: <Ban size={20} />,
          title: "Operational and service limits",
          body: "Availability, features, and rollout scope may depend on plan level, implementation stage, or service maturity.",
        },
        {
          icon: <Scale size={20} />,
          title: "Commercial and formal agreements",
          body: "Commercial, procurement, and institutional support terms may be agreed separately where a deployment requires it.",
        },
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="lp-premium-card p-6 sm:p-8">
          <h2 className="text-heading text-2xl font-extrabold">Readable summary for review teams</h2>
          <div className="text-body mt-4 space-y-4 text-sm leading-8 sm:text-base">
            <p>
              This page is meant to help visitors, evaluators, and institution teams understand the
              main themes of Klassruum platform use before they move into formal procurement or legal
              review.
            </p>
            <p>
              For many schools and universities, the key questions are straightforward: who controls
              access, who is responsible for uploaded content, and what limits or conditions apply to
              rollout. This page addresses those expectations at a practical level.
            </p>
          </div>
        </div>

        <div className="lp-premium-card p-6">
          <h3 className="text-heading text-xl font-bold">Often reviewed with</h3>
          <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
            <li>Privacy and governance review</li>
            <li>Procurement discussions</li>
            <li>Support and rollout planning</li>
            <li>Institution onboarding documents</li>
          </ul>
        </div>
      </section>
    </InfoPage>
  ),
});

