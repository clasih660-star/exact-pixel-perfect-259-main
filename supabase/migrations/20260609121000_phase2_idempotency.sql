-- Phase 2: idempotency support for event logging and quiz submissions

ALTER TABLE public.session_events
  ADD COLUMN IF NOT EXISTS request_key text;

ALTER TABLE public.quiz_results
  ADD COLUMN IF NOT EXISTS request_key text;

ALTER TABLE public.session_notes
  ADD COLUMN IF NOT EXISTS request_key text;

ALTER TABLE public.board_snapshots
  ADD COLUMN IF NOT EXISTS request_key text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_session_events_request_key
  ON public.session_events (session_id, request_key)
  WHERE request_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_results_request_key
  ON public.quiz_results (student_id, quiz_id, request_key)
  WHERE request_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_results_session_quiz_student
  ON public.quiz_results (student_id, quiz_id, session_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_session_notes_request_key
  ON public.session_notes (session_id, request_key)
  WHERE request_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_board_snapshots_request_key
  ON public.board_snapshots (session_id, request_key)
  WHERE request_key IS NOT NULL;
