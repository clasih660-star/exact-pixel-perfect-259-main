/**
 * useDashboard.ts
 *
 * Hook that fetches real dashboard data from the backend,
 * falling back to demo data when no real data exists.
 */

import { useState, useEffect, useCallback } from "react";
import { getStudentDashboard } from "@/lib/classroom.engine";
import { DEMO_DASHBOARD_DATA } from "@/lib/demo-data";

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

      // Check if we got meaningful real data
      const hasCourses = (result.courses?.length ?? 0) > 0;
      const hasSessions = (result.recentSessions?.length ?? 0) > 0;
      const hasProgress = result.continueLearning !== null;
      const hasStats = result.stats.activeCourses > 0 || result.stats.completedLessons > 0;

      if (hasCourses || hasSessions || hasProgress || hasStats) {
        setData(result as DashboardData);
        setIsUsingDemoData(false);
      } else {
        // Fall back to demo data
        setData(transformDemoData());
        setIsUsingDemoData(true);
      }
    } catch (err: any) {
      console.warn("Dashboard data fetch failed, using demo data:", err.message);
      setData(transformDemoData());
      setIsUsingDemoData(true);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh, isUsingDemoData };
}

/** Transform demo data to match the production dashboard schema */
function transformDemoData(): DashboardData {
  const demo = DEMO_DASHBOARD_DATA;
  return {
    continueLearning: null,
    stats: {
      activeCourses: demo.stats.classrooms,
      completedLessons: demo.stats.completedLessons,
      totalTimeMinutes: parseStudyTime(demo.stats.studyTime),
      avgQuizScore: demo.stats.quizAverage,
      recentSessionsCount: demo.recentSessions.length,
    },
    courses: (demo.courses as any[]).map((c: any) => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      level: c.level,
      institutionName: c.institution ?? c.institutionId ?? "",
      progressPercentage: c.progress ?? c.progressPercentage ?? 0,
      description: c.description,
      coverImageUrl: c.thumbnail ?? c.coverImageUrl,
    })),
    recentSessions: demo.recentSessions.map((s) => ({
      id: s.id,
      lessonTitle: s.title,
      courseTitle: s.courseTitle,
      status: s.status,
      startedAt: s.timestamp ?? null,
      endedAt: null,
      durationMinutes: parseDuration(s.duration),
    })),
    accessProfile: {
      captionsEnabled: true,
      audioEnabled: true,
      keyboardShortcutsEnabled: true,
      focusModeEnabled: false,
      speechRate: 1,
      currentMode: "Standard",
    },
    recommendations: [],
  };
}

function parseStudyTime(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+)h?\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const mins = parseInt(match[2] ?? "0", 10);
  return hours * 60 + mins;
}

function parseDuration(durStr: string): number {
  if (!durStr) return 0;
  const match = durStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}