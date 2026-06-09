import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState, forwardRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Accessibility,
  Play,
  Pause,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Subtitles,
  MessageSquare,
  Send,
  HelpCircle,
  Lightbulb,
  SkipBack,
  SkipForward,
  Download,
  Eye,
  EyeOff,
  PenTool,
  X,
  Check,
  Loader2,
  Brain,
  Sparkles,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Hand,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { speak, stopSpeech, pauseSpeech, resumeSpeech, startListening, stopListening as stopVoiceListening } from "@/lib/speech";
import type {
  VideoClassroomState,
  LearningMode,
  TeacherVideoState,
  BoardWriteItem,
  TranscriptEntry,
  WritingSpeed,
  BlindQuestionState,
  ClassroomContext,
} from "@/lib/types";

/* ─── Sample Board Sequence ──────────────────────────────────── */

const SAMPLE_BOARD_SEQUENCE: BoardWriteItem[] = [
  {
    id: "b1",
    type: "heading",
    text: "Solving Quadratic Equations",
    readExactly: true,
    accessibleDescription: "The board title is Solving Quadratic Equations.",
  },
  {
    id: "b2",
    type: "equation",
    text: "x² + 5x + 6 = 0",
    readExactly: true,
    accessibleDescription: "The board shows x squared plus five x plus six equals zero.",
  },
  {
    id: "b3",
    type: "bullet",
    text: "Find two numbers that multiply to 6.",
    readExactly: true,
    explanation: "We are looking for a factor pair of six.",
    accessibleDescription: "The instruction is to find two numbers that multiply to six.",
  },
  {
    id: "b4",
    type: "bullet",
    text: "The same numbers must add to 5.",
    readExactly: true,
    explanation: "This is because the middle term is five x.",
    accessibleDescription: "The same two numbers must also add to five.",
  },
  {
    id: "b5",
    type: "calculation",
    text: "2 × 3 = 6  and  2 + 3 = 5",
    readExactly: true,
    accessibleDescription: "Two times three equals six, and two plus three equals five.",
  },
  {
    id: "b6",
    type: "answer",
    text: "x = -2  or  x = -3",
    readExactly: true,
    accessibleDescription: "The answers are x equals negative two or x equals negative three.",
  },
];

/* ─── Lesson Step Board Maps ─────────────────────────────────── */

const STEP_BOARDS: Record<string, BoardWriteItem[]> = {
  hook: [
    { id: "h1", type: "heading", text: "Quadratic Equations", readExactly: true, accessibleDescription: "Title: Quadratic Equations." },
    { id: "h2", type: "bullet", text: "We will move from big idea to worked example.", readExactly: true, accessibleDescription: "We will move from big idea to worked example." },
    { id: "h3", type: "bullet", text: "Then practice, quiz, and summary.", readExactly: true, accessibleDescription: "Then practice, quiz, and summary." },
  ],
  concept: [
    { id: "c1", type: "heading", text: "Quadratic Form", readExactly: true, accessibleDescription: "Title: Quadratic Form." },
    { id: "c2", type: "equation", text: "ax² + bx + c = 0", readExactly: true, accessibleDescription: "a x squared plus b x plus c equals zero." },
    { id: "c3", type: "bullet", text: "a cannot be 0.", readExactly: true, accessibleDescription: "a cannot be zero." },
  ],
  worked_example: [
    { id: "w1", type: "heading", text: "Worked Example", readExactly: true, accessibleDescription: "Title: Worked Example." },
    { id: "w2", type: "equation", text: "x² - 5x + 6 = 0", readExactly: true, accessibleDescription: "x squared minus five x plus six equals zero." },
    { id: "w3", type: "calculation", text: "(x - 2)(x - 3) = 0", readExactly: true, accessibleDescription: "Open paren x minus 2 close paren times open paren x minus 3 close paren equals zero." },
    { id: "w4", type: "answer", text: "x = 2  or  x = 3", readExactly: true, accessibleDescription: "x equals 2 or x equals 3." },
  ],
  guided_practice: [
    { id: "g1", type: "heading", text: "Practice Together", readExactly: true, accessibleDescription: "Title: Practice Together." },
    { id: "g2", type: "equation", text: "x² + 7x + 12 = 0", readExactly: true, accessibleDescription: "x squared plus seven x plus twelve equals zero." },
    { id: "g3", type: "bullet", text: "Which pair works?", readExactly: true, accessibleDescription: "Which pair of numbers works?" },
    { id: "g4", type: "answer", text: "3 and 4", readExactly: true, accessibleDescription: "The answer is 3 and 4." },
  ],
  independent_question: [
    { id: "i1", type: "heading", text: "Your Turn", readExactly: true, accessibleDescription: "Title: Your Turn." },
    { id: "i2", type: "equation", text: "x² - 8x + 15 = 0", readExactly: true, accessibleDescription: "x squared minus eight x plus fifteen equals zero." },
    { id: "i3", type: "bullet", text: "Think of the pair.", readExactly: true, accessibleDescription: "Think of the pair of numbers." },
    { id: "i4", type: "bullet", text: "Write your answer.", readExactly: true, accessibleDescription: "Write your answer." },
  ],
  correction: [
    { id: "r1", type: "heading", text: "Let's Review", readExactly: true, accessibleDescription: "Title: Let's Review." },
    { id: "r2", type: "bullet", text: "We need numbers that multiply to 15.", readExactly: true, accessibleDescription: "We need numbers that multiply to fifteen." },
    { id: "r3", type: "bullet", text: "and add to -8.", readExactly: true, accessibleDescription: "and add to negative eight." },
    { id: "r4", type: "answer", text: "x = 3  or  x = 5", readExactly: true, accessibleDescription: "x equals three or x equals five." },
  ],
  quiz: [
    { id: "q1", type: "heading", text: "Quiz Time", readExactly: true, accessibleDescription: "Title: Quiz Time." },
    { id: "q2", type: "question", text: "Solve: x² - 9x + 20 = 0", readExactly: true, accessibleDescription: "Solve: x squared minus nine x plus twenty equals zero." },
    { id: "q3", type: "bullet", text: "Choose carefully.", readExactly: true, accessibleDescription: "Choose carefully." },
  ],
  summary: [
    { id: "s1", type: "heading", text: "Summary", readExactly: true, accessibleDescription: "Title: Summary." },
    { id: "s2", type: "bullet", text: "Write in standard form.", readExactly: true, accessibleDescription: "Step one: Write in standard form." },
    { id: "s3", type: "bullet", text: "Find the right pair.", readExactly: true, accessibleDescription: "Step two: Find the right pair." },
    { id: "s4", type: "bullet", text: "Factor and solve.", readExactly: true, accessibleDescription: "Step three: Factor and solve." },
  ],
};

const STEP_ORDER = ["hook", "concept", "worked_example", "guided_practice", "independent_question", "correction", "quiz", "summary"] as const;

const LEARNING_MODES: { key: LearningMode; label: string }[] = [
  { key: "standard", label: "Standard" },
  { key: "deaf", label: "Deaf / Hard of Hearing" },
  { key: "blind", label: "Blind / Low Vision" },
  { key: "low_vision", label: "Low Vision" },
  { key: "deaf_blind", label: "Deaf-Blind" },
  { key: "dyslexia", label: "Dyslexia" },
  { key: "adhd_focus", label: "ADHD / Focus" },
  { key: "motor_support", label: "Motor Support" },
  { key: "speech_difficulty", label: "Speech Difficulty" },
  { key: "extra_support", label: "Extra Support" },
  { key: "challenge", label: "Challenge" },
];

/* ─── Writing speed config ───────────────────────────────────── */

function getCharDelay(speed?: WritingSpeed, mode?: LearningMode): number {
  const base = mode === "adhd_focus" || mode === "extra_support" ? 55 : mode === "dyslexia" ? 60 : 40;
  if (speed === "slow") return base + 30;
  if (speed === "fast") return Math.max(15, base - 15);
  return base;
}

function getLinePause(mode?: LearningMode): number {
  return mode === "adhd_focus" ? 1200 : 800;
}

/* ─── Initial State ──────────────────────────────────────────── */

function createInitialState(sessionId: string, learningMode: LearningMode): VideoClassroomState {
  const firstStepKey = STEP_ORDER[0];
  return {
    sessionId,
    learningMode,
    teacherState: "preparing",
    teacherMode: "ai_teacher",
    boardState: {
      items: STEP_BOARDS[firstStepKey] ?? SAMPLE_BOARD_SEQUENCE,
      currentItemIndex: 0,
      writtenItems: [],
      isWriting: false,
      autoScroll: true,
      currentWrittenText: "",
    },
    audioState: {
      enabled: learningMode !== "deaf" && learningMode !== "deaf_blind",
      playing: false,
      rate: learningMode === "adhd_focus" || learningMode === "extra_support" ? 0.85 : 1,
      lockedOnForBlindMode: learningMode === "blind",
    },
    questionState: {
      isPromptOpen: false,
      inputMode: learningMode === "blind" ? "voice" : learningMode === "speech_difficulty" ? "quick_action" : "text",
      isListening: false,
      transcript: "",
      blindState: undefined,
    },
    replayState: { isReplayMode: false },
    captions: {
      enabled: learningMode !== "blind",
      currentText: "",
    },
    transcript: [],
    progress: {
      stepIndex: 0,
      totalSteps: STEP_ORDER.length,
      percentage: Math.round((1 / STEP_ORDER.length) * 100),
    },
  };
}

/* ─── Reducer Actions ────────────────────────────────────────── */

type Action =
  | { type: "SET_TEACHER_STATE"; state: TeacherVideoState }
  | { type: "SET_WRITING"; isWriting: boolean; currentText: string }
  | { type: "FINISH_ITEM"; item: BoardWriteItem }
  | { type: "SET_CURRENT_ITEM_INDEX"; index: number }
  | { type: "SET_BOARD_ITEMS"; items: BoardWriteItem[] }
  | { type: "SET_AUDIO_PLAYING"; playing: boolean }
  | { type: "SET_AUDIO_ENABLED"; enabled: boolean }
  | { type: "SET_CAPTION"; text: string }
  | { type: "TOGGLE_CAPTIONS" }
  | { type: "OPEN_QUESTION" }
  | { type: "CLOSE_QUESTION" }
  | { type: "SET_LISTENING"; isListening: boolean; transcript: string }
  | { type: "SET_BLIND_STATE"; blindState: BlindQuestionState | undefined }
  | { type: "ADD_TRANSCRIPT"; entry: TranscriptEntry }
  | { type: "SET_LEARNING_MODE"; mode: LearningMode }
  | { type: "SET_STEP_INDEX"; index: number }
  | { type: "START_REPLAY"; fromIndex?: number }
  | { type: "STOP_REPLAY" }
  | { type: "RESET_BOARD" }
  | { type: "SET_AUTO_SCROLL"; autoScroll: boolean };

function reducer(state: VideoClassroomState, action: Action): VideoClassroomState {
  switch (action.type) {
    case "SET_TEACHER_STATE":
      return { ...state, teacherState: action.state };
    case "SET_WRITING":
      return { ...state, boardState: { ...state.boardState, isWriting: action.isWriting, currentWrittenText: action.currentText } };
    case "FINISH_ITEM":
      return {
        ...state,
        boardState: {
          ...state.boardState,
          writtenItems: [...state.boardState.writtenItems, action.item],
          currentWrittenText: "",
          isWriting: false,
        },
      };
    case "SET_CURRENT_ITEM_INDEX":
      return { ...state, boardState: { ...state.boardState, currentItemIndex: action.index } };
    case "SET_BOARD_ITEMS":
      return { ...state, boardState: { ...state.boardState, items: action.items, writtenItems: [], currentItemIndex: 0, currentWrittenText: "", isWriting: false } };
    case "SET_AUDIO_PLAYING":
      return { ...state, audioState: { ...state.audioState, playing: action.playing } };
    case "SET_AUDIO_ENABLED":
      return { ...state, audioState: { ...state.audioState, enabled: action.enabled } };
    case "SET_CAPTION":
      return { ...state, captions: { ...state.captions, currentText: action.text } };
    case "TOGGLE_CAPTIONS":
      return { ...state, captions: { ...state.captions, enabled: !state.captions.enabled } };
    case "OPEN_QUESTION":
      return { ...state, questionState: { ...state.questionState, isPromptOpen: true } };
    case "CLOSE_QUESTION":
      return { ...state, questionState: { ...state.questionState, isPromptOpen: false, transcript: "", isListening: false, blindState: undefined } };
    case "SET_LISTENING":
      return { ...state, questionState: { ...state.questionState, isListening: action.isListening, transcript: action.transcript } };
    case "SET_BLIND_STATE":
      return { ...state, questionState: { ...state.questionState, blindState: action.blindState } };
    case "ADD_TRANSCRIPT": {
      return { ...state, transcript: [...state.transcript, action.entry] };
    }
    case "SET_LEARNING_MODE": {
      const m = action.mode;
      return {
        ...state,
        learningMode: m,
        audioState: {
          ...state.audioState,
          enabled: m !== "deaf" && m !== "deaf_blind",
          lockedOnForBlindMode: m === "blind",
          rate: m === "adhd_focus" || m === "extra_support" ? 0.85 : 1,
        },
        captions: { ...state.captions, enabled: m !== "blind" },
        questionState: {
          ...state.questionState,
          inputMode: m === "blind" ? "voice" : m === "speech_difficulty" ? "quick_action" : "text",
        },
      };
    }
    case "SET_STEP_INDEX": {
      const pct = Math.round(((action.index + 1) / state.progress.totalSteps) * 100);
      return { ...state, progress: { ...state.progress, stepIndex: action.index, percentage: pct } };
    }
    case "START_REPLAY":
      return {
        ...state,
        replayState: { isReplayMode: true, replayFromIndex: action.fromIndex ?? 0 },
        boardState: {
          ...state.boardState,
          writtenItems: [],
          currentItemIndex: action.fromIndex ?? 0,
          currentWrittenText: "",
          isWriting: false,
        },
      };
    case "STOP_REPLAY":
      return { ...state, replayState: { isReplayMode: false, replayFromIndex: undefined } };
    case "RESET_BOARD":
      return {
        ...state,
        boardState: { ...state.boardState, writtenItems: [], currentItemIndex: 0, currentWrittenText: "", isWriting: false },
      };
    case "SET_AUTO_SCROLL":
      return { ...state, boardState: { ...state.boardState, autoScroll: action.autoScroll } };
    default:
      return state;
  }
}

/* ─── Main Component ─────────────────────────────────────────── */

interface VideoClassroomPageProps {
  classroomContext?: ClassroomContext;
  sessionId?: string;
  onEndLesson?: () => void;
}

export function VideoClassroomPage({ classroomContext, sessionId = "demo-session", onEndLesson }: VideoClassroomPageProps) {
  const initialState = useMemo(
    () => createInitialState(sessionId, classroomContext?.learnerAccessProfile?.lessonPace === "slow" ? "extra_support" : "standard"),
    [sessionId, classroomContext?.learnerAccessProfile?.lessonPace],
  );
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isPaused, setIsPaused] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const boardRef = useRef<HTMLDivElement>(null);
  const writingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);
  const isPlayingRef = useRef(false);
  const currentCharIndexRef = useRef(0);

  const lesson = classroomContext?.lesson;
  const institution = classroomContext?.institution;
  const course = classroomContext?.course;

  /* ── Cleanup ─────────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      stopSpeech();
      stopVoiceListening(recognitionRef.current);
      if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
    };
  }, []);

  /* ── Auto-scroll board ───────────────────────────────────── */
  useEffect(() => {
    if (state.boardState.autoScroll && boardRef.current) {
      boardRef.current.scrollTop = boardRef.current.scrollHeight;
    }
  }, [state.boardState.writtenItems, state.boardState.currentWrittenText, state.boardState.autoScroll]);

  /* ── Animate writing a board item ────────────────────────── */
  const animateItem = useCallback(
    (item: BoardWriteItem) => {
      return new Promise<void>((resolve) => {
        dispatch({ type: "SET_TEACHER_STATE", state: "writing" });
        dispatch({ type: "SET_WRITING", isWriting: true, currentText: "" });
        dispatch({ type: "SET_CAPTION", text: item.accessibleDescription });

        const delay = getCharDelay(item.writingSpeed, state.learningMode);
        const text = item.text;
        let charIndex = 0;
        currentCharIndexRef.current = 0;

        const writeNextChar = () => {
          if (charIndex < text.length && isPlayingRef.current) {
            charIndex++;
            currentCharIndexRef.current = charIndex;
            dispatch({ type: "SET_WRITING", isWriting: true, currentText: text.slice(0, charIndex) });

            const charDelay = text[charIndex - 1] === " " ? delay + 30 : delay;
            writingTimerRef.current = setTimeout(writeNextChar, charDelay);
          } else if (charIndex >= text.length) {
            dispatch({ type: "FINISH_ITEM", item });
            resolve();
          } else {
            resolve();
          }
        };

        isPlayingRef.current = true;
        writeNextChar();
      });
    },
    [state.learningMode],
  );

  /* ── Speak text ──────────────────────────────────────────── */
  const speakText = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve) => {
        if (!state.audioState.enabled) {
          resolve();
          return;
        }
        dispatch({ type: "SET_AUDIO_PLAYING", playing: true });
        dispatch({ type: "SET_CAPTION", text });
        speak(text, () => {
          dispatch({ type: "SET_AUDIO_PLAYING", playing: false });
          resolve();
        });
      });
    },
    [state.audioState.enabled],
  );

  /* ── Play a single board item: write → read → explain ───── */
  const playBoardItem = useCallback(
    async (item: BoardWriteItem) => {
      // 1. Teacher writes on board
      await animateItem(item);

      // Short pause after writing
      await new Promise<void>((r) => setTimeout(r, getLinePause(state.learningMode)));

      // 2. Teacher reads exact text
      dispatch({ type: "SET_TEACHER_STATE", state: "speaking" });
      if (item.readExactly) {
        await speakText(item.text);
      }

      // 3. Teacher gives explanation if available
      if (item.explanation) {
        dispatch({ type: "SET_TEACHER_STATE", state: "explaining" });
        await speakText(item.explanation);
      }

      // Add to transcript
      dispatch({
        type: "ADD_TRANSCRIPT",
        entry: {
          id: crypto.randomUUID(),
          role: "board",
          text: item.text + (item.explanation ? ` — ${item.explanation}` : ""),
          timestamp: new Date().toISOString(),
          boardItemId: item.id,
        },
      });
    },
    [animateItem, speakText, state.learningMode],
  );

  /* ── Play entire lesson from current index ───────────────── */
  const playLesson = useCallback(async () => {
    isPlayingRef.current = true;
    setIsPaused(false);
    const items = state.boardState.items;
    let idx = state.boardState.currentItemIndex;

    while (idx < items.length && isPlayingRef.current) {
      dispatch({ type: "SET_CURRENT_ITEM_INDEX", index: idx });
      await playBoardItem(items[idx]);
      idx++;

      // Ask question after certain items
      if (idx < items.length && (items[idx - 1].type === "answer" || items[idx - 1].type === "calculation")) {
        dispatch({ type: "SET_TEACHER_STATE", state: "asking_question" });
        dispatch({ type: "OPEN_QUESTION" });
        // For demo: auto-close after showing, or let user interact
        if (state.learningMode !== "blind") {
          await new Promise<void>((r) => setTimeout(r, 1500));
          dispatch({ type: "CLOSE_QUESTION" });
        }
      }
    }

    if (idx >= items.length) {
      dispatch({ type: "SET_TEACHER_STATE", state: "encouraging" });
      await speakText("Great job! That is the end of this section.");
    }
  }, [playBoardItem, state.boardState.items, state.boardState.currentItemIndex, state.learningMode]);

  /* ── Pause / Resume ──────────────────────────────────────── */
  const handlePause = () => {
    isPlayingRef.current = false;
    setIsPaused(true);
    pauseSpeech();
    dispatch({ type: "SET_TEACHER_STATE", state: "paused" });
    if (writingTimerRef.current) clearTimeout(writingTimerRef.current);
  };

  const handleResume = () => {
    setIsPaused(false);
    resumeSpeech();
    isPlayingRef.current = true;
    dispatch({ type: "SET_TEACHER_STATE", state: "speaking" });
  };

  /* ── Step navigation ─────────────────────────────────────── */
  const goToStep = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= STEP_ORDER.length) return;
      const stepKey = STEP_ORDER[stepIndex];
      dispatch({ type: "SET_STEP_INDEX", index: stepIndex });
      dispatch({ type: "SET_BOARD_ITEMS", items: STEP_BOARDS[stepKey] ?? SAMPLE_BOARD_SEQUENCE });
      dispatch({ type: "SET_TEACHER_STATE", state: "preparing" });
      isPlayingRef.current = false;
      setIsPaused(false);
      stopSpeech();
    },
    [],
  );

  /* ── Replay ──────────────────────────────────────────────── */
  const replayFromStart = () => {
    dispatch({ type: "START_REPLAY", fromIndex: 0 });
    setTimeout(() => playLesson(), 300);
  };

  const replayCurrentStep = () => {
    dispatch({ type: "START_REPLAY", fromIndex: state.boardState.currentItemIndex });
    setTimeout(() => playLesson(), 300);
  };

  const replayFromPrevious = () => {
    const prev = Math.max(0, state.boardState.currentItemIndex - 1);
    dispatch({ type: "START_REPLAY", fromIndex: prev });
    setTimeout(() => playLesson(), 300);
  };

  /* ── Question handling ───────────────────────────────────── */
  const handleAskQuestion = () => {
    dispatch({ type: "OPEN_QUESTION" });
    if (state.learningMode === "blind") {
      dispatch({ type: "SET_BLIND_STATE", blindState: "mic_listening" });
      dispatch({ type: "SET_LISTENING", isListening: true, transcript: "" });
      recognitionRef.current = startListening(
        (transcript, isFinal) => {
          dispatch({ type: "SET_LISTENING", isListening: true, transcript });
          if (isFinal) {
            dispatch({ type: "SET_BLIND_STATE", blindState: "transcribing" });
            stopVoiceListening(recognitionRef.current);
            dispatch({ type: "SET_LISTENING", isListening: false, transcript });
          }
        },
        () => {},
        () => {
          dispatch({ type: "SET_LISTENING", isListening: false, transcript: "" });
        },
      );
    }
  };

  const submitQuestion = (question: string) => {
    if (!question.trim()) return;
    dispatch({
      type: "ADD_TRANSCRIPT",
      entry: { id: crypto.randomUUID(), role: "student", text: question, timestamp: new Date().toISOString() },
    });
    dispatch({ type: "CLOSE_QUESTION" });
    stopVoiceListening(recognitionRef.current);

    // Simulate teacher answer
    dispatch({ type: "SET_TEACHER_STATE", state: "answering" });
    const answer = `That is a great question. Let me think about ${question}... The key idea here is to focus on the factor pairs.`;
    speakText(answer).then(() => {
      dispatch({
        type: "ADD_TRANSCRIPT",
        entry: { id: crypto.randomUUID(), role: "teacher", text: answer, timestamp: new Date().toISOString() },
      });
      dispatch({ type: "SET_TEACHER_STATE", state: "speaking" });
    });
    setQuestionInput("");
  };

  /* ── Send quick action ───────────────────────────────────── */
  const handleQuickAction = (action: string) => {
    if (action === "no_question") {
      dispatch({ type: "CLOSE_QUESTION" });
      return;
    }
    if (action === "repeat") {
      dispatch({ type: "CLOSE_QUESTION" });
      replayCurrentStep();
      return;
    }
    if (action === "dont_understand") {
      submitQuestion("I don't understand this part.");
      return;
    }
    if (action === "give_example") {
      submitQuestion("Can you give me an example?");
      return;
    }
    if (action === "slow_down") {
      dispatch({ type: "CLOSE_QUESTION" });
      dispatch({ type: "SET_TEACHER_STATE", state: "encouraging" });
      speakText("Okay, I will slow down. Let me explain again.");
      return;
    }
    if (action === "continue") {
      dispatch({ type: "CLOSE_QUESTION" });
      return;
    }
  };

  /* ── Scroll handler for auto-scroll toggle ───────────────── */
  const handleBoardScroll = () => {
    if (!boardRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = boardRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 60;
    if (!atBottom && state.boardState.autoScroll) {
      dispatch({ type: "SET_AUTO_SCROLL", autoScroll: false });
    }
  };

  /* ── Mode defaults ───────────────────────────────────────── */
  const isDeafMode = state.learningMode === "deaf" || state.learningMode === "deaf_blind";
  const isBlindMode = state.learningMode === "blind";
  const isFocusMode = state.learningMode === "adhd_focus";
  const isSpeechDifficulty = state.learningMode === "speech_difficulty";
  const isMotorSupport = state.learningMode === "motor_support";
  const showChatPanel = !isFocusMode;

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* ═══ TOP BAR ═══════════════════════════════════════════ */}
      <ClassroomTopBar
        institutionName={institution?.name ?? "Klassruum Academy"}
        courseName={course?.title ?? "Mathematics"}
        lessonTitle={lesson?.title ?? "Solving Quadratic Equations"}
        progress={state.progress.percentage}
        liveStatus={isPlayingRef.current ? "live" : isPaused ? "paused" : "ready"}
        learningMode={state.learningMode}
        onOpenModeSwitcher={() => setShowModeSwitcher(true)}
        onOpenTranscript={() => setShowTranscript(true)}
        onEndLesson={onEndLesson ?? (() => {})}
      />

      {/* ═══ MAIN AREA ════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0">
        {/* ── TEACHER VIDEO PANEL ──────────────────────────── */}
        {!isFocusMode && (
          <TeacherVideoPanel
            teacherState={state.teacherState}
            teacherMode={state.teacherMode}
            isSpeaking={state.audioState.playing}
            audioEnabled={state.audioState.enabled}
            currentCaption={state.captions.currentText}
            onToggleAudio={() => {
              if (state.audioState.lockedOnForBlindMode) return;
              dispatch({ type: "SET_AUDIO_ENABLED", enabled: !state.audioState.enabled });
            }}
            onAskQuestion={handleAskQuestion}
            learningMode={state.learningMode}
          />
        )}

        {/* ── LEARNING WHITEBOARD ──────────────────────────── */}
        <div className="flex flex-1 min-w-0 flex-col p-3">
          <LearningWhiteboard
            ref={boardRef}
            writtenItems={state.boardState.writtenItems}
            currentItem={state.boardState.items[state.boardState.currentItemIndex]}
            currentWrittenText={state.boardState.currentWrittenText}
            isWriting={state.boardState.isWriting}
            onScroll={handleBoardScroll}
            reducedMotion={state.learningMode === "adhd_focus"}
            learningMode={state.learningMode}
          />

          {/* Board navigation for replay */}
          <div className="replay-controls mt-2 flex items-center gap-2">
            <button onClick={replayFromPrevious} className="replay-button" title="Previous item">
              <SkipBack className="h-3.5 w-3.5" /> Previous
            </button>
            <button onClick={replayCurrentStep} className="replay-button" title="Replay step">
              <RotateCcw className="h-3.5 w-3.5" /> Replay Step
            </button>
            <button onClick={replayFromStart} className="replay-button" title="Replay all">
              <RefreshCw className="h-3.5 w-3.5" /> Replay All
            </button>
            <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
              <PenTool className="h-3 w-3" />
              {state.boardState.writtenItems.length} / {state.boardState.items.length} items
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CAPTION BAR ══════════════════════════════════════ */}
      {state.captions.enabled && state.captions.currentText && !isFocusMode && (
        <div className="caption-bar">
          <Subtitles className="mr-2 h-4 w-4 text-blue-400" />
          <span className="caption-text">{state.captions.currentText}</span>
        </div>
      )}

      {/* ═══ BOTTOM CONTROLS ══════════════════════════════════ */}
      <ClassroomControls
        isPlaying={isPlayingRef.current}
        isPaused={isPaused}
        audioEnabled={state.audioState.enabled}
        captionsEnabled={state.captions.enabled}
        isListening={state.questionState.isListening}
        learningMode={state.learningMode}
        onPlay={() => playLesson()}
        onPause={handlePause}
        onResume={handleResume}
        onToggleAudio={() => {
          if (state.audioState.lockedOnForBlindMode) return;
          dispatch({ type: "SET_AUDIO_ENABLED", enabled: !state.audioState.enabled });
        }}
        onToggleCaptions={() => dispatch({ type: "TOGGLE_CAPTIONS" })}
        onAskQuestion={handleAskQuestion}
        onToggleListening={() => {
          if (state.questionState.isListening) {
            stopVoiceListening(recognitionRef.current);
            dispatch({ type: "SET_LISTENING", isListening: false, transcript: "" });
          } else {
            handleAskQuestion();
          }
        }}
        onEndLesson={onEndLesson ?? (() => {})}
        onPrevStep={() => goToStep(state.progress.stepIndex - 1)}
        onNextStep={() => goToStep(state.progress.stepIndex + 1)}
      />

      {/* ═══ QUESTION PROMPT ══════════════════════════════════ */}
      {state.questionState.isPromptOpen && (
        <QuestionPromptOverlay
          learningMode={state.learningMode}
          questionInput={questionInput}
          setQuestionInput={setQuestionInput}
          onSubmit={submitQuestion}
          onClose={() => {
            dispatch({ type: "CLOSE_QUESTION" });
            stopVoiceListening(recognitionRef.current);
          }}
          onQuickAction={handleQuickAction}
          isListening={state.questionState.isListening}
          voiceTranscript={state.questionState.transcript}
          blindState={state.questionState.blindState}
        />
      )}

      {/* ═══ TRANSCRIPT DRAWER ════════════════════════════════ */}
      <TranscriptDrawer
        entries={state.transcript}
        isOpen={showTranscript}
        onClose={() => setShowTranscript(false)}
      />

      {/* ═══ MODE SWITCHER ════════════════════════════════════ */}
      {showModeSwitcher && (
        <ModeSwitcherOverlay
          currentMode={state.learningMode}
          onSelect={(mode) => {
            dispatch({ type: "SET_LEARNING_MODE", mode });
            setShowModeSwitcher(false);
          }}
          onClose={() => setShowModeSwitcher(false)}
        />
      )}

      {/* ═══ WELCOME OVERLAY (initial) ════════════════════════ */}
      {state.teacherState === "preparing" && !state.replayState.isReplayMode && (
        <div className="question-prompt-wrapper">
          <div className="question-prompt-content max-w-lg text-center">
            <div className="learning-mode-badge mx-auto mb-4">
              <Sparkles className="h-4 w-4" />
              Welcome to Klassruum
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Your AI teacher is ready.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              This lesson includes voice, whiteboard with handwriting, captions, and full accessibility support.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => playLesson()} size="lg">
                <Play className="mr-2 h-5 w-5" />
                Start Lesson
              </Button>
              <Button variant="outline" onClick={() => setShowModeSwitcher(true)}>
                <Accessibility className="mr-2 h-4 w-4" />
                Learning Mode
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                                   */
/* ════════════════════════════════════════════════════════════════ */

/* ─── Classroom Top Bar ──────────────────────────────────────── */

function ClassroomTopBar({
  institutionName,
  courseName,
  lessonTitle,
  progress,
  liveStatus,
  learningMode,
  onOpenModeSwitcher,
  onOpenTranscript,
  onEndLesson,
}: {
  institutionName: string;
  courseName: string;
  lessonTitle: string;
  progress: number;
  liveStatus: "live" | "paused" | "ready";
  learningMode: LearningMode;
  onOpenModeSwitcher: () => void;
  onOpenTranscript: () => void;
  onEndLesson: () => void;
}) {
  return (
    <header className="flex h-14 items-center border-b border-border bg-white px-4 shadow-sm" role="banner">
      <Link to="/student/dashboard" className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Exit
      </Link>

      <div className="ml-4 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{institutionName}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-muted-foreground">{courseName}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-semibold text-foreground">{lessonTitle}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Live badge */}
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          liveStatus === "live" ? "bg-red-100 text-red-600" : liveStatus === "paused" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-2 w-2 rounded-full ${liveStatus === "live" ? "animate-pulse bg-red-500" : liveStatus === "paused" ? "bg-yellow-500" : "bg-slate-400"}`} />
          {liveStatus === "live" ? "Live" : liveStatus === "paused" ? "Paused" : "Ready"}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Progress</span>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-bold text-foreground">{progress}%</span>
        </div>

        {/* Learning Mode */}
        <button onClick={onOpenModeSwitcher} className="learning-mode-badge" aria-label="Change learning mode">
          <Accessibility className="h-3.5 w-3.5" />
          {LEARNING_MODES.find((m) => m.key === learningMode)?.label ?? "Standard"}
        </button>

        {/* Transcript */}
        <button onClick={onOpenTranscript} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground" aria-label="Open transcript">
          <BookOpen className="h-3.5 w-3.5" />
          Transcript
        </button>

        {/* End Lesson */}
        <button onClick={onEndLesson} className="rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-white hover:bg-destructive/90">
          End Lesson
        </button>
      </div>
    </header>
  );
}

/* ─── Teacher Video Panel ────────────────────────────────────── */

function TeacherVideoPanel({
  teacherState,
  teacherMode,
  isSpeaking,
  audioEnabled,
  currentCaption,
  onToggleAudio,
  onAskQuestion,
  learningMode,
}: {
  teacherState: TeacherVideoState;
  teacherMode: "ai_teacher" | "human_teacher" | "hybrid";
  isSpeaking: boolean;
  audioEnabled: boolean;
  currentCaption: string;
  onToggleAudio: () => void;
  onAskQuestion: () => void;
  learningMode: LearningMode;
}) {
  const stateLabel = teacherState.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const stateColor = (() => {
    switch (teacherState) {
      case "speaking": return "bg-blue-100 text-blue-700";
      case "writing": return "bg-purple-100 text-purple-700";
      case "listening": return "bg-green-100 text-green-700";
      case "thinking": return "bg-orange-100 text-orange-700";
      case "answering": return "bg-cyan-100 text-cyan-700";
      case "encouraging": return "bg-pink-100 text-pink-700";
      case "paused": return "bg-yellow-100 text-yellow-700";
      default: return "bg-slate-100 text-slate-600";
    }
  })();

  return (
    <aside className="teacher-video-panel flex w-[280px] min-w-[240px] max-w-[320px] flex-shrink-0 flex-col" role="complementary" aria-label="Teacher video panel">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <span className="text-sm font-bold text-foreground">AI Teacher</span>
        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Online
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center px-4 py-5">
        <div className={`relative h-28 w-28 rounded-full border-4 ${isSpeaking ? "border-blue-300 shadow-lg shadow-blue-200/50" : "border-slate-200"}`}>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100" />
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-purple-200">
            <div className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 ${isSpeaking ? "animate-pulse" : ""}`} />
          </div>
          {/* Speaking ring */}
          {isSpeaking && (
            <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-400/30" />
          )}
        </div>

        {/* Teacher state */}
        <div className={`teacher-state-badge ${stateColor} mt-3`}>
          {teacherState === "writing" && <PenTool className="h-3 w-3" />}
          {teacherState === "speaking" && <Volume2 className="h-3 w-3" />}
          {teacherState === "listening" && <Mic className="h-3 w-3" />}
          {teacherState === "thinking" && <Loader2 className="h-3 w-3 animate-spin" />}
          {stateLabel}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Mr. Klass is your AI teacher</p>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
          {teacherMode === "ai_teacher" ? "AI Teacher" : teacherMode === "human_teacher" ? "Human Teacher" : "Hybrid"}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${audioEnabled ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}`}>
          {audioEnabled ? "Voice Active" : "Voice Off"}
        </span>
        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-600">
          Captions {learningMode === "deaf" || learningMode === "deaf_blind" ? "On" : "Auto"}
        </span>
      </div>

      <div className="mx-4 my-3 h-px bg-border" />

      {/* Current activity */}
      <div className="px-4 py-2">
        <div className="text-xs text-muted-foreground">Current Activity</div>
        <p className="mt-1 text-sm font-medium text-foreground">
          {teacherState === "writing" && "Writing on board..."}
          {teacherState === "speaking" && "Explaining the lesson..."}
          {teacherState === "listening" && "Listening for questions..."}
          {teacherState === "thinking" && "Thinking..."}
          {teacherState === "answering" && "Answering your question..."}
          {teacherState === "encouraging" && "Great work!"}
          {teacherState === "paused" && "Paused"}
          {teacherState === "preparing" && "Preparing lesson..."}
          {teacherState === "explaining" && "Giving explanation..."}
          {teacherState === "asking_question" && "Asking a question..."}
        </p>
      </div>

      {/* Caption preview */}
      {currentCaption && (
        <div className="mx-4 mb-3 rounded-lg bg-slate-50 p-3 text-xs text-muted-foreground">
          <Subtitles className="mr-1 inline h-3 w-3" />
          {currentCaption}
        </div>
      )}

      <div className="mt-auto px-4 pb-4 space-y-2">
        {/* Ask question */}
        <button
          onClick={onAskQuestion}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
          aria-label="Ask a question"
        >
          <MessageSquare className="h-4 w-4" />
          Ask Question
        </button>

        {/* Audio toggle (not for blind mode) */}
        {learningMode !== "blind" && (
          <button
            onClick={onToggleAudio}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {audioEnabled ? "Audio On" : "Audio Off"}
          </button>
        )}
      </div>
    </aside>
  );
}

/* ─── Learning Whiteboard ────────────────────────────────────── */

const LearningWhiteboard = forwardRef<HTMLDivElement, {
  writtenItems: BoardWriteItem[];
  currentItem?: BoardWriteItem;
  currentWrittenText: string;
  isWriting: boolean;
  onScroll: () => void;
  reducedMotion: boolean;
  learningMode: LearningMode;
}>(function LearningWhiteboard(
  { writtenItems, currentItem, currentWrittenText, isWriting, onScroll, reducedMotion, learningMode },
  ref,
) {
  const fontSize = learningMode === "low_vision" || learningMode === "deaf_blind" ? "text-3xl" : learningMode === "dyslexia" ? "text-2xl" : "";

  return (
    <div
      ref={ref}
      className="learning-whiteboard"
      onScroll={onScroll}
      role="region"
      aria-label="Learning whiteboard"
      aria-live="polite"
    >
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        {/* Written items */}
        {writtenItems.map((item) => (
          <div key={item.id} className={`board-writing-line ${item.type} ${fontSize}`}>
            {item.type === "bullet" && "• "}
            {item.type === "equation" && "  "}
            {item.type === "calculation" && "  "}
            {item.type === "answer" && "→ "}
            {item.type === "question" && "? "}
            {item.text}
          </div>
        ))}

        {/* Currently writing item */}
        {isWriting && currentItem && (
          <div className={`board-writing-line ${currentItem.type} ${fontSize}`}>
            {currentItem.type === "bullet" && "• "}
            {currentItem.type === "equation" && "  "}
            {currentItem.type === "calculation" && "  "}
            {currentItem.type === "answer" && "→ "}
            {currentItem.type === "question" && "? "}
            <span>{currentWrittenText}</span>
            {/* Writing cursor / hand */}
            {!reducedMotion && (
              <span className="writing-cursor inline-block w-[2px] animate-pulse bg-blue-500" style={{ height: "1em", verticalAlign: "text-bottom", marginLeft: "2px" }} />
            )}
            {/* Hand cursor emoji */}
            {!reducedMotion && (
              <span className="writing-hand ml-1" style={{ position: "relative", top: "-2px" }} aria-hidden="true">
                ✍️
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

/* ─── Classroom Controls (Bottom Bar) ────────────────────────── */

function ClassroomControls({
  isPlaying,
  isPaused,
  audioEnabled,
  captionsEnabled,
  isListening,
  learningMode,
  onPlay,
  onPause,
  onResume,
  onToggleAudio,
  onToggleCaptions,
  onAskQuestion,
  onToggleListening,
  onEndLesson,
  onPrevStep,
  onNextStep,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  audioEnabled: boolean;
  captionsEnabled: boolean;
  isListening: boolean;
  learningMode: LearningMode;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onToggleAudio: () => void;
  onToggleCaptions: () => void;
  onAskQuestion: () => void;
  onToggleListening: () => void;
  onEndLesson: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}) {
  const isLargeButtons = learningMode === "motor_support" || learningMode === "low_vision";
  const btnClass = isLargeButtons ? "h-12 w-12" : "h-10 w-10";

  return (
    <div className="flex h-16 items-center justify-center gap-2 border-t border-border bg-white px-4 shadow-inner" role="toolbar" aria-label="Classroom controls">
      {/* Step nav */}
      <button onClick={onPrevStep} className={`${btnClass} flex items-center justify-center rounded-full bg-slate-100 text-muted-foreground hover:bg-slate-200`} aria-label="Previous step">
        <SkipBack className="h-4 w-4" />
      </button>

      {/* Play / Pause */}
      {!isPlaying && !isPaused && (
        <button onClick={onPlay} className={`${btnClass} flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90`} aria-label="Start lesson">
          <Play className="h-5 w-5" />
        </button>
      )}
      {isPlaying && !isPaused && (
        <button onClick={onPause} className={`${btnClass} flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90`} aria-label="Pause">
          <Pause className="h-5 w-5" />
        </button>
      )}
      {isPaused && (
        <button onClick={onResume} className={`${btnClass} flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90`} aria-label="Resume">
          <Play className="h-5 w-5" />
        </button>
      )}

      <button onClick={onNextStep} className={`${btnClass} flex items-center justify-center rounded-full bg-slate-100 text-muted-foreground hover:bg-slate-200`} aria-label="Next step">
        <SkipForward className="h-4 w-4" />
      </button>

      <div className="mx-2 h-8 w-px bg-border" />

      {/* Audio */}
      {learningMode !== "blind" && (
        <button onClick={onToggleAudio} className={`${btnClass} flex items-center justify-center rounded-full ${audioEnabled ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-muted-foreground"}`} aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}>
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      )}

      {/* Captions */}
      <button onClick={onToggleCaptions} className={`${btnClass} flex items-center justify-center rounded-full ${captionsEnabled ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-muted-foreground"}`} aria-label={captionsEnabled ? "Hide captions" : "Show captions"}>
        <Subtitles className="h-4 w-4" />
      </button>

      {/* Ask Question */}
      <button onClick={onAskQuestion} className={`${btnClass} flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200`} aria-label="Ask question">
        <MessageSquare className="h-4 w-4" />
      </button>

      {/* Mic */}
      {learningMode !== "speech_difficulty" && (
        <button onClick={onToggleListening} className={`${btnClass} flex items-center justify-center rounded-full ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-muted-foreground"}`} aria-label={isListening ? "Stop listening" : "Start voice input"}>
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
      )}

      <div className="mx-2 h-8 w-px bg-border" />

      {/* End Lesson */}
      <button onClick={onEndLesson} className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90" aria-label="End lesson">
        End Lesson
      </button>
    </div>
  );
}

/* ─── Question Prompt Overlay ────────────────────────────────── */

function QuestionPromptOverlay({
  learningMode,
  questionInput,
  setQuestionInput,
  onSubmit,
  onClose,
  onQuickAction,
  isListening,
  voiceTranscript,
  blindState,
}: {
  learningMode: LearningMode;
  questionInput: string;
  setQuestionInput: (v: string) => void;
  onSubmit: (q: string) => void;
  onClose: () => void;
  onQuickAction: (action: string) => void;
  isListening: boolean;
  voiceTranscript: string;
  blindState?: BlindQuestionState;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (learningMode !== "blind") {
      inputRef.current?.focus();
    }
  }, [learningMode]);

  // Standard / Default prompt
  if (learningMode === "standard" || learningMode === "extra_support" || learningMode === "challenge" || learningMode === "dyslexia" || learningMode === "low_vision" || learningMode === "motor_support") {
    return (
      <div className="question-prompt-wrapper" role="dialog" aria-label="Ask a question">
        <div className="question-prompt-content max-w-md">
          <h3 className="question-prompt-title">Any question?</h3>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit(questionInput)}
              placeholder="Ask your teacher..."
              className="question-prompt-input flex-1"
              autoComplete="off"
            />
            <button onClick={() => onSubmit(questionInput)} className="question-prompt-button primary" aria-label="Send question">
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="question-prompt-buttons">
            <button onClick={() => onQuickAction("no_question")} className="question-prompt-button secondary">
              No question
            </button>
            <button onClick={() => onQuickAction("repeat")} className="question-prompt-button secondary">
              <RotateCcw className="h-3.5 w-3.5" /> Repeat
            </button>
            <button onClick={() => onQuickAction("dont_understand")} className="question-prompt-button secondary">
              <HelpCircle className="h-3.5 w-3.5" /> I don't understand
            </button>
            <button onClick={() => onQuickAction("give_example")} className="question-prompt-button secondary">
              <Lightbulb className="h-3.5 w-3.5" /> Give example
            </button>
            <button onClick={() => onQuickAction("slow_down")} className="question-prompt-button secondary">
              Slow down
            </button>
            <button onClick={() => onQuickAction("continue")} className="question-prompt-button secondary">
              Continue
            </button>
          </div>
          <button onClick={onClose} className="mt-3 text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
      </div>
    );
  }

  // Deaf / Deaf-Blind mode
  if (learningMode === "deaf" || learningMode === "deaf_blind") {
    return (
      <div className="question-prompt-wrapper" role="dialog" aria-label="Ask a question">
        <div className="question-prompt-content max-w-md">
          <h3 className="question-prompt-title">Any question?</h3>
          <p className="mb-3 text-sm text-muted-foreground">Type your question below. No audio required.</p>
          <textarea
            ref={inputRef as any}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Type your question..."
            className="question-prompt-input min-h-[80px] resize-none"
            rows={3}
            autoComplete="off"
          />
          <div className="question-prompt-buttons">
            <button onClick={() => onSubmit(questionInput)} className="question-prompt-button primary">
              <Send className="h-3.5 w-3.5" /> Send Question
            </button>
            <button onClick={() => onQuickAction("no_question")} className="question-prompt-button secondary">
              No Question
            </button>
            <button onClick={() => onQuickAction("repeat")} className="question-prompt-button secondary">
              <RotateCcw className="h-3.5 w-3.5" /> Repeat Board Step
            </button>
            <button onClick={() => onQuickAction("give_example")} className="question-prompt-button secondary">
              <Lightbulb className="h-3.5 w-3.5" /> Simpler Explanation
            </button>
          </div>
          <button onClick={onClose} className="mt-3 text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
      </div>
    );
  }

  // Blind mode - voice first
  if (learningMode === "blind") {
    return (
      <div className="question-prompt-wrapper" role="dialog" aria-label="Voice question prompt">
        <div className="question-prompt-content max-w-md text-center" aria-live="assertive">
          <h3 className="question-prompt-title">Any question before we continue?</h3>
          <div className="my-4">
            {isListening ? (
              <>
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 animate-pulse">
                  <Mic className="h-8 w-8 text-red-500" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {blindState === "mic_listening" ? "Listening. Say your question, or say \"no question\"." : "Processing..."}
                </p>
                {voiceTranscript && (
                  <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-muted-foreground">
                    You said: "{voiceTranscript}"
                  </p>
                )}
              </>
            ) : voiceTranscript ? (
              <>
                <p className="text-sm text-foreground">You said:</p>
                <p className="mt-1 text-lg font-medium text-foreground">"{voiceTranscript}"</p>
                <div className="question-prompt-buttons mt-4 justify-center">
                  <button onClick={() => onSubmit(voiceTranscript)} className="question-prompt-button primary">
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                  <button onClick={() => onQuickAction("no_question")} className="question-prompt-button secondary">
                    No Question
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Starting microphone...</p>
            )}
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Speech difficulty mode
  if (learningMode === "speech_difficulty") {
    return (
      <div className="question-prompt-wrapper" role="dialog" aria-label="Question prompt">
        <div className="question-prompt-content max-w-md">
          <h3 className="question-prompt-title">Any question?</h3>
          <input
            ref={inputRef}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit(questionInput)}
            placeholder="Type your question..."
            className="question-prompt-input"
            autoComplete="off"
          />
          <div className="question-prompt-buttons">
            <button onClick={() => onSubmit(questionInput)} className="question-prompt-button primary">
              <Send className="h-3.5 w-3.5" /> Send
            </button>
            <button onClick={() => onQuickAction("no_question")} className="question-prompt-button secondary">
              No question
            </button>
            <button onClick={() => onQuickAction("repeat")} className="question-prompt-button secondary">
              <RotateCcw className="h-3.5 w-3.5" /> Repeat
            </button>
            <button onClick={() => onQuickAction("dont_understand")} className="question-prompt-button secondary">
              Explain simpler
            </button>
            <button onClick={() => onQuickAction("give_example")} className="question-prompt-button secondary">
              <Lightbulb className="h-3.5 w-3.5" /> Give example
            </button>
            <button onClick={() => onQuickAction("continue")} className="question-prompt-button secondary">
              Continue
            </button>
          </div>
          <button onClick={onClose} className="mt-3 text-xs text-muted-foreground hover:text-foreground">
            Close
          </button>
        </div>
      </div>
    );
  }

  // ADHD Focus mode - minimal
  return (
    <div className="question-prompt-wrapper" role="dialog" aria-label="Question prompt">
      <div className="question-prompt-content max-w-sm">
        <h3 className="question-prompt-title">Question?</h3>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSubmit(questionInput)}
            placeholder="Quick question..."
            className="question-prompt-input flex-1"
            autoComplete="off"
          />
          <button onClick={() => onSubmit(questionInput)} className="question-prompt-button primary">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="question-prompt-buttons">
          <button onClick={() => onQuickAction("no_question")} className="question-prompt-button secondary">No question</button>
          <button onClick={() => onQuickAction("continue")} className="question-prompt-button secondary">Continue</button>
        </div>
        <button onClick={onClose} className="mt-3 text-xs text-muted-foreground hover:text-foreground">Close</button>
      </div>
    </div>
  );
}

/* ─── Transcript Drawer ──────────────────────────────────────── */

function TranscriptDrawer({
  entries,
  isOpen,
  onClose,
}: {
  entries: TranscriptEntry[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries, isOpen]);

  return (
    <div
      className={`transcript-drawer ${isOpen ? "open" : "closed"}`}
      role="dialog"
      aria-label="Lesson transcript"
      aria-hidden={!isOpen}
    >
      <div className="transcript-content">
        <div className="transcript-header">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <BookOpen className="h-4 w-4" />
            Transcript & History
          </h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-slate-100" aria-label="Close transcript">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div ref={bodyRef} className="transcript-body">
          {entries.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No transcript entries yet. Start the lesson to begin.</p>
          )}
          {entries.map((entry) => (
            <div key={entry.id} className={`transcript-entry ${entry.role}`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                  entry.role === "student" ? "bg-blue-100 text-blue-600" :
                  entry.role === "teacher" ? "bg-green-100 text-green-600" :
                  entry.role === "board" ? "bg-purple-100 text-purple-600" :
                  "bg-slate-100 text-slate-500"
                }`}>
                  {entry.role === "student" ? "👤" : entry.role === "teacher" ? "🤖" : entry.role === "board" ? "📝" : "ℹ️"}
                </span>
                <span className="capitalize">{entry.role}</span>
                <span className="ml-auto text-[10px] text-muted-foreground/60">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-foreground">{entry.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Mode Switcher Overlay ──────────────────────────────────── */

function ModeSwitcherOverlay({
  currentMode,
  onSelect,
  onClose,
}: {
  currentMode: LearningMode;
  onSelect: (mode: LearningMode) => void;
  onClose: () => void;
}) {
  return (
    <div className="question-prompt-wrapper" role="dialog" aria-label="Learning mode selector">
      <div className="question-prompt-content max-w-lg">
        <h3 className="question-prompt-title flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Choose Learning Mode
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Select how you want to learn. You can change this at any time.
        </p>
        <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {LEARNING_MODES.map((mode) => (
            <button
              key={mode.key}
              onClick={() => onSelect(mode.key)}
              className={`mode-switch-button ${currentMode === mode.key ? "active" : ""}`}
            >
              {currentMode === mode.key && <Check className="h-3.5 w-3.5" />}
              {mode.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </div>
  );
}

export { LearningWhiteboard };
