/**
 * useDashboard.ts
 *
 * Hook that fetches real dashboard data from the backend.
 * Returns empty data when no real data exists — the DashboardPage
 * handles empty states with onboarding UI instead of demo data.
 */

import { useState, useEffect, useCallback } from "react";
import { getStudentDashboard } from "@/lib/classroom.engine";

export type DashboardStats = {
  activeCourses: number;
  completedLessons: number;
  totalTimeMinutes: number;
  avgQuizScore: number;
  recentSessionsCount: number;
};

export type DashboardCourse = {
  id: string | null;
  title: string | null;
  subject: string | null;
  level: string | null;
  institutionName?: string | null;
  progressPercentage: number;
  description?: string | null;
  coverImageUrl?: string | null;
};

export type DashboardSession = {
  id: string;
  lessonTitle: string;
  courseTitle: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
};

export type DashboardContinueLearning = {
  courseId: string;
  lessonId: string;
  currentStep: string;
  progressPercentage: number;
  courseTitle: string;
  lessonTitle: string;
} | null;

export type DashboardRecommendation = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  targetUrl: string | null;
};

export type DashboardAccess = {
  captionsEnabled: boolean;
  audioEnabled: boolean;
  keyboardShortcutsEnabled: boolean;
  focusModeEnabled: boolean;
  speechRate: number;
  currentMode: string;
};

export type DashboardData = {
  continueLearning: DashboardContinueLearning;
  stats: DashboardStats;
  courses: DashboardCourse[];
  recentSessions: DashboardSession[];
  accessProfile: DashboardAccess;
  recommendations: DashboardRecommendation[];
};

export type UseDashboardResult = {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isUsingDemoData: boolean;
};

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getStudentDashboard();

      // Map the engine result to our DashboardData shape
      const hasData =
        (result.courses?.length ?? 0) > 0 ||
        (result.recentSessions?.length ?? 0) > 0 ||
        result.continueLearning !== null ||
        result.stats.activeCourses > 0;

      setData({
        continueLearning: result.continueLearning ?? null,
        stats: result.stats,
        courses: result.courses ?? [],
        recentSessions: result.recentSessions ?? [],
        accessProfile: result.accessProfile,
        recommendations: result.recommendations ?? [],
      });
      setIsUsingDemoData(!hasData);
    } catch (err: any) {
      console.error("Dashboard data fetch failed:", err.message);
      setError(err.message);
      // Set empty data on error — DashboardPage shows error UI
      setData({
        continueLearning: null,
        stats: {
          activeCourses: 0,
          completedLessons: 0,
          totalTimeMinutes: 0,
          avgQuizScore: 0,
          recentSessionsCount: 0,
        },
        courses: [],
        recentSessions: [],
        accessProfile: {
          captionsEnabled: true,
          audioEnabled: true,
          keyboardShortcutsEnabled: true,
          focusModeEnabled: false,
          speechRate: 1,
          currentMode: "Standard",
        },
        recommendations: [],
      });
      setIsUsingDemoData(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh, isUsingDemoData };
}
