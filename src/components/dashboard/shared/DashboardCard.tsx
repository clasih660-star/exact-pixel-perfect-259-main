import type { ReactNode } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  large?: boolean;
}

export function DashboardCard({ children, className = "", large = false }: DashboardCardProps) {
  return (
    <div className={`dashboard-card rounded-2xl border border-[var(--gray-200)] bg-white p-6 shadow-sm ${large ? 'lg:row-span-2' : ''} ${className}`}>
      {children}
    </div>
  );
}