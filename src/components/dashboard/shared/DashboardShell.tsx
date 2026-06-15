import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { type ReactNode, useState, useRef, useEffect, useCallback } from "react";
import {
  Accessibility,
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogoMark } from "@/components/brand/Logo";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { useAuthContext } from "@/hooks/useUserRole";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

type Props = {
  /** Optional override — if omitted, the config is derived from the user's role. */
  config?: import("@/lib/dashboard-config").DashboardConfig;
  /** Optional — if omitted, active path is derived from current location. */
  activePath?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

/**
 * Shared dashboard layout for all roles.
 */
export function DashboardShell({
  config: configProp,
  activePath: activePathProp,
  title,
  subtitle,
  children,
}: Props) {
  const config = configProp ?? useDashboardConfig();
  const { user } = useAuthContext();
  const location = useLocation();
  const activePath = activePathProp ?? location.pathname;
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  /** Derive initials from the user's email. */
  const getInitials = useCallback((): string => {
    if (!user?.email) return "U";
    return user.email
      .split("@")[0]
      .split(/[._-]/)
      .map((s) => s[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.email]);

  /** Derive display name from the user's email. */
  const displayName = user?.email?.split("@")[0] ?? "User";

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!isProfileDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <div className="helios-theme helios-dashboard relative isolate min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* Dynamic ambient nebula light */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-primary-light),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(31,124,128,0.03),transparent_40%)] opacity-70"
        aria-hidden
      />
      
      {/* Optimized background stars (only active in dark mode) */}
      <DashboardStarField />

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 dark:bg-black/80 lg:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-border bg-card/80 dark:bg-[#050505]/80 shadow-[18px_0_60px_rgba(0,0,0,0.03)] dark:shadow-[18px_0_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <span className="text-base font-bold tracking-tight text-foreground">Klassruum</span>
          </Link>
          <button className="rounded-xl p-1 transition hover:bg-accent lg:hidden" onClick={toggleMobileMenu} aria-label="Close menu">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="border-b border-border px-6 py-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground font-mono">
            {config.title}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label={`${config.title} navigation`}>
          <div className="space-y-1.5">
            {config.sidebar.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-item group flex items-center gap-3 rounded-[18px] px-3.5 py-3 text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(31,124,128,0.06)]"
                      : "text-muted-foreground hover:translate-x-0.5 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {!isActive && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border px-4 py-4">
          {config.role === "learner" && (
            <Link
              to="/student/access"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mb-3 block rounded-[22px] border border-border bg-card/50 p-3.5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card"
            >
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">Learning Access</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                Manage captions, focus mode, and more
              </p>
            </Link>
          )}

          <div className="rounded-[20px] border border-border bg-card/50 p-2 shadow-sm">
            <div className="flex items-center gap-3 rounded-[16px] px-2 py-2 transition-colors hover:bg-accent">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                {getInitials()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-[11px] text-muted-foreground">{config.roleLabel}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-10 w-full justify-start rounded-[14px] text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 lg:ml-[268px]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-border bg-background/60 px-4 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.02)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button className="rounded-xl p-1 transition hover:bg-accent lg:hidden" onClick={toggleMobileMenu} aria-label="Open menu">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>

            {title ? (
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 truncate text-lg font-bold tracking-tight text-foreground lg:text-xl font-mono uppercase">
                  {title}
                </h1>
                {subtitle && (
                  <p className="truncate text-xs text-muted-foreground lg:text-sm">{subtitle}</p>
                )}
              </div>
            ) : (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}
                  className="w-full rounded-[18px] border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Realtime status */}
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 shadow-sm backdrop-blur sm:flex">
              <div className="relative flex h-1.5 w-1.5">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <div className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-[#00FF88] font-mono">Live updates on</span>
            </div>

            {title && (
              <div className="relative hidden w-56 md:block lg:w-64 xl:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}
                  className="w-full rounded-[18px] border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}
            
            <ThemeToggle />

            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-[18px] border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <button
              className="hidden h-11 w-11 items-center justify-center rounded-[18px] border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-foreground lg:flex"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-110"
                aria-label="User profile"
              >
                {getInitials()}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl text-popover-foreground">
                  <div className="border-b border-border p-4">
                    <p className="text-sm font-semibold text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email ?? config.roleLabel}</p>
                  </div>
                  <div className="p-2">
                    {config.role === "learner" && (
                      <Link
                        to="/student/access"
                        onClick={toggleProfileDropdown}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Accessibility className="h-4 w-4" />
                        <span>Learning Access</span>
                      </Link>
                    )}
                    <Link
                      to={config.settingsHref}
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to={config.settingsHref}
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-border p-2">
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 lg:p-8 xl:p-8">{children}</main>
      </div>
    </div>
  );
}

function DashboardStarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.2 + 0.4,
      opacity: Math.random(),
      speed: Math.random() * 0.01 + 0.003,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";
      
      stars.forEach((star) => {
        star.opacity += star.speed;
        if (star.opacity > 1 || star.opacity < 0) {
          star.speed = -star.speed;
        }
        ctx.globalAlpha = Math.max(0.1, Math.min(0.7, star.opacity));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-0 dark:opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
