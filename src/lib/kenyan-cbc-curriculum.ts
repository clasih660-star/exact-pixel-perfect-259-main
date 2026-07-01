export type KenyanCbcGrade = 6 | 7 | 8 | 9;

export type KenyanCbcSubject = {
  grade: KenyanCbcGrade;
  subject: string;
  slug: string;
  sourceUrl: string;
};

export type KenyanCbcProgrammeSeed = {
  grade: KenyanCbcGrade;
  title: string;
  slug: string;
  level: string;
  description: string;
  sourceUrl: string;
};

const KICD_GRADE_DESIGN_URLS: Record<KenyanCbcGrade, string> = {
  6: "https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-six-designs/",
  7: "https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-seven-designs/",
  8: "https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-eight-designs/",
  9: "https://kicd.ac.ke/cbc-materials/curriculum-designs/grade-nine-designs/",
};

const gradeSixSubjects = [
  "Agriculture",
  "Arabic",
  "Creative Arts",
  "CRE",
  "English",
  "French",
  "German",
  "HRE",
  "Indigenous Language",
  "IRE",
  "Kiswahili",
  "Mandarin",
  "Mathematics",
  "Science and Technology",
  "Social Studies",
];

const juniorSchoolSubjects = [
  "Agriculture",
  "Arabic",
  "Creative Arts",
  "CRE",
  "English",
  "French",
  "German",
  "HRE",
  "Indigenous Language",
  "Integrated Science",
  "IRE",
  "Kiswahili",
  "Mandarin",
  "Mathematics",
  "Pre-Technical Studies",
  "Social Studies",
];

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "subject"
  );
}

export const KENYAN_CBC_PROGRAMMES: KenyanCbcProgrammeSeed[] = ([6, 7, 8, 9] as const).map(
  (grade) => ({
    grade,
    title: `Kenyan CBC Grade ${grade}`,
    slug: `kenyan-cbc-grade-${grade}`,
    level: `Grade ${grade}`,
    description:
      "KingPin-owned Kenyan CBC curriculum shell for licensed, institution-provided source materials and curated Klassruum lesson delivery.",
    sourceUrl: KICD_GRADE_DESIGN_URLS[grade],
  }),
);

export const KENYAN_CBC_SUBJECT_MATRIX: KenyanCbcSubject[] = ([6, 7, 8, 9] as const).flatMap(
  (grade) => {
    const subjects = grade === 6 ? gradeSixSubjects : juniorSchoolSubjects;
    return subjects.map((subject) => ({
      grade,
      subject,
      slug: slugify(subject),
      sourceUrl: KICD_GRADE_DESIGN_URLS[grade],
    }));
  },
);

export function getKenyanCbcSubjectsForGrade(grade: KenyanCbcGrade) {
  return KENYAN_CBC_SUBJECT_MATRIX.filter((item) => item.grade === grade);
}

export function getKenyanCbcCourseSlug(grade: KenyanCbcGrade, subject: string) {
  return `kenyan-cbc-grade-${grade}-${slugify(subject)}`;
}

export function getKenyanCbcCourseTitle(grade: KenyanCbcGrade, subject: string) {
  return `Kenyan CBC Grade ${grade} ${subject} - Powered by KingPin`;
}

export const KENYAN_CBC_RIGHTS_RULES = [
  "Store official subject and book metadata as product data.",
  "Do not seed raw textbook text in source code or migrations.",
  "Ingest only licensed, public-domain, or institution-provided excerpts/materials.",
  "Generate original Klassruum lesson delivery content that cites syllabus references without reproducing books.",
];
