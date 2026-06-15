/**
 * Role-aware sidebar navigation.
 *
 * Reads the user's role from the authenticated route context and renders
 * the correct navigation items from `dashboard-config.ts`. No more
 * URL-parsing to guess the role.
 *
 * @deprecated This sidebar is part of the legacy AppShell layout system.
 * New dashboards should use `DashboardShell` which includes its own sidebar.
 * This component remains for student sub-pages (StudentShell) that still
 * use AppShell. Migrate those routes to DashboardShell to consolidate.
 */
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, ChevronRight, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { useAuthContext } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

export function Sidebar() {
  const config = useDashboardConfig();
  const { user } = useAuthContext();
  const location = useLocation();

  /** Extract initials from the user's email for the avatar. */
  function getInitials(): string {
    if (!user?.email) return "U";
    return user.email
      .split("@")[0]
      .split(/[._-]/)
      .map((s) => s[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      window.location.href = "/auth";
    }
  };

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
      {/* ── Brand ─────────────────────────────────────────────── */}
      <Link to="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
        <LogoMark size={34} />
        <div className="logo-text">Klassruum</div>
      </Link>

      {/* ── Role label ────────────────────────────────────────── */}
      <div className="px-4 pt-2 pb-1">
        <span className="inline-block rounded-md bg-[var(--primary)]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--primary)]">
          {config.roleLabel}
        </span>
      </div>

      {/* ── Navigation ────────────────────────────────────────── */}
      <nav className="sidebar-nav">
        {config.sidebar.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href || location.pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`nav-item${isActive ? " active" : ""}`}
              activeProps={{ className: "nav-item active" }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* ── Pro plan badge (visible for students/learners) ── */}
        {config.role === "learner" && (
          <div className="learning-access-card">
            <div className="title">Learning Access</div>
            <div className="sub">Accessibility tools enabled</div>
            <div className="plan">
              <Sparkles size={12} />
              <span>Pro Plan Active</span>
            </div>
          </div>
        )}
      </nav>

      {/* ── Footer: user card + sign out ──────────────────────── */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar text-xs">{getInitials()}</div>
          <div className="user-info">
            <div className="user-name">{user?.email?.split("@")[0] ?? "User"}</div>
            <div className="user-role">{config.roleLabel}</div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>

        <Link
          to={config.settingsHref}
          className="nav-item mt-4"
          activeProps={{ className: "nav-item active" }}
        >
          <span className="inline-block w-[18px] text-center">⚙</span>
          <span>Settings</span>
        </Link>

        <button
          className="nav-item w-full text-left hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
