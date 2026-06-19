import { ArrowRight, Briefcase, Heart, Landmark, Monitor, School, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";

type SolutionHref =
  | "/solutions/schools"
  | "/solutions/universities"
  | "/solutions/training-providers"
  | "/solutions/tutoring-centers"
  | "/solutions/ngos"
  | "/solutions/online-academies";

const solutions = [
  {
    title: "Schools",
    description: "Keep teaching consistent across classes while every learner gets guided support.",
    icon: School,
    image: "/images/scenes/schools.png",
    href: "/solutions/schools" as SolutionHref,
    accent: "bg-[#dff7ee] text-[#12604c]",
    tag: "Curriculum delivery",
    note: "Classroom rhythm",
  },
  {
    title: "Universities",
    description:
      "Support large cohorts with explainers, checks, and records beyond the lecture hall.",
    icon: Landmark,
    image: "/images/scenes/universities.png",
    href: "/solutions/universities" as SolutionHref,
    accent: "bg-[#e7efff] text-[#194b91]",
    tag: "Large cohorts",
    note: "Foundational teaching",
  },
  {
    title: "Training organisations",
    description: "Turn policies and manuals into taught sessions that people actually complete.",
    icon: Briefcase,
    image: "/images/scenes/training.png",
    href: "/solutions/training-providers" as SolutionHref,
    accent: "bg-[#fff1c7] text-[#725111]",
    tag: "Workplace learning",
    note: "Policy to practice",
  },
  {
    title: "Tutoring centres",
    description: "Scale one-to-one support with adaptive explanations and small-group practice.",
    icon: Users,
    image: "/images/scenes/tutoring.png",
    href: "/solutions/tutoring-centers" as SolutionHref,
    accent: "bg-[#e3f7fb] text-[#155a6a]",
    tag: "Guided practice",
    note: "Personal pace",
  },
  {
    title: "NGOs",
    description:
      "Deliver accessible teaching where staff, language, or connectivity is constrained.",
    icon: Heart,
    image: "/images/scenes/ngos.png",
    href: "/solutions/ngos" as SolutionHref,
    accent: "bg-[#ffe6eb] text-[#8a2841]",
    tag: "Inclusive access",
    note: "Reach and support",
  },
  {
    title: "Online academies",
    description: "Replace passive course libraries with teacher-led digital classroom experiences.",
    icon: Monitor,
    image: "/images/scenes/academies.png",
    href: "/solutions/online-academies" as SolutionHref,
    accent: "bg-[#ececf4] text-[#34344f]",
    tag: "Digital campus",
    note: "Course to classroom",
  },
];

export function Solutions() {
  return (
    <section className="border-y border-slate-200 bg-[#f7faf9] py-20 lg:py-28" id="solutions">
      <div className="container-editorial">
        <div className="mb-12 grid gap-5 text-left md:grid-cols-[0.72fr_1fr] md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#12604c]">
              Teaching campuses
            </p>
            <h2 className="font-headings text-3xl font-extrabold leading-tight text-[#0f172a] sm:text-4xl">
              Every campus has a different teaching job.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Klassruum adapts the same core teaching loop to the institution using it: explain the
            material, work through examples, check understanding, and leave a usable learning
            record.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((sol) => {
            const SolIcon = sol.icon;
            return (
              <Link
                key={sol.title}
                to={sol.href}
                className="group flex min-h-[430px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={sol.image}
                    alt={`${sol.title} learning environment`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/68 via-slate-950/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div className="inline-flex items-center gap-2 bg-white/92 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-900 shadow-sm backdrop-blur">
                      <SolIcon size={13} />
                      {sol.tag}
                    </div>
                    <span
                      className={`hidden px-2.5 py-1 text-[11px] font-bold sm:inline-flex ${sol.accent}`}
                    >
                      {sol.note}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-extrabold text-[#0f172a] transition-colors group-hover:text-[#194b91]">
                    {sol.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{sol.description}</p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      View teaching model
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f172a] text-white transition-transform duration-300 group-hover:translate-x-0.5">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
