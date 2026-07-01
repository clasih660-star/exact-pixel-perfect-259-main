/**
 * useClassroomRealtime.ts
 *
 * Supabase Realtime hook that syncs live classroom events across all connected
 * participants: chat messages, participant join/leave, hand raises, and
 * shared board state. Works for both teacher-led and AI-led group sessions.
 *
 * Falls back to polling (query refetch) when Supabase is not configured
 * so the demo mode keeps working.
 */

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClassroomRealtimeEvent =
  | "chat_message"
  | "participant_joined"
  | "participant_left"
  | "hand_raised"
  | "board_update"
  | "session_status_changed";

export interface RealtimeCallbacks {
  /** Fires when a new chat message arrives. */
  onChatMessage?: (msg: {
    id: string;
    session_id: string;
    user_id: string | null;
    sender: string;
    message: string;
    message_type: string;
    created_at: string;
  }) => void;
  /** Fires when a participant joins or leaves. */
  onParticipantChange?: (p: {
    id: string;
    session_id: string;
    user_id: string;
    role: string;
    status: string;
  }) => void;
  /** Fires when shared board state updates. */
  onBoardUpdate?: (board: {
    id: string;
    session_id: string;
    board_items: any[];
    current_index: number;
    section_key?: string | null;
    teacher_note?: string | null;
    updated_by: string;
    updated_at: string;
  }) => void;
  /** Fires when session status changes (e.g. scheduled → live → completed). */
  onSessionStatusChange?: (session: {
    id: string;
    status: string;
  }) => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Subscribe to Realtime changes for a classroom session.
 *
 * Usage:
 * ```tsx
 * useClassroomRealtime(sessionId, {
 *   onChatMessage: (msg) => setMessages(prev => [...prev, msg]),
 *   onParticipantChange: () => queryClient.invalidateQueries(["participants", sessionId]),
 *   onBoardUpdate: (board) => setBoardState(board),
 *   onSessionStatusChange: (s) => { if (s.status === "completed") navigateAway(); },
 * });
 * ```
 */
export function useClassroomRealtime(
  sessionId: string | undefined,
  callbacks: RealtimeCallbacks = {},
) {
  const queryClient = useQueryClient();
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  // Track active channel so we can clean up
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!sessionId || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`classroom:${sessionId}`)
      // ---- chat_messages INSERT ----
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: { new: Record<string, any> }) => {
          const msg = payload.new as any;
          callbacksRef.current.onChatMessage?.(msg);
          queryClient.invalidateQueries({ queryKey: ["classroom-context", sessionId] });
        },
      )
      // ---- session_participants INSERT / UPDATE ----
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_participants",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: { new: Record<string, any> }) => {
          const row = payload.new as any;
          callbacksRef.current.onParticipantChange?.(row);
          queryClient.invalidateQueries({ queryKey: ["classroom-context", sessionId] });
        },
      )
      // ---- session_board_state UPSERT (shared whiteboard) ----
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_board_state",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: { new: Record<string, any> }) => {
          const row = payload.new as any;
          if (row) callbacksRef.current.onBoardUpdate?.(row);
        },
      )
      // ---- classroom_sessions UPDATE (status changes) ----
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "classroom_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload: { new: Record<string, any> }) => {
          const row = payload.new as any;
          callbacksRef.current.onSessionStatusChange?.({
            id: row.id,
            status: row.status,
          });
          queryClient.invalidateQueries({ queryKey: ["classroom-context", sessionId] });
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [sessionId, queryClient]);

  // Broadcast cursor/highlight via Presence (non-critical, best-effort)
  const broadcastPresence = useCallback(
    (data: { userId: string; role: string; boardIndex?: number }) => {
      if (!sessionId || !isSupabaseConfigured() || !channelRef.current) return;
      channelRef.current.send({
        type: "broadcast",
        event: "cursor",
        payload: data,
      });
    },
    [sessionId],
  );

  return { broadcastPresence };
}

// ---------------------------------------------------------------------------
// Polling fallback for demo mode
// ---------------------------------------------------------------------------

/**
 * When Supabase is not configured, poll the query cache to simulate updates.
 * Call this at the top of any classroom page that uses useClassroomRealtime.
 */
export function useClassroomPolling(
  sessionId: string | undefined,
  intervalMs = 8000,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionId || isSupabaseConfigured()) return;

    const timer = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["classroom-context", sessionId] });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [sessionId, intervalMs, queryClient]);
}
