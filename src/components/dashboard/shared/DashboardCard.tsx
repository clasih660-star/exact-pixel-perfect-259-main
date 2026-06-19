import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  large?: boolean;
}

export function DashboardCard({ children, className = "", large = false }: DashboardCardProps) {
  return (
    <div
      className={`dashboard-card p-6 ${large ? "lg:row-span-2" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
