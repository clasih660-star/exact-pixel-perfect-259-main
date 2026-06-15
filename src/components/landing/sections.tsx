import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Layout,
  Captions,
  Sparkles,
  Shield,
  School,
  Building2,
  Users,
  Briefcase,
  HeartHandshake,
  MonitorPlay,
  ArrowRight,
  Check,
  X,
  Play,
  Pause,
  Upload,
  ChevronDown,
  Volume2,
  Lock,
  Eye,
  FileText,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  KeyRound,
  FileSearch,
  BookOpen,
  Settings,
  HelpCircle
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   SECTION 1: HERO
   ════════════════════════════════════════════════════════════════════ */

export function HeroSection() {
  const metrics = [
    { value: "24/7", label: "Structured teaching delivery", icon: GraduationCap },
    { value: "WCAG", label: "Accessibility built into the classroom", icon: Eye },
    { value: "Evidence", label: "Progress, notes, and transcripts captured", icon: ShieldCheck },
    { value: "Secure", label: "Institution-controlled deployment", icon: Lock }
  ];

  return (
    <section className="hero relative overflow-hidden">
      <div className="container hero-grid relative z-10">
        {/* Left: Text & Actions */}
        <div className="hero-content lp-reveal lp-reveal-delay-1" data-reveal>
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-[#059669]" /> For schools, universities, and training providers
          </span>

          <h1 className="mt-4 text-slate-900 dark:text-white leading-[1.12]">
            Turn curriculum into <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#3fa8ab] dark:to-[#ccfbf1] font-extrabold">AI-led classrooms</span> that actually teach.
          </h1>

          <p className="hero-description text-slate-600 dark:text-slate-300">
            Klassruum transforms approved course materials into live, accessible classroom sessions with guided explanations, whiteboard teaching, learner questions, captions, transcripts, and institution-ready learning evidence.
          </p>

          <div className="hero-actions">
            <Link to="/demo/classroom" className="btn btn-primary lp-magnetic" data-magnetic data-magnetic-strength="14">
              Explore Demo Classroom <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/institutions/register" className="btn btn-secondary lp-magnetic" data-magnetic data-magnetic-strength="14">
              Register Your Institution
            </Link>
          </div>

          <p className="mt-4 max-w-[44rem] text-sm font-medium text-slate-500 dark:text-slate-400">
            Built for organisations that need more than a chatbot or content repository—Klassruum delivers structured teaching, learner support, and institutional oversight in one classroom experience.
          </p>

          <div className="hero-trust">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-green-500)" }} /> No installation for learners
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-green-500)" }} /> Accessibility by design
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-green-500)" }} /> Governance and reporting built in
            </span>
          </div>
        </div>

        {/* Right: Layered Classroom Composition Mockup */}
        <div className="hero-visual lp-reveal lp-reveal-delay-2" data-reveal>
          <div className="product-window shadow-xl lp-premium-card">
            <div className="product-window-header border-b border-color-border/60">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#eab308" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                <span className="ml-2 font-headings font-bold text-xs bg-color-blue-100 text-color-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded" style={{ backgroundColor: "var(--color-blue-100)", color: "var(--color-blue-700)" }}>
                  Quadratic Equations
                </span>
              </div>
              <div className="text-[10px] bg-color-amber-50 text-color-amber-600 dark:bg-amber-950/20 dark:text-amber-400 px-2.5 py-0.5 rounded font-bold border border-color-amber-100" style={{ backgroundColor: "var(--color-amber-50)", color: "var(--color-amber-600)", borderColor: "var(--color-amber-100)" }}>
                Live AI Session
              </div>
            </div>

            <div className="product-window-body">
              {/* Product window sidebar (Outline) */}
              <div className="product-sidebar">
                <div className="text-[9px] font-bold text-color-text-muted uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Lesson Plan
                </div>
                <div className="space-y-1.5 font-bold text-[10px] text-color-text-primary" style={{ color: "var(--color-text-primary)" }}>
                  <div className="text-color-text-secondary font-normal" style={{ color: "var(--color-text-secondary)" }}>1. Introduce Concept</div>
                  <div className="text-color-primary flex items-center gap-1 font-bold" style={{ color: "var(--color-primary)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-color-primary" style={{ backgroundColor: "var(--color-primary)" }} /> 2. Worked Example
                  </div>
                  <div className="text-color-text-muted font-normal" style={{ color: "var(--color-text-muted)" }}>3. Question Checkpoint</div>
                  <div className="text-color-text-muted font-normal" style={{ color: "var(--color-text-muted)" }}>4. Solved Roots</div>
                </div>
              </div>

              {/* Product window main whiteboard */}
              <div className="product-main flex flex-col justify-between" style={{ minHeight: "180px" }}>
                <div className="text-[9px] font-bold text-color-text-muted uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                  Learning Whiteboard
                </div>
                <div className="my-auto text-center font-bold text-lg text-color-text-primary select-none" style={{ fontFamily: "Caveat, cursive", color: "var(--color-text-primary)" }}>
                  <div className="text-color-primary text-xl" style={{ color: "var(--color-primary)" }}>x² + 5x + 6 = 0</div>
                  <div className="text-sm mt-1 text-color-text-secondary" style={{ color: "var(--color-text-secondary)" }}>(x + 2)(x + 3) = 0</div>
                  <div className="text-sm text-color-success font-semibold" style={{ color: "var(--color-success)" }}>→ x = -2 or x = -3</div>
                </div>
                <div className="text-[10px] text-color-text-secondary border-t border-color-border/60 pt-2 flex items-center gap-1" style={{ color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-color-success animate-pulse" style={{ backgroundColor: "var(--color-success)" }} />
                  <span>Ada: "We set each factor bracket to zero..."</span>
                </div>
              </div>

              {/* Product window panel (Teacher video) */}
              <div className="product-panel flex flex-col justify-between">
                <div className="bg-color-navy-950 text-white rounded-lg p-2.5 text-center flex flex-col items-center" style={{ backgroundColor: "var(--color-navy-950)" }}>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                    MA
                  </div>
                  <div className="mt-1 font-bold text-[9px] truncate w-full">Ms. Ada</div>
                  <div className="text-[8px] text-color-teal-100 font-semibold" style={{ color: "var(--color-teal-100)" }}>AI Teacher</div>
                </div>
                <div className="bg-color-white border border-color-border rounded-lg p-2.5 text-center dark:bg-slate-900" style={{ backgroundColor: "var(--color-white)", borderColor: "var(--color-border)" }}>
                  <div className="text-[13px] font-extrabold text-color-primary" style={{ color: "var(--color-primary)" }}>86%</div>
                  <div className="text-[7px] text-color-text-muted uppercase font-bold" style={{ color: "var(--color-text-muted)" }}>Session Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards with glassmorphism */}
          <div className="floating-card p-3 max-w-[170px] z-20 animate-kr-float kr-glass" style={{ bottom: "24px", left: "-20px" }}>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-color-primary" style={{ backgroundColor: "var(--color-primary)" }} />
              <span className="text-[9px] font-bold uppercase text-color-text-secondary" style={{ color: "var(--color-text-secondary)" }}>Learner Question</span>
            </div>
            <p className="text-[11px] font-bold text-color-text-primary mt-1" style={{ color: "var(--color-text-primary)" }}>
              "Why did the signs flip to negative?"
            </p>
          </div>

          {/* Backgroundless student cutout */}
          <div className="absolute -bottom-8 -right-4 w-[130px] md:w-[155px] z-20 pointer-events-none drop-shadow-xl">
            <img
              src="/images/student-cutout-1.png"
              alt="Learner using a laptop"
              className="w-full h-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="w-[85%] h-3 bg-black/15 blur-md rounded-full mx-auto -mt-2" />
          </div>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="container relative z-10">
        <div className="hero-stats lp-premium-card lp-reveal lp-reveal-delay-3" data-reveal>
          {metrics.map((m) => (
            <div key={m.label} className="stat-item hover:scale-[1.03] transition-transform duration-300">
              <div className="stat-icon bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="stat-value text-blue-600 dark:text-blue-400">{m.value}</div>
                <div className="stat-label">{m.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 2: INSTITUTION STRIP
   ════════════════════════════════════════════════════════════════════ */

export function InstitutionStrip() {
  const types = [
    { label: "Schools", icon: School },
    { label: "Universities", icon: Building2 },
    { label: "Tutoring Centres", icon: Users },
    { label: "Training Providers", icon: Briefcase },
    { label: "NGOs", icon: HeartHandshake },
    { label: "Online Academies", icon: MonitorPlay }
  ];

  return (
    <section className="py-6 border-y border-color-border/60 bg-color-white" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-white)" }}>
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-color-text-secondary" style={{ color: "var(--color-text-secondary)", fontSize: "0.8rem" }}>
            Designed for every serious learning environment
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {types.map((type) => (
            <div key={type.label} className="flex items-center gap-2 text-color-text-primary hover:text-color-primary transition-colors duration-150" style={{ color: "var(--color-text-primary)" }}>
              <type.icon className="h-4.5 w-4.5 text-color-text-muted shrink-0" style={{ color: "var(--color-text-muted)" }} />
              <span className="text-xs font-bold">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 3: PROBLEM AND TRANSFORMATION
   ════════════════════════════════════════════════════════════════════ */

export function ProblemSection() {
  const problems = [
    "Content stored but not taught.",
    "Teachers limited by schedules.",
    "Chatbots respond without lesson structure.",
    "Accessibility added too late.",
    "Completion data provides little learning evidence."
  ];

  const solutions = [
    "Structured teacher-led delivery.",
    "Available across cohorts and time zones.",
    "Questions answered within the current lesson.",
    "Accessibility integrated into delivery.",
    "Notes, transcripts and progress captured automatically."
  ];

  return (
    <section className="section section-light relative">
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">The Gap Today</span>
          <h2 className="text-slate-900 dark:text-white">Why institutions need more than content and chat</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Most platforms store materials, stream video, or answer prompts. Klassruum delivers the missing layer: structured classroom teaching with accessibility, learner interaction, and measurable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Today's Problems */}
          <div className="card card-padding lp-premium-card lp-reveal lp-reveal-delay-1" data-reveal>
            <div className="flex items-center gap-2 mb-6">
              <X className="h-5 w-5 text-color-danger" style={{ color: "var(--color-danger)" }} />
              <h3 className="text-[17px] font-bold text-color-text-primary dark:text-white" style={{ margin: 0 }}>What institutions juggle today</h3>
            </div>
            <ul className="space-y-4" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {problems.map((prob) => (
                <li key={prob} className="flex items-start gap-3 text-sm font-semibold text-color-text-secondary dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-color-text-muted shrink-0 mt-2" style={{ backgroundColor: "var(--color-text-muted)" }} />
                  {prob}
                </li>
              ))}
            </ul>
          </div>

          {/* Klassruum Solution */}
          <div className="card card-padding lp-premium-card lp-reveal lp-reveal-delay-2" data-reveal style={{ background: "linear-gradient(180deg, rgba(239, 246, 255, 0.72), rgba(219, 234, 254, 0.72))", borderColor: "rgba(147, 197, 253, 0.4)" }}>
            <div className="flex items-center gap-2 mb-6">
              <Check className="h-5 w-5 text-color-success" style={{ color: "var(--color-success)" }} />
              <h3 className="text-[17px] font-bold text-color-text-primary dark:text-slate-900" style={{ margin: 0 }}>What changes with Klassruum</h3>
            </div>
            <ul className="space-y-4" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {solutions.map((sol) => (
                <li key={sol} className="flex items-start gap-3 text-sm font-bold text-color-navy-900 dark:text-slate-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-color-primary shrink-0 mt-2" style={{ backgroundColor: "var(--color-primary)" }} />
                  {sol}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 4: LIVE CLASSROOM DEMONSTRATION
   ════════════════════════════════════════════════════════════════════ */

export function ClassroomExperienceSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: "1. Introduce Lesson",
      captions: "Hello students! Welcome to Form 2 Mathematics. Today, we're exploring Quadratic Equations. We'll start with how to factor equations to solve for x.",
      whiteboard: ["Quadratic Equations", "Goal: Solve for x", "x² + 5x + 6 = 0"],
      notes: "A quadratic equation always equals zero before factoring.",
      progress: 20
    },
    {
      title: "2. Worked Example",
      captions: "Let's factor by looking for two numbers that multiply to 6 and add to 5. These numbers are 2 and 3.",
      whiteboard: ["Quadratic Equations", "Goal: Solve for x", "x² + 5x + 6 = 0", "Find factors of 6 that add to 5", "2 × 3 = 6  and  2 + 3 = 5"],
      notes: "Factoring splits x² + bx + c = 0 into (x + p)(x + q) = 0.",
      progress: 50
    },
    {
      title: "3. Student Question",
      captions: "Excellent question! A learner asks why signs flip. We set each bracket factor to zero: x + 2 = 0 gives x = -2.",
      whiteboard: ["Quadratic Equations", "Goal: Solve for x", "x² + 5x + 6 = 0", "Find factors of 6 that add to 5", "2 × 3 = 6  and  2 + 3 = 5", "(x + 2)(x + 3) = 0"],
      question: "Why did the answer become negative?",
      answer: "Because we solve by setting each factor bracket to zero: x + 2 = 0.",
      notes: "(x + 2)(x + 3) = 0 means x+2=0 or x+3=0.",
      progress: 80
    },
    {
      title: "4. Solve Roots",
      captions: "So setting each factor to zero gives us our solved roots: x = -2 or x = -3. And we're done!",
      whiteboard: ["Quadratic Equations", "Goal: Solve for x", "x² + 5x + 6 = 0", "Find factors of 6 that add to 5", "2 × 3 = 6  and  2 + 3 = 5", "(x + 2)(x + 3) = 0", "x + 2 = 0 → x = -2", "x + 3 = 0 → x = -3"],
      notes: "Final roots solved: x = -2 and x = -3.",
      progress: 100
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= steps.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const stepData = steps[activeStep];

  return (
    <section id="classroom" className="section section-soft border-y border-color-border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">Visual Demo</span>
          <h2 className="text-slate-900 dark:text-white">See how a real AI lesson unfolds</h2>
          <p className="text-slate-600 dark:text-slate-300">
            This is where Klassruum differentiates itself: a guided classroom flow that coordinates explanation, whiteboard work, learner questions, captions, and progress in one lesson experience.
          </p>
        </div>

        {/* 3 Callouts row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="card card-padding lp-premium-card lp-reveal lp-reveal-delay-1 flex gap-3" data-reveal>
            <span className="h-6 w-6 rounded-full bg-color-blue-50 text-color-blue-700 dark:bg-blue-950/40 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-700)" }}>1</span>
            <div>
              <h3 className="font-bold text-color-text-primary dark:text-white text-sm" style={{ color: "var(--color-text-primary)" }}>Teaches continuously</h3>
              <p className="text-xs text-color-text-secondary dark:text-slate-300 mt-1" style={{ color: "var(--color-text-secondary)" }}>Delivers structured, syllabus-grounded lesson plans without prompting.</p>
            </div>
          </div>
          <div className="card card-padding lp-premium-card lp-reveal lp-reveal-delay-2 flex gap-3" data-reveal>
            <span className="h-6 w-6 rounded-full bg-color-blue-50 text-color-blue-700 dark:bg-blue-950/40 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-700)" }}>2</span>
            <div>
              <h3 className="font-bold text-color-text-primary dark:text-white text-sm" style={{ color: "var(--color-text-primary)" }}>Answers in context</h3>
              <p className="text-xs text-color-text-secondary dark:text-slate-300 mt-1" style={{ color: "var(--color-text-secondary)" }}>Answers questions inside the lesson, clarifying queries without wandering off-topic.</p>
            </div>
          </div>
          <div className="card card-padding lp-premium-card lp-reveal lp-reveal-delay-3 flex gap-3" data-reveal>
            <span className="h-6 w-6 rounded-full bg-color-blue-50 text-color-blue-700 dark:bg-blue-950/40 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0" style={{ backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-700)" }}>3</span>
            <div>
              <h3 className="font-bold text-color-text-primary dark:text-white text-sm" style={{ color: "var(--color-text-primary)" }}>Records every session</h3>
              <p className="text-xs text-color-text-secondary dark:text-slate-300 mt-1" style={{ color: "var(--color-text-secondary)" }}>Captures progress reports, transcripts, notes, and comprehensive learner analytics.</p>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 lp-reveal" data-reveal>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-primary lp-magnetic"
            data-magnetic
            style={{ minHeight: "40px", padding: "0.5rem 1rem", fontSize: "0.8rem" }}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isPlaying ? "Autoplay On" : "Pause Autoplay"}
          </button>
          
          <div className="h-4 w-[1px] bg-color-border dark:bg-slate-700 hidden sm:block" style={{ backgroundColor: "var(--color-border)" }} />

          {steps.map((step, idx) => (
            <button
              key={step.title}
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              className={cn(
                "btn border lp-magnetic",
                activeStep === idx
                  ? "bg-color-blue-600 border-color-blue-600 text-white"
                  : "bg-white border-color-border text-color-text-secondary dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
              )}
              data-magnetic
              style={{ minHeight: "40px", padding: "0.5rem 1.1rem", fontSize: "0.8rem", backgroundColor: activeStep === idx ? "var(--color-blue-600)" : undefined, borderColor: activeStep === idx ? "var(--color-blue-600)" : undefined, color: activeStep === idx ? "var(--color-white)" : undefined }}
            >
              {step.title}
            </button>
          ))}
        </div>

        {/* Browser Mockup */}
        <div className="product-window shadow-2xl max-w-4xl mx-auto lp-premium-card lp-reveal" data-reveal>
          <div className="product-window-header border-b border-color-border/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#eab308" }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
              <span className="ml-2 font-bold text-xs bg-color-blue-100 text-color-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2 py-0.5 rounded" style={{ backgroundColor: "var(--color-blue-100)", color: "var(--color-blue-700)" }}>Form 2 Math</span>
            </div>
            <div className="text-[10px] text-[#22c55e] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" /> Live lesson preview
            </div>
          </div>

          <div className="product-window-body">
            {/* Outline */}
            <div className="product-sidebar">
              <div className="text-[9px] font-bold text-color-text-muted uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Outline</div>
              <ul className="space-y-2 text-[10px] font-bold text-color-text-primary" style={{ padding: 0, listStyle: "none", color: "var(--color-text-primary)" }}>
                <li className={activeStep >= 0 ? "text-color-success" : "text-color-text-muted"} style={{ color: activeStep >= 0 ? "var(--color-success)" : "var(--color-text-muted)" }}>
                  {activeStep >= 0 ? "✓" : "○"} Concept Intro
                </li>
                <li className={activeStep >= 1 ? (activeStep === 1 ? "text-color-primary" : "text-color-success") : "text-color-text-muted"} style={{ color: activeStep >= 1 ? (activeStep === 1 ? "var(--color-primary)" : "var(--color-success)") : "var(--color-text-muted)" }}>
                  {activeStep >= 2 ? "✓" : (activeStep === 1 ? "▶" : "○")} Worked Example
                </li>
                <li className={activeStep >= 2 ? (activeStep === 2 ? "text-color-primary" : "text-color-success") : "text-color-text-muted"} style={{ color: activeStep >= 2 ? (activeStep === 2 ? "var(--color-primary)" : "var(--color-success)") : "var(--color-text-muted)" }}>
                  {activeStep >= 3 ? "✓" : (activeStep === 2 ? "▶" : "○")} Student Question
                </li>
                <li className={activeStep >= 3 ? "text-color-primary" : "text-color-text-muted"} style={{ color: activeStep >= 3 ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                  {activeStep >= 3 ? "▶" : "○"} Solved Roots
                </li>
              </ul>
            </div>

            {/* Main Board with Pen Cursor */}
            <div className="product-main flex flex-col justify-between vc-whiteboard-content dark:bg-[#0b1220]" style={{ minHeight: "220px" }}>
              <div className="text-[9px] font-bold text-color-text-muted uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Whiteboard</div>
              <div className="my-auto text-left pl-4 space-y-2 select-none" style={{ fontFamily: "Caveat, cursive", color: "var(--color-text-primary)" }}>
                {stepData.whiteboard.map((line, idx) => (
                  <div key={line} className={cn("text-xl sm:text-2xl font-bold transition-all duration-300 flex items-center gap-1.5", idx === stepData.whiteboard.length - 1 ? "text-color-primary animate-kr-fade-up" : "text-color-text-primary dark:text-slate-200")} style={{ color: idx === stepData.whiteboard.length - 1 ? "var(--color-primary)" : undefined }}>
                    <span>{line}</span>
                    {idx === stepData.whiteboard.length - 1 && isPlaying && (
                      <span className="vc-hand-cursor animate-pulse shrink-0 inline-block" style={{ width: "22px", height: "22px" }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-color-border/60 pt-2 flex items-center justify-between text-[10px] text-color-text-secondary" style={{ color: "var(--color-text-secondary)", borderColor: "var(--color-border)" }}>
                <span>Lesson progress: {stepData.progress}%</span>
                <div className="h-1.5 w-1/3 bg-color-blue-100 dark:bg-slate-800 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-blue-100)" }}>
                  <div className="h-full bg-color-primary transition-all duration-500" style={{ width: `${stepData.progress}%`, backgroundColor: "var(--color-primary)" }} />
                </div>
              </div>
            </div>

            {/* Live Tutor Panel */}
            <div className="product-panel flex flex-col justify-between">
              {/* Teacher Video */}
              <div className="bg-color-navy-950 text-white rounded-lg p-2.5 text-center flex flex-col items-center shadow" style={{ backgroundColor: "var(--color-navy-950)" }}>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">MA</div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-color-success rounded-full border border-color-navy-950" style={{ backgroundColor: "var(--color-success)" }} />
                </div>
                <h4 className="mt-1 font-bold text-[9px] truncate w-full">Ms. Ada</h4>
                <p className="text-[7px] text-color-teal-100 uppercase tracking-wider" style={{ color: "var(--color-teal-100)" }}>AI Teacher</p>
              </div>

              {/* Live QA or Cap */}
              <div className="bg-white border border-color-border rounded-lg p-2.5 flex-1 flex flex-col justify-between mt-2 dark:bg-slate-900 dark:border-slate-800" style={{ backgroundColor: "var(--color-white)", borderColor: "var(--color-border)" }}>
                <div>
                  <div className="text-[8px] font-bold uppercase text-color-text-muted" style={{ color: "var(--color-text-muted)" }}>Q&A Check</div>
                  {stepData.question ? (
                    <div className="mt-1 space-y-1">
                      <div className="text-[9px] font-bold text-color-text-primary dark:text-white">Q: "{stepData.question}"</div>
                      <div className="text-[9px] text-color-success">A: "{stepData.answer}"</div>
                    </div>
                  ) : (
                    <p className="text-[9px] text-color-text-muted italic dark:text-slate-400" style={{ color: "var(--color-text-muted)" }}>Interactive questions appear here during lesson play.</p>
                  )}
                </div>
                <div className="text-[9px] text-color-text-muted border-t border-color-border/60 pt-1 dark:text-slate-400 dark:border-slate-850" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>
                  Capturing notes...
                </div>
              </div>
            </div>
          </div>
          
          {/* Captions overlay bar */}
          <div className="bg-color-navy-950 text-white p-3.5 flex items-start gap-3 border-t border-white/10" style={{ backgroundColor: "var(--color-navy-950)" }}>
            <Volume2 className="h-5 w-5 text-color-teal-100 shrink-0 mt-0.5" style={{ color: "var(--color-teal-100)" }} />
            <div>
              <div className="text-[8px] uppercase tracking-wider text-color-teal-100 font-bold" style={{ color: "var(--color-teal-100)" }}>Live Captions</div>
              <p className="text-xs font-semibold leading-relaxed text-slate-100 font-headings mt-0.5">
                {stepData.captions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 5: FROM MATERIALS TO COMPLETE LESSONS
   ════════════════════════════════════════════════════════════════════ */

export function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      title: "Upload content",
      body: "PDFs, slides, documents, images or syllabi.",
      icon: Upload
    },
    {
      n: "02",
      title: "Generate the lesson",
      body: "Objectives, explanations, whiteboard content and checkpoints.",
      icon: Sparkles
    },
    {
      n: "03",
      title: "Deliver the classroom session",
      body: "The AI teacher writes, explains and responds.",
      icon: GraduationCap
    },
    {
      n: "04",
      title: "Review learning evidence",
      body: "Notes, transcript, activity and support needs.",
      icon: FileText
    }
  ];

  return (
    <section id="how-it-works" className="section section-light relative">
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">The Journey</span>
          <h2 className="text-slate-900 dark:text-white">From approved materials to classroom delivery</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Klassruum gives institutions a clear operational path from uploaded curriculum to lesson delivery, learner support, and evidence review.
          </p>
        </div>

        <div className="steps-grid max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div 
              key={step.n} 
              className={`card step-card lp-premium-card lp-reveal lp-reveal-delay-${idx + 1}`}
              data-reveal
            >
              <div className="step-number text-blue-600 dark:text-blue-400 font-extrabold">{step.n}</div>
              <div className="step-icon bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-color-text-primary dark:text-white" style={{ color: "var(--color-text-primary)" }}>{step.title}</h3>
              <p className="text-xs text-color-text-secondary dark:text-slate-300 mt-2" style={{ color: "var(--color-text-secondary)", lineHeight: "var(--line-height-body)" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 6: CORE PLATFORM CAPABILITIES
   ════════════════════════════════════════════════════════════════════ */

export function FeaturesSection() {
  const bentoItems = [
    {
      title: "AI teacher-led lessons",
      desc: "A virtual tutor that introduces concepts, writes equations, handles questions, and keeps the lesson moving in a real learning loop.",
      size: "feature-card-large",
      color: "feature-card-blue",
      preview: "Lesson loop: Worked examples & checkpoints",
      icon: GraduationCap
    },
    {
      title: "Voice and text questions",
      desc: "Learners ask questions naturally by speaking or typing. Clarifies queries instantly in context.",
      size: "feature-card-small",
      color: "feature-card-cream",
      icon: MessageSquare
    },
    {
      title: "Grounded answers",
      desc: "All explanations draw strictly from your uploaded institution guidelines and curriculum.",
      size: "feature-card-small",
      color: "feature-card-green",
      icon: BrainCircuit
    },
    {
      title: "Interactive whiteboard",
      desc: "The AI writes, draws, and solves math step by step on a visible canvas so students follow easily.",
      size: "feature-card-large",
      color: "feature-card-cream",
      preview: "x² + 5x + 6 = (x + 2)(x + 3) = 0",
      icon: Layout
    },
    {
      title: "Accessibility modes",
      desc: "Adaptive controls built for Deaf, Blind, Dyslexia, ADHD focus and motor support right in the browser.",
      size: "feature-card-large",
      color: "feature-card-green",
      preview: "✓ High Contrast   ✓ Large Spacing   ✓ Audio read-back",
      icon: Eye
    },
    {
      title: "Captions and transcripts",
      desc: "Captions generated dynamically on speech, and exported as a full reviewable session transcript.",
      size: "feature-card-small",
      color: "feature-card-blue",
      icon: Captions
    },
    {
      title: "Notes and replay",
      desc: "Extracts key notes automatically while the lesson runs, allowing full student review later.",
      size: "feature-card-small",
      color: "feature-card-cream",
      icon: BookOpen
    },
    {
      title: "Progress tracking",
      desc: "Logs checkpoint marks, concept reviews, active minutes, and session completion metrics.",
      size: "feature-card-small",
      color: "feature-card-blue",
      icon: TrendingUp
    },
    {
      title: "Institution dashboard",
      desc: "Administrator analytics to manage programmes, verify lessons, apply user roles, and monitor progress.",
      size: "feature-card-large",
      color: "feature-card-blue",
      preview: "Audit logs active · GDPR compliance validated",
      icon: ShieldCheck
    }
  ];

  return (
    <section id="features" className="section section-soft border-t border-color-border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">Capabilities</span>
          <h2 className="text-slate-900 dark:text-white">Everything needed to teach, support, and govern</h2>
          <p className="text-slate-600 dark:text-slate-300">
            The platform combines classroom delivery, learner accessibility, and institutional oversight instead of forcing teams to stitch together separate tools.
          </p>
        </div>

        <div className="feature-bento max-w-5xl mx-auto">
          {bentoItems.map((item, idx) => (
            <div 
              key={item.title} 
              className={cn("card feature-card flex flex-col justify-between lp-premium-card lp-reveal", item.size, item.color)}
              data-reveal
              style={{ transitionDelay: `${(idx % 3) * 0.08}s` }}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-[16px] font-bold text-color-text-primary dark:text-white" style={{ color: "var(--color-text-primary)", margin: 0 }}>
                    {item.title}
                  </h3>
                  {item.icon && (
                    <div className="h-9 w-9 rounded-full bg-white/60 dark:bg-slate-900/40 border border-color-border/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-color-text-secondary dark:text-slate-300 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {item.desc}
                </p>
              </div>
              {item.preview && (
                <div className="mt-4 bg-white/70 dark:bg-slate-900/60 border border-color-border/60 rounded-lg p-2.5 text-[10px] font-bold text-color-text-primary dark:text-slate-200 text-center" style={{ borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
                  {item.preview}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 7: ACCESSIBILITY AS A SIGNATURE FEATURE
   ════════════════════════════════════════════════════════════════════ */

type A11yMode = "deaf" | "blind" | "dyslexia" | "adhd" | "motor" | "speech" | "extra" | "challenge";

export function AccessibilitySection() {
  const [activeMode, setActiveMode] = useState<A11yMode>("deaf");

  const modes = [
    { id: "deaf", label: "Deaf & Hard-of-Hearing" },
    { id: "blind", label: "Blind & Low-Vision" },
    { id: "dyslexia", label: "Dyslexia Support" },
    { id: "adhd", label: "ADHD Focus" },
    { id: "motor", label: "Motor Support" },
    { id: "speech", label: "Speech Support" },
    { id: "extra", label: "Extra Support" },
    { id: "challenge", label: "Challenge Mode" }
  ] as const;

  return (
    <section id="accessibility" className="section accessibility-section border-y border-color-border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="container relative z-10">
        <div className="accessibility-grid max-w-5xl mx-auto items-center">
          {/* Left info & Selector */}
          <div className="lp-reveal" data-reveal>
            <span className="eyebrow" style={{ backgroundColor: "var(--color-green-50)", color: "var(--color-green-700)", borderColor: "var(--color-green-100)" }}>Inclusive Design</span>
            <h2 className="mt-4 text-slate-900 dark:text-white">Accessibility is part of the classroom engine</h2>
            <p className="mt-4 text-color-text-secondary dark:text-slate-300 text-large" style={{ color: "var(--color-text-secondary)" }}>
              Klassruum does not retrofit accessibility after delivery. It adapts the classroom itself so institutions can support different learner needs from the first lesson.
            </p>

            <div className="mode-list">
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id as A11yMode)}
                  className={cn("mode-chip lp-magnetic transition-all duration-250", activeMode === mode.id ? "active font-bold border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-500" : "bg-white border-color-border text-color-text-secondary dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/20")}
                  data-magnetic
                  style={{ cursor: "pointer" }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right layout mockup preview */}
          <div className="product-window shadow-2xl relative min-h-[220px] bg-white dark:bg-[#0b1220] p-5 flex flex-col justify-center lp-premium-card lp-reveal lp-reveal-delay-1" data-reveal>
            
            {activeMode === "deaf" && (
              <div className="space-y-4 animate-kr-pop">
                <div className="bg-color-navy-950 text-white text-xs font-bold p-3 rounded-lg text-center" style={{ backgroundColor: "var(--color-navy-950)" }}>
                  💬 Live Caption: "Let's factor x² + 5x + 6 = 0."
                </div>
                <div className="bg-[#FFFDF7] border border-color-border p-4 rounded-lg text-center text-lg font-bold font-headings" style={{ fontFamily: "Caveat, cursive", borderColor: "var(--color-border)" }}>
                  x² + 5x + 6 = 0
                </div>
                <div className="border-t border-color-border pt-3" style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-[9px] uppercase font-bold text-color-text-muted">Live Session Transcript</div>
                  <p className="text-xs font-bold text-color-text-primary border-l-2 border-color-primary pl-2 mt-1" style={{ borderColor: "var(--color-primary)", color: "var(--color-text-primary)" }}>
                    "The factors are (x + 2) and (x + 3)."
                  </p>
                </div>
              </div>
            )}

            {activeMode === "blind" && (
              <div className="bg-slate-950 border-2 border-yellow-400 rounded-xl p-5 text-yellow-400 space-y-4 animate-kr-pop">
                <div className="flex justify-between items-center text-[9px] font-bold border-b border-yellow-400/50 pb-2">
                  <span>AUDIO TRANSCRIPTION ON</span>
                  <span>HIGH CONTRAST</span>
                </div>
                <div className="text-2xl font-black text-center font-headings">
                  X = -2 OR X = -3
                </div>
                <p className="text-xs text-white">Audio Described: "The teacher marks roots -2 and -3 on the whiteboard."</p>
              </div>
            )}

            {activeMode === "dyslexia" && (
              <div className="space-y-4 animate-kr-pop">
                <div className="text-xs font-bold text-color-text-muted uppercase tracking-wider border-b border-color-border pb-1" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>Readability Optimization</div>
                <p 
                  className="text-sm text-color-text-primary leading-loose tracking-widest bg-color-surface-soft p-3 rounded-lg font-semibold"
                  style={{ wordSpacing: "0.22em", letterSpacing: "0.05em", backgroundColor: "var(--color-surface-soft)", color: "var(--color-text-primary)" }}
                >
                  We look for numbers that multiply to 6 and add to 5.
                </p>
              </div>
            )}

            {activeMode === "adhd" && (
              <div className="border-2 border-color-primary rounded-xl p-4 space-y-3 animate-kr-pop" style={{ borderColor: "var(--color-primary)" }}>
                <div className="text-[10px] font-bold text-color-primary" style={{ color: "var(--color-primary)" }}>✓ FOCUS MODE ON · ALL PANELS HIDDEN</div>
                <div className="bg-color-surface-soft border border-color-border p-4 rounded text-center text-lg font-bold" style={{ backgroundColor: "var(--color-surface-soft)", borderColor: "var(--color-border)" }}>
                  x² + 5x + 6 = 0
                </div>
              </div>
            )}

            {activeMode === "motor" && (
              <div className="space-y-3 animate-kr-pop">
                <div className="text-xs font-bold text-color-text-muted uppercase tracking-wider border-b border-color-border pb-1" style={{ color: "var(--color-text-muted)", borderColor: "var(--color-border)" }}>Keyboard Shortcut Cues</div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="border border-color-border rounded-xl p-3 bg-color-surface-soft" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)" }}>
                    <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs">Space</kbd>
                    <div className="text-[10px] font-bold text-color-text-primary mt-1" style={{ color: "var(--color-text-primary)" }}>Pause / Play</div>
                  </div>
                  <div className="border border-color-border rounded-xl p-3 bg-color-surface-soft" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)" }}>
                    <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-bold text-xs">Q</kbd>
                    <div className="text-[10px] font-bold text-color-text-primary mt-1" style={{ color: "var(--color-text-primary)" }}>Ask Question</div>
                  </div>
                </div>
              </div>
            )}

            {activeMode === "speech" && (
              <div className="space-y-3 animate-kr-pop">
                <p className="text-xs font-bold text-color-text-primary" style={{ color: "var(--color-text-primary)" }}>Tap a card to ask without voice:</p>
                <div className="flex flex-col gap-2">
                  <span className="p-2 border border-color-border rounded bg-color-surface-soft text-xs font-bold text-color-primary cursor-pointer text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)", color: "var(--color-primary)" }}>"Give another algebra example"</span>
                  <span className="p-2 border border-color-border rounded bg-color-surface-soft text-xs font-bold text-color-primary cursor-pointer text-center" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)", color: "var(--color-primary)" }}>"Explain this root simpler"</span>
                </div>
              </div>
            )}

            {activeMode === "extra" && (
              <div className="space-y-3 animate-kr-pop">
                <div className="bg-color-surface-blue p-3 rounded-lg border border-color-border" style={{ backgroundColor: "var(--color-surface-blue)", borderColor: "var(--color-border)" }}>
                  <h4 className="text-xs font-bold text-color-text-primary" style={{ color: "var(--color-text-primary)" }}>Pace control:</h4>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-color-text-secondary" style={{ color: "var(--color-text-secondary)" }}>
                    <span>Slower</span>
                    <input type="range" className="w-full" disabled defaultValue="20" />
                    <span>Normal</span>
                  </div>
                </div>
              </div>
            )}

            {activeMode === "challenge" && (
              <div className="space-y-3 animate-kr-pop text-center">
                <span className="text-[10px] font-bold text-color-amber-600 uppercase" style={{ color: "var(--color-amber-600)" }}>Checkpoint Quiz</span>
                <p className="text-xs font-bold text-color-text-primary" style={{ color: "var(--color-text-primary)" }}>If (x + 2) = 0, what is x?</p>
                <div className="flex gap-2 justify-center">
                  <span className="px-3 py-1.5 border border-color-border rounded text-xs font-bold bg-color-surface-soft cursor-pointer" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface-soft)" }}>x = 2</span>
                  <span className="px-3 py-1.5 border border-color-success text-color-success rounded text-xs font-bold bg-color-green-50 cursor-pointer" style={{ borderColor: "var(--color-success)", backgroundColor: "var(--color-green-50)", color: "var(--color-success)" }}>x = -2</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 8: BUILT FOR EACH LEARNING ENVIRONMENT (TABS)
   ════════════════════════════════════════════════════════════════════ */

type EnvTab = "schools" | "universities" | "tutoring" | "exams" | "ngos" | "corporate";

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState<EnvTab>("schools");

  const tabContents = {
    schools: {
      title: "Schools",
      image: "/images/scenes/step-review.png",
      outcomes: [
        "Consistent delivery across classrooms.",
        "Custom curriculum alignment.",
        "Automatic note extraction for revision."
      ],
      cta: "Explore School Plans"
    },
    universities: {
      title: "Universities",
      image: "/images/scenes/step-upload.png",
      outcomes: [
        "Scales course content to huge cohorts.",
        "Saves notes & transcripts automatically.",
        "Adapts lecturing style to advanced levels."
      ],
      cta: "Explore University Plans"
    },
    tutoring: {
      title: "Tutoring centers",
      image: "/images/scenes/step-generate.png",
      outcomes: [
        "Personalized pace for individual students.",
        "Context-grounded math checks and board explanation.",
        "No-schedule live tutoring."
      ],
      cta: "Register Tutoring Center"
    },
    exams: {
      title: "Exam preparation",
      image: "/images/scenes/step-deliver.png",
      outcomes: [
        "Curriculum objectives checklist tracking.",
        "Targeted feedback on assessment questions.",
        "Rapid concept verification cards."
      ],
      cta: "See Prep Features"
    },
    ngos: {
      title: "NGOs",
      image: "/images/scenes/step-review.png",
      outcomes: [
        "Reaches remote locations in offline modes.",
        "Speaks in local translations and language models.",
        "Accessible options included at no cost."
      ],
      cta: "Contact NGO Support"
    },
    corporate: {
      title: "Corporate training",
      image: "/images/scenes/step-deliver.png",
      outcomes: [
        "Standardizes professional certification.",
        "Logs completion evidence and compliance logs.",
        "Upload files for immediate employee review."
      ],
      cta: "Talk to Training Sales"
    }
  } as const;

  const activeContent = tabContents[activeTab];

  return (
    <section id="use-cases" className="section section-light relative">
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">Environments</span>
          <h2 className="text-slate-900 dark:text-white">Designed for how different institutions deliver learning</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Whether you teach school cohorts, university groups, tutoring learners, or training programmes, Klassruum adapts the classroom model to your delivery context.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 border-b border-color-border/60 pb-4 lp-reveal" data-reveal style={{ borderColor: "var(--color-border)" }}>
          {(Object.keys(tabContents) as EnvTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn("mode-chip lp-magnetic transition-all duration-250", activeTab === tab ? "active font-bold border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-500" : "bg-white border-color-border text-color-text-secondary dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/20")}
              data-magnetic
              style={{ cursor: "pointer" }}
            >
              {tabContents[tab].title}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center animate-kr-fade-up">
          <div className="space-y-6 lp-reveal lp-reveal-delay-1" data-reveal>
            <h3 className="text-xl font-bold font-headings text-color-text-primary dark:text-white" style={{ color: "var(--color-text-primary)", margin: 0 }}>
              Klassruum for {activeContent.title}
            </h3>
            
            <ul className="space-y-4" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              {activeContent.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3 text-sm font-bold text-color-text-primary dark:text-slate-200" style={{ color: "var(--color-text-primary)" }}>
                  <span className="h-5 w-5 bg-color-green-50 text-color-green-700 dark:bg-green-950/40 dark:text-green-300 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5" style={{ backgroundColor: "var(--color-green-50)", color: "var(--color-green-700)" }}>✓</span>
                  {outcome}
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link to="/auth" className="btn btn-primary lp-magnetic" data-magnetic>
                {activeContent.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative lp-reveal lp-reveal-delay-2" data-reveal>
            <div className="product-window shadow-2xl overflow-hidden lp-premium-card">
              <img
                src={activeContent.image}
                alt={`${activeContent.title} preview`}
                className="w-full h-[220px] object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 9: INSTITUTION CONTROL AND GOVERNANCE
   ════════════════════════════════════════════════════════════════════ */

export function InstitutionSection() {
  const checklist = [
    "Review lessons before publication.",
    "Control programmes, courses and users.",
    "Monitor active classrooms.",
    "View progress by cohort.",
    "Access notes and transcripts.",
    "Apply roles and permissions.",
    "Manage retention and exports."
  ];

  return (
    <section id="institutions" className="section section-dark institution-control relative">
      <div className="container control-grid relative z-10">
        
        {/* Left: admin panel visual */}
        <div className="product-window bg-slate-900 border-white/10 p-5 shadow-2xl space-y-4 lp-premium-card lp-reveal lp-reveal-delay-1" data-reveal style={{ backgroundColor: "var(--color-navy-950)", borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2 text-[10px] font-bold text-slate-300" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-color-success" style={{ color: "var(--color-success)" }} />
              <span>Governance Dashboard</span>
            </div>
            <span>SSO ACTIVE</span>
          </div>

          <div className="space-y-3">
            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex justify-between items-center">
              <div>
                <div className="text-[8px] uppercase tracking-wider text-slate-400">Total active courses</div>
                <div className="text-lg font-bold text-white">42</div>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">Secure</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] text-white">
              <div className="bg-white/5 border border-white/5 rounded-lg p-3.5">
                <KeyRound className="h-4.5 w-4.5 text-color-success mb-1" style={{ color: "var(--color-success)" }} />
                <div className="font-bold">Audit logging</div>
                <div className="text-[8px] text-slate-400 mt-0.5">Continuous logs</div>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-lg p-3.5">
                <FileSearch className="h-4.5 w-4.5 text-color-success mb-1" style={{ color: "var(--color-success)" }} />
                <div className="font-bold">Verify lessons</div>
                <div className="text-[8px] text-slate-400 mt-0.5">Admin checked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: text and checklist */}
        <div className="lp-reveal lp-reveal-delay-2" data-reveal>
          <span className="eyebrow" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--color-white)", borderColor: "rgba(255,255,255,0.15)" }}>Governance</span>
          <h2 className="mt-4">Institution control, review, and security</h2>
          <p className="mt-4">
            Administrators stay in control of lessons, users, and records. Review content before release, monitor classroom activity, and maintain GDPR-aligned oversight throughout deployment.
          </p>

          <div className="check-list">
            {checklist.map((item) => (
              <div key={item} className="check-item">
                <div className="check-icon">
                  <Check className="h-3.5 w-3.5 text-color-success" style={{ color: "var(--color-green-100)" }} />
                </div>
                <span className="text-sm font-semibold text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 10: COMPARISON AND EVIDENCE
   ════════════════════════════════════════════════════════════════════ */

export function ComparisonSection() {
  const capabilities = [
    { name: "Delivers complete lessons", klass: "Yes", lms: "No", video: "Depends on teacher", chat: "No" },
    { name: "Uses institution content", klass: "Yes", lms: "Stores it", video: "No", chat: "Sometimes" },
    { name: "Teaches with a whiteboard", klass: "Yes", lms: "No", video: "Sometimes", chat: "No" },
    { name: "Supports contextual questions", klass: "Yes", lms: "No", video: "Teacher-dependent", chat: "Yes" },
    { name: "Captures learning evidence", klass: "Yes", lms: "Limited", video: "Limited", chat: "No" }
  ];

  const evidence = [
    "Questions asked.",
    "Checkpoints completed.",
    "Concepts reviewed.",
    "Notes generated.",
    "Transcript generated.",
    "Areas needing support."
  ];

  return (
    <section className="section section-light relative">
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">Comparison Matrix</span>
          <h2 className="text-slate-900 dark:text-white">Why Klassruum is not just an LMS, video tool, or chatbot</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Traditional tools cover pieces of digital learning. Klassruum brings teaching delivery, learner interaction, and evidence capture together in one classroom system.
          </p>
        </div>

        {/* Comparison table */}
        <div className="max-w-4xl mx-auto border border-color-border rounded-xl overflow-hidden shadow-sm mb-12 lp-premium-card lp-reveal lp-reveal-delay-1" data-reveal style={{ borderColor: "var(--color-border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]" style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
              <thead>
                <tr className="bg-color-surface-soft dark:bg-slate-900/60 border-b border-color-border text-color-text-primary dark:text-white" style={{ backgroundColor: "var(--color-surface-soft)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
                  <th className="p-4 font-bold text-slate-800 dark:text-white">Capability</th>
                  <th className="p-4 font-bold text-color-primary" style={{ color: "var(--color-primary)" }}>Klassruum</th>
                  <th className="p-4 font-bold text-color-text-muted dark:text-slate-400" style={{ color: "var(--color-text-muted)" }}>LMS</th>
                  <th className="p-4 font-bold text-color-text-muted dark:text-slate-400" style={{ color: "var(--color-text-muted)" }}>Video platform</th>
                  <th className="p-4 font-bold text-color-text-muted dark:text-slate-400" style={{ color: "var(--color-text-muted)" }}>Chatbot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-color-border/60 font-semibold dark:divide-slate-800" style={{ borderColor: "var(--color-border)" }}>
                {capabilities.map((c) => (
                  <tr key={c.name} className="hover:bg-color-surface-soft/40 dark:hover:bg-slate-900/20">
                    <td className="p-4 font-bold text-color-text-primary dark:text-white" style={{ color: "var(--color-text-primary)" }}>{c.name}</td>
                    <td className="p-4 text-color-primary font-black flex items-center gap-1" style={{ color: "var(--color-primary)" }}>
                      <Check className="h-4.5 w-4.5 text-color-success shrink-0" style={{ color: "var(--color-success)" }} /> {c.klass}
                    </td>
                    <td className="p-4 text-color-text-secondary dark:text-slate-300" style={{ color: "var(--color-text-secondary)" }}>{c.lms}</td>
                    <td className="p-4 text-color-text-secondary dark:text-slate-300" style={{ color: "var(--color-text-secondary)" }}>{c.video}</td>
                    <td className="p-4 text-color-text-secondary dark:text-slate-300" style={{ color: "var(--color-text-secondary)" }}>{c.chat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence box */}
        <div className="max-w-3xl mx-auto bg-color-surface-blue border border-color-border rounded-xl p-6 sm:p-8 lp-premium-card lp-reveal lp-reveal-delay-2" data-reveal style={{ backgroundColor: "var(--color-surface-blue)", borderColor: "var(--color-border)" }}>
          <h3 className="text-center font-bold text-color-text-primary dark:text-white text-xs uppercase tracking-wider mb-6" style={{ color: "var(--color-text-primary)" }}>
            Evidence Klassruum Captures
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {evidence.map((ev) => (
              <div key={ev} className="bg-white dark:bg-slate-900 border border-color-border dark:border-slate-800 rounded-lg p-3 text-center flex items-center justify-center shadow-sm" style={{ borderColor: "var(--color-border)" }}>
                <span className="text-xs font-bold text-color-text-primary dark:text-slate-200" style={{ color: "var(--color-text-primary)" }}>{ev}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 11: PRICING REDESIGN
   ════════════════════════════════════════════════════════════════════ */

export function PricingPreviewSection() {
  const plans = [
    {
      name: "Explore",
      tagline: "Free demo",
      price: "Free",
      period: "no account required",
      bullets: [
        "Full classroom demonstration.",
        "AI teacher-led lesson.",
        "Captions and transcript.",
        "Accessibility preview.",
        "No registration needed."
      ],
      cta: "Explore Demo",
      to: "/demo/classroom",
      featured: false
    },
    {
      name: "School",
      tagline: "Custom institutional plan",
      price: "Custom",
      period: "tailored billing",
      bullets: [
        "Teachers and learners accounts.",
        "Course syllabus management.",
        "Lesson plan generation.",
        "Progress reporting records.",
        "Institution audit dashboard.",
        "Priority support desk."
      ],
      cta: "Register Your School",
      to: "/auth",
      featured: true
    },
    {
      name: "Enterprise",
      tagline: "Advanced institutional deployment",
      price: "Enterprise",
      period: "annual agreements",
      bullets: [
        "Everything in School tier.",
        "SSO and advanced security.",
        "API access & integrations.",
        "Custom branding skins.",
        "Compliance documentation.",
        "Dedicated account manager."
      ],
      cta: "Talk to Sales",
      to: "/auth",
      featured: false
    }
  ];

  return (
    <section id="pricing" className="section section-soft border-t border-color-border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">Pricing</span>
          <h2 className="text-slate-900 dark:text-white">Pricing designed for institutional rollout</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Start with the classroom demo, then scale into a deployment model that fits your governance, support, and learner volume needs.
          </p>
        </div>

        <div className="pricing-grid max-w-5xl mx-auto">
          {plans.map((p, idx) => (
            <div 
              key={p.name} 
              className={cn(
                "card pricing-card flex flex-col justify-between lp-premium-card lp-reveal lp-magnetic", 
                p.featured ? "featured border-[#1F7C80]/45 shadow-[0_20px_50px_rgba(31,124,128,0.12),0_18px_40px_rgba(15,23,42,0.10)] ring-1 ring-[#1F7C80]/15 scale-[1.02] lp-reveal-delay-2" : `lp-reveal-delay-${idx + 1}`
              )}
              data-reveal
              data-magnetic
              data-magnetic-strength="12"
            >
              {p.featured && (
                <span className="pricing-badge font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#1F7C80] to-[#3fa8ab] text-white">Custom Plan</span>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-color-text-muted dark:text-slate-400" style={{ color: "var(--color-text-muted)" }}>{p.tagline}</span>
                <h3 className="text-xl font-bold font-headings text-color-text-primary dark:text-white mt-1" style={{ color: "var(--color-text-primary)" }}>{p.name}</h3>
                
                <div className="price dark:text-white">
                  {p.price}
                </div>
                <p className="price-description text-xs text-color-text-secondary dark:text-slate-300 -mt-3 mb-6" style={{ color: "var(--color-text-secondary)" }}>
                  {p.period}
                </p>

                <ul className="pricing-list border-t border-color-border/60 pt-4" style={{ borderColor: "var(--color-border)" }}>
                  {p.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 text-xs font-semibold text-color-text-secondary dark:text-slate-300" style={{ color: "var(--color-text-secondary)" }}>
                      <Check className="h-4.5 w-4.5 text-color-success shrink-0 mt-0.5" style={{ color: "var(--color-success)" }} /> {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4">
                <Link
                  to={p.to as any}
                  className={cn("btn w-full lp-magnetic", p.featured ? "btn-primary" : "btn-secondary")}
                  data-magnetic
                >
                  {p.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 12: FOCUSED FAQ
   ════════════════════════════════════════════════════════════════════ */

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Klassruum?",
      answer: "Klassruum is an AI-powered virtual classroom platform. Institutions upload course materials, generate structured lessons, and let an AI teacher deliver those lessons inside a realistic classroom with a whiteboard, voice, captions, notes, transcripts, learner questions, accessibility modes, and progress tracking."
    },
    {
      question: "How does the AI teacher work?",
      answer: "The AI teacher follows a pre-developed lesson plan, introduces the lesson, writes on the whiteboard, reads each item, explains it, and answers learner questions in real time using the current lesson and the institution's course materials."
    },
    {
      question: "Is Klassruum a chatbot?",
      answer: "No. Klassruum delivers a complete, structured lesson from start to finish and tutors on demand within that lesson. The classroom is the product, not a chat window."
    },
    {
      question: "Can institutions upload their own course content?",
      answer: "Yes. You can upload PDFs, slides, documents, syllabi, and images, and Klassruum generates structured lessons for a teacher or admin to review and publish."
    },
    {
      question: "How does Klassruum support learners with disabilities?",
      answer: "Accessibility is built in: live captions, full transcripts, keyboard navigation, screen reader support, high contrast, large text, reduced motion, focus mode, adjustable speech speed, and text-first or voice-first questions, with dedicated learner modes."
    },
    {
      question: "How is learner progress tracked?",
      answer: "Klassruum records learning activity such as lessons started and completed, time spent, questions asked, checkpoints reached, notes and transcripts generated, replay count, progress percentage, and areas needing review."
    }
  ];

  return (
    <section id="faq" className="section section-light border-t border-color-border relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="container relative z-10">
        <div className="section-heading center lp-reveal" data-reveal>
          <span className="eyebrow">FAQ</span>
          <h2 className="text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card overflow-hidden lp-premium-card lp-reveal" data-reveal style={{ transitionDelay: `${idx * 0.05}s` }}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-sm text-color-text-primary dark:text-white flex justify-between items-center focus:outline-none"
                style={{ color: "var(--color-text-primary)" }}
              >
                <span>{faq.question}</span>
                <ChevronDown className={cn("h-4.5 w-4.5 text-color-text-muted shrink-0 transition-transform duration-200", openIndex === idx ? "transform rotate-180" : "")} style={{ color: "var(--color-text-muted)" }} />
              </button>
              {openIndex === idx && (
                <div className="p-5 border-t border-color-border-light dark:border-slate-800 text-xs font-semibold leading-relaxed text-color-text-secondary dark:text-slate-300 bg-[#FAFBFD] dark:bg-slate-900/60" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-secondary)" }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SECTION 13: FINAL CTA
   ════════════════════════════════════════════════════════════════════ */

export function FinalCTA() {
  return (
    <section className="section section-soft border-t border-color-border text-center relative overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto space-y-6 lp-reveal" data-reveal>
          <span className="eyebrow" style={{ backgroundColor: "var(--color-blue-50)", color: "var(--color-blue-700)", borderColor: "var(--color-blue-100)" }}>Experience Klassruum</span>
          
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-color-text-primary dark:text-white" style={{ color: "var(--color-text-primary)" }}>
            Ready to bring AI-led teaching into your institution?
          </h2>
          
          <p className="text-sm text-color-text-secondary dark:text-slate-300 leading-relaxed max-w-lg mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Explore the classroom yourself, or register your institution to evaluate rollout, accessibility, governance, and learner support in a more structured pilot.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/demo/classroom" className="btn btn-primary lp-magnetic" data-magnetic>
              Start Demo Classroom <Play className="h-3.5 w-3.5 fill-white shrink-0 ml-1" />
            </Link>
            <Link to="/institutions/register" className="btn btn-secondary lp-magnetic" data-magnetic>
              Register Institution
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
