import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Accessibility, Award, Bell, BookOpen, Calendar, Clipboard, FileText, Folder, Circle as HelpCircle, LayoutDashboard, LogOut, MessageSquare, Monitor, Notebook, Search, Settings, TrendingUp, Star, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/classrooms", label: "My Classrooms", icon: Monitor },
  { to: "/student/courses", label: "My Courses", icon: BookOpen },
  { to: "/student/lessons", label: "Lessons", icon: FileText },
  { to: "/student/calendar", label: "Calendar", icon: Calendar },
  { to: "/student/resources", label: "Resources", icon: Folder },
  { to: "/student/assignments", label: "Assignments", icon: Clipboard },
  { to: "/student/quizzes", label: "Quizzes", icon: HelpCircle },
  { to: "/student/progress", label: "Progress", icon: TrendingUp },
  { to: "/student/messages", label: "Messages", icon: MessageSquare },
  { to: "/student/notes", label: "Notes", icon: Notebook },
  { to: "/student/achievements", label: "Achievements", icon: Award },
  { to: "/student/access", label: "Learning Access", icon: Accessibility },
  { to: "/student/search", label: "Search", icon: Search },
  { to: "/student/notifications", label: "Notifications", icon: Bell },
  { to: "/student/settings", label: "Settings", icon: Settings },
] as const;

export function StudentShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const signOut = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  };
  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Sidebar */}
      <aside className="sidebar fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[var(--gray-200)] bg-white">
        {/* Logo */}
        <div className="sidebar-logo flex items-center gap-3 border-b border-[var(--gray-100)] px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20">
              <Star className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight text-[var(--gray-900)]">
              Klassruum
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="space-y-0.5">
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="nav-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--gray-600)]transition-all duration-150 hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
                activeProps={{
                  className:
                    "nav-item active flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium bg-[var(--primary)] text-white shadow-sm",
                }}
              >
                <i.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{i.label}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer border-t border-[var(--gray-100)] px-4 py-4">
          {/* Learning Access Card */}
          <Link
            to="/student/access"
            className="learning-access-card mb-3 block rounded-lg border border-transparent bg-[var(--primary-light)] p-3 transition-all duration-150 hover:border-[var(--primary)]"
          >
            <div className="flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--primary)]">Learning Access</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--gray-500)]">
              Manage captions, focus mode, and more
            </p>
          </Link>

          {/* User Card */}
          <div className="user-card flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--gray-50)]">
            <div className="avatar flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
              DS
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--gray-800)]">Demo Student</p>
              <p className="text-[11px] text-[var(--gray-400)]">Standard access</p>
            </div>
          </div>

          {/* Sign Out */}
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

      {/* Main Content Area */}
      <div className="ml-[220px]">
        {/* Top Navbar */}
        <header className="topnav sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--gray-200)] bg-white/95 px-6 backdrop-blur">
          <div className="min-w-0 flex-1">
            <h1 className="page-title text-xl font-bold tracking-tight text-[var(--gray-900)]">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content p-6">{children}</main>
      </div>
    </div>
  );
}
