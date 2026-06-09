import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  Accessibility,
  Bell,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  Star,
  User,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardConfig } from "@/lib/dashboard-config";

type Props = {
  config: DashboardConfig;
  activePath: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function DashboardShell({ config, activePath, title, subtitle, children }: Props) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[var(--gray-200)] bg-white transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[var(--gray-100)] px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
              <Star className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[var(--gray-900)]">
              Klassruum
            </span>
          </Link>
          <button
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-[var(--gray-600)]" />
          </button>
        </div>

        <div className="px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--gray-400)]">
            {config.title}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3" aria-label={`${config.title} navigation`}>
          <div className="space-y-0.5">
            {config.sidebar.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-sm"
                      : "text-[var(--gray-600)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
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

        <div className="border-t border-[var(--gray-100)] px-4 py-4">
          {config.role === "learner" && (
            <Link
              to="/student/access"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mb-3 block rounded-lg border border-transparent bg-[var(--primary-light)] p-3 transition-all duration-150 hover:border-[var(--primary)]"
            >
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--primary)]">Learning Access</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--gray-500)]">
                Manage captions, focus mode, and more
              </p>
            </Link>
          )}

          <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--gray-50)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
              DS
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--gray-800)]">Demo User</p>
              <p className="text-[11px] text-[var(--gray-400)]">{config.roleLabel}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-700)]"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-[var(--gray-200)] bg-white/95 px-4 py-3 lg:px-6 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="lg:hidden"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-[var(--gray-600)]" />
            </button>

            {title ? (
              <div className="min-w-0">
                <h1 className="flex items-center gap-2 truncate text-xl font-extrabold tracking-tight text-[var(--gray-900)] lg:text-2xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="truncate text-sm text-[var(--gray-500)]">{subtitle}</p>
                )}
              </div>
            ) : (
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] py-2.5 pl-10 pr-4 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {title && (
              <div className="relative hidden w-64 md:block xl:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] py-2.5 pl-10 pr-4 text-sm text-[var(--gray-900)] placeholder:text-[var(--gray-400)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
            )}
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gray-200)] bg-white text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-700)]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--red)] px-1 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--gray-200)] bg-white text-[var(--gray-500)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-700)] sm:flex"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white hover:bg-[var(--primary-dark)]"
                aria-label="User profile"
              >
                DS
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--gray-200)] bg-white shadow-lg">
                  <div className="border-b border-[var(--gray-100)] p-4">
                    <p className="text-sm font-semibold text-[var(--gray-800)]">Demo User</p>
                    <p className="text-xs text-[var(--gray-500)]">{config.roleLabel}</p>
                  </div>
                  <div className="p-2">
                    {config.role === "learner" && (
                      <Link
                        to="/student/access"
                        onClick={toggleProfileDropdown}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                      >
                        <Accessibility className="h-4 w-4" />
                        <span>Learning Access</span>
                      </Link>
                    )}
                    <Link
                      to={config.settingsHref}
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to={config.settingsHref}
                      onClick={toggleProfileDropdown}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--gray-700)] hover:bg-[var(--gray-50)]"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="border-t border-[var(--gray-100)] p-2">
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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

        <main className="p-4 lg:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
