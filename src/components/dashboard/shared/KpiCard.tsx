import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
};

export function KpiCard({ title, value, subtitle, href, icon: Icon, trend, trendUp = true }: Props) {
  return (
    <Link
      to={href}
      className="group block rounded-2xl border border-[var(--gray-200)] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[var(--primary)]/30 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--gray-500)]">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--gray-900)]">{value}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs text-[var(--gray-400)]">{subtitle}</p>
            {trend && (
              <span
                className={`text-xs font-bold ${
                  trendUp ? "text-green-600" : "text-red-500"
                }`}
              >
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
