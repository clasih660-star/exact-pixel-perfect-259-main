import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Mic, PencilRuler, Brain, GraduationCap, ArrowRight, Users, School, Accessibility, Play, CircleCheck as CheckCircle2, ChevronRight, Zap, BookOpen, Monitor, Volume2, Bubbles as Subtitles, Trophy, Clock3, ChartBar as BarChart3, Lightbulb, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klassruum — AI-Powered Virtual Classrooms for Every Learner | Premium EdTech Platform" },
      {
        name: "description",
        content:
          "Klassruum transforms education with AI-powered virtual classrooms. Voice-first teaching, interactive whiteboard, real-time captions, adaptive learning, and accessibility built-in. Trusted by 500+ institutions worldwide.",
      },
      {
        name: "keywords",
        content:
          "AI classroom, virtual teaching, online learning platform, voice-first education, adaptive learning, educational technology, accessible learning",
      },
      { property: "og:title", content: "Klassruum — Premium AI-Powered Virtual Classrooms" },
      {
        property: "og:description",
        content:
          "Transform education with intelligent virtual classrooms where AI teachers and students learn together through voice, video, and interactive tools.",
      },
      { property: "og:type", content: "website" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Klassruum" },
      { name: "theme-color", content: "#1D4ED8" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <Nav />
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <ClassroomPreview />
      <Stats />
      <ForInstitutions />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Classroom", href: "#preview" },
    { label: "For Schools", href: "#institutions" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={`kr-nav fixed inset-x-0 top-0 z-50 ${
        scrolled
          ? "border-b border-gray-200 bg-white/90 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <LogoMark size={32} />
          <span
            className={`hidden text-lg font-bold tracking-tight sm:block ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Klassruum
          </span>
        </Link>

        {/* Navigation */}
        <nav
          className={`hidden items-center gap-9 text-sm font-semibold lg:flex ${
            scrolled ? "text-gray-600" : "text-white/80"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`kr-nav-link transition-colors ${scrolled ? "hover:text-blue-600" : "hover:text-white"}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button
              variant="ghost"
              size="sm"
              className={scrolled ? "text-gray-600 hover:text-blue-600" : "text-white hover:bg-white/10 hover:text-white"}
            >
              Sign in
            </Button>
          </Link>
          <Link to="/student/dashboard">
            <Button size="sm" className="kr-btn-primary border-0 shadow-md">
              Try Demo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="kr-hero min-h-screen">
      {/* Cinematic background video */}
      <video
        className="kr-hero-video"
        src="/media/learning-tablet.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/scenes/scene-1.png"
      />
      <div className="kr-hero-veil" />
      <div className="kr-hero-mesh" />
      <div className="kr-shimmer-ribbon" />
      <div className="kr-glitter" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 pb-24 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        {/* Left — copy */}
        <div className="kr-fade-up">
          <div className="kr-badge-glitter inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm">
            <Sparkles className="h-4 w-4" />
            AI-Powered Virtual Classrooms
          </div>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
            The future of{" "}
            <span className="kr-shine-text">smart learning</span>{" "}
            is here
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-blue-50/90">
            A real AI teacher that writes on the board, explains deeply, checks understanding,
            and adapts to every learner — with voice, live captions, and accessibility built in.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link to="/student/dashboard">
              <Button size="lg" className="kr-btn-primary gap-2 border-0 px-8 py-6 text-base">
                <Play className="h-5 w-5" />
                Try Demo Classroom
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/institutions/register">
              <Button
                size="lg"
                variant="outline"
                className="kr-border-glow border-0 bg-white/5 px-8 py-6 text-base text-white backdrop-blur hover:bg-white/15"
              >
                Register Your School
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["#2563eb", "#6366f1", "#0ea5e9", "#22c55e"].map((c, i) => (
                <span
                  key={i}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/80 text-sm font-bold text-white shadow-md"
                  style={{ background: c }}
                >
                  {["A", "M", "S", "J"][i]}
                </span>
              ))}
            </div>
            <div className="text-sm text-blue-50/90">
              <div className="flex items-center gap-1 text-amber-300">★★★★★</div>
              <span className="font-medium">Joined by 50,000+ learners worldwide</span>
            </div>
          </div>
        </div>

        {/* Right — floating glass stat cards over the video */}
        <div className="relative hidden h-full min-h-[440px] lg:block">
          {/* Live lesson card */}
          <div className="kr-glass-dark kr-fade-up-2 absolute right-0 top-6 w-72 p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              Live AI lesson
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Volume2 className="h-4 w-4 text-blue-300" />
              “Let’s factor x² + 5x + 6 together…”
            </div>
          </div>

          {/* Progress card */}
          <div className="kr-glass-dark kr-fade-up-3 kr-float absolute left-2 top-44 w-56 p-5 shadow-2xl">
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-200/80">Lesson progress</div>
            <div className="mt-1 text-3xl font-extrabold text-white">42%</div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
            </div>
          </div>

          {/* Captions chip */}
          <div className="kr-glass-dark kr-fade-up-2 kr-float absolute bottom-6 right-6 inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white shadow-2xl" style={{ animationDelay: "-3s" }}>
            <Subtitles className="h-4 w-4 text-indigo-300" />
            Captions On · 10+ languages
          </div>
        </div>
      </div>

      {/* Bottom fade into the page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--gray-50)]" />
    </section>
  );
}

function TrustedBy() {
  const logos = ["100+ School Districts", "50+ Universities", "1000+ Teachers", "50,000+ Students"];
  return (
    <section className="border-y border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-8">
          Trusted globally by educational institutions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {logos.map((name) => (
            <div key={name} className="text-center">
              <p className="text-gray-600 font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Mic,
      title: "Voice-First Learning",
      desc: "Students speak naturally. The AI listens, understands context, and responds with personalized explanations.",
      color: "bg-blue-100 text-blue-600",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      icon: PencilRuler,
      title: "Interactive Whiteboard",
      desc: "Watch equations, diagrams, and concepts come alive as the AI teacher explains each step visually.",
      color: "bg-purple-100 text-purple-600",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      desc: "Real-time comprehension tracking. The system adjusts pace, difficulty, and examples for each student.",
      color: "bg-emerald-100 text-emerald-600",
      gradient: "from-emerald-50 to-emerald-100"
    },
    {
      icon: Accessibility,
      title: "Full Accessibility",
      desc: "Live captions, focus mode, keyboard navigation, adjustable speech rate. Inclusive by design.",
      color: "bg-orange-100 text-orange-600",
      gradient: "from-orange-50 to-orange-100"
    },
    {
      icon: Trophy,
      title: "Intelligent Quizzes",
      desc: "AI generates contextual quizzes with instant feedback, spaced repetition, and mastery tracking.",
      color: "bg-yellow-100 text-yellow-600",
      gradient: "from-yellow-50 to-yellow-100"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      desc: "Live dashboards show engagement, comprehension gaps, and actionable insights for teachers.",
      color: "bg-red-100 text-red-600",
      gradient: "from-red-50 to-red-100"
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
            <Zap className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything needed for{" "}
            <span className="text-blue-600">modern education</span>
          </h2>
          <p className="text-lg text-gray-600">
            Not a chatbot. A complete AI teaching system that runs full lessons with adaptive learning.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-2"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{feature.desc}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Create or Upload Lessons",
      desc: "Choose from the lesson library or upload your own curriculum. Set learning objectives and difficulty levels.",
      icon: BookOpen,
    },
    {
      num: "02",
      title: "AI Teacher Launches",
      desc: "The AI meets students, explains the learning agenda, and begins teaching with voice and interactive visuals.",
      icon: GraduationCap,
    },
    {
      num: "03",
      title: "Students Learn & Engage",
      desc: "Students speak or type questions, get adaptive explanations, and take dynamic quizzes in real-time.",
      icon: Mic,
    },
    {
      num: "04",
      title: "Review & Improve",
      desc: "Access transcripts, quiz analytics, and engagement metrics. Use insights to refine future lessons.",
      icon: BarChart3,
    },
  ];

  return (
    <section id="how" className="border-y border-gray-200 bg-gradient-to-b from-white to-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
            <Clock3 className="h-4 w-4" />
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple workflow, powerful results
          </h2>
          <p className="text-lg text-gray-600">
            Four simple steps to bring AI-powered learning to your classroom
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-12 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-gradient-to-b from-blue-200 to-transparent lg:block" />

          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative">
                <div className="flex justify-center mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/30">
                    {step.num}
                  </div>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassroomPreview() {
  return (
    <section id="preview" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-4">
            <Monitor className="h-4 w-4" />
            Live Classroom
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Experience Klassruum in action
          </h2>
          <p className="text-lg text-gray-600">
            See the full AI teaching loop: voice interaction, real-time whiteboard, intelligent quizzes, and accessibility features—all working seamlessly together.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          {/* Real classroom video */}
          <div className="kr-media aspect-video kr-fade-up">
            <video
              src="/media/student-smiling.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/scenes/scene-2.png"
            />
            <div className="kr-media-ring" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <div className="absolute bottom-4 left-4 kr-glass kr-chip">
              <Play className="h-4 w-4 text-blue-600" /> Watch a real session
            </div>
          </div>

          {/* Feature checklist */}
          <div className="kr-fade-up-1">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Volume2, text: "Real-time voice AI" },
                { icon: Subtitles, text: "Live captions (10+ languages)" },
                { icon: PencilRuler, text: "Interactive whiteboard" },
                { icon: Brain, text: "Adaptive learning engine" },
                { icon: Accessibility, text: "Accessibility modes built-in" },
                { icon: Trophy, text: "Practice, hints & progress" },
              ].map((item, idx) => (
                <div key={idx} className="kr-pcard flex items-center gap-3 p-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/demo/ai-video">
                <Button size="lg" className="kr-btn-primary border-0 gap-2 px-8 py-6 text-base">
                  <Play className="h-5 w-5" />
                  Launch Demo Classroom
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scene gallery — the virtual learning space */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {["scene-1.png", "scene-3.png", "scene-2.png"].map((s, i) => (
            <div key={s} className="kr-media aspect-[4/3] kr-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <img src={`/images/scenes/${s}`} alt="Klassruum virtual learning space" loading="lazy" />
              <div className="kr-media-ring" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "50,000+", label: "Active Students" },
    { value: "500+", label: "Schools & Institutions" },
    { value: "100,000+", label: "Lessons Taught" },
    { value: "4.9/5", label: "Customer Rating" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 py-24">
      <div className="kr-glitter" />
      <div className="kr-shimmer-ribbon" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="kr-shine-text mb-3 text-5xl font-bold sm:text-6xl">{stat.value}</div>
              <div className="text-base font-medium text-white/90 sm:text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForInstitutions() {
  const benefits = [
    { icon: School, text: "White-label solution with your branding" },
    { icon: Users, text: "Unlimited teachers and student capacity" },
    { icon: BookOpen, text: "Import and manage your curriculum" },
    { icon: BarChart3, text: "Comprehensive admin dashboards" },
    { icon: Trophy, text: "Track student progress and outcomes" },
    { icon: Accessibility, text: "WCAG 2.1 AA accessibility compliance" },
  ];

  return (
    <section id="institutions" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
              <School className="h-4 w-4" />
              For Educational Institutions
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Bring AI-powered learning to your entire organization
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Deploy Klassruum across your school, district, or university with custom branding, 
              enterprise support, and bulk management tools.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit) => (
                <li key={benefit.text} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-base">{benefit.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to="/institutions/register">
                <Button size="lg" className="gap-2">
                  Register Your Institution <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">Contact Sales</Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
              <div className="border-b border-gray-200 bg-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <span className="ml-3 text-xs text-gray-500">admin.klassruum.com/dashboard</span>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">Live Metrics</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Active Students", value: "2,847", color: "bg-blue-50" },
                      { label: "Teachers", value: "156", color: "bg-green-50" },
                      { label: "Active Courses", value: "48", color: "bg-purple-50" },
                      { label: "Avg Progress", value: "73%", color: "bg-orange-50" },
                    ].map((metric) => (
                      <div key={metric.label} className={`rounded-lg p-3 ${metric.color}`}>
                        <p className="text-xs text-gray-600">{metric.label}</p>
                        <p className="mt-1 text-lg font-bold text-gray-900">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "Klassruum transformed our remote teaching. Students are more engaged, and we can track comprehension in real-time.",
      author: "Dr. Sarah Chen",
      role: "Principal, Westfield Academy",
      avatar: "SC",
      rating: 5,
    },
    {
      quote: "The adaptive AI adjusts to each student's pace perfectly. It's like having a personal tutor for every learner.",
      author: "Michael Roberts",
      role: "Mathematics Teacher, Lincoln High",
      avatar: "MR",
      rating: 5,
    },
    {
      quote: "Accessibility features are excellent. Our students with disabilities finally have equal access to quality instruction.",
      author: "Lisa Park",
      role: "Special Education Coordinator",
      avatar: "LP",
      rating: 5,
    },
  ];

  return (
    <section className="border-y border-gray-200 bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Loved by educators globally
          </h2>
          <p className="text-lg text-gray-600">
            See why thousands of teachers and institutions choose Klassruum
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Ready to transform your classroom?
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Join thousands of educators worldwide using Klassruum to deliver personalized, 
          accessible learning experiences powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link to="/student/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base gap-2 shadow-xl">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/institutions/register">
            <Button size="lg" variant="outline" className="px-8 py-6 text-base gap-2 border-gray-300">
              <School className="h-5 w-5" />
              For Schools
            </Button>
          </Link>
        </div>
        <p className="text-base text-gray-500 font-medium">
          ✓ 14-day free trial  ✓ No credit card required  ✓ Setup in 5 minutes
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "For Institutions", href: "#institutions" },
    { label: "Pricing", href: "#pricing" },
    { label: "Sign In", to: "/auth" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <LogoMark size={32} />
              <span className="font-bold text-xl text-gray-900">Klassruum</span>
            </Link>
            <p className="text-gray-600 max-w-xs">
              AI-powered virtual classrooms that adapt to every learner's needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-3 text-sm">
              {links.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Klassruum. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
