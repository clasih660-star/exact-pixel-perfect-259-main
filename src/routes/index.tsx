import { createFileRoute, Link } from "@tanstack/react-router";
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
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <LogoMark size={32} />
          <span className="hidden sm:block font-bold text-lg tracking-tight text-gray-900">
            Klassruum
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 lg:flex">
          <a href="#features" className="transition-colors hover:text-gray-900 hover:text-blue-600">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-gray-900 hover:text-blue-600">
            How it works
          </a>
          <a href="#preview" className="transition-colors hover:text-gray-900 hover:text-blue-600">
            Classroom
          </a>
          <a href="#institutions" className="transition-colors hover:text-gray-900 hover:text-blue-600">
            For Schools
          </a>
          <a href="#pricing" className="transition-colors hover:text-gray-900 hover:text-blue-600">
            Pricing
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
              Sign in
            </Button>
          </Link>
          <Link to="/student/dashboard">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md">
              Try Demo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Animated background gradient orbs */}
      <div className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-indigo-200/15 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            AI-Powered Education Platform
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-5xl text-center text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 mb-8">
          The Future of{" "}
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Smart Learning
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto max-w-3xl text-center text-lg sm:text-xl text-gray-600 leading-relaxed mb-10">
          Klassruum transforms education through AI-powered virtual classrooms. Voice-first teaching, 
          interactive learning, and adaptive content—all designed for accessibility and engagement.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/student/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base gap-2 shadow-xl hover:shadow-2xl">
              <Play className="h-5 w-5" />
              Try Demo Classroom
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/institutions/register">
            <Button size="lg" variant="outline" className="px-8 py-6 text-base gap-2 border-gray-300 hover:bg-gray-50">
              Register Your School
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-16">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium">14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium">Setup in 5 minutes</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {/* Browser Frame */}
            <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-4 text-xs text-gray-400">classroom.klassruum.com</span>
            </div>

            {/* Preview Content */}
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white z-10">
                <div className="relative mx-auto mb-8">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-2xl" />
                  <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl">
                    <GraduationCap className="h-12 w-12" />
                  </div>
                </div>
                <p className="text-2xl font-semibold mb-2">AI Teacher Active</p>
                <p className="text-gray-300">Real-time interactive lesson in progress</p>
              </div>

              {/* UI Elements */}
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/20 bg-slate-900/90 px-4 py-2 backdrop-blur">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Volume2 className="h-4 w-4 text-green-400" />
                  <span>Speaking: "Let's master quadratic equations..."</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-3">
                <div className="rounded-lg border border-white/20 bg-slate-900/90 px-4 py-2 text-sm text-white backdrop-blur flex items-center gap-2">
                  <Subtitles className="h-4 w-4 text-blue-400" />
                  Captions On
                </div>
                <div className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
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

        <div className="mt-12 flex justify-center mb-12">
          <Link to="/demo/classroom">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2 px-8 py-6 text-base shadow-xl">
              <Play className="h-5 w-5" />
              Launch Demo Classroom
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Key Features Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Volume2, text: "Real-time voice AI", color: "text-blue-600" },
            { icon: Subtitles, text: "Live captions (10+ languages)" },
            { icon: PencilRuler, text: "Interactive whiteboard" },
            { icon: Brain, text: "Adaptive learning engine" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                <item.icon className={`h-5 w-5 ${item.color || "text-blue-600"}`} />
              </div>
              <span className="text-sm font-semibold text-gray-900">{item.text}</span>
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
    <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-white mb-3">{stat.value}</div>
              <div className="text-base sm:text-lg text-white/90 font-medium">{stat.label}</div>
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
