export type Lesson = {
  id: string;
  title: string;
  subject: string;
  duration: string;
  progress: number;
  description: string;
};

export const lessons: Lesson[] = [
  {
    id: "algebra-foundations",
    title: "Algebra Foundations",
    subject: "Mathematics",
    duration: "25 min",
    progress: 60,
    description: "Solving linear equations and understanding variables.",
  },
  {
    id: "photosynthesis",
    title: "How Plants Make Food",
    subject: "Biology",
    duration: "18 min",
    progress: 30,
    description: "The full photosynthesis process, step by step.",
  },
  {
    id: "world-war-2",
    title: "World War II Overview",
    subject: "History",
    duration: "32 min",
    progress: 0,
    description: "Key events, turning points, and consequences.",
  },
  {
    id: "spanish-basics",
    title: "Spanish: Everyday Phrases",
    subject: "Languages",
    duration: "20 min",
    progress: 85,
    description: "Greetings, ordering food, and small talk.",
  },
  {
    id: "newtons-laws",
    title: "Newton's Three Laws",
    subject: "Physics",
    duration: "28 min",
    progress: 10,
    description: "Force, motion, and intuitive examples.",
  },
  {
    id: "essay-structure",
    title: "Writing a Great Essay",
    subject: "English",
    duration: "22 min",
    progress: 0,
    description: "Thesis, structure, and persuasive writing.",
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
