import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/landing/Footer";
import { CTAButton } from "@/components/landing/primitives";
import {
  Clock,
  ArrowRight,
  GraduationCap,
  Accessibility,
  Globe,
  Shield,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import "@/styles/landing.css";

const BLOG_POSTS = [
  {
    slug: "ai-teaching-vs-content-delivery",
    title:
      "Why AI teaching beats content delivery: The difference between a classroom and a document",
    description:
      "The fundamental difference between content delivery and actual teaching — and why it matters for every education institution.",
    icon: <GraduationCap size={20} />,
    category: "Teaching methodology",
    readTime: "14 min read",
    date: "June 2026",
  },
  {
    slug: "wcag-22-virtual-classrooms",
    title: "WCAG 2.2 in virtual classrooms: What every education institution needs to know",
    description:
      "A comprehensive guide to web accessibility standards in AI-powered learning environments.",
    icon: <Accessibility size={20} />,
    category: "Accessibility",
    readTime: "16 min read",
    date: "June 2026",
  },
  {
    slug: "ai-classrooms-2026",
    title: "How schools are using AI classrooms in 2026: Trends, results, and what's next",
    description: "Real adoption patterns, engagement data, and predictions for AI in education.",
    icon: <Globe size={20} />,
    category: "Industry trends",
    readTime: "15 min read",
    date: "June 2026",
  },
  {
    slug: "gdpr-edtech-guide",
    title: "GDPR compliance for EdTech: A practical guide for education institutions",
    description:
      "The definitive guide to data protection in educational technology — from lawful bases to DPIAs.",
    icon: <Shield size={20} />,
    category: "Compliance",
    readTime: "17 min read",
    date: "June 2026",
  },
  {
    slug: "future-structured-learning",
    title: "The future of structured learning: How AI classrooms are reshaping education",
    description:
      "Why structure — not just access — is the key to effective learning, and where AI classrooms fit.",
    icon: <Lightbulb size={20} />,
    category: "Thought leadership",
    readTime: "15 min read",
    date: "June 2026",
  },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Klassruum" },
      {
        name: "description",
        content:
          "In-depth articles on AI teaching, accessibility, GDPR compliance, and the future of structured learning in education.",
      },
      {
        name: "keywords",
        content:
          "EdTech blog, AI teaching, virtual classrooms, WCAG accessibility, GDPR education, structured learning",
      },
    ],
  }),
  component: () => (
    <div className="min-h-screen overflow-hidden bg-white text-heading">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center">
            <Logo size={30} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-body">
            <Link to="/features" className="hidden transition-colors hover:text-heading sm:inline">
              Features
            </Link>
            <Link to="/pricing" className="hidden transition-colors hover:text-heading sm:inline">
              Pricing
            </Link>
            <Link
              to="/demo/classroom"
              className="hidden transition-colors hover:text-heading sm:inline"
            >
              Demo
            </Link>
            <CTAButton to="/auth" size="md" className="h-10 px-4">
              Get started
            </CTAButton>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-border bg-page-background-alt">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted mb-5">
            <Sparkles className="h-3.5 w-3.5" /> Blog
          </span>
          <h1 className="max-w-4xl text-3xl font-black leading-[1.1] tracking-tight text-heading sm:text-4xl lg:text-[2.75rem]">
            Notes on teaching, technology and inclusion
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">
            Perspectives from the Klassruum team on building classrooms that teach like real
            teachers, reaching learners everyone else leaves behind, and what accessible education
            really takes.
          </p>
        </div>
      </section>

      {/* Blog posts grid */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-xl border border-border bg-white p-6 transition-all hover:shadow-md hover:border-border/80 flex flex-col"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft-blue text-learning-blue mb-4">
                {post.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                {post.category}
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-heading leading-snug mb-2 group-hover:text-learning-blue transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-body leading-relaxed flex-1 mb-4">{post.description}</p>
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-learning-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-page-background-alt">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-heading mb-3">Try the AI classroom</h2>
          <p className="text-body mb-6 max-w-lg mx-auto">
            See how structured AI teaching works in practice. No account required.
          </p>
          <CTAButton to="/demo/classroom" size="lg" showArrow>
            Enter the demo classroom
          </CTAButton>
        </div>
      </section>

      <Footer />
    </div>
  ),
});
