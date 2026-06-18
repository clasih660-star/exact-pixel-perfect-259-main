import { Link, useRouter } from "@tanstack/react-router";
import { type ReactNode } from "react";
import {
  LayoutDashboard,
  School,
  FolderUp,
  Settings,
  LogOut,
  BookOpen,
  Users,
  GraduationCap,
  UserCheck,
  ChartBar as BarChart3,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/institution/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/institution/courses", label: "Courses", icon: BookOpen },
  { to: "/institution/classrooms", label: "Classrooms", icon: School },
  { to: "/institution/sessions", label: "Sessions", icon: Calendar },
  { to: "/institution/resources", label: "Resources", icon: FolderUp },
  { to: "/institution/students", label: "Students", icon: Users },
  { to: "/institution/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/institution/enrollments", label: "Enrollments", icon: UserCheck },
  { to: "/institution/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/institution/billing", label: "Billing", icon: CreditCard },
  { to: "/institution/settings", label: "Settings", icon: Settings },
] as const;

export function InstitutionShell({
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
