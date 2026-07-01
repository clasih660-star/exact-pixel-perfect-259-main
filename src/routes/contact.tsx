import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CalendarDays, Headphones, Mail, MapPin, ShieldCheck, Users } from "lucide-react";
import { InfoPage } from "@/components/marketing/InfoPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Klassruum | Demo, Support, Partnerships and Rollout Enquiries" },
      {
        name: "description",
        content:
          "Contact Klassruum for school and university demos, pilot planning, support, partnerships, accessibility questions, and institutional rollout discussions.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Contact"
      title="Talk to the Klassruum team"
      intro="Use this page to reach Klassruum about product demos, institution onboarding, AI teaching rollout, support, procurement, and partnership opportunities."
      cta={{ label: "Register your institution", to: "/institutions/register" }}
      sections={[
        {
          icon: <Building2 size={20} />,
          title: "Institution demos",
          body: "Book a conversation about how Klassruum fits schools, universities, training centres, and blended learning programmes.",
        },
        {
          icon: <CalendarDays size={20} />,
          title: "Pilot planning",
          body: "Discuss a phased rollout, first-course pilot, or department-level deployment before wider adoption.",
        },
        {
          icon: <Headphones size={20} />,
          title: "Support enquiries",
          body: "Get help with onboarding, classroom delivery, access, accessibility settings, and account questions.",
        },
        {
          icon: <Users size={20} />,
          title: "Partnerships",
          body: "Talk to us about content partnerships, implementation support, institutional collaboration, or regional growth.",
        },
        {
          icon: <ShieldCheck size={20} />,
          title: "Compliance questions",
          body: "Raise privacy, governance, accessibility, and institutional review requirements early in the process.",
        },
        {
          icon: <MapPin size={20} />,
          title: "Rollout coordination",
          body: "We can help shape the right starting point based on learner groups, teaching teams, and evidence needs.",
        },
      ]}
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="lp-premium-card p-6 sm:p-8">
          <h2 className="text-heading text-2xl font-extrabold">How to reach us</h2>
          <p className="text-body mt-4 text-sm leading-8 sm:text-base">
            If you are evaluating an AI teaching platform for education, include the institution name,
            your role, what type of learners you support, and whether you want a demo, pilot, or full
            rollout conversation.
          </p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-body">
            <div>
              <p className="text-heading font-bold">General enquiries</p>
              <a className="text-learning-blue hover:text-academic-blue" href="mailto:hello@klassruum.com">
                hello@klassruum.com
              </a>
            </div>
            <div>
              <p className="text-heading font-bold">Support</p>
              <a className="text-learning-blue hover:text-academic-blue" href="mailto:support@klassruum.com">
                support@klassruum.com
              </a>
            </div>
            <div>
              <p className="text-heading font-bold">Institution onboarding</p>
              <Link to="/institutions/register" className="text-learning-blue hover:text-academic-blue">
                Start your institution registration
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="lp-premium-card p-6">
            <h3 className="text-heading text-xl font-bold">Best for these requests</h3>
            <ul className="text-body mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
              <li>School or university product demo</li>
              <li>AI classroom pilot planning</li>
              <li>Procurement or commercial review</li>
              <li>Accessibility and governance questions</li>
              <li>Implementation and support setup</li>
            </ul>
          </div>

          <div className="lp-premium-card p-6">
            <h3 className="text-heading text-xl font-bold">Need quick next steps?</h3>
            <p className="text-body mt-3 text-sm leading-7">
              If your team is ready to move beyond evaluation, use the registration route to start
              onboarding and planning for institutional rollout.
            </p>
          </div>
        </div>
      </section>
    </InfoPage>
  ),
});

