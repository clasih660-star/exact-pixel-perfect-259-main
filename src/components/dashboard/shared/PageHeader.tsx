import type { ReactNode } from "react";

type Props = {
  label?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function PageHeader({ label, title, subtitle, action }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        {label && (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-academic-blue">
            {label}
          </p>
        )}
        <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-heading lg:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 max-w-3xl text-sm leading-6 text-body">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
