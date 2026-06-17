/**
 * BlogLayout — shared layout for individual blog posts.
 * Provides consistent SEO structure, header, footer, and article styling.
 */

import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Footer } from "@/components/landing/Footer";
import "@/styles/landing.css";

export interface BlogPostMeta {
  title: string;
  description: string;
  keywords?: string;
  publishDate: string;
  readTime: string;
  author?: string;
}

export function BlogLayout({ meta, children }: { meta: BlogPostMeta; children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-heading">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center">
            <Logo size={30} />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-body">
            <Link to="/blog" className="hidden transition-colors hover:text-heading sm:inline">
              Blog
            </Link>
            <Link to="/features" className="hidden transition-colors hover:text-heading sm:inline">
              Features
            </Link>
            <Link to="/pricing" className="hidden transition-colors hover:text-heading sm:inline">
              Pricing
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-full bg-heading px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-[720px] px-5 py-12 sm:px-8 sm:py-16">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-heading transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All articles
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-muted mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {meta.publishDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {meta.readTime}
          </span>
          {meta.author && <span>By {meta.author}</span>}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold leading-[1.12] tracking-tight text-heading mb-6">
          {meta.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-body leading-relaxed mb-10">{meta.description}</p>

        {/* Divider */}
        <div className="h-px bg-border mb-10" />

        {/* Content */}
        <div className="prose-klassruum">{children}</div>
      </article>

      <Footer />
    </div>
  );
}
