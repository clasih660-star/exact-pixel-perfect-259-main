import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";

const SITE_URL = "https://klassruum.com";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — Klassruum AI Virtual Classrooms" },
      {
        name: "description",
        content:
          "Guides, FAQs, and support resources for Klassruum. Learn how to set up your institution, manage courses, use the classroom, and troubleshoot common issues.",
      },
      { name: "keywords", content: "Klassruum help, support, FAQ, getting started, institution setup, course management, classroom help, troubleshooting" },
      { name: "author", content: "Klassruum" },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Help Center — Klassruum" },
      { property: "og:description", content: "Guides, FAQs, and support for setting up and using Klassruum." },
      { property: "og:url", content: `${SITE_URL}/help` },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/help` }],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Klassruum Help Center",
          url: `${SITE_URL}/help`,
          description: "Guides, FAQs, and support resources for Klassruum.",
        }),
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="Help center"
      title="How can we help?"
      intro="Guides, FAQs, and support resources to get you up and running with Klassruum."
      cta={{ label: "Contact support", to: "/contact" }}
      sections={[
        { icon: "🚀", title: "Getting started", body: "Register your institution, invite teachers and learners, and launch your first course." },
        { icon: "📝", title: "Authoring lessons", body: "Turn your materials into structured, teacher-led lessons grounded in your own content." },
        { icon: "🏫", title: "Running the classroom", body: "How lessons are taught, how questions work, and how learners move through a session." },
        { icon: "♿", title: "Accessibility settings", body: "Configure learning modes, captions, audio and display for diverse learners." },
        { icon: "📊", title: "Reading the evidence", body: "Interpret activity, practice and confidence data for each learner." },
        { icon: "🔐", title: "Data & privacy", body: "How learner data is stored, protected and controlled." },
        { icon: "👥", title: "Managing users", body: "Invite teachers, enroll learners, and manage roles and permissions." },
        { icon: "📁", title: "Uploading materials", body: "Supported file types, best practices for content, and how lesson generation works." },
      ]}
    >
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8">
        <h2 className="text-2xl font-bold text-[#0F172A]">Frequently asked questions</h2>
        <div className="mt-6 space-y-5">
          {[
            { q: "How do I get started?", a: "Register your institution, create your first course, upload materials, and generate lessons. Our getting started guide walks you through each step." },
            { q: "How do I add teachers?", a: "From your institution dashboard, invite teachers by email. They'll receive access to create and manage courses and lessons." },
            { q: "What file types can I upload?", a: "Klassruum supports PDFs, PowerPoint presentations, Word documents, images, and plain text. We're adding more formats regularly." },
            { q: "How do I contact support?", a: "Email us at hello@klassruum.com or use the contact form. We aim to respond within one business day." },
          ].map((item) => (
            <div key={item.q}>
              <h3 className="text-[16px] font-semibold text-[#0F172A]">{item.q}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </InfoPage>
  ),
});
