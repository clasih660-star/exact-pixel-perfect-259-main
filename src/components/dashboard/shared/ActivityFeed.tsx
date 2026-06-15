import type { LucideIcon } from "lucide-react";

type ActivityItem = {
  id: string;
  icon?: LucideIcon;
  action: string;
  description?: string;
  timestamp: string;
  variant?: "default" | "success" | "warning" | "error";
};

type Props = {
  title?: string;
  items: ActivityItem[];
  maxItems?: number;
};

export function ActivityFeed({ title, items, maxItems = 8 }: Props) {
  const displayItems = items.slice(0, maxItems);

  const getVariantConfig = (variant: ActivityItem["variant"] = "default") => {
    const config = {
      default: { dot: "bg-[#94A3B8]", icon: "text-[#64748B]" },
      success: { dot: "bg-green-500", icon: "text-green-600" },
      warning: { dot: "bg-amber-500", icon: "text-amber-600" },
      error: { dot: "bg-red-500", icon: "text-red-600" },
    };
    return config[variant];
  };

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
      {title && <h3 className="mb-4 text-lg font-bold text-[#0F172A]">{title}</h3>}

      <div className="space-y-0">
        {displayItems.map((item, index) => {
          const Icon = item.icon;
          const cfg = getVariantConfig(item.variant);
          const isLast = index === displayItems.length - 1;

          return (
            <div key={item.id} className="relative">
              {/* Vertical line */}
              {!isLast && <div className="absolute bottom-0 left-1.5 top-10 w-px bg-[#E2E8F0]" />}

              {/* Item */}
              <div className="relative pb-6">
                {/* Dot */}
                <div
                  className={`absolute left-0 top-1 flex h-3 w-3 items-center justify-center rounded-full ${cfg.dot}`}
                >
                  {Icon && <Icon className={`h-2 w-2 text-white`} />}
                </div>

                {/* Content */}
                <div className="ml-8">
                  <p className="font-semibold text-[#0F172A]">{item.action}</p>
                  {item.description && <p className="text-sm text-[#64748B]">{item.description}</p>}
                  <p className="mt-1 text-xs text-[#94A3B8]">{item.timestamp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
