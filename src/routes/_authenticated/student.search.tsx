import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { StudentShell } from "@/components/student/StudentShell";
import { Search as SearchIcon, FileText, Folder } from "lucide-react";
import { requireStudent } from "@/lib/route-guards";
import { searchStudentContent } from "@/lib/student.functions";

export const Route = createFileRoute("/_authenticated/student/search")({
  beforeLoad: (ctx) => requireStudent(ctx.context),
  component: StudentSearch,
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function lessonHref(id?: string) {
  return id && UUID_RE.test(id) ? `/classroom/${id}` : "/student/lessons";
}

function StudentSearch() {
  const fn = useServerFn(searchStudentContent);
  const [query, setQuery] = useState("");
  const q = useQuery({
    queryKey: ["student-search", query],
    queryFn: () => fn({ data: { query } }),
    enabled: query.trim().length >= 2,
  });

  const lessons = q.data?.lessons ?? [];
  const materials = q.data?.materials ?? [];
  const hasResults = lessons.length + materials.length > 0;

  return (
    <StudentShell title="Search">
      <div className="relative mb-5">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gray-400)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your lessons and resources…"
          className="w-full rounded-xl border border-[var(--gray-200)] bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        />
      </div>

      {query.trim().length < 2 ? (
        <p className="text-sm text-[var(--gray-500)]">
          Type at least two characters to search across your enrolled courses.
        </p>
      ) : q.isLoading ? (
        <p className="text-sm text-[var(--gray-500)]">Searching…</p>
      ) : !hasResults ? (
        <p className="text-sm text-[var(--gray-500)]">No results for “{query}”.</p>
      ) : (
        <div className="space-y-6">
          {lessons.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--gray-400)]">
                Lessons ({lessons.length})
              </h3>
              <div className="space-y-2">
                {lessons.map((l: any) => (
                  <Link
                    key={l.id}
                    to={lessonHref(l.id) as any}
                    className="kr-pcard flex items-center gap-3 p-3 hover:border-[var(--primary)]"
                  >
                    <FileText className="h-4 w-4 text-[var(--primary)]" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--gray-900)]">{l.title}</p>
                      <p className="truncate text-xs text-[var(--gray-500)]">{l.courseTitle}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {materials.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--gray-400)]">
                Resources ({materials.length})
              </h3>
              <div className="space-y-2">
                {materials.map((m: any) => (
                  <Link
                    key={m.id}
                    to="/student/resources"
                    className="kr-pcard flex items-center gap-3 p-3 hover:border-[var(--primary)]"
                  >
                    <Folder className="h-4 w-4 text-[var(--primary)]" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--gray-900)]">{m.title}</p>
                      <p className="truncate text-xs text-[var(--gray-500)]">
                        {m.courseTitle} · {m.type}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </StudentShell>
  );
}
