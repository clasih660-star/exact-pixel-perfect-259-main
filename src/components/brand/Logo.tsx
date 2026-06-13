import { cn } from "@/lib/utils";

/**
 * Klassruum logo mark — a bold "K" in a blue gradient wearing a navy-blue
 * graduation cap, with a navy tassel and a blue bead.
 */
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
        <linearGradient id="klass-k" x1="10" y1="20" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3fa8ab" />
          <stop offset="55%" stopColor="#1F7C80" />
          <stop offset="100%" stopColor="#1A5256" />
        </linearGradient>
        <linearGradient id="klass-cap" x1="6" y1="9" x2="42" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A5256" />
          <stop offset="100%" stopColor="#1A3233" />
        </linearGradient>
      </defs>

      {/* K letter (blue) */}
      <path
        d="M14 19 V42 H19.4 V33.2 L21.1 31.3 L29.4 42 H36 L24.6 27.2 L35 19 H27.6 L19.4 25.8 V19 Z"
        fill="url(#klass-k)"
      />

      {/* Graduation cap — navy blue mortarboard */}
      <path d="M4.5 16 L24 8.2 L43.5 16 L24 23.8 Z" fill="url(#klass-cap)" />
      {/* Cap band under the board */}
      <path
        d="M15 19.6 V25.4 C15 27.9 19 29.4 24 29.4 C29 29.4 33 27.9 33 25.4 V19.6 L24 23.2 Z"
        fill="#1A5256"
        opacity="0.92"
      />
      {/* Subtle top highlight on the board */}
      <path d="M24 8.2 L43.5 16 L24 18.1 L4.5 16 Z" fill="#FFFFFF" opacity="0.12" />

      {/* Navy tassel + blue bead */}
      <path d="M42.4 16.2 V22.2" stroke="#1A5256" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="42.4" cy="23.8" r="1.8" fill="#3fa8ab" />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  size = 36,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-foreground">
          Klass<span className="text-[var(--primary,#1F7C80)]">ruum</span>
        </span>
      )}
    </div>
  );
}
