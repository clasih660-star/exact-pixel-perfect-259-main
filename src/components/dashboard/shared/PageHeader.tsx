import type { ReactNode } from "react";

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function PageHeader({ label, title, subtitle, action }: Props) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        {label && (
          <p className="text-xs font-bold uppercase tracking-widest text-[#1F7C80]">{label}</p>
        )}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0F172A] lg:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-[#475569]">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
