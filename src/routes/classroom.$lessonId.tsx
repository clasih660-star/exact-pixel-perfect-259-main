import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getLesson, type Lesson } from "@/lib/lessons";
import {
  initialLessonState,
  LESSON_STEPS,
  STEP_LABELS,
  type ChatTurn,
  type LessonState,
  type LessonStep,
  type QuizQuestion,
  type TeacherResponse,
  type TeacherState,
} from "@/lib/teacher-types";
import { teacherTurn } from "@/lib/teacher.functions";
import { updateLessonProgress } from "@/lib/student.functions";
import { speak, stopSpeech, createRecognizer } from "@/lib/speech";
import { QuizCard } from "@/components/QuizCard";
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
} from "lucide-react";

// Local typing for handwriting speed (MVP future per-item speed)
type WritingSpeed = "slow" | "normal" | "fast";

export const Route = createFileRoute("/classroom/$lessonId")({
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
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Lesson not found</h1>
        <Link to="/student/dashboard" className="mt-4 inline-block text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    </div>
  ),
  component: Classroom,
});

type BoardState = {
  title: string;
  lines: string[];
  highlight?: string;
  // Optional collection of board items (for future per-item writing speed, etc.)
  items?: import("@/lib/classroom-video-types").BoardWriteItem[];
  currentItemIndex?: number;
};
const INITIAL_BOARD: BoardState = {
  title: "Ready to start",
  lines: ['Click "Begin lesson" or say hello to Mr. Klass.'],
};

function Classroom() {
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

  // Persist lesson progress to DB (best-effort, fire-and-forget)
  const persistProgressFn = useServerFn(updateLessonProgress);
  const startTimeRef = useRef(Date.now());

  function persistProgress(s: LessonState) {
    // Demo lessons don't have DB records, so best-effort persist
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
        // Persist progress after each turn (fire-and-forget)
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
    rec.onresult = (ev) => {
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

  return (
    <div className="flex h-screen flex-col bg-background">
      <TopBar
        lesson={lesson}
        state={state}
        focusMode={focusMode}
        onToggleFocus={toggleFocusMode}
        showCaptions={showCaptions}
        onToggleCaptions={toggleCaptions}
      />

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[22%_52%_26%]">
        {/* Stage: avatar + whiteboard + voice */}
        <section
          className={`flex min-h-0 flex-col overflow-hidden ${focusMode ? "lg:col-span-3" : ""}`}
        >
          <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr] gap-4 p-4">
            <Avatar teacherState={state.teacherState} />
            <Whiteboard board={board} step={state.step} setTeacherState={setTeacherState} />
          </div>

          <div className="border-t border-border bg-card p-4">
            {isInitial ? (
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => runTurn("Hi Mr. Klass, I'm ready to start the lesson.")}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Begin lesson
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Mr. Klass will greet you and start teaching.
                </p>
              </div>
            ) : (
              <>
                <div className="mx-auto flex max-w-xl items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleMute}
                    aria-label="Toggle teacher voice"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="lg"
                    onClick={toggleListen}
                    disabled={loading}
                    className={`h-14 w-14 rounded-full shadow-[var(--shadow-brand)] ${listening ? "animate-pulse" : ""}`}
                    aria-label="Talk to teacher"
                  >
                    {listening ? <Pause className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={stopSpeech}
                    aria-label="Stop teacher speaking"
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  {listening
                    ? "Listening…"
                    : loading
                      ? "Mr. Klass is thinking…"
                      : "Tap mic to talk · or type on the right"}
                </p>

                {/* Caption bar when enabled */}
                {showCaptions && state.teacherState === "speaking" && messages.length > 0 && (
                  <div className="mt-3 rounded-lg bg-black/80 p-3">
                    <p className="text-xs text-white font-mono">
                      {messages[messages.length - 1].text}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Chat + quick actions - hidden in focus mode */}
        {!focusMode && (
          <aside className="flex min-h-0 flex-col overflow-hidden border-t border-border bg-card lg:border-l lg:border-t-0">
            <div className="flex h-12 items-center gap-2 border-b border-border px-4 text-sm font-medium">
              <MessageSquare className="h-4 w-4 text-primary" /> Conversation
            </div>

            <div className="flex-1 space-y-3 overflow-auto p-4">
              {isInitial && (
                <p className="text-sm text-muted-foreground">
                  Mr. Klass will appear here. Press{" "}
                  <span className="font-medium">Begin lesson</span> to start.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "student" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "student"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {quiz && <QuizCard quiz={quiz} answered={quizAnswered} onAnswer={answerQuiz} />}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              )}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                  {error}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {!isInitial && (
              <div className="border-t border-border p-3">
                <QuickActions disabled={loading} onAction={quickAction} />
                <form onSubmit={handleSubmit} className="mt-2 flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Mr. Klass…"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={loading || !input.trim()}
                    aria-label="Send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </aside>
        )}

        {/* Side panel: progress / state - hidden in focus mode */}
        {!focusMode && (
          <aside className="hidden min-h-0 flex-col overflow-auto border-l border-border bg-card p-4 lg:flex">
            <SidePanel state={state} messages={messages} />
          </aside>
        )}
      </div>
    </div>
  );
}

function TopBar({
  lesson,
  state,
  focusMode,
  onToggleFocus,
  showCaptions,
  onToggleCaptions,
}: {
  lesson: Lesson;
  state: LessonState;
  focusMode: boolean;
  onToggleFocus: () => void;
  showCaptions: boolean;
  onToggleCaptions: () => void;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/student/dashboard" className="rounded-lg p-2 hover:bg-accent">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <LogoMark size={28} />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold leading-tight">{lesson.title}</div>
          <div className="text-xs text-muted-foreground">
            {lesson.subject} · Step: {STEP_LABELS[state.step]}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onToggleFocus} className="relative">
          {focusMode ? <EyeOff className="h-3 w-3" /> : <Focus className="h-3 w-3" />}
          <span className="sr-only">Focus mode</span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleCaptions}
          className={showCaptions ? "bg-primary/10 text-primary" : ""}
        >
          <Subtitles className="h-3 w-3" />
          <span className="sr-only">Captions</span>
        </Button>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Live
        </div>
        <Link to="/student/dashboard">
          <Button size="sm" variant="outline">
            End
          </Button>
        </Link>
      </div>
    </header>
  );
}

function Avatar({ teacherState }: { teacherState: TeacherState }) {
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

  const getStateAnimation = (state: TeacherState) => {
    switch (state) {
      case "speaking":
      case "explaining":
        return "animate-pulse";
      case "listening":
        return "animate-pulse";
      default:
        return "";
    }
  };

  const getWaveform = (state: TeacherState) => {
    if (state !== "speaking" && state !== "explaining") return null;

    return (
      <span className="flex gap-0.5">
        {[0, 120, 240, 360].map((d) => (
          <span
            key={d}
            className="h-3 w-1 animate-pulse rounded-full bg-white/90"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </span>
    );
  };

  return (
    <div
      className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl text-primary-foreground"
      style={{ background: "var(--gradient-brand)" }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white, transparent 50%)" }}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur ring-4 ring-white/20 ${getStateAnimation(teacherState)}`}
        >
          <LogoMark size={48} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide opacity-80">Your teacher</div>
          <div className="text-xl font-semibold">Mr. Klass</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs opacity-90">
            {getWaveform(teacherState)}
            {getStateText(teacherState)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Whiteboard({ board, step, setTeacherState }: { board: BoardState; step: LessonStep; setTeacherState?: (s: TeacherState) => void }) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex h-10 items-center justify-between border-b border-border px-4 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <PencilRuler className="h-3.5 w-3.5 text-primary" /> Whiteboard
        </span>
        <span className="text-[10px] uppercase tracking-wide">{STEP_LABELS[step]}</span>
      </div>
      <div className="relative flex-1 overflow-auto p-6 sm:p-8">
        {/* Dot/grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">{board.title}</h2>
          <div className="mt-5">
            <HandwritingArea
              lines={board.lines}
              readExactly={true}
              setTeacherState={setTeacherState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HandwritingArea({
  lines,
  readExactly,
  setTeacherState,
  writingSpeed,
}: {
  lines: string[];
  readExactly?: boolean;
  setTeacherState?: (s: TeacherState) => void;
  writingSpeed?: WritingSpeed;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [currentReveal, setCurrentReveal] = useState<string>("");
  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let cancelled = false;
    async function playNewLines() {
      // If lines shorter (reset), replace immediately
      if (lines.length < displayed.length) {
        setDisplayed(lines.slice());
        setCurrentReveal("");
        return;
      }
      const newLines = lines.slice(displayed.length);
      for (const line of newLines) {
        if (cancelled) return;
        await animateLine(line);
      }
    }
    playNewLines();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  function scrollToBottomIfNeeded() {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 180;
    if (nearBottom) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }

  function animateLine(text: string) {
    return new Promise<void>((resolve) => {
      if (prefersReduced || !text) {
        setDisplayed((d) => [...d, text]);
        setCurrentReveal("");
        scrollToBottomIfNeeded();
        // read exactly if requested
        if (readExactly && typeof speak === "function") {
          setTeacherState?.("speaking");
          speak(text, () => {
            setTeacherState?.("listening");
            resolve();
          });
        } else {
          resolve();
        }
        return;
      }

      // Determine writing speed in ms per character (basic MVP)
      const speed =
        writingSpeed === "slow" ? 55 : writingSpeed === "fast" ? 12 : 28;
      let i = 0;
      setCurrentReveal("");
      setTeacherState?.("writing");
      const handle = setInterval(() => {
        i += 1;
        setCurrentReveal(text.slice(0, i));
        scrollToBottomIfNeeded();
        if (i >= text.length) {
          clearInterval(handle);
          // commit final line
          setDisplayed((d) => [...d, text]);
          setCurrentReveal("");
          // after writing, teacher reads exactly if required
          if (readExactly && typeof speak === "function") {
            setTeacherState?.("speaking");
            speak(text, () => {
              setTeacherState?.("listening");
              resolve();
            });
          } else {
            resolve();
          }
        }
      }, speed);
    });
  }

  return (
    <div ref={containerRef} className="relative max-w-full">
      <div style={{ fontFamily: 'Patrick Hand, Caveat, Arial' }} className="space-y-3 text-2xl leading-[1.45] text-foreground">
        {displayed.map((l, idx) => (
          <div key={idx} className="rounded-md px-3 py-1.5">
            {l || "\u00A0"}
          </div>
        ))}
        {/* current reveal */}
        {currentReveal !== "" && (
          <div className="rounded-md px-3 py-1.5 text-foreground">{currentReveal}</div>
        )}
      </div>
      {/* writing hand — positioned bottom-right of last line */}
      <div
        aria-hidden
        className="writing-hand pointer-events-none absolute right-6 bottom-6 opacity-90"
        style={{ width: 44, height: 44 }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 22c0-5 6-9 12-11s8-3 8-3-4 0-8 3S2 22 2 22z" fill="#111827" opacity="0.06" />
          <path d="M7 16c1.5-1 3.5-1.5 5-1 2 .6 4 0 5-1" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function QuickActions({
  disabled,
  onAction,
}: {
  disabled: boolean;
  onAction: (t: string) => void;
}) {
  const actions: { icon: typeof HelpCircle; label: string; msg: string }[] = [
    {
      icon: HelpCircle,
      label: "I don't understand",
      msg: "I don't understand. Can you explain it differently?",
    },
    { icon: Repeat, label: "Repeat", msg: "Can you repeat that please?" },
    { icon: Lightbulb, label: "Give example", msg: "Give me a real-world example." },
    { icon: Snail, label: "Slow down", msg: "Please slow down and break it into smaller steps." },
    { icon: Target, label: "Test me", msg: "I'm ready — test me with a question." },
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onAction(a.msg)}
          disabled={disabled}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <a.icon className="h-3 w-3" /> {a.label}
        </button>
      ))}
    </div>
  );
}

function SidePanel({ state, messages }: { state: LessonState; messages: ChatTurn[] }) {
  const stepIdx = LESSON_STEPS.indexOf(state.step);
  const progress = Math.round(((stepIdx + 1) / LESSON_STEPS.length) * 100);
  const answered = state.correct + state.mistakes;
  const accuracy = answered > 0 ? Math.round((state.correct / answered) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Lesson progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          Step {stepIdx + 1} of {LESSON_STEPS.length} · {STEP_LABELS[state.step]}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Teaching flow
        </h3>
        <ol className="space-y-1">
          {LESSON_STEPS.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <li
                key={s}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : done
                      ? "text-muted-foreground line-through"
                      : "text-foreground/70"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    done
                      ? "bg-emerald-500/15 text-emerald-600"
                      : active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {STEP_LABELS[s]}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Trophy} label="Correct" value={state.correct} color="text-emerald-600" />
        <Stat icon={XCircle} label="Mistakes" value={state.mistakes} color="text-destructive" />
        <Stat icon={Target} label="Accuracy" value={`${accuracy}%`} color="text-primary" />
        <Stat
          icon={Brain}
          label="Confusion"
          value={`${Math.round(state.confusionScore * 100)}%`}
          color="text-foreground"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Session
        </h3>
        <p className="text-xs text-muted-foreground">
          {messages.length} turns · level: {state.studentLevel}
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <div className={`mt-1 text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}
