import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  HelpCircle,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  Notebook,
  Play,
  PlayCircle,
  Send,
  Settings,
  Sparkles,
  Subtitles,
  Target,
  Volume2,
  VolumeX,
  Zap,
  Accessibility,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { speak, stopSpeech } from "@/lib/speech";
import { generateTeacherResponse } from "@/lib/ai-teacher";
import type { ClassroomContext, ClassroomMode, TeacherState, AudioState, BoardState } from "@/lib/types";
import type { LessonState as MachineLessonState } from "@/lib/teacher-types";
import { QuizCard, type QuizQuestion } from "@/components/QuizCard";

type Panel = "steps" | "chat" | "quiz" | "notes" | "access";

type UIState = MachineLessonState & {
  mode: ClassroomMode;
  audio: AudioState;
  board: BoardState;
  activePanel: Panel;
  focusMode: boolean;
  welcomeOpen: boolean;
  showCaptions: boolean;
  currentTranscript: string;
  lessonPace: "slow" | "normal" | "fast";
  quizQuestion: QuizQuestion | null;
  quizAnswered: number | null;
  quizScore: { correct: number; total: number } | null;
};

type Action =
  | { type: "START_AUDIO" }
  | { type: "AUDIO_ENDED" }
  | { type: "SEND_MESSAGE"; message: string }
  | { type: "RECEIVE_TEACHER_RESPONSE"; response: ReturnType<typeof generateTeacherResponse> }
  | { type: "QUICK_ACTION"; action: string }
  | { type: "CHANGE_STEP"; stepKey: MachineLessonState["step"] }
  | { type: "UPDATE_BOARD"; content: string[]; description?: string; mode?: BoardState["mode"] }
  | { type: "UPDATE_ACCESS"; profile: Partial<UIState> }
  | { type: "ENTER_FOCUS_MODE" }
  | { type: "EXIT_FOCUS_MODE" }
  | { type: "SHOW_OVERLAY" }
  | { type: "HIDE_OVERLAY" }
  | { type: "SET_PANEL"; panel: Panel }
  | { type: "SET_TRANSCRIPT"; transcript: string }
  | { type: "SET_QUIZ"; quiz: QuizQuestion | null }
  | { type: "ANSWER_QUIZ"; index: number }
  | { type: "SET_RATE"; rate: number };

const STEP_ORDER: MachineLessonState["step"][] = [
  "hook",
  "concept",
  "worked_example",
  "guided_practice",
  "independent_question",
  "correction",
  "quiz",
  "summary",
];

const BASE_BOARDS: Record<MachineLessonState["step"], BoardState> = {
  hook: {
    items: ["Welcome to Quadratic Equations", "", "We will move from big idea to worked example", "Then practice, quiz, and summary"],
    activeLineIndex: 0,
    description: "Big picture of the lesson",
    mode: "lesson",
  },
  concept: {
    items: ["Quadratic form:", "ax² + bx + c = 0", "", "a cannot be 0"],
    activeLineIndex: 0,
    description: "Definition and standard form",
    mode: "lesson",
  },
  worked_example: {
    items: ["Example:", "x² - 5x + 6 = 0", "", "(x - 2)(x - 3) = 0", "x = 2 or x = 3"],
    activeLineIndex: 0,
    description: "Factoring the example",
    mode: "example",
  },
  guided_practice: {
    items: ["Practice together:", "x² + 7x + 12 = 0", "", "Which pair works?", "3 and 4"],
    activeLineIndex: 0,
    description: "Guided practice",
    mode: "example",
  },
  independent_question: {
    items: ["Your turn:", "x² - 8x + 15 = 0", "", "Think of the pair", "Write your answer"],
    activeLineIndex: 0,
    description: "Independent attempt",
    mode: "lesson",
  },
  correction: {
    items: ["Let's review the mistake", "", "We need numbers that multiply to 15", "and add to -8"],
    activeLineIndex: 0,
    description: "Corrective feedback",
    mode: "correction",
  },
  quiz: {
    items: ["Quiz Time", "", "Find the solutions to x² - 9x + 20 = 0", "", "Choose carefully"],
    activeLineIndex: 0,
    description: "In-class quiz",
    mode: "quiz",
  },
  summary: {
    items: ["Summary", "1. Write in standard form", "2. Find the right pair", "3. Factor and solve"],
    activeLineIndex: 0,
    description: "Lesson recap",
    mode: "summary",
  },
};

function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case "START_AUDIO":
      return {
        ...state,
        welcomeOpen: false,
        mode: "teaching",
        teacherState: "speaking",
        audio: { ...state.audio, playing: true, paused: false },
        currentTranscript: state.currentTranscript || "Your AI teacher is ready.",
      };
    case "AUDIO_ENDED":
      return {
        ...state,
        mode: "listening",
        teacherState: "listening",
        audio: { ...state.audio, playing: false, paused: false },
        currentTranscript: "Your teacher is listening. Ask a question, continue, or try an example.",
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        mode: "answering",
        teacherState: "thinking",
        audio: { ...state.audio, playing: false },
        currentTranscript: action.message,
      };
    case "RECEIVE_TEACHER_RESPONSE":
      return {
        ...state,
        teacherState: action.response.evaluation === "incorrect" ? "correcting" : "speaking",
        mode: action.response.quiz ? "quiz" : state.mode,
        audio: { ...state.audio, playing: true },
        board: {
          items: action.response.board.lines,
          activeLineIndex: 0,
          description: action.response.board.title,
          mode: action.response.quiz
            ? "quiz"
            : action.response.evaluation === "incorrect"
              ? "correction"
              : state.board.mode,
        },
        step: action.response.nextStep,
        confusionScore: Math.max(0, Math.min(1, state.confusionScore + action.response.confusionDelta)),
        currentTranscript: action.response.speak,
        correct: action.response.evaluation === "correct" ? state.correct + 1 : state.correct,
        mistakes: action.response.evaluation === "incorrect" ? state.mistakes + 1 : state.mistakes,
        quizQuestion: action.response.quiz ?? state.quizQuestion,
      };
    case "QUICK_ACTION":
      if (action.action === "dont_understand") {
        return {
          ...state,
          mode: "teaching",
          teacherState: "encouraging",
          board: {
            items: ["Need two numbers", "Multiply to 6", "Add to 5", "Answer: 2 and 3"],
            activeLineIndex: 0,
            description: "Simpler explanation",
            mode: "correction",
          },
          currentTranscript: "No problem. Let us slow down. We only need two numbers: one pair that multiplies to 6 and adds to 5.",
          confusionScore: Math.min(1, state.confusionScore + 0.05),
          notes: [...state.notes, "Needs more support"],
          showCaptions: true,
        };
      }
      if (action.action === "give_example") {
        return {
          ...state,
          mode: "teaching",
          teacherState: "explaining",
          board: {
            items: ["Another example:", "x² + 4x + 3 = 0", "", "Factored: (x + 1)(x + 3) = 0", "Answer: x = -1 or x = -3"],
            activeLineIndex: 0,
            description: "Example mode",
            mode: "example",
          },
          currentTranscript: "Another example: x² + 4x + 3 = 0. We get the numbers 1 and 3.",
          notes: [...state.notes, "Example added"],
          activePanel: "notes",
        };
      }
      if (action.action === "slow_down") {
        return {
          ...state,
          lessonPace: "slow",
          audio: { ...state.audio, rate: 0.75 },
          currentTranscript: "Okay. I will slow down and explain one step at a time.",
          board: { ...state.board, items: state.board.items.slice(0, 4) },
        };
      }
      if (action.action === "next_step") {
        const nextIndex = Math.min(STEP_ORDER.length - 1, state.stepIndex + 1);
        return {
          ...state,
          step: STEP_ORDER[nextIndex],
          stepIndex: nextIndex,
          board: BASE_BOARDS[STEP_ORDER[nextIndex]],
          progressPercentage: Math.min(100, Math.round(((nextIndex + 1) / STEP_ORDER.length) * 100)),
          teacherState: "speaking",
          mode: nextIndex === STEP_ORDER.length - 1 ? "summary" : "teaching",
          currentTranscript: `Great. Let us move to ${STEP_ORDER[nextIndex].replaceAll("_", " ")}.`,
          notes: [...state.notes, `Moved to ${STEP_ORDER[nextIndex]}`],
        } as UIState;
      }
      if (action.action === "quiz_me") {
        return {
          ...state,
          mode: "quiz",
          activePanel: "quiz",
          teacherState: "speaking",
          board: {
            items: ["Quiz Time", "", "Let's test your understanding", "Choose the correct answer below"],
            activeLineIndex: 0,
            description: "Quiz mode",
            mode: "quiz",
          },
          currentTranscript: "Here is a quick quiz to check your understanding.",
          quizQuestion: {
            question: "What are the solutions to x² - 9x + 20 = 0?",
            options: ["x = 2 and x = 10", "x = 4 and x = 5", "x = -4 and x = -5", "x = -2 and x = -10"],
            correctIndex: 1,
          },
        };
      }
      return state;
    case "CHANGE_STEP": {
      const nextIndex = STEP_ORDER.indexOf(action.stepKey);
      return {
        ...state,
        step: action.stepKey,
        stepIndex: nextIndex,
        board: BASE_BOARDS[action.stepKey],
        progressPercentage: Math.min(100, Math.round(((nextIndex + 1) / STEP_ORDER.length) * 100)),
        activePanel: "steps",
        currentTranscript: `Jumped to ${action.stepKey.replaceAll("_", " ")}.`,
      };
    }
    case "UPDATE_BOARD":
      return {
        ...state,
        board: {
          items: action.content,
          activeLineIndex: 0,
          description: action.description ?? state.board.description,
          mode: action.mode ?? state.board.mode,
        },
      };
    case "UPDATE_ACCESS":
      return { ...state, ...(action.profile as Partial<UIState>) };
    case "ENTER_FOCUS_MODE":
      return { ...state, focusMode: true, mode: "focus", activePanel: "access" };
    case "EXIT_FOCUS_MODE":
      return { ...state, focusMode: false, mode: "listening" };
    case "SHOW_OVERLAY":
      return { ...state, welcomeOpen: true };
    case "HIDE_OVERLAY":
      return { ...state, welcomeOpen: false };
    case "SET_PANEL":
      return { ...state, activePanel: action.panel };
    case "SET_TRANSCRIPT":
      return { ...state, currentTranscript: action.transcript };
    case "SET_QUIZ":
      return { ...state, quizQuestion: action.quiz, activePanel: action.quiz ? "quiz" : state.activePanel };
    case "ANSWER_QUIZ": {
      if (!state.quizQuestion || state.quizAnswered !== null) return state;
      const isCorrect = action.index === state.quizQuestion.correctIndex;
      return {
        ...state,
        quizAnswered: action.index,
        quizScore: { correct: isCorrect ? 1 : 0, total: 1 },
        teacherState: isCorrect ? "encouraging" : "correcting",
        mode: "summary",
        board: isCorrect
          ? { items: ["Correct!", "", "You found the right pair.", "Review the summary when ready."], activeLineIndex: 0, description: "Quiz correct", mode: "summary" }
          : { items: ["Let's correct the answer", "", "Review the factor pair again.", "Try one more time."], activeLineIndex: 0, description: "Quiz correction", mode: "correction" },
      };
    }
    case "SET_RATE":
      return { ...state, audio: { ...state.audio, rate: action.rate }, lessonPace: action.rate <= 0.8 ? "slow" : action.rate >= 1.25 ? "fast" : "normal" };
    default:
      return state;
  }
}

function createInitialState(context: ClassroomContext): UIState {
  const stepIndex = Math.max(0, STEP_ORDER.indexOf(context.progress.currentStep as MachineLessonState["step"]));
  return {
    step: context.progress.currentStep as MachineLessonState["step"],
    studentLevel: context.progress.studentLevel as MachineLessonState["studentLevel"],
    confusionScore: context.progress.confusionScore,
    correct: 0,
    mistakes: 0,
    notes: [],
    teacherState: context.progress.teacherState as TeacherState,
    timeSpentMinutes: context.progress.timeSpentMinutes,
    mode: "intro",
    audio: {
      enabled: context.learnerAccessProfile.audioEnabled,
      playing: false,
      paused: false,
      muted: false,
      rate: context.learnerAccessProfile.speechRate || 1,
      currentTranscript: "",
    },
    board: BASE_BOARDS[context.progress.currentStep as MachineLessonState["step"]] ?? BASE_BOARDS.hook,
    activePanel: "chat",
    focusMode: context.learnerAccessProfile.focusModeEnabled,
    welcomeOpen: true,
    showCaptions: context.learnerAccessProfile.captionsEnabled,
    currentTranscript: "",
    lessonPace: (context.learnerAccessProfile.lessonPace as UIState["lessonPace"]) || "normal",
    quizQuestion: null,
    quizAnswered: null,
    quizScore: null,
    stepIndex,
    progressPercentage: context.progress.progressPercentage,
  };
}

export function InteractiveClassroomPage({
  classroomContext,
  sessionId,
  onEndLesson,
}: {
  classroomContext: ClassroomContext;
  sessionId: string;
  onEndLesson: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, createInitialState(classroomContext));
  const [messages, setMessages] = useState(
    classroomContext.messages.map((message) => ({
      ...message,
      sender: message.sender as "student" | "ai_teacher" | "system",
    }))
  );
  const [chatInput, setChatInput] = useState("");
  const [quickActions] = useState([
    "I don't understand",
    "Give me a real-world example.",
    "Please slow down.",
    "Can you repeat that?",
    "Test me with a question.",
    "Why is this important?",
  ]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const boardTimerRef = useRef<number | null>(null);

  const lesson = classroomContext.lesson;
  const currentStepData = lesson.steps[state.stepIndex] ?? lesson.steps[0];

  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) stopListening(recognitionRef.current);
      if (boardTimerRef.current) window.clearInterval(boardTimerRef.current);
    };
  }, []);

  const startLessonAudio = () => {
    dispatch({ type: "START_AUDIO" });
    const transcript = currentStepData.spokenScript;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "ai_teacher", message: transcript, createdAt: new Date().toISOString() },
    ]);
    speak(transcript, () => dispatch({ type: "AUDIO_ENDED" }));
    dispatch({ type: "SET_TRANSCRIPT", transcript });
  };

  const handleTeacherResponse = (message: string) => {
    dispatch({ type: "SEND_MESSAGE", message });
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "student", message, createdAt: new Date().toISOString() },
    ]);
    window.setTimeout(() => {
      const response = generateTeacherResponse(message, state, lesson);
      dispatch({ type: "RECEIVE_TEACHER_RESPONSE", response });
      dispatch({ type: "SET_TRANSCRIPT", transcript: response.speak });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "ai_teacher", message: response.speak, createdAt: new Date().toISOString() },
      ]);
      speak(response.speak, () => dispatch({ type: "AUDIO_ENDED" }));
    }, 650);
  };

  const handleQuickAction = (action: string) => {
    dispatch({ type: "QUICK_ACTION", action: mapQuickAction(action) });
    if (action === "I don't understand") {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "system", message: "Needs more support", createdAt: new Date().toISOString() },
      ]);
      speak("No problem. Let us slow down and break it into smaller steps.", () => dispatch({ type: "AUDIO_ENDED" }));
      return;
    }
    if (action === "Give me a real-world example.") {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "ai_teacher", message: "Let me show you another example using the same factoring pattern.", createdAt: new Date().toISOString() },
      ]);
      speak("Let me show you another example using the same factoring pattern.", () => dispatch({ type: "AUDIO_ENDED" }));
      return;
    }
    if (action === "Test me with a question.") {
      dispatch({
        type: "SET_QUIZ",
        quiz: {
          question: "What are the solutions to x² - 9x + 20 = 0?",
          options: ["x = 2 and x = 10", "x = 4 and x = 5", "x = -4 and x = -5", "x = -2 and x = -10"],
          correctIndex: 1,
        },
      });
      speak("Great. Let us test your understanding with a quick quiz.", () => dispatch({ type: "AUDIO_ENDED" }));
      return;
    }
    handleTeacherResponse(action);
  };

  const handleQuizAnswer = (index: number) => {
    if (!state.quizQuestion || state.quizAnswered !== null) return;
    dispatch({ type: "ANSWER_QUIZ", index });
    const correct = index === state.quizQuestion.correctIndex;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), sender: "student", message: state.quizQuestion?.options[index] ?? "", createdAt: new Date().toISOString() },
      {
        id: crypto.randomUUID(),
        sender: "ai_teacher",
        message: correct ? "Excellent. That answer is correct." : "Not quite. Let us review the factor pair again.",
        createdAt: new Date().toISOString(),
      },
    ]);
    speak(correct ? "Excellent. That answer is correct." : "Not quite. Let us review the factor pair again.", () => dispatch({ type: "AUDIO_ENDED" }));
  };

  return (
    <div className="lesson-layout flex h-screen flex-col bg-[var(--gray-50)]">
      {/* Lesson Top Bar */}
      <header className="lesson-topbar fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-[var(--gray-200)] bg-white px-4">
        <div className="logo-wrap flex items-center gap-3">
          <Link to="/student/dashboard" className="btn btn-outline flex items-center gap-2 px-3 py-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Link>
        </div>
        <div className="breadcrumb ml-4 flex items-center gap-2 text-sm">
          <span className="text-[var(--gray-400)]">{classroomContext.institution.name}</span>
          <span className="sep text-[var(--gray-300)]">/</span>
          <span className="text-[var(--gray-500)]">{classroomContext.course.title}</span>
          <span className="sep text-[var(--gray-300)]">/</span>
          <span className="current font-semibold text-[var(--gray-900)]">{lesson.title}</span>
        </div>
        <div className="lesson-progress-wrap ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full ${state.teacherState === "speaking" ? "bg-green-500" : "bg-[var(--gray-300)]"}`}>
              {state.teacherState === "speaking" ? (
                <Volume2 className="h-3.5 w-3.5 text-white" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-[var(--gray-600)]" />
              )}
            </div>
            <span className="text-xs font-medium text-[var(--gray-600)]">
              {state.teacherState === "speaking" ? "Speaking" : state.teacherState === "thinking" ? "Thinking..." : "Listening"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="lesson-progress-label text-xs text-[var(--gray-500)]">Progress</span>
            <div className="lesson-progress-bar w-20 rounded-full bg-[var(--gray-200)]">
              <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${state.progressPercentage}%` }} />
            </div>
            <span className="lesson-progress-pct text-xs font-bold text-[var(--gray-800)]">{state.progressPercentage}%</span>
          </div>
          <Link to="/student/access" className="learning-access-btn flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
            <Accessibility className="h-3.5 w-3.5" />
            Learning Access
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div className="lesson-layout mt-14 flex flex-1">
        {/* AI Teacher Panel */}
        <aside className="ai-panel w-[265px] flex-shrink-0 border-r border-[var(--gray-200)] bg-white">
          <div className="ai-panel-header flex items-center justify-between px-4 pt-4">
            <span className="ai-panel-title text-sm font-bold text-[var(--gray-800)]">AI Teacher</span>
            <div className="online-badge flex items-center gap-1.5 text-xs text-green-600">
              <span className="online-dot h-2 w-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>

          {/* AI Avatar */}
          <div className="ai-avatar-wrap flex flex-col items-center px-4 py-4">
            <div className="ai-avatar relative h-[120px] w-[120px] rounded-full border-4 border-[var(--gray-200)] bg-gradient-to-br from-blue-100 to-purple-100">
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-200 to-purple-200" />
              <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-purple-300">
                <div className={`h-12 w-12 rounded-full ${state.teacherState === "speaking" ? "animate-pulse" : ""} bg-gradient-to-br from-blue-400 to-purple-400`} />
              </div>
              {state.teacherState === "speaking" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <div className="sound-bars flex items-end gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="block w-1 rounded-full bg-[var(--primary)]" style={{ height: `${6 + Math.random() * 10}px`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="ai-speaking mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--gray-800)]">
              {state.teacherState === "speaking" ? "Speaking..." : state.teacherState === "thinking" ? "Thinking..." : "Listening..."}
            </div>
            <p className="ai-desc mt-1 text-xs text-[var(--gray-500)]">Mr. Klass is your AI teacher</p>
          </div>

          {/* AI Tags */}
          <div className="ai-tags flex flex-wrap justify-center gap-2 px-4">
            <span className={`ai-tag rounded-full px-3 py-1 text-[10px] font-semibold ${state.mode === "quiz" ? "bg-orange-100 text-orange-600" : "bg-[var(--gray-100)] text-[var(--gray-600)]"}`}>
              {state.mode.toUpperCase()}
            </span>
            <span className="ai-tag rounded-full bg-[var(--primary-light)] px-3 py-1 text-[10px] font-semibold text-[var(--primary)]">
              {state.lessonPace.toUpperCase()} PACE
            </span>
          </div>

          <div className="divider mx-4 my-3 h-px bg-[var(--gray-100)]" />

          {/* Current Step */}
          <div className="current-step-box px-4 py-3">
            <div className="current-step-label flex justify-between text-xs text-[var(--gray-400)]">
              <span>Current Step</span>
              <span className="current-step-num font-semibold text-orange-500">
                {state.stepIndex + 1} of {STEP_ORDER.length}
              </span>
            </div>
            <p className="current-step-name mt-2 text-sm font-bold text-[var(--gray-800)]">{currentStepData.title}</p>
            <p className="current-step-desc mt-1 text-xs leading-relaxed text-[var(--gray-500)]">
              {currentStepData.simpleExplanation}
            </p>
          </div>

          <div className="divider mx-4 h-px bg-[var(--gray-100)]" />

          {/* Last Explanation */}
          <div className="last-explanation-box flex-1 px-4 py-3">
            <div className="last-exp-label flex items-center gap-1.5 text-xs text-[var(--gray-400)]">
              <Lightbulb className="h-3.5 w-3.5" />
              Last Explanation
            </div>
            <p className="last-exp-text mt-2 text-xs leading-relaxed text-[var(--gray-600)]">
              {state.currentTranscript || "No speech yet. Start the lesson audio."}
            </p>
          </div>

          {/* Replay Button */}
          <button
            className="replay-btn mx-4 mb-4 flex items-center justify-center gap-2 rounded-lg border border-[var(--gray-200)] bg-white py-2.5 text-xs font-medium text-[var(--gray-600)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
            onClick={startLessonAudio}
          >
            <Play className="h-4 w-4" />
            Replay Last Audio
          </button>
        </aside>

        {/* Main Content */}
        <main className="lesson-main flex-1 overflow-y-auto">
          <div className="lesson-content p-6">
            {/* Lesson Title Bar */}
            <div className="lesson-title-bar mb-6 flex items-center justify-between">
              <h2 className="lesson-title text-xl font-bold text-[var(--gray-900)]">{lesson.title}</h2>
              <div className="lesson-actions flex items-center gap-2">
                <button className="lesson-action-btn flex items-center gap-1.5 rounded-lg border border-[var(--gray-200)] bg-white px-3 py-1.5 text-xs text-[var(--gray-600)] hover:border-[var(--primary)] hover:text-[var(--primary)]">
                  <Notebook className="h-3.5 w-3.5" />
                  Notes
                </button>
                <button className="lesson-action-btn flex items-center gap-1.5 rounded-lg border border-[var(--gray-200)] bg-white px-3 py-1.5 text-xs text-[var(--gray-600)] hover:border-[var(--primary)] hover:text-[var(--primary)]">
                  <Copy className="h-3.5 w-3.5" />
                  Copy Board
                </button>
              </div>
            </div>

            {/* Equation Box */}
            <div className="equation-box mb-6 rounded-lg border border-[var(--gray-200)] bg-white p-6 text-center font-serif text-2xl italic text-[var(--gray-800)]">
              {state.board.items[0] || "ax² + bx + c = 0"}
            </div>

            {/* Steps Row */}
            <div className="steps-row grid gap-6 lg:grid-cols-[1fr_240px]">
              {/* Main Steps Content */}
              <div className="steps-col space-y-4">
                {state.board.items.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className={`step-block rounded-lg p-3 transition-all ${
                      index === state.board.activeLineIndex
                        ? "border-l-4 border-[var(--primary)] bg-[var(--primary-light)]"
                        : "border border-[var(--gray-200)] bg-white"
                    }`}
                  >
                    <p className="step-text font-serif text-base text-[var(--gray-700)]">{line || "\u00A0"}</p>
                  </div>
                ))}

                {/* Key Concept Card */}
                <div className="key-concept-card rounded-lg border border-green-200 bg-green-50 p-5">
                  <div className="key-concept-header flex items-center gap-2 font-bold text-green-600">
                    <Lightbulb className="h-4 w-4" />
                    Key Concept
                  </div>
                  <p className="key-concept-text mt-2 font-serif text-sm leading-relaxed text-[var(--gray-600)]">
                    {currentStepData.simpleExplanation}
                  </p>
                </div>
              </div>

              {/* Step Navigator */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-400)]">Lesson Steps</p>
                {STEP_ORDER.map((stepKey, index) => {
                  const done = index < state.stepIndex;
                  const current = index === state.stepIndex;
                  const locked = index > state.stepIndex + 1;
                  return (
                    <button
                      key={stepKey}
                      disabled={locked}
                      onClick={() => dispatch({ type: "CHANGE_STEP", stepKey })}
                      className={`w-full rounded-lg border p-3 text-left text-xs font-medium transition-all ${
                        current
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : done
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-[var(--gray-200)] bg-white text-[var(--gray-500)]"
                      } ${locked ? "opacity-50" : "hover:shadow-md"}`}
                    >
                      <div className="flex items-center gap-2">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : current ? (
                          <Play className="h-4 w-4 text-white" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-[var(--gray-300)]" />
                        )}
                        <span className={current ? "font-bold" : ""}>
                          {stepKey.replaceAll("_", " ")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Speaking Bar */}
          <div className="ai-speaking-bar flex items-center gap-3 bg-[var(--gray-900)] px-5 py-4 text-sm text-white">
            <Subtitles className="speaking-icon h-5 w-5 text-[var(--primary)]" />
            <div className="speaking-text flex-1">
              <strong className="text-[var(--primary)]">Mr. Klass:</strong> {state.currentTranscript || "Ready to begin."}
            </div>
          </div>
        </main>

        {/* Chat Panel */}
        <aside className="chat-panel w-[300px] flex-shrink-0 border-l border-[var(--gray-200)] bg-white">
          {/* Chat Tabs */}
          <div className="chat-tabs grid grid-cols-4 border-b border-[var(--gray-200)]">
            {(["steps", "chat", "quiz", "notes"] as Panel[]).map((panel) => (
              <button
                key={panel}
                onClick={() => dispatch({ type: "SET_PANEL", panel })}
                className={`chat-tab flex flex-col items-center gap-1 px-2 py-3 text-[10px] font-medium ${
                  state.activePanel === panel
                    ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                    : "text-[var(--gray-400)] hover:text-[var(--gray-600)]"
                }`}
              >
                {panel === "steps" && <Target className="h-4 w-4" />}
                {panel === "chat" && <Send className="h-4 w-4" />}
                {panel === "quiz" && <Brain className="h-4 w-4" />}
                {panel === "notes" && <Notebook className="h-4 w-4" />}
                <span className="capitalize">{panel}</span>
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="h-[calc(100vh-220px)] overflow-y-auto p-4">
            {state.activePanel === "steps" && (
              <div className="space-y-2">
                {STEP_ORDER.map((stepKey, index) => {
                  const done = index < state.stepIndex;
                  const current = index === state.stepIndex;
                  return (
                    <button
                      key={stepKey}
                      onClick={() => dispatch({ type: "CHANGE_STEP", stepKey })}
                      className={`w-full rounded-lg border p-3 text-left text-xs font-medium transition-all ${
                        current
                          ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                          : done
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-[var(--gray-200)] bg-white text-[var(--gray-600)]"
                      }`}
                    >
                      {stepKey.replaceAll("_", " ")}
                    </button>
                  );
                })}
              </div>
            )}

            {state.activePanel === "chat" && (
              <div className="flex h-full flex-col">
                <div className="chat-messages flex-1 space-y-3 overflow-y-auto">
                  {messages.slice(-8).map((message) => (
                    <div key={message.id} className={message.sender === "student" ? "msg-user flex justify-end" : "msg-ai flex gap-2"}>
                      {message.sender === "ai_teacher" && (
                        <div className="msg-ai-avatar flex h-7 w-7 items-end justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-lg">
                          🤖
                        </div>
                      )}
                      <div className={message.sender === "student" ? "msg-bubble-user rounded-xl bg-[var(--primary)] px-4 py-2 text-sm text-white" : "msg-bubble-ai rounded-xl border border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-2 text-sm text-[var(--gray-700)]"}>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {state.activePanel === "quiz" && state.quizQuestion && (
              <QuizCard quiz={state.quizQuestion} answered={state.quizAnswered} onAnswer={handleQuizAnswer} />
            )}

            {state.activePanel === "notes" && (
              <div className="space-y-3">
                <textarea
                  className="min-h-[200px] w-full resize-none rounded-lg border border-[var(--gray-200)] p-3 text-sm outline-none focus:border-[var(--primary)]"
                  placeholder="Take notes here..."
                  defaultValue={state.notes.join("\n")}
                />
                <Button size="sm" className="w-full">
                  Save Notes
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="chat-quick-btns grid grid-cols-3 gap-2 border-t border-[var(--gray-100)] px-3 py-3">
            {quickActions.slice(0, 3).map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="quick-btn rounded-lg border border-[var(--gray-200)] bg-white px-2 py-2 text-[10px] font-medium text-[var(--gray-600)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                {action.length > 18 ? action.slice(0, 18) + "..." : action}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="chat-input-row flex items-center gap-2 border-t border-[var(--gray-200)] px-4 py-3">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && chatInput.trim()) {
                  handleTeacherResponse(chatInput.trim());
                  setChatInput("");
                }
              }}
              placeholder="Ask a question..."
              className="chat-input flex-1 rounded-lg border border-[var(--gray-200)] bg-[var(--gray-50)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)] focus:bg-white"
            />
            <button
              onClick={() => setIsListening(!isListening)}
              className={`chat-mic-btn flex h-8 w-8 items-center justify-center rounded-full ${isListening ? "bg-green-100 text-green-600" : "text-[var(--gray-400)] hover:text-[var(--primary)]"}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                if (chatInput.trim()) {
                  handleTeacherResponse(chatInput.trim());
                  setChatInput("");
                }
              }}
              className="chat-send-btn flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </div>

      {/* Audio Bar */}
      <div className="audio-bar fixed bottom-0 left-[265px] right-[300px] flex h-16 items-center justify-center gap-3 border-t border-[var(--gray-200)] bg-white px-6 shadow-sm">
        <button className="audio-btn flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]">
          {state.audio.playing ? <div className="h-3 w-3 rounded-sm bg-[var(--primary)]" /> : <Play className="h-4 w-4" />}
        </button>

        <button className="audio-btn flex h-10 w-10 items-center justify-center rounded-full bg-[var(--gray-100)] text-[var(--gray-700)] hover:bg-[var(--gray-200)]">
          {state.audio.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <div className="sep-dot mx-2 h-6 w-px bg-[var(--gray-200)]" />

        <div className="flex items-center gap-1.5 rounded-lg bg-[var(--gray-100)] px-3 py-2">
          {[0.5, 0.75, 1, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => dispatch({ type: "SET_RATE", rate })}
              className={`rounded px-2 py-1 text-xs font-semibold transition ${
                state.audio.rate === rate ? "bg-[var(--primary)] text-white" : "text-[var(--gray-600)] hover:bg-[var(--gray-200)]"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        <div className="sep-dot mx-2 h-6 w-px bg-[var(--gray-200)]" />

        <button
          onClick={() => handleQuickAction("I don't understand")}
          className="audio-icon-btn flex min-w-[48px] flex-col items-center gap-1 text-[var(--gray-500)] hover:text-[var(--primary)]"
        >
          <HelpCircle className="ico h-5 w-5" />
          <span className="text-[10px]">Help</span>
        </button>

        <button
          onClick={() => handleQuickAction("Give me a real-world example.")}
          className="audio-icon-btn flex min-w-[48px] flex-col items-center gap-1 text-[var(--gray-500)] hover:text-[var(--primary)]"
        >
          <Lightbulb className="ico h-5 w-5" />
          <span className="text-[10px]">Example</span>
        </button>

        <button
          onClick={() => handleQuickAction("Test me with a question.")}
          className="audio-icon-btn flex min-w-[48px] flex-col items-center gap-1 text-[var(--gray-500)] hover:text-[var(--primary)]"
        >
          <Target className="ico h-5 w-5" />
          <span className="text-[10px]">Quiz</span>
        </button>

        <div className="ml-auto">
          <button onClick={onEndLesson} className="end-lesson-btn flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600">
            End Lesson
          </button>
        </div>
      </div>

      {/* Welcome Overlay */}
      {state.welcomeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl">
            <div className="inline-flex items-center rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
              Welcome to Klassruum
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--gray-900)]">
              Your AI teacher is ready.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--gray-600)]">
              This lesson includes voice, captions, whiteboard steps, chat, quiz, and accessibility support.
            </p>
            <div className="mt-6 flex gap-3">
              <Button onClick={startLessonAudio}>
                <Sparkles className="mr-2 h-4 w-4" />
                Start Lesson Audio
              </Button>
              <Button variant="outline" onClick={() => dispatch({ type: "HIDE_OVERLAY" })}>
                Not now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function stopListening(recognition: SpeechRecognition) {
  recognition.stop();
}

function startListening(recognition: SpeechRecognition, onResult: (transcript: string) => void) {
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };
  recognition.start();
}

function mapQuickAction(action: string): string {
  if (action === "I don't understand") return "dont_understand";
  if (action === "Give me a real-world example.") return "give_example";
  if (action === "Please slow down.") return "slow_down";
  if (action === "Test me with a question.") return "quiz_me";
  return action.toLowerCase();
}
