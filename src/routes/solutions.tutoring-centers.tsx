import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import { Target, Clock, Tag, TrendingUp, MessageSquare, DollarSign } from "lucide-react";

export const Route = createFileRoute("/solutions/tutoring-centers")({
  head: () => ({
    meta: [
      {
        title: "Klassruum for Tutoring Centers — Personalized AI Learning at Scale",
      },
      {
        name: "description",
        content:
          "Klassruum helps tutoring centers deliver personalized 1:1 and small-group lessons at scale. Track student progress, brand every session under your identity, and grow revenue without diluting quality. GDPR-compliant and built for diverse learners.",
      },
      {
        name: "keywords",
        content:
          "tutoring center software, AI tutoring platform, personalized learning, small group tutoring, student progress tracking, tutoring business management, curriculum flexibility, GDPR tutoring, accessible education platform, online tutoring tools",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Tutoring Centers"
      title="Give every student a patient, one-to-one lesson"
      intro="Scale the personal attention your tutors are known for. Klassruum teaches each student step by step, answers their questions, and adapts the pace — so your centre can serve more learners without diluting quality."
      cta={{ label: "Partner with us", to: "/contact" }}
      sections={[
        {
          icon: <Target size={20} />,
          title: "Adapts to each learner",
          body: "Pace, examples and hints adjust to the student in front of the screen.",
        },
        {
          icon: <Clock size={20} />,
          title: "Available any hour",
          body: "Students can revise and practise outside session times, with the same teaching quality.",
        },
        {
          icon: <Tag size={20} />,
          title: "Your brand",
          body: "Deliver lessons under your centre's identity and curriculum.",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "Progress you can show",
          body: "Share clear activity and practice evidence with parents and students.",
        },
        {
          icon: <MessageSquare size={20} />,
          title: "Question support",
          body: "Students ask freely and get grounded, on-topic answers — never left stuck.",
        },
        {
          icon: <DollarSign size={20} />,
          title: "Better economics",
          body: "Reach more students per tutor while keeping outcomes high.",
        },
      ]}
    >
      {/* ================================================================
          COMPREHENSIVE SEO CONTENT — Klassruum for Tutoring Centers
          ================================================================ */}

      {/* ── What Is Klassruum for Tutoring Centers ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          What Is Klassruum for Tutoring Centers?
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Klassruum is an AI-powered teaching platform purpose-built for education organizations
          that deliver personalized instruction. For tutoring centers, it solves the fundamental
          tension every growing centre faces: how to maintain the intimate, student-first experience
          that built your reputation while scaling to serve more learners.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-body">
          Unlike generic classroom tools, Klassruum functions as a responsive AI teacher. It adapts
          pace, difficulty, examples, and explanations in real time based on each student's
          responses. A student who grasps quadratics quickly moves on; one who struggles with
          fractions receives additional scaffolding, alternative examples, and patient reinforcement
          — all within the same platform your tutors already guide.
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-body">
          The result is a platform where your tutors set the curriculum and learning goals, and
          Klassruum executes the teaching with consistent quality at any hour of the day. Whether a
          student logs in at 4 PM for a scheduled session or at 9 PM for independent revision, the
          instructional quality is identical.
        </p>
      </section>

      {/* ── Personalized Learning at Scale ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Personalized Learning at Scale
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          True personalization means more than letting students choose a topic. Klassruum adjusts
          its teaching strategy for every individual:
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Adaptive Pacing</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              The platform detects when a student needs more time on a concept and automatically
              slows down, providing additional practice problems and worked examples. Fast learners
              skip ahead without being held back by a class-wide pace.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Contextual Explanations</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              When a student asks "why?", Klassruum draws from the specific lesson context to give a
              grounded, curriculum-aligned explanation. No off-topic hallucinations. No generic
              responses. The answer connects directly to what the student was just working on.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Real-Time Difficulty Calibration</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Practice questions adjust in difficulty based on demonstrated understanding. Students
              who show mastery get challenged; those who show gaps get targeted reinforcement. Every
              practice session is different because every student is different.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Multi-Modal Delivery</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Lessons combine voice narration, visual boards, live captions, and written notes.
              Students who learn better by listening, reading, or watching all receive content in
              their preferred modality — and can switch between modes at any time.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          This level of individualization was previously only possible in expensive 1:1 tutoring
          engagements. Klassruum makes it the default experience for every student, in every
          session.
        </p>
      </section>

      {/* ── 1:1 and Small Group Delivery ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          1:1 and Small Group Delivery
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Tutoring centers typically offer both individual sessions and small group classes.
          Klassruum supports both models natively.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Individual Sessions
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-body">
          In a 1:1 setting, Klassruum acts as the primary instructor while your tutor supervises and
          intervenes when needed. The AI handles content delivery, practice generation, and
          immediate feedback. Your tutor focuses on mentoring, motivation, and addressing the
          nuanced questions that require human judgment. This division of labour means each tutor
          can effectively manage more concurrent sessions without any student receiving less
          attention.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Small Group Classes
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-body">
          For groups of 3-8 students, Klassruum provides a shared workspace where the AI teacher
          addresses the group while each student works at their own pace on adaptive exercises. The
          tutor sees a live dashboard showing every student's progress simultaneously. When one
          student falls behind, the tutor is alerted instantly and can provide targeted intervention
          while the rest of the group continues productively.
        </p>
        <h3 className="mt-8 text-xl font-extrabold tracking-tight text-heading">
          Blended Scheduling
        </h3>
        <p className="mt-3 max-w-3xl text-base leading-7 text-body">
          Many tutoring centers run a hybrid model: scheduled group classes during peak hours, with
          on-demand individual sessions available throughout the day. Klassruum accommodates both
          seamlessly. Students attending a Tuesday evening algebra group and those revising
          independently on Saturday morning both receive the same high-quality instruction, just in
          different formats. Your center's scheduling complexity decreases while student
          satisfaction increases.
        </p>
      </section>

      {/* ── Progress Tracking for Parents ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Progress Tracking That Parents Trust
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Parents choosing a tutoring center want visible, measurable results. Klassruum generates
          the evidence they need to see that their investment is paying off.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Session Activity Reports</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              After every session, parents receive a detailed breakdown: topics covered, time spent
              on each concept, questions asked, practice accuracy rates, and areas identified for
              improvement. No vague summaries — concrete data they can review with their child.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Longitudinal Progress Views</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Beyond individual sessions, parents can see progress over weeks and months. Mastery
              curves show which topics their child has consolidated and which still need attention.
              This long-term view helps parents understand that learning is a process, not a single
              test score.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Goal-Setting and Benchmarks</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Your tutors set learning goals for each student within Klassruum. Parents see progress
              toward those goals in real time. Whether the target is mastering long division before
              September or improving essay structure for GCSE preparation, every goal has a clear
              progress indicator.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Notes and Communication</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Tutors annotate student records with observations, strategies tried, and
              recommendations. Parents access these notes alongside the automated reports, giving
              them a complete picture that blends data with professional insight.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          When parents can see exactly what happens in each session and how their child is
          progressing over time, retention rates increase and word-of-mouth referrals grow.
          Transparency is a competitive advantage.
        </p>
      </section>

      {/* ── Curriculum Flexibility ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Curriculum Flexibility for Every Centre
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          No two tutoring centers teach exactly the same way. Some follow national curricula
          closely; others specialize in exam preparation, enrichment, or remediation. Klassruum is
          designed to adapt to your approach, not the other way around.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            "Upload your own lesson plans, worksheets, and materials directly into the platform. Klassruum uses them as the basis for AI-generated instruction.",
            "Align lessons to any national or regional curriculum framework — UK National Curriculum, IB, Common Core, or custom syllabi.",
            "Create subject-specific pathways for Maths, English, Science, Humanities, and Languages with full control over sequencing and emphasis.",
            "Design bespoke preparation courses for standardized tests: 11+, GCSE, A-Level, SAT, or any assessment your centre specializes in.",
            "Switch between topics dynamically within a session based on student needs — no rigid lesson scripts that ignore the learner in front of the screen.",
            "Combine multiple subjects and skill areas within a single learning journey for students who need cross-curricular support.",
          ].map((item) => (
            <li key={item.slice(0, 40)} className="flex gap-3 text-base leading-7 text-body">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-education-green" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          Your curriculum team retains full control. They design the learning pathways; Klassruum
          delivers them with fidelity and adaptability. If you want to see how curriculum upload
          works in practice, try the{" "}
          <Link
            to="/demo/classroom"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            live classroom demo
          </Link>
          .
        </p>
      </section>

      {/* ── Pricing Model for Tutoring Businesses ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          A Pricing Model Built for Tutoring Businesses
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Tutoring centers operate on tight margins. Staff costs, rent, and marketing already
          consume most of the budget. Klassruum's pricing is structured to improve your unit
          economics, not worsen them.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Per-Student, Not Per-Tutor</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              You pay based on the number of active students, not the number of staff accounts. This
              means adding a new tutor to your team does not increase your platform cost. Hire
              freely and scale your teaching capacity without a proportional increase in overhead.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Transparent Tiers</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Every tier includes full access to the core teaching tools. No hidden fees for
              essential features like progress tracking, curriculum alignment, or parent reporting.
              What you see on the{" "}
              <Link
                to="/pricing"
                className="font-semibold text-academic-blue underline-offset-2 hover:underline"
              >
                pricing page
              </Link>{" "}
              is what you pay.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Volume and Multi-Site Discounts</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Tutoring franchises and multi-location centres receive consolidated pricing. Manage
              all sites from a single account with site-specific reporting and access controls. The
              more students you serve, the better the per-student rate.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">No Lock-In Contracts</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Start with a monthly plan and scale as you grow. No annual commitments required. If
              Klassruum does not deliver results for your students, you are not locked into a
              long-term agreement. We believe in earning your renewal every month.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          The math is straightforward: if Klassruum allows each tutor to effectively serve 30-40%
          more students without sacrificing quality, the platform pays for itself within the first
          term. Run the numbers with our team —{" "}
          <Link
            to="/contact"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            request a pricing consultation
          </Link>
          .
        </p>
      </section>

      {/* ── Competitive Advantage ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Your Competitive Advantage in a Crowded Market
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          The tutoring industry is growing rapidly, and so is competition. Parents have more choices
          than ever. Klassruum gives your centre tangible differentiators that competitors cannot
          easily replicate.
        </p>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">
              24/7 Availability Without 24/7 Staffing
            </h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Students who need help at 9 PM on a Sunday get the same quality instruction as those
              in a Tuesday afternoon session. You extend your effective operating hours without
              extending payroll. This is a powerful selling point for working parents whose children
              need flexible scheduling.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Consistent Quality Across All Tutors</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Every tutor delivers the same instructional standard because Klassruum ensures
              consistency. New tutors ramp up faster because the platform handles content delivery
              while they develop their mentoring skills. Experienced tutors focus on the high-value
              work that retains students long-term.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Data-Parented Tutoring Plans</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Instead of generic "we'll help your child improve" promises, you can show parents a
              data-backed diagnosis: here is where your child is, here is where they need to go, and
              here is the plan to get there. This level of specificity builds trust and justifies
              premium pricing.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Brand Differentiation</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Every lesson is delivered under your centre's identity. Students and parents see your
              brand, not a third-party platform. This reinforces your reputation and makes the
              technology invisible — which is exactly how it should be.
            </p>
          </div>
        </div>
      </section>

      {/* ── Accessibility for Diverse Learners ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Accessibility for Every Learner
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Tutoring centers serve students with a wide range of learning needs. Some have diagnosed
          conditions like dyslexia or ADHD; others are English language learners. Many simply have
          different learning preferences. Klassruum is{" "}
          <Link
            to="/accessibility"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            built with accessibility at its core
          </Link>
          , not as an afterthought.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Dyslexia-Friendly Design</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Adjustable font sizes, high-contrast modes, and dyslexia-friendly typefaces make
              reading easier for students with print disabilities. Content can be read aloud with
              synchronized highlighting.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Screen Reader Support</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Full ARIA compliance ensures that visually impaired students can navigate the platform
              using assistive technology. Every interactive element is properly labeled and keyboard
              accessible.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Multi-Language Support</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              English language learners receive explanations in accessible English with optional
              translation support. The platform adapts vocabulary complexity and provides visual
              context clues to aid comprehension.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Self-Paced for Neurodiverse Learners</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Students with ADHD or processing differences are not pressured to keep up with a class
              pace. They spend as long as they need on each concept, and the platform never
              penalizes them for taking a different amount of time.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          When tutoring centers can confidently serve students with diverse needs, they expand their
          addressable market and build a reputation for inclusive excellence. Read more about our{" "}
          <Link
            to="/accessibility"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            full accessibility commitment
          </Link>
          .
        </p>
      </section>

      {/* ── GDPR Compliance and Data Protection ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          GDPR Compliance and Data Protection
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Tutoring centers handle sensitive student data, especially when working with minors.
          Klassruum takes data protection seriously and is designed to help you meet your GDPR
          obligations without operational complexity.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            "All student data is encrypted at rest and in transit using industry-standard AES-256 encryption.",
            "Data processing agreements are available for all tutoring center partners, clearly defining roles and responsibilities under GDPR.",
            "Student profiles can be anonymized or deleted on request, supporting data subject access requests (DSARs) within required timeframes.",
            "No student data is used to train AI models. Every interaction remains private to your organization.",
            "Data is hosted in EU-based data centres with appropriate transfer mechanisms for any cross-border processing.",
            "Role-based access controls ensure that tutors only see data for their assigned students. Administrators have full oversight; tutors have appropriate boundaries.",
            "Audit logs track every access to student records, providing the documentation trail that regulatory compliance requires.",
          ].map((item) => (
            <li key={item.slice(0, 40)} className="flex gap-3 text-base leading-7 text-body">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-education-green" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          For complete details on how we handle data, review our{" "}
          <Link
            to="/privacy"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            privacy policy
          </Link>
          . If you have specific compliance questions, our team is ready to address them —{" "}
          <Link
            to="/contact"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            get in touch
          </Link>
          .
        </p>
      </section>

      {/* ── Onboarding Process ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Getting Started: The Onboarding Process
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          We designed the onboarding process to get your centre operational quickly without cutting
          corners. Most tutoring centers are live within one to two weeks.
        </p>
        <div className="mt-6 space-y-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-extrabold text-learning-blue">
              1
            </div>
            <div>
              <h3 className="text-lg font-bold text-heading">Discovery and Planning</h3>
              <p className="mt-1 text-sm leading-7 text-body">
                We start with a call to understand your centre's structure, subjects offered,
                student demographics, and goals. Together we map out how Klassruum fits into your
                existing operations and identify the curriculum content you will load first.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-extrabold text-learning-blue">
              2
            </div>
            <div>
              <h3 className="text-lg font-bold text-heading">Setup and Configuration</h3>
              <p className="mt-1 text-sm leading-7 text-body">
                Your dedicated onboarding specialist configures your account, sets up your branding,
                uploads initial curriculum materials, and creates tutor and student accounts. We
                handle the technical work so your team can focus on teaching.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-extrabold text-learning-blue">
              3
            </div>
            <div>
              <h3 className="text-lg font-bold text-heading">Tutor Training</h3>
              <p className="mt-1 text-sm leading-7 text-body">
                We run live training sessions for your tutors covering platform navigation, lesson
                monitoring, progress tracking, and intervention strategies. Tutors learn to work
                alongside the AI effectively — leveraging its strengths while applying their own
                expertise where it matters most.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-extrabold text-learning-blue">
              4
            </div>
            <div>
              <h3 className="text-lg font-bold text-heading">Pilot and Refinement</h3>
              <p className="mt-1 text-sm leading-7 text-body">
                Start with a small cohort of students. We monitor the pilot closely, gathering
                feedback from tutors, students, and parents. Adjustments are made in real time. Only
                when the experience is right do we help you expand to the full student body.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-extrabold text-learning-blue">
              5
            </div>
            <div>
              <h3 className="text-lg font-bold text-heading">Full Launch and Ongoing Support</h3>
              <p className="mt-1 text-sm leading-7 text-body">
                Roll out to all students. Our support team remains available for ongoing questions,
                curriculum updates, and optimization recommendations. You are never left to figure
                things out alone. Visit our{" "}
                <Link
                  to="/help"
                  className="font-semibold text-academic-blue underline-offset-2 hover:underline"
                >
                  help center
                </Link>{" "}
                for documentation, tutorials, and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI for Tutoring Businesses ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Return on Investment for Tutoring Businesses
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Every business decision must justify its cost. Klassruum delivers ROI across multiple
          dimensions — not just cost savings, but revenue growth and operational improvement.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-6 text-center">
            <div className="text-3xl font-black text-education-green">30-40%</div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">
              More students per tutor
            </div>
            <p className="mt-3 text-sm leading-7 text-body">
              Tutors supervise rather than deliver every lesson, enabling them to support
              significantly more students per session.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6 text-center">
            <div className="text-3xl font-black text-education-green">85%+</div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">
              Parent retention rate
            </div>
            <p className="mt-3 text-sm leading-7 text-body">
              Transparent progress reporting and consistent quality keep parents renewing term after
              term.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6 text-center">
            <div className="text-3xl font-black text-education-green">&lt;2 weeks</div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">
              Time to operational
            </div>
            <p className="mt-3 text-sm leading-7 text-body">
              From first call to fully operational, the onboarding process is measured in days, not
              months.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          Beyond direct financial returns, Klassruum reduces tutor turnover by eliminating
          repetitive content delivery work that causes burnout. Tutors who spend their time
          mentoring and connecting with students stay longer, and experienced tutors are your most
          valuable asset.
        </p>
      </section>

      {/* ── Platform Features ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Core Platform Features
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Klassruum is a complete teaching environment, not a content library. Every feature is
          designed to support the tutoring workflow from start to finish. See the full{" "}
          <Link
            to="/features"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            features overview
          </Link>{" "}
          for a complete breakdown.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "AI Voice Teacher",
              desc: "Natural voice narration with synchronized board actions. Students hear explanations while seeing them drawn and written in real time.",
            },
            {
              title: "Live Whiteboard",
              desc: "Interactive board where the AI writes, draws diagrams, and illustrates concepts. Students can annotate and ask for modifications.",
            },
            {
              title: "Auto-Captions",
              desc: "Every spoken word is transcribed in real time. Students can read along, search past explanations, and review what was said.",
            },
            {
              title: "Session Notes",
              desc: "Automatically generated notes from every session. Students leave with a complete record they can review anytime.",
            },
            {
              title: "Practice Generation",
              desc: "AI-generated practice problems calibrated to each student's level. Difficulty adjusts in real time based on responses.",
            },
            {
              title: "Admin Dashboard",
              desc: "Centre-wide oversight of tutor activity, student progress, and operational metrics. Make data-driven decisions about staffing and curriculum.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-white p-5">
              <h3 className="text-base font-bold text-heading">{f.title}</h3>
              <p className="mt-2 text-sm leading-7 text-body">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison: Klassruum vs Traditional Tutoring Software ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Klassruum vs. Traditional Tutoring Software
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Most tutoring software focuses on scheduling, billing, and communication. Those are
          important, but they do not teach. Klassruum is different because it is a teaching platform
          first and a management tool second.
        </p>
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-3 border-b border-border bg-heading text-sm font-bold text-white">
            <div className="px-5 py-3">Capability</div>
            <div className="px-5 py-3">Traditional Software</div>
            <div className="px-5 py-3">Klassruum</div>
          </div>
          {[
            ["Scheduling & billing", "Basic", "Full integration"],
            ["Student progress tracking", "Manual entry", "Automated, real-time"],
            ["Content delivery", "Not included", "AI teaching engine"],
            ["Parent reporting", "Basic summaries", "Detailed session data"],
            ["Accessibility support", "Limited", "Built-in, comprehensive"],
            ["24/7 student support", "Not available", "AI tutor available anytime"],
            ["Curriculum alignment", "Not applicable", "Full custom pathways"],
          ].map(([cap, trad, klass], i) => (
            <div
              key={cap}
              className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-page-background-alt"}`}
            >
              <div className="border-r border-border px-5 py-3 font-semibold text-heading">
                {cap}
              </div>
              <div className="border-r border-border px-5 py-3 text-body">{trad}</div>
              <div className="px-5 py-3 font-medium text-education-green">{klass}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who Benefits ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Who Benefits from Klassruum?
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-body">
          Klassruum serves a range of tutoring business models. If your organization delivers
          personalized education, there is a fit.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Independent Tutoring Centres</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Single-location centres with 2-10 tutors use Klassruum to extend their reach,
              professionalize their offering, and compete with larger chains. The platform gives
              independent centres the technology backbone that was previously only affordable for
              franchises.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Multi-Site Franchises</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Franchises benefit from centralized curriculum management with site-level autonomy.
              Head office sets the standards; individual locations customize for their local market.
              Consistent quality reporting flows upward automatically.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Online-Only Tutoring Services</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Digital-native tutoring businesses leverage Klassruum as their primary teaching
              environment. No need to build custom technology; you get a proven platform that
              handles the hard problems while you focus on growth and student acquisition.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-6">
            <h3 className="text-lg font-bold text-heading">Supplementary Education Programs</h3>
            <p className="mt-2 text-sm leading-7 text-body">
              Community organizations, after-school programs, and charitable education initiatives
              use Klassruum to deliver high-quality instruction with limited budgets. The platform's
              scalability means more students served without proportional cost increases.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-body">
          Beyond tutoring centres, Klassruum also serves{" "}
          <Link
            to="/solutions/schools"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            schools
          </Link>
          ,{" "}
          <Link
            to="/solutions/universities"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            universities
          </Link>
          ,{" "}
          <Link
            to="/solutions/training-providers"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            training providers
          </Link>
          , and{" "}
          <Link
            to="/solutions/online-academies"
            className="font-semibold text-academic-blue underline-offset-2 hover:underline"
          >
            online academies
          </Link>
          . The platform's flexibility makes it suitable for any organization that delivers
          structured education.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-6">
          {[
            {
              q: "How long does it take to get started?",
              a: "Most tutoring centres are fully operational within one to two weeks. The timeline depends on the volume of curriculum content you want to load and the number of tutor accounts you need configured. Our onboarding team handles the technical setup; your team focuses on curriculum planning and tutor training.",
            },
            {
              q: "Can I upload my own curriculum and materials?",
              a: "Yes. You can upload lesson plans, worksheets, problem sets, and reference materials directly into Klassruum. The AI uses these materials as the foundation for its teaching, ensuring alignment with your specific curriculum approach. You retain full control over content while the platform handles delivery.",
            },
            {
              q: "Does Klassruum replace our tutors?",
              a: "No. Klassruum augments your tutors, not replaces them. The platform handles content delivery and practice generation, freeing tutors to focus on mentoring, motivation, and addressing complex questions that require human judgment. Tutors supervise the AI and intervene when a student needs personal attention.",
            },
            {
              q: "Is student data safe and GDPR-compliant?",
              a: "Yes. All student data is encrypted, hosted in EU-based data centres, and never used to train AI models. We provide data processing agreements, support data subject access requests, and offer audit logging. See our full privacy policy for complete details.",
            },
            {
              q: "Can parents see what happens in sessions?",
              a: "Yes. Parents receive detailed session reports showing topics covered, practice accuracy, time spent on each concept, and tutor notes. They can also view long-term progress dashboards showing mastery curves and goal completion. Transparency builds trust and improves parent retention.",
            },
            {
              q: "What subjects does Klassruum support?",
              a: "Klassruum supports Maths, English, Science, Humanities, and Languages with full curriculum alignment. You can also create custom subject pathways for specialized areas like exam preparation (11+, GCSE, A-Level, SAT), enrichment programs, or remediation courses.",
            },
            {
              q: "How does pricing work for tutoring centres?",
              a: "Pricing is based on the number of active students, not the number of tutor accounts. This means you can hire additional tutors without increasing your platform cost. Volume discounts are available for larger centres and multi-site franchises. Visit our pricing page or contact us for a tailored quote.",
            },
            {
              q: "Is there a free trial?",
              a: "Yes. We offer a pilot programme where you can test Klassruum with a small cohort of students before committing. This lets you evaluate the platform's impact on your students and operations with zero risk. Contact us to arrange your pilot.",
            },
            {
              q: "What support is available after onboarding?",
              a: "Ongoing support includes access to our help center with documentation and tutorials, email and chat support for operational questions, and regular check-ins with your dedicated account manager for optimization recommendations. You are never left to figure things out alone.",
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border border-border bg-white p-6">
              <h3 className="text-lg font-bold text-heading">{faq.q}</h3>
              <p className="mt-3 text-sm leading-7 text-body">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="mb-16 rounded-2xl border border-border bg-page-background-alt p-8 text-center sm:p-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-heading sm:text-4xl">
          Ready to Scale Your Tutoring Centre?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-body">
          Join tutoring centres across the country that use Klassruum to deliver personalized
          learning at scale. Start your pilot today and see the difference for yourself.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-heading px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-heading/90"
          >
            Book a Consultation
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-8 py-3.5 text-sm font-bold text-heading transition-colors hover:bg-page-background-alt"
          >
            Try the Classroom Demo
          </Link>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-8 py-3.5 text-sm font-bold text-heading transition-colors hover:bg-page-background-alt"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </InfoPage>
  ),
});
