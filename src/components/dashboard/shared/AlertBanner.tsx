import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

type Variant = "info" | "success" | "warning" | "error";

type Props = {
  variant?: Variant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  closeable?: boolean;
};

export function AlertBanner({
  variant = "info",
  title,
  description,
  action,
  closeable = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const config = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: Info,
      iconColor: "text-blue-600",
      title: "text-blue-900",
      description: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      title: "text-green-900",
      description: "text-green-800",
      button: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      title: "text-amber-900",
      description: "text-amber-800",
      button: "bg-amber-600 hover:bg-amber-700",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-600",
      title: "text-red-900",
      description: "text-red-800",
      button: "bg-red-600 hover:bg-red-700",
    },
  };

  const cfg = config[variant];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-2xl border ${cfg.bg} ${cfg.border} p-4`}>
      <div className="flex items-start gap-4">
        <Icon className={`h-5 w-5 flex-shrink-0 ${cfg.iconColor}`} />
        <div className="flex-1">
          <h3 className={`font-bold ${cfg.title}`}>{title}</h3>
          {description && (
            <p className={`mt-1 text-sm ${cfg.description}`}>{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 inline-flex text-sm font-bold text-white px-3 py-1.5 rounded-lg transition-colors ${cfg.button}`}
            >
              {action.label}
            </button>
          )}
        </div>
        {closeable && (
          <button
            onClick={() => setIsOpen(false)}
            className="flex-shrink-0 text-[#64748B] hover:text-[#0F172A]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
