import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/marketing/InfoPage";
import {
  BookOpen,
  GraduationCap,
  Accessibility,
  TrendingUp,
  Globe,
  Lock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/solutions/schools")({
  head: () => ({
    meta: [
      {
        title: "Klassruum for Schools — Curriculum-Aligned Online Lessons for Primary & Secondary",
      },
      {
        name: "description",
        content:
          "Give primary and secondary classes structured, curriculum-aligned lessons taught by an AI teacher — accessible to every learner, GDPR-compliant, and built for real classroom hardware. See how Klassruum supports teachers, tracks progress, and meets WCAG 2.2 accessibility standards.",
      },
      {
        name: "keywords",
        content:
          "online lessons for schools, AI teacher platform, curriculum-aligned teaching, primary school e-learning, secondary school digital lessons, accessibility WCAG 2.2, GDPR schools, progress tracking schools, teacher-led online learning, classroom technology",
      },
    ],
  }),
  component: () => (
    <InfoPage
      eyebrow="For Schools"
      title="Every lesson, taught well — for every learner"
      intro="Give primary and secondary classes consistent, curriculum-aligned lessons that teach the way a great teacher would: clear explanations, worked examples, checks for understanding, and accessibility for every child in the room."
      cta={{ label: "Book a school demo", to: "/contact" }}
      sections={[
        {
          icon: <BookOpen size={20} />,
          title: "Curriculum-aligned",
          body: "Lessons follow your scheme of work, grounded in your own approved materials — not generic content.",
        },
        {
          icon: <GraduationCap size={20} />,
          title: "Supports your teachers",
          body: "Teachers stay in control: assign lessons, review evidence, and step in where learners need them most.",
        },
        {
          icon: <Accessibility size={20} />,
          title: "Inclusive by default",
          body: "Captions, audio, and learning modes mean a class with mixed needs can learn the same lesson together.",
        },
        {
          icon: <TrendingUp size={20} />,
          title: "Real progress evidence",
          body: "See engagement, questions and practice per learner — useful for parents' evenings and interventions.",
        },
        {
          icon: <Globe size={20} />,
          title: "Works on modest devices",
          body: "Runs in the browser on low-cost hardware and patchy connections — built for real classrooms.",
        },
        {
          icon: <Lock size={20} />,
          title: "Safe & private",
          body: "Learner data stays protected, with clear data-protection controls for schools.",
        },
      ]}
    >
      {/* ────────────────────────────────────────────────────────────
          LONG-FORM CONTENT BELOW THE SECTIONS
      ──────────────────────────────────────────────────────────── */}

      {/* ── What is Klassruum for Schools ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          What is Klassruum for Schools?
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum is an AI-powered teaching platform purpose-built for educational institutions.
          For primary and secondary schools, it delivers structured, teacher-led lessons entirely
          online — covering the same pedagogical sequence a skilled classroom teacher would follow:
          a clear explanation, worked examples, guided practice, checks for understanding, and
          feedback.
        </p>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Unlike generic video platforms or open-ended AI chatbots, Klassruum keeps the teacher in
          the loop. Every lesson is grounded in your school's own approved materials — your textbook
          chapters, your exam board specifications, your scheme of work. The AI acts as a
          presentation layer for your curriculum, not a replacement for it.
        </p>
        <p className="text-body max-w-3xl text-base leading-8">
          Schools use Klassruum to supplement classroom teaching, deliver remote or blended
          learning, support homework and revision, and provide consistent instruction across
          multiple classes or campuses. It works in any modern browser and is designed to run
          reliably on the low-cost hardware that many schools already own.
        </p>
      </section>

      {/* ── How It Works for Primary and Secondary ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          How Klassruum works for primary and secondary schools
        </h2>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">
          1. Teachers prepare and upload materials
        </h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Teachers upload their own lesson materials — PowerPoint slides, worksheet PDFs, textbook
          extracts, exam board mark schemes, or plain text notes. Klassruum's RAG
          (Retrieval-Augmented Generation) system indexes these materials so that every lesson the
          AI delivers is grounded in the school's approved content. Nothing is invented; the AI
          presents and explains what the teacher has provided.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">
          2. The AI teacher delivers the lesson
        </h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          When a student opens the lesson, Klassruum's AI teacher guides them through the content
          step by step. It explains concepts in plain language, draws on a virtual whiteboard to
          show working, displays diagrams and equations, and pauses to check whether the student
          understands before moving on. The tone and depth adapt to the learner's year group and the
          lesson's difficulty level.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">
          3. Students interact, practise, and ask questions
        </h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Students are not passive viewers. They type questions at any point and receive grounded
          answers drawn from the uploaded materials. Klassruum includes built-in practice questions
          with instant feedback, so students demonstrate understanding as they go — not only at the
          end of a unit. Every interaction is logged as evidence of learning.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">
          4. Teachers review and intervene
        </h3>
        <p className="text-body max-w-3xl text-base leading-8">
          After each lesson, teachers see a dashboard showing which students completed the lesson,
          how far they progressed, what questions they asked, and where they struggled. This gives
          teachers the evidence they need to plan interventions, prepare for parents' evenings, or
          adjust the next lesson's focus — without adding to their marking workload.
        </p>
      </section>

      {/* ── Curriculum Alignment ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Curriculum alignment
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum does not ship its own curriculum. The platform is curriculum-agnostic by design:
          it teaches whatever material your school provides. This means it naturally aligns with any
          national curriculum, exam board specification, or internal scheme of work.
        </p>
        <ul className="text-body mb-4 max-w-3xl list-disc pl-6 leading-8">
          <li>
            Upload materials for KS1, KS2, KS3, KS4, or Sixth Form topics — the AI adapts its
            teaching style to the year group.
          </li>
          <li>
            Map lessons to specific learning objectives or specification points so that students see
            exactly which curriculum targets they are working towards.
          </li>
          <li>
            Use existing exam board past papers and mark schemes as source material, so the AI can
            model exam-style responses in the format your examiners expect.
          </li>
          <li>
            Share materials across departments or campuses to ensure consistency — a Head of
            Department can prepare one set of materials and every class receives the same
            high-quality instruction.
          </li>
        </ul>
        <p className="text-body max-w-3xl text-base leading-8">
          Because the AI is grounded in your materials, there is no risk of it teaching to a
          different specification or using terminology that conflicts with your school's approach.
          For a detailed overview of the platform's lesson-generation and RAG architecture, see the{" "}
          <Link
            to="/features"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            platform features
          </Link>{" "}
          page.
        </p>
      </section>

      {/* ── Teacher Workflow ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          The teacher workflow
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum is designed around how teachers actually work, not around how engineers think
          teachers should work. The workflow is deliberately low-friction so that adoption does not
          depend on extensive training.
        </p>

        <div className="my-6 max-w-3xl space-y-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-bold text-learning-blue">
              1
            </div>
            <div>
              <p className="text-heading font-bold">Prepare</p>
              <p className="text-body text-sm leading-7">
                Gather the materials you already use — slides, worksheets, textbook pages. Upload
                them to Klassruum. The platform indexes them and makes them available as lesson
                source material.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-bold text-learning-blue">
              2
            </div>
            <div>
              <p className="text-heading font-bold">Assign</p>
              <p className="text-body text-sm leading-7">
                Select which topic or lesson to assign, choose the class or individual students, and
                set a deadline. Students receive the lesson and can work through it at their own
                pace within the window you set.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-bold text-learning-blue">
              3
            </div>
            <div>
              <p className="text-heading font-bold">Monitor</p>
              <p className="text-body text-sm leading-7">
                Check the teacher dashboard to see completion rates, question logs, and practice
                scores. Identify students who need support before the next lesson, not after the
                end-of-unit test.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-blue text-sm font-bold text-learning-blue">
              4
            </div>
            <div>
              <p className="text-heading font-bold">Intervene</p>
              <p className="text-body text-sm leading-7">
                Use the evidence to plan targeted support — whether that is a small-group session, a
                message to a student, or a conversation with a parent. The data is already there; no
                extra paperwork required.
              </p>
            </div>
          </div>
        </div>

        <p className="text-body max-w-3xl text-base leading-8">
          This workflow keeps teachers in control of content, pacing, and assessment while removing
          the repetitive delivery burden that contributes to workload pressure. For schools
          exploring how this fits into a broader digital strategy, our{" "}
          <Link
            to="/contact"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            sales team
          </Link>{" "}
          can walk through implementation with your leadership team.
        </p>
      </section>

      {/* ── Accessibility ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Accessibility: built for every learner
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Schools have a legal and ethical obligation to ensure that all learners can access
          education, including students with visual, auditory, motor, or cognitive impairments.
          Klassruum is designed with accessibility as a core requirement, not a bolt-on feature. The
          platform targets <strong className="text-heading">WCAG 2.2 AA compliance</strong>, the
          current internationally recognised standard for web accessibility.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">Captions and transcripts</h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Every spoken explanation in a Klassruum lesson is accompanied by real-time captions. Full
          transcripts are available for review after the lesson. This supports students who are deaf
          or hard of hearing, students learning in a second language, and any student who benefits
          from reading along while listening.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">Multiple learning modes</h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Students can switch between visual, audio, and text-focused learning modes within the same
          lesson. A student with low vision can increase contrast and rely on the audio narration; a
          student with dyslexia can switch to a high-readability text view; a student who processes
          information better through listening can follow the audio track without the visual
          distractions of the whiteboard.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">
          Keyboard and screen reader support
        </h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Every interactive element in Klassruum is operable via keyboard navigation and labelled
          for screen readers. Students who use assistive technology can complete lessons
          independently without requiring a separate accessible version of the content.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">Same lesson, different needs</h3>
        <p className="text-body max-w-3xl text-base leading-8">
          Crucially, accessibility features are built into the lesson itself, not delivered as a
          separate resource. This means a class with mixed needs can all learn the same lesson
          together, at the same time, with each student using the mode that works best for them.
          There is no need for the SENCO to source an alternative version or for the teacher to
          prepare differentiated materials for accessibility purposes. For a full breakdown of
          accessibility capabilities, visit the{" "}
          <Link
            to="/accessibility"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            accessibility features
          </Link>{" "}
          page.
        </p>
      </section>

      {/* ── GDPR & Data Protection ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          GDPR compliance and data protection
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Schools in the UK and EU operate under strict data protection obligations. Klassruum is
          designed to help schools meet those obligations, not create new ones.
        </p>

        <ul className="text-body mb-4 max-w-3xl list-disc pl-6 leading-8">
          <li>
            <strong className="text-heading">Data minimisation:</strong> Only the data necessary for
            the platform to function is collected. Student names, interaction logs, and lesson
            progress are stored securely and retained only for the period the school requires.
          </li>
          <li>
            <strong className="text-heading">Purpose limitation:</strong> Learner data is used
            solely for the purposes of delivering lessons, providing progress information to
            teachers, and improving the educational experience. It is not used for advertising,
            profiling, or sold to third parties.
          </li>
          <li>
            <strong className="text-heading">School-controlled:</strong> Schools retain control over
            their data. Data can be exported or deleted at the school's request. Klassruum provides
            clear data processing agreements suitable for inclusion in a school's DPIA (Data
            Protection Impact Assessment).
          </li>
          <li>
            <strong className="text-heading">Secure infrastructure:</strong> All data is encrypted
            in transit and at rest. The platform is hosted on infrastructure that meets SOC 2 and
            ISO 27001 standards.
          </li>
        </ul>

        <p className="text-body max-w-3xl text-base leading-8">
          Klassruum does not require students to create personal accounts with external services.
          Schools manage student access through their own systems, keeping the data relationship
          between the school and its learners intact. Our full{" "}
          <Link
            to="/privacy"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            privacy policy
          </Link>{" "}
          is available for review, and our team can provide documentation to support your school's
          data protection officer in completing a DPIA.
        </p>
      </section>

      {/* ── Progress Tracking ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Progress tracking and evidence
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum generates granular evidence of student engagement and understanding — not just
          completion tick-boxes, but the kind of detailed data that helps teachers make informed
          decisions.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">Per-learner dashboards</h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          For each student, teachers can see which lessons have been completed, how much time was
          spent, which questions were asked, and how practice questions were answered. This provides
          a continuous picture of engagement rather than a snapshot from a single test.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">Class-level overview</h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          The class dashboard shows aggregate completion rates, common misconceptions, and
          distribution of scores. Teachers can quickly identify whether a particular concept is
          causing difficulty across the class — indicating the need for a reteach — or whether only
          a few students are struggling, suggesting targeted intervention.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">Exportable reports</h3>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Progress data can be exported for use in school reporting systems, parents' evening
          conversations, or interventions tracking. The data is presented in formats that senior
          leadership teams and SENCOs can work with directly, without requiring additional data
          processing.
        </p>

        <h3 className="text-heading mt-8 mb-3 text-xl font-bold">
          Question logs as formative assessment
        </h3>
        <p className="text-body max-w-3xl text-base leading-8">
          Every question a student asks the AI teacher is logged with its context — which lesson,
          which point in the lesson, and what prompted the question. This gives teachers insight
          into student thinking that is rarely visible in traditional classroom settings, where only
          a handful of students typically ask questions aloud. For a broader view of how progress
          data integrates across the platform, see the{" "}
          <Link
            to="/features"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            features overview
          </Link>
          .
        </p>
      </section>

      {/* ── Device Requirements ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Device and connectivity requirements
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Many schools operate with aging hardware budgets and inconsistent internet connectivity,
          particularly in rural areas. Klassruum is built to work within these constraints.
        </p>

        <ul className="text-body mb-4 max-w-3xl list-disc pl-6 leading-8">
          <li>
            <strong className="text-heading">Browser-based:</strong> Klassruum runs in any modern
            browser — Chrome, Firefox, Edge, or Safari. No software installation is required, which
            eliminates the need for IT admin rights on student devices.
          </li>
          <li>
            <strong className="text-heading">Low-cost hardware:</strong> The platform runs on
            Chromebooks, older Windows laptops, Android tablets, and iPads. It does not require
            high-end processors, dedicated GPUs, or large amounts of RAM.
          </li>
          <li>
            <strong className="text-heading">Patchy connections:</strong> Klassruum is designed to
            degrade gracefully on slow or intermittent connections. Lessons can load incrementally,
            and core content is prioritised over non-essential assets.
          </li>
          <li>
            <strong className="text-heading">Shared devices:</strong> Students can log in and out
            quickly on shared devices. There is no dependency on persistent local storage or
            installed profiles.
          </li>
        </ul>

        <p className="text-body max-w-3xl text-base leading-8">
          This approach means schools do not need to invest in new hardware to adopt the platform.
          If students can access a web browser, they can use Klassruum. This is particularly
          relevant for schools participating in device-lending schemes or those operating bring your
          own device (BYOD) policies.
        </p>
      </section>

      {/* ── Pricing Overview ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Pricing for schools
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum offers transparent, per-student pricing designed for school budgets. There are
          no hidden fees, no per-teacher charges, and no lock-in contracts. Schools pay for the
          number of students actively using the platform, and pricing scales with adoption.
        </p>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          We offer discounted rates for multi-year commitments, whole-academy group licences, and
          schools in underserved communities. Every plan includes full access to all features —
          accessibility tools, progress tracking, curriculum alignment, and GDPR-compliant data
          handling — so that no school is forced into a premium tier to meet its obligations to
          students.
        </p>
        <p className="text-body max-w-3xl text-base leading-8">
          For a detailed breakdown of plans and pricing, visit the{" "}
          <Link
            to="/pricing"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            pricing page
          </Link>
          . To discuss a bespoke quote for your school or academy group,{" "}
          <Link
            to="/contact"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            contact our sales team
          </Link>
          .
        </p>
      </section>

      {/* ── Implementation Process ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Implementation process
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum is designed to be adopted incrementally. Schools typically start with a single
          department or year group, prove the value, and expand from there. The implementation
          process is structured to minimise disruption.
        </p>

        <div className="my-6 max-w-3xl space-y-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-green text-sm font-bold text-education-green">
              1
            </div>
            <div>
              <p className="text-heading font-bold">Discovery call</p>
              <p className="text-body text-sm leading-7">
                We discuss your school's curriculum, current technology setup, and the specific
                challenges you want to address. This is a conversation, not a sales pitch — we need
                to understand your context to recommend the right approach.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-green text-sm font-bold text-education-green">
              2
            </div>
            <div>
              <p className="text-heading font-bold">Pilot setup</p>
              <p className="text-body text-sm leading-7">
                We help you set up a pilot with one class or one subject. Your teachers upload their
                materials, we configure the platform, and students begin using it within a matter of
                days — not weeks or months.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-green text-sm font-bold text-education-green">
              3
            </div>
            <div>
              <p className="text-heading font-bold">Review and refine</p>
              <p className="text-body text-sm leading-7">
                After two to four weeks, we review pilot data with your team. What worked? What
                needs adjustment? We refine the setup based on real usage, not assumptions.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-green text-sm font-bold text-education-green">
              4
            </div>
            <div>
              <p className="text-heading font-bold">Scale across the school</p>
              <p className="text-body text-sm leading-7">
                Once the pilot is validated, we support you in rolling out to additional classes,
                departments, or year groups. This includes teacher training sessions, documentation,
                and ongoing support.
              </p>
            </div>
          </div>
        </div>

        <p className="text-body max-w-3xl text-base leading-8">
          Throughout the process, our team provides hands-on support. We do not hand you a login and
          leave you to figure it out. For schools that want to try the platform before committing,
          we offer a{" "}
          <Link
            to="/demo/classroom"
            className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
          >
            live classroom demo
          </Link>{" "}
          where you can experience the student and teacher perspectives first-hand.
        </p>
      </section>

      {/* ── Comparison with Other Solutions ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          How Klassruum compares to other approaches
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Schools have several options for digital learning. Here is how Klassruum differs from the
          most common alternatives:
        </p>

        <div className="my-6 max-w-3xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 pr-4 text-heading font-bold">Approach</th>
                <th className="py-3 text-heading font-bold">Limitation Klassruum addresses</th>
              </tr>
            </thead>
            <tbody className="text-body">
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Pre-recorded video</td>
                <td className="py-3">
                  Passive viewing; no interaction; no checks for understanding; inaccessible to many
                  learners without additional accommodations.
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">Generic AI chatbots</td>
                <td className="py-3">
                  Not grounded in your curriculum; can produce inaccurate content; no teacher
                  oversight or evidence trail; no structured lesson flow.
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">VLE / LMS platforms</td>
                <td className="py-3">
                  Manage content delivery but do not teach; still require a teacher to deliver every
                  lesson live or record it themselves.
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-3 pr-4 font-medium">1:1 tutoring</td>
                <td className="py-3">
                  Effective but expensive and unscalable; not viable for whole-class or whole-school
                  deployment.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">Klassruum</td>
                <td className="py-3">
                  Interactive, curriculum-grounded, teacher-supervised, accessible,
                  evidence-generating, and cost-effective at scale.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-body max-w-3xl text-base leading-8">
          Klassruum is not intended to replace teachers. It is intended to give them a tool that
          handles structured content delivery — the part of teaching that is most repetitive and
          most affected by workload pressure — while freeing them to focus on the parts of teaching
          that require human judgement: relationships, motivation, pastoral care, and complex
          formative assessment.
        </p>
      </section>

      {/* ── Use Cases Across School Types ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Use cases across school types
        </h2>
        <p className="text-body mb-4 max-w-3xl text-base leading-8">
          Klassruum is used across a range of school settings. While the core functionality is the
          same, the way schools deploy it varies:
        </p>

        <ul className="text-body mb-4 max-w-3xl list-disc pl-6 leading-8">
          <li>
            <strong className="text-heading">Primary schools (KS1-KS2):</strong> Foundational
            literacy and numeracy lessons, science explorations, and geography and history topics.
            The accessible design is particularly valuable in mixed-age or mixed-ability classes
            common in primary settings.
          </li>
          <li>
            <strong className="text-heading">Secondary schools (KS3-KS4):</strong> Subject-specific
            lessons aligned to exam board specifications. Used for homework, revision, cover
            lessons, and intervention support. Teachers use the question logs to identify
            misconceptions before they appear in assessments.
          </li>
          <li>
            <strong className="text-heading">Special schools and SEND provision:</strong> The
            multi-modal learning approach and accessibility features make Klassruum suitable for
            learners with a wide range of additional needs. Teachers can adjust the pace and
            modality to match individual education plans.
          </li>
          <li>
            <strong className="text-heading">Academy trusts and multi-academy trusts:</strong>{" "}
            Central teams can prepare and share curriculum materials across multiple schools,
            ensuring consistency while allowing individual schools to adapt to their context.
          </li>
        </ul>

        <p className="text-body max-w-3xl text-base leading-8">
          The platform is also relevant for schools serving diverse linguistic communities. The
          captioning and multi-language support features help students who are learning in English
          as an additional language access the same curriculum content as their peers.
        </p>
      </section>

      {/* ── FAQ Section ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>

        <div className="max-w-3xl space-y-6">
          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              Does Klassruum replace teachers?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              No. Klassruum handles structured content delivery — explanation, worked examples,
              practice questions — so teachers can focus on the aspects of teaching that require
              human judgement: building relationships, providing pastoral support, managing
              classroom dynamics, and making nuanced assessment decisions. Teachers remain in
              control of what is taught, how it is taught, and what happens next based on student
              evidence.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              What curriculum materials can I use?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Any materials your school creates or has the right to use: PowerPoint presentations,
              PDF worksheets, textbook extracts, exam board specifications and mark schemes, plain
              text notes, or structured lesson plans. The AI is grounded in whatever you upload, so
              it teaches your curriculum, not a generic one.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              Is Klassruum GDPR compliant?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Yes. Klassruum collects only the data necessary for the platform to function, uses it
              solely for educational purposes, and provides schools with full control over data
              retention and deletion. We provide data processing agreements suitable for inclusion
              in your school's DPIA. See our{" "}
              <Link
                to="/privacy"
                className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
              >
                privacy policy
              </Link>{" "}
              for full details.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              What hardware do we need?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Any device with a modern web browser — Chromebooks, Windows laptops, Android tablets,
              iPads, or desktops. No software installation is required. The platform is designed to
              run on low-cost hardware and works on connections as slow as 3G. See the device
              requirements section above for full details.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              How long does implementation take?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Most schools begin a pilot within one to two weeks of their initial conversation with
              our team. A full school rollout typically takes four to eight weeks, depending on the
              number of departments involved and the school's existing technology infrastructure. We
              provide hands-on support throughout the process.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              Can students use it at home for homework?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Yes. Klassruum runs in any browser, so students can access lessons from home on any
              device. Teachers can assign lessons with deadlines, and students complete them
              independently. The teacher can then review the evidence of completion and
              understanding the next day.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              How does pricing work for schools?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Klassruum charges per active student, with no per-teacher fees and no lock-in
              contracts. Pricing scales with adoption, and discounts are available for multi-year
              commitments, academy groups, and schools in underserved communities. All features are
              included at every pricing tier. Visit the{" "}
              <Link
                to="/pricing"
                className="text-learning-blue underline decoration-1 underline-offset-2 hover:text-academic-blue"
              >
                pricing page
              </Link>{" "}
              for current rates.
            </p>
          </details>

          <details className="group rounded-xl border border-border bg-white p-5">
            <summary className="text-heading cursor-pointer list-none text-base font-bold">
              What about safeguarding?
            </summary>
            <p className="text-body mt-3 text-sm leading-7">
              Klassruum does not include social features, direct messaging between students, or any
              mechanism for students to share content with each other. All student-AI interactions
              are logged and visible to teachers. The platform is designed to complement your
              existing safeguarding policies, not create new risks.
            </p>
          </details>
        </div>
      </section>

      {/* ── Related Solutions ── */}
      <section className="mb-16">
        <h2 className="text-heading mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Explore other Klassruum solutions
        </h2>
        <p className="text-body mb-6 max-w-3xl text-base leading-8">
          Klassruum serves a range of educational settings. If you are interested in how the
          platform works beyond primary and secondary schools, explore these related solutions:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/solutions/universities"
            className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            <span className="text-heading text-sm font-bold">Klassruum for Universities</span>
          </Link>
          <Link
            to="/solutions/training-providers"
            className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            <span className="text-heading text-sm font-bold">Klassruum for Training Providers</span>
          </Link>
          <Link
            to="/solutions/ngos"
            className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            <span className="text-heading text-sm font-bold">Klassruum for NGOs</span>
          </Link>
          <Link
            to="/solutions/online-academies"
            className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            <span className="text-heading text-sm font-bold">Klassruum for Online Academies</span>
          </Link>
          <Link
            to="/solutions/tutoring-centers"
            className="group flex items-center gap-3 rounded-xl border border-border bg-white p-4 transition-all hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            <span className="text-heading text-sm font-bold">Klassruum for Tutoring Centers</span>
          </Link>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="mb-16 rounded-2xl border border-border bg-page-background-alt p-8 text-center sm:p-12">
        <h2 className="text-heading mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          See how Klassruum works in your classroom
        </h2>
        <p className="text-body mx-auto mt-4 max-w-xl text-base leading-8">
          Book a demo with our team. We will walk you through the platform with your curriculum
          materials and show you exactly how it fits into your school's workflow.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-heading px-6 py-3 text-sm font-bold text-white transition-all hover:bg-heading/90"
          >
            Book a school demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/demo/classroom"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold text-heading transition-all hover:shadow-md"
          >
            Try the classroom demo
          </Link>
        </div>
        <p className="text-muted mt-6 text-xs">
          Need help first? Visit the{" "}
          <Link to="/help" className="underline decoration-1 underline-offset-2 hover:text-heading">
            help center
          </Link>{" "}
          for documentation and guides.
        </p>
      </section>
    </InfoPage>
  ),
});
