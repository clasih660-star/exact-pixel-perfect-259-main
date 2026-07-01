import type {
  ClassroomDisciplineType,
  ClassroomPacingPlan,
  ClassroomVisualAsset,
  ClassroomVisualKind,
} from "./classroom-content";
import type { MathTeachingItem } from "./lesson-models";

const MIN_CLASS_MINUTES = 30;
const MAX_CLASS_MINUTES = 60;

function textBlob(...parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function clampClassDuration(minutes: unknown, fallback = 45): number {
  const n = typeof minutes === "number" && Number.isFinite(minutes) ? Math.round(minutes) : fallback;
  return Math.max(MIN_CLASS_MINUTES, Math.min(MAX_CLASS_MINUTES, n));
}

export function detectInstructionalDiscipline(input: {
  subject?: string | null;
  course?: string | null;
  title?: string | null;
  material?: string | null;
}): ClassroomDisciplineType {
  const t = textBlob(input.subject, input.course, input.title, input.material?.slice(0, 1200));
  if (/spss|excel|power\s*bi|dax|tableau|spreadsheet|pivot|stata|r\b|python|sql|analytics|data analysis|statistics software/.test(t)) {
    return "business_software";
  }
  if (/math|algebra|calculus|geometry|trigonometry|statistics|equation|formula|graph/.test(t)) {
    return "mathematics";
  }
  if (/physics|chemistry|biology|anatomy|physiology|science|geology|laboratory|cell|organ|body/.test(t)) {
    return "science";
  }
  if (/engineering|technical|mechanic|hydraulic|brake|electrical|electronics|robotic|automotive|plumbing|welding|construction/.test(t)) {
    return "technical";
  }
  if (/language|english|kiswahili|french|grammar|literature|translation|pronunciation|linguistics/.test(t)) {
    return "languages";
  }
  if (/history|geography|civic|social|economics|philosophy|law|business|management|psychology|sociology|humanities/.test(t)) {
    return "humanities";
  }
  return "general";
}

export function detectToolingContext(input: {
  subject?: string | null;
  course?: string | null;
  title?: string | null;
  material?: string | null;
}): string | undefined {
  const t = textBlob(input.subject, input.course, input.title, input.material?.slice(0, 2000));
  const tools = [
    ["SPSS", /spss/],
    ["Excel", /excel|spreadsheet|pivot table|vlookup|xlookup/],
    ["Power BI", /power\s*bi|dax|data model|relationships pane/],
    ["Tableau", /tableau/],
    ["Python", /python|pandas|numpy|matplotlib/],
    ["R", /\br programming\b|\brstudio\b|\br language\b/],
    ["SQL", /\bsql\b|database query/],
  ];
  return tools.find(([, pattern]) => (pattern as RegExp).test(t))?.[0] as string | undefined;
}

export function createDefaultPacingPlan(targetDurationMinutes?: number): ClassroomPacingPlan {
  const target = clampClassDuration(targetDurationMinutes, 45);
  return {
    minimumDurationMinutes: MIN_CLASS_MINUTES,
    targetDurationMinutes: target,
    maximumDurationMinutes: MAX_CLASS_MINUTES,
    extensionStrategies: [
      "slow board reading with explanation after each item",
      "guided recap before major section changes",
      "worked example plus learner checkpoint",
      "alternative explanation when confusion is detected",
      "visual inspection pause for screenshots, diagrams, formulas, or charts",
    ],
  };
}

function visualKindForDiscipline(discipline: ClassroomDisciplineType): ClassroomVisualKind {
  switch (discipline) {
    case "business_software":
      return "screenshot";
    case "science":
      return "diagram";
    case "technical":
      return "workflow";
    case "mathematics":
      return "formula";
    case "languages":
      return "table";
    case "humanities":
      return "text_reference";
    default:
      return "illustration";
  }
}

export function buildFallbackVisualPlan(input: {
  lessonId: string;
  title: string;
  subject: string;
  course: string;
  disciplineType?: ClassroomDisciplineType;
  toolingContext?: string;
  sequence?: MathTeachingItem[];
}): ClassroomVisualAsset[] {
  const discipline = input.disciplineType ??
    detectInstructionalDiscipline({ subject: input.subject, course: input.course, title: input.title });
  const tool = input.toolingContext;
  const firstVisualItem = input.sequence?.find((item) => item.visualCue || ["equation", "calculation", "concept", "instruction"].includes(item.type));
  const kind = firstVisualItem?.visualCue?.kind ?? visualKindForDiscipline(discipline);

  const titleByDiscipline: Record<ClassroomDisciplineType, string> = {
    business_software: tool ? `${tool} demonstration view` : "Software demonstration view",
    mathematics: "Formula and worked-method view",
    science: "Labelled scientific illustration",
    technical: "Process and component workflow",
    humanities: "Evidence and interpretation reference",
    languages: "Language structure table",
    general: "Lesson support visual",
  };

  const cueByDiscipline: Record<ClassroomDisciplineType, string> = {
    business_software: tool
      ? `Use the uploaded ${tool} screenshots where available. Point to the menu, field, output, and interpretation before moving on.`
      : "Use uploaded screenshots where available. Point to the interface area, action, output, and interpretation before moving on.",
    mathematics: "Keep the formula visible while explaining each symbol, substitution, and calculation step.",
    science: "Use a labelled diagram and explain each visible part, its function, and how it connects to the whole system.",
    technical: "Show the flow of force, signal, pressure, or material through the components before asking the learner to apply it.",
    humanities: "Anchor the explanation in a short passage, source, timeline, or argument map before interpretation.",
    languages: "Break the sentence or grammar rule into parts, model pronunciation/usage, then ask the learner to produce an example.",
    general: "Use the visual to slow the lesson down and connect the board point to a concrete example.",
  };

  return [
    {
      id: `${input.lessonId}_visual_overview`,
      anchorId: firstVisualItem?.id,
      kind,
      source: firstVisualItem?.visualCue?.imageUrl ? "uploaded_material" : "fallback",
      title: firstVisualItem?.visualCue?.title ?? titleByDiscipline[discipline],
      description:
        firstVisualItem?.visualCue?.description ??
        `Support visual for ${input.title}. This slot can use uploaded course screenshots/images first, or an AI-generated visual when no uploaded material exists.`,
      alt: firstVisualItem?.visualCue?.imageAlt ?? `${titleByDiscipline[discipline]} for ${input.title}`,
      imageUrl: firstVisualItem?.visualCue?.imageUrl,
      teacherCue: firstVisualItem?.visualCue?.teacherCue ?? cueByDiscipline[discipline],
      labels: tool ? [tool, "Input", "Process", "Output", "Interpretation"] : undefined,
    },
  ];
}