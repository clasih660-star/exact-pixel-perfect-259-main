export type TeacherWorkspaceLesson = {
  id: string;
  title: string;
  status: "ready" | "review" | "draft";
  duration: string;
  steps: number;
  objective: string;
};

export type TeacherWorkspaceCourse = {
  id: string;
  title: string;
  subject: string;
  institution: string;
  students: number;
  progress: number;
  nextSession: string;
  description: string;
  lessons: TeacherWorkspaceLesson[];
};

export const TEACHER_COURSE_WORKSPACES: TeacherWorkspaceCourse[] = [
  {
    id: "course_math",
    title: "Mathematics Form 2",
    subject: "Mathematics",
    institution: "Klassruum Demo Academy",
    students: 32,
    progress: 65,
    nextSession: "Today, 10:30 AM",
    description:
      "Algebra, quadratic equations, linear functions, and geometry for Form 2 students.",
    lessons: [
      {
        id: "lesson_quad",
        title: "Introduction to Quadratic Equations",
        status: "ready",
        duration: "30 min",
        steps: 8,
        objective: "Solve quadratic equations by factoring, completing the square, and formula.",
      },
      {
        id: "lesson_factor",
        title: "Factoring Polynomials",
        status: "draft",
        duration: "28 min",
        steps: 6,
        objective: "Use common factors, grouping, and trinomial patterns with confidence.",
      },
    ],
  },
  {
    id: "course_chem",
    title: "KCSE Chemistry Revision",
    subject: "Chemistry",
    institution: "Klassruum Demo Academy",
    students: 45,
    progress: 42,
    nextSession: "Today, 2:00 PM",
    description:
      "Comprehensive revision covering organic chemistry, reactions, and the periodic table.",
    lessons: [
      {
        id: "lesson_chem",
        title: "Chemical Bonding",
        status: "review",
        duration: "35 min",
        steps: 9,
        objective: "Explain ionic and covalent bonds using electron behavior and examples.",
      },
      {
        id: "lesson_react",
        title: "Chemical Reactions",
        status: "ready",
        duration: "40 min",
        steps: 10,
        objective: "Classify reactions and balance equations accurately.",
      },
    ],
  },
  {
    id: "course_cs",
    title: "Computer Studies Basics",
    subject: "Computer Science",
    institution: "Klassruum Demo Academy",
    students: 28,
    progress: 78,
    nextSession: "Tomorrow, 9:00 AM",
    description: "Introduction to computing, web development fundamentals, and basic programming.",
    lessons: [
      {
        id: "lesson_html",
        title: "HTML Forms and Inputs",
        status: "review",
        duration: "25 min",
        steps: 7,
        objective: "Build accessible forms with labels, inputs, and validation patterns.",
      },
      {
        id: "lesson_css",
        title: "CSS Flexbox and Grid",
        status: "draft",
        duration: "32 min",
        steps: 8,
        objective: "Create responsive layouts using Flexbox and Grid.",
      },
    ],
  },
];

export function getTeacherCourseWorkspace(courseId: string) {
  return TEACHER_COURSE_WORKSPACES.find((course) => course.id === courseId) ?? null;
}

export function getTeacherLessonWorkspace(lessonId: string) {
  for (const course of TEACHER_COURSE_WORKSPACES) {
    const lesson = course.lessons.find((item) => item.id === lessonId);
    if (lesson) return { course, lesson };
  }
  return null;
}
