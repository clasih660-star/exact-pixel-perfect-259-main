type Props = {
  children: string;
  variant?: "default" | "success" | "warning" | "error" | "neutral" | "info";
};

const variantStyles: Record<string, string> = {
  default: "bg-[var(--primary-light)] text-[var(--primary)]",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  neutral: "bg-[var(--gray-100)] text-[var(--gray-600)]",
  info: "bg-teal-50 text-teal-700",
};

export function StatusBadge({ children, variant = "default" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
