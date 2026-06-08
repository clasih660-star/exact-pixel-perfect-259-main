import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  Accessibility,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Clipboard,
  FileText,
  Folder,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Monitor,
  Notebook,
  Search,
  Settings,
  TrendingUp,
} from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card/40 p-4 md:flex md:flex-col">
        <Link to="/" className="mb-8 px-2">
          <Logo />
        </Link>
        <nav className="flex-1 space-y-1">
          {items.map((i) => (
            <Link
              key={i.to}
              to={i.to}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
              activeProps={{
                className:
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-accent text-foreground",
              }}
            >
              <i.icon className="h-4 w-4" /> {i.label}
            </Link>
          ))}
        </nav>
        <div className="mb-3 rounded-xl border border-border bg-card/70 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              DS
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Demo Student</p>
              <p className="text-xs text-muted-foreground">Standard access</p>
            </div>
          </div>
          <Link
            to="/student/access"
            className="mt-3 flex items-center gap-2 text-sm font-medium text-primary"
          >
            <Accessibility className="h-4 w-4" /> Manage learning access
          </Link>
        </div>
        <Button variant="ghost" size="sm" className="justify-start" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
