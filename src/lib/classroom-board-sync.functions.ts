/**
 * classroom-board-sync.functions.ts
 *
 * Server functions for the shared whiteboard state in group sessions.
 * When a teacher (or AI) advances the board, every connected learner
 * sees the update in real-time via Supabase Realtime.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertActorCanAccessSession } from "@/lib/server-authorization";

// ---------------------------------------------------------------------------
// Upsert shared board state (called by teacher or AI broadcast)
// ---------------------------------------------------------------------------

export const upsertBoardState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) =>
    z
      .object({
        session_id: z.string().min(1),
        board_items: z.array(z.any()),
        current_index: z.number().int().min(0),
        section_key: z.string().optional(),
        teacher_note: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }: any) => {
    const { supabase, userId } = context;

    // Demo mode
    if (!supabase) {
      return {
        ok: true,
        board: {
          session_id: data.session_id,
          board_items: data.board_items,
          current_index: data.current_index,
          section_key: data.section_key ?? null,
          teacher_note: data.teacher_note ?? null,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
      };
    }

    // Upsert so there is always exactly one board state per session
    const { data: row, error } = await (supabase as any)
      .from("session_board_state")
      .upsert(
        {
          session_id: data.session_id,
          board_items: data.board_items,
          current_index: data.current_index,
          section_key: data.section_key ?? null,
          teacher_note: data.teacher_note ?? null,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" },
      )
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return { ok: true, board: row };
  });

// ---------------------------------------------------------------------------
// Read current board state (used by learners joining late)
// ---------------------------------------------------------------------------

export const getBoardState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((data: { session_id: string }) => data)
  .handler(async ({ data, context }: any) => {
    const { supabase } = context;

    if (!supabase) {
      return {
        board: {
          session_id: data.session_id,
          board_items: [],
          current_index: 0,
          section_key: null,
          teacher_note: null,
          updated_by: null,
          updated_at: null,
        },
      };
    }

    const { data: row, error } = await (supabase as any)
      .from("session_board_state")
      .select("*")
      .eq("session_id", data.session_id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return { board: row ?? null };
  });
