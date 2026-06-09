import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Clock,
  Target,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";
import { LogoMark } from "@/components/brand/Logo";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
};

// Determine nav items based on role from path, default to student
function getNavItems(): NavItem[] {
  if (typeof window === "undefined") {
    return [
      { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/student/courses", label: "My Courses", icon: BookOpen },
      { to: "/student/progress", label: "Progress", icon: TrendingUp },
      { to: "/student/schedule", label: "Schedule", icon: Calendar },
      { to: "/student/messages", label: "Messages", icon: MessageSquare },
    ];
  }
  const path = window.location.pathname;
  const parts = path.split("/");
  const role = parts[1];
  const base = role === "teacher" || role === "institution" ? `/${role}` : "/student";
  return [
    { to: `${base}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { to: `${base}/courses`, label: "My Courses", icon: BookOpen },
    { to: `${base}/progress`, label: "Progress", icon: TrendingUp },
    { to: `${base}/schedule`, label: "Schedule", icon: Calendar },
    { to: `${base}/messages`, label: "Messages", icon: MessageSquare },
  ];
}

export function Sidebar() {
  const navItems = getNavItems();
  return (
    <aside
      className="sidebar"
      aria-hidden="false"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 260,
        overflowY: "auto",
        zIndex: 50,
      }}
    >
      <Link to="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
        <LogoMark size={34} />
        <div className="logo-text">Klassruum</div>
      </Link>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to as any}
              className="nav-item"
              activeProps={{ className: "nav-item active" }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="learning-access-card">
          <div className="title">Learning Access</div>
          <div className="sub">Accessibility tools enabled</div>
          <div className="plan">
            <Sparkles size={12} />
            <span>Pro Plan Active</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Clock size={12} />
            <span>Study streak: 7 days</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Target size={12} />
            <span>Daily goal: 75%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Zap size={12} />
            <span>XP: 2,450</span>
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar text-xs">AJ</div>
          <div className="user-info">
            <div className="user-name">Alex Johnson</div>
            <div className="user-role">Student</div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>

        <Link to={"/settings" as any} className="nav-item mt-4" activeProps={{ className: "nav-item active" }}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        <button className="nav-item w-full text-left hover:text-red-600 hover:bg-red-50">
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}