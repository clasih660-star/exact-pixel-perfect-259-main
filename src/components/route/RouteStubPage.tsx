import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RouteItem = {
  label: string;
  to: string;
  description: string;
};

type RouteStubPageProps = {
  title: string;
  description: string;
  role: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  items: RouteItem[];
};

export function RouteStubPage({
  title,
  description,
  role,
  primary,
  secondary,
  items,
}: RouteStubPageProps) {
  return (
    <div className="min-h-screen bg-[var(--gray-50)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[var(--gray-200)] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[var(--gray-200)] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_60%,#f8fafc_100%)] px-6 py-6">
          <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-500)] shadow-sm">
            {role}
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--gray-900)]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--gray-600)]">{description}</p>

          {(primary || secondary) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {primary && (
                <Link to={primary.to}>
                  <Button>
                    {primary.label}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {secondary && (
                <Link to={secondary.to}>
                  <Button variant="outline">{secondary.label}</Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className="group block">
              <Card className="h-full border-[var(--gray-200)] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
                <CardContent className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                    Route
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-[var(--gray-900)]">
                    {item.label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--gray-600)]">
                    {item.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)]">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
