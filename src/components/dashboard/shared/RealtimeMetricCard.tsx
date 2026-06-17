import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  status?: "up" | "down" | "neutral" | "live";
  change?: string;
  isLive?: boolean;
};

export function RealtimeMetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  status = "neutral",
  change,
  isLive,
}: Props) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-muted">{title}</h3>
          {isLive && (
            <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5">
              <div className="relative flex h-1.5 w-1.5">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <div className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-bold text-green-700">Live</span>
            </div>
          )}
        </div>
        {Icon && <Icon className="h-4 w-4 text-muted" />}
      </div>

      <div className="flex items-baseline gap-1">
        <p className="text-2xl font-bold text-heading">{value}</p>
        {unit && <p className="text-xs font-semibold text-muted">{unit}</p>}
      </div>

      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}

      {change && (
        <div className="mt-3 flex items-center gap-1">
          {status === "up" && (
            <>
              <TrendingUp className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-600">{change}</span>
            </>
          )}
          {status === "down" && (
            <>
              <TrendingDown className="h-3.5 w-3.5 text-red-600" />
              <span className="text-xs font-semibold text-red-600">{change}</span>
            </>
          )}
          {status === "neutral" && (
            <span className="text-xs font-semibold text-muted">{change}</span>
          )}
        </div>
      )}
    </div>
  );
}
