import { Loader2, AlertCircle } from "lucide-react";

interface DashboardLoadingStateProps {
  type?: "skeleton" | "spinner" | "error";
  message?: string;
}

export function DashboardLoadingState({ type = "skeleton", message }: DashboardLoadingStateProps) {
  if (type === "spinner") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <p className="text-sm text-[var(--gray-500)]">{message || "Loading dashboard..."}</p>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm text-[var(--gray-500)]">{message || "Error loading dashboard"}</p>
      </div>
    );
  }

  // Skeleton loading
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-8 w-64 rounded bg-[var(--gray-200)]" />
      <div className="mb-4 h-4 w-full rounded bg-[var(--gray-200)]" />
      <div className="mb-4 h-4 w-3/4 rounded bg-[var(--gray-200)]" />
      
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-[var(--gray-200)]" />
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-[var(--gray-200)]" />
        ))}
      </div>
    </div>
  );
}