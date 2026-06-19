export type BlogCategory =
  | "Teaching methodology"
  | "Accessibility"
  | "Industry trends"
  | "Compliance"
  | "Thought leadership";

export type BlogSection = {
  id: string;
  title: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  audience: string;
  readTime: string;
  publishDate: string;
  wordCount: number;
  author: string;
  featured?: boolean;
  tags: string[];
  outcomes: string[];
  sections: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-teaching-vs-content-delivery",
    title:
      "Why AI teaching beats content delivery: The difference between a classroom and a document",
    description:
      "A practical explanation of why real learning requires narration, feedback, practice, and adaptation, not just uploaded content.",
    category: "Teaching methodology",
    audience: "School leaders, online academies, training teams",
    readTime: "14 min read",
    publishDate: "June 2026",
    wordCount: 3600,
    author: "Klassruum Team",
    featured: true,
    tags: ["AI teaching", "Pedagogy", "Learning design"],
    outcomes: [
      "Separate content delivery from actual teaching",
      "Understand why completion rates fail in passive learning products",
      "Evaluate AI classroom features against learning science",
    ],
    sections: [
      { id: "content-delivery", title: "What content delivery actually is" },
      { id: "completion-problem", title: "The completion problem" },
      { id: "ai-teaching", title: "What AI teaching actually looks like" },
      { id: "learning-science", title: "The science of learning" },
      { id: "accessibility-methodology", title: "Accessibility as a teaching methodology" },
      { id: "classroom-dynamic", title: "The real classroom dynamic" },
    ],
  },
  {
    slug: "wcag-22-virtual-classrooms",
    title: "WCAG 2.2 in virtual classrooms: What every education institution needs to know",
    description:
      "A structured guide to accessibility standards, classroom interaction patterns, testing, and implementation priorities.",
    category: "Accessibility",
    audience: "Accessibility leads, IT teams, academic operations",
    readTime: "16 min read",
    publishDate: "June 2026",
    wordCount: 4300,
    author: "Klassruum Team",
    tags: ["WCAG 2.2", "Accessibility", "Virtual classrooms"],
    outcomes: [
      "Translate WCAG principles into classroom requirements",
      "Identify accessibility risks in live teaching interfaces",
      "Plan a practical audit and implementation path",
    ],
    sections: [
      { id: "wcag-education", title: "What is WCAG 2.2 and why does it matter for education?" },
      { id: "pour-principles", title: "The four principles" },
      { id: "new-in-wcag-22", title: "What is new in WCAG 2.2" },
      { id: "classroom-challenges", title: "Virtual classroom accessibility challenges" },
      { id: "accessibility-modes", title: "Built-in support for every learner" },
      { id: "testing-methodology", title: "Testing methodology" },
      { id: "implementation-guide", title: "Implementation guide" },
    ],
  },
  {
    slug: "ai-classrooms-2026",
    title: "How schools are using AI classrooms in 2026: Trends, results, and what's next",
    description:
      "Adoption patterns across schools, universities, training providers, and NGOs with practical evaluation criteria.",
    category: "Industry trends",
    audience: "Education executives, product buyers, innovation teams",
    readTime: "15 min read",
    publishDate: "June 2026",
    wordCount: 3900,
    author: "Klassruum Team",
    tags: ["AI classrooms", "Education trends", "Institutional adoption"],
    outcomes: [
      "See how different institution types are using AI classrooms",
      "Understand engagement, accessibility, and cost patterns",
      "Choose platform capabilities that matter beyond novelty",
    ],
    sections: [
      { id: "state-of-ai", title: "The state of AI in education in 2026" },
      { id: "model-evolution", title: "From chatbots to classrooms" },
      { id: "school-patterns", title: "Case patterns across institutions" },
      { id: "teacher-role", title: "The teacher's evolving role" },
      { id: "engagement-data", title: "Student engagement data" },
      { id: "privacy-ethics", title: "Privacy and ethics" },
      { id: "platform-evaluation", title: "What to look for in an AI classroom platform" },
    ],
  },
  {
    slug: "gdpr-edtech-guide",
    title: "GDPR compliance for EdTech: A practical guide for education institutions",
    description:
      "A decision-ready guide for lawful bases, children's data, DPIAs, vendor due diligence, and institutional rollout.",
    category: "Compliance",
    audience: "DPOs, school leaders, procurement, IT administrators",
    readTime: "17 min read",
    publishDate: "June 2026",
    wordCount: 5200,
    author: "Klassruum Team",
    featured: true,
    tags: ["GDPR", "Data protection", "EdTech compliance"],
    outcomes: [
      "Map GDPR obligations to everyday EdTech decisions",
      "Understand lawful basis, minors' data, DPIAs, and transfers",
      "Use a vendor due-diligence structure before procurement",
    ],
    sections: [
      { id: "gdpr-matters", title: "Why GDPR matters for EdTech" },
      { id: "roles", title: "Controller, processor, or joint controller?" },
      { id: "lawful-basis", title: "Lawful bases for education data" },
      { id: "childrens-data", title: "Children's data and special category data" },
      { id: "dpia", title: "DPIAs for AI-powered learning platforms" },
      { id: "vendor-checklist", title: "Vendor due diligence checklist" },
      { id: "implementation", title: "Building a GDPR-ready adoption process" },
    ],
  },
  {
    slug: "future-structured-learning",
    title: "The future of structured learning: How AI classrooms are reshaping education",
    description:
      "Why the next wave of EdTech is about guided explanation, practice, and feedback at scale, not more content access.",
    category: "Thought leadership",
    audience: "Institutional leaders, curriculum teams, EdTech strategists",
    readTime: "15 min read",
    publishDate: "June 2026",
    wordCount: 4100,
    author: "Klassruum Team",
    tags: ["Structured learning", "AI classrooms", "Learning strategy"],
    outcomes: [
      "Understand why structure is the missing layer in digital learning",
      "Compare AI classrooms with LMS and content-library models",
      "Plan for curriculum, assessment, and inclusive delivery changes",
    ],
    sections: [
      { id: "content-access-problem", title: "Why content access is not enough" },
      { id: "structured-learning", title: "What structured learning actually means" },
      { id: "ai-classroom-layer", title: "The AI classroom as a new learning layer" },
      { id: "rag-curriculum", title: "Why curriculum-grounded AI changes quality" },
      { id: "assessment-evolution", title: "The evolution of assessment" },
      { id: "institutional-shift", title: "What this means for institutions" },
      { id: "future-view", title: "The classroom of the future" },
    ],
  },
];

export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((post) => post.category)));

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostHref(slug: string) {
  switch (slug) {
    case "ai-classrooms-2026":
      return "/blog/ai-classrooms-2026" as const;
    case "ai-teaching-vs-content-delivery":
      return "/blog/ai-teaching-vs-content-delivery" as const;
    case "future-structured-learning":
      return "/blog/future-structured-learning" as const;
    case "gdpr-edtech-guide":
      return "/blog/gdpr-edtech-guide" as const;
    case "wcag-22-virtual-classrooms":
      return "/blog/wcag-22-virtual-classrooms" as const;
    default:
      return "/blog" as const;
  }
}

export function getRelatedPosts(slug: string, limit = 2) {
  const current = getBlogPost(slug);

  if (!current) {
    return BLOG_POSTS.slice(0, limit);
  }

  return BLOG_POSTS.filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const categoryScore = Number(b.category === current.category) - Number(a.category === current.category);
      if (categoryScore !== 0) return categoryScore;

      const aOverlap = a.tags.filter((tag) => current.tags.includes(tag)).length;
      const bOverlap = b.tags.filter((tag) => current.tags.includes(tag)).length;
      return bOverlap - aOverlap;
    })
    .slice(0, limit);
}

export function getBlogApiPayload() {
  return {
    count: BLOG_POSTS.length,
    categories: BLOG_CATEGORIES,
    posts: BLOG_POSTS.map((post) => ({
      ...post,
      url: `/blog/${post.slug}`,
    })),
  };
}
