import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StudentShell } from "@/components/student/StudentShell";
import {
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  RotateCcw,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Layers,
} from "lucide-react";
import { requireStudent } from "@/lib/route-guards";

export const Route = createFileRoute("/_authenticated/student/quizzes")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentQuizzes,
});

type QuizQuestion = {
  question: string;
  yourAnswer: string;
  correct: boolean;
  correctAnswer?: string;
};

type Quiz = {
  id: string;
  title: string;
  course: string;
  date: string;
  score: number;
  total: number;
  timeTaken: string;
  canRetake: boolean;
  questions: QuizQuestion[];
};

const QUIZZES: Quiz[] = [
  {
    id: "q1",
    title: "Quadratic Equations Quiz",
    course: "Mathematics Form 2",
    date: "Today at 2:42 PM",
    score: 9,
    total: 10,
    timeTaken: "4 min 12 sec",
    canRetake: false,
    questions: [
      {
        question: "What is the standard form of a quadratic equation?",
        yourAnswer: "ax² + bx + c = 0",
        correct: true,
      },
      { question: "Solve: x² - 5x + 6 = 0", yourAnswer: "x = 2 or x = 3", correct: true },
      { question: "Factor: x² + 7x + 12", yourAnswer: "(x + 4)(x + 3)", correct: true },
      {
        question: "What is the discriminant formula?",
        yourAnswer: "b - 4ac",
        correct: false,
        correctAnswer: "b² - 4ac",
      },
      { question: "Solve: x² - 9 = 0", yourAnswer: "x = 3 or x = -3", correct: true },
    ],
  },
  {
    id: "q2",
    title: "Chemical Reactions Quiz",
    course: "KCSE Chemistry Revision",
    date: "Yesterday at 4:12 PM",
    score: 7,
    total: 10,
    timeTaken: "5 min 44 sec",
    canRetake: true,
    questions: [
      { question: "Balance: H₂ + O₂ → H₂O", yourAnswer: "2H₂ + O₂ → 2H₂O", correct: true },
      {
        question: "What type of reaction is combustion?",
        yourAnswer: "Decomposition",
        correct: false,
        correctAnswer: "Exothermic oxidation",
      },
      {
        question: "What is a catalyst?",
        yourAnswer: "Speeds up a reaction without being consumed",
        correct: true,
      },
    ],
  },
  {
    id: "q3",
    title: "HTML Basics Quiz",
    course: "Computer Studies Basics",
    date: "3 days ago",
    score: 8,
    total: 10,
    timeTaken: "3 min 55 sec",
    canRetake: false,
    questions: [
      {
        question: "What does HTML stand for?",
        yourAnswer: "HyperText Markup Language",
        correct: true,
      },
      { question: "Which tag creates a hyperlink?", yourAnswer: "<a>", correct: true },
      { question: "Which attribute makes a form required?", yourAnswer: "required", correct: true },
    ],
  },
  {
    id: "q4",
    title: "Algebraic Expressions Quiz",
    course: "Mathematics Form 2",
    date: "Jun 4, 2026",
    score: 6,
    total: 10,
    timeTaken: "6 min 20 sec",
    canRetake: true,
    questions: [
      { question: "Simplify: 3x + 2x", yourAnswer: "5x", correct: true },
      {
        question: "Expand: 2(x + 3)",
        yourAnswer: "2x + 3",
        correct: false,
        correctAnswer: "2x + 6",
      },
    ],
  },
];

function scoreGrade(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90)
    return {
      grade: "A",
      color: "text-green-700",
      bg: "from-green-50 to-white",
      border: "border-green-200",
      barColor: "from-green-400 to-green-500",
      glow: "rgba(22,163,74,0.15)",
    };
  if (pct >= 75)
    return {
      grade: "B",
      color: "text-[#1F7C80]",
      bg: "from-[#e8f5f5] to-white",
      border: "border-[#a3d9d8]",
      barColor: "from-[#3fa8ab] to-[#1F7C80]",
      glow: "rgba(31,124,128,0.15)",
    };
  if (pct >= 60)
    return {
      grade: "C",
      color: "text-amber-700",
      bg: "from-amber-50 to-white",
      border: "border-amber-200",
      barColor: "from-amber-400 to-amber-500",
      glow: "rgba(217,119,6,0.15)",
    };
  return {
    grade: "D",
    color: "text-red-700",
    bg: "from-red-50 to-white",
    border: "border-red-200",
    barColor: "from-red-400 to-red-500",
    glow: "rgba(220,38,38,0.15)",
  };
}

function StudentQuizzes() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const avgScore = Math.round(
    QUIZZES.reduce((a, q) => a + (q.score / q.total) * 100, 0) / QUIZZES.length,
  );
  const bestScore = Math.max(...QUIZZES.map((q) => (q.score / q.total) * 100));
  const canRetakeCount = QUIZZES.filter((q) => q.canRetake).length;

  return (
    <StudentShell title="Quiz History">
      {/* Premium Stats Strip */}
      <div className="kr-stat-strip kr-stat-strip--3 mb-6">
        {/* Average Score */}
        <div className="kr-stat-card-item kr-stat-card-item--brand">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-4 w-4 text-[#1F7C80]" />
          </div>
          <p className="kr-stat-value text-[#1F7C80]">{avgScore}%</p>
          <p className="kr-stat-label">Average Score</p>
        </div>

        {/* Best Score */}
        <div className="kr-stat-card-item kr-stat-card-item--success">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-4 w-4 text-green-700" />
          </div>
          <p className="kr-stat-value text-green-700">{Math.round(bestScore)}%</p>
          <p className="kr-stat-label">Best Score</p>
        </div>

        {/* Retakes */}
        <div
          className={`kr-stat-card-item ${canRetakeCount > 0 ? "kr-stat-card-item--warning" : ""}`}
        >
          <div className="flex items-center justify-center mb-2">
            <RotateCcw
              className={`h-4 w-4 ${canRetakeCount > 0 ? "text-amber-600" : "text-[#94A3B8]"}`}
            />
          </div>
          <p
            className={`kr-stat-value ${canRetakeCount > 0 ? "text-amber-700" : "text-[#94A3B8]"}`}
          >
            {canRetakeCount}
          </p>
          <p className="kr-stat-label">Available Retakes</p>
        </div>
      </div>

      {/* Score trend banner */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-white px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-100">
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        <p className="text-sm font-semibold text-green-700">
          Your quiz average improved by <strong>+4%</strong> this month — great consistency!
        </p>
      </div>

      {/* Section heading */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#64748B]" />
          <h2 className="text-sm font-bold text-[#0F172A]">Recent Quizzes</h2>
        </div>
        <span className="text-xs text-[#94A3B8]">{QUIZZES.length} total</span>
      </div>

      {/* Quiz cards */}
      <div className="space-y-4">
        {QUIZZES.map((quiz) => {
          const pct = Math.round((quiz.score / quiz.total) * 100);
          const { grade, color, bg, border, barColor, glow } = scoreGrade(quiz.score, quiz.total);
          const isExpanded = expanded === quiz.id;

          return (
            <div
              key={quiz.id}
              className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition-all hover:border-[#1F7C80]/30 hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-5">
                {/* Premium grade badge */}
                <div
                  className={`relative flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border bg-gradient-to-br ${bg} ${border} shadow-sm overflow-hidden`}
                  style={{ boxShadow: `0 4px 14px ${glow}` }}
                >
                  <span className={`text-xl font-extrabold leading-none ${color}`}>{grade}</span>
                  <span className={`text-[10px] font-bold leading-none mt-0.5 ${color}`}>
                    {pct}%
                  </span>
                  {/* subtle inner highlight */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 to-transparent" />
                </div>

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#0F172A]">{quiz.title}</h3>
                  <p className="mt-0.5 text-sm text-[#64748B]">{quiz.course}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500" />
                      {quiz.score}/{quiz.total} correct
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {quiz.timeTaken}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {quiz.date}
                    </span>
                  </div>

                  {/* Score progress bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {quiz.canRetake && (
                    <Link
                      to="/student/classrooms"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F7C80] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#1A5256]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Retake
                    </Link>
                  )}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : quiz.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#1F7C80] hover:text-[#1A5256] transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5" /> Hide answers
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5" /> Review answers
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded answer breakdown */}
              {isExpanded && (
                <div className="border-t border-[#F1F5F9] bg-[#FAFCFC] px-5 pb-5 pt-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#94A3B8]">
                    Answer Breakdown
                  </h4>
                  <div className="space-y-2">
                    {quiz.questions.map((q, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-xl border p-3 ${
                          q.correct ? "border-green-100 bg-green-50" : "border-red-100 bg-red-50"
                        }`}
                      >
                        {q.correct ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#0F172A]">{q.question}</p>
                          <p
                            className={`mt-0.5 text-xs ${q.correct ? "text-green-700" : "text-red-600"}`}
                          >
                            Your answer: {q.yourAnswer}
                          </p>
                          {!q.correct && q.correctAnswer && (
                            <p className="mt-0.5 text-xs font-semibold text-green-700">
                              ✓ Correct: {q.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </StudentShell>
  );
}
