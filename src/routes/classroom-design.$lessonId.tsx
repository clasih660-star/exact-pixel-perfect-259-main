import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Mic,
  Send,
  Pause,
  Volume2,
  VolumeX,
  PencilRuler,
  MessageSquare,
  Loader2,
  MicOff,
  HelpCircle,
  Repeat,
  Lightbulb,
  Snail,
  Target,
  CheckCircle2,
  XCircle,
  Trophy,
  Brain,
  Focus,
  Eye,
  EyeOff,
  Subtitles,
  Play,
  Star,
} from "lucide-react";
import { getLesson, type Lesson } from "@/lib/lessons";
import {
  initialLessonState,
  LESSON_STEPS,
  STEP_LABELS,
  type ChatTurn,
  type LessonState,
  type QuizQuestion,
  type TeacherResponse,
  type TeacherState,
} from "@/lib/teacher-types";
import { teacherTurn } from "@/lib/teacher.functions";
import { updateLessonProgress } from "@/lib/student.functions";
import { speak, stopSpeech, createRecognizer } from "@/lib/speech";
import { QuizCard } from "@/components/QuizCard";
import { requireClientAuthRoute } from "@/lib/route-guards";
import "@/styles/design-system.css";

export const Route = createFileRoute("/classroom-design/$lessonId")({
  beforeLoad: () => requireClientAuthRoute(),
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.lesson.title} — Klassruum` : "Classroom — Klassruum" },
      { name: "description", content: loaderData?.lesson.description ?? "Live AI classroom." },
    ],
  }),
  notFoundComponent: () => (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ fontFamily: "var(--font-main)" }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <Link to="/student/dashboard" className="mt-4 inline-block text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  ),
  component: ClassroomDesign,
});

type BoardState = { title: string; lines: string[]; highlight?: string };
const INITIAL_BOARD: BoardState = {
  title: "Ready to start",
  lines: ['Click "Begin lesson" or say hello to Mr. Klass.'],
};

function ClassroomDesign() {
  const { lesson } = Route.useLoaderData() as { lesson: Lesson };
  const sendTurn = useServerFn(teacherTurn);

  const [state, setState] = useState<LessonState>(initialLessonState);
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognizerRef = useRef<ReturnType<typeof createRecognizer>>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => () => stopSpeech(), []);

  const persistProgressFn = useServerFn(updateLessonProgress);
  const startTimeRef = useRef(Date.now());

  function persistProgress(s: LessonState) {
    const stepIdx = LESSON_STEPS.indexOf(s.step);
    const pct = Math.round(((stepIdx + 1) / LESSON_STEPS.length) * 100);
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 60000);
    persistProgressFn({
      data: {
        lesson_id: "00000000-0000-0000-0000-000000000000",
        course_id: "00000000-0000-0000-0000-000000000000",
        institution_id: "00000000-0000-0000-0000-000000000000",
        current_step: s.step,
        progress_percentage: pct,
        confusion_score: s.confusionScore,
        student_level: s.studentLevel,
        status: s.step === "summary" ? "completed" : "in_progress",
        time_spent_minutes: elapsed,
      },
    }).catch(() => {
      /* silent */
    });
  }

  async function runTurn(studentText: string) {
    if (loading) return;
    setError(null);
    setMessages((m) => [...m, { role: "student", text: studentText }]);
    setLoading(true);
    setTeacherState("thinking");
    try {
      const res: TeacherResponse = await sendTurn({
        data: {
          lessonId: lesson.id,
          history: [...messages, { role: "student", text: studentText }],
          state,
          studentMessage: studentText,
        },
      });

      setMessages((m) => [...m, { role: "teacher", text: res.speak }]);
      setBoard(res.board);

      let teacherState: TeacherState = "speaking";
      if (res.evaluation === "correct") teacherState = "encouraging";
      else if (res.evaluation === "incorrect") teacherState = "correcting";
      else if (res.nextStep === "example") teacherState = "explaining";

      setState((prev) => {
        const next: LessonState = {
          ...prev,
          step: res.nextStep,
          teacherState,
          confusionScore: Math.max(0, Math.min(1, prev.confusionScore + res.confusionDelta)),
          correct: prev.correct + (res.evaluation === "correct" ? 1 : 0),
          mistakes: prev.mistakes + (res.evaluation === "incorrect" ? 1 : 0),
        };
        persistProgress(next);
        return next;
      });

      if (res.quiz) {
        setQuiz(res.quiz);
        setQuizAnswered(null);
      }

      if (!muted && res.speak) {
        setSpeaking(true);
        speak(res.speak, () => {
          setSpeaking(false);
          setTeacherState("listening");
        });
      } else {
        setTeacherState("listening");
      }
    } catch (e: unknown) {
      const msg = (e as Error)?.message || "Something went wrong";
      if (msg.includes("RATE_LIMIT"))
        setError("You're going a bit fast — wait a moment and try again.");
      else if (msg.includes("CREDITS_EXHAUSTED"))
        setError("AI credits exhausted on this workspace. Add credits to continue.");
      else setError("Mr. Klass had trouble responding. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t) return;
    setInput("");
    runTurn(t);
  }

  function quickAction(text: string) {
    runTurn(text);
  }

  function toggleListen() {
    if (listening) {
      recognizerRef.current?.stop();
      setTeacherState("listening");
      return;
    }
    if (!recognizerRef.current) recognizerRef.current = createRecognizer();
    const rec = recognizerRef.current;
    if (!rec) {
      setError("Voice input isn't supported in this browser. Type instead.");
      return;
    }
    rec.onresult = (ev: any) => {
      const transcript = ev.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setTeacherState("thinking");
        runTurn(transcript);
      }
    };
    rec.onend = () => {
      setListening(false);
      setTeacherState("listening");
    };
    rec.onerror = () => {
      setListening(false);
      setTeacherState("listening");
    };
    try {
      rec.start();
      setListening(true);
      setTeacherState("listening");
    } catch {
      setListening(false);
      setTeacherState("listening");
    }
  }

  function toggleMute() {
    setMuted((m) => {
      if (!m) stopSpeech();
      return !m;
    });
  }

  function setTeacherState(newState: TeacherState) {
    setState((prev) => ({ ...prev, teacherState: newState }));
  }

  function toggleFocusMode() {
    setFocusMode(!focusMode);
  }

  function toggleCaptions() {
    setShowCaptions(!showCaptions);
  }

  function answerQuiz(idx: number) {
    if (!quiz || quizAnswered !== null) return;
    setQuizAnswered(idx);
    const correct = idx === quiz.correctIndex;
    setState((s) => ({
      ...s,
      correct: s.correct + (correct ? 1 : 0),
      mistakes: s.mistakes + (correct ? 0 : 1),
    }));
    setTimeout(() => {
      runTurn(
        correct
          ? `My answer: "${quiz.options[idx]}" — that's my pick.`
          : `I picked "${quiz.options[idx]}" but I think I got it wrong.`,
      );
      setQuiz(null);
      setQuizAnswered(null);
    }, 1200);
  }

  const isInitial = messages.length === 0;
  const stepIdx = LESSON_STEPS.indexOf(state.step);
  const progress = Math.round(((stepIdx + 1) / LESSON_STEPS.length) * 100);

  return (
    <>
      <LessonTopBar lesson={lesson} progress={progress} step={state.step} />

      <div className="lesson-layout">
        <AIPanel teacherState={state.teacherState} step={state.step} />

        <div className="lesson-main">
          <div className="lesson-content">
            <div className="lesson-title-bar">
              <h1 className="lesson-title">{lesson.title}</h1>
              <div className="lesson-actions">
                <button className="lesson-action-btn">
                  <Repeat className="w-4 h-4" /> Replay
                </button>
                <button className="lesson-action-btn">
                  <Focus className="w-4 h-4" /> Focus Mode
                </button>
              </div>
            </div>

            <div className="equation-box">{board.title}</div>

            <div className="steps-row">
              <div className="steps-col">
                <StepBlock
                  label="Step 1"
                  labelColor="blue"
                  text="Let's start by understanding the problem"
                />
                <StepBlock
                  label="Step 2"
                  labelColor="green"
                  text="Break it down into smaller parts"
                />
                <StepBlock label="Step 3" labelColor="orange" text="Apply the formula and solve" />

                <KeyConceptCard
                  title="Key Concept"
                  text="The distributive property helps us multiply expressions efficiently"
                />

                <RememberCard
                  title="Remember"
                  text="Always check your work by plugging the answer back into the original equation"
                />
              </div>

              <div className="steps-col">
                <GridVisual />
              </div>
            </div>

            {speaking && (
              <div className="ai-speaking-bar">
                <Volume2 className="speaking-icon" />
                <span className="speaking-text">
                  <strong>Mr. Klass is speaking:</strong> {messages[messages.length - 1]?.text}
                </span>
              </div>
            )}
          </div>
        </div>

        <ChatPanel
          messages={messages}
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          quiz={quiz}
          quizAnswered={quizAnswered}
          onAnswerQuiz={answerQuiz}
          quickActions={quickAction}
          isInitial={isInitial}
        />
      </div>

      <AudioBar
        listening={listening}
        muted={muted}
        speaking={speaking}
        onToggleListen={toggleListen}
        onToggleMute={toggleMute}
        onStopSpeech={() => stopSpeech()}
      />
    </>
  );
}

function LessonTopBar({
  lesson,
  progress,
  step,
}: {
  lesson: Lesson;
  progress: number;
  step: string;
}) {
  return (
    <header className="lesson-topbar">
      <div className="logo-wrap">
        <Link to="/student/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      <div className="breadcrumb">
        <span>Dashboard</span>
        <span className="sep">/</span>
        <span>My Courses</span>
        <span className="sep">/</span>
        <span className="current">{lesson.title}</span>
      </div>

      <div className="lesson-progress-wrap">
        <span className="lesson-progress-label">Progress</span>
        <div className="lesson-progress-bar">
          <div className="lesson-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="lesson-progress-pct">{progress}%</span>
      </div>

      <button className="learning-access-btn">
        <Star className="w-4 h-4" /> Pro Access
      </button>
    </header>
  );
}

function AIPanel({ teacherState, step }: { teacherState: TeacherState; step: string }) {
  const getStateText = (state: TeacherState) => {
    switch (state) {
      case "listening":
        return "Listening to you…";
      case "thinking":
        return "Thinking…";
      case "speaking":
        return "Speaking…";
      case "explaining":
        return "Explaining…";
      case "correcting":
        return "Let me help you…";
      case "encouraging":
        return "Great job!";
      default:
        return "Ready";
    }
  };

  const isSpeaking = teacherState === "speaking" || teacherState === "explaining";

  return (
    <aside className="ai-panel">
      <div className="ai-panel-header">
        <span className="ai-panel-title">Mr. Klass</span>
        <div className="online-badge">
          <span className="online-dot"></span>
          Online
        </div>
      </div>

      <div className="ai-avatar-wrap">
        <div className="ai-avatar">
          <div className="ai-avatar-placeholder">👨‍🏫</div>
        </div>

        {isSpeaking && (
          <div className="ai-speaking">
            <span className="sound-bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>{getStateText(teacherState)}</span>
          </div>
        )}

        <p className="ai-desc">Your AI math teacher</p>
      </div>

      <div className="ai-tags">
        <span className="ai-tag active">Algebra</span>
        <span className="ai-tag">Calculus</span>
        <span className="ai-tag">Geometry</span>
      </div>

      <div className="divider"></div>

      <div className="current-step-box">
        <div className="current-step-label">
          <span>CURRENT STEP</span>
          <span className="current-step-num">2/5</span>
        </div>
        <div className="current-step-name">{(STEP_LABELS as Record<string, string>)[step]}</div>
        <p className="current-step-desc">Working through the problem together</p>
      </div>

      <div className="divider"></div>

      <div className="last-explanation-box">
        <div className="last-exp-label">
          <Repeat className="w-3 h-3" />
          <span>LAST EXPLANATION</span>
        </div>
        <p className="last-exp-text">
          Let me explain this step by step. First, we need to identify the variables...
        </p>
      </div>

      <button className="replay-btn">
        <Play className="w-4 h-4" />
        Replay Audio
      </button>
    </aside>
  );
}

function StepBlock({
  label,
  labelColor,
  text,
}: {
  label: string;
  labelColor: string;
  text: string;
}) {
  return (
    <div className="step-block">
      <span className={`step-label ${labelColor}`}>{label}</span>
      <p className="step-text">{text}</p>
    </div>
  );
}

function KeyConceptCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="key-concept-card">
      <div className="key-concept-header">
        <Lightbulb className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <p className="key-concept-text">{text}</p>
    </div>
  );
}

function RememberCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="remember-card">
      <div className="remember-header">
        <Target className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <p className="remember-text">{text}</p>
    </div>
  );
}

function GridVisual() {
  return (
    <div className="grid-visual">
      <div className="grid-row">
        <div className="grid-cell header">×</div>
        <div className="grid-cell header">2</div>
        <div className="grid-cell header">3</div>
      </div>
      <div className="grid-row">
        <div className="grid-cell header">4</div>
        <div className="grid-cell blue-cell">8</div>
        <div className="grid-cell green-cell">12</div>
      </div>
      <div className="grid-row">
        <div className="grid-cell header">5</div>
        <div className="grid-cell orange-cell">10</div>
        <div className="grid-cell blue-cell">15</div>
      </div>
    </div>
  );
}

function ChatPanel({
  messages,
  input,
  setInput,
  onSubmit,
  loading,
  error,
  quiz,
  quizAnswered,
  onAnswerQuiz,
  quickActions,
  isInitial,
}: any) {
  const quickActionButtons = [
    {
      icon: HelpCircle,
      label: "I don't understand",
      msg: "I don't understand. Can you explain it differently?",
    },
    { icon: Repeat, label: "Repeat", msg: "Can you repeat that please?" },
    { icon: Lightbulb, label: "Give example", msg: "Give me a real-world example." },
  ];

  return (
    <aside className="chat-panel">
      <div className="chat-tabs">
        <button className="chat-tab active">
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </button>
        <button className="chat-tab">
          <HelpCircle className="w-4 h-4" />
          <span>Help</span>
        </button>
        <button className="chat-tab">
          <Lightbulb className="w-4 h-4" />
          <span>Tips</span>
        </button>
        <button className="chat-tab">
          <Target className="w-4 h-4" />
          <span>Quiz</span>
        </button>
      </div>

      <div className="chat-messages">
        {isInitial && (
          <div className="text-center text-sm text-gray-400">
            Start a conversation with Mr. Klass
          </div>
        )}

        {messages.map((m: any, i: number) =>
          m.role === "student" ? (
            <div key={i} className="msg-user">
              <div className="msg-bubble-user">{m.text}</div>
              <div className="msg-time">Just now</div>
            </div>
          ) : (
            <div key={i} className="msg-ai">
              <div className="msg-ai-avatar">👨‍🏫</div>
              <div>
                <div className="msg-bubble-ai">{m.text}</div>
                <div className="msg-time-ai">
                  <span>Just now</span>
                  <span>•</span>
                  <span>Click to play audio</span>
                </div>
              </div>
            </div>
          ),
        )}

        {quiz && <QuizCard quiz={quiz} answered={quizAnswered} onAnswer={onAnswerQuiz} />}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
          </div>
        )}

        {error && (
          <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div ref={useRef<HTMLDivElement>(null)} />
      </div>

      {!isInitial && (
        <>
          <div className="chat-quick-btns">
            {quickActionButtons.map((action) => (
              <button
                key={action.label}
                onClick={() => quickActions(action.msg)}
                disabled={loading}
                className="quick-btn"
              >
                <action.icon className="w-3 h-3 inline mr-1" />
                {action.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mr. Klass…"
              disabled={loading}
            />
            <button type="button" className="chat-mic-btn">
              <Mic className="w-4 h-4" />
            </button>
            <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </aside>
  );
}

function AudioBar({ listening, muted, speaking, onToggleListen, onToggleMute, onStopSpeech }: any) {
  return (
    <div className="audio-bar">
      <button className={`audio-btn ${listening ? "mic-active" : ""}`} onClick={onToggleListen}>
        {listening ? <Pause className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      <button className="audio-btn" onClick={onToggleMute}>
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      <button className="audio-btn" onClick={onStopSpeech}>
        <Pause className="w-4 h-4" />
      </button>

      <div className="sep-dot"></div>

      <button className="audio-on-btn">
        <Mic className="w-4 h-4" />
        {listening ? "Listening..." : "Start Talking"}
      </button>

      <div className="speed-control">1.0x</div>

      <div className="sep-dot"></div>

      <div className="audio-icon-btn">
        <span className="ico">🎯</span>
        <span>Focus</span>
      </div>

      <div className="audio-icon-btn">
        <span className="ico">📝</span>
        <span>Notes</span>
      </div>

      <Link to="/student/dashboard">
        <button className="end-lesson-btn">End Lesson</button>
      </Link>
    </div>
  );
}
