/**
 * Route file generator for Klassruum
 * Run: node scripts/generate-routes.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Helper: create a TanStack Router route file
function route(relPath, content) {
  const fullPath = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + "\n");
  console.log("  Created:", relPath);
}

// ─── Public Marketing Routes ──────────────────────────────────────

const publicPages = [
  {
    file: "src/routes/about.tsx",
    title: "About Klassruum",
    desc: "Learn about our mission to transform education with AI-powered classrooms.",
  },
  {
    file: "src/routes/features.tsx",
    title: "Features",
    desc: "Explore Klassruum features: AI teaching, interactive classrooms, lesson generation, and more.",
  },
  {
    file: "src/routes/how-it-works.tsx",
    title: "How It Works",
    desc: "From materials to lessons to live classrooms — see how Klassruum works.",
  },
  {
    file: "src/routes/pricing.tsx",
    title: "Pricing",
    desc: "Plans for institutions, teachers, and individual learners.",
  },
  {
    file: "src/routes/contact.tsx",
    title: "Contact Us",
    desc: "Get in touch with the Klassruum team.",
  },
  {
    file: "src/routes/help.tsx",
    title: "Help Center",
    desc: "Guides, FAQs, and support resources.",
  },
  {
    file: "src/routes/privacy.tsx",
    title: "Privacy Policy",
    desc: "How Klassruum handles your data and privacy.",
  },
  {
    file: "src/routes/terms.tsx",
    title: "Terms of Service",
    desc: "Terms and conditions for using Klassruum.",
  },
  {
    file: "src/routes/accessibility.tsx",
    title: "Accessibility",
    desc: "Klassruum accessibility commitment and features.",
  },
];

for (const p of publicPages) {
  route(
    p.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/${path.basename(p.file, ".tsx")}")({
  component: () => (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="border-b border-[var(--gray-200)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[var(--gray-900)]">← Klassruum</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--gray-900)]">${p.title}</h1>
        <p className="mt-4 text-lg text-[var(--gray-600)]">${p.desc}</p>
        <div className="mt-8 rounded-lg border border-dashed border-[var(--gray-300)] bg-white p-8 text-center">
          <p className="text-sm text-[var(--gray-400)]">This page is under construction.</p>
        </div>
      </main>
    </div>
  ),
});
`,
  );
}

// ─── Auth Sub-routes ──────────────────────────────────────────────

const authRoutes = [
  { file: "src/routes/_auth/route.tsx", path: "/_auth", isLayout: true },
  {
    file: "src/routes/_auth/index.tsx",
    path: "/_auth/",
    title: "Login",
    desc: "Sign in to Klassruum",
  },
  {
    file: "src/routes/_auth/login.tsx",
    path: "/_auth/login",
    title: "Login",
    desc: "Sign in to your Klassruum account",
  },
  {
    file: "src/routes/_auth/signup.tsx",
    path: "/_auth/signup",
    title: "Sign Up",
    desc: "Create a Klassruum account",
  },
  {
    file: "src/routes/_auth/forgot-password.tsx",
    path: "/_auth/forgot-password",
    title: "Forgot Password",
    desc: "Reset your Klassruum password",
  },
  {
    file: "src/routes/_auth/reset-password.tsx",
    path: "/_auth/reset-password",
    title: "Reset Password",
    desc: "Set your new password",
  },
  {
    file: "src/routes/_auth/verify-email.tsx",
    path: "/_auth/verify-email",
    title: "Verify Email",
    desc: "Verify your email address",
  },
  {
    file: "src/routes/_auth/complete-profile.tsx",
    path: "/_auth/complete-profile",
    title: "Complete Profile",
    desc: "Set up your Klassruum profile",
  },
  {
    file: "src/routes/_auth/select-role.tsx",
    path: "/_auth/select-role",
    title: "Select Role",
    desc: "Choose how you want to use Klassruum",
  },
];

for (const r of authRoutes) {
  if (r.isLayout) {
    route(
      r.file,
      `
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)]">
      <Outlet />
    </div>
  ),
});
`,
    );
  } else {
    route(
      r.file,
      `
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-[var(--gray-200)] bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[var(--gray-900)]">${r.title}</h1>
      <p className="text-sm text-[var(--gray-600)]">${r.desc}</p>
      <div className="rounded-lg border border-dashed border-[var(--gray-300)] p-6 text-center">
        <p className="text-sm text-[var(--gray-400)]">Coming soon</p>
      </div>
      <div className="text-center text-sm text-[var(--gray-500)]">
        <Link to="/auth" className="text-[var(--primary)] hover:underline">Back to login</Link>
      </div>
    </div>
  ),
});
`,
    );
  }
}

// ─── Auth Index (redirect to login) ──────────────────────────────
route(
  "src/routes/_auth/index.tsx",
  `
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/")({
  beforeLoad: () => {
    throw redirect({ to: "/auth" });
  },
  component: () => null,
});
`,
);

// ─── Dev routes (moved from _authenticated root) ──────────────────

const devRoutes = [
  { file: "src/routes/_authenticated/dev/route.tsx", path: "/_authenticated/dev", isLayout: true },
  {
    file: "src/routes/_authenticated/dev/simple-test.tsx",
    path: "/_authenticated/dev/simple-test",
    title: "Simple Test",
  },
  {
    file: "src/routes/_authenticated/dev/test.tsx",
    path: "/_authenticated/dev/test",
    title: "Test Page",
  },
  {
    file: "src/routes/_authenticated/dev/classroom-design.$lessonId.tsx",
    path: "/_authenticated/dev/classroom-design/$lessonId",
    title: "Classroom Design",
  },
  {
    file: "src/routes/_authenticated/dev/classroom-enhanced.$lessonId.tsx",
    path: "/_authenticated/dev/classroom-enhanced/$lessonId",
    title: "Classroom Enhanced",
  },
];

for (const r of devRoutes) {
  if (r.isLayout) {
    route(
      r.file,
      `
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-4 rounded border border-yellow-300 bg-yellow-50 p-2 text-xs text-yellow-800">
        ⚠️ Development-only routes — not shown in production navigation
      </div>
      <Outlet />
    </div>
  ),
});
`,
    );
  } else {
    route(
      r.file,
      `
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <div className="rounded-lg border border-gray-300 bg-white p-6">
      <h1 className="text-xl font-bold">${r.title}</h1>
      <p className="mt-2 text-sm text-gray-500">Development / testing page.</p>
      <div className="mt-4 rounded border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
        Placeholder — use for dev testing only
      </div>
    </div>
  ),
});
`,
    );
  }
}

// ─── Demo routes ──────────────────────────────────────────────────

const demoRoutes = [
  {
    file: "src/routes/demo/index.tsx",
    path: "/demo/",
    title: "Demo Hub",
    desc: "Explore Klassruum demos",
  },
  {
    file: "src/routes/demo/whiteboard.tsx",
    path: "/demo/whiteboard",
    title: "Whiteboard Demo",
    desc: "Interactive whiteboard demonstration",
  },
  {
    file: "src/routes/demo/accessibility.tsx",
    path: "/demo/accessibility",
    title: "Accessibility Demo",
    desc: "Accessibility features demonstration",
  },
];

for (const r of demoRoutes) {
  route(
    r.file,
    `
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const demos = [
  { to: "/demo/classroom", label: "AI Classroom", desc: "Full AI classroom experience" },
  { to: "/demo/teaching", label: "AI Teaching", desc: "AI teacher with whiteboard" },
  { to: "/demo/ai-video", label: "AI Video Teacher", desc: "Video-based AI teaching" },
  { to: "/demo/whiteboard", label: "Whiteboard", desc: "Interactive whiteboard" },
  { to: "/demo/accessibility", label: "Accessibility", desc: "Accessibility features" },
];

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="border-b border-[var(--gray-200)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[var(--gray-900)]">← Klassruum</Link>
          <span className="text-sm text-[var(--gray-500)]">Demos</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--gray-900)]">${r.title}</h1>
        <p className="mt-4 text-lg text-[var(--gray-600)]">${r.desc}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {demos.map((d) => (
            <Link key={d.to} to={d.to}>
              <Card className="h-full transition hover:shadow-md">
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold">{d.label}</h2>
                  <p className="mt-1 text-sm text-[var(--gray-500)]">{d.desc}</p>
                  <div className="mt-3 inline-flex items-center text-sm font-medium text-[var(--primary)]">
                    Try it <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  ),
});
`,
  );
}

// ─── Platform Admin Routes ────────────────────────────────────────

const adminRoutes = [
  {
    file: "src/routes/_authenticated/admin.dashboard.tsx",
    path: "/_authenticated/admin/dashboard",
    title: "Platform Dashboard",
    desc: "Overview of the Klassruum platform",
  },
  {
    file: "src/routes/_authenticated/admin.users.$userId.tsx",
    path: "/_authenticated/admin/users/$userId",
    title: "User Detail",
    desc: "View and manage user details",
  },
  {
    file: "src/routes/_authenticated/admin.institutions.$institutionId.tsx",
    path: "/_authenticated/admin/institutions/$institutionId",
    title: "Institution Detail",
    desc: "View institution details",
  },
  {
    file: "src/routes/_authenticated/admin.institutions.$institutionId.users.tsx",
    path: "/_authenticated/admin/institutions/$institutionId/users",
    title: "Institution Users",
    desc: "Manage institution members",
  },
  {
    file: "src/routes/_authenticated/admin.institutions.$institutionId.courses.tsx",
    path: "/_authenticated/admin/institutions/$institutionId/courses",
    title: "Institution Courses",
    desc: "View institution courses",
  },
  {
    file: "src/routes/_authenticated/admin.institutions.$institutionId.activity.tsx",
    path: "/_authenticated/admin/institutions/$institutionId/activity",
    title: "Institution Activity",
    desc: "View institution activity log",
  },
  {
    file: "src/routes/_authenticated/admin.kingpin-courses.tsx",
    path: "/_authenticated/admin/kingpin-courses",
    title: "KingPin Courses",
    desc: "Platform-owned courses for licensing",
  },
  {
    file: "src/routes/_authenticated/admin.kingpin-courses.new.tsx",
    path: "/_authenticated/admin/kingpin-courses/new",
    title: "New KingPin Course",
    desc: "Create a platform-owned course",
  },
  {
    file: "src/routes/_authenticated/admin.kingpin-courses.$courseId.tsx",
    path: "/_authenticated/admin/kingpin-courses/$courseId",
    title: "KingPin Course",
    desc: "Manage KingPin course",
  },
  {
    file: "src/routes/_authenticated/admin.kingpin-courses.$courseId.materials.tsx",
    path: "/_authenticated/admin/kingpin-courses/$courseId/materials",
    title: "Course Materials",
    desc: "Manage KingPin course materials",
  },
  {
    file: "src/routes/_authenticated/admin.kingpin-courses.$courseId.lessons.tsx",
    path: "/_authenticated/admin/kingpin-courses/$courseId/lessons",
    title: "Course Lessons",
    desc: "View KingPin course lessons",
  },
  {
    file: "src/routes/_authenticated/admin.kingpin-courses.$courseId.generate-lessons.tsx",
    path: "/_authenticated/admin/kingpin-courses/$courseId/generate-lessons",
    title: "Generate Lessons",
    desc: "AI lesson generation for KingPin course",
  },
  {
    file: "src/routes/_authenticated/admin.programmes.tsx",
    path: "/_authenticated/admin/programmes",
    title: "All Programmes",
    desc: "View all programmes across institutions",
  },
  {
    file: "src/routes/_authenticated/admin.programmes.$programmeId.tsx",
    path: "/_authenticated/admin/programmes/$programmeId",
    title: "Programme Detail",
    desc: "View programme details",
  },
  {
    file: "src/routes/_authenticated/admin.courses.tsx",
    path: "/_authenticated/admin/courses",
    title: "All Courses",
    desc: "View all courses across the platform",
  },
  {
    file: "src/routes/_authenticated/admin.lessons.tsx",
    path: "/_authenticated/admin/lessons",
    title: "All Lessons",
    desc: "View all lessons across the platform",
  },
  {
    file: "src/routes/_authenticated/admin.materials.tsx",
    path: "/_authenticated/admin/materials",
    title: "All Materials",
    desc: "View all course materials",
  },
  {
    file: "src/routes/_authenticated/admin.lesson-generation.tsx",
    path: "/_authenticated/admin/lesson-generation",
    title: "Lesson Generation Jobs",
    desc: "Monitor all AI lesson generation jobs",
  },
  {
    file: "src/routes/_authenticated/admin.lesson-generation.$jobId.tsx",
    path: "/_authenticated/admin/lesson-generation/$jobId",
    title: "Generation Job",
    desc: "View generation job details",
  },
  {
    file: "src/routes/_authenticated/admin.ai-settings.tsx",
    path: "/_authenticated/admin/ai-settings",
    title: "AI Settings",
    desc: "Configure AI providers and generation defaults",
  },
  {
    file: "src/routes/_authenticated/admin.realtime.tsx",
    path: "/_authenticated/admin/realtime",
    title: "Realtime Presence",
    desc: "View online users and active sessions",
  },
  {
    file: "src/routes/_authenticated/admin.activity.tsx",
    path: "/_authenticated/admin/activity",
    title: "Platform Activity",
    desc: "Recent platform-wide activity",
  },
  {
    file: "src/routes/_authenticated/admin.audit-logs.tsx",
    path: "/_authenticated/admin/audit-logs",
    title: "Audit Logs",
    desc: "Platform audit trail",
  },
];

for (const r of adminRoutes) {
  route(
    r.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <RouteStubPage
      title="${r.title}"
      description="${r.desc}"
      role="Platform Admin"
      items={[]}
    />
  ),
});
`,
  );
}

// ─── Institution Programme Routes ─────────────────────────────────

const institutionProgrammeRoutes = [
  {
    file: "src/routes/_authenticated/institution.programmes.tsx",
    path: "/_authenticated/institution/programmes",
    title: "Programmes",
    desc: "Manage your institution programmes",
  },
  {
    file: "src/routes/_authenticated/institution.programmes.new.tsx",
    path: "/_authenticated/institution/programmes/new",
    title: "Create Programme",
    desc: "Create a new academic programme",
  },
  {
    file: "src/routes/_authenticated/institution.programmes.$programmeId.tsx",
    path: "/_authenticated/institution/programmes/$programmeId",
    title: "Programme",
    desc: "View programme details and courses",
  },
  {
    file: "src/routes/_authenticated/institution.programmes.$programmeId.edit.tsx",
    path: "/_authenticated/institution/programmes/$programmeId/edit",
    title: "Edit Programme",
    desc: "Edit programme details",
  },
  {
    file: "src/routes/_authenticated/institution.programmes.$programmeId.courses.tsx",
    path: "/_authenticated/institution/programmes/$programmeId/courses",
    title: "Programme Courses",
    desc: "Manage courses in this programme",
  },
  {
    file: "src/routes/_authenticated/institution.programmes.$programmeId.students.tsx",
    path: "/_authenticated/institution/programmes/$programmeId/students",
    title: "Programme Students",
    desc: "View students enrolled in this programme",
  },
  {
    file: "src/routes/_authenticated/institution.programmes.$programmeId.analytics.tsx",
    path: "/_authenticated/institution/programmes/$programmeId/analytics",
    title: "Programme Analytics",
    desc: "Programme performance analytics",
  },
];

for (const r of institutionProgrammeRoutes) {
  route(
    r.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <RouteStubPage
      title="${r.title}"
      description="${r.desc}"
      role="Institution Admin"
      items={[]}
    />
  ),
});
`,
  );
}

// ─── Institution Course Material & Lesson Generation Routes ───────

const institutionCourseRoutes = [
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.edit.tsx",
    path: "/_authenticated/institution/courses/$courseId/edit",
    title: "Edit Course",
    desc: "Edit course details and settings",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.materials.tsx",
    path: "/_authenticated/institution/courses/$courseId/materials",
    title: "Course Materials",
    desc: "Manage materials for this course",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.materials.upload.tsx",
    path: "/_authenticated/institution/courses/$courseId/materials/upload",
    title: "Upload Material",
    desc: "Upload new course material",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.lessons.tsx",
    path: "/_authenticated/institution/courses/$courseId/lessons",
    title: "Course Lessons",
    desc: "View and manage lessons for this course",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.lessons.new.tsx",
    path: "/_authenticated/institution/courses/$courseId/lessons/new",
    title: "Create Lesson",
    desc: "Create a new lesson manually",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.generate-lessons.tsx",
    path: "/_authenticated/institution/courses/$courseId/generate-lessons",
    title: "Generate Lessons",
    desc: "AI lesson generation settings",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.generation-jobs.tsx",
    path: "/_authenticated/institution/courses/$courseId/generation-jobs",
    title: "Generation Jobs",
    desc: "View lesson generation jobs for this course",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.enrollments.tsx",
    path: "/_authenticated/institution/courses/$courseId/enrollments",
    title: "Enrollments",
    desc: "Manage course enrollments",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.teachers.tsx",
    path: "/_authenticated/institution/courses/$courseId/teachers",
    title: "Course Teachers",
    desc: "Manage teachers assigned to this course",
  },
  {
    file: "src/routes/_authenticated/institution.courses.$courseId.settings.tsx",
    path: "/_authenticated/institution/courses/$courseId/settings",
    title: "Course Settings",
    desc: "Course configuration and settings",
  },
];

for (const r of institutionCourseRoutes) {
  route(
    r.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <RouteStubPage
      title="${r.title}"
      description="${r.desc}"
      role="Institution Admin"
      items={[]}
    />
  ),
});
`,
  );
}

// ─── Institution Lesson Generation ────────────────────────────────

const institutionGenRoutes = [
  {
    file: "src/routes/_authenticated/institution.lesson-generation.tsx",
    path: "/_authenticated/institution/lesson-generation",
    title: "Lesson Generation",
    desc: "View all lesson generation jobs",
  },
  {
    file: "src/routes/_authenticated/institution.lesson-generation.$jobId.tsx",
    path: "/_authenticated/institution/lesson-generation/$jobId",
    title: "Generation Job",
    desc: "View and review generated lessons",
  },
];

for (const r of institutionGenRoutes) {
  route(
    r.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <RouteStubPage
      title="${r.title}"
      description="${r.desc}"
      role="Institution Admin"
      items={[]}
    />
  ),
});
`,
  );
}

// ─── Teacher Course Material & Lesson Routes ──────────────────────

const teacherNewRoutes = [
  {
    file: "src/routes/_authenticated/teacher.courses.$courseId.materials.tsx",
    path: "/_authenticated/teacher/courses/$courseId/materials",
    title: "Course Materials",
    desc: "Manage materials for assigned course",
  },
  {
    file: "src/routes/_authenticated/teacher.courses.$courseId.materials.upload.tsx",
    path: "/_authenticated/teacher/courses/$courseId/materials/upload",
    title: "Upload Material",
    desc: "Upload new course material",
  },
  {
    file: "src/routes/_authenticated/teacher.courses.$courseId.lessons.tsx",
    path: "/_authenticated/teacher/courses/$courseId/lessons",
    title: "Course Lessons",
    desc: "View and manage lessons",
  },
  {
    file: "src/routes/_authenticated/teacher.courses.$courseId.generate-lessons.tsx",
    path: "/_authenticated/teacher/courses/$courseId/generate-lessons",
    title: "Generate Lessons",
    desc: "AI lesson generation for this course",
  },
  {
    file: "src/routes/_authenticated/teacher.lessons.new.tsx",
    path: "/_authenticated/teacher/lessons/new",
    title: "Create Lesson",
    desc: "Create a new lesson manually",
  },
  {
    file: "src/routes/_authenticated/teacher.lessons.$lessonId.tsx",
    path: "/_authenticated/teacher/lessons/$lessonId",
    title: "Lesson Detail",
    desc: "View lesson details",
  },
  {
    file: "src/routes/_authenticated/teacher.lessons.$lessonId.preview.tsx",
    path: "/_authenticated/teacher/lessons/$lessonId/preview",
    title: "Preview Lesson",
    desc: "Preview lesson as learners see it",
  },
  {
    file: "src/routes/_authenticated/teacher.sessions.new.tsx",
    path: "/_authenticated/teacher/sessions/new",
    title: "Start Session",
    desc: "Start a new classroom session",
  },
  {
    file: "src/routes/_authenticated/teacher.sessions.$sessionId.tsx",
    path: "/_authenticated/teacher/sessions/$sessionId",
    title: "Session Detail",
    desc: "View session details",
  },
  {
    file: "src/routes/_authenticated/teacher.sessions.$sessionId.activity.tsx",
    path: "/_authenticated/teacher/sessions/$sessionId/activity",
    title: "Session Activity",
    desc: "View session activity log",
  },
];

for (const r of teacherNewRoutes) {
  route(
    r.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <RouteStubPage
      title="${r.title}"
      description="${r.desc}"
      role="Teacher"
      items={[]}
    />
  ),
});
`,
  );
}

// ─── Missing Learner Routes ───────────────────────────────────────

const learnerNewRoutes = [
  {
    file: "src/routes/_authenticated/student.transcripts.tsx",
    path: "/_authenticated/student/transcripts",
    title: "Transcripts",
    desc: "View your classroom transcripts",
  },
  {
    file: "src/routes/_authenticated/student.courses.$courseId.progress.tsx",
    path: "/_authenticated/student/courses/$courseId/progress",
    title: "Course Progress",
    desc: "Track your progress in this course",
  },
  {
    file: "src/routes/_authenticated/student.lessons.$lessonId.start.tsx",
    path: "/_authenticated/student/lessons/$lessonId/start",
    title: "Start Lesson",
    desc: "Begin a lesson",
  },
];

for (const r of learnerNewRoutes) {
  route(
    r.file,
    `
import { createFileRoute } from "@tanstack/react-router";
import { RouteStubPage } from "@/components/route/RouteStubPage";

export const Route = createFileRoute("${r.path}")({
  component: () => (
    <RouteStubPage
      title="${r.title}"
      description="${r.desc}"
      role="Learner"
      items={[]}
    />
  ),
});
`,
  );
}

console.log("\n✅ All route files generated successfully!");
