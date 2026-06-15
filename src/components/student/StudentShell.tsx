import { type ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Link, useRouter } from "@tanstack/react-router";
import {
  Accessibility,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Clipboard,
  FileText,
  Folder,
  Circle as HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Monitor,
  Notebook,
  Search,
  Settings,
  TrendingUp,
  Star,
  ChevronRight,
} from "lucide-react";
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
  // Reuse the global AppShell which already includes the Sidebar.
  return (
    <AppShell>
      {/* Top Navbar is already part of AppShell via TopBar component */}
      {/* Page Header */}
      <header className="topnav sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[var(--gray-200)] bg-white/95 px-6 backdrop-blur">
        <div className="min-w-0 flex-1">
          <h1 className="page-title text-xl font-bold tracking-tight text-[var(--gray-900)]">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </header>
      <main className="dashboard-content p-6">{children}</main>
    </AppShell>
  );
}
