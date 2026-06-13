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
 *
 * When `config` is not provided, it is automatically resolved from the
 * authenticated user's role via `useDashboardConfig()`. This means every
 * dashboard page just needs:
 *
 *   <DashboardShell title="My Courses">
 *     <MyCoursesContent />
 *   </DashboardShell>
 *
 * and the correct sidebar + topbar + role label are rendered automatically.
 */
export function DashboardShell({ config: configProp, activePath: activePathProp, title, subtitle, children }: Props) {
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
    <div className="min-h-screen bg-[#f8fafb]">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-[#d1eceb] bg-white transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F8] px-6 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size={32} />
            <span className="text-base font-bold tracking-tight text-[#0F172A]">
              Klassruum
            </span>
          </Link>
          <button
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-[#64748B]" />
          </button>
        </div>

        <div className="border-b border-[#EEF2F8] px-6 py-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#94A3B8]">
            {config.title}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label={`${config.title} navigation`}>
          <div className="space-y-1">
            {config.sidebar.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[#e8f5f5] text-[#1A5256] shadow-sm"
                      : "text-[#1A3233] hover:bg-[#f0fafa] hover:text-[#1A5256]"
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

        <div className="border-t border-[#E2E8F0] px-4 py-4">
          {config.role === "learner" && (
            <Link
              to="/student/access"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mb-3 block rounded-xl border border-[#d1eceb] bg-[#e8f5f5] p-3 transition-all duration-150 hover:border-[#1F7C80] hover:bg-[#d1eceb]"
            >
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-[#1F7C80]" />
                <span className="text-xs font-semibold text-[#1F7C80]">Learning Access</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#64748B]">
                Manage captions, focus mode, and more
              </p>
            </Link>
          )}

          <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#F8FAFC]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1F7C80] to-[#1A5256] text-xs font-bold text-white">
              {getInitials()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0F172A]">{displayName}</p>
              <p className="text-[11px] text-[#94A3B8]">{config.roleLabel}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[268px]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-[#EEF2F8] bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-[#64748B]" />
            </button>

            {title ? (
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 truncate text-lg font-bold tracking-tight text-[#0F172A] lg:text-xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="truncate text-xs text-[#64748B] lg:text-sm">{subtitle}</p>
                )}
              </div>
            ) : (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}

                className="w-full rounded-2xl border border-[#d1eceb] bg-white py-3 pl-10 pr-4 text-sm text-[#1A3233] placeholder:text-[#A3ADAD] shadow-sm focus:border-[#1F7C80] focus:outline-none focus:ring-2 focus:ring-[#1F7C80]/10"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Realtime status */}
            <div className="hidden items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 sm:flex">
              <div className="relative flex h-1.5 w-1.5">
                <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <div className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-semibold text-[#16A34A]">Live updates on</span>
            </div>

            {title && (
              <div className="relative hidden w-56 md:block lg:w-64 xl:w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}

                  className="w-full rounded-2xl border border-[#d1eceb] bg-white py-3 pl-10 pr-4 text-sm text-[#1A3233] placeholder:text-[#A3ADAD] shadow-sm focus:border-[#1F7C80] focus:outline-none focus:ring-2 focus:ring-[#1F7C80]/10"
                />
              </div>
            )}
            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d1eceb] bg-white text-[#1A3233] shadow-sm transition-all hover:bg-[#e8f5f5] hover:text-[#1A5256]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <button
              className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#D5E0F0] bg-white text-[#1E335B] shadow-sm transition-all hover:bg-[#F3F7FF] hover:text-[#1A5256] lg:flex"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Profile dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1F7C80] to-[#1A5256] text-xs font-bold text-white shadow-sm transition-all hover:from-[#1A5256] hover:to-[#1A3233]"
                aria-label="User profile"
              >
                {getInitials()}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
                  <div className="border-b border-[#E2E8F0] p-4">
                    <p className="text-sm font-semibold text-[#0F172A]">{displayName}</p>
                    <p className="text-xs text-[#64748B]">{user?.email ?? config.roleLabel}</p>
                  </div>
                  <div className="p-2">
                    {config.role === "learner" && (
                      <Link
                        to="/student/access"
                        onClick={toggleProfileDropdown}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      >
                        <Accessibility className="h-4 w-4" />
                        <span>Learning Access</span>
                      </Link>
                    )}
                    <Link
                      to={config.settingsHref}
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to={config.settingsHref}
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-[#E2E8F0] p-2">
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#DC2626] transition-colors hover:bg-red-50"
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

        <main className="p-4 lg:p-8 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
