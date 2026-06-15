import { FolderOpen, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: "folder" | "users" | "calendar" | "book" | "default";
}

export function DashboardEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = "default",
}: DashboardEmptyStateProps) {
  const icons = {
    folder: <FolderOpen className="h-12 w-12 text-[var(--gray-400)]" />,
    users: <FolderOpen className="h-12 w-12 text-[var(--gray-400)]" />,
    calendar: <FolderOpen className="h-12 w-12 text-[var(--gray-400)]" />,
    book: <FolderOpen className="h-12 w-12 text-[var(--gray-400)]" />,
    default: <FolderOpen className="h-12 w-12 text-[var(--gray-400)]" />,
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-[var(--gray-200)] bg-white p-12 text-center">
      <div className="mb-4">{icons[icon]}</div>
      <h3 className="text-lg font-semibold text-[var(--gray-900)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--gray-500)] max-w-md">{description}</p>

      {actionLabel && actionHref && (
        <Link
          to={actionHref}
          className="mt-6 btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
