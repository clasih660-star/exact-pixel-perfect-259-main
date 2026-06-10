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
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/student/quizzes")({
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
      { question: "What is the standard form of a quadratic equation?", yourAnswer: "ax² + bx + c = 0", correct: true },
      { question: "Solve: x² - 5x + 6 = 0", yourAnswer: "x = 2 or x = 3", correct: true },
      { question: "Factor: x² + 7x + 12", yourAnswer: "(x + 4)(x + 3)", correct: true },
      { question: "What is the discriminant formula?", yourAnswer: "b - 4ac", correct: false, correctAnswer: "b² - 4ac" },
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
      { question: "What type of reaction is combustion?", yourAnswer: "Decomposition", correct: false, correctAnswer: "Exothermic oxidation" },
      { question: "What is a catalyst?", yourAnswer: "Speeds up a reaction without being consumed", correct: true },
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
      { question: "What does HTML stand for?", yourAnswer: "HyperText Markup Language", correct: true },
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
      { question: "Expand: 2(x + 3)", yourAnswer: "2x + 3", correct: false, correctAnswer: "2x + 6" },
    ],
  },
];

function scoreGrade(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { grade: "A", color: "text-green-600", bg: "bg-green-50 border-green-200" };
  if (pct >= 75) return { grade: "B", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
  if (pct >= 60) return { grade: "C", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" };
  return { grade: "D", color: "text-red-600", bg: "bg-red-50 border-red-200" };
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
      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-[var(--primary)]">{avgScore}%</p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--gray-500)]">Average Score</p>
        </div>
        <div className="rounded-2xl border border-[var(--gray-200)] bg-white p-4 text-center">
          <p className="text-2xl font-extrabold text-green-600">{Math.round(bestScore)}%</p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--gray-500)]">Best Score</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-2xl font-extrabold text-amber-600">{canRetakeCount}</p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--gray-500)]">Available Retakes</p>
        </div>
      </div>

      {/* Score trend message */}
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <p className="text-sm font-semibold text-green-700">
          Your quiz average improved by <strong>+4%</strong> this month — great consistency!
        </p>
      </div>

      {/* Quiz cards */}
      <div className="space-y-4">
        {QUIZZES.map((quiz) => {
          const pct = Math.round((quiz.score / quiz.total) * 100);
          const { grade, color, bg } = scoreGrade(quiz.score, quiz.total);
          const isExpanded = expanded === quiz.id;

          return (
            <div
              key={quiz.id}
              className="rounded-2xl border border-[var(--gray-200)] bg-white overflow-hidden transition-all hover:border-[var(--primary)]/30 hover:shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-4 p-5">
                {/* Grade badge */}
                <div className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border ${bg}`}>
                  <span className={`text-xl font-extrabold ${color}`}>{grade}</span>
                  <span className={`text-[10px] font-bold ${color}`}>{pct}%</span>
                </div>

                {/* Main info */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[var(--gray-900)]">{quiz.title}</h3>
                  <p className="text-sm text-[var(--gray-500)]">{quiz.course}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--gray-400)]">
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

                  {/* Score bar */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--gray-100)]">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {quiz.canRetake && (
                    <Link
                      to="/classroom/session_demo_math"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Retake
                    </Link>
                  )}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : quiz.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    {isExpanded ? (
                      <><ChevronUp className="h-3.5 w-3.5" /> Hide answers</>
                    ) : (
                      <><ChevronDown className="h-3.5 w-3.5" /> Review answers</>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded answers */}
              {isExpanded && (
                <div className="border-t border-[var(--gray-100)] px-5 pb-5 pt-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--gray-500)]">Answer Breakdown</h4>
                  <div className="space-y-2">
                    {quiz.questions.map((q, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-xl p-3 ${q.correct ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
                      >
                        {q.correct ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--gray-900)]">{q.question}</p>
                          <p className={`mt-0.5 text-xs ${q.correct ? "text-green-700" : "text-red-700"}`}>
                            Your answer: {q.yourAnswer}
                          </p>
                          {!q.correct && q.correctAnswer && (
                            <p className="mt-0.5 text-xs font-semibold text-green-700">
                              Correct: {q.correctAnswer}
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
