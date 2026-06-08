/**
 * useSessionReview.ts
 *
 * Hooks for fetching session summaries, replays, notes, and quiz reviews.
 */

import { useState, useEffect, useCallback } from "react";
import { getSessionSummary, getSessionReplay, listRecommendations } from "@/lib/classroom.engine";
import type { SessionSummaryResponse, SessionReplayResponse, ReplayTimelineItem } from "@/lib/classroom.payloads";

// ─────────────────────────────────────────────────────────────────────────────
// Session Summary Hook
// ─────────────────────────────────────────────────────────────────────────────

export type UseSessionSummaryResult = {
  summary: SessionSummaryResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useSessionSummary(sessionId: string | null): UseSessionSummaryResult {
  const [summary, setSummary] = useState<SessionSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSessionSummary({ data: { session_id: sessionId } });
      setSummary(result as SessionSummaryResponse);
    } catch (err: any) {
      setError(err.message ?? "Failed to load session summary");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, isLoading, error, refresh };
}

// ─────────────────────────────────────────────────────────────────────────────
// Session Replay Hook
// ─────────────────────────────────────────────────────────────────────────────

export type UseSessionReplayResult = {
  replay: SessionReplayResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useSessionReplay(sessionId: string | null): UseSessionReplayResult {
  const [replay, setReplay] = useState<SessionReplayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSessionReplay({ data: { session_id: sessionId } });
      setReplay(result as SessionReplayResponse);
    } catch (err: any) {
      setError(err.message ?? "Failed to load session replay");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { replay, isLoading, error, refresh };
}

// ─────────────────────────────────────────────────────────────────────────────
// Recommendations Hook
// ─────────────────────────────────────────────────────────────────────────────

export type UseRecommendationsResult = {
  recommendations: Array<Record<string, unknown>>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useRecommendations(): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<Array<Record<string, unknown>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await listRecommendations();
      setRecommendations(result.recommendations ?? []);
    } catch (err: any) {
      setError(err.message ?? "Failed to load recommendations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { recommendations, isLoading, error, refresh };
}