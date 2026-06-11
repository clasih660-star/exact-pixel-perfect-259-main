/**
 * AIVideoClassroom.tsx
 *
 * Klassruum's main product asset: a serious AI video classroom where the learner
 * feels like a real teacher is present, writing, explaining, checking understanding,
 * and saving the lesson for review.
 *
 * Layout: 26% Teacher Panel | 74% Whiteboard
 * Three primary assets: AI Teacher Video Panel, Learning Whiteboard, Lesson Intelligence Layer
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { LogoMark } from "@/components/brand/Logo";
import "../../styles/video-classroom.css";
import "../../styles/classroom-premium.css";
import type { MathTeachingItem } from "@/lib/lesson-models";
import type { LearningMode, TeacherVideoState, TranscriptEntry } from "@/lib/types";
import type {
  ClassroomLessonContent,
  ClassroomConfidenceOption,
} from "@/lib/classroom-content";
import { buildDemoLessonContent } from "@/lib/classroom-content.demo";
import { speak, startListening, stopListening, setNarrationMuted, setGlobalRate } from "@/lib/speech";
import { answerLearnerQuestion } from "@/lib/classroom-ai.functions";
import { recordSessionEvent } from "@/lib/events.functions";
import { loadAccessibility, prefsForMode, saveAccessibility } from "@/lib/accessibility";
import type { AccessibilityPrefs, TextScale } from "@/lib/accessibility";
import { InlineEngagementArea } from "./InlineEngagementArea";
import type { EngagementPrompt } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TeachingPhase =
  | "idle"
  | "writing"
  | "reading"
  | "explaining"
  | "warning"
  | "pausing"
  | "asking"
  | "practice"
  | "exit_ticket"
  | "complete";

type PracticeMode = "guided" | "independent";

interface PracticeProblem {
  equation: string;
  question: string;
  correctAnswer: string;
  hint: string;
  /** Progressive hints, revealed one level at a time (Hint 1 → Hint 2 → Hint 3). */
  hints: string[];
  /** Misconception watch: a wrong-but-common answer and the targeted correction. */
  misconception: { answer: string; note: string };
}

/** A teaching interjection that pauses the lesson flow at a section boundary. */
type Interjection = "recap" | "thinking_pause" | "middle_question" | "confidence";

/** Learning evidence recorded across the session (no exams, just activity). */
interface LearningResults {
  questionsAsked: number;
  raisedHands: number;
  practiceAttempts: number;
  practiceCorrect: number;
  hintsUsed: number;
  confidenceChecks: { section: string; level: string }[];
  middleQuestionCorrect: boolean | null;
  misconceptionsDetected: number;
  events: string[];
  score?: number; // out of 100
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = "klassruum_progress_";

/**
 * Course type drives how a classroom is presented. The system decides this
 * automatically from the course/subject — no manual switch:
 *   mathematics → calculations + graphs (a live graph panel beside the board)
 *   science     → labelled illustrations / diagrams
 *   technical   → images + step illustrations
 *   social      → theory only (wider reading column, no visual panel)
 */
type CourseType = "mathematics" | "science" | "technical" | "social";

/** Auto-detect the course type from the subject/course text. */
function detectCourseType(subject: string, course: string): CourseType {
  const t = `${subject} ${course}`.toLowerCase();
  if (/math|algebra|calculus|geometry|trigonometry|statistics|quadratic|equation|graph/.test(t)) return "mathematics";
  if (/physics|chemistry|biology|science|anatomy|geology|astronomy/.test(t)) return "science";
  if (/comput|program|coding|engineering|technical|electr|mechanic|design|robotics|it\b|software/.test(t)) return "technical";
  if (/history|geography|civic|social|economics|literature|language|english|philosophy|law|business/.test(t)) return "social";
  return "mathematics";
}

const COURSE_TYPE_META: Record<CourseType, { label: string; icon: string; hasVisual: boolean; visualTitle: string }> = {
  mathematics: { label: "Mathematics", icon: "📐", hasVisual: true, visualTitle: "Graph & Strategy" },
  science: { label: "Science", icon: "🔬", hasVisual: true, visualTitle: "Illustration" },
  technical: { label: "Technical", icon: "🛠️", hasVisual: true, visualTitle: "Illustration" },
  social: { label: "Social Science", icon: "📖", hasVisual: false, visualTitle: "" },
};

const LESSON_PLAN_SECTIONS = [
  { key: "welcome", label: "Welcome", icon: "👋" },
  { key: "concept", label: "Concept", icon: "💡" },
  { key: "worked_example", label: "Worked Example", icon: "📝" },
  { key: "guided_practice", label: "Guided Practice", icon: "🤝" },
  { key: "independent_practice", label: "Independent", icon: "✍️" },
  { key: "summary", label: "Summary", icon: "📋" },
  { key: "exit_ticket", label: "Exit Ticket", icon: "🎫" },
  { key: "complete", label: "Complete", icon: "✅" },
] as const;

type LessonSectionKey = (typeof LESSON_PLAN_SECTIONS)[number]["key"];

const SPEED_MAP: Record<string, number> = {
  slow: 40,
  normal: 25,
  fast: 15,
};

const QUICK_ACTIONS = [
  "I don't understand",
  "Repeat",
  "Give example",
  "Explain simpler",
  "Slow down",
  "Continue",
];

const LEARNING_MODES: { value: LearningMode; label: string; icon: string }[] = [
  { value: "standard", label: "Standard", icon: "📖" },
  { value: "deaf", label: "Deaf Mode", icon: "🤟" },
  { value: "blind", label: "Blind Mode", icon: "🎧" },
  { value: "adhd_focus", label: "ADHD Focus", icon: "🎯" },
  { value: "dyslexia", label: "Dyslexia Friendly", icon: "🔤" },
  { value: "speech_difficulty", label: "Speech Difficulty", icon: "✍️" },
  { value: "extra_support", label: "Extra Support", icon: "💪" },
  { value: "challenge", label: "Challenge", icon: "🏆" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  autoPlay?: boolean;
  /**
   * The lesson the classroom teaches. Defaults to the quadratic-equations demo so
   * existing demo/marketing routes keep working unchanged. Real classroom routes
   * pass a lesson loaded from the database (see `loadClassroomLesson`).
   */
  content?: ClassroomLessonContent;
  /**
   * Real classroom_sessions id backing this lesson. When present, key learning
   * events (started, questions, completion) are persisted to the database so
   * institutions get real learning evidence. Omitted for the demo.
   */
  sessionId?: string;
  /** Called when the learner ends the lesson (e.g. to navigate away). */
  onExit?: () => void;
}

export function AIVideoClassroom({ autoPlay = false, content, sessionId, onExit }: Props) {
  // The lesson content this classroom teaches. Memoised so the demo bundle is
  // built once and the teaching sequence reference stays stable across renders.
  const lesson = useMemo(() => content ?? buildDemoLessonContent(), [content]);
  const sequence = lesson.sequence;
  const practiceProblems = lesson.practiceProblems;

  // Per-lesson identity (replaces the old module-level demo constants).
  const TEACHER_NAME = lesson.teacher.name;
  // Gender-matched portrait: a man for a male voice, a woman for a female voice.
  // Uses the lesson's own image when provided, else the matching default.
  const TEACHER_VOICE = lesson.teacher.voice;
  const TEACHER_IMAGE =
    lesson.teacher.image ||
    (TEACHER_VOICE === "female" ? "/images/teachers/woman.png" : "/images/teachers/man.png");
  // Optional real-teacher video feed (shown instead of the portrait when present).
  const TEACHER_VIDEO = (lesson.teacher as { videoUrl?: string }).videoUrl;
  const INSTITUTION = lesson.institution;
  const COURSE = lesson.course;
  const LESSON_SUBJECT = lesson.subject;
  const LESSON_TITLE = lesson.title;
  const LESSON_EQUATION = lesson.equation ?? "";
  const LESSON_OPENING_NARRATIVE = lesson.openingNarrative;
  const FULL_LEARNER_NOTES = lesson.learnerNotes;
  const ACADEMIC_LEVEL = lesson.academicLevel;
  const LESSON_COURSE_TYPE = useMemo(
    () => detectCourseType(lesson.subject, lesson.course),
    [lesson.subject, lesson.course],
  );
  // Per-lesson localStorage key so different lessons don't clobber each other.
  const STORAGE_KEY = STORAGE_KEY_PREFIX + lesson.lessonId;
  // Board-index → section key map for the lesson-plan jump navigation.
  const SECTION_START_INDEX = useMemo(() => {
    const map: Partial<Record<LessonSectionKey, number>> = {};
    for (const stop of lesson.sectionStops) {
      if (map[stop.key as LessonSectionKey] === undefined) {
        map[stop.key as LessonSectionKey] = stop.startIndex;
      }
    }
    return map;
  }, [lesson.sectionStops]);

  // Teaching-moment content aliases (was module-level demo constants). Some are
  // optional for real generated lessons — the flow guards on them being present.
  const SECTION_GOALS = lesson.sectionGoals;
  const SECTION_RECAPS = lesson.sectionRecaps;
  const THINKING_PAUSES = lesson.thinkingPauses;
  const MIDDLE_QUESTION = lesson.middleQuestion;
  const EXIT_REFLECTION = lesson.exitReflection;
  const CONFIDENCE_OPTIONS = lesson.confidenceOptions;
  const EXIT_TICKET_QUESTION = lesson.exitTicket;

  // Where the timed teaching-moment interjections fire. Derived from the lesson
  // so real lessons (with arbitrary section boundaries) behave sensibly; for the
  // demo these resolve to the original hardwired indices (3 and 6).
  const RECAP_AT_INDEX = useMemo(() => {
    const we = lesson.sectionStops.find((s) => s.key === "worked_example");
    return we && we.startIndex > 0 ? we.startIndex : -1;
  }, [lesson.sectionStops]);
  const MIDDLE_QUESTION_AT_INDEX = useMemo(
    () => (lesson.sequence.length >= 4 ? Math.floor(lesson.sequence.length / 2) : -1),
    [lesson.sequence.length],
  );
  // Rough lesson-length estimate for the start screen (teach + practice).
  const estimatedMinutes = useMemo(
    () => Math.max(5, Math.round((lesson.sequence.length * 1.2 + lesson.practiceProblems.length * 2 + 3))),
    [lesson.sequence.length, lesson.practiceProblems.length],
  );

  // ── Core State ────────────────────────────────────────
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<TeachingPhase>("idle");
  const [teacherState, setTeacherState] = useState<TeacherVideoState>("paused");
  const [learningMode, setLearningMode] = useState<LearningMode>("standard");
  const [isPaused, setIsPaused] = useState(false);

  // When an accessibility-oriented mode is chosen, fold its sensible display
  // defaults (text scale / contrast / motion) into the live settings.
  useEffect(() => {
    const extra = prefsForMode(learningMode);
    if (Object.keys(extra).length > 0) {
      setA11y((prev) => ({ ...prev, ...extra }));
    }
  }, [learningMode]);

  // ── Board State ───────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [writtenLines, setWrittenLines] = useState<MathTeachingItem[]>([]);
  const [currentWritingText, setCurrentWritingText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Live "key points" for the right rail — the summary-worthy lines written so
  // far (headings, concepts, instructions, answers). Most-recent first, capped.
  // Declared here (before any early return) so hook order stays stable.
  const boardKeyPoints = useMemo(() => {
    return writtenLines
      .filter((l) => ["concept", "instruction", "answer", "question", "equation"].includes(l.type))
      .map((l) => l.boardText)
      .filter(Boolean)
      .slice(-6);
  }, [writtenLines]);

  // ── Explanation State ─────────────────────────────────
  const [currentExplanation, setCurrentExplanation] = useState<MathTeachingItem | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // ── Caption State ─────────────────────────────────────
  const [captionText, setCaptionText] = useState("");
  const [captionSpeaker, setCaptionSpeaker] = useState(TEACHER_NAME);

  // ── Transcript State ──────────────────────────────────
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  /** Whether the live caption bar is shown (toggled by the CC control). */
  const [captionsOn, setCaptionsOn] = useState(true);

  // ── Notes State ───────────────────────────────────────
  const [notesOpen, setNotesOpen] = useState(false);

  // ── Question State ────────────────────────────────────
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [isListening, setIsListening] = useState(false);
  /**
   * When the teacher asks the learner to clarify an unclear question, we hold the
   * clarifying prompt + quick options here and remember the original question, so
   * the learner's next message is treated as the clarification (not a new turn).
   */
  const [clarify, setClarify] = useState<{ question: string; original: string; options: string[] } | null>(null);
  /** A short follow-up offer shown after an answer ("Want an example?"). */
  const [followUp, setFollowUp] = useState<string | null>(null);
  /** Active speech recognizer while the learner asks a question by voice. */
  const recognizerRef = useRef<ReturnType<typeof startListening>>(null);
  /** Pending raise-hand auto-transition timers (cancelled if the hand is lowered). */
  const raiseHandTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Practice State ────────────────────────────────────
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("guided");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswer, setPracticeAnswer] = useState("");
  const [practiceFeedback, setPracticeFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [practiceFeedbackText, setPracticeFeedbackText] = useState("");

  // ── Exit Ticket State ─────────────────────────────────
  const [exitTicketOpen, setExitTicketOpen] = useState(false);
  const [exitTicketAnswer, setExitTicketAnswer] = useState("");
  const [exitTicketFeedback, setExitTicketFeedback] = useState<"correct" | "incorrect" | null>(null);

  // ── Completion State ──────────────────────────────────
  const [completionOpen, setCompletionOpen] = useState(false);
  const [takeawayScore, setTakeawayScore] = useState<number | null>(null);

  // ── Mode / Settings Selector State ────────────────────
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);

  // ── Learner Settings (display, sound, captions) ───────
  // Backed by the shared accessibility prefs, plus classroom-local extras. Built
  // big and clear so it works for grade-one learners up to tertiary students.
  const [a11y, setA11y] = useState<AccessibilityPrefs>(() => loadAccessibility());
  const [narrationOn, setNarrationOn] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [captionSize, setCaptionSize] = useState<"sm" | "md" | "lg">("md");

  // Apply display prefs (text scale / contrast / motion) whenever they change.
  useEffect(() => {
    saveAccessibility(a11y);
  }, [a11y]);
  // Mute/unmute the teacher's voice globally.
  useEffect(() => {
    setNarrationMuted(!narrationOn);
  }, [narrationOn]);
  // Narration speed → global speech rate.
  useEffect(() => {
    setGlobalRate(voiceSpeed === "slow" ? 0.8 : voiceSpeed === "fast" ? 1.25 : 1);
  }, [voiceSpeed]);

  // ── Raise Hand State ──────────────────────────────────
  const [raiseHand, setRaiseHand] = useState<"idle" | "raised" | "acknowledged" | "resolved">("idle");

  // ── Current Lesson Section ────────────────────────────
  const [currentSection, setCurrentSection] = useState<LessonSectionKey>("welcome");

  // ── Teaching Moments State ────────────────────────────
  const [recapOpen, setRecapOpen] = useState<string | null>(null);
  const [thinkingPauseText, setThinkingPauseText] = useState<string | null>(null);
  const [confidenceOpen, setConfidenceOpen] = useState(false);
  const [middleQuestionOpen, setMiddleQuestionOpen] = useState(false);
  const [middleFeedback, setMiddleFeedback] = useState<{ correct: boolean; text: string } | null>(null);
  const [reflectionOpen, setReflectionOpen] = useState(false);
  // Progressive hint level for the active practice problem (0 = none shown)
  const [hintLevel, setHintLevel] = useState(0);

  // ── Learning Results Recorder ─────────────────────────
  const [results, setResults] = useState<LearningResults>({
    questionsAsked: 0,
    raisedHands: 0,
    practiceAttempts: 0,
    practiceCorrect: 0,
    hintsUsed: 0,
    confidenceChecks: [],
    middleQuestionCorrect: null,
    misconceptionsDetected: 0,
    events: [],
  });
  const startTimeRef = useRef<number>(Date.now());

  /** Record a learning event (the page's memory of the learning journey). */
  const logEvent = useCallback((event: string) => {
    setResults((prev) => ({
      ...prev,
      events: [...prev.events, `${new Date().toLocaleTimeString()} — ${event}`],
    }));
  }, []);

  /** Persist a learning event to the database (best-effort, fire-and-forget).
   *  No-ops for the demo / when there is no real session backing the lesson. */
  const recordEvent = useCallback(
    (eventType: string, payload?: Record<string, unknown>) => {
      if (!sessionId) return;
      recordSessionEvent({
        data: { session_id: sessionId, event_type: eventType, actor_role: "student", payload },
      }).catch(() => {
        /* best-effort: never block the lesson on telemetry */
      });
    },
    [sessionId],
  );

  // Index we should resume writing from once an interjection is resolved
  const pendingNextIndexRef = useRef<number | null>(null);
  // Track which one-time interjections have already fired
  const firedInterjectionsRef = useRef<Set<string>>(new Set());

  // ── Progress ──────────────────────────────────────────
  const progress = useMemo(() => {
    if (phase === "complete" || completionOpen) return 100;
    if (phase === "exit_ticket") return 90;
    if (phase === "practice") return 70 + (practiceIndex / practiceProblems.length) * 20;
    return Math.round(((currentIndex + 1) / sequence.length) * 70);
  }, [currentIndex, phase, completionOpen, practiceIndex]);

  // ── Live session clock (mm:ss since the lesson started) ───────────────
  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    if (!started) return;
    const id = setInterval(
      () => setElapsedSec(Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000))),
      1000,
    );
    return () => clearInterval(id);
  }, [started]);
  const clock = `${String(Math.floor(elapsedSec / 60)).padStart(2, "0")}:${String(elapsedSec % 60).padStart(2, "0")}`;

  // Map board index to lesson section (driven by the lesson's section stops, so
  // it works for the demo and any real generated lesson alike).
  useEffect(() => {
    if (phase === "complete" || completionOpen) { setCurrentSection("complete"); return; }
    if (phase === "exit_ticket") { setCurrentSection("exit_ticket"); return; }
    if (phase === "practice") {
      setCurrentSection(practiceMode === "guided" ? "guided_practice" : "independent_practice");
      return;
    }
    // Find the last section stop at or before the current board index.
    let key: LessonSectionKey = "welcome";
    for (const stop of lesson.sectionStops) {
      if (currentIndex >= stop.startIndex) key = stop.key as LessonSectionKey;
      else break;
    }
    setCurrentSection(key);
  }, [currentIndex, phase, completionOpen, practiceMode, lesson.sectionStops]);

  // ── Save/Load Progress ────────────────────────────────
  const saveProgress = useCallback(() => {
    try {
      const data = {
        currentIndex,
        writtenLinesIds: writtenLines.map((l) => l.id),
        progress,
        currentSection,
        phase,
        transcriptCount: transcript.length,
        // Learning evidence (no exams — just activity)
        questionsAsked: results.questionsAsked,
        raisedHands: results.raisedHands,
        practiceAttempts: results.practiceAttempts,
        practiceCorrect: results.practiceCorrect,
        confidenceChecks: results.confidenceChecks.length,
        timeSpentSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
  }, [currentIndex, writtenLines, progress, currentSection, phase, transcript.length, results]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (!started) return;
    const interval = setInterval(saveProgress, 10000);
    return () => clearInterval(interval);
  }, [started, saveProgress]);

  // Save on phase changes
  useEffect(() => {
    if (started) saveProgress();
  }, [phase, started, saveProgress]);

  const [savedProgress, setSavedProgress] = useState<{ exists: boolean; section?: string; progress?: number; savedAt?: string } | null>(null);

  // Check for saved progress on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setSavedProgress({ exists: true, section: data.currentSection, progress: data.progress, savedAt: data.savedAt });
      }
    } catch { /* ignore */ }
  }, []);

  // ── Refs ──────────────────────────────────────────────
  const writingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceRef = useRef(0);
  // Always-fresh index + function refs so the teaching chain never runs on a
  // stale closure (this is what caused the lesson to repeat one section).
  const currentIndexRef = useRef(0);
  const readBoardRef = useRef<(item: MathTeachingItem, seq: number, idx: number) => void>(() => {});
  const explainStepRef = useRef<(item: MathTeachingItem, seq: number, idx: number) => void>(() => {});
  const showWarningRef = useRef<(item: MathTeachingItem, seq: number, idx: number) => void>(() => {});
  const advanceRef = useRef<(seq: number, idx: number) => void>(() => {});
  const resumeAfterInterjectionRef = useRef<() => void>(() => {});

  // ── Cleanup ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      raiseHandTimersRef.current.forEach(clearTimeout);
      stopListening(recognizerRef.current);
    };
  }, []);

  // ── Auto-scroll board ─────────────────────────────────
  useEffect(() => {
    if (boardRef.current) {
      boardRef.current.scrollTop = boardRef.current.scrollHeight;
    }
  }, [writtenLines, currentWritingText]);

  // ── Auto-play on mount ────────────────────────────────
  useEffect(() => {
    if (autoPlay && !started) {
      const t = setTimeout(() => handleStartLesson(), 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // ──────────────────────────────────────────────────────
  // Teaching Engine
  // ──────────────────────────────────────────────────────

  const addTranscript = useCallback(
    (role: TranscriptEntry["role"], text: string, boardItemId?: string) => {
      setTranscript((prev) => [
        ...prev,
        {
          id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          role,
          text,
          timestamp: new Date().toLocaleTimeString(),
          boardItemId,
        },
      ]);
    },
    [],
  );

  const clearTimers = useCallback(() => {
    if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  }, []);

  /** Write text letter by letter onto the board. `idx` is threaded through the
   *  whole teaching chain so flow control never reads stale `currentIndex`. */
  const writeOnBoard = useCallback(
    (item: MathTeachingItem, seq: number, idx: number) => {
      if (seq !== sequenceRef.current) return;

      currentIndexRef.current = idx;
      setCurrentIndex(idx);
      setPhase("writing");
      setTeacherState("writing");
      setIsWriting(true);
      setCurrentWritingText("");
      setCaptionText("✍️ Writing on board...");
      setCaptionSpeaker(TEACHER_NAME);

      const speed = SPEED_MAP[item.writingSpeed ?? "normal"];
      const text = item.boardText;
      let charIdx = 0;

      const writeChar = () => {
        if (seq !== sequenceRef.current) return;
        if (charIdx < text.length) {
          setCurrentWritingText(text.slice(0, charIdx + 1));
          charIdx++;
          writingTimerRef.current = setTimeout(writeChar, speed);
        } else {
          // Writing complete
          setIsWriting(false);
          setWrittenLines((prev) => (prev.some((l) => l.id === item.id) ? prev : [...prev, item]));
          setCurrentWritingText("");
          addTranscript("board", item.boardText, item.id);

          // Move to reading phase
          phaseTimerRef.current = setTimeout(() => readBoardRef.current(item, seq, idx), 600);
        }
      };

      writingTimerRef.current = setTimeout(writeChar, speed);
    },
    [addTranscript],
  );

  /** Teacher reads the board text exactly */
  const readBoard = useCallback(
    (item: MathTeachingItem, seq: number, idx: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("reading");
      setTeacherState("speaking");
      setCaptionText(item.exactSpokenText);
      setCaptionSpeaker(TEACHER_NAME);
      setShowExplanation(false);
      setShowWarning(false);
      addTranscript("teacher", item.exactSpokenText, item.id);

      if (learningMode !== "deaf") {
        speak(item.exactSpokenText, undefined, undefined, TEACHER_VOICE);
      }

      const readDuration = Math.max(item.exactSpokenText.length * 60, 2000);
      phaseTimerRef.current = setTimeout(() => explainStepRef.current(item, seq, idx), readDuration);
    },
    [addTranscript, learningMode],
  );

  /** Teacher gives deeper narrative explanation */
  const explainStep = useCallback(
    (item: MathTeachingItem, seq: number, idx: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("explaining");
      setTeacherState("explaining");
      setCurrentExplanation(item);
      setShowExplanation(true);
      setCaptionText(item.teacherExplanation);
      setCaptionSpeaker(TEACHER_NAME);
      addTranscript("teacher", item.teacherExplanation, item.id);

      if (learningMode !== "deaf") {
        speak(item.teacherExplanation, undefined, undefined, TEACHER_VOICE);
      }

      // Show warning if there's a common mistake
      const delay = Math.max(item.teacherExplanation.length * 50, 3000);
      phaseTimerRef.current = setTimeout(() => {
        if (seq !== sequenceRef.current) return;
        if (item.commonMistake) {
          showWarningRef.current(item, seq, idx);
        } else {
          advanceRef.current(seq, idx);
        }
      }, delay);
    },
    [addTranscript, learningMode],
  );

  /** Show common mistake warning */
  const showWarningPhase = useCallback(
    (item: MathTeachingItem, seq: number, idx: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("warning");
      setTeacherState("warning");
      setShowWarning(true);
      setCaptionText(`⚠️ ${item.commonMistake}`);
      setCaptionSpeaker(TEACHER_NAME);
      addTranscript("teacher", `Warning: ${item.commonMistake}`, item.id);

      phaseTimerRef.current = setTimeout(() => advanceRef.current(seq, idx), 4000);
    },
    [addTranscript],
  );

  /** Start practice session */
  const startPractice = useCallback(
    (mode: PracticeMode, seq: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("practice");
      setTeacherState("asking_question");
      setPracticeOpen(true);
      setPracticeMode(mode);
      setPracticeIndex(0);
      setPracticeAnswer("");
      setPracticeFeedback(null);
      setCaptionText(mode === "guided" ? "Let's try one together!" : "Your turn to try alone!");
      setCaptionSpeaker(TEACHER_NAME);
      addTranscript("system", mode === "guided" ? "Guided practice started" : "Independent practice started");
      setHintLevel(0);
    },
    [addTranscript],
  );

  /**
   * Open a teaching interjection (recap / thinking pause / middle question /
   * confidence check). This pauses the automatic flow; the lesson resumes only
   * when the learner resolves the moment via resumeAfterInterjection().
   */
  const openInterjection = useCallback(
    (kind: Interjection, nextIdx: number, recapKey?: string) => {
      clearTimers();
      pendingNextIndexRef.current = nextIdx;
      setIsPaused(false);
      const seqAtOpen = sequenceRef.current;

      if (kind === "recap" && recapKey) {
        // Vision mode: no popup overlay
        if (learningMode !== "blind") {
          setRecapOpen(recapKey);
        }
        setTeacherState("explaining");
        const recap = SECTION_RECAPS[recapKey];
        const spoken = recap ? `${recap.title}. ${recap.points.join(". ")}.` : "Let's quickly recap what we just covered.";
        setCaptionText(spoken);
        if (learningMode !== "deaf") speak(spoken, undefined, undefined, TEACHER_VOICE);
        logEvent(`Section recap shown: ${recapKey}`);
        // Auto-continue so the lesson never stalls on a click.
        phaseTimerRef.current = setTimeout(() => resumeAfterInterjectionRef.current(), 6500);
      } else if (kind === "thinking_pause") {
        const text =
          THINKING_PAUSES[nextIdx] ??
          "Take a moment to think about what we've seen so far.";
        if (learningMode !== "blind") {
          setThinkingPauseText(text);
        }
        setTeacherState("thinking");
        setCaptionText(text);
        if (learningMode !== "deaf") speak(text, undefined, undefined, TEACHER_VOICE);
        logEvent("Thinking pause");
        phaseTimerRef.current = setTimeout(() => resumeAfterInterjectionRef.current(), 6000);
      } else if (kind === "middle_question") {
        // Only ask if the lesson carries an authored multiple-choice check.
        if (!MIDDLE_QUESTION) {
          resumeAfterInterjectionRef.current();
          return;
        }
        if (learningMode !== "blind") {
          setMiddleQuestionOpen(true);
        }
        setMiddleFeedback(null);
        setTeacherState("asking_question");
        setCaptionText(MIDDLE_QUESTION.question);
        if (learningMode !== "deaf") speak(MIDDLE_QUESTION.question, undefined, undefined, TEACHER_VOICE);
        logEvent("Required middle question asked");
        // Auto-resume after timer for vision modes
        phaseTimerRef.current = setTimeout(() => {
          if (sequenceRef.current === seqAtOpen) resumeAfterInterjectionRef.current();
        }, 22000);
      } else if (kind === "confidence") {
        if (learningMode !== "blind") {
          setConfidenceOpen(true);
        }
        setTeacherState("asking_question");
        const c = "How confident are you with this so far?";
        setCaptionText(c);
        if (learningMode !== "deaf") speak(c, undefined, undefined, TEACHER_VOICE);
        logEvent("Confidence check shown");
        phaseTimerRef.current = setTimeout(() => resumeAfterInterjectionRef.current(), 7000);
      }
    },
    [clearTimers, learningMode, logEvent],
  );

  /** Close any open interjection and resume teaching from the pending point. */
  const resumeAfterInterjection = useCallback(() => {
    setRecapOpen(null);
    setThinkingPauseText(null);
    setConfidenceOpen(false);
    setMiddleQuestionOpen(false);
    setMiddleFeedback(null);

    const seq = sequenceRef.current;
    const pending = pendingNextIndexRef.current;
    pendingNextIndexRef.current = null;
    if (pending === null) return;

    setTeacherState("preparing");
    if (pending === -1) {
      // Sentinel: proceed to guided practice (or the exit reflection when the
      // lesson carries no practice problems).
      phaseTimerRef.current = setTimeout(() => {
        if (practiceProblems.length > 0) startPractice("guided", seq);
        else setReflectionOpen(true);
      }, 800);
      return;
    }
    phaseTimerRef.current = setTimeout(() => {
      if (seq === sequenceRef.current) {
        writeOnBoard(sequence[pending], seq, pending);
      }
    }, 500);
  }, [writeOnBoard, startPractice, practiceProblems.length, sequence]);

  /** Advance to next board item, inserting teaching moments at boundaries.
   *  `idx` is the index that just finished (threaded, never stale). */
  const advanceToNext = useCallback(
    (seq: number, idx: number) => {
      if (seq !== sequenceRef.current) return;

      const nextIdx = idx + 1;
      setShowExplanation(false);
      setShowWarning(false);

      if (nextIdx >= sequence.length) {
        // End of teaching → confidence check, then guided practice (or, when the
        // lesson has no practice problems, straight to the exit reflection).
        if (!firedInterjectionsRef.current.has("confidence_final")) {
          firedInterjectionsRef.current.add("confidence_final");
          openInterjection("confidence", -1);
          return;
        }
        if (practiceProblems.length > 0) {
          phaseTimerRef.current = setTimeout(() => startPractice("guided", seq), 1000);
        } else {
          phaseTimerRef.current = setTimeout(() => setReflectionOpen(true), 1000);
        }
        return;
      }

      // ── Teaching-moment schedule (each fires once). When auto-mode is on
      // (default, accessibility-friendly), non-blocking moments self-resume. ──
      if (RECAP_AT_INDEX >= 0 && nextIdx === RECAP_AT_INDEX && !firedInterjectionsRef.current.has("recap_concept")) {
        firedInterjectionsRef.current.add("recap_concept");
        openInterjection("recap", nextIdx, "concept");
        return;
      }
      if (
        THINKING_PAUSES[nextIdx] &&
        !firedInterjectionsRef.current.has(`pause_${nextIdx}`)
      ) {
        firedInterjectionsRef.current.add(`pause_${nextIdx}`);
        openInterjection("thinking_pause", nextIdx);
        return;
      }
      if (MIDDLE_QUESTION && nextIdx === MIDDLE_QUESTION_AT_INDEX && !firedInterjectionsRef.current.has("middle_question")) {
        firedInterjectionsRef.current.add("middle_question");
        openInterjection("middle_question", nextIdx);
        return;
      }

      const pause = sequence[nextIdx].pauseAfter ?? 800;
      phaseTimerRef.current = setTimeout(() => {
        if (seq === sequenceRef.current) {
          writeOnBoard(sequence[nextIdx], seq, nextIdx);
        }
      }, pause);
    },
    [writeOnBoard, openInterjection, startPractice],
  );

  // Keep the function refs fresh so the timer-driven chain always calls the
  // latest version (prevents stale closures / repeated sections).
  useEffect(() => {
    readBoardRef.current = readBoard;
    explainStepRef.current = explainStep;
    showWarningRef.current = showWarningPhase;
    advanceRef.current = advanceToNext;
    resumeAfterInterjectionRef.current = resumeAfterInterjection;
  });

  // ──────────────────────────────────────────────────────
  // Teaching-moment resolvers
  // ──────────────────────────────────────────────────────

  /** Auto-start teaching with a short spoken prerequisite reminder — no blocking
   *  popup, so blind learners are never stuck waiting for a click. */
  const beginTeaching = useCallback(() => {
    const seq = ++sequenceRef.current;
    const intro = lesson.prerequisiteReview;
    if (intro) {
      setTeacherState("explaining");
      setCaptionText(intro);
      setCaptionSpeaker(TEACHER_NAME);
      addTranscript("teacher", intro);
      if (learningMode !== "deaf") speak(intro, undefined, undefined, TEACHER_VOICE);
      logEvent("Prerequisite reminder (auto)");
      phaseTimerRef.current = setTimeout(() => {
        if (seq === sequenceRef.current) writeOnBoard(sequence[0], seq, 0);
      }, 6000);
    } else {
      // No prerequisite review for this lesson → start writing right away.
      writeOnBoard(sequence[0], seq, 0);
    }
  }, [addTranscript, learningMode, logEvent, writeOnBoard, lesson.prerequisiteReview, sequence, TEACHER_VOICE]);

  /** Thinking pause buttons (Continue / Read again / I need help). */
  const handleThinkingPause = useCallback(
    (action: "continue" | "repeat" | "help") => {
      if (action === "continue") {
        resumeAfterInterjection();
        return;
      }
      if (action === "repeat") {
        if (thinkingPauseText && learningMode !== "deaf") speak(thinkingPauseText);
        return;
      }
      // "help" — keep the pause open, offer a nudge
      const nudge =
        "No problem. Look at the two conditions: the numbers must multiply to the last value and add to the middle value.";
      setCaptionText(nudge);
      if (learningMode !== "deaf") speak(nudge);
      logEvent("Learner asked for help during thinking pause");
    },
    [resumeAfterInterjection, thinkingPauseText, learningMode, logEvent],
  );

  /** Confidence check answered → record learning data, then continue. */
  const handleConfidence = useCallback(
    (opt: ClassroomConfidenceOption) => {
      setResults((prev) => ({
        ...prev,
        confidenceChecks: [...prev.confidenceChecks, { section: currentSection, level: opt.value }],
      }));
      logEvent(`Confidence (${currentSection}): ${opt.label}`);
      addTranscript("student", `Confidence: ${opt.label}`);
      if (opt.value === "not_yet" || opt.value === "explain_again") {
        setCaptionText("No problem — let's keep going and I'll explain carefully.");
        addTranscript("teacher", "No problem — let's keep going and I'll explain carefully.");
      } else {
        setCaptionText("Wonderful. Let's continue.");
      }
      resumeAfterInterjection();
    },
    [currentSection, logEvent, addTranscript, resumeAfterInterjection],
  );

  /** Required middle question answered → feedback (with misconception watch). */
  const handleMiddleAnswer = useCallback(
    (answer: string) => {
      if (!MIDDLE_QUESTION) {
        resumeAfterInterjection();
        return;
      }
      const correct = answer === MIDDLE_QUESTION.correct;
      const isMisconception = answer === MIDDLE_QUESTION.misconception?.answer;
      const text = correct
        ? MIDDLE_QUESTION.feedbackCorrect
        : isMisconception
          ? MIDDLE_QUESTION.misconception!.note
          : MIDDLE_QUESTION.feedbackIncorrect;

      setResults((prev) => ({
        ...prev,
        middleQuestionCorrect: correct,
        misconceptionsDetected: prev.misconceptionsDetected + (isMisconception ? 1 : 0),
      }));
      addTranscript("student", answer);
      addTranscript("teacher", text);
      setMiddleFeedback({ correct, text });
      if (learningMode !== "deaf") speak(text);
      logEvent(`Middle question: ${answer} (${correct ? "correct" : "incorrect"})`);

      phaseTimerRef.current = setTimeout(() => resumeAfterInterjection(), 3500);
    },
    [addTranscript, learningMode, logEvent, resumeAfterInterjection],
  );

  // ──────────────────────────────────────────────────────
  // Lesson Controls
  // ──────────────────────────────────────────────────────

  const handleStartLesson = useCallback(() => {
    setStarted(true);
    setPhase("idle");
    setTeacherState("preparing");
    setCaptionText("Welcome! Let's begin today's lesson.");
    setCaptionSpeaker(TEACHER_NAME);
    addTranscript("system", "Lesson started");
    addTranscript("teacher", LESSON_OPENING_NARRATIVE);

    if (learningMode !== "deaf") {
      speak(LESSON_OPENING_NARRATIVE, undefined, undefined, TEACHER_VOICE);
    }

    ++sequenceRef.current;
    startTimeRef.current = Date.now();
    firedInterjectionsRef.current = new Set();
    pendingNextIndexRef.current = null;
    currentIndexRef.current = 0;
    setCurrentIndex(0);
    setWrittenLines([]);
    setCurrentWritingText("");
    logEvent("Lesson started");
    recordEvent("session_started", { lessonTitle: LESSON_TITLE, learningMode });

    // Auto-start teaching (no blocking popup — accessible for blind learners)
    phaseTimerRef.current = setTimeout(() => beginTeaching(), 4000);
  }, [addTranscript, learningMode, logEvent, beginTeaching, recordEvent, LESSON_TITLE]);

  const handlePause = useCallback(() => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      setTeacherState("speaking");
      setCaptionText("Lesson resumed.");
    } else {
      setIsPaused(true);
      setTeacherState("paused");
      clearTimers();
      setCaptionText("Lesson paused.");
    }
  }, [isPaused, clearTimers]);

  const handleReplay = useCallback(() => {
    clearTimers();
    const seq = ++sequenceRef.current;
    setWrittenLines([]);
    setCurrentWritingText("");
    setShowExplanation(false);
    setShowWarning(false);
    setCurrentExplanation(null);
    setIsPaused(false);
    setTeacherState("preparing");
    setCaptionText("Replaying lesson from the beginning...");
    setCaptionSpeaker(TEACHER_NAME);

    writeOnBoard(sequence[0], seq, 0);
  }, [clearTimers, writeOnBoard]);

  const handleReplayStep = useCallback(() => {
    if (currentIndex < 0) return;
    clearTimers();
    const seq = ++sequenceRef.current;
    setWrittenLines((prev) => prev.slice(0, currentIndex));
    setCurrentWritingText("");
    setShowExplanation(false);
    setShowWarning(false);
    setTeacherState("preparing");
    setCaptionText("Replaying current step...");
    setCaptionSpeaker(TEACHER_NAME);

    writeOnBoard(sequence[currentIndex], seq, currentIndex);
  }, [currentIndex, clearTimers, writeOnBoard]);

  /** Jump to a section from the sidebar lesson plan. Completed and the current
   *  section are navigable; the immediate next is allowed (procedural), but you
   *  cannot skip far ahead. */
  const jumpToSection = useCallback(
    (key: LessonSectionKey) => {
      const targetIdx = SECTION_START_INDEX[key];
      if (targetIdx === undefined) return; // practice/exit handled by their own flow
      const sectionOrder = LESSON_PLAN_SECTIONS.findIndex((s) => s.key === key);
      const currentOrder = LESSON_PLAN_SECTIONS.findIndex((s) => s.key === currentSection);
      if (sectionOrder > currentOrder + 1) return; // no skipping ahead

      clearTimers();
      const seq = ++sequenceRef.current;
      // Rebuild the board up to (but not including) the target, then teach it.
      setWrittenLines(sequence.slice(0, targetIdx));
      setCurrentWritingText("");
      setShowExplanation(false);
      setShowWarning(false);
      setIsPaused(false);
      setTeacherState("preparing");
      setCaptionText(`Going to ${LESSON_PLAN_SECTIONS[sectionOrder].label}…`);
      setCaptionSpeaker(TEACHER_NAME);
      logEvent(`Jumped to section: ${key}`);
      writeOnBoard(sequence[targetIdx], seq, targetIdx);
    },
    [currentSection, clearTimers, writeOnBoard, logEvent],
  );

  const handleEndLesson = useCallback(() => {
    clearTimers();
    ++sequenceRef.current;
    setPhase("complete");
    setTeacherState("paused");
    setCaptionText("");

    // Calculate takeaway score (0-100)
    const timeMinutes = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
    const practiceAccuracy = results.practiceAttempts > 0 ? (results.practiceCorrect / results.practiceAttempts) * 100 : 0;
    const confidenceCount = results.confidenceChecks.length;

    // Scoring formula:
    // - Practice accuracy: 50 points max
    // - Hints penalty: -2 per hint (to -20 max)
    // - Misconceptions penalty: -5 per misconception (to -25 max)
    // - Engagement: questions + raised hands give bonus (up to 20)
    // - Time bonus: efficient time gives +10 (under 15 min)
    let score = 0;
    score += (practiceAccuracy / 100) * 50; // practice score
    score += Math.max(0, 20 - results.hintsUsed * 2); // hint penalty
    score += Math.max(0, 25 - results.misconceptionsDetected * 5); // misconception penalty
    score += Math.min(20, results.questionsAsked * 3 + results.raisedHands * 2); // engagement
    score += timeMinutes < 15 ? 10 : 5; // time bonus
    score = Math.max(0, Math.min(100, Math.round(score)));

    setTakeawayScore(score);
    setResults((prev) => ({ ...prev, score }));
    setCompletionOpen(true);
    addTranscript("system", `Lesson ended with score: ${score}/100`);

    // Persist the full learning-evidence summary for this session.
    recordEvent("session_completed", {
      score,
      timeMinutes,
      questionsAsked: results.questionsAsked,
      raisedHands: results.raisedHands,
      practiceAttempts: results.practiceAttempts,
      practiceCorrect: results.practiceCorrect,
      hintsUsed: results.hintsUsed,
      confidenceChecks: results.confidenceChecks.length,
      misconceptionsDetected: results.misconceptionsDetected,
      middleQuestionCorrect: results.middleQuestionCorrect,
    });
  }, [clearTimers, addTranscript, results, startTimeRef, recordEvent]);

  // ── Question handlers ─────────────────────────────────
  const handleAskQuestion = useCallback(() => {
    setQuestionOpen(true);
    setTeacherState("listening");
    setCaptionText("What is your question?");
    setCaptionSpeaker(TEACHER_NAME);
  }, []);

  /** Toggle voice capture for asking a question. Transcribes speech into the
   *  question box so the learner can review and send (works in standard and
   *  blind modes; deaf mode stays text-only). */
  const toggleMic = useCallback(() => {
    if (learningMode === "deaf") return;
    if (isListening) {
      stopListening(recognizerRef.current);
      recognizerRef.current = null;
      setIsListening(false);
      return;
    }
    setQuestionOpen(true);
    setTeacherState("listening");
    setCaptionText("Listening… ask your question now.");
    setCaptionSpeaker(TEACHER_NAME);
    setIsListening(true);
    recognizerRef.current = startListening(
      (transcript, isFinal) => {
        setQuestionText(transcript);
        if (isFinal) {
          stopListening(recognizerRef.current);
          recognizerRef.current = null;
          setIsListening(false);
        }
      },
      () => {
        setIsListening(false);
        setCaptionText("Voice input isn't available here — please type your question.");
      },
      () => setIsListening(false),
    );
  }, [isListening, learningMode]);

  const handleSubmitQuestion = useCallback(() => {
    const q = questionText.trim();
    if (!q) return;
    addTranscript("student", q);
    // A clarification reply isn't a new question — only count fresh questions.
    const isClarificationReply = clarify !== null;
    if (!isClarificationReply) {
      setResults((prev) => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }));
      recordEvent("question_asked", { question: q });
    }
    logEvent(isClarificationReply ? `Learner clarified: ${q}` : `Learner asked: ${q}`);
    setQuestionOpen(false);
    setQuestionText("");
    setFollowUp(null);
    setTeacherState("thinking");
    setCaptionText("Let me think about that...");

    // Build the current classroom context and ask the AI teacher. The teacher may
    // either answer (clear) or ask ONE clarifying question (unclear) — just like a
    // real tutor who won't guess at a vague question.
    const boardItem =
      writtenLines[writtenLines.length - 1]?.boardText ??
      sequence[currentIndex]?.boardText;
    const previousQuestions = transcript
      .filter((t) => t.role === "student")
      .map((t) => t.text)
      .slice(-5);

    // If this is a clarification round, send the original question + the prior
    // clarifying prompt so the model answers directly instead of re-asking.
    const effectiveQuestion = isClarificationReply ? `${clarify!.original} — specifically: ${q}` : q;
    const priorClarification = isClarificationReply ? clarify!.question : undefined;
    setClarify(null);

    const ask = async () => {
      try {
        const res = await answerLearnerQuestion({
          data: {
            context: {
              institution: INSTITUTION,
              course: COURSE,
              lessonTitle: LESSON_TITLE,
              currentSection,
              currentBoardItem: boardItem,
              teacherExplanation: currentExplanation?.teacherExplanation,
              learnerNotes: FULL_LEARNER_NOTES.slice(0, 600),
              previousQuestions,
              // Ground answers in the institution's own approved material (RAG),
              // so the AI teacher does not drift into general knowledge.
              materialContext: lesson.materialContext,
              learningMode,
              learnerLevel: COURSE,
              academicLevel: ACADEMIC_LEVEL,
              priorClarification,
            },
            question: effectiveQuestion,
          },
        });

        // ── Teacher needs the learner to clarify ──────────────────────────
        if (res.clarity === "unclear" && res.clarificationQuestion) {
          setTeacherState("clarifying");
          setCaptionText(res.clarificationQuestion);
          setCaptionSpeaker(TEACHER_NAME);
          addTranscript("teacher", res.clarificationQuestion);
          if (learningMode !== "deaf") speak(res.clarificationQuestion);
          logEvent("Teacher asked for clarification");
          setClarify({
            question: res.clarificationQuestion,
            original: effectiveQuestion,
            options: res.clarificationOptions ?? [],
          });
          // Re-open the question box so the learner can pick/answer the clarification.
          phaseTimerRef.current = setTimeout(() => {
            setTeacherState("listening");
            setQuestionOpen(true);
          }, Math.min(res.clarificationQuestion.length * 45, 4000));
          return;
        }

        // ── Teacher answers (clear or a steered off-topic reply) ──────────
        const answer = res.answer;
        setTeacherState("answering");
        setCaptionText(answer);
        setCaptionSpeaker(TEACHER_NAME);
        addTranscript("teacher", answer);
        if (res.saveToNotes) logEvent("Answer saved to notes");
        if (learningMode !== "deaf") speak(answer);
        // Offer a natural next step, exactly like a tutor checking in.
        setFollowUp(res.suggestedFollowUp || "Does that help, or should I show an example?");
        const dwell = Math.min(Math.max(answer.length * 38, 3000), 9000);
        phaseTimerRef.current = setTimeout(() => setTeacherState("speaking"), dwell);
      } catch {
        const fallback =
          "That's a great question. Let's connect it back to what we're doing in this step — look carefully at what's currently on the board, and check each part against the idea we just covered. If it still feels unclear, raise your hand and we'll work through another example together.";
        setTeacherState("answering");
        setCaptionText(fallback);
        addTranscript("teacher", fallback);
        if (learningMode !== "deaf") speak(fallback);
        phaseTimerRef.current = setTimeout(() => setTeacherState("speaking"), 3000);
      }
    };
    void ask();
  }, [questionText, clarify, addTranscript, logEvent, transcript, writtenLines, currentIndex, currentSection, currentExplanation, learningMode, recordEvent]);

  const handleQuickAction = useCallback(
    (action: string) => {
      setQuestionOpen(false);
      addTranscript("student", action);

      if (action === "Continue" || action === "No question") {
        setTeacherState("speaking");
        return;
      }
      if (action === "Repeat") {
        handleReplayStep();
        return;
      }
      if (action === "Slow down") {
        setCaptionText("I'll slow down. Let me explain again more carefully.");
        addTranscript("teacher", "I'll slow down. Let me explain again more carefully.");
        setTimeout(() => handleReplayStep(), 2000);
        return;
      }
      if (action === "Explain simpler" || action === "Give example" || action === "I don't understand") {
        // Route through the real, lesson-grounded AI teacher so the response is
        // correct for ANY subject (not a hardcoded maths example).
        const mapped =
          action === "Give example"
            ? "Can you give me another example of what we are doing in this step?"
            : action === "Explain simpler"
              ? "Can you explain this current step more simply?"
              : "I don't understand this step. Can you explain it a different way?";
        setResults((prev) => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }));
        setTeacherState("thinking");
        setCaptionText("Let me think about how best to explain that…");
        setCaptionSpeaker(TEACHER_NAME);
        logEvent(`Quick action: ${action}`);

        const boardItem =
          writtenLines[writtenLines.length - 1]?.boardText ?? sequence[currentIndex]?.boardText;
        void (async () => {
          try {
            const res = await answerLearnerQuestion({
              data: {
                context: {
                  institution: INSTITUTION,
                  course: COURSE,
                  lessonTitle: LESSON_TITLE,
                  currentSection,
                  currentBoardItem: boardItem,
                  teacherExplanation: currentExplanation?.teacherExplanation,
                  learnerNotes: FULL_LEARNER_NOTES.slice(0, 600),
                  materialContext: lesson.materialContext,
                  learningMode,
                  academicLevel: ACADEMIC_LEVEL,
                },
                question: mapped,
              },
            });
            const answer = res.answer || res.clarificationQuestion || "Let's look at this step again together.";
            setTeacherState("answering");
            setCaptionText(answer);
            setCaptionSpeaker(TEACHER_NAME);
            addTranscript("teacher", answer);
            if (learningMode !== "deaf") speak(answer, undefined, undefined, TEACHER_VOICE);
            setFollowUp(res.suggestedFollowUp || "Does that help, or should I show another example?");
            const dwell = Math.min(Math.max(answer.length * 38, 3000), 9000);
            phaseTimerRef.current = setTimeout(() => setTeacherState("speaking"), dwell);
          } catch {
            // If the AI is unavailable, simply re-teach the current step.
            handleReplayStep();
          }
        })();
        return;
      }
    },
    [
      addTranscript,
      handleReplayStep,
      writtenLines,
      sequence,
      currentIndex,
      currentSection,
      currentExplanation,
      learningMode,
      lesson.materialContext,
      INSTITUTION,
      COURSE,
      LESSON_TITLE,
      FULL_LEARNER_NOTES,
      ACADEMIC_LEVEL,
      TEACHER_VOICE,
      logEvent,
    ],
  );

  // ── Practice handlers ─────────────────────────────────
  const handlePracticeSubmit = useCallback(() => {
    const problem = practiceProblems[practiceIndex];
    if (!problem) return;

    const norm = (s: string) =>
      s.replace(/\s/g, "").split(/[,;]/).filter(Boolean).sort().join(",");
    const isCorrect = norm(practiceAnswer) === norm(problem.correctAnswer);
    const isMisconception = norm(practiceAnswer) === norm(problem.misconception.answer);

    setResults((prev) => ({
      ...prev,
      practiceAttempts: prev.practiceAttempts + 1,
      practiceCorrect: prev.practiceCorrect + (isCorrect ? 1 : 0),
      misconceptionsDetected: prev.misconceptionsDetected + (isMisconception ? 1 : 0),
    }));

    if (isCorrect) {
      setPracticeFeedback("correct");
      setPracticeFeedbackText("Correct! Well done! 🎉");
      addTranscript("student", practiceAnswer);
      addTranscript("teacher", "Correct! Well done!");
      logEvent(`Practice correct: ${problem.equation}`);
    } else {
      // Misconception watch: targeted correction when the answer is a known trap
      const feedback = isMisconception ? problem.misconception.note : `Not quite. ${problem.hint}`;
      setPracticeFeedback("incorrect");
      setPracticeFeedbackText(feedback);
      addTranscript("student", practiceAnswer);
      addTranscript("teacher", feedback);
      logEvent(
        isMisconception
          ? `Misconception detected: ${practiceAnswer} for ${problem.equation}`
          : `Practice incorrect: ${problem.equation}`,
      );
    }

    setTimeout(() => {
      if (practiceIndex < practiceProblems.length - 1) {
        setPracticeIndex((i) => i + 1);
        setPracticeAnswer("");
        setPracticeFeedback(null);
        setHintLevel(0);
      } else if (practiceMode === "guided") {
        // Move to independent practice
        setPracticeOpen(false);
        const seq = sequenceRef.current;
        setTimeout(() => startPractice("independent", seq), 1000);
      } else {
        // Move to exit ticket
        setPracticeOpen(false);
        setTimeout(() => {
          setExitTicketOpen(true);
          setPhase("exit_ticket");
          setTeacherState("asking_question");
          setCaptionText("Final check before we finish!");
        }, 1000);
      }
    }, 2500);
  }, [practiceAnswer, practiceIndex, practiceMode, addTranscript, startPractice, logEvent]);

  // ── Exit ticket handler ───────────────────────────────
  const handleExitTicketSubmit = useCallback(
    (answer: string) => {
      if (!EXIT_TICKET_QUESTION) {
        setExitTicketOpen(false);
        setReflectionOpen(true);
        return;
      }
      const norm = (s: string) => s.replace(/\s/g, "").toLowerCase();
      const isCorrect = norm(answer) === norm(EXIT_TICKET_QUESTION.correct);
      setExitTicketAnswer(answer);
      setExitTicketFeedback(isCorrect ? "correct" : "incorrect");

      addTranscript("student", answer);
      logEvent(`Exit ticket: ${answer} (${isCorrect ? "correct" : "incorrect"})`);
      addTranscript(
        "teacher",
        isCorrect ? EXIT_TICKET_QUESTION.feedbackCorrect : EXIT_TICKET_QUESTION.feedbackIncorrect,
      );

      // After the exit ticket, ask for a reflection before completing
      setTimeout(() => {
        setExitTicketOpen(false);
        setReflectionOpen(true);
        setTeacherState("asking_question");
        setCaptionText(EXIT_REFLECTION.question);
      }, 3000);
    },
    [addTranscript, logEvent],
  );

  /** Exit reflection answered → record weak area, then end the lesson. */
  const handleReflection = useCallback(
    (option: string) => {
      addTranscript("student", `Wants to review: ${option}`);
      logEvent(`Exit reflection: ${option}`);
      setReflectionOpen(false);
      handleEndLesson();
    },
    [addTranscript, logEvent, handleEndLesson],
  );

  // ──────────────────────────────────────────────────────
  // Render: Start Screen
  // ──────────────────────────────────────────────────────

  const handleResumeLesson = useCallback(() => {
    setStarted(true);
    setSavedProgress(null);
    // Resume from where they left off - start fresh but acknowledge progress
    setPhase("idle");
    setTeacherState("preparing");
    setCaptionText("Welcome back! Resuming your lesson...");
    setCaptionSpeaker(TEACHER_NAME);
    addTranscript("system", "Lesson resumed from previous session");

    if (learningMode !== "deaf") {
      speak("Welcome back! Let's continue our lesson.");
    }

    const seq = ++sequenceRef.current;
    setCurrentIndex(0);
    setWrittenLines([]);
    setCurrentWritingText("");

    phaseTimerRef.current = setTimeout(() => {
      if (seq === sequenceRef.current) {
        writeOnBoard(sequence[0], seq, 0);
      }
    }, 3000);
  }, [addTranscript, learningMode, writeOnBoard]);

  const handleStartFresh = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSavedProgress(null);
    handleStartLesson();
  }, [handleStartLesson]);

  // ── Inline engagement (non-modal) ─────────────────────
  // Derive a single inline prompt from the existing interjection state. These
  // used to be modal overlays; now they render in the engagement area under the
  // whiteboard, so they never trap or interrupt the learner.
  const engagement = useMemo<EngagementPrompt | null>(() => {
    if (recapOpen && SECTION_RECAPS[recapOpen]) {
      return {
        kind: "recap",
        title: SECTION_RECAPS[recapOpen].title,
        bodyList: SECTION_RECAPS[recapOpen].points,
        actions: [{ id: "recap:resume", label: "Ready to continue →", primary: true }],
      };
    }
    if (thinkingPauseText) {
      return {
        kind: "thinking_pause",
        title: thinkingPauseText,
        actions: [
          { id: "pause:continue", label: "Continue", primary: true },
          { id: "pause:repeat", label: "Read again" },
          { id: "pause:help", label: "I need help" },
        ],
      };
    }
    if (middleQuestionOpen && MIDDLE_QUESTION) {
      return {
        kind: "middle_question",
        title: MIDDLE_QUESTION.question,
        actions: MIDDLE_QUESTION.options.map((opt) => ({ id: `middle:${opt}`, label: opt })),
        feedback: middleFeedback
          ? { tone: middleFeedback.correct ? "correct" : "incorrect", text: middleFeedback.text }
          : undefined,
      };
    }
    if (confidenceOpen) {
      return {
        kind: "confidence_check",
        title: "How confident are you with this so far?",
        body: "This is learning data, not a grade.",
        actions: CONFIDENCE_OPTIONS.map((opt) => ({ id: `conf:${opt.value}`, label: `${opt.emoji} ${opt.label}` })),
      };
    }
    if (reflectionOpen) {
      return {
        kind: "exit_reflection",
        title: EXIT_REFLECTION.question,
        actions: EXIT_REFLECTION.options.map((opt) => ({ id: `reflect:${opt}`, label: opt })),
      };
    }
    if (followUp) {
      return {
        kind: "after_answer",
        title: followUp,
        actions: [
          { id: "after:continue", label: "Continue", primary: true },
          { id: "after:example", label: "Another example" },
          { id: "after:simpler", label: "Explain simpler" },
          { id: "after:ask", label: "Ask again" },
        ],
      };
    }
    return null;
  }, [
    recapOpen,
    thinkingPauseText,
    middleQuestionOpen,
    middleFeedback,
    confidenceOpen,
    reflectionOpen,
    followUp,
    SECTION_RECAPS,
    MIDDLE_QUESTION,
    CONFIDENCE_OPTIONS,
    EXIT_REFLECTION,
  ]);

  const onEngagementAction = useCallback(
    (actionId: string) => {
      const [group, value] = actionId.split(/:(.+)/);
      switch (group) {
        case "recap":
          resumeAfterInterjection();
          break;
        case "pause":
          handleThinkingPause(value as "continue" | "repeat" | "help");
          break;
        case "middle":
          if (!middleFeedback) handleMiddleAnswer(value);
          break;
        case "conf": {
          const opt = CONFIDENCE_OPTIONS.find((o) => o.value === value);
          if (opt) handleConfidence(opt);
          break;
        }
        case "reflect":
          handleReflection(value);
          break;
        case "after":
          setFollowUp(null);
          if (value === "ask") handleAskQuestion();
          else handleQuickAction(value === "continue" ? "Continue" : value === "example" ? "Give example" : "Explain simpler");
          break;
      }
    },
    [
      resumeAfterInterjection,
      handleThinkingPause,
      handleMiddleAnswer,
      middleFeedback,
      handleConfidence,
      handleReflection,
      handleAskQuestion,
      handleQuickAction,
      CONFIDENCE_OPTIONS,
    ],
  );

  if (!started) {
    // Resume prompt if there's saved progress
    if (savedProgress?.exists && savedProgress.progress && savedProgress.progress > 5) {
      const sectionLabel = LESSON_PLAN_SECTIONS.find(s => s.key === savedProgress.section)?.label ?? savedProgress.section ?? "Unknown";
      return (
        <div className="vc-resume-overlay">
          <div className="vc-resume-card">
            <div className="vc-resume-icon">📚</div>
            <div className="vc-resume-title">Continue Your Lesson?</div>
            <div className="vc-resume-subtitle">
              You were working on <strong>{LESSON_TITLE}</strong> last time.
            </div>
            <div className="vc-resume-details">
              <div className="vc-resume-detail">
                <span className="vc-resume-detail-value">{savedProgress.progress}%</span>
                <span className="vc-resume-detail-label">Progress</span>
              </div>
              <div className="vc-resume-detail">
                <span className="vc-resume-detail-value">{sectionLabel}</span>
                <span className="vc-resume-detail-label">Section</span>
              </div>
            </div>
            <div className="vc-resume-actions">
              <button className="vc-resume-btn vc-resume-btn-primary" onClick={handleResumeLesson}>
                ▶ Resume Lesson
              </button>
              <button className="vc-resume-btn vc-resume-btn-secondary" onClick={handleStartFresh}>
                🔄 Start Over
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="vc-start-screen">
        <div className="vc-start-card">
          <div className="vc-start-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Live Classroom
          </div>
          <h1 className="vc-start-title">{LESSON_TITLE}</h1>
          <p className="vc-start-narrative">{LESSON_OPENING_NARRATIVE}</p>

          {/* Lesson goal + why it matters — the learner knows what success looks like */}
          <div className="vc-start-goal">
            <div className="vc-start-goal-row">
              <span className="vc-start-goal-icon">🎯</span>
              <div>
                <div className="vc-start-goal-label">Lesson goal</div>
                <div className="vc-start-goal-text">{lesson.lessonGoal}</div>
              </div>
            </div>
            <div className="vc-start-goal-row">
              <span className="vc-start-goal-icon">💡</span>
              <div>
                <div className="vc-start-goal-label">Why this matters</div>
                <div className="vc-start-goal-text">{lesson.whyItMatters}</div>
              </div>
            </div>
          </div>
          <div className="vc-start-meta">
            <span className="vc-start-meta-item">{INSTITUTION}</span>
            <span className="vc-start-meta-item">{COURSE}</span>
            <span className="vc-start-meta-item">{LESSON_SUBJECT}</span>
            <span className="vc-start-meta-item">~{estimatedMinutes} min</span>
          </div>
          <div className="vc-start-meta" style={{ marginBottom: 16 }}>
            {LEARNING_MODES.slice(0, 4).map((m) => (
              <button
                key={m.value}
                className="vc-start-meta-item"
                style={{
                  cursor: "pointer",
                  border: learningMode === m.value ? "1px solid #3b82f6" : "1px solid #334155",
                  color: learningMode === m.value ? "#60a5fa" : "#94a3b8",
                  background: learningMode === m.value ? "rgba(59,130,246,0.15)" : "#0f172a",
                }}
                onClick={() => setLearningMode(m.value)}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          <button className="vc-start-btn" onClick={handleStartLesson}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Lesson
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────
  // Render: Main Classroom
  // ──────────────────────────────────────────────────────

  const currentItem = sequence[currentIndex];

  const isSpeaking =
    teacherState === "speaking" ||
    teacherState === "explaining" ||
    teacherState === "answering" ||
    teacherState === "reading";

  const stateColors: Record<string, { bg: string; text: string }> = {
    preparing: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
    writing: { bg: "rgba(124,58,237,0.15)", text: "#a78bfa" },
    speaking: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    explaining: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
    listening: { bg: "rgba(234,179,8,0.15)", text: "#facc15" },
    thinking: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
    asking_question: { bg: "rgba(249,115,22,0.15)", text: "#fb923c" },
    paused: { bg: "rgba(148,163,184,0.15)", text: "#94a3b8" },
    answering: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    encouraging: { bg: "rgba(34,197,94,0.15)", text: "#4ade80" },
    warning: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
    correcting: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  };

  const stateLabel = teacherState.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="vc-root">
      {/* ── Top Bar ──────────────────────────────────────── */}
      <ClassroomTopBar
        institution={INSTITUTION}
        course={COURSE}
        subject={LESSON_SUBJECT}
        title={LESSON_TITLE}
        progress={progress}
        phase={phase}
        equation={LESSON_EQUATION}
        courseType={LESSON_COURSE_TYPE}
        clock={clock}
        learningMode={learningMode}
        onOpenSettings={() => setModeSelectorOpen(true)}
        onOpenNotes={() => setNotesOpen(true)}
        onOpenTranscript={() => setTranscriptOpen(true)}
        onEndLesson={handleEndLesson}
      />

      {/* ── Main Layout ──────────────────────────────────── */}
      <div className="vc-main">
        {/* ── Teacher Panel (26%) ─────────────────────────── */}
        <div className="vc-teacher-panel">
          {/* Panel header — teacher presence */}
          <div className="vc-panel-header">
            <span className="vc-panel-header-title">Your Teacher</span>
            <span className="vc-panel-header-status">
              <span className="vc-panel-header-dot" />
              Online
            </span>
          </div>

          {/* Video / portrait frame */}
          <div className="vc-teacher-frame">
            <div className="vc-teacher-frame-inner">
              {TEACHER_VIDEO ? (
                /* Real teacher → their video feed plays here */
                <video
                  src={TEACHER_VIDEO}
                  className="vc-teacher-image-real"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                /* Lesson teacher → a portrait matched to the lesson's voice */
                <img
                  src={TEACHER_IMAGE}
                  alt={TEACHER_NAME}
                  className="vc-teacher-image-real"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector(".vc-teacher-image-placeholder")) {
                      const fallback = document.createElement("div");
                      fallback.className = "vc-teacher-image-placeholder";
                      fallback.textContent = TEACHER_NAME.slice(0, 2).toUpperCase();
                      parent.appendChild(fallback);
                    }
                  }}
                />
              )}

              {/* Speaking Ring */}
              <div className={`vc-speaking-ring ${isSpeaking ? "vc-speaking-ring-active" : ""}`} />

              {/* Live presence badge */}
              <div className="vc-teacher-badge">
                <span className="vc-teacher-badge-dot" />
                Live
              </div>

              <div className={`vc-teacher-voice-indicator ${isSpeaking ? "vc-teacher-voice-indicator-active" : ""}`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                </svg>
                Speaking
              </div>
            </div>
          </div>

          {/* Teacher identity — name, subject subtitle, live status */}
          <div className="vc-teacher-identity">
            <div className="vc-teacher-name-row">
              <span className="vc-teacher-name">{TEACHER_NAME}</span>
            </div>
            <div className="vc-teacher-subtitle">{LESSON_SUBJECT} Teacher</div>
            <div className="vc-teacher-live-status">
              <span
                className="vc-teacher-live-dot"
                style={{ background: stateColors[teacherState]?.text ?? "#16a34a" }}
              />
              {stateLabel}
            </div>
          </div>

          {/* Three mini status cards — Voice / Captions / Listening */}
          <div className="vc-mini-cards">
            <div className={`vc-mini-card ${isSpeaking ? "vc-mini-card-on" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
              </svg>
              <span>Voice Active</span>
            </div>
            <div className={`vc-mini-card ${captionsOn || learningMode === "deaf" ? "vc-mini-card-on" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="18" x2="12" y2="21" />
              </svg>
              <span>Captions On</span>
            </div>
            <div className={`vc-mini-card ${isListening || teacherState === "listening" ? "vc-mini-card-on" : ""}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12a10 10 0 0 1 20 0" />
                <path d="M5 12a7 7 0 0 1 14 0" />
                <path d="M8 12a4 4 0 0 1 8 0" />
              </svg>
              <span>Listening</span>
            </div>
          </div>

          {/* Step Info */}
          <div className="vc-teacher-step-info">
            <div className="vc-teacher-step-top">
              <span className="vc-teacher-step-label">Current Step</span>
              <span className="vc-teacher-step-count">{currentIndex + 1} of {sequence.length}</span>
            </div>
            <span className="vc-teacher-step-value">
              {currentItem ? currentItem.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—"}
            </span>
            <div className="vc-teacher-step-bar">
              <div className="vc-teacher-step-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Lesson Plan Mini Timeline */}
          <CourseOutline
            course={COURSE}
            lessonTitle={LESSON_TITLE}
            sections={LESSON_PLAN_SECTIONS}
            currentSection={currentSection}
            canRevisit={(key) => SECTION_START_INDEX[key] !== undefined}
            onRevisit={jumpToSection}
          />

          {/* Raise Hand Status */}
          {raiseHand === "raised" && (
            <div className="vc-raise-hand-status">
              <span className="vc-raise-hand-status-dot" />
              Hand raised — waiting for teacher...
            </div>
          )}
          {raiseHand === "acknowledged" && (
            <div className="vc-raise-hand-status vc-raise-hand-status-ok">
              👋 Teacher sees your hand!
            </div>
          )}

          {/* Quick Help — 2×2 one-tap actions */}
          <div className="vc-quick-help">
            <div className="vc-quick-help-title">Quick Help</div>
            <div className="vc-quick-help-grid">
              <button className="vc-quick-help-btn" onClick={handleAskQuestion}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Ask Question
              </button>
              <button className="vc-quick-help-btn" onClick={handleReplayStep}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Repeat Step
              </button>
              <button className="vc-quick-help-btn" onClick={() => handleQuickAction("Explain simpler")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18h6" /><path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
                </svg>
                Explain Simpler
              </button>
              <button className="vc-quick-help-btn vc-quick-help-btn-amber" onClick={() => handleQuickAction("Give example")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" /><path d="M9 21V9" />
                </svg>
                Another Example
              </button>
            </div>
          </div>
        </div>

        {/* ── Whiteboard Area (74%) ──────────────────────── */}
        <div className="vc-whiteboard-area">
          {/* Current goal banner — keeps the learner focused on the now */}
          <div className="vc-current-goal">
            <span className="vc-current-goal-icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="vc-current-goal-label">Current Goal:</span>
            <span className="vc-current-goal-text">
              {SECTION_GOALS[currentSection] ?? "Follow along with the teacher."}
            </span>
            <span className="vc-current-goal-info" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </span>
          </div>
          <div className="vc-board-row">
          <div className="vc-whiteboard">
            {/* Whiteboard Header */}
            <div className="vc-whiteboard-header">
              <div className="vc-whiteboard-header-left">
                <span className="vc-whiteboard-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="3" y="4" width="18" height="14" rx="2" />
                    <line x1="3" y1="20" x2="21" y2="20" />
                  </svg>
                  Learning Whiteboard
                </span>
                <span className="vc-whiteboard-sep">·</span>
                <span className="vc-whiteboard-section">
                  {LESSON_PLAN_SECTIONS.find((s) => s.key === currentSection)?.label ?? "Lesson"}
                </span>
                <span className="vc-whiteboard-sep">·</span>
                {isWriting ? (
                  <span className="vc-whiteboard-writing-indicator">
                    <span className="vc-whiteboard-writing-dot" />
                    Writing…
                  </span>
                ) : (
                  <span className="vc-whiteboard-count">
                    {writtenLines.length} of {sequence.length} items
                  </span>
                )}
              </div>
              <div className="vc-whiteboard-header-right">
                <button className="vc-board-tool-btn" onClick={handleReplayStep}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Replay This Item
                </button>
                <button
                  className="vc-board-tool-btn"
                  onClick={() => {
                    const last = writtenLines[writtenLines.length - 1];
                    if (last && learningMode !== "deaf") speak(`On the board: ${last.boardText}. ${last.teacherExplanation ?? ""}`, undefined, undefined, TEACHER_VOICE);
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                  </svg>
                  Describe Board
                </button>
                <div className="vc-board-zoom">
                  <button className="vc-board-zoom-btn" aria-label="Zoom out">−</button>
                  <span className="vc-board-zoom-val">100%</span>
                  <button className="vc-board-zoom-btn" aria-label="Zoom in">+</button>
                </div>
              </div>
            </div>

            <div className="vc-board-stage">
            {/* Vertical tool strip (decorative — matches reference) */}
            <div className="vc-board-toolstrip" aria-hidden>
              <span className="vc-board-tool vc-board-tool-active">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
              </span>
              <span className="vc-board-tool">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
              </span>
              <span className="vc-board-tool">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </span>
              <span className="vc-board-tool">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
              </span>
              <span className="vc-board-tool">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
              </span>
            </div>

            {/* Whiteboard Content */}
            <div className="vc-whiteboard-content" ref={boardRef}>
              {writtenLines.length === 0 && !isWriting && (
                <div className="vc-whiteboard-empty">
                  The whiteboard is ready. The teacher will start writing shortly...
                </div>
              )}

              {writtenLines.map((item, idx) => (
                <BoardLine
                  key={item.id}
                  item={item}
                  lineIndex={idx + 1}
                  isActive={idx === writtenLines.length - 1 && !isWriting}
                  courseType={LESSON_COURSE_TYPE}
                />
              ))}

              {/* Currently writing line */}
              {isWriting && currentWritingText && (
                <div className="vc-board-line vc-board-line-active">
                  <span className="vc-board-line-number">{writtenLines.length + 1}</span>
                  <div className="vc-handwriting-container">
                    <span className="vc-handwriting-text">
                      {currentWritingText}
                    </span>
                    <MarkerPen />
                  </div>
                </div>
              )}
            </div>

            {/* Markers + eraser resting in the board's tray */}
            <div className="vc-whiteboard-tray" aria-hidden>
              <span className="vc-tray-marker vc-tray-marker-blue" />
              <span className="vc-tray-marker vc-tray-marker-black" />
              <span className="vc-tray-marker vc-tray-marker-red" />
              <span className="vc-tray-eraser" />
            </div>
            </div>{/* /vc-board-stage */}
          </div>
          {/* Smaller right section — lesson visuals (graphs / diagrams /
              illustrations) and live bullet summaries of what's on the board.
              The classroom decides the content automatically from the subject. */}
          <SubjectVisual
            courseType={LESSON_COURSE_TYPE}
            isDemo={lesson.lessonId === "demo"}
            keyPoints={boardKeyPoints}
            lessonTitle={LESSON_TITLE}
            currentGoal={SECTION_GOALS[currentSection]}
          />
          </div>
        </div>
      </div>

      {/* ── Inline engagement area (replaces engagement popups) ──────────
          The teacher's checks, recaps, hints, and after-answer prompts render
          here — non-modal, screen-reader announced, keyboard friendly. */}
      <InlineEngagementArea
        prompt={engagement}
        learningMode={learningMode}
        onAction={onEngagementAction}
      />

      {/* ── Caption Bar ──────────────────────────────────── */}
      {(captionsOn || learningMode === "deaf") && (
      <div className={`vc-caption-bar vc-cap-${captionSize}`}>
        <div className="vc-caption-bar-inner">
          <span className="vc-caption-badge">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
            {captionSpeaker}
          </span>
          {captionText ? (
            <span className="vc-caption-text">{captionText}</span>
          ) : (
            <span className="vc-caption-empty">Captions will appear here</span>
          )}
        </div>
        <div className="vc-caption-footer">
          <span>
            <span className="vc-caption-footer-label">Captions</span>
            <span className="vc-caption-footer-link">English</span>
          </span>
          <span>
            <span className="vc-caption-footer-label">Speed</span>
            <span className="vc-caption-footer-link">1.0x</span>
          </span>
        </div>
      </div>
      )}

      {/* ── Bottom Controls — four labelled clusters (matches reference) ── */}
      <div className="vc-controls">
        {/* Lesson Controls */}
        <div className="vc-control-cluster">
          <span className="vc-cluster-label">Lesson Controls</span>
          <div className="vc-cluster-row">
            <button className="vc-ctl" onClick={handleReplay} title="Previous / replay from start">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="11 19 2 12 11 5 11 19" /><polygon points="22 19 13 12 22 5 22 19" /></svg>
              <span>Previous</span>
            </button>
            <button className="vc-ctl vc-ctl-primary" onClick={handlePause}>
              {isPaused ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              )}
              <span>{isPaused ? "Play" : "Pause"}</span>
            </button>
            <button className="vc-ctl" onClick={resumeAfterInterjection} title="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 5 22 12 13 19 13 5" /><polygon points="2 5 11 12 2 19 2 5" /></svg>
              <span>Next</span>
            </button>
            <button className="vc-ctl" onClick={handleReplayStep}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
              <span>Replay Step</span>
            </button>
          </div>
        </div>

        <div className="vc-controls-divider" />

        {/* Help & Interaction */}
        <div className="vc-control-cluster">
          <span className="vc-cluster-label">Help &amp; Interaction</span>
          <div className="vc-cluster-row">
            <button className="vc-ctl" onClick={handleAskQuestion}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              <span>Ask Question</span>
            </button>
            <button
              className={`vc-ctl ${raiseHand !== "idle" ? "vc-ctl-active" : ""}`}
              onClick={() => {
                if (raiseHand === "idle") {
                  setRaiseHand("raised");
                  setResults((prev) => ({ ...prev, raisedHands: prev.raisedHands + 1 }));
                  logEvent("Learner raised hand");
                  addTranscript("system", "Learner raised hand");
                  raiseHandTimersRef.current.push(
                    setTimeout(() => {
                      setRaiseHand("acknowledged");
                      setCaptionText("I see your hand! Let me finish this step, then I'll take your question.");
                      addTranscript("teacher", "I see your hand! What would you like to ask?");
                      raiseHandTimersRef.current.push(
                        setTimeout(() => {
                          setRaiseHand("resolved");
                          handleAskQuestion();
                        }, 3000),
                      );
                    }, 2000),
                  );
                } else {
                  raiseHandTimersRef.current.forEach(clearTimeout);
                  raiseHandTimersRef.current = [];
                  setRaiseHand("idle");
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
              <span>{raiseHand === "idle" ? "Raise Hand" : raiseHand === "raised" ? "Raised…" : "Hand Seen"}</span>
            </button>
            <button className="vc-ctl vc-ctl-danger-soft" onClick={() => handleQuickAction("I don't understand")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              <span>I Don't Understand</span>
            </button>
            <button className="vc-ctl vc-ctl-amber" onClick={() => handleQuickAction("Give example")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" /></svg>
              <span>Another Example</span>
            </button>
          </div>
        </div>

        <div className="vc-controls-divider" />

        {/* Learning Support */}
        <div className="vc-control-cluster">
          <span className="vc-cluster-label">Learning Support</span>
          <div className="vc-cluster-row">
            <button
              className={`vc-ctl ${captionsOn || learningMode === "deaf" ? "vc-ctl-active" : ""}`}
              onClick={() => setCaptionsOn((v) => !v)}
              disabled={learningMode === "deaf"}
              aria-pressed={captionsOn || learningMode === "deaf"}
              title={learningMode === "deaf" ? "Captions are always on in Deaf mode" : captionsOn ? "Hide captions" : "Show captions"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="18" x2="12" y2="21" /></svg>
              <span>Captions</span>
            </button>
            <button className={`vc-ctl ${notesOpen ? "vc-ctl-active" : ""}`} onClick={() => setNotesOpen(!notesOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              <span>Notes</span>
            </button>
            <button className={`vc-ctl ${transcriptOpen ? "vc-ctl-active" : ""}`} onClick={() => setTranscriptOpen(!transcriptOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              <span>Transcript</span>
            </button>
            <button className="vc-ctl" onClick={() => setModeSelectorOpen(!modeSelectorOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
              <span>Learning Mode</span>
            </button>
            <button className="vc-ctl" title="Playback speed">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 15 13" /></svg>
              <span>Speed 1.0x</span>
            </button>
          </div>
        </div>

        <div className="vc-controls-divider" />

        {/* Session */}
        <div className="vc-control-cluster">
          <span className="vc-cluster-label">Session</span>
          <div className="vc-cluster-row">
            <button className="vc-ctl vc-ctl-end" onClick={handleEndLesson}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)" /></svg>
              <span>End Lesson</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Notes Drawer ─────────────────────────────────── */}
      <Drawer open={notesOpen} onClose={() => setNotesOpen(false)} title="Lesson Notes">
        <div className="vc-drawer-actions">
          <button className="vc-drawer-action-btn" onClick={() => {
            const blob = new Blob([FULL_LEARNER_NOTES], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${LESSON_TITLE} - Notes.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
        <div className="vc-drawer-content">{FULL_LEARNER_NOTES}</div>
      </Drawer>

      {/* ── Transcript Drawer ────────────────────────────── */}
      <Drawer
        open={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}
        title="Lesson Transcript"
      >
        <div className="vc-drawer-content" style={{ fontFamily: "system-ui, sans-serif" }}>
          {transcript.length === 0 ? (
            <div style={{ color: "#64748b", fontStyle: "italic" }}>
              Transcript will populate as the lesson progresses...
            </div>
          ) : (
            transcript.map((entry) => (
              <div
                key={entry.id}
                style={{
                  marginBottom: 12,
                  padding: "8px 12px",
                  background:
                    entry.role === "board"
                      ? "rgba(124,58,237,0.1)"
                      : entry.role === "student"
                        ? "rgba(59,130,246,0.1)"
                        : entry.role === "system"
                          ? "rgba(148,163,184,0.1)"
                          : "transparent",
                  borderRadius: 8,
                  borderLeft:
                    entry.role === "board"
                      ? "3px solid #7c3aed"
                      : entry.role === "student"
                        ? "3px solid #3b82f6"
                        : entry.role === "system"
                          ? "3px solid #94a3b8"
                          : "3px solid #22c55e",
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color:
                      entry.role === "board"
                        ? "#a78bfa"
                        : entry.role === "student"
                          ? "#60a5fa"
                          : entry.role === "system"
                            ? "#94a3b8"
                            : "#4ade80",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {entry.role === "board" ? "📋 Board" :
                   entry.role === "student" ? "🙋 Learner" :
                   entry.role === "system" ? "⚙️ System" :
                   "👩‍🏫 Teacher"}
                  <span style={{ marginLeft: 8, fontWeight: 400, color: "#64748b" }}>
                    {entry.timestamp}
                  </span>
                </div>
                <div style={{ color: "#cbd5e1", fontSize: "0.82rem" }}>{entry.text}</div>
              </div>
            ))
          )}
        </div>
      </Drawer>

      {/* ── Question Modal ───────────────────────────────── */}
      {questionOpen && (
        <QuestionModal
          learningMode={learningMode}
          questionText={questionText}
          setQuestionText={setQuestionText}
          isListening={isListening}
          onToggleMic={toggleMic}
          onSubmit={handleSubmitQuestion}
          onClose={() => setQuestionOpen(false)}
          onQuickAction={handleQuickAction}
          clarify={clarify}
        />
      )}

      {/* ── Practice Panel ───────────────────────────────── */}
      {practiceOpen && (
        <div className="vc-practice-overlay" onClick={(e) => e.target === e.currentTarget && setPracticeOpen(false)}>
          <div className={`vc-practice-card ${practiceMode === "guided" ? "vc-practice-guided" : "vc-practice-independent"}`}>
            <div className="vc-practice-badge">
              {practiceMode === "guided" ? "🤝 Guided Practice" : "📝 Independent Practice"}
            </div>
            <div className="vc-practice-problem">
              {practiceProblems[practiceIndex]?.equation ?? ""}
            </div>
            <div className="vc-practice-question">
              {practiceProblems[practiceIndex]?.question ?? ""}
            </div>
            <input
              className="vc-practice-input"
              placeholder="Type your answer (e.g. 2, 5)"
              value={practiceAnswer}
              onChange={(e) => setPracticeAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePracticeSubmit()}
              autoFocus
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="vc-question-action vc-question-action-primary" onClick={handlePracticeSubmit}>
                Submit Answer
              </button>
              <button
                className="vc-question-action vc-question-action-secondary"
                onClick={() => {
                  const problem = practiceProblems[practiceIndex];
                  const max = problem?.hints.length ?? 0;
                  if (hintLevel < max) {
                    setHintLevel((h) => h + 1);
                    setResults((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
                    logEvent(`Hint ${hintLevel + 1} used: ${problem?.equation}`);
                  }
                }}
                disabled={hintLevel >= (practiceProblems[practiceIndex]?.hints.length ?? 0)}
              >
                💡 {hintLevel === 0 ? "Show hint" : "Next hint"}
              </button>
              <button className="vc-question-action vc-question-action-secondary" onClick={() => setPracticeOpen(false)}>
                Skip
              </button>
            </div>

            {/* Progressive hints — guidance before answers */}
            {hintLevel > 0 && (
              <div className="vc-hint-box">
                {practiceProblems[practiceIndex]?.hints.slice(0, hintLevel).map((h, i) => (
                  <div key={i} className="vc-hint-item">
                    <span className="vc-hint-level">Hint {i + 1}</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {practiceFeedback && (
              <div className={`vc-practice-feedback ${practiceFeedback === "correct" ? "vc-practice-feedback-correct" : "vc-practice-feedback-incorrect"}`}>
                {practiceFeedbackText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Exit Ticket ──────────────────────────────────── */}
      {exitTicketOpen && EXIT_TICKET_QUESTION && (
        <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && setExitTicketOpen(false)}>
          <div className="vc-exit-ticket-card">
            <div className="vc-exit-badge">🎫 Exit Ticket</div>
            <div className="vc-question-title">{EXIT_TICKET_QUESTION.question}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EXIT_TICKET_QUESTION.options.map((opt, i) => (
                <button
                  key={i}
                  className={`vc-question-action vc-question-action-secondary ${
                    exitTicketAnswer === opt
                      ? exitTicketFeedback === "correct"
                        ? "vc-practice-feedback-correct"
                        : exitTicketFeedback === "incorrect"
                          ? "vc-practice-feedback-incorrect"
                          : ""
                      : ""
                  }`}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => handleExitTicketSubmit(opt)}
                  disabled={exitTicketFeedback !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
            {exitTicketFeedback && (
              <div
                className={`vc-practice-feedback ${exitTicketFeedback === "correct" ? "vc-practice-feedback-correct" : "vc-practice-feedback-incorrect"}`}
                style={{ marginTop: 12 }}
              >
                {exitTicketFeedback === "correct"
                  ? EXIT_TICKET_QUESTION.feedbackCorrect
                  : EXIT_TICKET_QUESTION.feedbackIncorrect}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Completion Summary ───────────────────────────── */}
      {completionOpen && (
        <div className="vc-completion-overlay">
          <div className="vc-completion-card">
            <div className="vc-completion-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="vc-completion-title">That brings us to the end of today's lesson</div>
            <div className="vc-completion-subtitle">{LESSON_TITLE}</div>

            {/* Takeaway Score Card */}
            {takeawayScore !== null && (
              <div style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(59,130,246,0.15) 100%)",
                border: "2px solid rgba(34,197,94,0.3)",
                borderRadius: 0,
                padding: "16px",
                marginBottom: "16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Lesson Takeaway</div>
                <div style={{
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  background: "linear-gradient(120deg, #34d399, #60a5fa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: 4,
                }}>
                  {takeawayScore}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 500 }}>out of 100</div>
                <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 8, lineHeight: 1.4 }}>
                  Based on practice accuracy, engagement, and efficiency.
                </div>
              </div>
            )}

            <div className="vc-completion-stats">
              <div className="vc-completion-stat">
                <div className="vc-completion-stat-value">{writtenLines.length}</div>
                <div className="vc-completion-stat-label">Board Steps</div>
              </div>
              <div className="vc-completion-stat">
                <div className="vc-completion-stat-value">{results.questionsAsked}</div>
                <div className="vc-completion-stat-label">Questions Asked</div>
              </div>
              <div className="vc-completion-stat">
                <div className="vc-completion-stat-value">{results.raisedHands}</div>
                <div className="vc-completion-stat-label">Hands Raised</div>
              </div>
              <div className="vc-completion-stat">
                <div className="vc-completion-stat-value">
                  {results.practiceCorrect}/{results.practiceAttempts}
                </div>
                <div className="vc-completion-stat-label">Practice Correct</div>
              </div>
            </div>

            {/* Learning evidence — results without exams */}
            <div className="vc-completion-evidence">
              <div className="vc-completion-evidence-title">Your learning journey</div>
              <ul className="vc-completion-evidence-list">
                <li>
                  <span>⏱️ Time on lesson</span>
                  <strong>{Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000))} min</strong>
                </li>
                <li>
                  <span>💡 Hints used</span>
                  <strong>{results.hintsUsed}</strong>
                </li>
                <li>
                  <span>📊 Confidence checks</span>
                  <strong>{results.confidenceChecks.length}</strong>
                </li>
                <li>
                  <span>🎯 Middle question</span>
                  <strong>
                    {results.middleQuestionCorrect === null
                      ? "—"
                      : results.middleQuestionCorrect
                        ? "Correct"
                        : "Reviewed"}
                  </strong>
                </li>
                {results.misconceptionsDetected > 0 && (
                  <li>
                    <span>🔍 Misconceptions caught</span>
                    <strong>{results.misconceptionsDetected}</strong>
                  </li>
                )}
              </ul>
            </div>
            <div className="vc-completion-actions">
              <button className="vc-completion-btn vc-completion-btn-primary" onClick={handleReplay}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Replay Lesson
              </button>
              <button className="vc-completion-btn vc-completion-btn-secondary" onClick={() => {
                setCompletionOpen(false);
                setNotesOpen(true);
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                View Notes
              </button>
              <button className="vc-completion-btn vc-completion-btn-secondary" onClick={() => {
                setCompletionOpen(false);
                setTranscriptOpen(true);
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                View Transcript
              </button>
              {onExit && (
                <button
                  className="vc-completion-btn vc-completion-btn-primary"
                  onClick={onExit}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Finish &amp; exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Settings panel — display, sound, captions, accessibility ── */}
      {modeSelectorOpen && (
        <SettingsPanel
          onClose={() => setModeSelectorOpen(false)}
          a11y={a11y}
          setA11y={setA11y}
          narrationOn={narrationOn}
          setNarrationOn={setNarrationOn}
          voiceSpeed={voiceSpeed}
          setVoiceSpeed={setVoiceSpeed}
          captionsOn={captionsOn}
          setCaptionsOn={setCaptionsOn}
          captionSize={captionSize}
          setCaptionSize={setCaptionSize}
          learningMode={learningMode}
          setLearningMode={setLearningMode}
        />
      )}

      {/* Engagement moments (recap, thinking pause, confidence, middle question,
          exit reflection) are no longer modal overlays — they render inline in
          the engagement area beneath the whiteboard (see <InlineEngagementArea/>),
          so they never trap or interrupt the learner. */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

/** Classroom Top Bar — matches the Klassruum reference:
 *  brand · breadcrumb  |  Live · AI Teacher · clock · progress  |  Mode · Notes · Transcript · End */
function ClassroomTopBar({
  institution,
  course,
  subject,
  title,
  progress,
  clock,
  learningMode,
  onOpenSettings,
  onOpenNotes,
  onOpenTranscript,
  onEndLesson,
}: {
  institution: string;
  course: string;
  subject: string;
  title: string;
  progress: number;
  phase: TeachingPhase;
  equation: string;
  courseType: CourseType;
  clock: string;
  learningMode: LearningMode;
  onOpenSettings: () => void;
  onOpenNotes: () => void;
  onOpenTranscript: () => void;
  onEndLesson: () => void;
}) {
  const modeLabel = LEARNING_MODES.find((m) => m.value === learningMode)?.label ?? "Standard";

  return (
    <div className="vc-top-bar">
      {/* Left — brand + breadcrumb */}
      <div className="vc-top-bar-left">
        <Link to="/" className="vc-top-bar-brand" title="Klassruum home">
          <LogoMark size={26} />
          <span className="vc-top-bar-logo">Klassruum</span>
        </Link>

        <div className="vc-top-bar-breadcrumb">
          <span>{institution}</span>
          <span className="vc-top-bar-separator">›</span>
          <span>{course}</span>
          <span className="vc-top-bar-separator">›</span>
          <span className="vc-top-bar-crumb-active">{subject || title}</span>
        </div>
      </div>

      {/* Center — live status, clock, progress */}
      <div className="vc-top-bar-center">
        <span className="vc-live-pill">
          <span className="vc-live-dot" />
          Live Lesson
        </span>
        <span className="vc-clock" title="Time in this lesson">{clock}</span>
        <div className="vc-top-bar-progress-wrap">
          <div className="vc-top-bar-progress-bar">
            <div className="vc-top-bar-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="vc-top-bar-progress-text">{progress}%</span>
        </div>
      </div>

      {/* Right — learning mode, notes, transcript, end */}
      <div className="vc-top-bar-right">
        <button className="vc-top-pill-btn vc-top-pill-mode" onClick={onOpenSettings} title="Learning mode & access">
          <span className="vc-top-pill-label">Learning Mode</span>
          <span className="vc-top-pill-value">{modeLabel}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <button className="vc-top-pill-btn" onClick={onOpenNotes} title="Lesson notes">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Notes
        </button>
        <button className="vc-top-pill-btn" onClick={onOpenTranscript} title="Lesson transcript">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <line x1="7" y1="9" x2="17" y2="9" />
            <line x1="7" y1="13" x2="13" y2="13" />
          </svg>
          Transcript
        </button>
        <button className="vc-top-end-btn" onClick={onEndLesson} title="End this lesson">
          End Lesson
        </button>
      </div>
    </div>
  );
}

/**
 * CourseOutline — the left-sidebar course navigation.
 *
 * Three collapsible levels: Course → Lesson → Sections. The learner's
 * registered course and the active lesson expand by default; the section list
 * is an auto-advancing progress outline (the lesson teaches itself through to
 * the end). Completed sections can be revisited; the learner never has to push
 * the lesson forward section by section.
 */
function CourseOutline({
  course,
  lessonTitle,
  sections,
  currentSection,
  canRevisit,
  onRevisit,
}: {
  course: string;
  lessonTitle: string;
  sections: typeof LESSON_PLAN_SECTIONS;
  currentSection: LessonSectionKey;
  canRevisit: (key: LessonSectionKey) => boolean;
  onRevisit: (key: LessonSectionKey) => void;
}) {
  const [courseOpen, setCourseOpen] = useState(true);
  const [lessonOpen, setLessonOpen] = useState(true);
  const currentIdx = sections.findIndex((s) => s.key === currentSection);
  const doneCount = Math.max(0, currentIdx);

  return (
    <nav className="vc-outline" aria-label="Course contents">
      <div className="vc-outline-title">My Course</div>

      {/* Level 1 — Course */}
      <button
        type="button"
        className={`vc-outline-course ${courseOpen ? "is-open" : ""}`}
        onClick={() => setCourseOpen((v) => !v)}
        aria-expanded={courseOpen}
      >
        <svg className="vc-outline-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="9 6 15 12 9 18" /></svg>
        <svg className="vc-outline-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
        <span className="vc-outline-course-name">{course}</span>
      </button>

      {courseOpen && (
        <div className="vc-outline-lessons">
          {/* Level 2 — Lesson (the one being taught now) */}
          <button
            type="button"
            className={`vc-outline-lesson ${lessonOpen ? "is-open" : ""} is-current`}
            onClick={() => setLessonOpen((v) => !v)}
            aria-expanded={lessonOpen}
          >
            <svg className="vc-outline-chev" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="9 6 15 12 9 18" /></svg>
            <span className="vc-outline-lesson-name">{lessonTitle}</span>
            <span className="vc-outline-lesson-count">{doneCount}/{sections.length}</span>
          </button>

          {lessonOpen && (
            <ol className="vc-outline-sections">
              {/* Level 3 — Sections (auto-advancing outline) */}
              {sections.map((sec, idx) => {
                const completed = idx < currentIdx;
                const current = sec.key === currentSection;
                const revisitable = completed && canRevisit(sec.key);
                return (
                  <li key={sec.key}>
                    <button
                      type="button"
                      className={`vc-outline-section ${completed ? "is-done" : ""} ${current ? "is-current" : ""}`}
                      disabled={!revisitable}
                      onClick={() => revisitable && onRevisit(sec.key)}
                      title={revisitable ? `Revisit ${sec.label}` : current ? "Now teaching" : "Coming up"}
                    >
                      <span className="vc-outline-mark" aria-hidden>
                        {completed ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : current ? (
                          <span className="vc-outline-playing" />
                        ) : (
                          <span className="vc-outline-pending" />
                        )}
                      </span>
                      <span className="vc-outline-section-name">{sec.label}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </nav>
  );
}

/**
 * SettingsPanel — the learner's control room.
 *
 * Big, clearly-labelled, plain-language controls so it works for a grade-one
 * child as much as a tertiary student: reading size, contrast, motion, the
 * teacher's voice (on/off + speed), captions (on/off + size) and an
 * accessibility profile. Everything applies live.
 */
function SettingsPanel({
  onClose,
  a11y,
  setA11y,
  narrationOn,
  setNarrationOn,
  voiceSpeed,
  setVoiceSpeed,
  captionsOn,
  setCaptionsOn,
  captionSize,
  setCaptionSize,
  learningMode,
  setLearningMode,
}: {
  onClose: () => void;
  a11y: AccessibilityPrefs;
  setA11y: React.Dispatch<React.SetStateAction<AccessibilityPrefs>>;
  narrationOn: boolean;
  setNarrationOn: (v: boolean) => void;
  voiceSpeed: "slow" | "normal" | "fast";
  setVoiceSpeed: (v: "slow" | "normal" | "fast") => void;
  captionsOn: boolean;
  setCaptionsOn: (v: boolean) => void;
  captionSize: "sm" | "md" | "lg";
  setCaptionSize: (v: "sm" | "md" | "lg") => void;
  learningMode: LearningMode;
  setLearningMode: (m: LearningMode) => void;
}) {
  const textScales: { value: TextScale; label: string; sample: string }[] = [
    { value: "default", label: "Normal", sample: "A" },
    { value: "large", label: "Large", sample: "A" },
    { value: "xlarge", label: "Largest", sample: "A" },
  ];
  const speeds: { value: "slow" | "normal" | "fast"; label: string }[] = [
    { value: "slow", label: "Slow" },
    { value: "normal", label: "Normal" },
    { value: "fast", label: "Fast" },
  ];
  const capSizes: { value: "sm" | "md" | "lg"; label: string }[] = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ];

  return (
    <div className="vc-settings-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="vc-settings" role="dialog" aria-label="Lesson settings">
        <div className="vc-settings-head">
          <div>
            <h2 className="vc-settings-title">Settings</h2>
            <p className="vc-settings-sub">Make the lesson comfortable for you. Changes apply right away.</p>
          </div>
          <button className="vc-settings-close" onClick={onClose} aria-label="Close settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        <div className="vc-settings-body">
          {/* Reading & display */}
          <section className="vc-set-group">
            <h3 className="vc-set-group-title">📖 Reading &amp; Display</h3>

            <div className="vc-set-row">
              <span className="vc-set-label">Text size</span>
              <div className="vc-seg">
                {textScales.map((t) => (
                  <button
                    key={t.value}
                    className={`vc-seg-btn ${a11y.textScale === t.value ? "is-on" : ""}`}
                    onClick={() => setA11y((p) => ({ ...p, textScale: t.value }))}
                  >
                    <span style={{ fontSize: t.value === "default" ? "0.9rem" : t.value === "large" ? "1.1rem" : "1.3rem", fontWeight: 800 }}>{t.sample}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="vc-set-row">
              <span className="vc-set-label">High contrast</span>
              <Toggle on={a11y.highContrast} onChange={(v) => setA11y((p) => ({ ...p, highContrast: v }))} />
            </div>

            <div className="vc-set-row">
              <span className="vc-set-label">Reduce motion</span>
              <Toggle on={a11y.reducedMotion} onChange={(v) => setA11y((p) => ({ ...p, reducedMotion: v }))} />
            </div>
          </section>

          {/* Sound & voice */}
          <section className="vc-set-group">
            <h3 className="vc-set-group-title">🔊 Sound &amp; Voice</h3>

            <div className="vc-set-row">
              <span className="vc-set-label">Teacher's voice</span>
              <Toggle on={narrationOn} onChange={setNarrationOn} />
            </div>

            <div className="vc-set-row">
              <span className="vc-set-label">Voice speed</span>
              <div className="vc-seg">
                {speeds.map((s) => (
                  <button
                    key={s.value}
                    className={`vc-seg-btn ${voiceSpeed === s.value ? "is-on" : ""}`}
                    disabled={!narrationOn}
                    onClick={() => setVoiceSpeed(s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Captions */}
          <section className="vc-set-group">
            <h3 className="vc-set-group-title">💬 Captions</h3>

            <div className="vc-set-row">
              <span className="vc-set-label">Show captions</span>
              <Toggle on={captionsOn || learningMode === "deaf"} disabled={learningMode === "deaf"} onChange={setCaptionsOn} />
            </div>

            <div className="vc-set-row">
              <span className="vc-set-label">Caption size</span>
              <div className="vc-seg">
                {capSizes.map((c) => (
                  <button
                    key={c.value}
                    className={`vc-seg-btn ${captionSize === c.value ? "is-on" : ""}`}
                    onClick={() => setCaptionSize(c.value)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Accessibility profile */}
          <section className="vc-set-group">
            <h3 className="vc-set-group-title">♿ Accessibility Profile</h3>
            <p className="vc-set-hint">Pick the way you learn best. We'll adjust the lesson for you.</p>
            <div className="vc-profile-grid">
              {LEARNING_MODES.map((m) => (
                <button
                  key={m.value}
                  className={`vc-profile-card ${learningMode === m.value ? "is-on" : ""}`}
                  onClick={() => setLearningMode(m.value)}
                >
                  <span className="vc-profile-ico">{m.icon}</span>
                  <span className="vc-profile-label">{m.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="vc-settings-foot">
          <button className="vc-settings-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

/** A large, clearly-on/off toggle switch (accessible, keyboard-operable). */
function Toggle({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className={`vc-toggle ${on ? "is-on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span className="vc-toggle-knob" />
      <span className="vc-toggle-text">{on ? "On" : "Off"}</span>
    </button>
  );
}

/**
 * Subject-aware right rail — present for every subject. The classroom decides
 * its content automatically:
 *   • demo mathematics lesson → a live graph + the worked strategy
 *   • science / technical      → an illustration slot + live key points
 *   • theory / everything else → live key points and a running summary
 * For real (non-demo) lessons the points are built from what the teacher has
 * actually written on the board, so the rail always reflects the current lesson.
 */
function SubjectVisual({
  courseType,
  isDemo,
  keyPoints,
  lessonTitle,
  currentGoal,
}: {
  courseType: CourseType;
  isDemo: boolean;
  keyPoints: string[];
  lessonTitle: string;
  currentGoal?: string;
}) {
  const meta = COURSE_TYPE_META[courseType];

  // ── Demo mathematics lesson: the original graph + worked strategy ──────────
  if (isDemo && courseType === "mathematics") {
    return (
      <aside className="vc-subject-visual">
        <div className="vc-visual-header">
          <span className="vc-visual-icon">{meta.icon}</span>
          {meta.visualTitle}
        </div>
        <MathGraph />
        <div className="vc-visual-note">
          <span className="vc-visual-note-label">Strategy</span>
          Two numbers that <strong>multiply to 6</strong> and <strong>add to 5</strong>:
          <div className="vc-visual-chips">
            <span>2 × 3 = 6</span>
            <span>2 + 3 = 5</span>
          </div>
          <div className="vc-visual-solution">Solution: x = −2 or x = −3</div>
        </div>
      </aside>
    );
  }

  // ── Every other lesson: illustration slot (science/technical) + live points ─
  const showIllustration = courseType === "science" || courseType === "technical";
  return (
    <aside className="vc-subject-visual">
      <div className="vc-visual-header">
        <span className="vc-visual-icon">{meta.icon}</span>
        {showIllustration ? "Illustration & Key Points" : "Key Points"}
      </div>

      {showIllustration && (
        <div className="vc-visual-illustration">
          <img
            src="/images/scenes/scene-1.png"
            alt={`Illustration for ${lessonTitle}`}
            onError={(e) => {
              const el = e.currentTarget.parentElement;
              if (el) el.style.display = "none";
            }}
          />
          <p>Illustration attached from the course materials for this step.</p>
        </div>
      )}

      <div className="vc-visual-points">
        <span className="vc-visual-note-label">On the board so far</span>
        {keyPoints.length > 0 ? (
          <ul className="vc-visual-point-list">
            {keyPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : (
          <p className="vc-visual-points-empty">
            {currentGoal ?? "Key points will appear here as the teacher writes."}
          </p>
        )}
      </div>
    </aside>
  );
}

/** Live parabola for y = x² + 5x + 6, with its roots highlighted. */
function MathGraph() {
  const W = 240, H = 170, padL = 24, padR = 16, padT = 12, padB = 22;
  const xMin = -5, xMax = 0, yMin = -1, yMax = 6;
  const sx = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (W - padL - padR);
  const sy = (y: number) => H - padB - ((y - yMin) / (yMax - yMin)) * (H - padT - padB);

  let d = "";
  for (let x = xMin; x <= xMax + 0.001; x += 0.25) {
    const y = x * x + 5 * x + 6;
    d += `${d ? "L" : "M"}${sx(x).toFixed(1)} ${sy(y).toFixed(1)} `;
  }

  return (
    <svg className="vc-math-graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Graph of y equals x squared plus 5 x plus 6, crossing the x-axis at minus 2 and minus 3">
      {/* grid */}
      {[-4, -3, -2, -1].map((x) => (
        <line key={`gx${x}`} x1={sx(x)} y1={padT} x2={sx(x)} y2={H - padB} className="vc-graph-grid" />
      ))}
      {[0, 2, 4].map((y) => (
        <line key={`gy${y}`} x1={padL} y1={sy(y)} x2={W - padR} y2={sy(y)} className="vc-graph-grid" />
      ))}
      {/* axes */}
      <line x1={padL} y1={sy(0)} x2={W - padR} y2={sy(0)} className="vc-graph-axis" />
      <line x1={sx(0)} y1={padT} x2={sx(0)} y2={H - padB} className="vc-graph-axis" />
      {/* curve */}
      <path d={d} className="vc-graph-curve" fill="none" />
      {/* roots */}
      <circle cx={sx(-2)} cy={sy(0)} r="4" className="vc-graph-root" />
      <circle cx={sx(-3)} cy={sy(0)} r="4" className="vc-graph-root" />
      <text x={sx(-2)} y={sy(0) + 16} className="vc-graph-label" textAnchor="middle">-2</text>
      <text x={sx(-3)} y={sy(0) + 16} className="vc-graph-label" textAnchor="middle">-3</text>
    </svg>
  );
}


/** A realistic marker pen that sits at the end of the line being written. */
function MarkerPen() {
  return (
    <svg className="vc-hand-cursor" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Writing tip (touching the board, bottom-left) */}
      <path d="M14 50 L19 45 L23 49 L18 54 Z" fill="#1d4ed8" />
      {/* Nib holder */}
      <path d="M18 46 L24 40 L29 45 L23 51 Z" fill="#475569" />
      {/* Barrel of the marker */}
      <rect x="24" y="14" width="14" height="30" rx="3" transform="rotate(45 31 29)" fill="#2563eb" />
      <rect x="27" y="16" width="5" height="26" rx="2.5" transform="rotate(45 31 29)" fill="#1e40af" opacity="0.7" />
      {/* Cap end */}
      <path d="M44 14 L52 6 L58 12 L50 20 Z" fill="#1e3a8a" />
      {/* Highlight along the barrel */}
      <rect x="26" y="15" width="2" height="26" rx="1" transform="rotate(45 31 29)" fill="#bfdbfe" opacity="0.8" />
    </svg>
  );
}

/** Board Line — the written item PLUS everything the teacher says about it,
 *  typed permanently beneath it so deaf learners and readers get the full lesson
 *  in clean, flowing notes (not chat-style messages).
 *
 *  • technical / calculation / math / science → the item is a short heading and
 *    the spoken explanation is written as a small subtitle caption under it.
 *  • theory / social → the spoken explanation is written as a flowing paragraph,
 *    the way notes appear in the course content.
 */
function BoardLine({
  item,
  lineIndex,
  isActive,
  courseType,
}: {
  item: MathTeachingItem;
  lineIndex: number;
  isActive: boolean;
  courseType: CourseType;
}) {
  const typeClass =
    item.type === "equation"
      ? "vc-board-line-equation"
      : item.type === "calculation"
        ? "vc-board-line-calculation"
        : item.type === "answer"
          ? "vc-board-line-answer"
          : item.type === "question" || item.type === "concept"
            ? "vc-board-line-question"
            : item.type === "instruction"
              ? "vc-board-line-instruction"
              : "";

  const isTheory = courseType === "social";
  // The spoken explanation, written down. Avoid repeating it when it's just the
  // board text said back (common for short instruction/heading items).
  const spoken = (item.teacherExplanation || "").trim();
  const showNote = spoken.length > 0 && spoken.toLowerCase() !== item.boardText.trim().toLowerCase();
  const why = (item.whyThisStepMatters || "").trim();
  const mistake = (item.commonMistake || "").trim();

  return (
    <div className={`vc-board-line ${typeClass} ${isActive ? "vc-board-line-active" : ""}`}>
      <span className="vc-board-line-number">{lineIndex}</span>
      <div className="vc-board-line-body">
        <span className="vc-board-line-text">{item.boardText}</span>
        {showNote && (
          <div className={isTheory ? "vc-board-note vc-board-note-paragraph" : "vc-board-note vc-board-note-caption"}>
            {spoken}
          </div>
        )}
        {why && !isTheory && (
          <div className="vc-board-note vc-board-note-why">
            <span className="vc-board-note-why-label">Why:</span> {why}
          </div>
        )}
        {mistake && (
          <div className="vc-board-note vc-board-note-mistake">
            <span className="vc-board-note-mistake-label">⚠ Watch out:</span> {mistake}
          </div>
        )}
      </div>
    </div>
  );
}

/** Generic Drawer */
function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className={`vc-drawer-overlay ${open ? "vc-drawer-overlay-open" : ""}`}
        onClick={onClose}
      />
      <div className={`vc-drawer ${open ? "vc-drawer-open" : ""}`}>
        <div className="vc-drawer-header">
          <span className="vc-drawer-title">{title}</span>
          <button className="vc-drawer-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

/** Mode-adaptive Question Modal */
function QuestionModal({
  learningMode,
  questionText,
  setQuestionText,
  isListening,
  onToggleMic,
  onSubmit,
  onClose,
  onQuickAction,
  clarify,
}: {
  learningMode: LearningMode;
  questionText: string;
  setQuestionText: (v: string) => void;
  isListening: boolean;
  onToggleMic: () => void;
  onSubmit: () => void;
  onClose: () => void;
  onQuickAction: (action: string) => void;
  /** When set, the teacher is asking the learner to clarify a vague question. */
  clarify?: { question: string; original: string; options: string[] } | null;
}) {
  /**
   * Clarification banner — shown above any mode's question UI when the teacher
   * has asked the learner to narrow down a vague question. Clicking an option
   * fills the box; "Type my question" just lets them type freely.
   */
  const clarifyBanner = clarify ? (
    <div className="vc-clarify-banner">
      <div className="vc-clarify-title">🤔 {clarify.question}</div>
      {clarify.options.length > 0 && (
        <div className="vc-clarify-options">
          {clarify.options.map((opt) => (
            <button
              key={opt}
              className="vc-clarify-option"
              onClick={() => {
                if (/type my question/i.test(opt)) {
                  setQuestionText("");
                } else {
                  setQuestionText(opt);
                  onSubmit();
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  ) : null;

  // Deaf mode: text-only with extra options
  if (learningMode === "deaf") {
    return (
      <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="vc-question-card">
          <div className="vc-question-badge">🤟 Deaf Mode</div>
          <div className="vc-question-title">Any question?</div>
          {clarifyBanner}
          <textarea
            className="vc-question-input"
            rows={3}
            placeholder="Type your question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            autoFocus
          />
          <div className="vc-question-actions">
            <button className="vc-question-action vc-question-action-primary" onClick={onSubmit}>
              Send Question
            </button>
            <button className="vc-question-action vc-question-action-secondary" onClick={() => onQuickAction("No question")}>
              No Question
            </button>
            <button className="vc-question-action vc-question-action-secondary" onClick={() => onQuickAction("Repeat")}>
              Repeat Board Step
            </button>
            <button className="vc-question-action vc-question-action-secondary" onClick={() => onQuickAction("Explain simpler")}>
              Simpler Explanation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Blind mode: voice-first with mic
  if (learningMode === "blind") {
    return (
      <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="vc-question-card">
          <div className="vc-question-badge">🎧 Blind Mode</div>
          <div className="vc-question-title">Ask your question verbally</div>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "0 0 16px" }}>
            You can ask a question now, or say "no question".
          </p>
          <div className="vc-mic-active">
            <button
              className="vc-mic-pulse"
              onClick={onToggleMic}
              style={{ background: isListening ? "#16a34a" : "#334155" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              </svg>
            </button>
            <span className="vc-mic-text">
              {isListening ? "Listening... Speak now" : "Click to start listening"}
            </span>
          </div>
          <div className="vc-question-actions" style={{ marginTop: 16 }}>
            <button className="vc-question-action vc-question-action-secondary" onClick={() => onQuickAction("No question")}>
              No Question (Continue)
            </button>
            <button className="vc-question-action vc-question-action-secondary" onClick={() => onQuickAction("Repeat")}>
              Repeat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADHD Focus mode: minimal, only essential options
  if (learningMode === "adhd_focus") {
    return (
      <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="vc-question-card">
          <div className="vc-question-badge">🎯 Focus Mode</div>
          <div className="vc-question-title">Quick Question?</div>
          <div className="vc-question-quick-actions">
            {["I don't understand", "Repeat", "Explain simpler", "Continue"].map((action) => (
              <button
                key={action}
                className="vc-question-quick-btn"
                onClick={() => onQuickAction(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Speech difficulty mode: text-only with specific actions
  if (learningMode === "speech_difficulty") {
    return (
      <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="vc-question-card">
          <div className="vc-question-badge">✍️ Speech Difficulty</div>
          <div className="vc-question-title">Type your question</div>
          <textarea
            className="vc-question-input"
            rows={2}
            placeholder="Type your question..."
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            autoFocus
          />
          <div className="vc-question-quick-actions">
            {["No Question", "Repeat", "Explain simpler", "Give example", "Continue"].map(
              (action) => (
                <button
                  key={action}
                  className="vc-question-quick-btn"
                  onClick={() => onQuickAction(action)}
                >
                  {action}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard mode: full question UI
  return (
    <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="vc-question-card">
        <div className="vc-question-badge">❓ Ask Your Teacher</div>
        <div className="vc-question-title">{clarify ? "Help me understand" : "What is your question?"}</div>
        {clarifyBanner}
        <textarea
          className="vc-question-input"
          rows={2}
          placeholder="Ask your teacher..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSubmit()}
          autoFocus
        />
        <div className="vc-question-actions">
          <button
            className="vc-question-action vc-question-action-primary"
            onClick={onSubmit}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Send
          </button>
          <button className="vc-question-action vc-question-action-secondary" onClick={onToggleMic}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            {isListening ? "Listening..." : "Mic"}
          </button>
          <button className="vc-question-action vc-question-action-secondary" onClick={() => onQuickAction("No question")}>
            No Question
          </button>
        </div>
        <div className="vc-question-quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              className="vc-question-quick-btn"
              onClick={() => onQuickAction(action)}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}