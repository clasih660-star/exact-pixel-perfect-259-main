import { Brain, CheckCircle2, XCircle } from "lucide-react";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export function QuizCard({
  quiz,
  answered,
  onAnswer,
}: {
  quiz: QuizQuestion;
  answered: number | null;
  onAnswer: (i: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        <Brain className="h-3.5 w-3.5" /> Quiz
      </div>
      <p className="text-sm font-medium text-foreground">{quiz.question}</p>
      <div className="mt-3 space-y-1.5">
        {quiz.options.map((opt, i) => {
          const isAnswered = answered !== null;
          const isCorrect = i === quiz.correctIndex;
          const isPicked = i === answered;
          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              disabled={isAnswered}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                !isAnswered
                  ? "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                  : isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : isPicked
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-border bg-card opacity-60"
              }`}
            >
              <span>{opt}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {isAnswered && isPicked && !isCorrect && (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
