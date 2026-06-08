import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Brain, CircleCheck as CheckCircle2, ChevronRight, Clock3, Copy, Eye, EyeOff, Circle as HelpCircle, Lightbulb, Loader as Loader2, Mic, MicOff, Notebook, Play, CirclePlay as PlayCircle, Send, Settings, Sparkles, Bubbles as Subtitles, Target, Volume2, VolumeX, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { speak, stopSpeech, startListening, stopListening } from "@/lib/speech";
import { generateTeacherResponse } from "@/lib/ai-teacher";
import type {
  ClassroomContext,
  ClassroomMode,
  TeacherState,
  AudioState,
  BoardState,
} from "@/lib/types";
import { DEMO_QUICK_ACTIONS } from "@/lib/demo-data";
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
    items: [
      "Welcome to Quadratic Equations",
      "",
      "We will move from big idea to worked example",
      "Then practice, quiz, and summary",
    ],
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
    items: [
      "Summary",
      "1. Write in standard form",
      "2. Find the right pair",
      "3. Factor and solve",
    ],
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
        currentTranscript:
          "Your teacher is listening. Ask a question, continue, or try an example.",
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
        confusionScore: Math.max(
          0,
          Math.min(1, state.confusionScore + action.response.confusionDelta),
        ),
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
          currentTranscript:
            "No problem. Let us slow down. We only need two numbers: one pair that multiplies to 6 and adds to 5.",
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
            items: [
              "Another example:",
              "x² + 4x + 3 = 0",
              "",
              "Factored: (x + 1)(x + 3) = 0",
              "Answer: x = -1 or x = -3",
            ],
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
          board: {
            ...state.board,
            items: state.board.items.slice(0, 4),
          },
        };
      }
      if (action.action === "next_step") {
        const nextIndex = Math.min(STEP_ORDER.length - 1, state.stepIndex + 1);
        return {
          ...state,
          step: STEP_ORDER[nextIndex],
          stepIndex: nextIndex,
          board: BASE_BOARDS[STEP_ORDER[nextIndex]],
          progressPercentage: Math.min(
            100,
            Math.round(((nextIndex + 1) / STEP_ORDER.length) * 100),
          ),
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
            items: [
              "Quiz Time",
              "",
              "Let's test your understanding",
              "Choose the correct answer below",
            ],
            activeLineIndex: 0,
            description: "Quiz mode",
            mode: "quiz",
          },
          currentTranscript: "Here is a quick quiz to check your understanding.",
          quizQuestion: {
            question: "What are the solutions to x² - 9x + 20 = 0?",
            options: [
              "x = 2 and x = 10",
              "x = 4 and x = 5",
              "x = -4 and x = -5",
              "x = -2 and x = -10",
            ],
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
      return {
        ...state,
        focusMode: true,
        mode: "focus",
        activePanel: "access",
      };
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
      return {
        ...state,
        quizQuestion: action.quiz,
        activePanel: action.quiz ? "quiz" : state.activePanel,
      };
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
          ? {
              items: [
                "Correct!",
                "",
                "You found the right pair.",
                "Review the summary when ready.",
              ],
              activeLineIndex: 0,
              description: "Quiz correct",
              mode: "summary",
            }
          : {
              items: [
                "Let's correct the answer",
                "",
                "Review the factor pair again.",
                "Try one more time.",
              ],
              activeLineIndex: 0,
              description: "Quiz correction",
              mode: "correction",
            },
      };
    }
    case "SET_RATE":
      return {
        ...state,
        audio: { ...state.audio, rate: action.rate },
        lessonPace: action.rate <= 0.8 ? "slow" : action.rate >= 1.25 ? "fast" : "normal",
      };
    default:
      return state;
  }
}

function createInitialState(context: ClassroomContext): UIState {
  const stepIndex = Math.max(
    0,
    STEP_ORDER.indexOf(context.progress.currentStep as MachineLessonState["step"]),
  );
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
    board:
      BASE_BOARDS[context.progress.currentStep as MachineLessonState["step"]] ?? BASE_BOARDS.hook,
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
    })),
  );
  const [chatInput, setChatInput] = useState("");
  const [quickActions] = useState([
    "I don't understand",
    "Give me a real-world example.",
    "Please slow down and break it into smaller steps.",
    "Can you repeat that please?",
    "I'm ready â€” test me with a question.",
    "Why is this important? How will I use this in real life?",
  ]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const boardTimerRef = useRef<number | null>(null);
  const router = useRouter();

  const lesson = classroomContext.lesson;
  const currentStepData = lesson.steps[state.stepIndex] ?? lesson.steps[0];
  const activeSuggestions = useMemo(() => {
    if (state.mode === "quiz") {
      return ["Review the question", "Show me why", "Next question"];
    }
    if (state.mode === "focus") {
      return ["Slow down", "Read aloud", "Keep captions on"];
    }
    return [
      "Why do we use 2 and 3?",
      "Can you show another example?",
      "Can you explain factoring?",
    ];
  }, [state.mode]);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) stopListening(recognitionRef.current);
      if (boardTimerRef.current) window.clearInterval(boardTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!state.audio.playing) return;
    if (boardTimerRef.current) window.clearInterval(boardTimerRef.current);
    dispatch({
      type: "UPDATE_BOARD",
      content: state.board.items,
      description: state.board.description,
      mode: state.board.mode,
    });
    let index = 0;
    boardTimerRef.current = window.setInterval(() => {
      index += 1;
      dispatch({
        type: "UPDATE_BOARD",
        content: state.board.items.slice(0, Math.min(index + 1, state.board.items.length)),
        description: state.board.description,
        mode: state.board.mode,
      });
      if (index >= state.board.items.length) {
        if (boardTimerRef.current) window.clearInterval(boardTimerRef.current);
      }
    }, 500);
  }, [state.audio.playing]);

  const startLessonAudio = () => {
    dispatch({ type: "START_AUDIO" });
    const transcript = currentStepData.spokenScript;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "ai_teacher",
        message: transcript,
        createdAt: new Date().toISOString(),
      },
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
        {
          id: crypto.randomUUID(),
          sender: "ai_teacher",
          message: response.speak,
          createdAt: new Date().toISOString(),
        },
      ]);
      speak(response.speak, () => dispatch({ type: "AUDIO_ENDED" }));
    }, 650);
  };

  const handleQuickAction = (action: string) => {
    dispatch({ type: "QUICK_ACTION", action: mapQuickAction(action) });
    if (action === "I don't understand") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "system",
          message: "Needs more support",
          createdAt: new Date().toISOString(),
        },
      ]);
      speak("No problem. Let us slow down and break it into smaller steps.", () =>
        dispatch({ type: "AUDIO_ENDED" }),
      );
      return;
    }
    if (action === "Give me a real-world example.") {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "ai_teacher",
          message: "Let me show you another example using the same factoring pattern.",
          createdAt: new Date().toISOString(),
        },
      ]);
      speak("Let me show you another example using the same factoring pattern.", () =>
        dispatch({ type: "AUDIO_ENDED" }),
      );
      return;
    }
    if (action === "I'm ready â€” test me with a question.") {
      dispatch({
        type: "SET_QUIZ",
        quiz: {
          question: "What are the solutions to x² - 9x + 20 = 0?",
          options: [
            "x = 2 and x = 10",
            "x = 4 and x = 5",
            "x = -4 and x = -5",
            "x = -2 and x = -10",
          ],
          correctIndex: 1,
        },
      });
      speak("Great. Let us test your understanding with a quick quiz.", () =>
        dispatch({ type: "AUDIO_ENDED" }),
      );
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
      {
        id: crypto.randomUUID(),
        sender: "student",
        message: state.quizQuestion?.options[index] ?? "",
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        sender: "ai_teacher",
        message: correct
          ? "Excellent. That answer is correct."
          : "Not quite. Let us review the factor pair again.",
        createdAt: new Date().toISOString(),
      },
    ]);
    speak(
      correct
        ? "Excellent. That answer is correct."
        : "Not quite. Let us review the factor pair again.",
      () => dispatch({ type: "AUDIO_ENDED" }),
    );
  };

  const stepButtons = [
    { label: "Ask Question", action: "Can you explain factoring?" },
    { label: "Next Step", action: "next_step" },
    { label: "Give Example", action: "Give me a real-world example." },
    { label: "I don't understand", action: "I don't understand" },
  ];

  return (
    <div className={`min-h-screen bg-[var(--gray-50)] ${state.focusMode ? "focus-mode" : ""}`}>
      <header className="sticky top-0 z-40 border-b border-[var(--gray-200)] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2 rounded-full border border-[var(--gray-200)] bg-white px-3 py-2 text-sm font-semibold text-[var(--gray-700)] shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit
          </Link>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              {classroomContext.institution.name} • {classroomContext.course.title}
            </p>
            <h1 className="truncate text-lg font-black text-[var(--gray-900)]">{lesson.title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <BadgeChip
              icon={state.welcomeOpen ? Eye : EyeOff}
              text={state.welcomeOpen ? "Overlay on" : "Live mode"}
            />
            <BadgeChip
              icon={state.audio.playing ? Volume2 : VolumeX}
              text={state.audio.playing ? "Speaking" : "Listening"}
            />
            <BadgeChip icon={Settings} text={state.focusMode ? "Focus mode" : "Standard"} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)_360px] lg:px-6">
        <TeacherPanel state={state} currentStepData={currentStepData} />

        <div className="space-y-4">
          <BoardPanel state={state} currentStepData={currentStepData} />
          <InteractionTimeline state={state} messages={messages} />
        </div>

        <RightPanel
          state={state}
          setState={dispatch}
          classroomContext={classroomContext}
          messages={messages}
          setMessages={setMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleTeacherResponse={handleTeacherResponse}
          handleQuickAction={handleQuickAction}
          handleQuizAnswer={handleQuizAnswer}
          startLessonAudio={startLessonAudio}
          isListening={isListening}
          setIsListening={setIsListening}
          recognitionRef={recognitionRef}
          quickActions={quickActions}
          suggestions={activeSuggestions}
        />
      </main>

      <AudioBar
        state={state}
        onRateChange={(rate) => dispatch({ type: "SET_RATE", rate })}
        onEndLesson={onEndLesson}
      />

      {state.showCaptions && state.currentTranscript && (
        <div className="fixed bottom-[88px] left-0 right-0 z-30">
          <CaptionStrip transcript={state.currentTranscript} />
        </div>
      )}

      {state.welcomeOpen && (
        <WelcomeOverlay
          onStart={() => startLessonAudio()}
          onClose={() => dispatch({ type: "HIDE_OVERLAY" })}
        />
      )}
    </div>
  );
}

function BadgeChip({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gray-200)] bg-white px-3 py-2 text-xs font-semibold text-[var(--gray-700)] shadow-sm">
      <Icon className="h-3.5 w-3.5 text-[var(--primary)]" />
      {text}
    </div>
  );
}

function TeacherPanel({
  state,
  currentStepData,
}: {
  state: UIState;
  currentStepData: ClassroomContext["lesson"]["steps"][number];
}) {
  return (
    <Card className="overflow-hidden border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="border-b border-[var(--gray-200)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                Video Classroom
              </div>
              <h2 className="text-lg font-black text-[var(--gray-900)]">AI Teacher</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-600">Live</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full ${state.teacherState === "speaking" ? "animate-ping opacity-20" : ""} bg-[var(--primary)]`}
                style={{ animationDuration: "1.5s" }}
              />
              <div
                className={`relative h-32 w-32 rounded-full border-4 ${state.teacherState === "speaking" ? "border-[var(--primary)]" : "border-slate-600"} bg-gradient-to-br from-slate-700 to-slate-800 shadow-2xl`}
              >
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-600 to-slate-700" />
                <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <div
                    className={`h-16 w-16 rounded-full ${state.teacherState === "speaking" ? "animate-pulse" : ""} bg-gradient-to-br from-blue-400 to-purple-500`}
                  />
                </div>
              </div>
              {state.teacherState === "speaking" && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <div className="flex items-end gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-[var(--primary)]"
                        style={{
                          height: `${8 + Math.random() * 16}px`,
                          animation: "wave 0.5s ease-in-out infinite",
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Mr. Klass</p>
                <p className="text-xs text-slate-400">
                  {state.teacherState === "thinking"
                    ? "Processing..."
                    : state.teacherState === "speaking"
                      ? "Teaching..."
                      : "Listening..."}
                </p>
              </div>
              <div
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${state.teacherState === "speaking" ? "bg-blue-500/20 text-blue-400" : state.teacherState === "thinking" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"}`}
              >
                {state.teacherState}
              </div>
            </div>
          </div>

          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <div className="rounded-full bg-green-500/20 px-2.5 py-1 text-[10px] font-semibold text-green-400">
              AI Online
            </div>
            <div className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
              Voice Active
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--gray-200)] bg-slate-50 p-3 text-center text-xs text-slate-500">
          Video placeholder — WebRTC streaming will connect here in a future update
        </div>

        <div className="space-y-2 p-4">
          <div className="grid grid-cols-2 gap-2">
            <InfoChip label="Mode" value={state.mode} />
            <InfoChip label="Pace" value={state.lessonPace} />
            <InfoChip label="Confusion" value={`${Math.round(state.confusionScore * 100)}%`} />
            <InfoChip label="Progress" value={`${state.progressPercentage}%`} />
          </div>
          <div className="rounded-xl border border-[var(--gray-200)] bg-white p-3 text-center">
            <p className="text-xs text-[var(--gray-500)]">
              Step {state.stepIndex + 1} of {STEP_ORDER.length}
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--gray-900)]">
              {currentStepData.title}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-2.5 py-1.5 text-center shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--gray-400)]">
        {label}
      </p>
      <p className="text-sm font-bold text-[var(--gray-900)]">{value}</p>
    </div>
  );
}

function BoardPanel({
  state,
  currentStepData,
}: {
  state: UIState;
  currentStepData: ClassroomContext["lesson"]["steps"][number];
}) {
  return (
    <Card className="overflow-hidden border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-[var(--gray-200)] px-5 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              Whiteboard
            </div>
            <h3 className="mt-1 text-lg font-bold text-[var(--gray-900)]">
              {state.board.description}
            </h3>
          </div>
          <div className="rounded-full bg-[var(--gray-100)] px-3 py-1 text-xs font-semibold text-[var(--gray-700)]">
            {currentStepData.key.replaceAll("_", " ")}
          </div>
        </div>

        <div className="relative min-h-[420px] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--primary)] shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {state.board.mode.toUpperCase()} mode
            </div>
            <div className="space-y-2 font-serif text-lg text-[var(--gray-800)]">
              {state.board.items.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className={`rounded-xl px-3 py-2 transition-all duration-300 ${index === state.board.activeLineIndex ? "bg-[var(--primary-light)] font-semibold text-[var(--primary)]" : "text-[var(--gray-700)]"}`}
                >
                  {line || "\u00A0"}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-[var(--gray-200)] bg-white p-5 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              What is being explained
            </p>
            <p className="mt-1 text-sm text-[var(--gray-700)]">
              {currentStepData.simpleExplanation}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              What should I do next
            </p>
            <p className="mt-1 text-sm text-[var(--gray-700)]">
              {state.mode === "quiz"
                ? "Answer the quiz question below."
                : "Ask a question, continue, or try an example."}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              What changed
            </p>
            <p className="mt-1 text-sm text-[var(--gray-700)]">
              {state.currentTranscript || "No speech yet."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InteractionTimeline({
  state,
  messages,
}: {
  state: UIState;
  messages: Array<{ id: string; sender: string; message: string; createdAt: string }>;
}) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              Interaction Timeline
            </div>
            <h3 className="mt-1 text-lg font-bold text-[var(--gray-900)]">
              Every action echoes in the room
            </h3>
          </div>
          <div className="rounded-full bg-[var(--gray-100)] px-3 py-1 text-xs font-semibold text-[var(--gray-700)]">
            {messages.length} messages
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {messages.slice(-4).map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl border p-3 ${message.sender === "student" ? "border-[var(--primary)]/20 bg-[var(--primary-light)]" : message.sender === "ai_teacher" ? "border-[var(--gray-200)] bg-white" : "border-dashed border-[var(--gray-200)] bg-[var(--gray-50)]"}`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                {message.sender}
              </div>
              <p className="mt-1 text-sm text-[var(--gray-700)]">{message.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-4 text-sm text-[var(--gray-600)]">
          Current state: <span className="font-semibold text-[var(--gray-900)]">{state.mode}</span>.
          The board, transcript, and teacher panel all moved together.
        </div>
      </CardContent>
    </Card>
  );
}

function RightPanel({
  state,
  setState,
  classroomContext,
  messages,
  setMessages,
  chatInput,
  setChatInput,
  handleTeacherResponse,
  handleQuickAction,
  handleQuizAnswer,
  startLessonAudio,
  isListening,
  setIsListening,
  recognitionRef,
  quickActions,
  suggestions,
}: {
  state: UIState;
  setState: React.Dispatch<Action>;
  classroomContext: ClassroomContext;
  messages: Array<{ id: string; sender: string; message: string; createdAt: string }>;
  setMessages: React.Dispatch<
    React.SetStateAction<Array<{ id: string; sender: string; message: string; createdAt: string }>>
  >;
  chatInput: string;
  setChatInput: (value: string) => void;
  handleTeacherResponse: (message: string) => void;
  handleQuickAction: (action: string) => void;
  handleQuizAnswer: (index: number) => void;
  startLessonAudio: () => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>;
  quickActions: string[];
  suggestions: string[];
}) {
  return (
    <Card className="border-[var(--gray-200)]">
      <CardContent className="p-0">
        <div className="grid grid-cols-5 border-b border-[var(--gray-200)] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray-500)]">
          {(["steps", "chat", "quiz", "notes", "access"] as Panel[]).map((panel) => (
            <button
              key={panel}
              onClick={() => setState({ type: "SET_PANEL", panel })}
              className={`px-2 py-3 ${state.activePanel === panel ? "border-b-2 border-[var(--primary)] text-[var(--primary)]" : ""}`}
            >
              {panel}
            </button>
          ))}
        </div>

        <div className="h-[840px] overflow-auto">
          {state.activePanel === "steps" && <StepsTab state={state} setState={setState} />}
          {state.activePanel === "chat" && (
            <ChatTab
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleTeacherResponse={handleTeacherResponse}
              handleQuickAction={handleQuickAction}
              isListening={isListening}
              setIsListening={setIsListening}
              recognitionRef={recognitionRef}
              quickActions={quickActions}
              suggestions={suggestions}
            />
          )}
          {state.activePanel === "quiz" && (
            <QuizTab state={state} handleQuizAnswer={handleQuizAnswer} setState={setState} />
          )}
          {state.activePanel === "notes" && (
            <NotesTab state={state} classroomContext={classroomContext} setMessages={setMessages} />
          )}
          {state.activePanel === "access" && (
            <AccessTab state={state} setState={setState} startLessonAudio={startLessonAudio} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StepsTab({ state, setState }: { state: UIState; setState: React.Dispatch<Action> }) {
  return (
    <div className="space-y-3 p-4">
      {STEP_ORDER.map((stepKey, index) => {
        const done = index < state.stepIndex;
        const current = index === state.stepIndex;
        const locked = index > state.stepIndex + 1;
        const step = stepKey;
        return (
          <button
            key={stepKey}
            disabled={locked}
            onClick={() => setState({ type: "CHANGE_STEP", stepKey: step })}
            className={`w-full rounded-2xl border p-3 text-left transition ${
              current
                ? "border-[var(--primary)] bg-[var(--primary-light)]"
                : done
                  ? "border-[var(--green)]/30 bg-[var(--green-light)]/40"
                  : "border-[var(--gray-200)] bg-white"
            } ${locked ? "opacity-50" : "hover:-translate-y-0.5 hover:shadow-md"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--green)]" />
                ) : current ? (
                  <Target className="h-4 w-4 text-[var(--primary)]" />
                ) : (
                  <PlayCircle className="h-4 w-4 text-[var(--gray-400)]" />
                )}
                <span className="font-semibold text-[var(--gray-900)]">
                  {step.replaceAll("_", " ")}
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
                {locked ? "Locked" : current ? "Current" : done ? "Done" : "Available"}
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--gray-500)]">{BASE_BOARDS[step].description}</p>
          </button>
        );
      })}
    </div>
  );
}

function ChatTab({
  messages,
  chatInput,
  setChatInput,
  handleTeacherResponse,
  handleQuickAction,
  isListening,
  setIsListening,
  recognitionRef,
  quickActions,
  suggestions,
}: {
  messages: Array<{ id: string; sender: string; message: string; createdAt: string }>;
  chatInput: string;
  setChatInput: (value: string) => void;
  handleTeacherResponse: (message: string) => void;
  handleQuickAction: (action: string) => void;
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  recognitionRef: React.MutableRefObject<SpeechRecognition | null>;
  quickActions: string[];
  suggestions: string[];
}) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex-1 space-y-3 overflow-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-2xl border p-3 ${message.sender === "student" ? "ml-10 border-[var(--primary)]/20 bg-[var(--primary-light)]" : "mr-10 border-[var(--gray-200)] bg-white"}`}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gray-400)]">
              {message.sender}
            </div>
            <p className="mt-1 text-sm text-[var(--gray-700)]">{message.message}</p>
            {message.sender === "ai_teacher" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {["Replay", "Simplify", "Show on Board", "Save to Notes"].map((action) => (
                  <button
                    key={action}
                    className="rounded-full border border-[var(--gray-200)] px-3 py-1 text-xs font-semibold text-[var(--gray-600)]"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-[var(--gray-200)] pt-4">
        <div className="mb-3 grid grid-cols-2 gap-2">
          {quickActions.slice(0, 4).map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="rounded-xl border border-[var(--gray-200)] px-3 py-2 text-left text-xs font-semibold text-[var(--gray-600)]"
            >
              {action}
            </button>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setChatInput(suggestion)}
              className="rounded-full bg-[var(--gray-100)] px-3 py-1.5 text-xs font-semibold text-[var(--gray-700)]"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!chatInput.trim()) return;
            handleTeacherResponse(chatInput.trim());
            setChatInput("");
          }}
          className="flex items-center gap-2"
        >
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 rounded-2xl border border-[var(--gray-200)] px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`rounded-2xl border px-3 py-3 ${isListening ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]" : "border-[var(--gray-200)] bg-white text-[var(--gray-600)]"}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button type="submit" className="rounded-2xl bg-[var(--primary)] px-4 py-3 text-white">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function QuizTab({
  state,
  handleQuizAnswer,
  setState,
}: {
  state: UIState;
  handleQuizAnswer: (index: number) => void;
  setState: React.Dispatch<Action>;
}) {
  if (!state.quizQuestion) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div>
          <Brain className="mx-auto h-10 w-10 text-[var(--primary)]" />
          <h4 className="mt-3 text-lg font-bold text-[var(--gray-900)]">No quiz running yet</h4>
          <p className="mt-2 text-sm text-[var(--gray-500)]">
            Use the quiz quick action to start an in-class quiz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <QuizCard
        quiz={state.quizQuestion}
        answered={state.quizAnswered}
        onAnswer={handleQuizAnswer}
      />
      {state.quizScore && (
        <div className="mt-4 rounded-2xl border border-[var(--gray-200)] bg-white p-4">
          <div className="text-sm font-semibold text-[var(--gray-700)]">
            Score: {state.quizScore.correct}/{state.quizScore.total}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Review Mistakes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState({ type: "CHANGE_STEP", stepKey: "guided_practice" })}
            >
              Repeat Weak Step
            </Button>
            <Button size="sm" onClick={() => setState({ type: "SET_PANEL", panel: "notes" })}>
              Continue to Summary
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotesTab({
  state,
  classroomContext,
  setMessages,
}: {
  state: UIState;
  classroomContext: ClassroomContext;
  setMessages: React.Dispatch<
    React.SetStateAction<Array<{ id: string; sender: string; message: string; createdAt: string }>>
  >;
}) {
  const [draft, setDraft] = useState("");
  const noteText = [
    ...state.notes,
    ...classroomContext.lesson.steps.slice(0, state.stepIndex + 1).map((s) => s.simpleExplanation),
  ].join("\n");

  return (
    <div className="p-4">
      <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4">
        <textarea
          value={draft || noteText}
          onChange={(e) => setDraft(e.target.value)}
          className="min-h-[260px] w-full resize-none rounded-xl border border-[var(--gray-200)] p-3 text-sm outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            Save Board
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDraft((prev) => `${prev}\n• My note`)}
          >
            Add My Note
          </Button>
          <Button size="sm" variant="outline">
            Download Summary
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info("Reading notes aloud soon")}
          >
            Read Notes Aloud
          </Button>
        </div>
      </div>
    </div>
  );
}

function AccessTab({
  state,
  setState,
  startLessonAudio,
}: {
  state: UIState;
  setState: React.Dispatch<Action>;
  startLessonAudio: () => void;
}) {
  const items = [
    {
      label: "Captions On",
      enabled: state.showCaptions,
      onClick: () =>
        setState({ type: "UPDATE_ACCESS", profile: { showCaptions: !state.showCaptions } as any }),
    },
    { label: "Large Text", enabled: false, onClick: () => toast.info("Large text ready soon") },
    {
      label: "High Contrast",
      enabled: false,
      onClick: () => toast.info("High contrast ready soon"),
    },
    {
      label: "Reduce Motion",
      enabled: false,
      onClick: () => toast.info("Reduce motion ready soon"),
    },
    {
      label: "Slow Pace",
      enabled: state.lessonPace === "slow",
      onClick: () => setState({ type: "SET_RATE", rate: 0.75 }),
    },
    {
      label: "Focus Mode",
      enabled: state.focusMode,
      onClick: () =>
        setState(state.focusMode ? { type: "EXIT_FOCUS_MODE" } : { type: "ENTER_FOCUS_MODE" }),
    },
  ];

  return (
    <div className="p-4">
      <div className="grid gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`rounded-2xl border p-3 text-left text-sm font-semibold transition ${item.enabled ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]" : "border-[var(--gray-200)] bg-white text-[var(--gray-700)]"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-[var(--gray-200)] bg-[var(--gray-50)] p-4 text-sm text-[var(--gray-600)]">
        Applying access changes updates the classroom immediately and affects what happens when
        audio starts.
      </div>
      <div className="mt-4">
        <Button className="w-full" onClick={startLessonAudio}>
          Start Lesson Audio
        </Button>
      </div>
    </div>
  );
}

function AudioBar({
  state,
  onRateChange,
  onEndLesson,
}: {
  state: UIState;
  onRateChange: (rate: number) => void;
  onEndLesson: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--gray-200)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1">
          <button className="rounded-xl border border-[var(--gray-200)] p-2.5 text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]">
            {state.audio.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button className="rounded-xl border border-[var(--gray-200)] p-2.5 text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]">
            {state.audio.playing ? (
              <div className="h-4 w-4 rounded-sm bg-[var(--primary)]" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onRateChange(0.5)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${state.audio.rate === 0.5 ? "bg-[var(--primary)] text-white" : "border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]"}`}
          >
            0.5x
          </button>
          <button
            onClick={() => onRateChange(0.75)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${state.audio.rate === 0.75 ? "bg-[var(--primary)] text-white" : "border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]"}`}
          >
            0.75x
          </button>
          <button
            onClick={() => onRateChange(1)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${state.audio.rate === 1 ? "bg-[var(--primary)] text-white" : "border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]"}`}
          >
            1x
          </button>
          <button
            onClick={() => onRateChange(1.25)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${state.audio.rate === 1.25 ? "bg-[var(--primary)] text-white" : "border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]"}`}
          >
            1.25x
          </button>
          <button
            onClick={() => onRateChange(1.5)}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${state.audio.rate === 1.5 ? "bg-[var(--primary)] text-white" : "border border-[var(--gray-200)] text-[var(--gray-600)] hover:bg-[var(--gray-50)]"}`}
          >
            1.5x
          </button>
        </div>

        <div className="h-6 w-px bg-[var(--gray-200)]" />

        <div className="flex items-center gap-1">
          <button className="rounded-xl border border-[var(--gray-200)] p-2.5 text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]">
            <span className="text-xs font-bold">Replay</span>
          </button>
          <button className="rounded-xl border border-[var(--gray-200)] p-2.5 text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]">
            <Mic className="h-4 w-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-[var(--gray-200)]" />

        <div className="flex items-center gap-1">
          <button className="rounded-xl border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]">
            Repeat
          </button>
          <button className="rounded-xl border border-[var(--gray-200)] px-3 py-2 text-xs font-semibold text-[var(--gray-600)] transition hover:bg-[var(--gray-50)]">
            Give Example
          </button>
          <button className="rounded-xl border border-[var(--primary)] bg-[var(--primary-light)] px-3 py-2 text-xs font-semibold text-[var(--primary)] transition hover:bg-blue-100">
            Quiz Me
          </button>
        </div>

        <div className="ml-auto">
          <button
            onClick={onEndLesson}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600"
          >
            End Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

function CaptionStrip({ transcript }: { transcript: string }) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 rounded-2xl bg-[var(--gray-900)] px-4 py-3 text-white shadow-[0_-8px_30px_rgba(15,23,42,0.18)]">
        <Subtitles className="h-4 w-4 text-[var(--primary)]" />
        <div className="flex-1 text-sm">
          <span className="font-semibold text-[var(--primary)]">Mr. Klass:</span> {transcript}
        </div>
      </div>
    </div>
  );
}

function WelcomeOverlay({ onStart, onClose }: { onStart: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.55)] px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-white/20 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
        <div className="inline-flex items-center rounded-full bg-[var(--primary-light)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
          Welcome to Klassruum
        </div>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--gray-900)]">
          Your AI teacher is ready.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--gray-600)]">
          This lesson includes voice, captions, whiteboard steps, chat, quiz, and accessibility
          support.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={onStart}>
            <Sparkles className="mr-2 h-4 w-4" />
            Start Lesson Audio
          </Button>
          <Button variant="outline" onClick={onClose}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[var(--gray-50)] px-3 py-2 text-sm">
      <span className="text-[var(--gray-500)]">{label}</span>
      <span className="font-semibold text-[var(--gray-900)]">{value}</span>
    </div>
  );
}

function mapQuickAction(action: string) {
  if (action === "I don't understand") return "I don't understand. Can you explain it differently?";
  return action;
}
