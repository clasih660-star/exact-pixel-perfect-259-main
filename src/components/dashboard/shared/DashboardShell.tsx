import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
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
  User,
  X,
  Radio
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogoMark } from "@/components/brand/Logo";
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-[#E2E8F0] bg-white transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-5">
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

        <div className="border-b border-[#E2E8F0] px-5 py-4">
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
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
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
              className="mb-3 block rounded-xl border border-[#E2E8F0] bg-[#EFF6FF] p-3 transition-all duration-150 hover:border-[#2563EB] hover:bg-[#DBEAFE]"
            >
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-[#2563EB]" />
                <span className="text-xs font-semibold text-[#2563EB]">Learning Access</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#64748B]">
                Manage captions, focus mode, and more
              </p>
            </Link>
          )}

          <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#F8FAFC]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-xs font-bold text-white">
              DS
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#0F172A]">Demo User</p>
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
      <div className="lg:ml-[264px]">
        {/* Header */}
        <header className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white/95 px-4 py-3 lg:px-8 backdrop-blur">
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
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
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
              <div className="relative hidden w-56 md:block lg:w-64 xl:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder={config.searchPlaceholder}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2 pl-10 pr-4 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/10"
                />
              </div>
            )}
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DC2626] px-1 text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A] lg:flex"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-xs font-bold text-white transition-all hover:from-[#1D4ED8] hover:to-[#1E40AF]"
                aria-label="User profile"
              >
                DS
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E2E8F0] bg-white shadow-lg">
                  <div className="border-b border-[#E2E8F0] p-4">
                    <p className="text-sm font-semibold text-[#0F172A]">Demo User</p>
                    <p className="text-xs text-[#64748B]">{config.roleLabel}</p>
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
