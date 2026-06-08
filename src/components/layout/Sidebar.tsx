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

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "My Courses", icon: BookOpen },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/schedule", label: "Schedule", icon: Calendar },
  { to: "/messages", label: "Messages", icon: MessageSquare },
] as const;

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">K</div>
        <div className="logo-text">Klassruum</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="nav-item"
            activeProps={{ className: "nav-item active" }}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}

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

        <Link
          to="/settings"
          className="nav-item mt-4"
          activeProps={{ className: "nav-item active" }}
        >
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
