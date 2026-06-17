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

export function KpiCard({
  title,
  value,
  subtitle,
  href,
  icon: Icon,
  trend,
  trendUp = true,
}: Props) {
  return (
    <Link
      to={href}
      className="kr-kpi-card group block min-h-[108px] p-4 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-soft-blue text-academic-blue transition-all group-hover:bg-academic-blue group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted">{title}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-heading">{value}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs text-muted">{subtitle}</p>
            {trend && (
              <span
                className={`text-xs font-bold ${trendUp ? "text-education-green" : "text-red-500"}`}
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
