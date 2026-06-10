import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sparkles, Mic, PencilRuler, Brain, GraduationCap, ArrowRight, Users, School, Accessibility, Play, CircleCheck as CheckCircle2, ChevronRight, Zap, BookOpen, Monitor, Volume2, Bubbles as Subtitles, Trophy, Clock3, ChartBar as BarChart3, Lightbulb, Target, Calculator, Atom, Languages, Map, Globe, Palette, Music, Settings, Shield, Heart, Clock, Award, Headphones, Video, MessageSquare, LayoutDashboard, UserCheck, FileCheck, Bot, Wifi, Eye, Type, Hand, Focus, RotateCcw, HelpCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klassruum - AI Virtual Classroom Platform | Voice-First Adaptive Learning for K-12 & Higher Ed" },
      {
        name: "description",
        content:
          "Transform education with Klassruum's AI-powered virtual classroom. Voice-first teaching, interactive whiteboard, adaptive learning, real-time captions in 10+ languages, and full accessibility. Perfect for math, science, languages, and all subjects. Trusted by 500+ schools and 50,000+ students worldwide.",
      },
      {
        name: "keywords",
        content:
          "AI classroom, virtual teaching platform, online learning, voice-first education, adaptive learning, educational technology, edtech platform, math AI tutor, science virtual classroom, language learning AI, accessible education, K-12 online learning, higher education technology, interactive whiteboard, AI teacher, personalized learning, special education technology, WCAG compliant education",
      },
      { property: "og:title", content: "Klassruum - AI-Powered Virtual Classrooms That Adapt to Every Learner" },
      {
        property: "og:description",
        content:
          "Experience the future of education: AI teachers that speak, write, and adapt to each student. Voice interaction, live captions, interactive whiteboard, and built-in accessibility. Start free trial today.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/images/scenes/scene-1.png" },
      { property: "og:url", content: "https://klassruum.com" },
      { property: "og:site_name", content: "Klassruum" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Klassruum - AI Virtual Classroom Platform" },
      { name: "twitter:description", content: "AI teachers that speak, write, and adapt to every learner. Voice-first, accessible, and personalized." },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "author", content: "Klassruum" },
      { name: "theme-color", content: "#1D4ED8" },
      { name: "canonical", content: "https://klassruum.com" },
      { "http-equiv": "content-language", content: "en" },
    ],
    links: [
      { rel: "canonical", href: "https://klassruum.com" },
    ],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Klassruum",
          "applicationCategory": "EducationalApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free trial available"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2847",
            "bestRating": "5"
          },
          "description": "AI-powered virtual classroom platform with voice-first teaching, adaptive learning, and accessibility features",
          "provider": {
            "@type": "Organization",
            "name": "Klassruum",
            "url": "https://klassruum.com"
          }
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Klassruum and how does it work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Klassruum is an AI-powered virtual classroom platform where an AI teacher delivers lessons using voice, interactive whiteboard, and adaptive learning. Students can speak or type questions, receive personalized explanations, and learn at their own pace with real-time captions and accessibility support."
              }
            },
            {
              "@type": "Question",
              "name": "What subjects does Klassruum support?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Klassruum supports all subjects including Mathematics, Sciences (Physics, Chemistry, Biology), Languages (English, French, Spanish), History, Geography, Arts, Music, and ICT. The AI adapts teaching style and content for each subject area."
              }
            },
            {
              "@type": "Question",
              "name": "Is Klassruum accessible for students with disabilities?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Klassruum is WCAG 2.1 AA compliant with comprehensive accessibility features including live captions, screen reader support, adjustable speech rate, high contrast mode, focus mode for ADHD, deaf mode for hearing impaired, blind mode for visually impaired, and speech difficulty support."
              }
            },
            {
              "@type": "Question",
              "name": "How does the AI teacher adapt to each student?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The AI tracks student comprehension in real-time, adjusts pace and difficulty automatically, provides simpler explanations when needed, generates personalized practice problems, and identifies weak areas for targeted learning. It also supports spaced repetition for long-term retention."
              }
            },
            {
              "@type": "Question",
              "name": "Can schools and institutions use Klassruum?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Klassruum offers institutional plans with white-label options, custom branding, unlimited teachers and students, curriculum import, comprehensive admin dashboards, real-time analytics, and enterprise support."
              }
            }
          ]
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Klassruum",
          "url": "https://klassruum.com",
          "logo": "https://klassruum.com/logo.png",
          "sameAs": [],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales",
            "availableLanguage": ["English"]
          }
        }),
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
      <SubjectsSection />
      <HowItWorks />
      <ClassroomPreview />
      <TechnologySection />
      <AccessibilitySection />
      <Stats />
      <ForInstitutions />
      <ComparisonSection />
      <Testimonials />
      <FAQSection />
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
  const partners = [
    { value: "500+", label: "Schools & Districts", icon: School },
    { value: "50+", label: "Universities", icon: GraduationCap },
    { value: "10,000+", label: "Teachers", icon: Users },
    { value: "50,000+", label: "Students", icon: Brain },
  ];

  return (
    <section className="border-y border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-gray-500 mb-10">
          Trusted globally by educational institutions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <div key={partner.label} className="text-center group">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 mb-3 group-hover:bg-blue-100 transition-colors">
                <partner.icon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{partner.value}</p>
              <p className="text-sm text-gray-600 mt-1">{partner.label}</p>
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
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 mb-4">
            <Award className="h-4 w-4" />
            Trusted Worldwide
          </div>
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

function SubjectsSection() {
  const subjects = [
    { icon: Calculator, name: "Mathematics", topics: "Algebra, Geometry, Calculus, Statistics", color: "from-violet-50 to-violet-100", iconColor: "text-violet-600", desc: "Step-by-step problem solving, equation visualization, and practice with instant feedback" },
    { icon: Atom, name: "Sciences", topics: "Physics, Chemistry, Biology, Earth Science", color: "from-emerald-50 to-emerald-100", iconColor: "text-emerald-600", desc: "Interactive experiments, concept explanations, and real-world applications" },
    { icon: Languages, name: "Languages", topics: "English, French, Spanish, German", color: "from-orange-50 to-orange-100", iconColor: "text-orange-600", desc: "Grammar lessons, vocabulary building, pronunciation practice, and conversation" },
    { icon: BookOpen, name: "History & Civics", topics: "World History, Government, Economics", color: "from-amber-50 to-amber-100", iconColor: "text-amber-600", desc: "Timeline visualizations, cause-and-effect analysis, and critical thinking" },
    { icon: Map, name: "Geography", topics: "Physical Geography, Human Geography, Maps", color: "from-cyan-50 to-cyan-100", iconColor: "text-cyan-600", desc: "Interactive maps, spatial reasoning, and environmental understanding" },
    { icon: Palette, name: "Arts & Music", topics: "Visual Arts, Music Theory, Drama", color: "from-pink-50 to-pink-100", iconColor: "text-pink-600", desc: "Creative techniques, art history, composition, and performance skills" },
  ];

  return (
    <section id="subjects" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 mb-4">
            <BookOpen className="h-4 w-4" />
            All Subjects Supported
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            One platform for{" "}
            <span className="text-blue-600">every subject</span>
          </h2>
          <p className="text-lg text-gray-600">
            The AI adapts its teaching style, examples, and explanations for each subject area
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.name}
              className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${subject.color} mb-4`}>
                <subject.icon className={`h-6 w-6 ${subject.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{subject.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{subject.topics}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{subject.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccessibilitySection() {
  const features = [
    { icon: Subtitles, title: "Live Captions", desc: "Real-time speech-to-text in 10+ languages" },
    { icon: Eye, title: "Screen Reader Support", desc: "Full ARIA labels and semantic HTML" },
    { icon: Volume2, title: "Adjustable Speech Rate", desc: "0.5x to 2x speed control" },
    { icon: Type, title: "High Contrast Mode", desc: "Enhanced visibility for visual impairments" },
    { icon: Focus, title: "ADHD Focus Mode", desc: "Minimal distractions, streamlined interface" },
    { icon: Hand, title: "Motor Support", desc: "Full keyboard navigation, voice control" },
  ];

  return (
    <section id="accessibility" className="py-24 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 mb-6">
              <Accessibility className="h-4 w-4" />
              WCAG 2.1 AA Compliant
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Education for{" "}
              <span className="text-blue-600">every learner</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Klassruum is built from the ground up with accessibility in mind. Every student deserves equal access to quality education, regardless of their abilities.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-3 p-4 rounded-xl bg-white border border-gray-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Accessibility Settings</span>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Captions", value: "English", active: true },
                  { label: "Speech Rate", value: "1.0x", active: true },
                  { label: "High Contrast", value: "Off", active: false },
                  { label: "Focus Mode", value: "On", active: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-gray-700">{setting.label}</span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${setting.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {setting.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechnologySection() {
  return (
    <section id="technology" className="py-24 bg-white border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 mb-4">
            <Brain className="h-4 w-4" />
            Advanced AI Technology
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Powered by cutting-edge{" "}
            <span className="text-blue-600">AI technology</span>
          </h2>
          <p className="text-lg text-gray-600">
            Our AI doesn't just respond — it teaches, adapts, and learns alongside your students
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Mic className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Natural Voice Interaction</h3>
              </div>
              <p className="text-gray-600">
                Students speak naturally in their own words. Our AI understands context, interprets questions, and responds with clear, educational explanations — not just retrieval.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Lightbulb className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Adaptive Learning Engine</h3>
              </div>
              <p className="text-gray-600">
                Real-time comprehension tracking adjusts pace, difficulty, and examples. The AI identifies weak areas and provides targeted practice for mastery.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <PencilRuler className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Interactive Whiteboard</h3>
              </div>
              <p className="text-gray-600">
                Watch equations, diagrams, and concepts appear step-by-step. The AI teacher writes, reads, and explains — just like a real classroom.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <RotateCcw className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Spaced Repetition System</h3>
              </div>
              <p className="text-gray-600">
                Built-in memory science ensures long-term retention. The AI schedules reviews at optimal intervals for each concept and learner.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-red-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <FileCheck className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Intelligent Assessment</h3>
              </div>
              <p className="text-gray-600">
                Dynamic quiz generation based on lesson content. Instant feedback, misconception detection, and mastery tracking built in.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-cyan-50 to-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100">
                  <Shield className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Enterprise Security</h3>
              </div>
              <p className="text-gray-600">
                SOC 2 compliant, end-to-end encryption, FERPA/GDPR ready. Your student data is protected with bank-level security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Klassruum and how does it work?",
      answer: "Klassruum is an AI-powered virtual classroom platform where an AI teacher delivers lessons using voice, interactive whiteboard, and adaptive learning. Students can speak or type questions, receive personalized explanations, and learn at their own pace with real-time captions and accessibility support. The system tracks comprehension, adjusts difficulty, and provides targeted practice."
    },
    {
      question: "What subjects does Klassruum support?",
      answer: "Klassruum supports all academic subjects including Mathematics (Algebra, Geometry, Calculus), Sciences (Physics, Chemistry, Biology), Languages (English, French, Spanish, German), History, Geography, Arts, Music, and Computer Science. The AI adapts teaching style, examples, and explanations for each subject area automatically."
    },
    {
      question: "Is Klassruum accessible for students with disabilities?",
      answer: "Yes, Klassruum is fully WCAG 2.1 AA compliant with comprehensive accessibility features: live captions in 10+ languages, screen reader support, adjustable speech rate (0.5x-2x), high contrast mode, ADHD focus mode, deaf mode, blind mode, and speech difficulty support. We believe every student deserves equal access to quality education."
    },
    {
      question: "How does the AI teacher adapt to each student?",
      answer: "Our AI tracks comprehension in real-time through student responses and questions. It automatically adjusts pace (slower or faster), provides simpler or deeper explanations, generates personalized practice problems based on weak areas, and implements spaced repetition for long-term memory retention. Each student gets a personalized learning path."
    },
    {
      question: "Can schools and institutions use Klassruum?",
      answer: "Absolutely! We offer institutional plans with white-label options, custom branding, unlimited teachers and students, curriculum import tools, comprehensive admin dashboards, real-time analytics, SSO integration, and dedicated enterprise support. Contact our team for a custom quote based on your institution's needs."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can explore the demo classroom, try the AI teacher, test accessibility features, and see the analytics dashboard before making any commitment. Setup takes less than 5 minutes."
    },
    {
      question: "What devices and browsers are supported?",
      answer: "Klassruum works on any modern web browser (Chrome, Firefox, Safari, Edge) on desktops, laptops, tablets, and smartphones. For the best voice interaction experience, we recommend using Chrome on a device with a microphone. No app installation required — everything runs in the browser."
    },
    {
      question: "How is student data protected?",
      answer: "Klassruum is SOC 2 Type II compliant and FERPA/GDPR ready. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never sell student data. Access controls ensure only authorized educators see student progress. Full audit logs are available for institutions."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 mb-4">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Got questions?
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about Klassruum
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <button
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === idx ? (
                  <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link to="/contact">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Our Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const features = [
    { feature: "AI Voice Teacher", klassruum: true, traditional: false, chatbot: false },
    { feature: "Interactive Whiteboard", klassruum: true, traditional: false, chatbot: false },
    { feature: "Adaptive Learning", klassruum: true, traditional: false, chatbot: false },
    { feature: "Real-time Comprehension Tracking", klassruum: true, traditional: false, chatbot: false },
    { feature: "Built-in Accessibility", klassruum: true, traditional: false, chatbot: false },
    { feature: "Multi-subject Support", klassruum: true, traditional: true, chatbot: true },
    { feature: "Full Lesson Orchestration", klassruum: true, traditional: false, chatbot: false },
    { feature: "Enterprise Admin Dashboard", klassruum: true, traditional: true, chatbot: false },
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-200">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why schools choose{" "}
            <span className="text-blue-600">Klassruum</span>
          </h2>
          <p className="text-lg text-gray-600">
            See how we compare to traditional online learning and basic AI chatbots
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-4 px-4 text-left font-semibold text-gray-900">Feature</th>
                <th className="py-4 px-4 text-center font-semibold text-blue-600">Klassruum</th>
                <th className="py-4 px-4 text-center font-semibold text-gray-500">Traditional LMS</th>
                <th className="py-4 px-4 text-center font-semibold text-gray-500">AI Chatbot</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, idx) => (
                <tr key={row.feature} className={idx < features.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                  <td className="py-4 px-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.traditional ? (
                      <CheckCircle className="h-5 w-5 text-gray-400 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {row.chatbot ? (
                      <CheckCircle className="h-5 w-5 text-gray-400 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Subjects", href: "#subjects" },
      { label: "Accessibility", href: "#accessibility" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", to: "/demo/classroom" },
    ],
    solutions: [
      { label: "For K-12 Schools", href: "#institutions" },
      { label: "For Universities", href: "#institutions" },
      { label: "For Tutoring Centers", href: "#institutions" },
      { label: "For Special Education", href: "#accessibility" },
    ],
    resources: [
      { label: "Help Center", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Webinars", href: "#" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", to: "/contact" },
      { label: "Partners", href: "#" },
    ],
  };

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "GDPR", href: "#" },
    { label: "FERPA", href: "#" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <LogoMark size={32} />
              <span className="font-bold text-xl text-white">Klassruum</span>
            </Link>
            <p className="text-gray-400 max-w-xs mb-6">
              AI-powered virtual classrooms that adapt to every learner's needs. Making quality education accessible to all.
            </p>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-400">SOC 2 Compliant</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <nav className="space-y-3 text-sm">
              {footerLinks.product.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to} className="block text-gray-400 hover:text-white transition">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className="block text-gray-400 hover:text-white transition">
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-semibold text-white mb-4">Solutions</h3>
            <nav className="space-y-3 text-sm">
              {footerLinks.solutions.map((link) => (
                <a key={link.label} href={link.href} className="block text-gray-400 hover:text-white transition">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <nav className="space-y-3 text-sm">
              {footerLinks.resources.map((link) => (
                <a key={link.label} href={link.href} className="block text-gray-400 hover:text-white transition">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <nav className="space-y-3 text-sm">
              {footerLinks.company.map((link) =>
                link.to ? (
                  <Link key={link.label} to={link.to} className="block text-gray-400 hover:text-white transition">
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className="block text-gray-400 hover:text-white transition">
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Klassruum. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-gray-300 transition">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
