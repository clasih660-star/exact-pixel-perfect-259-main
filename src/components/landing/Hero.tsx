import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardCheck,
  Play,
  School,
  Users,
} from "lucide-react";

const teachingLoop = [
  {
    icon: BookOpen,
    title: "Reads the material",
    body: "Turns uploaded notes, slides, and policy documents into a teachable lesson path.",
  },
  {
    icon: School,
    title: "Leads the lesson",
    body: "Uses voice, board work, captions, and examples to guide learners through the idea.",
  },
  {
    icon: ClipboardCheck,
    title: "Checks understanding",
    body: "Asks questions, catches confusion, and adapts the next explanation before moving on.",
  },
  {
    icon: Users,
    title: "Reports progress",
    body: "Gives institutions a clear record of what was taught, attempted, and understood.",
  },
];

export function Hero() {
  return (
    <>
      <section
        className="relative flex min-h-[92vh] flex-col justify-between overflow-hidden bg-[#07111f] pb-10 pt-28 text-white"
        style={{
          backgroundImage: "url('/images/scenes/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
        id="platform"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07111f_0%,rgba(7,17,31,0.96)_38%,rgba(7,17,31,0.72)_66%,rgba(7,17,31,0.24)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-[62%] bg-[linear-gradient(180deg,rgba(24,68,124,0.22),rgba(4,10,20,0)_52%,rgba(18,82,86,0.18))]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#07111f] to-transparent" />

        <div className="container-editorial relative z-10 flex flex-1 items-center">
          <div className="max-w-[760px] text-left">
            <div className="mb-7 inline-flex items-center gap-2 border border-white/18 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-100 backdrop-blur">
              <CheckCircle size={12} className="text-[#7dd3fc]" />
              This is not content delivery
            </div>

            <h1 className="font-headings text-[42px] font-extrabold leading-[1.04] !text-white sm:text-[52px] md:text-[64px] lg:text-[74px]">
              It is teaching.
            </h1>

            <p className="mt-6 max-w-[660px] font-sans text-lg leading-8 !text-slate-100 md:text-xl">
              Klassruum turns institutional learning materials into live, guided classroom sessions:
              a teacher explains, writes, checks for understanding, and keeps the lesson moving.
            </p>

            <div className="mt-8 max-w-[620px] border-l border-sky-200/35 pl-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] !text-sky-200">
                Built for schools, universities, training teams, and academies
              </p>
              <p className="mt-2 text-sm leading-6 !text-white/72">
                The platform behaves like academic infrastructure, not a chatbot and not a file
                library.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/demo/classroom"
                className="group inline-flex items-center bg-white px-2 py-2 pr-6 text-sm font-bold !text-slate-950 shadow-xl transition-all hover:bg-sky-50"
              >
                <span className="flex h-9 w-9 items-center justify-center bg-[#2563eb] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight size={16} />
                </span>
                <span className="ml-3 !text-slate-950">Open live classroom</span>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/74 transition-colors hover:text-white"
              >
                <Play size={13} fill="currentColor" />
                See the teaching loop
              </a>
            </div>
          </div>
        </div>

        <div className="container-editorial relative z-10 mt-12 border-t border-white/12 pt-6">
          <div className="grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
            {teachingLoop.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="border border-white/12 bg-white/[0.055] p-4 backdrop-blur"
                >
                  <Icon size={17} className="mb-3 text-sky-200" />
                  <p className="text-sm font-bold !text-white">{item.title}</p>
                  <p className="mt-1.5 text-xs leading-5 !text-white/70">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-10">
        <div className="container-editorial">
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <p className="font-headings text-2xl font-extrabold leading-tight text-[#0f172a] md:text-3xl">
              A lesson is not finished when the content is uploaded.
            </p>
            <p className="text-base leading-7 text-slate-600">
              Klassruum structures the material into explanations, board moments, practice checks,
              accessibility supports, and records that teachers and administrators can trust.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
