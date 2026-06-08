import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Mic, PencilRuler, Brain, GraduationCap, ArrowRight, Star, Users, School, Accessibility, Play, CircleCheck as CheckCircle2, ChevronRight, Zap, BookOpen, Monitor, Volume2, Bubbles as Subtitles, Trophy, Clock3, ChartBar as BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klassruum — Virtual classrooms for every learner" },
      {
        name: "description",
        content:
          "Create intelligent online classrooms where teachers, students, and AI work together through voice, whiteboard, captions, transcripts, quizzes, and accessible learning tools.",
      },
      { property: "og:title", content: "Klassruum — Virtual classrooms for every learner" },
      {
        property: "og:description",
        content: "A virtual classroom platform for institutions, teachers, and learners.",
      },
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
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gray-200)] bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25">
            <Star className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-[var(--gray-900)]">
            Klassruum
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--gray-600)] lg:flex">
          <a href="#features" className="transition-colors hover:text-[var(--gray-900)]">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-[var(--gray-900)]">
            How it works
          </a>
          <a href="#preview" className="transition-colors hover:text-[var(--gray-900)]">
            Classroom
          </a>
          <a href="#institutions" className="transition-colors hover:text-[var(--gray-900)]">
            For Institutions
          </a>
          <Link to="/demo/classroom" className="transition-colors hover:text-[var(--primary)]">
            Demo
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-[var(--gray-600)]">
              Sign in
            </Button>
          </Link>
          <Link to="/institutions/register">
            <Button size="sm" className="shadow-md shadow-[var(--primary)]/20">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--gray-400) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Hero Gradient Orbs */}
      <div className="absolute left-1/4 top-20 -z-10 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-[100px]" />
      <div className="absolute right-1/4 top-40 -z-10 h-[400px] w-[400px] rounded-full bg-purple-200/20 blur-[80px]" />

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary-light)] px-4 py-1.5 text-xs font-semibold text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Virtual Classrooms
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto mt-8 max-w-4xl text-center text-5xl font-bold leading-[1.1] tracking-tight text-[var(--gray-900)] sm:text-6xl lg:text-7xl">
          The future of{" "}
          <span className="bg-gradient-to-r from-[var(--primary)] to-purple-600 bg-clip-text text-transparent">
            classroom learning
          </span>{" "}
          is here.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-[var(--gray-600)]">
          Intelligent virtual classrooms where AI teachers, students, and educators work together.
          Voice-first, accessible, and designed for institutions of every size.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/dashboard">
            <Button size="lg" className="h-12 gap-2 px-8 shadow-xl shadow-[var(--primary)]/30 transition-all hover:shadow-2xl hover:shadow-[var(--primary)]/40">
              <Play className="h-4 w-4" />
              Try Demo Classroom
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/institutions/register">
            <Button size="lg" variant="outline" className="h-12 gap-2 px-8">
              Register Institution
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--gray-500)]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Setup in minutes</span>
          </div>
        </div>

        {/* Hero Image Preview */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white p-2 shadow-2xl shadow-[var(--gray-200)]/50">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 rounded-t-xl bg-[var(--gray-100)] px-4 py-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 flex-1">
                <div className="mx-auto w-full max-w-md rounded-lg bg-white px-4 py-1.5 text-center text-xs text-[var(--gray-400)]">
                  klassruum.com/classroom
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="aspect-[16/9] w-full overflow-hidden rounded-b-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-white">
                  <div className="relative mx-auto">
                    <div className="absolute inset-0 animate-ping rounded-full bg-[var(--primary)]/30" style={{ animationDuration: "2s" }} />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg">
                      <GraduationCap className="h-10 w-10" />
                    </div>
                  </div>
                  <p className="mt-6 text-lg font-semibold opacity-90">AI Teacher Active</p>
                  <p className="mt-2 text-sm opacity-70">Interactive classroom preview</p>
                </div>
              </div>

              {/* Floating UI Elements */}
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-white">
                  <Volume2 className="h-3.5 w-3.5 text-green-400" />
                  <span>Speaking: "Let's solve this together..."</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <div className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-xs text-white backdrop-blur">
                  <Subtitles className="mr-1.5 inline h-3.5 w-3.5 text-[var(--primary)]" />
                  Captions On
                </div>
                <div className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">
                  42% Progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBy() {
  const logos = ["School District A", "University B", "College C", "Academy D", "Institute E"];
  return (
    <section className="border-y border-[var(--gray-200)] bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-[var(--gray-400)]">
          Trusted by leading institutions worldwide
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-12 opacity-40">
          {logos.map((name) => (
            <div key={name} className="text-lg font-bold text-[var(--gray-400)]">
              {name}
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
      title: "Voice-First Teaching",
      desc: "Students speak naturally. Our AI listens, responds, and teaches with realistic, adaptive voice.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: PencilRuler,
      title: "Interactive Whiteboard",
      desc: "Watch equations, diagrams, and concepts come alive as the AI teacher explains step by step.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      desc: "Tracks understanding in real-time. Adjusts pace, difficulty, and examples for each student.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Accessibility,
      title: "Accessibility Built-In",
      desc: "Captions, focus mode, keyboard shortcuts, and adjustable speech rate. Designed for everyone.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Trophy,
      title: "Instant Quizzes",
      desc: "AI generates quizzes on the fly. Instant feedback, spaced repetition, and mastery tracking.",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      desc: "Teachers and admins see live progress. Dashboards show engagement, comprehension, and gaps.",
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gray-200)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--gray-500)]">
            <Zap className="h-3.5 w-3.5 text-[var(--primary)]" />
            Features
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-[var(--gray-900)]">
            Everything you need for{" "}
            <span className="text-[var(--primary)]">modern classrooms</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--gray-600)]">
            Not a chatbot. A complete AI teaching assistant that runs a full lesson loop.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[var(--gray-200)] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--gray-900)]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--gray-600)]">{feature.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
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
      title: "Create or Upload",
      desc: "Choose from our lesson library, or upload your own curriculum. Set learning objectives and difficulty.",
      icon: BookOpen,
    },
    {
      num: "02",
      title: "AI Teacher Launches",
      desc: "The AI greets students, sets the agenda, and starts teaching with voice and interactive visuals.",
      icon: GraduationCap,
    },
    {
      num: "03",
      title: "Students Engage",
      desc: "Talk or type. Ask questions, get explanations, take quizzes. The AI adapts in real-time.",
      icon: Mic,
    },
    {
      num: "04",
      title: "Track & Improve",
      desc: "Review transcripts, quiz results, and engagement. Use insights to improve future lessons.",
      icon: BarChart3,
    },
  ];

  return (
    <section id="how" className="border-y border-[var(--gray-200)] bg-gradient-to-b from-white to-[var(--gray-50)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gray-200)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--gray-500)]">
            <Clock3 className="h-3.5 w-3.5 text-[var(--primary)]" />
            How It Works
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-[var(--gray-900)]">
            Get started in minutes
          </h2>
          <p className="mt-4 text-lg text-[var(--gray-600)]">
            A simple workflow that transforms how you teach.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-12 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[var(--gray-200)] lg:block" />

          <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-lg font-bold text-white shadow-lg shadow-[var(--primary)]/30">
                  {step.num}
                </div>
                <div className="mt-6 rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary-light)]">
                    <step.icon className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--gray-900)]">{step.title}</h3>
                  <p className="mt-2 text-sm text-[var(--gray-600)]">{step.desc}</p>
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
    <section id="preview" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gray-200)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--gray-500)]">
            <Monitor className="h-3.5 w-3.5 text-[var(--primary)]" />
            Classroom Preview
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-[var(--gray-900)]">
            See Klassruum in action
          </h2>
          <p className="mt-4 text-lg text-[var(--gray-600)]">
            Experience the full AI teaching loop. Voice, whiteboard, quizzes, and accessibility all working together.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/demo/classroom">
            <Button size="lg" className="gap-2 px-8 shadow-xl shadow-[var(--primary)]/30">
              <Play className="h-4 w-4" />
              Try Demo Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Feature grid under preview */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Volume2, text: "Real-time voice" },
            { icon: Subtitles, text: "Live captions" },
            { icon: PencilRuler, text: "Interactive board" },
            { icon: Brain, text: "Adaptive AI" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-white p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-light)]">
                <item.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--gray-800)]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "50K+", label: "Students" },
    { value: "500+", label: "Institutions" },
    { value: "10K+", label: "Lessons Created" },
    { value: "95%", label: "Satisfaction" },
  ];

  return (
    <section className="bg-gradient-to-r from-[var(--primary)] to-purple-600 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-extrabold text-white sm:text-5xl">{stat.value}</div>
              <div className="mt-1 text-sm font-medium text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ForInstitutions() {
  const benefits = [
    { icon: School, text: "Branded classrooms with your logo and colors" },
    { icon: Users, text: "Unlimited teachers and students" },
    { icon: BookOpen, text: "Upload your curriculum and resources" },
    { icon: BarChart3, text: "Admin dashboards with live analytics" },
    { icon: Trophy, text: "Track student progress and mastery" },
    { icon: Accessibility, text: "Accessibility compliance built-in" },
  ];

  return (
    <section id="institutions" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gray-200)] bg-white px-4 py-1.5 text-xs font-semibold text-[var(--gray-500)]">
              <School className="h-3.5 w-3.5 text-[var(--primary)]" />
              For Institutions
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-[var(--gray-900)]">
              Bring your entire organization online
            </h2>
            <p className="mt-4 text-lg text-[var(--gray-600)]">
              Deploy Klassruum across your school, district, or university. Custom branding, enterprise support, and bulk onboarding.
            </p>

            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit.text} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-[var(--gray-700)]">{benefit.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/institutions/register">
                <Button className="gap-2">
                  Register Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-[var(--gray-200)] bg-white shadow-xl">
              <div className="border-b border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                  <span className="ml-2 text-xs text-[var(--gray-400)]">Institution Dashboard</span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Active Students", value: "2,847", color: "bg-blue-50" },
                    { label: "Teachers", value: "156", color: "bg-green-50" },
                    { label: "Active Courses", value: "48", color: "bg-purple-50" },
                    { label: "Avg Progress", value: "73%", color: "bg-orange-50" },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                      <p className="text-xs text-[var(--gray-500)]">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-[var(--gray-900)]">{stat.value}</p>
                    </div>
                  ))}
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
      quote: "Klassruum transformed how we deliver remote instruction. Our students are more engaged than ever.",
      author: "Dr. Sarah Chen",
      role: "Principal, Westfield Academy",
      avatar: "SC",
    },
    {
      quote: "The AI adapts to each student's pace. It's like having a personal tutor for every learner.",
      author: "Michael Roberts",
      role: "Math Teacher, Lincoln High",
      avatar: "MR",
    },
    {
      quote: "Accessibility was a priority for us. Klassruum delivered with captions, focus mode, and more.",
      author: "Lisa Park",
      role: "Special Ed Coordinator",
      avatar: "LP",
    },
  ];

  return (
    <section className="border-y border-[var(--gray-200)] bg-[var(--gray-50)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--gray-900)]">
            Loved by educators worldwide
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.author} className="rounded-2xl border border-[var(--gray-200)] bg-white p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--gray-700)]">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--gray-900)]">{t.author}</p>
                  <p className="text-xs text-[var(--gray-500)]">{t.role}</p>
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
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-[var(--gray-900)]">
          Ready to transform your classroom?
        </h2>
        <p className="mt-4 text-lg text-[var(--gray-600)]">
          Join thousands of institutions already using Klassruum to deliver world-class education.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/institutions/register">
            <Button size="lg" className="gap-2 px-8 shadow-xl shadow-[var(--primary)]/30">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/demo/classroom">
            <Button size="lg" variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Try Demo
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-sm text-[var(--gray-500)]">
          Free 14-day trial. No credit card required.
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
    { label: "Demo", to: "/demo/classroom" },
    { label: "Sign In", to: "/auth" },
  ];

  return (
    <footer className="border-t border-[var(--gray-200)] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
              <Star className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold text-[var(--gray-900)]">Klassruum</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--gray-500)]">
            {links.map((link) =>
              link.to ? (
                <Link key={link.label} to={link.to} className="hover:text-[var(--primary)]">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="hover:text-[var(--primary)]">
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>

        <div className="mt-8 border-t border-[var(--gray-100)] pt-8 text-center text-sm text-[var(--gray-400)]">
          <p>&copy; {new Date().getFullYear()} Klassruum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
