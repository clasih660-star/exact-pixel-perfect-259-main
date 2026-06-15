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
      className="group block min-h-[112px] rounded-[18px] border border-[#d1eceb] bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#a3d9d8] hover:shadow-[0_16px_34px_rgba(37,99,235,0.12)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f5f5] text-[#1F7C80] ring-1 ring-[#d1eceb] transition-all group-hover:bg-[#d1eceb]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#334155]">{title}</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#0F172A]">{value}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xs text-[#64748B]">{subtitle}</p>
            {trend && (
              <span className={`text-xs font-bold ${trendUp ? "text-green-600" : "text-red-500"}`}>
                {trendUp ? "↑" : "↓"} {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
