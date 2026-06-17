import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { Globe, RefreshCw, Accessibility, BarChart3, Zap, Lock } from "lucide-react";

export const Route = createFileRoute("/solutions/online-academies")({
  head: () => ({
    meta: [
      {
        title: "Klassruum for Online Academies — AI-Powered Virtual Classrooms at Scale",
      },
      {
        name: "description",
        content:
          "Deliver structured, accessible, and consistent lessons to thousands of online learners across time zones. Klassruum gives online academies an AI classroom engine that teaches at scale without expanding your teaching team.",
      },
      {
        name: "keywords",
        content:
          "online academy platform, AI virtual classroom, online course delivery, scale online teaching, LMS alternative, virtual classroom for academies, e-learning platform, white-label online academy, online education platform, course management system",
      },
      {
        property: "og:title",
        content: "Klassruum for Online Academies — Scale Teaching Without Scaling Headcount",
      },
      {
        property: "og:description",
        content:
          "AI-powered classrooms that deliver consistent, engaging lessons to thousands of learners. Built for online academies that need quality at scale.",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Online Academies"
      title="Scale your teaching, not your headcount"
      intro="Online academies face a unique challenge: delivering structured, high-quality teaching to thousands of learners across time zones, without losing the personal touch. Klassruum gives you an AI classroom engine that teaches consistently, adapts to each learner, and frees your team to focus on what matters."
      cta={{ label: "Book an academy demo", to: "/contact" }}
      sections={[
        {
          icon: <Globe size={20} />,
          title: "Teach at scale",
          body: "Deliver the same structured lesson to hundreds of concurrent learners — each one getting explanations, board work, and checks for understanding.",
        },
        {
          icon: <RefreshCw size={20} />,
          title: "Consistent quality",
          body: "Every lesson follows your approved materials and teaching methodology — no variation between instructors or time zones.",
        },
        {
          icon: <Accessibility size={20} />,
          title: "Inclusive by design",
          body: "Captions, dyslexia support, focus mode, and multiple learning styles mean your content reaches every learner, everywhere.",
        },
        {
          icon: <BarChart3 size={20} />,
          title: "Learner analytics",
          body: "Track engagement, progress, and questions per learner — understand what's working and where learners struggle.",
        },
        {
          icon: <Zap size={20} />,
          title: "Fast content turnaround",
          body: "Upload materials and have AI-generated lesson plans ready in minutes, not days — scale your course catalog rapidly.",
        },
        {
          icon: <Lock size={20} />,
          title: "Enterprise security",
          body: "SOC-ready infrastructure, GDPR compliance, and role-based access controls for platform administrators and learners.",
        },
      ]}
    >
      {/* ── Long-form SEO content ────────────────────────────── */}

      {/* What is Klassruum for Online Academies */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          What is Klassruum for Online Academies?
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Klassruum is an AI-powered virtual classroom platform built for organisations that teach
          at scale. Unlike traditional video conferencing tools or static learning management
          systems, Klassruum combines real-time instruction, interactive whiteboards, auto-generated
          captions, and intelligent learner analytics into a single browser-based experience. For
          online academies, this means you can deliver the same structured lesson to hundreds or
          thousands of concurrent learners, each receiving personalised attention without requiring
          additional human instructors.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-body">
          The platform was designed from the ground up around a central conviction: every learner
          deserves a well-taught lesson, regardless of location, device, language, or ability.
          Whether your academy delivers professional certifications, language courses, test
          preparation, or continuing education, Klassruum provides the classroom engine that scales
          with your ambition.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Explore all platform features
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Try the classroom demo
          </Link>
        </div>
      </div>

      {/* Scaling teaching without scaling headcount */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Scaling teaching without scaling headcount
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          The most pressing operational challenge for growing online academies is the linear
          relationship between student enrollment and instructor capacity. Every additional cohort
          requires additional qualified teachers, quality assurance processes, and management
          overhead. Klassruum fundamentally changes this equation.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          How AI-powered instruction works
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Klassruum's AI teacher delivers structured lessons by reading from your approved content
          materials, writing on the virtual whiteboard, and prompting learners with comprehension
          checks throughout the session. It operates within the pedagogical framework your academy
          defines — not as a replacement for your subject matter experts, but as a force multiplier
          that lets them focus on curriculum design, learner support, and quality improvement.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Concurrent sessions across time zones
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          A single lesson plan can run simultaneously in London, Lagos, and Lahore. Learners in each
          time zone receive the same high-quality instruction at their local time, without your team
          needing to schedule, staff, or manage separate live sessions. This is particularly
          valuable for academies operating across multiple regions or serving a globally distributed
          student body.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Reallocation of human expertise
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          When routine instruction is handled reliably by the AI classroom engine, your human
          instructors shift from delivery to oversight. They can review learner analytics, intervene
          in cases where a student is falling behind, refine curriculum materials, and build the
          kind of mentorship relationships that drive retention. This is not about removing the
          human element — it is about placing it where it has the greatest impact.
        </p>
      </div>

      {/* Consistent quality across time zones */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Consistent quality across every time zone
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Quality inconsistency is one of the greatest threats to an online academy's reputation.
          When different instructors teach the same course, learners inevitably receive different
          explanations, different emphasis, and different levels of engagement. This variability
          leads to uneven learning outcomes, inconsistent evaluations, and negative reviews.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-body">
          Klassruum eliminates this problem at its source. Because every lesson is generated from
          your approved materials by a consistent AI engine, the pedagogical quality, tone, and
          structure remain uniform — whether the session runs at 9 AM or 9 PM, for ten learners or
          ten thousand.
        </p>
        <ul className="mt-6 max-w-3xl space-y-3">
          {[
            "Uniform lesson structure and pacing across all scheduled sessions",
            "Same worked examples and board annotations, regardless of instructor availability",
            "Consistent comprehension checks that adapt to individual learner responses",
            "Automatic quality metrics so administrators can verify consistency across cohorts",
            "Standardised assessments that reflect the same teaching standard globally",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-body leading-relaxed">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-education-green" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Content authoring from existing materials */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Content authoring from your existing materials
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Most online academies have already invested heavily in course content — slide decks, PDFs,
          video lectures, written guides, and assessment banks. Klassruum does not ask you to start
          from scratch. Instead, the platform ingests your existing materials and transforms them
          into interactive, teachable lessons that the AI classroom engine can deliver in real time.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Upload once, teach everywhere
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Upload your curriculum documents, lecture notes, or presentation decks directly into
          Klassruum. The platform indexes your content and generates structured lesson plans that
          the AI teacher follows during live sessions. Each lesson plan includes whiteboard
          annotations, key talking points, embedded comprehension checks, and suggested pacing — all
          derived from your source materials, not from generic content.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Rapid course catalog expansion
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          For academies looking to expand their course offerings, the time from content upload to
          live delivery is measured in minutes, not weeks. This dramatically reduces the cost and
          friction of launching new programs, adding supplementary modules, or responding to market
          demand for emerging topics. Your curriculum team stays in control of content quality while
          the platform handles the delivery infrastructure.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            See all platform features
          </Link>
        </div>
      </div>

      {/* Learner analytics at scale */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Learner analytics at scale
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Understanding how your learners engage with content is essential for improving outcomes,
          reducing attrition, and proving ROI to stakeholders. Klassruum provides comprehensive
          analytics that operate at the individual, cohort, and platform level — giving your team
          actionable insight without requiring manual data collection or third-party integrations.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Individual learner profiles
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Every learner in your academy has a profile that tracks attendance, lesson completion,
          engagement levels, questions asked, and notes taken. This data is collected automatically
          during each session and surfaced in an administrator dashboard that makes it easy to spot
          learners who may need additional support before they fall behind.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Cohort-level reporting
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Compare performance across cohorts, courses, and time periods. Identify which lessons
          drive the highest engagement, where learners typically ask questions, and which content
          topics correlate with the strongest assessment results. This information feeds directly
          into curriculum improvement cycles and helps your academic team make evidence-based
          decisions.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Institutional dashboards
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          For academy leadership, Klassruum provides high-level dashboards showing total active
          learners, session volumes, content utilization rates, and retention metrics. These
          dashboards are designed to support strategic planning, investor reporting, and
          accreditation evidence without requiring data analysts to compile reports manually.
        </p>
      </div>

      {/* Multi-course management */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Multi-course management for growing academies
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          As online academies grow, they typically move from offering a handful of courses to
          managing dozens or hundreds of distinct programs across multiple disciplines, levels, and
          formats. Klassruum is built to handle this complexity with a structured course management
          system that keeps everything organised and accessible.
        </p>
        <ul className="mt-6 max-w-3xl space-y-3">
          {[
            "Create, duplicate, and archive courses independently without affecting other programs",
            "Assign different lesson plans, materials, and assessment criteria per course",
            "Schedule recurring or one-off sessions across multiple time zones and cohorts",
            "Manage instructor roles and permissions at the course or institution level",
            "Track performance metrics per course to identify high-performing programs and areas for improvement",
            "Scale from a single course to a full course catalog without platform migration",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-body leading-relaxed">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-education-green" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* White-label potential */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          White-label potential for academy brands
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Your academy's brand is one of your most valuable assets. Klassruum supports white-label
          deployment so that learners interact with your brand identity — not ours — at every
          touchpoint. This is essential for academies that operate under their own name, serve
          clients who require branded experiences, or resell educational content through partner
          channels.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Custom branding and domain
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Present Klassruum under your academy's name, logo, and colour scheme. Learners access
          their classroom through your branded URL, see your identity during sessions, and receive
          communications that feel seamless with the rest of your platform experience.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          API-driven integration
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Klassruum's API layer allows your development team to embed classroom functionality
          directly into your existing student portal, learning management system, or mobile
          application. Learners never need to leave your ecosystem to access a live lesson —
          reducing friction and strengthening your platform's value proposition.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Discuss white-label options with sales
          </Link>
        </div>
      </div>

      {/* Accessibility for global audiences */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Accessibility for global audiences
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Online academies serve learners from every background and ability level. Accessibility is
          not a compliance checkbox — it is a prerequisite for reaching the full addressable market.
          Klassruum was built with accessibility as a core design principle, not an afterthought.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          WCAG-compliant classroom experience
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Every element of the Klassruum classroom — from navigation controls to whiteboard
          annotations to session notes — is designed to meet WCAG 2.1 AA standards. Screen readers,
          keyboard navigation, and high-contrast modes are supported natively, ensuring that
          learners with visual, motor, or cognitive impairments can participate fully.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Captions, focus mode, and learning styles
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Real-time captions accompany every AI-generated explanation, making lessons accessible to
          deaf and hard-of-hearing learners and significantly improving comprehension for non-native
          speakers. Focus mode reduces visual clutter for learners with attention difficulties.
          Multiple learning styles — visual, auditory, and text-based — are supported within a
          single session, so every learner can engage in the way that works best for them.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Low-bandwidth and device support
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Many of the world's learners access education from low-cost devices over unreliable
          connections. Klassruum is engineered to run in modern browsers on modest hardware, with
          graceful degradation for limited bandwidth. This means your academy can serve learners in
          emerging markets without requiring them to invest in expensive technology.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/accessibility"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Read about accessibility features
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Try the classroom demo
          </Link>
        </div>
      </div>

      {/* GDPR and data residency */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          GDPR compliance and data residency
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Online academies that operate internationally — or serve learners in the European Union,
          United Kingdom, or other regulated markets — must navigate complex data protection
          requirements. Klassruum is built with GDPR compliance at its foundation, providing the
          controls and documentation your legal and compliance teams require.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Data processing agreements
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Klassruum provides standard data processing agreements (DPAs) that clearly define the
          roles and responsibilities of both parties under GDPR and equivalent legislation. Your DPO
          and legal counsel can review these agreements before deployment, ensuring alignment with
          your organisation's data governance policies.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Data residency options
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Depending on your deployment, learner data can be hosted in jurisdiction-specific data
          centres to satisfy data residency requirements. This is particularly relevant for
          academies operating in regions with strict data localisation laws or serving
          government-funded programs that mandate domestic data storage.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Consent and learner rights
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Klassruum supports configurable consent collection, data export, and right-to-erasure
          workflows so that your academy can respond to learner data subject access requests
          efficiently and in compliance with applicable law.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Read our privacy policy
          </Link>
        </div>
      </div>

      {/* Enterprise security */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Enterprise security built in
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Security is non-negotiable for online academies handling learner PII, assessment data, and
          payment information. Klassruum provides the security controls that enterprise procurement
          teams expect, so your platform can pass due diligence reviews without delay.
        </p>
        <ul className="mt-6 max-w-3xl space-y-3">
          {[
            "End-to-end encryption for all classroom sessions and stored data",
            "Role-based access controls for administrators, instructors, and learners",
            "SOC 2-aligned infrastructure and operational practices",
            "Regular penetration testing and vulnerability assessments",
            "Audit logging for all administrative and content changes",
            "SSO integration via SAML and OAuth for enterprise identity providers",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-body leading-relaxed">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-education-green" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Integration with existing platforms */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Integration with your existing platforms
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Online academies rarely operate in isolation. You likely have a student information
          system, a payment processor, a marketing automation platform, and possibly a legacy LMS.
          Klassruum is designed to integrate cleanly with the tools you already use, rather than
          forcing you into a rip-and-replace migration.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          LMS and SIS connectivity
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Klassruum can push learner enrollment data, attendance records, and session outcomes to
          your existing LMS or student information system via API or standard data exchange formats.
          This ensures your records stay synchronised without manual data entry or reconciliation.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Payment and enrollment automation
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Connect Klassruum to your payment gateway so that successful payment automatically
          provisions a learner's classroom access. This removes the administrative bottleneck of
          manual enrollment and ensures learners can begin their first lesson immediately after
          purchasing.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Webhook and API extensibility
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          For academies with custom workflows, Klassruum provides a webhook system that fires events
          when sessions start, lessons are completed, or learner milestones are reached. Your
          development team can use these events to trigger automations in your existing tooling —
          from sending personalised emails to updating CRM records to issuing digital certificates.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Explore all platform features
          </Link>
        </div>
      </div>

      {/* Klassruum for different academy types */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Klassruum for different types of academies
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Online academies come in many forms, each with distinct requirements. Klassruum's flexible
          architecture adapts to your specific use case without requiring a custom build.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Professional certification academies
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Deliver structured exam preparation courses with consistent quality across every cohort.
          Track learner progress against certification milestones and identify knowledge gaps before
          exam day. The platform's assessment capabilities ensure that practice questions and mock
          exams reflect the standards your certification requires.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Language learning academies
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Language instruction demands oral practice, pronunciation feedback, and conversational
          interaction. Klassruum's voice capabilities, combined with AI-driven speaking prompts and
          real-time captions, create an immersive language learning environment that scales without
          requiring native speaker instructors for every session.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Skills bootcamps and coding academies
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Technical academies benefit from Klassruum's whiteboard for code walkthroughs,
          architecture diagrams, and algorithm visualisation. The AI teacher can explain concepts
          while annotating code in real time, and learners can ask questions without disrupting the
          session flow.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">
          Continuing education providers
        </h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Organisations that deliver mandatory continuing education — whether in healthcare, law,
          finance, or another regulated industry — need scalable delivery with reliable completion
          tracking. Klassruum provides the audit trail and learner records that accreditation bodies
          require, while reducing the cost of delivering mandatory training at scale.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/solutions/schools"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Klassruum for Schools
          </Link>
          <Link
            to="/solutions/universities"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Klassruum for Universities
          </Link>
          <Link
            to="/solutions/training-providers"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Klassruum for Training Providers
          </Link>
          <Link
            to="/solutions/ngos"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Klassruum for NGOs
          </Link>
        </div>
      </div>

      {/* Pricing for academies */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Pricing designed for academies
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Klassruum's pricing model is built around the realities of online academies: you need
          predictable costs that scale with your learner base, not surprise charges that penalise
          growth. Our plans are structured to support academies at every stage, from a single-course
          pilot to a multi-program global operation.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">Start with a pilot</h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          Deploy Klassruum with a single course or a small cohort to validate fit. Measure learner
          engagement, instructor satisfaction, and operational impact before committing to a full
          rollout. This risk-free approach lets your team build confidence in the platform with real
          learners and real content.
        </p>
        <h3 className="mt-8 text-xl font-bold tracking-tight text-heading">Scale as you grow</h3>
        <p className="mt-3 max-w-3xl text-body leading-relaxed">
          As your academy expands, Klassruum scales with you. Add new courses, onboard additional
          administrators, and increase concurrent learner capacity without migrating to a different
          platform. Our pricing tiers are designed to reward growth, not punish it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            View pricing plans
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-all hover:shadow-md"
          >
            Contact sales for custom pricing
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-8 space-y-6">
          {[
            {
              q: "Can Klassruum replace our existing LMS?",
              a: "Klassruum can serve as your primary virtual classroom layer and integrates with existing LMS platforms via API. Many academies use Klassruum alongside their LMS for live instruction while using the LMS for content hosting and administrative workflows. A full migration is also possible if you want a single unified platform.",
            },
            {
              q: "How many learners can attend a single session?",
              a: "Klassruum supports large concurrent sessions, making it suitable for everything from small cohort tutorials to large-scale live lectures. The platform is engineered for performance at scale, and your account team can advise on capacity planning for your specific enrollment projections.",
            },
            {
              q: "What content formats does Klassruum support for lesson creation?",
              a: "You can upload PDFs, slide decks (PPT, PPTX), Word documents, plain text, and structured lesson plans. Klassruum indexes your content and generates teachable lesson plans that the AI classroom engine can deliver interactively. Existing video content can be referenced as supplementary material.",
            },
            {
              q: "Is Klassruum accessible for learners with disabilities?",
              a: "Yes. Klassruum is designed to meet WCAG 2.1 AA standards and includes real-time captions, screen reader support, keyboard navigation, focus mode, dyslexia-friendly text rendering, and multiple learning styles within a single session. See our full accessibility features for details.",
            },
            {
              q: "Can we brand Klassruum with our academy's identity?",
              a: "Yes. Klassruum supports white-label deployment including custom branding, logos, colour schemes, and domain configuration. Learners interact with your brand at every touchpoint. Contact our sales team to discuss white-label options.",
            },
            {
              q: "How does Klassruum handle GDPR compliance?",
              a: "Klassruum provides standard DPAs, configurable consent collection, data export, right-to-erasure workflows, and jurisdiction-specific data residency options. Our infrastructure is designed to meet GDPR requirements, and our documentation supports your DPO and legal teams during review.",
            },
            {
              q: "Can we integrate Klassruum with our existing payment and enrollment systems?",
              a: "Yes. Klassruum offers API and webhook integration for payment gateways, enrollment automation, student information systems, and CRM platforms. Successful payment can automatically provision learner classroom access, eliminating manual enrollment bottlenecks.",
            },
            {
              q: "What support does Klassruum provide for academy administrators?",
              a: "Every Klassruum academy account includes access to our help center with documentation, video tutorials, and guides. Enterprise plans include dedicated account management and onboarding support. Our support team is available to assist with technical setup, curriculum integration, and platform optimisation.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-border pb-6">
              <h3 className="text-lg font-bold text-heading">{q}</h3>
              <p className="mt-3 text-body leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="rounded-2xl border border-border bg-page-background-alt p-8 text-center sm:p-12">
        <h2 className="text-3xl font-black tracking-tight text-heading sm:text-4xl">
          Ready to scale your academy?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-body">
          Whether you are launching your first online course or scaling an established academy to
          thousands of learners, Klassruum provides the classroom engine you need. Book a demo with
          our team and see how it works with your content.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-heading px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90"
          >
            Book an academy demo
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-8 py-3.5 text-sm font-bold text-heading transition-all hover:shadow-md"
          >
            Try the classroom yourself
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted">
          <Link to="/pricing" className="hover:text-heading transition-colors">
            View pricing
          </Link>
          <Link to="/help" className="hover:text-heading transition-colors">
            Help center
          </Link>
          <Link to="/privacy" className="hover:text-heading transition-colors">
            Privacy policy
          </Link>
        </div>
      </div>
    </InfoPage>
  ),
});
