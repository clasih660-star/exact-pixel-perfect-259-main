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

export const Route = createFileRoute("/demo/")({
  component: () => (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="border-b border-[var(--gray-200)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[var(--gray-900)]">← Klassruum</Link>
          <span className="text-sm text-[var(--gray-500)]">Demos</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--gray-900)]">Demo Hub</h1>
        <p className="mt-4 text-lg text-[var(--gray-600)]">Explore Klassruum demos</p>
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
