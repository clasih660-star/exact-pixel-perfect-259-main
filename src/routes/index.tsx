import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sparkles, Mic, PencilRuler, Brain, GraduationCap, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <Link to="/demo/classroom" className="hover:text-foreground">
            Demo Classroom
          </Link>
          <Link to="/institutions/register" className="hover:text-foreground">
            For Institutions
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/institutions/register">
            <Button size="sm">Register institution</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Real-time AI teaching loop
        </div>
        <h1 className="mx-auto max-w-3xl text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Virtual classrooms for{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            every learner
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Create intelligent online classrooms where teachers, students, and AI work together
          through voice, whiteboard, captions, transcripts, quizzes, and accessible learning tools.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard">
            <Button size="lg" className="shadow-[var(--shadow-brand)]">
              Enter Demo Classroom <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/institutions/register">
            <Button size="lg" variant="outline">
              Register Your Institution
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
          <div
            className="aspect-video w-full overflow-hidden rounded-xl"
            style={{ background: "var(--gradient-brand)" }}
          >
            <div className="flex h-full items-center justify-center text-primary-foreground/90">
              <div className="text-center">
                <GraduationCap className="mx-auto h-16 w-16" />
                <p className="mt-3 text-sm font-medium opacity-90">Live classroom preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Mic,
      title: "Voice-first teaching",
      desc: "Students speak naturally. Klassruum listens, responds, and runs the lesson with realistic voice.",
    },
    {
      icon: PencilRuler,
      title: "Live whiteboard",
      desc: "The AI writes equations, draws diagrams, and highlights ideas as it explains them.",
    },
    {
      icon: Brain,
      title: "Adaptive lesson flow",
      desc: "Tracks understanding turn-by-turn and adjusts difficulty, pace, and examples for each student.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Not a chatbot. A real teacher.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Klassruum runs a full teaching loop, not just Q&amp;A.
        </p>
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {items.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
          >
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Pick a lesson", d: "Choose any subject or upload your own curriculum." },
    {
      n: "02",
      t: "Enter the classroom",
      d: "The AI greets you, sets the agenda, and starts teaching.",
    },
    {
      n: "03",
      t: "Ask, answer, explore",
      d: "Talk or type. The AI explains, quizzes, and adapts as you go.",
    },
  ];
  return (
    <section id="how" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="text-5xl font-bold tracking-tight text-primary/20">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Bring your institution online
      </h2>
      <p className="mt-4 text-muted-foreground">
        Set up branded classrooms, upload resources, and start teaching in minutes.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/institutions/register">
          <Button size="lg" className="shadow-[var(--shadow-brand)]">
            Register Your Institution <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button size="lg" variant="outline">
            Enter Demo Classroom
          </Button>
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <Logo />
        <p>© {new Date().getFullYear()} Klassruum. All rights reserved.</p>
      </div>
    </footer>
  );
}
