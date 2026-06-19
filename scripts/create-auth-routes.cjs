const fs = require("fs");
const path = require("path");

const authPages = [
  "signup",
  "forgot-password",
  "reset-password",
  "verify-email",
  "complete-profile",
  "select-role",
];
for (const p of authPages) {
  const title = p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const content = `import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/${p}")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--gray-50)]">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-[var(--gray-200)] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">${title}</h1>
        <p className="text-sm text-[var(--gray-600)]">This page is coming soon.</p>
        <div className="rounded-lg border border-dashed border-[var(--gray-300)] p-6 text-center">
          <p className="text-sm text-[var(--gray-400)]">Coming soon</p>
        </div>
        <div className="text-center text-sm text-[var(--gray-500)]">
          <Link to="/auth" className="text-[var(--primary)] hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  ),
});
`;
  const filePath = path.join(__dirname, "..", "src", "routes", `auth.${p}.tsx`);
  fs.writeFileSync(filePath, content);
  console.log("Created:", `auth.${p}.tsx`);
}

const demoPages = [
  { name: "whiteboard", title: "Whiteboard Demo", path: "/demo/whiteboard" },
  { name: "accessibility-demo", title: "Accessibility Demo", path: "/demo/accessibility-demo" },
];
for (const d of demoPages) {
  const content = `import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("${d.path}")({
  component: () => (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="border-b border-[var(--gray-200)] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-lg font-bold text-[var(--gray-900)]">\u2190 Klassruum</Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--gray-900)]">${d.title}</h1>
        <div className="mt-8 rounded-lg border border-dashed border-[var(--gray-300)] bg-white p-8 text-center">
          <p className="text-sm text-[var(--gray-400)]">This demo is under construction.</p>
        </div>
      </main>
    </div>
  ),
});
`;
  const filePath = path.join(__dirname, "..", "src", "routes", `demo.${d.name}.tsx`);
  fs.writeFileSync(filePath, content);
  console.log("Created:", `demo.${d.name}.tsx`);
}

console.log("Done!");
