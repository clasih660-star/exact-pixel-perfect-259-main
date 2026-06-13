/**
 * Returns the DashboardConfig matching the current user's role.
 * The role is read from the authenticated route context.
 */
import { useMemo } from "react";
import { dashboardConfigs, type DashboardConfig, type DashboardRole } from "@/lib/dashboard-config";
import { useUserRole } from "./useUserRole";
import type { UserRole } from "@/lib/types";

/** Maps a UserRole to the corresponding DashboardRole key in dashboardConfigs. */
function userRoleToDashboardRole(role: UserRole): DashboardRole {
  switch (role) {
    case "platform_admin":
      return "platform_admin";
    case "institution_admin":
      return "institution";
    case "teacher":
      return "teacher";
    case "student":
      return "learner";
    case "parent":
      return "parent";
    default:
      return "learner";
  }
}

/**
 * Hook that returns the full DashboardConfig for the current user's role.
 * Includes sidebar items, title, role label, settings href, etc.
 */
export function useDashboardConfig(): DashboardConfig {
  const role = useUserRole();
  const dashboardRole = userRoleToDashboardRole(role);
  return useMemo(() => dashboardConfigs[dashboardRole], [dashboardRole]);
}

/**
 * Hook that returns just the sidebar items for the current user's role.
 */
export function useSidebarItems() {
  const config = useDashboardConfig();
  return config.sidebar;
}