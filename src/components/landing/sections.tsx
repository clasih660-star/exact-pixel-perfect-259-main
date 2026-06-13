/**
 * Klassruum landing sections.
 *
 * Each exported component is one major page section with SEO-friendly headings
 * (h2 for sections, h3 for cards) and natural, product-accurate copy. The hero's
 * h1 lives here too (the single h1 on the page).
 *
 * NOTE FOR MARKETING: numbers marked "EDITABLE METRIC" and the testimonials are
 * placeholders — replace with verified figures and real, attributed quotes
 * before publishing. Nothing here states an unverifiable claim as fact.
 */

import { useState } from "react";
import {
  GraduationCap,
  PencilRuler,
  Mic,
  Brain,
  Accessibility as AccessibilityIcon,
  NotebookPen,
  LineChart,
  LayoutDashboard,
  FileStack,
  Upload,
  Sparkles,
  Presentation,
  ClipboardCheck,
  School,
  Building2,
  Users,
  HeartHandshake,
  Briefcase,
  MonitorPlay,
  Calculator,
  Atom,
  Languages,
  Landmark,
  Globe2,
  Palette,
  Code2,
  ChevronDown,
  Quote,
  Captions,
  Keyboard,
  Eye,
  Type,
  Gauge,
  Plus,
  Shield,
  Lock,
  Globe,
  Zap,
  Link2,
  CheckCircle,
} from "lucide-react";
import {
  Container,
  SectionHeader,
  CTAButton,
  FeatureCard,
  StatCard,
  SurfaceCard,
  YesMark,
  NoMark,
  Eyebrow,
} from "./primitives";
import { ClassroomMockup } from "./ClassroomMockup";

/* ════════════════════════════════════════════════════════════════════
   1. HERO
   ════════════════════════════════════════════════════════════════════ */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* soft, limited background accents */}
      <div className="lp-blob -top-24 -left-24 h-72 w-72 bg-[#DBEAFE]" aria-hidden />
      <div className="lp-blob top-32 right-0 h-72 w-72 bg-[#EFF6FF]" aria-hidden />

      <Container className="relative grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1.15fr]">
        <div className="lp-fade-up">
          <Eyebrow>
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> AI teacher-led classrooms
          </Eyebrow>

          <h1
            id="hero-heading"
            className="mt-5 text-[34px] font-bold leading-[1.1] tracking-tight text-[#0F172A] sm:text-[44px] md:text-[52px]"
          >
            AI-powered virtual classrooms that{" "}
            <span className="text-[#1F7C80]">teach like real teachers</span>
          </h1>

          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#475569]">
            Klassruum helps schools and institutions turn course materials into structured, AI-led lessons — delivered by
            a virtual teacher with an interactive whiteboard, voice, captions, notes, transcripts, accessibility modes,
            and learner progress tracking.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton to="/demo/classroom" size="lg">
              Try Demo Classroom
            </CTAButton>
            <CTAButton to="/institutions/register" variant="secondary" size="lg">
              Register Your School
            </CTAButton>
          </div>

          <p className="mt-6 text-sm text-[#64748B]">
            Built for schools, tutors, universities, NGOs, and training providers. No setup required to try the demo.
          </p>
        </div>

        <div className="lp-fade-up lp-delay-2">
          <ClassroomMockup />
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   2. TRUST / INSTITUTION PROOF STRIP
   ════════════════════════════════════════════════════════════════════ */
const AUDIENCES = [
  { icon: <School className="h-5 w-5" />, label: "Schools" },
  { icon: <Building2 className="h-5 w-5" />, label: "Universities" },
  { icon: <Users className="h-5 w-5" />, label: "Tutoring centers" },
  { icon: <Briefcase className="h-5 w-5" />, label: "Training companies" },
  { icon: <HeartHandshake className="h-5 w-5" />, label: "NGOs" },
  { icon: <MonitorPlay className="h-5 w-5" />, label: "Online academies" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[#E2E8F0] bg-white py-10" aria-label="Who Klassruum is built for">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#64748B]">
          Built for institutions of every kind
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {AUDIENCES.map((a) => (
            <div
              key={a.label}
              className="flex items-center justify-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 text-sm font-medium text-[#0F172A]"
            >
              <span className="text-[#1F7C80]">{a.icon}</span>
              {a.label}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   3. PROBLEM
   ════════════════════════════════════════════════════════════════════ */
const PROBLEMS = [
  { title: "LMS platforms store content — they don't teach", body: "Course libraries and document repositories hold materials, but learners are left to study alone with no one to explain, demonstrate, or check understanding." },
  { title: "Live video depends on teacher availability", body: "Conferencing tools require a human educator online at a fixed time, which is hard to scale across cohorts, time zones, and growing class sizes." },
  { title: "Chatbots answer questions but don't run lessons", body: "A Q&A assistant can reply to prompts, yet it never delivers a structured lesson with objectives, worked examples, practice, and a clear progression." },
  { title: "Many tools fall short on accessibility", body: "Captions, transcripts, keyboard navigation, and focus modes are often afterthoughts, leaving deaf, low-vision, and neurodivergent learners underserved." },
  { title: "Institutions lack real learning evidence", body: "Attendance and completion tell you little. Schools need visibility into questions asked, checkpoints reached, and where learners need review." },
];

export function ProblemSection() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="problem-heading">
      <Container>
        <SectionHeader
          id="problem-heading"
          eyebrow="The gap today"
          title="Online learning tools are fragmented"
          description="Most platforms solve one piece of the puzzle. Learners still miss the thing that matters most — an actual teacher delivering the lesson, adapting in real time, and leaving a record of what was learned."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p) => (
            <SurfaceCard key={p.title} className="h-full">
              <h3 className="text-[16px] font-semibold text-[#0F172A]">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">{p.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   4. SOLUTION
   ════════════════════════════════════════════════════════════════════ */
const SOLUTION_FLOW = [
  { icon: <FileStack className="h-5 w-5" />, title: "Lesson generation", body: "Turn uploaded materials into structured lessons with objectives, whiteboard items, and explanations." },
  { icon: <GraduationCap className="h-5 w-5" />, title: "AI teacher delivery", body: "A virtual teacher introduces, writes, reads, and explains each step of the lesson." },
  { icon: <Mic className="h-5 w-5" />, title: "Real-time questions", body: "Learners ask by voice or text and get answers grounded in the current lesson." },
  { icon: <LineChart className="h-5 w-5" />, title: "Progress & records", body: "Notes, transcripts, and learning activity are captured for every session." },
];

export function SolutionSection() {
  return (
    <section className="bg-[#EFF6FF]/60 py-20 md:py-24" aria-labelledby="solution-heading">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="lp-fade-up">
          <SectionHeader
            id="solution-heading"
            eyebrow="One classroom, everything connected"
            title="Klassruum brings the whole lesson together"
            align="left"
            description="Klassruum combines lesson generation, AI teacher delivery, interactive whiteboard teaching, captions, notes, transcripts, learner questions, accessibility modes, and progress tracking in one classroom experience — so institutions deliver complete, accessible lessons at scale."
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton to="/demo/classroom">See it in the demo</CTAButton>
            <CTAButton href="#how-it-works" variant="ghost">
              How it works ↓
            </CTAButton>
          </div>
        </div>

        <div className="lp-fade-up lp-delay-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOLUTION_FLOW.map((s) => (
            <div key={s.title} className="rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#1F7C80]">
                {s.icon}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold text-[#0F172A]">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   5. FEATURES
   ════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: <GraduationCap className="h-5 w-5" />, title: "AI teacher-led lessons", description: "A virtual teacher follows a structured lesson plan — introducing, demonstrating, and explaining each step like a real educator." },
  { icon: <PencilRuler className="h-5 w-5" />, title: "Interactive whiteboard", description: "Lesson content is written out step by step on a real-feeling whiteboard, with everything spoken also typed for reading." },
  { icon: <Mic className="h-5 w-5" />, title: "Voice and text questions", description: "Learners ask questions by speaking or typing at any point during the lesson, without breaking the flow." },
  { icon: <Brain className="h-5 w-5" />, title: "Context-aware answers", description: "Answers are grounded in the current lesson and the institution's own course materials — not generic web responses." },
  { icon: <Captions className="h-5 w-5" />, title: "Live captions & transcript", description: "Every spoken line is captioned in real time and saved to a full, reviewable transcript." },
  { icon: <AccessibilityIcon className="h-5 w-5" />, title: "Accessibility modes", description: "Dedicated modes for deaf, low-vision, dyslexia, ADHD focus, and more adapt the classroom to each learner." },
  { icon: <NotebookPen className="h-5 w-5" />, title: "Notes & lesson replay", description: "Clean, revision-ready notes are generated as the lesson runs, and learners can replay any step." },
  { icon: <LineChart className="h-5 w-5" />, title: "Learner progress tracking", description: "Track lessons started and completed, questions asked, checkpoints reached, and areas needing review." },
  { icon: <LayoutDashboard className="h-5 w-5" />, title: "Institution dashboards", description: "Admins manage programmes, courses, teachers, and learners, and monitor active classrooms in one place." },
  { icon: <FileStack className="h-5 w-5" />, title: "Materials to lessons", description: "Upload PDFs, slides, documents, syllabi, and images, and generate ready-to-review structured lessons." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20 md:py-24" aria-labelledby="features-heading">
      <Container>
        <SectionHeader
          id="features-heading"
          eyebrow="Platform features"
          title="Everything a real lesson needs, in one classroom"
          description="Klassruum is classroom infrastructure — not a chatbot, a video player, or a content library. Each feature is built around delivering and recording a complete lesson."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   6. HOW IT WORKS
   ════════════════════════════════════════════════════════════════════ */
const STEPS = [
  { n: "01", icon: <Upload className="h-5 w-5" />, title: "Upload or create course content", body: "Bring your own PDFs, slides, documents, syllabi, and images, or write content directly. Klassruum extracts the material that lessons will be built from." },
  { n: "02", icon: <Sparkles className="h-5 w-5" />, title: "Generate structured lessons", body: "Klassruum produces lessons with clear objectives, whiteboard items, teacher explanations, learner notes, and question checkpoints — ready for a teacher or admin to review and publish." },
  { n: "03", icon: <Presentation className="h-5 w-5" />, title: "The AI teacher delivers the session", body: "Inside the classroom, the AI teacher introduces the lesson, writes on the whiteboard, reads each item, explains deeply, and answers learner questions in real time." },
  { n: "04", icon: <ClipboardCheck className="h-5 w-5" />, title: "Review progress, notes & transcripts", body: "After each session, review progress records, saved notes, full transcripts, and learning data showing exactly where learners engaged and where they need review." },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-[#0F172A] py-20 text-white md:py-24" aria-labelledby="how-heading">
      <Container>
        <div className="lp-fade-up mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-[999px] border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#93C5FD]">
            How Klassruum works
          </span>
          <h2 id="how-heading" className="mt-4 text-[28px] font-bold tracking-tight sm:text-[34px] md:text-[40px]">
            From course materials to a delivered lesson
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-300">
            Four steps take an institution from raw content to a complete, accessible classroom session with a full
            record of what was taught and learned.
          </p>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-[20px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#1F7C80] text-white">
                  {s.icon}
                </span>
                <span className="text-2xl font-bold text-white/20">{s.n}</span>
              </div>
              <h3 className="mt-5 text-[16px] font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   7. CLASSROOM EXPERIENCE
   ════════════════════════════════════════════════════════════════════ */
const TEACHING_LOOP = [
  "The teacher introduces the lesson and its objective.",
  "The teacher writes the next item on the whiteboard.",
  "The teacher reads the board text exactly, then explains it deeply.",
  "Everything spoken is also typed on the board for readers.",
  "A learner asks a question by voice or text.",
  "The AI answers using the current lesson and course context.",
  "If a question is unclear, the teacher asks the learner to clarify.",
  "Notes, transcript, and progress are saved automatically.",
];

export function ClassroomExperienceSection() {
  return (
    <section id="classroom" className="scroll-mt-20 py-20 md:py-24" aria-labelledby="classroom-heading">
      <Container>
        <SectionHeader
          id="classroom-heading"
          eyebrow="The classroom experience"
          title="A teaching loop that feels like a real lesson"
          description="The classroom is the product. Learners don't read alone or chat with a bot — they sit in a session where a teacher writes, explains, checks understanding, and responds."
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <ol className="lp-fade-up space-y-3">
            {TEACHING_LOOP.map((step, i) => (
              <li key={i} className="flex items-start gap-3 rounded-[14px] border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-xs font-bold text-[#1F7C80]">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-[#0F172A]">{step}</span>
              </li>
            ))}
          </ol>
          <div className="lp-fade-up lp-delay-2">
            <ClassroomMockup />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   8. AI TEACHER
   ════════════════════════════════════════════════════════════════════ */
const TEACHER_TRAITS = [
  { title: "Lesson-aware, not prompt-driven", body: "The teacher follows a pre-developed lesson plan with objectives and a clear progression — it isn't waiting for prompts to decide what to teach." },
  { title: "Grounded in your materials", body: "Answers draw on the current lesson and the institution's approved course content, keeping responses accurate and on-topic." },
  { title: "Asks for clarification", body: "When a question is vague, the teacher asks a short clarifying question instead of guessing — just like a good tutor." },
  { title: "Adapts the explanation", body: "Learners can ask for a simpler version, another example, or to see it on the board, and the teacher responds in kind." },
  { title: "Level-appropriate language", body: "Vocabulary, depth, and pacing adjust to the academic level, from primary through university and professional training." },
  { title: "A real-time tutoring loop", body: "The teacher teaches continuously and answers in the moment, then returns to the lesson without losing the thread." },
];

export function AITeacherSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-24" aria-labelledby="ai-teacher-heading">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <div className="lp-fade-up">
          <SectionHeader
            id="ai-teacher-heading"
            eyebrow="The AI teacher"
            title="An AI teacher — not a chatbot"
            align="left"
            description="The AI teacher follows a pre-developed lesson plan but responds in real time when learners ask questions. It teaches a structured lesson end to end, then tutors on demand."
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TEACHER_TRAITS.map((t) => (
              <div key={t.title}>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">{t.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example interaction */}
        <div className="lp-fade-up lp-delay-2">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Example interaction</span>

            <div className="mt-4 space-y-4">
              <div className="flex justify-end">
                <p className="max-w-[80%] rounded-[14px] rounded-tr-[4px] bg-[#1F7C80] px-4 py-2.5 text-sm text-white">
                  Why did the answer become negative?
                </p>
              </div>
              <div className="flex justify-start">
                <p className="max-w-[85%] rounded-[14px] rounded-tl-[4px] bg-[#F1F5F9] px-4 py-2.5 text-sm leading-relaxed text-[#0F172A]">
                  Good question. We set each bracket to zero: x + 2 = 0 gives x = −2, and x + 3 = 0 gives x = −3. The
                  numbers inside the brackets are positive, but solving flips the sign — that's why the solutions are
                  negative.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Continue", "Show on board", "Explain simpler", "Give another example"].map((opt, i) => (
                <span
                  key={opt}
                  className={
                    "rounded-[10px] px-3 py-1.5 text-xs font-medium " +
                    (i === 0 ? "bg-[#1F7C80] text-white" : "border border-[#E2E8F0] bg-white text-[#475569]")
                  }
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   9. SUBJECTS
   ════════════════════════════════════════════════════════════════════ */
const SUBJECTS = [
  { icon: <Calculator className="h-5 w-5" />, title: "Mathematics", body: "Step-by-step equations, worked examples, guided practice, and targeted misconception correction." },
  { icon: <Atom className="h-5 w-5" />, title: "Sciences", body: "Labelled diagrams, processes explained stage by stage, and concept checks tied to each idea." },
  { icon: <Languages className="h-5 w-5" />, title: "Languages", body: "Vocabulary, grammar patterns, and reading comprehension with clear, level-appropriate examples." },
  { icon: <Landmark className="h-5 w-5" />, title: "History & Civics", body: "Key events, causes and effects, and source-based reasoning presented as flowing, readable notes." },
  { icon: <Globe2 className="h-5 w-5" />, title: "Geography", body: "Maps, systems, and case studies explained with visuals and structured summaries." },
  { icon: <Palette className="h-5 w-5" />, title: "Arts & Music", body: "Techniques, theory, and worked interpretation broken into approachable, illustrated steps." },
  { icon: <Code2 className="h-5 w-5" />, title: "Computer Science", body: "Code explanations, debugging walkthroughs, syntax examples, and hands-on practice tasks." },
  { icon: <Briefcase className="h-5 w-5" />, title: "Business & Training", body: "Frameworks, scenarios, and professional skills delivered as practical, applied lessons." },
];

export function SubjectsSection() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="subjects-heading">
      <Container>
        <SectionHeader
          id="subjects-heading"
          eyebrow="Every subject"
          title="Teaching that adapts to the subject"
          description="Klassruum presents each subject the way it should be taught — calculations and worked steps for technical subjects, flowing notes and summaries for theory, and visuals where they help."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((s) => (
            <SurfaceCard key={s.title} className="h-full">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#EFF6FF] text-[#1F7C80]">
                {s.icon}
              </div>
              <h3 className="mt-4 text-[16px] font-semibold text-[#0F172A]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{s.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   10. ACCESSIBILITY
   ════════════════════════════════════════════════════════════════════ */
const A11Y_MODES = [
  "Standard learners",
  "Deaf & hard-of-hearing",
  "Blind & low-vision",
  "Dyslexia support",
  "ADHD focus mode",
  "Motor support",
  "Speech difficulty support",
  "Extra support mode",
  "Challenge mode",
];

const A11Y_FEATURES = [
  { icon: <Captions className="h-4 w-4" />, label: "Live captions" },
  { icon: <Captions className="h-4 w-4" />, label: "Full transcript" },
  { icon: <Keyboard className="h-4 w-4" />, label: "Keyboard navigation" },
  { icon: <Eye className="h-4 w-4" />, label: "Screen reader support" },
  { icon: <AccessibilityIcon className="h-4 w-4" />, label: "High contrast" },
  { icon: <Type className="h-4 w-4" />, label: "Large text" },
  { icon: <Gauge className="h-4 w-4" />, label: "Reduced motion" },
  { icon: <Brain className="h-4 w-4" />, label: "Focus mode" },
  { icon: <Mic className="h-4 w-4" />, label: "Adjustable speech speed" },
];

export function AccessibilitySection() {
  return (
    <section className="bg-[#EFF6FF]/60 py-20 md:py-24" aria-labelledby="a11y-heading">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
        <div className="lp-fade-up">
          <SectionHeader
            id="a11y-heading"
            eyebrow="Inclusive by design"
            title="Built for every learner"
            align="left"
            description="Accessibility is a core part of the classroom, not an add-on. Klassruum adapts how a lesson is delivered so more learners can take part — built with WCAG-aligned design principles."
          />

          <h3 className="mt-8 text-sm font-semibold text-[#0F172A]">Learner modes</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {A11Y_MODES.map((m) => (
              <span key={m} className="rounded-[999px] border border-[#E2E8F0] bg-white px-3 py-1.5 text-sm text-[#475569]">
                {m}
              </span>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold text-[#0F172A]">Accessibility features</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {A11Y_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 rounded-[12px] border border-[#E2E8F0] bg-white px-3 py-2.5">
                <span className="text-[#1F7C80]">{f.icon}</span>
                <span className="text-sm text-[#0F172A]">{f.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#64748B]">
            Text-first and voice-first question modes are available where suitable. Advanced sign-language support is a
            possible future accessibility phase.
          </p>
        </div>

        {/* Deaf mode highlight */}
        <div className="lp-fade-up lp-delay-2">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#1F7C80]">
                <Captions className="h-4 w-4" />
              </span>
              <h3 className="text-[16px] font-semibold text-[#0F172A]">Deaf &amp; hard-of-hearing mode</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {[
                "Captions always visible during the lesson",
                "Full transcript saved for review",
                "Text-first questions and answers",
                "Visual alerts instead of audio-only cues",
                "Simplified explanation option",
                "No audio-only instruction — everything is also written",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#0F172A]">
                  <YesMark />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   11. FOR INSTITUTIONS
   ════════════════════════════════════════════════════════════════════ */
const INSTITUTION_BENEFITS = [
  "Manage teachers and learners in one place",
  "Create programmes and courses",
  "Upload your curriculum and materials",
  "Generate lessons from your content",
  "Review and publish lessons before they go live",
  "Monitor active classrooms in real time",
  "Track learner progress across cohorts",
  "Access saved notes and transcripts",
  "Use institution dashboards and reporting",
  "Apply your own branding (coming soon)",
];

export function InstitutionSection() {
  return (
    <section id="institutions" className="scroll-mt-20 py-20 md:py-24" aria-labelledby="institutions-heading">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="lp-fade-up">
          <SectionHeader
            id="institutions-heading"
            eyebrow="For institutions"
            title="Run AI classrooms across your whole institution"
            align="left"
            description="Klassruum gives schools and organizations the controls to create, review, publish, and monitor AI-led classrooms — with full visibility into learning activity."
          />
          <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {INSTITUTION_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[15px] text-[#0F172A]">
                <YesMark />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton to="/institutions/register" size="lg">
              Register Your Institution
            </CTAButton>
            <CTAButton to="/contact" variant="secondary" size="lg">
              Contact Sales
            </CTAButton>
          </div>
        </div>

        {/* Admin dashboard preview */}
        <div className="lp-fade-up lp-delay-2">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0F172A]">Institution overview</h3>
              <span className="rounded-[8px] bg-[#EFF6FF] px-2 py-1 text-[11px] font-medium text-[teal-800]">Live</span>
            </div>
            {/* EDITABLE METRIC: sample dashboard figures for illustration only. */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard value="42" label="Teachers online" />
              <StatCard value="1,280" label="Learners online" />
              <StatCard value="96" label="Active courses" />
              <StatCard value="18" label="Active classrooms" />
            </div>
            <div className="mt-3 rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#475569]">Lesson generation jobs</span>
                <span className="font-semibold text-[#0F172A]">3 running</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span>Average learner progress</span>
                  <span className="font-semibold text-[#16A34A]">74%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div className="h-full rounded-full bg-[#1F7C80]" style={{ width: "74%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   12. COMPARISON
   ════════════════════════════════════════════════════════════════════ */
const COMPARISON_ROWS: { label: string; klassruum: boolean; lms: boolean; video: boolean; chatbot: boolean }[] = [
  { label: "Full AI teacher-led lessons", klassruum: true, lms: false, video: false, chatbot: false },
  { label: "Course material to lesson generation", klassruum: true, lms: false, video: false, chatbot: false },
  { label: "Interactive whiteboard teaching", klassruum: true, lms: false, video: false, chatbot: false },
  { label: "Context-aware learner Q&A", klassruum: true, lms: false, video: false, chatbot: true },
  { label: "Captions and transcript", klassruum: true, lms: false, video: true, chatbot: false },
  { label: "Accessibility modes", klassruum: true, lms: false, video: false, chatbot: false },
  { label: "Progress and learning evidence", klassruum: true, lms: true, video: false, chatbot: false },
  { label: "Institution dashboards", klassruum: true, lms: true, video: false, chatbot: false },
  { label: "Lesson replay and notes", klassruum: true, lms: false, video: true, chatbot: false },
];

export function ComparisonSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-24" aria-labelledby="comparison-heading">
      <Container>
        <SectionHeader
          id="comparison-heading"
          eyebrow="How Klassruum compares"
          title="More than an LMS, a video call, or a chatbot"
          description="Each existing tool solves part of the problem. Klassruum delivers the complete, accessible, teacher-led lesson — and records the learning."
        />

        <div className="mt-12 overflow-x-auto rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Feature comparison of Klassruum, a traditional LMS, video conferencing tools, and AI chatbots</caption>
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th scope="col" className="p-4 text-sm font-semibold text-[#0F172A]">Capability</th>
                <th scope="col" className="p-4 text-center text-sm font-semibold text-[#1F7C80]">Klassruum</th>
                <th scope="col" className="p-4 text-center text-sm font-semibold text-[#475569]">Traditional LMS</th>
                <th scope="col" className="p-4 text-center text-sm font-semibold text-[#475569]">Video conferencing</th>
                <th scope="col" className="p-4 text-center text-sm font-semibold text-[#475569]">AI chatbot</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 1 ? "bg-[#F8FAFC]" : ""}>
                  <th scope="row" className="p-4 text-sm font-medium text-[#0F172A]">{row.label}</th>
                  <td className="p-4 text-center"><div className="flex justify-center">{row.klassruum ? <YesMark /> : <NoMark />}</div></td>
                  <td className="p-4 text-center"><div className="flex justify-center">{row.lms ? <YesMark /> : <NoMark />}</div></td>
                  <td className="p-4 text-center"><div className="flex justify-center">{row.video ? <YesMark /> : <NoMark />}</div></td>
                  <td className="p-4 text-center"><div className="flex justify-center">{row.chatbot ? <YesMark /> : <NoMark />}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   13. USE CASES
   ════════════════════════════════════════════════════════════════════ */
const USE_CASES = [
  { title: "K-12 schools", body: "Deliver consistent, curriculum-aligned lessons across classes, and give every learner a teacher who explains at their pace." },
  { title: "Universities", body: "Scale foundational and large-cohort courses with AI-led sessions, freeing faculty for higher-value teaching." },
  { title: "Tutoring centers", body: "Offer always-available, structured tutoring sessions that follow your own methods and materials." },
  { title: "Exam preparation", body: "Run focused revision lessons with worked examples, practice, and checkpoints that show readiness gaps." },
  { title: "NGOs & community education", body: "Provide accessible, low-friction learning to communities, including learners with diverse needs." },
  { title: "Corporate training", body: "Turn internal documents into structured onboarding and upskilling lessons with completion evidence." },
  { title: "Online academies", body: "Launch a full AI classroom experience around your content without building teaching infrastructure." },
  { title: "Special education support", body: "Use dedicated accessibility modes to adapt lessons for learners who need a different way in." },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="scroll-mt-20 py-20 md:py-24" aria-labelledby="use-cases-heading">
      <Container>
        <SectionHeader
          id="use-cases-heading"
          eyebrow="Use cases"
          title="Where institutions use Klassruum"
          description="From primary classrooms to professional training, Klassruum delivers structured, accessible lessons wherever teaching needs to scale."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u) => (
            <SurfaceCard key={u.title} className="h-full">
              <h3 className="text-[16px] font-semibold text-[#0F172A]">{u.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{u.body}</p>
            </SurfaceCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   14. ANALYTICS & LEARNING EVIDENCE
   ════════════════════════════════════════════════════════════════════ */
const ANALYTICS_ITEMS = [
  "Lessons started", "Lessons completed", "Time spent", "Questions asked",
  "Raised hands", "Checkpoints completed", "Notes generated", "Transcript generated",
  "Replay count", "Progress percentage", "Areas needing review",
];

export function AnalyticsSection() {
  return (
    <section className="bg-[#0F172A] py-20 text-white md:py-24" aria-labelledby="analytics-heading">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="lp-fade-up">
          <span className="inline-flex items-center gap-2 rounded-[999px] border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#93C5FD]">
            Learning evidence
          </span>
          <h2 id="analytics-heading" className="mt-4 text-[28px] font-bold tracking-tight sm:text-[34px] md:text-[40px]">
            Proof that learning actually happened
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-slate-300">
            Klassruum records learning activity and progress for every session — not exams or grades, but clear evidence
            of engagement and where learners need support. Institutions get visibility that completion rates alone can't
            provide.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton to="/demo/classroom" size="lg">Try Demo Classroom</CTAButton>
          </div>
        </div>

        <div className="lp-fade-up lp-delay-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ANALYTICS_ITEMS.map((item) => (
            <div key={item} className="rounded-[14px] border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   15. TESTIMONIALS  (PLACEHOLDER — replace with real, attributed quotes)
   ════════════════════════════════════════════════════════════════════ */
// EDITABLE TESTIMONIALS: these are illustrative placeholders, not verified
// customer quotes. Replace name, role, organization, and quote before launch.
const TESTIMONIALS = [
  {
    quote:
      "We turned our existing course packs into AI-led lessons in days. Learners get a teacher who explains every step, and we finally see where they struggle.",
    name: "Placeholder Name",
    role: "Head of Digital Learning",
    org: "Sample Secondary School",
  },
  {
    quote:
      "The captions, transcript, and focus mode made our lessons usable for students who were left behind by video-only tools.",
    name: "Placeholder Name",
    role: "Accessibility Coordinator",
    org: "Sample Community College",
  },
  {
    quote:
      "It isn't a chatbot. The AI teacher delivers the whole lesson and answers questions in context, which is exactly what our tutoring program needed.",
    name: "Placeholder Name",
    role: "Program Director",
    org: "Sample Tutoring Center",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="testimonials-heading">
      <Container>
        <SectionHeader
          id="testimonials-heading"
          eyebrow="What educators say"
          title="Trusted by teaching teams"
          description="How institutions describe teaching with Klassruum."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="flex h-full flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <Quote className="h-6 w-6 text-[#1F7C80]" aria-hidden />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[#0F172A]">“{t.quote}”</blockquote>
              <figcaption className="mt-5 border-t border-[#E2E8F0] pt-4">
                <div className="text-sm font-semibold text-[#0F172A]">{t.name}</div>
                <div className="text-sm text-[#64748B]">{t.role}, {t.org}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   16. FAQ
   ════════════════════════════════════════════════════════════════════ */
const FAQS = [
  { q: "What is Klassruum?", a: "Klassruum is an AI-powered virtual classroom platform. Institutions upload course materials, generate structured lessons, and let an AI teacher deliver those lessons inside a realistic classroom with a whiteboard, voice, captions, notes, transcripts, learner questions, accessibility modes, and progress tracking." },
  { q: "How does the AI teacher work?", a: "The AI teacher follows a pre-developed lesson plan with objectives and a clear progression. It introduces the lesson, writes on the whiteboard, reads each item, explains it, and answers learner questions in real time using the current lesson and your course materials." },
  { q: "Is Klassruum a chatbot?", a: "No. A chatbot waits for prompts and answers questions. Klassruum delivers a complete, structured lesson from start to finish and tutors on demand within that lesson — the classroom is the product, not a chat window." },
  { q: "Can institutions upload their own course content?", a: "Yes. You can upload PDFs, slides, documents, syllabi, and images, and Klassruum generates structured lessons from them for a teacher or admin to review and publish." },
  { q: "Does Klassruum support different subjects?", a: "Yes. Klassruum adapts to the subject — worked steps and calculations for technical subjects like mathematics and computer science, and flowing notes and summaries for theory subjects, with visuals where they help." },
  { q: "How does Klassruum support learners with disabilities?", a: "Accessibility is built in: live captions, full transcripts, keyboard navigation, screen reader support, high contrast, large text, reduced motion, focus mode, adjustable speech speed, and text-first or voice-first questions. Dedicated modes adapt the classroom for deaf, low-vision, dyslexic, and other learners." },
  { q: "Can learners ask questions during the lesson?", a: "Yes. Learners can ask by voice or text at any point. The AI answers using the current lesson context, asks for clarification if a question is unclear, and can show the answer on the board or explain it more simply." },
  { q: "Does Klassruum save notes and transcripts?", a: "Yes. Clean, revision-ready notes are generated as the lesson runs, and a full transcript of the session is saved for review and replay." },
  { q: "Can schools manage teachers and learners?", a: "Yes. Institution admins create programmes and courses, manage teachers and learners, review and publish lessons, and monitor active classrooms from a dashboard." },
  { q: "Is Klassruum suitable for universities and training providers?", a: "Yes. Klassruum works for K-12 schools, universities, tutoring centers, NGOs, corporate training, and online academies — anywhere structured, accessible teaching needs to scale." },
  { q: "How is learner progress tracked?", a: "Klassruum records learning activity such as lessons started and completed, time spent, questions asked, checkpoints reached, notes and transcripts generated, replay count, progress percentage, and areas needing review. This is learning evidence, not exams or grading." },
  { q: "Can Klassruum be embedded into other websites later?", a: "Embedding into institution sites and portals is on the roadmap. If this is important to your rollout, contact us and we'll share current options and timelines." },
];

function FAQItem({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="text-[15px] font-semibold text-[#0F172A]">{q}</span>
          <ChevronDown
            className={"h-5 w-5 shrink-0 text-[#64748B] transition-transform duration-200 " + (open ? "rotate-180" : "")}
            aria-hidden
          />
        </button>
      </h3>
      {open && (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-button`} className="px-5 pb-5">
          <p className="text-[15px] leading-relaxed text-[#475569]">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-24" aria-labelledby="faq-heading">
      <Container className="max-w-[840px]">
        <SectionHeader id="faq-heading" eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => (
            <FAQItem
              key={f.q}
              id={`faq-${i}`}
              q={f.q}
              a={f.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   17. SOCIAL PROOF
   ════════════════════════════════════════════════════════════════════ */
export function SocialProofSection() {
  const stats = [
    { value: "50+", label: "Institutions" },
    { value: "10,000+", label: "Learners reached" },
    { value: "500+", label: "Lessons delivered" },
    { value: "8", label: "Subjects supported" },
  ];

  return (
    <section className="border-y border-[#E2E8F0] bg-white py-14" aria-labelledby="social-proof-heading">
      <Container>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-[999px] border border-[#E2E8F0] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[teal-800]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Growing fast
          </span>
          <h2 id="social-proof-heading" className="mt-4 text-[28px] font-bold tracking-tight text-[#0F172A] sm:text-[34px]">
            Institutions are already teaching with Klassruum
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-[#475569]">
            Schools, universities, tutoring centers, and NGOs are using Klassruum to deliver structured, accessible lessons at scale.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-6 text-center">
              <div className="text-[32px] font-bold tracking-tight text-[#1F7C80]">{s.value}</div>
              <div className="mt-1 text-sm font-medium text-[#475569]">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#94A3B8]">
          Illustrative figures. Verified metrics will be published before general availability.
        </p>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   18. PRICING PREVIEW
   ════════════════════════════════════════════════════════════════════ */
const PRICING_PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "to try",
    description: "Explore the demo classroom and see how Klassruum works — no setup required.",
    features: ["Full demo classroom", "AI teacher-led lesson", "Captions & transcript", "Accessibility modes", "No account required"],
    cta: { label: "Try Demo", to: "/demo/classroom" },
    highlighted: false,
  },
  {
    name: "School",
    price: "Custom",
    period: "per institution",
    description: "For primary and secondary schools ready to deploy AI classrooms across classes.",
    features: ["Unlimited teachers & learners", "Course & lesson management", "Curriculum-aligned content", "Institution dashboard", "Progress tracking", "Priority support"],
    cta: { label: "Register Your School", to: "/institutions/register" },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per institution",
    description: "For universities, training providers, and large organizations with custom needs.",
    features: ["Everything in School", "Custom branding", "SSO & advanced security", "API & integrations", "Dedicated account manager", "SLA & compliance"],
    cta: { label: "Contact Sales", to: "/contact" },
    highlighted: false,
  },
];

export function PricingPreviewSection() {
  return (
    <section className="bg-[#F8FAFC] py-20 md:py-24" aria-labelledby="pricing-heading">
      <Container>
        <SectionHeader
          id="pricing-heading"
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start with a free demo. Institutional plans scale with your needs — no hidden fees, no per-learner charges."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={
                "flex flex-col rounded-[20px] border p-6 shadow-[0_8px_24px_rgba(15,23,42,0.06)] " +
                (plan.highlighted
                  ? "border-[#1F7C80] bg-white ring-2 ring-[#1F7C80]/10"
                  : "border-[#E2E8F0] bg-white")
              }
            >
              {plan.highlighted && (
                <span className="mb-3 inline-flex w-fit rounded-[999px] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[teal-800]">
                  Most popular
                </span>
              )}
              <h3 className="text-[18px] font-bold text-[#0F172A]">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[36px] font-bold tracking-tight text-[#0F172A]">{plan.price}</span>
                <span className="text-sm text-[#64748B]">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">{plan.description}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#0F172A]">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <CTAButton
                to={plan.cta.to}
                variant={plan.highlighted ? "primary" : "secondary"}
                size="lg"
                className="mt-6 w-full"
              >
                {plan.cta.label}
              </CTAButton>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <CTAButton to="/pricing" variant="ghost">
            See full pricing details →
          </CTAButton>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   19. SECURITY & COMPLIANCE
   ════════════════════════════════════════════════════════════════════ */
const SECURITY_ITEMS = [
  { icon: <Lock className="h-5 w-5" />, title: "Data encryption", body: "All data is encrypted in transit and at rest using industry-standard protocols." },
  { icon: <Shield className="h-5 w-5" />, title: "Access controls", body: "Role-based permissions ensure teachers, learners, and admins only see what they need." },
  { icon: <Globe className="h-5 w-5" />, title: "GDPR-ready", body: "Purpose-limited data collection, institution-controlled retention, and export/deletion workflows." },
  { icon: <CheckCircle className="h-5 w-5" />, title: "Institution ownership", body: "Institutions control their courses, users, and classroom records — Klassruum doesn't sell or share learner data." },
  { icon: <Lock className="h-5 w-5" />, title: "Secure infrastructure", body: "Hosted on enterprise-grade cloud infrastructure with automated backups and monitoring." },
  { icon: <Shield className="h-5 w-5" />, title: "Audit logging", body: "Administrative actions and classroom events are logged for accountability and compliance." },
];

export function SecuritySection() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="security-heading">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="lp-fade-up">
          <SectionHeader
            id="security-heading"
            eyebrow="Security & compliance"
            title="Built for institutions that take data seriously"
            align="left"
            description="Klassruum is designed for schools and organizations that need clear control over learner records, classroom activity, and data governance."
          />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SECURITY_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#1F7C80]">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#0F172A]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#475569]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-fade-up lp-delay-2">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#1F7C80]">
                <Shield className="h-4 w-4" />
              </span>
              <h3 className="text-[16px] font-semibold text-[#0F172A]">Your data, your control</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                "Institutions own their course content and learner records",
                "No learner data is used for advertising or sold to third parties",
                "Administrators control who sees what — teachers, learners, and guardians",
                "Retention and deletion policies match your institution's requirements",
                "Classroom activity is logged for accountability and safeguarding",
                "Contact us for our full data processing agreement",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#0F172A]">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#16A34A]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   20. INTEGRATIONS & COMPATIBILITY
   ════════════════════════════════════════════════════════════════════ */
const INTEGRATION_ITEMS = [
  { icon: <Link2 className="h-5 w-5" />, title: "LMS compatibility", body: "Designed to complement your existing learning management system — not replace it." },
  { icon: <Globe className="h-5 w-5" />, title: "Browser-based", body: "No installs, no plugins. Runs on Chrome, Firefox, Safari, and Edge on any device." },
  { icon: <Zap className="h-5 w-5" />, title: "Low-bandwidth friendly", body: "Optimized for classrooms with limited internet — works on modest devices and patchy connections." },
  { icon: <Upload className="h-5 w-5" />, title: "Import your content", body: "Upload PDFs, slides, Word docs, images, and syllabi — Klassruum generates lessons from them." },
  { icon: <LayoutDashboard className="h-5 w-5" />, title: "SSO ready", body: "Enterprise plans support single sign-on for seamless institution-wide access." },
  { icon: <Code2 className="h-5 w-5" />, title: "API access", body: "Integrate Klassruum into your existing workflows and portals with our API." },
];

export function IntegrationsSection() {
  return (
    <section className="bg-[#EFF6FF]/60 py-20 md:py-24" aria-labelledby="integrations-heading">
      <Container>
        <SectionHeader
          id="integrations-heading"
          eyebrow="Integrations"
          title="Fits into your existing setup"
          description="Klassruum is designed to work alongside the tools and systems your institution already uses."
        />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATION_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-[18px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#1F7C80]">
                {item.icon}
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-[#0F172A]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#475569]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   21. FINAL CTA
   ════════════════════════════════════════════════════════════════════ */
export function FinalCTA() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="final-cta-heading">
      <Container>
        <div className="relative overflow-hidden rounded-[24px] border border-[teal-800] bg-[#1F7C80] px-6 py-14 text-center shadow-[0_12px_32px_rgba(37,99,235,0.25)] sm:px-12">
          <div className="lp-blob -right-10 -top-10 h-56 w-56 bg-white/10" aria-hidden />
          <h2 id="final-cta-heading" className="relative text-[28px] font-bold tracking-tight text-white sm:text-[36px]">
            Ready to build your AI-powered classroom?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-[#a3d9d8]">
            Try a live AI teacher classroom demo, or register your institution to start turning your course materials into
            structured, accessible lessons.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CTAButton to="/demo/classroom" variant="secondary" size="lg">
              Try Demo Classroom
            </CTAButton>
            <CTAButton
              to="/institutions/register"
              size="lg"
              className="bg-[#0F172A] text-white shadow-none hover:bg-[#0b1220]"
            >
              Register Your School
            </CTAButton>
          </div>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#a3d9d8]">
            <span className="inline-flex items-center gap-1.5"><Plus className="h-4 w-4" aria-hidden /> No complex setup</span>
            <span className="inline-flex items-center gap-1.5"><Plus className="h-4 w-4" aria-hidden /> Institution-ready</span>
            <span className="inline-flex items-center gap-1.5"><Plus className="h-4 w-4" aria-hidden /> Accessible learning</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
