import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="klass-grad"
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* K letter */}
      <path
        d="M14 18 V42 H19 V32 L21 30 L29 42 H35 L24 26 L34 18 H27 L19 25 V18 Z"
        fill="url(#klass-grad)"
      />
      {/* Graduation cap */}
      <path d="M5 16 L24 9 L43 16 L24 23 Z" fill="#1D4ED8" />
      <path
        d="M14 19.5 V25 C14 27.5 18.5 29 24 29 C29.5 29 34 27.5 34 25 V19.5 L24 23 Z"
        fill="#1D4ED8"
        opacity="0.85"
      />
      {/* Tassel */}
      <path d="M41 16 V22" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="41" cy="23.5" r="1.5" fill="#3B82F6" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={36} />
      {showWordmark && (
        <span className="text-xl font-bold tracking-tight text-foreground">Klassruum</span>
      )}
    </div>
  );
}
