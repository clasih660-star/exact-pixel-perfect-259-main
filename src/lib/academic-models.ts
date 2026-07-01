/**
 * academic-models.ts
 *
 * TypeScript models for the Klassruum academic hierarchy:
 *
 *   Institution → Programme → Course → Course Materials → Lesson
 *     → Lesson Sections → Teaching Items → Classroom Session
 *     → Progress / Notes / Transcript / Learner Questions / Learning Results
 *
 * These mirror the public.* tables added in
 * supabase/migrations/20260609140000_phase9_programmes_materials_lessons.sql.
 * Field names use camelCase here; the data layer maps to/from snake_case rows.
 */

// ── Programme ────────────────────────────────────────────────────────────────

export type ProgrammeStatus = "draft" | "active" | "archived";

export interface Programme {
  id: string;
  institutionId: string;
  title: string;
  description?: string;
  level?: string;
  subjectArea?: string;
  targetLearners?: string;
  country?: string;
  curriculumFamily?: string;
  grade?: number;
  curriculumMetadata?: Record<string, unknown>;
  learningOutcomes: string[];
  startDate?: string;
  endDate?: string;
  timelineWeeks?: number;
  status: ProgrammeStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Course (additive fields layered on the existing course) ──────────────────

export type LessonGenerationMode = "auto" | "manual" | "mixed";

export interface CourseAcademicFields {
  programmeId?: string;
  timelineWeeks?: number;
  lessonGenerationMode: LessonGenerationMode;
  targetLessonCount?: number;
  country?: string;
  curriculumFamily?: string;
  grade?: number;
  curriculumSubject?: string;
  curriculumSubjectSlug?: string;
  curriculumMetadata?: Record<string, unknown>;
}

// ── Course Material ──────────────────────────────────────────────────────────

export type CourseMaterialType =
  | "pdf"
  | "document"
  | "slide"
  | "image"
  | "text"
  | "link"
  | "worksheet"
  | "syllabus";

export type MaterialProcessingStatus = "pending" | "processing" | "ready" | "failed";
export type CourseMaterialRole =
  | "teacher_guide"
  | "learner_book"
  | "reference_text"
  | "syllabus"
  | "institution_excerpt"
  | "other";
export type MaterialRightsStatus =
  | "licensed"
  | "institution_provided"
  | "public_domain"
  | "metadata_only"
  | "pending_review";

export interface CourseMaterial {
  id: string;
  institutionId: string;
  courseId: string;
  uploadedBy?: string;
  title: string;
  type: CourseMaterialType;
  fileUrl?: string;
  linkUrl?: string;
  extractedText?: string;
  syllabusReference?: string;
  materialRole?: CourseMaterialRole;
  bookTitle?: string;
  publisher?: string;
  editionYear?: string;
  materialRightsStatus?: MaterialRightsStatus;
  rightsNotes?: string;
  curriculumMetadata?: Record<string, unknown>;
  processingStatus: MaterialProcessingStatus;
  processingError?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialImage {
  id: string;
  institutionId: string;
  courseId: string;
  courseMaterialId: string;
  imageUrl: string;
  caption?: string;
  extractedContext?: string;
  suggestedLessonId?: string;
  createdAt?: string;
}

// ── Lesson Metadata Extensions for Deep Teaching ────────────────────────────

export interface InstructionalSegment {
  id: string;
  title: string;
  type: string;
  estimatedMinutes: number;
  visualRequired?: boolean;
  visualCue?: string;
}

export interface LessonVisualPlanAsset {
  id: string;
  anchorId?: string;
  kind: "screenshot" | "diagram" | "formula" | "chart" | "table" | "illustration" | "workflow" | "map" | "text_reference";
  source: "uploaded_material" | "ai_generated" | "whiteboard" | "fallback";
  title: string;
  description: string;
  alt: string;
  imageUrl?: string;
  teacherCue: string;
  labels?: string[];
}

export interface ReteachMoment {
  concept: string;
  recapPoints: string[];
  alternateExplanation: string;
  visualCue?: string;
}

export interface GuidedQuestion {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface PracticeCycleProblem {
  equation: string;
  question: string;
  correctAnswer: string;
  hints: string[];
  misconception?: { answer: string; note: string };
}

export interface PracticeCycle {
  id: string;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  problems: PracticeCycleProblem[];
}

export type LessonStatus = "draft" | "published" | "archived";

export interface GeneratedLesson {
  id: string;
  institutionId: string;
  programmeId?: string;
  courseId: string;
  title: string;
  orderIndex: number;
  objective: string;
  syllabusReference?: string;
  curriculum?: {
    country?: string | null;
    curriculumFamily?: string | null;
    grade?: number | null;
    subject?: string | null;
    subjectSlug?: string | null;
    strand?: string | null;
    subStrand?: string | null;
    syllabusReference?: string | null;
    sourceBookReferences?: string[];
  };
  sourceMaterialIds: string[];
  minimumDurationMinutes: number;
  estimatedDurationMinutes?: number;
  generationMode: LessonGenerationMode;
  status: LessonStatus;
  sections: LessonSection[];
  createdAt?: string;
  updatedAt?: string;
}

export type LessonSectionType =
  | "welcome"
  | "objective"
  | "why_it_matters"
  | "prerequisite_check"
  | "concept"
  | "worked_example"
  | "question_checkpoint"
  | "required_middle_question"
  | "guided_practice"
  | "independent_practice"
  | "correction"
  | "summary"
  | "exit_reflection"
  | "homework";

export interface LessonSection {
  id: string;
  lessonId: string;
  title: string;
  type: LessonSectionType;
  orderIndex: number;
  estimatedMinutes: number;
  teachingItems: TeachingItem[];
}

export type TeachingItemType =
  | "heading"
  | "bullet"
  | "equation"
  | "calculation"
  | "image"
  | "diagram"
  | "question"
  | "answer"
  | "correction"
  | "instruction"
  | "concept";

export interface TeachingItem {
  id: string;
  sectionId: string;
  lessonId: string;
  orderIndex: number;
  type: TeachingItemType;
  /** Short text shown on the board (5–26 words for bullets; never long paragraphs). */
  boardText?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Verbatim text the teacher reads after writing. */
  exactSpokenText: string;
  /** Deeper explanation the teacher gives. */
  teacherExplanation: string;
  /** Cleaned text saved into learner notes. */
  learnerNotes: string;
  /** Screen-reader / assistive description. */
  accessibleDescription: string;
  whyThisMatters?: string;
  commonMistake?: string;
  writingSpeed?: "slow" | "normal" | "fast";
  estimatedSeconds: number;
  sourceMaterialId?: string;
}

// ── Learner Question (asked in class, answered from course context) ──────────

export type AnswerSource = "ai" | "teacher" | "fallback";

export interface LearnerQuestion {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId?: string;
  studentId: string;
  sectionType?: string;
  boardItemRef?: string;
  questionText: string;
  answerText?: string;
  answerWordCount?: number;
  contextJson: Record<string, unknown>;
  answerSource: AnswerSource;
  learningMode?: string;
  createdAt?: string;
}

// ── Learning Results (per session, no grading/exams) ─────────────────────────

export type LearningResultStatus =
  | "not_started"
  | "in_progress"
  | "paused"
  | "needs_review"
  | "completed"
  | "replayed";

export interface ConfidenceCheckRecord {
  section: string;
  level: string;
}

export interface LearningResult {
  id: string;
  institutionId: string;
  courseId: string;
  lessonId: string;
  sessionId?: string;
  studentId: string;
  status: LearningResultStatus;
  progressPercentage: number;
  timeSpentSeconds: number;
  currentSection?: string;
  resumePoint: Record<string, unknown>;
  questionsAsked: number;
  raisedHands: number;
  practiceAttempts: number;
  practiceCorrect: number;
  hintsUsed: number;
  middleQuestionCorrect?: boolean | null;
  confidenceChecks: ConfidenceCheckRecord[];
  misconceptionsDetected: number;
  weakAreas: string[];
  notesSaved: boolean;
  transcriptSaved: boolean;
  events: string[];
  lastActiveAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ── Classroom context passed to the AI when answering learner questions ──────

export interface ClassroomQuestionContext {
  institution?: string;
  programme?: string;
  course?: string;
  lessonTitle: string;
  currentSection?: string;
  currentBoardItem?: string;
  teacherExplanation?: string;
  learnerNotes?: string;
  previousQuestions?: string[];
  materialContext?: string;
  imageDescriptions?: string[];
  learningMode?: string;
  learnerLevel?: string;
}

export interface CurriculumScopeMapping {
  id: string;
  country: string;
  curriculumFamily: string;
  grade: number;
  subject: string;
  subjectSlug: string;
  curriculumCode?: string;
  strand?: string;
  subStrand?: string;
  syllabusReference?: string;
  expectedMaterialRole?: CourseMaterialRole;
  courseId?: string;
  courseMaterialId?: string;
  lessonId?: string;
  coverageStatus: "unmapped" | "material_mapped" | "lesson_drafted" | "published";
  sourceNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}
