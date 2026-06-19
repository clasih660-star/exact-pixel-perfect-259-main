/**
 * Returns the DashboardConfig matching the current user's role.
 * The role is read from the authenticated route context.
 */
import { useMemo } from "react";
import {
  dashboardConfigs,
  resolveDashboardRole,
  type DashboardConfig,
} from "@/lib/dashboard-config";
import { useAuthContext } from "./useUserRole";

/**
 * Hook that returns the full DashboardConfig for the current user's role.
 * Includes sidebar items, title, role label, settings href, etc.
 */
export function useDashboardConfig(): DashboardConfig {
  const { role, persona, teacherType, learnerType } = useAuthContext();
  const dashboardRole = resolveDashboardRole({
    role: role ?? "student",
    persona,
    teacherType,
    learnerType,
  });

  return useMemo(() => dashboardConfigs[dashboardRole], [dashboardRole]);
}

/**
 * Hook that returns just the sidebar items for the current user's role.
 */
export function useSidebarItems() {
  const config = useDashboardConfig();
  return config.sidebar;
}
