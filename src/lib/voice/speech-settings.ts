import type { TeacherSpeechType } from "./types";

export const speechTypeSettings: Record<
  TeacherSpeechType,
  {
    speedOffset: number;
    pauseMs: number;
    teacherState:
      | "preparing"
      | "writing"
      | "reading_board"
      | "explaining"
      | "asking_question"
      | "listening"
      | "thinking"
      | "answering"
      | "clarifying"
      | "encouraging"
      | "paused"
      | "waiting_for_learner";
  }
> = {
  welcome: { speedOffset: 0, pauseMs: 500, teacherState: "explaining" },
  board_reading: { speedOffset: -0.07, pauseMs: 700, teacherState: "reading_board" },
  explanation: { speedOffset: -0.03, pauseMs: 600, teacherState: "explaining" },
  question: { speedOffset: 0, pauseMs: 500, teacherState: "asking_question" },
  answer: { speedOffset: -0.01, pauseMs: 500, teacherState: "answering" },
  clarification: { speedOffset: -0.05, pauseMs: 650, teacherState: "clarifying" },
  encouragement: { speedOffset: 0.04, pauseMs: 350, teacherState: "encouraging" },
  summary: { speedOffset: -0.03, pauseMs: 650, teacherState: "explaining" },
};
