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
import {
  quadraticTeachingSequence,
  LESSON_TITLE,
  LESSON_OPENING_NARRATIVE,
  FULL_LEARNER_NOTES,
  LESSON_EQUATION,
} from "@/lib/demo-lesson-real-teacher";
import {
  LESSON_GOAL,
  LESSON_WHY_IT_MATTERS,
  PREREQUISITE_CHECK,
  SECTION_GOALS,
  SECTION_RECAPS,
  THINKING_PAUSES,
  CONFIDENCE_OPTIONS,
  MIDDLE_QUESTION,
  EXIT_REFLECTION,
  type ConfidenceOption,
} from "@/lib/lesson-teaching-moments";
import type { MathTeachingItem } from "@/lib/lesson-models";
import type { LearningMode, TeacherVideoState, TranscriptEntry } from "@/lib/types";
import { speak } from "@/lib/speech";
import { answerLearnerQuestion } from "@/lib/classroom-ai.functions";

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
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TEACHER_NAME = "Ms. Ada";
const TEACHER_IMAGE = "/images/teachers/woman.png";
const INSTITUTION = "Demo Academy";
const COURSE = "Mathematics Form 2";
const LESSON_SUBJECT = "Quadratic Equations";
const STORAGE_KEY = "klassruum_demo_progress";

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

const LESSON_COURSE_TYPE: CourseType = detectCourseType(LESSON_SUBJECT, COURSE);

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

const PRACTICE_PROBLEMS: PracticeProblem[] = [
  {
    equation: "x² + 7x + 10 = 0",
    question: "What two numbers multiply to 10 and add to 7?",
    correctAnswer: "2,5",
    hint: "Think: what pairs multiply to 10? (1,10), (2,5). Which pair adds to 7?",
    hints: [
      "Look at the constant term: 10. We need two numbers that multiply to it.",
      "Factor pairs of 10 are (1, 10) and (2, 5).",
      "Which pair adds to 7? Check: 2 + 5 = 7.",
    ],
    misconception: {
      answer: "1,10",
      note: "Good attempt — 1 and 10 multiply to 10, but they add to 11, not 7. We need both conditions to be true.",
    },
  },
  {
    equation: "x² + 6x + 8 = 0",
    question: "What two numbers multiply to 8 and add to 6?",
    correctAnswer: "2,4",
    hint: "Think: what pairs multiply to 8? (1,8), (2,4). Which pair adds to 6?",
    hints: [
      "Look at the constant term: 8. We need two numbers that multiply to it.",
      "Factor pairs of 8 are (1, 8) and (2, 4).",
      "Which pair adds to 6? Check: 2 + 4 = 6.",
    ],
    misconception: {
      answer: "1,8",
      note: "Good attempt — 1 and 8 multiply to 8, but they add to 9, not 6. We need both conditions to be true.",
    },
  },
];

const EXIT_TICKET_QUESTION = {
  question: "Which two numbers multiply to 6 and add to 5?",
  correctAnswer: "2,3",
  options: ["1, 6", "2, 3", "3, 3", "2, 4"],
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
}

export function AIVideoClassroom({ autoPlay = false }: Props) {
  // ── Core State ────────────────────────────────────────
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<TeachingPhase>("idle");
  const [teacherState, setTeacherState] = useState<TeacherVideoState>("paused");
  const [learningMode, setLearningMode] = useState<LearningMode>("standard");
  const [isPaused, setIsPaused] = useState(false);

  // ── Board State ───────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [writtenLines, setWrittenLines] = useState<MathTeachingItem[]>([]);
  const [currentWritingText, setCurrentWritingText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // ── Explanation State ─────────────────────────────────
  const [currentExplanation, setCurrentExplanation] = useState<MathTeachingItem | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // ── Caption State ─────────────────────────────────────
  const [captionText, setCaptionText] = useState("");
  const [captionSpeaker, setCaptionSpeaker] = useState("AI Teacher");

  // ── Transcript State ──────────────────────────────────
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  // ── Notes State ───────────────────────────────────────
  const [notesOpen, setNotesOpen] = useState(false);

  // ── Question State ────────────────────────────────────
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [isListening, setIsListening] = useState(false);

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

  // ── Replay State ──────────────────────────────────────
  const [replayMode, setReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);

  // ── Mode Selector State ───────────────────────────────
  const [modeSelectorOpen, setModeSelectorOpen] = useState(false);

  // ── Raise Hand State ──────────────────────────────────
  const [raiseHand, setRaiseHand] = useState<"idle" | "raised" | "acknowledged" | "resolved">("idle");

  // ── Current Lesson Section ────────────────────────────
  const [currentSection, setCurrentSection] = useState<LessonSectionKey>("welcome");

  // ── Teaching Moments State ────────────────────────────
  const [prereqOpen, setPrereqOpen] = useState(false);
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

  // Index we should resume writing from once an interjection is resolved
  const pendingNextIndexRef = useRef<number | null>(null);
  // Track which one-time interjections have already fired
  const firedInterjectionsRef = useRef<Set<string>>(new Set());

  // ── Progress ──────────────────────────────────────────
  const progress = useMemo(() => {
    if (phase === "complete" || completionOpen) return 100;
    if (phase === "exit_ticket") return 90;
    if (phase === "practice") return 70 + (practiceIndex / PRACTICE_PROBLEMS.length) * 20;
    return Math.round(((currentIndex + 1) / quadraticTeachingSequence.length) * 70);
  }, [currentIndex, phase, completionOpen, practiceIndex]);

  // Map board index to lesson section
  useEffect(() => {
    if (phase === "complete" || completionOpen) { setCurrentSection("complete"); return; }
    if (phase === "exit_ticket") { setCurrentSection("exit_ticket"); return; }
    if (phase === "practice") {
      setCurrentSection(practiceMode === "guided" ? "guided_practice" : "independent_practice");
      return;
    }
    if (currentIndex <= 0) { setCurrentSection("welcome"); return; }
    if (currentIndex <= 2) { setCurrentSection("concept"); return; }
    if (currentIndex <= 5) { setCurrentSection("worked_example"); return; }
    if (currentIndex <= 7) { setCurrentSection("summary"); return; }
    setCurrentSection("worked_example");
  }, [currentIndex, phase, completionOpen, practiceMode]);

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

  // ── Cleanup ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
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

  /** Write text letter by letter onto the board */
  const writeOnBoard = useCallback(
    (item: MathTeachingItem, seq: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("writing");
      setTeacherState("writing");
      setIsWriting(true);
      setCurrentWritingText("");
      setCaptionText("✍️ Writing on board...");
      setCaptionSpeaker("AI Teacher");

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
          setWrittenLines((prev) => [...prev, item]);
          setCurrentWritingText("");
          addTranscript("board", item.boardText, item.id);

          // Move to reading phase
          phaseTimerRef.current = setTimeout(() => readBoard(item, seq), 600);
        }
      };

      writingTimerRef.current = setTimeout(writeChar, speed);
    },
    [addTranscript],
  );

  /** Teacher reads the board text exactly */
  const readBoard = useCallback(
    (item: MathTeachingItem, seq: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("reading");
      setTeacherState("speaking");
      setCaptionText(item.exactSpokenText);
      setCaptionSpeaker("AI Teacher");
      setShowExplanation(false);
      setShowWarning(false);
      addTranscript("teacher", item.exactSpokenText, item.id);

      if (learningMode !== "deaf") {
        speak(item.exactSpokenText);
      }

      const readDuration = Math.max(item.exactSpokenText.length * 60, 2000);
      phaseTimerRef.current = setTimeout(() => explainStep(item, seq), readDuration);
    },
    [addTranscript, learningMode],
  );

  /** Teacher gives deeper narrative explanation */
  const explainStep = useCallback(
    (item: MathTeachingItem, seq: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("explaining");
      setTeacherState("explaining");
      setCurrentExplanation(item);
      setShowExplanation(true);
      setCaptionText(item.teacherExplanation);
      setCaptionSpeaker("AI Teacher");
      addTranscript("teacher", item.teacherExplanation, item.id);

      if (learningMode !== "deaf") {
        speak(item.teacherExplanation);
      }

      // Show warning if there's a common mistake
      const delay = Math.max(item.teacherExplanation.length * 50, 3000);
      phaseTimerRef.current = setTimeout(() => {
        if (item.commonMistake && seq === sequenceRef.current) {
          showWarningPhase(item, seq);
        } else if (seq === sequenceRef.current) {
          advanceToNext(seq);
        }
      }, delay);
    },
    [addTranscript, learningMode],
  );

  /** Show common mistake warning */
  const showWarningPhase = useCallback(
    (item: MathTeachingItem, seq: number) => {
      if (seq !== sequenceRef.current) return;

      setPhase("warning");
      setTeacherState("warning");
      setShowWarning(true);
      setCaptionText(`⚠️ ${item.commonMistake}`);
      setCaptionSpeaker("AI Teacher");
      addTranscript("teacher", `Warning: ${item.commonMistake}`, item.id);

      phaseTimerRef.current = setTimeout(() => advanceToNext(seq), 4000);
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
      setCaptionSpeaker("AI Teacher");
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

      if (kind === "recap" && recapKey) {
        setRecapOpen(recapKey);
        setTeacherState("explaining");
        setCaptionText("Let's quickly recap what we just covered.");
        logEvent(`Section recap shown: ${recapKey}`);
      } else if (kind === "thinking_pause") {
        const text =
          THINKING_PAUSES[nextIdx] ??
          "Take a moment to think about what we've seen so far.";
        setThinkingPauseText(text);
        setTeacherState("thinking");
        setCaptionText(text);
        if (learningMode !== "deaf") speak(text);
        logEvent("Thinking pause");
      } else if (kind === "middle_question") {
        setMiddleQuestionOpen(true);
        setMiddleFeedback(null);
        setTeacherState("asking_question");
        setCaptionText(MIDDLE_QUESTION.question);
        if (learningMode !== "deaf") speak(MIDDLE_QUESTION.question);
        logEvent("Required middle question asked");
      } else if (kind === "confidence") {
        setConfidenceOpen(true);
        setTeacherState("asking_question");
        setCaptionText("How confident are you with this so far?");
        logEvent("Confidence check shown");
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
      // Sentinel: proceed to guided practice
      phaseTimerRef.current = setTimeout(() => startPractice("guided", seq), 800);
      return;
    }
    phaseTimerRef.current = setTimeout(() => {
      if (seq === sequenceRef.current) {
        writeOnBoard(quadraticTeachingSequence[pending], seq);
      }
    }, 500);
  }, [writeOnBoard, startPractice]);

  /** Advance to next board item, inserting teaching moments at boundaries */
  const advanceToNext = useCallback(
    (seq: number) => {
      if (seq !== sequenceRef.current) return;

      const nextIdx = currentIndex + 1;
      setShowExplanation(false);
      setShowWarning(false);

      if (nextIdx >= quadraticTeachingSequence.length) {
        // End of teaching → confidence check, then guided practice
        if (!firedInterjectionsRef.current.has("confidence_final")) {
          firedInterjectionsRef.current.add("confidence_final");
          openInterjection("confidence", -1);
          return;
        }
        phaseTimerRef.current = setTimeout(() => startPractice("guided", seq), 1000);
        return;
      }

      setCurrentIndex(nextIdx);

      // ── Teaching-moment schedule (each fires once) ──────────────────
      // Concept recap before entering the worked example
      if (nextIdx === 3 && !firedInterjectionsRef.current.has("recap_concept")) {
        firedInterjectionsRef.current.add("recap_concept");
        openInterjection("recap", nextIdx, "concept");
        return;
      }
      // Thinking pause where one is defined for this index
      if (
        THINKING_PAUSES[nextIdx] &&
        !firedInterjectionsRef.current.has(`pause_${nextIdx}`)
      ) {
        firedInterjectionsRef.current.add(`pause_${nextIdx}`);
        openInterjection("thinking_pause", nextIdx);
        return;
      }
      // Required middle question around the midpoint
      if (nextIdx === 6 && !firedInterjectionsRef.current.has("middle_question")) {
        firedInterjectionsRef.current.add("middle_question");
        openInterjection("middle_question", nextIdx);
        return;
      }

      const pause = quadraticTeachingSequence[nextIdx].pauseAfter ?? 800;
      phaseTimerRef.current = setTimeout(() => {
        if (seq === sequenceRef.current) {
          writeOnBoard(quadraticTeachingSequence[nextIdx], seq);
        }
      }, pause);
    },
    [currentIndex, writeOnBoard, openInterjection, startPractice],
  );

  // ──────────────────────────────────────────────────────
  // Teaching-moment resolvers
  // ──────────────────────────────────────────────────────

  /** Prerequisite check answered → give a quick review if needed, then teach. */
  const handlePrereqAnswer = useCallback(
    (opt: (typeof PREREQUISITE_CHECK.options)[number]) => {
      setPrereqOpen(false);
      addTranscript("student", opt.label);
      logEvent(`Prerequisite check: ${opt.label}`);
      const seq = ++sequenceRef.current;

      if (opt.needsReview) {
        setTeacherState("explaining");
        setCaptionText(PREREQUISITE_CHECK.review);
        setCaptionSpeaker("AI Teacher");
        addTranscript("teacher", PREREQUISITE_CHECK.review);
        if (learningMode !== "deaf") speak(PREREQUISITE_CHECK.review);
        phaseTimerRef.current = setTimeout(() => {
          if (seq === sequenceRef.current) writeOnBoard(quadraticTeachingSequence[0], seq);
        }, 6500);
      } else {
        setTeacherState("preparing");
        setCaptionText("Great — let's begin!");
        phaseTimerRef.current = setTimeout(() => {
          if (seq === sequenceRef.current) writeOnBoard(quadraticTeachingSequence[0], seq);
        }, 1500);
      }
    },
    [addTranscript, learningMode, logEvent, writeOnBoard],
  );

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
    (opt: ConfidenceOption) => {
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
      const correct = answer === MIDDLE_QUESTION.correct;
      const isMisconception = answer === MIDDLE_QUESTION.misconception.answer;
      const text = correct
        ? MIDDLE_QUESTION.feedbackCorrect
        : isMisconception
          ? MIDDLE_QUESTION.misconception.note
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
    setCaptionSpeaker("AI Teacher");
    addTranscript("system", "Lesson started");
    addTranscript("teacher", LESSON_OPENING_NARRATIVE);

    if (learningMode !== "deaf") {
      speak(LESSON_OPENING_NARRATIVE);
    }

    ++sequenceRef.current;
    startTimeRef.current = Date.now();
    firedInterjectionsRef.current = new Set();
    pendingNextIndexRef.current = null;
    setCurrentIndex(0);
    setWrittenLines([]);
    setCurrentWritingText("");
    logEvent("Lesson started");

    // Prerequisite check before any teaching begins
    phaseTimerRef.current = setTimeout(() => setPrereqOpen(true), 4000);
  }, [addTranscript, learningMode, logEvent]);

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
    setReplayMode(true);
    setReplayIndex(0);
    setWrittenLines([]);
    setCurrentWritingText("");
    setShowExplanation(false);
    setShowWarning(false);
    setCurrentExplanation(null);
    setIsPaused(false);
    setTeacherState("preparing");
    setCaptionText("Replaying lesson from the beginning...");
    setCaptionSpeaker("AI Teacher");

    writeOnBoard(quadraticTeachingSequence[0], seq);
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
    setCaptionSpeaker("AI Teacher");

    writeOnBoard(quadraticTeachingSequence[currentIndex], seq);
  }, [currentIndex, clearTimers, writeOnBoard]);

  const handleEndLesson = useCallback(() => {
    clearTimers();
    ++sequenceRef.current;
    setPhase("complete");
    setTeacherState("paused");
    setCaptionText("");
    setCompletionOpen(true);
    addTranscript("system", "Lesson ended");
  }, [clearTimers, addTranscript]);

  // ── Question handlers ─────────────────────────────────
  const handleAskQuestion = useCallback(() => {
    setQuestionOpen(true);
    setTeacherState("listening");
    setCaptionText("What is your question?");
    setCaptionSpeaker("AI Teacher");
  }, []);

  const handleSubmitQuestion = useCallback(() => {
    const q = questionText.trim();
    if (!q) return;
    addTranscript("student", q);
    setResults((prev) => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }));
    logEvent(`Learner asked: ${q}`);
    setQuestionOpen(false);
    setQuestionText("");
    setTeacherState("thinking");
    setCaptionText("Let me think about that...");

    // Build the current classroom context and ask the AI teacher to answer
    // using only the lesson/course context (74–150 words). Falls back to a
    // context-based answer if the AI gateway is unavailable.
    const boardItem =
      writtenLines[writtenLines.length - 1]?.boardText ??
      quadraticTeachingSequence[currentIndex]?.boardText;
    const previousQuestions = transcript
      .filter((t) => t.role === "student")
      .map((t) => t.text)
      .slice(-5);

    const ask = async () => {
      try {
        const { answer } = await answerLearnerQuestion({
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
              learningMode,
              learnerLevel: COURSE,
            },
            question: q,
          },
        });
        setTeacherState("answering");
        setCaptionText(answer);
        setCaptionSpeaker("AI Teacher");
        addTranscript("teacher", answer);
        if (learningMode !== "deaf") speak(answer);
        phaseTimerRef.current = setTimeout(() => setTeacherState("speaking"), 4000);
      } catch {
        const fallback =
          "That's a great question. The key idea is that factoring means finding two numbers that satisfy BOTH conditions at once: they multiply to the constant term and add to the middle coefficient. Look back at the board and check each step against that rule.";
        setTeacherState("answering");
        setCaptionText(fallback);
        addTranscript("teacher", fallback);
        if (learningMode !== "deaf") speak(fallback);
        phaseTimerRef.current = setTimeout(() => setTeacherState("speaking"), 3000);
      }
    };
    void ask();
  }, [questionText, addTranscript, logEvent, transcript, writtenLines, currentIndex, currentSection, currentExplanation, learningMode]);

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
        setTeacherState("explaining");
        setCaptionText(
          action === "Give example"
            ? "Here's another example: x² + 5x + 6. We need numbers that multiply to 6 (the last number) and add to 5 (the middle number)."
            : "Let me put it more simply: We need two numbers. They must multiply to give the last number. They must also add to give the middle number.",
        );
        addTranscript("teacher", "Simpler explanation provided.");
        return;
      }
    },
    [addTranscript, handleReplayStep],
  );

  // ── Practice handlers ─────────────────────────────────
  const handlePracticeSubmit = useCallback(() => {
    const problem = PRACTICE_PROBLEMS[practiceIndex];
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
      if (practiceIndex < PRACTICE_PROBLEMS.length - 1) {
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
      const isCorrect = answer.replace(/\s/g, "") === EXIT_TICKET_QUESTION.correctAnswer;
      setExitTicketAnswer(answer);
      setExitTicketFeedback(isCorrect ? "correct" : "incorrect");

      addTranscript("student", answer);
      logEvent(`Exit ticket: ${answer} (${isCorrect ? "correct" : "incorrect"})`);
      if (isCorrect) {
        addTranscript("teacher", "Correct! Two and three multiply to six and add to five.");
      } else {
        addTranscript("teacher", "Good effort. The correct answer is 2 and 3: 2 × 3 = 6 and 2 + 3 = 5.");
      }

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
    setCaptionSpeaker("AI Teacher");
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
        writeOnBoard(quadraticTeachingSequence[0], seq);
      }
    }, 3000);
  }, [addTranscript, learningMode, writeOnBoard]);

  const handleStartFresh = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSavedProgress(null);
    handleStartLesson();
  }, [handleStartLesson]);

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
            AI Video Classroom
          </div>
          <h1 className="vc-start-title">{LESSON_TITLE}</h1>
          <p className="vc-start-narrative">{LESSON_OPENING_NARRATIVE}</p>

          {/* Lesson goal + why it matters — the learner knows what success looks like */}
          <div className="vc-start-goal">
            <div className="vc-start-goal-row">
              <span className="vc-start-goal-icon">🎯</span>
              <div>
                <div className="vc-start-goal-label">Lesson goal</div>
                <div className="vc-start-goal-text">{LESSON_GOAL}</div>
              </div>
            </div>
            <div className="vc-start-goal-row">
              <span className="vc-start-goal-icon">💡</span>
              <div>
                <div className="vc-start-goal-label">Why this matters</div>
                <div className="vc-start-goal-text">{LESSON_WHY_IT_MATTERS}</div>
              </div>
            </div>
          </div>
          <div className="vc-start-meta">
            <span className="vc-start-meta-item">{INSTITUTION}</span>
            <span className="vc-start-meta-item">{COURSE}</span>
            <span className="vc-start-meta-item">{LESSON_SUBJECT}</span>
            <span className="vc-start-meta-item">~25 min</span>
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

  const currentItem = quadraticTeachingSequence[currentIndex];
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
        onOpenSettings={() => setModeSelectorOpen(true)}
      />

      {/* ── Main Layout ──────────────────────────────────── */}
      <div className="vc-main">
        {/* ── AI Teacher Panel (26%) ──────────────────────── */}
        <div className="vc-teacher-panel">
          {/* Video Frame */}
          <div className="vc-teacher-frame">
            <div className="vc-teacher-frame-inner">
              {/* Teacher Image */}
              <img
                src={TEACHER_IMAGE}
                alt={`AI Teacher ${TEACHER_NAME}`}
                className="vc-teacher-image-real"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent && !parent.querySelector(".vc-teacher-image-placeholder")) {
                    const fallback = document.createElement("div");
                    fallback.className = "vc-teacher-image-placeholder";
                    fallback.textContent = "MA";
                    parent.appendChild(fallback);
                  }
                }}
              />

              {/* Speaking Ring */}
              <div className={`vc-speaking-ring ${isSpeaking ? "vc-speaking-ring-active" : ""}`} />

              {/* Badges */}
              <div className="vc-teacher-badge">
                <span className="vc-teacher-badge-dot" />
                AI Teacher
              </div>

              <div className={`vc-teacher-voice-indicator ${isSpeaking ? "vc-teacher-voice-indicator-active" : ""}`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" />
                </svg>
                Voice Active
              </div>
            </div>
          </div>

          {/* Waveform */}
          <div className={`vc-waveform ${isSpeaking ? "vc-waveform-active" : ""}`}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="vc-waveform-bar"
                style={{
                  height: isSpeaking ? undefined : "3px",
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* State Badge */}
          <div
            className="vc-state-badge"
            style={{
              background: stateColors[teacherState]?.bg ?? "rgba(148,163,184,0.15)",
              color: stateColors[teacherState]?.text ?? "#94a3b8",
            }}
          >
            <span style={{ fontSize: "0.65rem" }}>
              {teacherState === "writing" ? "✍️" :
               teacherState === "speaking" || teacherState === "explaining" ? "🗣️" :
               teacherState === "listening" ? "👂" :
               teacherState === "thinking" ? "💭" :
               teacherState === "asking_question" ? "❓" :
               teacherState === "warning" ? "⚠️" :
               teacherState === "paused" ? "⏸️" : "🎓"}
            </span>
            {stateLabel}
          </div>

          {/* Teacher Name */}
          <div className="vc-teacher-info">
            <div className="vc-teacher-name">{TEACHER_NAME}</div>
          </div>

          {/* Step Info */}
          <div className="vc-teacher-step-info">
            <span className="vc-teacher-step-label">Current Step</span>
            <span className="vc-teacher-step-value">
              {currentIndex + 1} of {quadraticTeachingSequence.length}
              {currentItem ? ` — ${currentItem.type.replace(/_/g, " ")}` : ""}
            </span>
            <div className="vc-teacher-step-bar">
              <div className="vc-teacher-step-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* Learning Mode Indicator */}
          <div className="vc-mode-indicator">
            {LEARNING_MODES.find((m) => m.value === learningMode)?.icon}{" "}
            {LEARNING_MODES.find((m) => m.value === learningMode)?.label}
          </div>

          {/* Lesson Plan Mini Timeline */}
          <div className="vc-lesson-plan">
            <div className="vc-lesson-plan-title">Lesson Plan</div>
            <div className="vc-lesson-plan-items">
              {LESSON_PLAN_SECTIONS.map((sec, idx) => {
                const sectionIdx = LESSON_PLAN_SECTIONS.findIndex(s => s.key === currentSection);
                const isCompleted = idx < sectionIdx;
                const isCurrent = sec.key === currentSection;
                const isLocked = idx > sectionIdx + 1;
                return (
                  <div key={sec.key} className={`vc-lesson-plan-item ${isCompleted ? "vc-lesson-plan-item-completed" : isCurrent ? "vc-lesson-plan-item-current" : isLocked ? "vc-lesson-plan-item-locked" : ""}`}>
                    <span className="vc-lesson-plan-dot" />
                    <span>{sec.icon} {sec.label}</span>
                    {isCompleted && <span style={{ marginLeft: "auto", fontSize: "0.65rem" }}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="vc-progress-tracker">
            <span className="vc-progress-tracker-label">Progress</span>
            <div className="vc-progress-tracker-bar">
              <div className="vc-progress-tracker-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="vc-progress-tracker-value">{progress}%</span>
          </div>

          {/* Raise Hand Status */}
          {raiseHand === "raised" && (
            <div className="vc-raise-hand-status">
              <span className="vc-raise-hand-status-dot" />
              Hand raised — waiting for teacher...
            </div>
          )}
          {raiseHand === "acknowledged" && (
            <div className="vc-raise-hand-status" style={{ color: "#4ade80", borderColor: "rgba(34,197,94,0.25)", background: "rgba(34,197,94,0.1)" }}>
              👋 Teacher sees your hand!
            </div>
          )}

          {/* Quick Controls */}
          <div className="vc-teacher-controls">
            <button className="vc-teacher-btn vc-teacher-btn-primary" onClick={handleReplayStep}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Replay
            </button>
            <button className="vc-teacher-btn" onClick={handleAskQuestion}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Ask
            </button>
          </div>
        </div>

        {/* ── Whiteboard Area (74%) ──────────────────────── */}
        <div className="vc-whiteboard-area">
          {/* Current goal banner — keeps the learner focused on the now */}
          <div className="vc-current-goal">
            <span className="vc-current-goal-icon">🎯</span>
            <span className="vc-current-goal-label">Current goal:</span>
            <span className="vc-current-goal-text">
              {SECTION_GOALS[currentSection] ?? "Follow along with the teacher."}
            </span>
          </div>
          <div className="vc-board-row">
          <div className="vc-whiteboard">
            {/* Whiteboard Header */}
            <div className="vc-whiteboard-header">
              <span className="vc-whiteboard-label">Learning Whiteboard</span>
              {isWriting && (
                <span className="vc-whiteboard-writing-indicator">
                  <span className="vc-whiteboard-writing-dot" />
                  Writing...
                </span>
              )}
              {!isWriting && writtenLines.length > 0 && (
                <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 500 }}>
                  {writtenLines.length} line{writtenLines.length !== 1 ? "s" : ""} written
                </span>
              )}
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
                />
              ))}

              {/* Currently writing line */}
              {isWriting && currentWritingText && (
                <div className="vc-board-line vc-board-line-active">
                  <span className="vc-board-line-number">{writtenLines.length + 1}</span>
                  <div className="vc-handwriting-container">
                    <span className={`vc-handwriting-text ${false ? "vc-handwriting-done" : ""}`}>
                      {currentWritingText}
                    </span>
                    <span className="vc-hand-cursor">✋</span>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation Panel */}
            {showExplanation && currentExplanation && (
              <div className="vc-explanation-panel">
                <div className="vc-explanation-section">
                  <div className="vc-explanation-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Teacher's Explanation
                  </div>
                  <div className="vc-explanation-spoken">
                    "{currentExplanation.exactSpokenText}"
                  </div>
                  <div className="vc-explanation-deep">{currentExplanation.teacherExplanation}</div>
                  {currentExplanation.whyThisStepMatters && (
                    <div className="vc-explanation-why">
                      <strong>Why this matters:</strong> {currentExplanation.whyThisStepMatters}
                    </div>
                  )}
                  <span
                    className="vc-step-type-badge"
                    style={{
                      background:
                        currentExplanation.type === "equation"
                          ? "#eff6ff"
                          : currentExplanation.type === "calculation"
                            ? "#eef2ff"
                            : currentExplanation.type === "answer"
                              ? "#f0fdf4"
                              : currentExplanation.type === "instruction"
                                ? "#faf5ff"
                                : "#f8fafc",
                      color:
                        currentExplanation.type === "equation"
                          ? "#1e40af"
                          : currentExplanation.type === "calculation"
                            ? "#4338ca"
                            : currentExplanation.type === "answer"
                              ? "#059669"
                              : currentExplanation.type === "instruction"
                                ? "#6d28d9"
                                : "#475569",
                    }}
                  >
                    {currentExplanation.type}
                  </span>
                </div>

                {showWarning && currentExplanation.commonMistake && (
                  <div className="vc-warning-banner">
                    <div className="vc-warning-header">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Common Mistake
                    </div>
                    <div className="vc-warning-text">{currentExplanation.commonMistake}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          {COURSE_TYPE_META[LESSON_COURSE_TYPE].hasVisual && (
            <SubjectVisual courseType={LESSON_COURSE_TYPE} />
          )}
          </div>
        </div>
        <ClassroomInfoRail progress={progress} results={results} currentSection={currentSection} />
      </div>

      {/* ── Caption Bar ──────────────────────────────────── */}
      <div className="vc-caption-bar">
        <div className="vc-caption-bar-inner">
          {captionText ? (
            <>
              <span className="vc-caption-speaker">{captionSpeaker}:</span>
              <span className="vc-caption-text">{captionText}</span>
            </>
          ) : (
            <span className="vc-caption-empty">Captions will appear here</span>
          )}
        </div>
      </div>

      {/* ── Bottom Controls ──────────────────────────────── */}
      <div className="vc-controls">
        {/* Lesson controls */}
        <div className="vc-controls-group">
          <button className="vc-control-btn vc-control-btn-primary" onClick={handlePause}>
            {isPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            )}
            {isPaused ? "Play" : "Pause"}
          </button>
          <button className="vc-control-btn" onClick={handleReplay}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Replay
          </button>
          <button className="vc-control-btn" onClick={handleReplayStep}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="4" x2="5" y2="20" />
            </svg>
            Step
          </button>
        </div>

        <div className="vc-controls-divider" />

        {/* Question controls */}
        <div className="vc-controls-group">
          <button className="vc-control-btn" onClick={handleAskQuestion}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Ask
          </button>
          <button
            className={`vc-control-btn vc-raise-hand-btn ${raiseHand !== "idle" ? "vc-control-btn-active" : ""}`}
            onClick={() => {
              if (raiseHand === "idle") {
                setRaiseHand("raised");
                setResults((prev) => ({ ...prev, raisedHands: prev.raisedHands + 1 }));
                logEvent("Learner raised hand");
                addTranscript("system", "Learner raised hand");
                // Auto-acknowledge after 3 seconds
                setTimeout(() => {
                  setRaiseHand("acknowledged");
                  setCaptionText("I see your hand! Let me finish this step, then I'll take your question.");
                  addTranscript("teacher", "I see your hand! What would you like to ask?");
                  setTimeout(() => {
                    setRaiseHand("resolved");
                    handleAskQuestion();
                  }, 3000);
                }, 2000);
              } else {
                setRaiseHand("idle");
              }
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>✋</span>
            {raiseHand === "idle" ? "Raise Hand" : raiseHand === "raised" ? "Raised..." : "Hand Seen"}
          </button>
          <button className="vc-control-btn" onClick={() => {
            if (learningMode !== "deaf") {
              setIsListening(!isListening);
            }
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
            Mic
          </button>
        </div>

        <div className="vc-controls-divider" />

        {/* Learning support */}
        <div className="vc-controls-group">
          <button className={`vc-control-btn ${captionText ? "vc-control-btn-active" : ""}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="18" x2="12" y2="21" />
            </svg>
            CC
          </button>
          <button className={`vc-control-btn ${notesOpen ? "vc-control-btn-active" : ""}`} onClick={() => setNotesOpen(!notesOpen)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Notes
          </button>
          <button className={`vc-control-btn ${transcriptOpen ? "vc-control-btn-active" : ""}`} onClick={() => setTranscriptOpen(!transcriptOpen)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            Transcript
          </button>
          <button className="vc-control-btn" onClick={() => setModeSelectorOpen(!modeSelectorOpen)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Mode
          </button>
        </div>

        <div className="vc-controls-divider" />

        {/* End Session */}
        <div className="vc-controls-group">
          <button className="vc-control-btn vc-control-btn-danger" onClick={handleEndLesson}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            End
          </button>
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
          setIsListening={setIsListening}
          onSubmit={handleSubmitQuestion}
          onClose={() => setQuestionOpen(false)}
          onQuickAction={handleQuickAction}
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
              {PRACTICE_PROBLEMS[practiceIndex]?.equation ?? ""}
            </div>
            <div className="vc-practice-question">
              {PRACTICE_PROBLEMS[practiceIndex]?.question ?? ""}
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
                  const problem = PRACTICE_PROBLEMS[practiceIndex];
                  const max = problem?.hints.length ?? 0;
                  if (hintLevel < max) {
                    setHintLevel((h) => h + 1);
                    setResults((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
                    logEvent(`Hint ${hintLevel + 1} used: ${problem?.equation}`);
                  }
                }}
                disabled={hintLevel >= (PRACTICE_PROBLEMS[practiceIndex]?.hints.length ?? 0)}
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
                {PRACTICE_PROBLEMS[practiceIndex]?.hints.slice(0, hintLevel).map((h, i) => (
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
      {exitTicketOpen && (
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
                  ? "Correct! Two and three multiply to six and add to five. ✅"
                  : "Good effort! The correct answer is 2 and 3: 2 × 3 = 6 and 2 + 3 = 5."}
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
            <div className="vc-completion-title">Lesson Complete!</div>
            <div className="vc-completion-subtitle">{LESSON_TITLE}</div>
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
            </div>
          </div>
        </div>
      )}

      {/* ── Learning Mode Selector ───────────────────────── */}
      {modeSelectorOpen && (
        <div className="vc-mode-selector">
          <div className="vc-mode-selector-title">Learning Mode</div>
          {LEARNING_MODES.map((mode) => (
            <button
              key={mode.value}
              className={`vc-mode-option ${learningMode === mode.value ? "vc-mode-option-active" : ""}`}
              onClick={() => {
                setLearningMode(mode.value);
                setModeSelectorOpen(false);
              }}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Prerequisite Check ───────────────────────────── */}
      {prereqOpen && (
        <div className="vc-question-overlay">
          <div className="vc-moment-card">
            <div className="vc-moment-badge vc-moment-badge-prereq">✅ Quick check before we start</div>
            <div className="vc-moment-title">{PREREQUISITE_CHECK.question}</div>
            <div className="vc-moment-options">
              {PREREQUISITE_CHECK.options.map((opt) => (
                <button
                  key={opt.value}
                  className="vc-moment-option"
                  onClick={() => handlePrereqAnswer(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="vc-moment-note">
              This isn't a test — it just helps the teacher pitch the lesson right.
            </div>
          </div>
        </div>
      )}

      {/* ── Section Recap ────────────────────────────────── */}
      {recapOpen && SECTION_RECAPS[recapOpen] && (
        <div className="vc-question-overlay">
          <div className="vc-moment-card">
            <div className="vc-moment-badge vc-moment-badge-recap">📋 {SECTION_RECAPS[recapOpen].title}</div>
            <ul className="vc-recap-list">
              {SECTION_RECAPS[recapOpen].points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <div className="vc-moment-options">
              <button className="vc-moment-option vc-moment-option-primary" onClick={resumeAfterInterjection}>
                Ready to continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Thinking Pause ───────────────────────────────── */}
      {thinkingPauseText && (
        <div className="vc-question-overlay">
          <div className="vc-moment-card">
            <div className="vc-moment-badge vc-moment-badge-pause">💭 Take a moment to think</div>
            <div className="vc-moment-title vc-moment-title-soft">{thinkingPauseText}</div>
            <div className="vc-moment-options">
              <button className="vc-moment-option vc-moment-option-primary" onClick={() => handleThinkingPause("continue")}>
                Continue
              </button>
              <button className="vc-moment-option" onClick={() => handleThinkingPause("repeat")}>
                Read again
              </button>
              <button className="vc-moment-option" onClick={() => handleThinkingPause("help")}>
                I need help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confidence Check ─────────────────────────────── */}
      {confidenceOpen && (
        <div className="vc-question-overlay">
          <div className="vc-moment-card">
            <div className="vc-moment-badge vc-moment-badge-confidence">📊 How are you feeling?</div>
            <div className="vc-moment-title">How confident are you with this so far?</div>
            <div className="vc-moment-options">
              {CONFIDENCE_OPTIONS.map((opt) => (
                <button key={opt.value} className="vc-moment-option" onClick={() => handleConfidence(opt)}>
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
            <div className="vc-moment-note">This is learning data, not a grade.</div>
          </div>
        </div>
      )}

      {/* ── Required Middle Question ─────────────────────── */}
      {middleQuestionOpen && (
        <div className="vc-question-overlay">
          <div className="vc-moment-card">
            <div className="vc-moment-badge vc-moment-badge-question">❓ Your turn</div>
            <div className="vc-moment-title">{MIDDLE_QUESTION.question}</div>
            <div className="vc-moment-options">
              {MIDDLE_QUESTION.options.map((opt) => (
                <button
                  key={opt}
                  className={`vc-moment-option ${
                    middleFeedback && opt === MIDDLE_QUESTION.correct ? "vc-moment-option-correct" : ""
                  }`}
                  onClick={() => !middleFeedback && handleMiddleAnswer(opt)}
                  disabled={!!middleFeedback}
                >
                  {opt}
                </button>
              ))}
            </div>
            {middleFeedback && (
              <div
                className={`vc-practice-feedback ${
                  middleFeedback.correct ? "vc-practice-feedback-correct" : "vc-practice-feedback-incorrect"
                }`}
                style={{ marginTop: 12 }}
              >
                {middleFeedback.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Exit Reflection ──────────────────────────────── */}
      {reflectionOpen && (
        <div className="vc-question-overlay">
          <div className="vc-moment-card">
            <div className="vc-moment-badge vc-moment-badge-reflection">🪞 One last reflection</div>
            <div className="vc-moment-title">{EXIT_REFLECTION.question}</div>
            <div className="vc-moment-options">
              {EXIT_REFLECTION.options.map((opt) => (
                <button key={opt} className="vc-moment-option" onClick={() => handleReflection(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────────────────────

/** Classroom Top Bar */
function ClassroomTopBar({
  institution,
  course,
  subject,
  progress,
  phase,
  equation,
  courseType,
  onOpenSettings,
}: {
  institution: string;
  course: string;
  subject: string;
  title: string;
  progress: number;
  phase: TeachingPhase;
  equation: string;
  courseType: CourseType;
  onOpenSettings: () => void;
}) {
  const phaseLabels: Record<TeachingPhase, { label: string; color: string; bg: string }> = {
    idle: { label: "Ready", color: "#94a3b8", bg: "rgba(148,163,184,0.15)" },
    writing: { label: "Writing", color: "#a78bfa", bg: "rgba(124,58,237,0.15)" },
    reading: { label: "Reading Board", color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
    explaining: { label: "Explaining", color: "#4ade80", bg: "rgba(34,197,94,0.15)" },
    warning: { label: "Warning", color: "#f87171", bg: "rgba(239,68,68,0.15)" },
    pausing: { label: "Checkpoint", color: "#facc15", bg: "rgba(234,179,8,0.15)" },
    asking: { label: "Question", color: "#fb923c", bg: "rgba(249,115,22,0.15)" },
    practice: { label: "Practice", color: "#c084fc", bg: "rgba(168,85,247,0.15)" },
    exit_ticket: { label: "Exit Ticket", color: "#fb923c", bg: "rgba(249,115,22,0.15)" },
    complete: { label: "Complete", color: "#4ade80", bg: "rgba(34,197,94,0.15)" },
  };

  const phaseInfo = phaseLabels[phase];
  const meta = COURSE_TYPE_META[courseType];

  return (
    <div className="vc-top-bar">
      <div className="vc-top-bar-left">
        {/* Uniform brand logo — anchored first, never displaced */}
        <Link to="/" className="vc-top-bar-brand" title="Klassruum home">
          <LogoMark size={28} />
          <span className="vc-top-bar-logo">Klassruum</span>
        </Link>

        {/* Back to dashboard — compact, sits after the brand */}
        <Link to="/student/dashboard" className="vc-back-btn" title="Back to dashboard">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span>Dashboard</span>
        </Link>

        <span className="vc-top-bar-separator">|</span>
        <div className="vc-top-bar-breadcrumb">
          <span>{institution}</span>
          <span className="vc-top-bar-separator">›</span>
          <span>{course}</span>
          <span className="vc-top-bar-separator">›</span>
          <span className="vc-top-bar-crumb-active">{subject}</span>
        </div>
      </div>

      <div className="vc-top-bar-center">
        <span className="vc-course-type-chip" title={`${meta.label} classroom`}>
          {meta.icon} {meta.label}
        </span>
        <div
          className="vc-top-bar-phase"
          style={{ background: phaseInfo.bg, color: phaseInfo.color }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: phaseInfo.color }} />
          {phaseInfo.label}
          {equation && (
            <>
              <span className="vc-top-bar-separator">·</span>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "0.7rem" }}>{equation}</span>
            </>
          )}
        </div>
        <span className="vc-autosave" title="Your progress is saved automatically">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Autosaved
        </span>
      </div>

      <div className="vc-top-bar-right">
        <div className="vc-top-bar-progress-wrap">
          <span className="vc-top-bar-progress-text">{progress}%</span>
          <div className="vc-top-bar-progress-bar">
            <div className="vc-top-bar-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button className="vc-icon-btn" onClick={onOpenSettings} title="Settings & learning access" aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Subject-aware visual panel. The system shows this automatically based on
 *  the course type: a live graph for mathematics, an illustration for science
 *  and technical subjects, and nothing for theory-only social science. */
function SubjectVisual({ courseType }: { courseType: CourseType }) {
  const meta = COURSE_TYPE_META[courseType];
  return (
    <aside className="vc-subject-visual">
      <div className="vc-visual-header">
        <span className="vc-visual-icon">{meta.icon}</span>
        {meta.visualTitle}
      </div>

      {courseType === "mathematics" && <MathGraph />}

      {(courseType === "science" || courseType === "technical") && (
        <div className="vc-visual-illustration">
          <img src="/images/scenes/scene-1.png" alt="Lesson illustration auto-attached from course materials" />
          <p>Illustration auto-attached from the course materials for this step.</p>
        </div>
      )}

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

/** Right info rail — progress, live session activity, and resources. */
function ClassroomInfoRail({
  progress,
  results,
  currentSection,
}: {
  progress: number;
  results: LearningResults;
  currentSection: LessonSectionKey;
}) {
  const sectionLabel = LESSON_PLAN_SECTIONS.find((s) => s.key === currentSection)?.label ?? "—";
  const activity = [
    { label: "Questions asked", value: results.questionsAsked, icon: "💬" },
    { label: "Hands raised", value: results.raisedHands, icon: "✋" },
    { label: "Practice attempts", value: results.practiceAttempts, icon: "✍️" },
    { label: "Hints used", value: results.hintsUsed, icon: "💡" },
  ];
  return (
    <aside className="vc-info-rail">
      <div className="vc-rail-card">
        <div className="vc-rail-title">Lesson Progress</div>
        <div className="vc-rail-progress-big">{progress}%</div>
        <div className="vc-rail-bar"><div style={{ width: `${progress}%` }} /></div>
        <div className="vc-rail-current">Now: <strong>{sectionLabel}</strong></div>
      </div>

      <div className="vc-rail-card">
        <div className="vc-rail-title">Session Activity</div>
        <ul className="vc-rail-stats">
          {activity.map((a) => (
            <li key={a.label}>
              <span>{a.icon} {a.label}</span>
              <strong>{a.value}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="vc-rail-card">
        <div className="vc-rail-title">Resources</div>
        <ul className="vc-rail-links">
          <li>📄 Lesson notes</li>
          <li>📝 Transcript</li>
          <li>📐 Formula reference</li>
        </ul>
      </div>
    </aside>
  );
}

/** Board Line */
function BoardLine({
  item,
  lineIndex,
  isActive,
}: {
  item: MathTeachingItem;
  lineIndex: number;
  isActive: boolean;
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

  return (
    <div className={`vc-board-line ${typeClass} ${isActive ? "vc-board-line-active" : ""}`}>
      <span className="vc-board-line-number">{lineIndex}</span>
      <span className="vc-board-line-text">{item.boardText}</span>
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
  setIsListening,
  onSubmit,
  onClose,
  onQuickAction,
}: {
  learningMode: LearningMode;
  questionText: string;
  setQuestionText: (v: string) => void;
  isListening: boolean;
  setIsListening: (v: boolean) => void;
  onSubmit: () => void;
  onClose: () => void;
  onQuickAction: (action: string) => void;
}) {
  // Deaf mode: text-only with extra options
  if (learningMode === "deaf") {
    return (
      <div className="vc-question-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="vc-question-card">
          <div className="vc-question-badge">🤟 Deaf Mode</div>
          <div className="vc-question-title">Any question?</div>
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
              onClick={() => setIsListening(!isListening)}
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
        <div className="vc-question-title">What is your question?</div>
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
          <button className="vc-question-action vc-question-action-secondary" onClick={() => setIsListening(!isListening)}>
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