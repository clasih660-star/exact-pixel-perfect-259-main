import { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

type LogoVariant = "default" | "light" | "dark";

export function LogoMark({
  className,
  size = 36,
  id,
  variant = "default",
}: {
  className?: string;
  size?: number;
  id?: string;
  variant?: LogoVariant;
}) {
  const reactId = useId();
  const uid = useMemo(() => id || `kl-${reactId.replace(/:/g, "")}`, [id, reactId]);
  const isLight = variant === "light";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("select-none", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${uid}-k`}
          x1="10"
          y1="20"
          x2="38"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={isLight ? "#93c5fd" : "#1a3352"} />
          <stop offset="50%" stopColor={isLight ? "#38bdf8" : "#1c4fa3"} />
          <stop offset="100%" stopColor={isLight ? "#ffffff" : "#2563eb"} />
        </linearGradient>
        <linearGradient
          id={`${uid}-cap`}
          x1="6"
          y1="9"
          x2="42"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={isLight ? "#ffffff" : "#0a1a2e"} />
          <stop offset="100%" stopColor={isLight ? "#bae6fd" : "#10233f"} />
        </linearGradient>
        {!isLight && (
          <linearGradient
            id={`${uid}-shine`}
            x1="10"
            y1="18"
            x2="40"
            y2="43"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        )}
      </defs>

      <path
        d="M14 19 V42 H19.4 V33.2 L21.1 31.3 L29.4 42 H36 L24.6 27.2 L35 19 H27.6 L19.4 25.8 V19 Z"
        fill={`url(#${uid}-k)`}
      />
      <path d="M4.5 16 L24 8.2 L43.5 16 L24 23.8 Z" fill={`url(#${uid}-cap)`} />
      <path
        d="M15 19.6 V25.4 C15 27.9 19 29.4 24 29.4 C29 29.4 33 27.9 33 25.4 V19.6 L24 23.2 Z"
        fill={isLight ? "#e0f2fe" : "#0a1a2e"}
        opacity="0.92"
      />
      <path
        d="M24 8.2 L43.5 16 L24 18.1 L4.5 16 Z"
        fill="#ffffff"
        opacity={isLight ? 0.28 : 0.08}
      />
      <path
        d="M42.4 16.2 V22.2"
        stroke={isLight ? "#e0f2fe" : "#10233f"}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="42.4" cy="23.8" r="1.8" fill={isLight ? "#38bdf8" : "#2563eb"} />
      {!isLight && (
        <path
          d="M15.3 20.2 V40.8 H18.2 V32.7 L20.9 29.6 L29.8 40.8 H32.7 L22.6 27.3 L31 20.2 H28 L18.2 28.4 V20.2 Z"
          fill={`url(#${uid}-shine)`}
        />
      )}
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  size = 36,
  variant = "default",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  variant?: LogoVariant;
}) {
  const textColors = {
    default: "text-heading",
    light: "text-white",
    dark: "text-[#0f172a]",
  };

  const reactId = useId();
  const uid = useMemo(() => `logotext-${reactId.replace(/:/g, "")}`, [reactId]);
  const fontSize = Math.round(size * 0.58);

  return (
    <div
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      aria-label="Klassruum"
    >
      <LogoMark size={size} id={uid} variant={variant} />
      {showWordmark && (
        <span
          className={cn("font-extrabold font-headings leading-none", textColors[variant])}
          style={{
            fontSize: `${fontSize}px`,
            letterSpacing: "0",
            transform: "translateY(3%)",
          }}
          aria-hidden="true"
        >
          Klassruum
        </span>
      )}
    </div>
  );
}
