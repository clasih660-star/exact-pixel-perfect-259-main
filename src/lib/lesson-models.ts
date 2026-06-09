/**
 * Klassruum Lesson Data Models
 *
 * Three-layer content model for real classroom experience:
 * 1. Whiteboard Content - Visual teaching (equations, diagrams, bullets)
 * 2. Teacher Notes - Deep explanations teacher uses
 * 3. Learner Notes - Study notes for revision
 */

// Board item types for whiteboard
export type BoardItemType =
  | "heading"
  | "bullet"
  | "equation"
  | "calculation"
  | "diagram_label"
  | "question"
  | "answer"
  | "step_number";

// Individual item on the whiteboard
export type BoardWriteItem = {
  id: string;
  type: BoardItemType;
  text: string;
  // Teacher must read this exactly before explaining
  readExactly: boolean;
  // Deeper explanation after exact reading
  explanation?: string;
  // For accessibility - describes what's being written
  accessibleDescription: string;
  // How fast to reveal this item
  writingSpeed: "slow" | "normal" | "fast";
  // Time to pause after showing (ms)
  pauseAfter?: number;
};

// Learner notes for revision
export type LearnerNotes = {
  summary: string;
  keyPoints: string[];
  examples: string[];
  commonMistakes: string[];
  formulas?: string[];
  vocabulary?: string[];
};

// Question checkpoint every 5 minutes
export type QuestionCheckpoint = {
  id: string;
  triggerMinute: number;
  promptText: string;
  promptAudio: string;
  required: boolean;
  inputModes: Array<"text" | "voice" | "quick_action">;
  quickActions?: string[];
};

// Required question at 50% of lesson
export type RequiredLessonQuestion = {
  id: string;
  triggerPercentage: number;
  questionText: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
  boardCorrection: BoardWriteItem[];
  hint?: string;
};

// Practice block for guided/independent practice
export type PracticeBlock = {
  id: string;
  type: "guided" | "independent";
  problemText: string;
  expectedAnswer: string;
  acceptableAnswers: string[];
  boardSolution: BoardWriteItem[];
  hintOnIncorrect?: string;
};

// Exit ticket at lesson end
export type ExitTicket = {
  id: string;
  questionText: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  feedback: string;
};

// Single lesson step
export type LessonStep = {
  id: string;
  order: number;
  title: string;
  key: string;
  estimatedMinutes: number;
  // What appears on whiteboard
  boardItems: BoardWriteItem[];
  // What teacher says in detail (not shown to learner)
  teacherNotes: string;
  // What learner can save/revise
  learnerNotes: LearnerNotes;
  // Accessibility descriptions
  accessibility: {
    boardDescription: string;
    screenReaderText: string;
    simplifiedExplanation: string;
  };
  // Optional practice for this step
  practice?: PracticeBlock;
};

// Full lesson model
export type Lesson = {
  id: string;
  institutionId: string;
  courseId: string;
  title: string;
  subject: string;
  level: string;
  minimumDurationMinutes: number; // minimum 25
  estimatedDurationMinutes: number;
  objective: string;
  prerequisiteCheck?: {
    questionText: string;
    options: string[];
    reviewIfNo: string;
  };
  steps: LessonStep[];
  questionCheckpoints: QuestionCheckpoint[];
  requiredMidLessonQuestion: RequiredLessonQuestion;
  exitTicket?: ExitTicket;
  homework?: string[];
  resources?: string[];
};

// Classroom completion summary
export type LessonCompletionSummary = {
  sessionId: string;
  lessonId: string;
  timeSpentMinutes: number;
  completedAt: string;

  // Learning checks
  middleQuestionAnswered: boolean;
  middleQuestionCorrect: boolean;

  guidedPracticeCompleted: boolean;
  guidedPracticeCorrect: boolean;

  independentPracticeCompleted: boolean;
  independentPracticeCorrect: boolean;

  exitTicketAnswered: boolean;
  exitTicketCorrect: boolean;

  // Questions asked
  questionsAskedCount: number;

  // Weak areas detected
  weakAreas: string[];

  // Quiz score if applicable
  quizScore?: {
    correct: number;
    total: number;
  };

  // Recommendations
  recommendedNext: string[];

  // Notes saving
  notesSaved: boolean;
  transcriptGenerated: boolean;
};

// Classroom event for tracking
export type ClassroomEvent =
  | { type: "session_started"; timestamp: string }
  | { type: "board_item_written"; itemId: string; timestamp: string }
  | { type: "teacher_read_board_item"; itemId: string; timestamp: string }
  | { type: "teacher_explained_item"; itemId: string; timestamp: string }
  | { type: "question_checkpoint_triggered"; checkpointId: string; timestamp: string }
  | { type: "learner_asked_question"; question: string; timestamp: string }
  | { type: "teacher_answered_question"; answer: string; timestamp: string }
  | { type: "required_question_asked"; questionId: string; timestamp: string }
  | { type: "required_question_answered"; questionId: string; correct: boolean; timestamp: string }
  | { type: "guided_practice_started"; practiceId: string; timestamp: string }
  | { type: "independent_practice_started"; practiceId: string; timestamp: string }
  | { type: "practice_answer_submitted"; practiceId: string; correct: boolean; timestamp: string }
  | { type: "misconception_detected"; type: string; learnerAnswer: string; timestamp: string }
  | { type: "exit_ticket_submitted"; correct: boolean; timestamp: string }
  | { type: "lesson_completed"; summary: LessonCompletionSummary; timestamp: string }
  | { type: "lesson_replayed"; fromStep: number; timestamp: string };

// Demo lesson data
export const DEMO_LESSON: Lesson = {
  id: "lesson_quadratic_001",
  institutionId: "inst_demo",
  courseId: "course_math_form2",
  title: "Introduction to Quadratic Equations",
  subject: "Mathematics",
  level: "Form 2",
  minimumDurationMinutes: 25,
  estimatedDurationMinutes: 30,
  objective: "By the end of this lesson, you will factor simple quadratic equations.",
  prerequisiteCheck: {
    questionText: "Before we begin, do you remember how to multiply two brackets like (x + 2)(x + 3)?",
    options: ["Yes, I remember", "Not sure", "No, I need a review"],
    reviewIfNo: "Let me quickly review multiplying brackets...",
  },
  steps: [
    {
      id: "step_1",
      order: 1,
      title: "Welcome & Objective",
      key: "welcome",
      estimatedMinutes: 2,
      boardItems: [
        {
          id: "b1_1",
          type: "heading",
          text: "Today's Lesson",
          readExactly: true,
          accessibleDescription: "Heading: Today's Lesson",
          writingSpeed: "normal",
        },
        {
          id: "b1_2",
          type: "bullet",
          text: "Solving Quadratic Equations by Factoring",
          readExactly: true,
          accessibleDescription: "Bullet point: Solving Quadratic Equations by Factoring",
          writingSpeed: "normal",
        },
        {
          id: "b1_3",
          type: "heading",
          text: "Lesson Goal",
          readExactly: true,
          accessibleDescription: "Heading: Lesson Goal",
          writingSpeed: "normal",
        },
        {
          id: "b1_4",
          type: "bullet",
          text: "Factor simple quadratic equations",
          readExactly: true,
          accessibleDescription: "Bullet point: Factor simple quadratic equations",
          writingSpeed: "normal",
        },
      ],
      teacherNotes: "Welcome to today's lesson on quadratic equations. We will learn how to factor quadratic equations to find their solutions. This is a foundational skill that you will use throughout your mathematics journey.",
      learnerNotes: {
        summary: "This lesson teaches how to factor quadratic equations of the form ax² + bx + c = 0.",
        keyPoints: [
          "Quadratic equations have x² as the highest power",
          "Factoring rewrites the equation as a product of two brackets",
          "The solutions come from setting each bracket to zero",
        ],
        examples: [],
        commonMistakes: [
          "Forgetting to check both multiply and add conditions",
          "Getting the signs wrong in the factors",
        ],
        formulas: ["x² + bx + c = (x + m)(x + n) where m×n=c and m+n=b"],
      },
      accessibility: {
        boardDescription: "Whiteboard shows the lesson title and objective",
        screenReaderText: "Today we learn to factor quadratic equations. Our goal is to factor simple quadratic equations.",
        simplifiedExplanation: "We will learn to break down quadratic equations into simpler parts.",
      },
    },
    {
      id: "step_2",
      order: 2,
      title: "What is a Quadratic Equation?",
      key: "concept",
      estimatedMinutes: 5,
      boardItems: [
        {
          id: "b2_1",
          type: "heading",
          text: "Quadratic Form",
          readExactly: true,
          accessibleDescription: "Heading: Quadratic Form",
          writingSpeed: "normal",
        },
        {
          id: "b2_2",
          type: "equation",
          text: "ax² + bx + c = 0",
          readExactly: true,
          accessibleDescription: "Equation: a x squared plus b x plus c equals zero",
          writingSpeed: "slow",
          pauseAfter: 1500,
        },
        {
          id: "b2_3",
          type: "bullet",
          text: "a, b, and c are numbers",
          readExactly: true,
          accessibleDescription: "Bullet: a, b, and c are numbers",
          writingSpeed: "normal",
        },
        {
          id: "b2_4",
          type: "bullet",
          text: "a cannot be 0",
          readExactly: true,
          accessibleDescription: "Bullet: a cannot be zero",
          writingSpeed: "normal",
        },
        {
          id: "b2_5",
          type: "equation",
          text: "Example: x² + 5x + 6 = 0",
          readExactly: true,
          accessibleDescription: "Example equation: x squared plus 5 x plus 6 equals zero",
          writingSpeed: "normal",
          pauseAfter: 1000,
        },
        {
          id: "b2_6",
          type: "bullet",
          text: "Here a=1, b=5, c=6",
          readExactly: true,
          accessibleDescription: "In this example, a equals 1, b equals 5, c equals 6",
          writingSpeed: "normal",
        },
      ],
      teacherNotes: "A quadratic equation is an equation where the highest power of x is 2. The standard form is ax² + bx + c = 0, where a, b, and c are constants and a is not zero. In our example x² + 5x + 6 = 0, we have a=1, b=5, and c=6. Notice that x² means x multiplied by itself.",
      learnerNotes: {
        summary: "Quadratic equations have x² as the highest power, written as ax² + bx + c = 0.",
        keyPoints: [
          "x² means x multiplied by itself",
          "a cannot be zero (or it wouldn't be quadratic)",
          "The standard form helps us identify a, b, and c",
        ],
        examples: ["x² + 5x + 6 = 0 (a=1, b=5, c=6)", "2x² - 3x + 1 = 0 (a=2, b=-3, c=1)"],
        commonMistakes: ["Calling it 'x squared' instead of 'quadratic'", "Forgetting that a cannot be zero"],
        formulas: ["Standard form: ax² + bx + c = 0"],
      },
      accessibility: {
        boardDescription: "Whiteboard shows the quadratic form equation",
        screenReaderText: "The quadratic form is a x squared plus b x plus c equals zero. In our example, x squared plus 5 x plus 6 equals zero.",
        simplifiedExplanation: "Quadratic equations have x multiplied by itself, plus some other x terms and numbers.",
      },
    },
    {
      id: "step_3",
      order: 3,
      title: "Worked Example",
      key: "worked_example",
      estimatedMinutes: 6,
      boardItems: [
        {
          id: "b3_1",
          type: "heading",
          text: "Example: Solve x² + 5x + 6 = 0",
          readExactly: true,
          accessibleDescription: "Heading: Example - Solve x squared plus 5 x plus 6 equals zero",
          writingSpeed: "normal",
        },
        {
          id: "b3_2",
          type: "step_number",
          text: "Step 1: Find two numbers",
          readExactly: true,
          accessibleDescription: "Step 1: Find two numbers",
          writingSpeed: "normal",
        },
        {
          id: "b3_3",
          type: "calculation",
          text: "Multiply to 6, Add to 5",
          readExactly: true,
          accessibleDescription: "The numbers must multiply to 6 and add to 5",
          writingSpeed: "normal",
          pauseAfter: 2000,
        },
        {
          id: "b3_4",
          type: "calculation",
          text: "2 × 3 = 6  ✓",
          readExactly: true,
          accessibleDescription: "2 times 3 equals 6, check mark",
          writingSpeed: "normal",
        },
        {
          id: "b3_5",
          type: "calculation",
          text: "2 + 3 = 5  ✓",
          readExactly: true,
          accessibleDescription: "2 plus 3 equals 5, check mark",
          writingSpeed: "normal",
          pauseAfter: 1500,
        },
        {
          id: "b3_6",
          type: "step_number",
          text: "Step 2: Factor",
          readExactly: true,
          accessibleDescription: "Step 2: Factor",
          writingSpeed: "normal",
        },
        {
          id: "b3_7",
          type: "equation",
          text: "(x + 2)(x + 3) = 0",
          readExactly: true,
          accessibleDescription: "Open bracket x plus 2 close bracket times open bracket x plus 3 close bracket equals zero",
          writingSpeed: "slow",
          pauseAfter: 2000,
        },
        {
          id: "b3_8",
          type: "step_number",
          text: "Step 3: Solve each bracket",
          readExactly: true,
          accessibleDescription: "Step 3: Solve each bracket",
          writingSpeed: "normal",
        },
        {
          id: "b3_9",
          type: "equation",
          text: "x + 2 = 0 → x = -2",
          readExactly: true,
          accessibleDescription: "x plus 2 equals zero, arrow, x equals negative 2",
          writingSpeed: "normal",
        },
        {
          id: "b3_10",
          type: "equation",
          text: "x + 3 = 0 → x = -3",
          readExactly: true,
          accessibleDescription: "x plus 3 equals zero, arrow, x equals negative 3",
          writingSpeed: "normal",
        },
        {
          id: "b3_11",
          type: "answer",
          text: "Answer: x = -2 or x = -3",
          readExactly: true,
          accessibleDescription: "Answer: x equals negative 2 or x equals negative 3",
          writingSpeed: "slow",
        },
      ],
      teacherNotes: "Now let me show you how to solve this step by step. First, I need to find two numbers. These numbers must multiply to give me 6, which is my c value. The same numbers must also add to give me 5, which is my b value. Let me think... what two numbers multiply to 6? One and six, or two and three. Now which pair adds to 5? Two plus three equals five. Perfect! So my numbers are 2 and 3. Now I can write my factors. The factors are (x + 2) and (x + 3). Setting each bracket to zero gives me x equals negative 2, and x equals negative 3.",
      learnerNotes: {
        summary: "To factor x² + 5x + 6, we find numbers that multiply to 6 and add to 5.",
        keyPoints: [
          "Find two numbers that multiply to c (the constant)",
          "The same numbers must add to b (the coefficient of x)",
          "Write each factor in brackets",
          "Set each bracket to zero to find solutions",
        ],
        examples: ["For x² + 5x + 6: numbers are 2 and 3 (2×3=6, 2+3=5)", "Factors: (x + 2)(x + 3) = 0", "Solutions: x = -2 or x = -3"],
        commonMistakes: [
          "Getting the signs wrong (if c is positive but b is negative, both numbers are negative)",
          "Forgetting to set each bracket to zero",
          "Writing x = 2 instead of x = -2",
        ],
        formulas: ["If (x + m)(x + n) = 0, then x = -m or x = -n"],
      },
      accessibility: {
        boardDescription: "Step-by-step solution of a quadratic equation",
        screenReaderText: "To solve x squared plus 5 x plus 6 equals zero, we find two numbers that multiply to 6 and add to 5. The numbers 2 and 3 work. So we factor as open bracket x plus 2 close bracket times open bracket x plus 3 close bracket. Setting each to zero, x equals negative 2 or x equals negative 3.",
        simplifiedExplanation: "Find two numbers. They must multiply to the number at the end (6) and add to the middle number (5). Then put them in brackets.",
      },
    },
    {
      id: "step_4",
      order: 4,
      title: "Guided Practice",
      key: "guided_practice",
      estimatedMinutes: 4,
      boardItems: [
        {
          id: "b4_1",
          type: "heading",
          text: "Let's Practice Together",
          readExactly: true,
          accessibleDescription: "Heading: Let's Practice Together",
          writingSpeed: "normal",
        },
        {
          id: "b4_2",
          type: "equation",
          text: "Solve: x² + 7x + 12 = 0",
          readExactly: true,
          accessibleDescription: "Solve: x squared plus 7 x plus 12 equals zero",
          writingSpeed: "normal",
          pauseAfter: 2000,
        },
        {
          id: "b4_3",
          type: "question",
          text: "Find numbers that multiply to 12 and add to 7",
          readExactly: true,
          accessibleDescription: "Question: Find numbers that multiply to 12 and add to 7",
          writingSpeed: "normal",
        },
      ],
      teacherNotes: "Now let's practice together. Look at this equation: x² + 7x + 12 = 0. We need to find two numbers. What's our c value? It's 12. What's our b value? It's 7. So we need numbers that multiply to 12 and add to 7. Think about it... the pairs for 12 are 1 and 12, 2 and 6, 3 and 4. Which pair adds to 7? Let me check. Three plus four equals seven. Perfect!",
      learnerNotes: {
        summary: "Practice finding factor pairs and checking both conditions.",
        keyPoints: [
          "List all factor pairs of c",
          "Check which pair adds to b",
          "Write the factors and solve",
        ],
        examples: ["x² + 7x + 12: factors of 12 are (3,4), (3+4=7)", "Solution: (x+3)(x+4)=0, x=-3 or x=-4"],
        commonMistakes: ["Forgetting to check all factor pairs", "Not checking the sum condition"],
        formulas: [],
      },
      accessibility: {
        boardDescription: "Guided practice problem for the learner",
        screenReaderText: "Let's practice together. Solve x squared plus 7 x plus 12 equals zero. Find numbers that multiply to 12 and add to 7.",
        simplifiedExplanation: "We work on this problem together step by step.",
      },
      practice: {
        id: "practice_guided_1",
        type: "guided",
        problemText: "Which two numbers multiply to 12 and add to 7?",
        expectedAnswer: "3 and 4",
        acceptableAnswers: ["3 and 4", "4 and 3", "three and four", "3,4", "4,3"],
        boardSolution: [
          {
            id: "sol1",
            type: "calculation",
            text: "3 × 4 = 12 ✓",
            readExactly: true,
            accessibleDescription: "3 times 4 equals 12, check",
            writingSpeed: "normal",
          },
          {
            id: "sol2",
            type: "calculation",
            text: "3 + 4 = 7 ✓",
            readExactly: true,
            accessibleDescription: "3 plus 4 equals 7, check",
            writingSpeed: "normal",
          },
        ],
      },
    },
    {
      id: "step_5",
      order: 5,
      title: "Independent Practice",
      key: "independent_practice",
      estimatedMinutes: 3,
      boardItems: [
        {
          id: "b5_1",
          type: "heading",
          text: "Your Turn",
          readExactly: true,
          accessibleDescription: "Heading: Your Turn",
          writingSpeed: "normal",
        },
        {
          id: "b5_2",
          type: "equation",
          text: "Solve: x² + 6x + 8 = 0",
          readExactly: true,
          accessibleDescription: "Solve: x squared plus 6 x plus 8 equals zero",
          writingSpeed: "normal",
        },
        {
          id: "b5_3",
          type: "question",
          text: "What are the solutions?",
          readExactly: true,
          accessibleDescription: "Question: What are the solutions?",
          writingSpeed: "normal",
        },
      ],
      teacherNotes: "Now it's your turn to try one on your own. Solve x² + 6x + 8 = 0. Take your time to think through the steps we learned. Find the two numbers, then write the factors and solve.",
      learnerNotes: {
        summary: "Try solving a quadratic equation independently.",
        keyPoints: [
          "Apply the same method by yourself",
          "Check both multiplication and addition",
          "Don't forget the negative sign in your answer",
        ],
        examples: [],
        commonMistakes: ["Rushing without checking both conditions", "Forgetting negative signs in final answer"],
        formulas: [],
      },
      accessibility: {
        boardDescription: "Independent practice for the learner to solve",
        screenReaderText: "Your turn. Solve x squared plus 6 x plus 8 equals zero. What are the solutions?",
        simplifiedExplanation: "Now you solve this problem by yourself using the steps we learned.",
      },
      practice: {
        id: "practice_independent_1",
        type: "independent",
        problemText: "Solve x² + 6x + 8 = 0. What are the solutions?",
        expectedAnswer: "-2 and -4",
        acceptableAnswers: ["-2 and -4", "-4 and -2", "x=-2 and x=-4", "x=-4 and x=-2", "negative 2 and negative 4", "-2,-4", "-4,-2"],
        boardSolution: [
          {
            id: "isol1",
            type: "calculation",
            text: "2 × 4 = 8 ✓",
            readExactly: true,
            accessibleDescription: "2 times 4 equals 8, check",
            writingSpeed: "normal",
          },
          {
            id: "isol2",
            type: "calculation",
            text: "2 + 4 = 6 ✓",
            readExactly: true,
            accessibleDescription: "2 plus 4 equals 6, check",
            writingSpeed: "normal",
          },
          {
            id: "isol3",
            type: "equation",
            text: "(x + 2)(x + 4) = 0",
            readExactly: true,
            accessibleDescription: "Open bracket x plus 2 close bracket times open bracket x plus 4 close bracket equals zero",
            writingSpeed: "normal",
          },
          {
            id: "isol4",
            type: "answer",
            text: "x = -2 or x = -4",
            readExactly: true,
            accessibleDescription: "Answer: x equals negative 2 or x equals negative 4",
            writingSpeed: "normal",
          },
        ],
        hintOnIncorrect: "Remember: the numbers must multiply to 8 and add to 6. What's 2 times 4? What's 2 plus 4?",
      },
    },
    {
      id: "step_6",
      order: 6,
      title: "Summary",
      key: "summary",
      estimatedMinutes: 3,
      boardItems: [
        {
          id: "b6_1",
          type: "heading",
          text: "What You Learned Today",
          readExactly: true,
          accessibleDescription: "Heading: What You Learned Today",
          writingSpeed: "normal",
        },
        {
          id: "b6_2",
          type: "bullet",
          text: "Quadratic equations have x²",
          readExactly: true,
          accessibleDescription: "Bullet: Quadratic equations have x squared",
          writingSpeed: "normal",
        },
        {
          id: "b6_3",
          type: "bullet",
          text: "Factoring rewrites as two brackets",
          readExactly: true,
          accessibleDescription: "Bullet: Factoring rewrites as two brackets",
          writingSpeed: "normal",
        },
        {
          id: "b6_4",
          type: "bullet",
          text: "Check: multiply to c, add to b",
          readExactly: true,
          accessibleDescription: "Bullet: Check that the numbers multiply to c and add to b",
          writingSpeed: "normal",
        },
        {
          id: "b6_5",
          type: "bullet",
          text: "Set each bracket to zero",
          readExactly: true,
          accessibleDescription: "Bullet: Set each bracket to zero",
          writingSpeed: "normal",
        },
        {
          id: "b6_6",
          type: "bullet",
          text: "Answers are the solutions",
          readExactly: true,
          accessibleDescription: "Bullet: The answers are the solutions",
          writingSpeed: "normal",
        },
      ],
      teacherNotes: "Let me summarize what you learned today. Quadratic equations have x squared. We can solve them by factoring, which means rewriting them as a product of two brackets. The key is finding two numbers that multiply to the constant term and add to the middle coefficient. Once you have the factors, set each bracket to zero to find your solutions. You did great work today!",
      learnerNotes: {
        summary: "Quadratic factoring uses two key conditions: multiply to c, add to b.",
        keyPoints: [
          "Quadratic equations have x²",
          "Factoring means writing as (x + m)(x + n)",
          "Find m and n: m×n=c and m+n=b",
          "Solutions come from setting brackets to zero",
        ],
        examples: [],
        commonMistakes: [],
        formulas: ["For x² + bx + c = 0, find m,n where m×n=c and m+n=b", "Factor: (x+m)(x+n) = 0", "Solve: x = -m or x = -n"],
      },
      accessibility: {
        boardDescription: "Summary of today's lesson",
        screenReaderText: "Today you learned: Quadratic equations have x squared. Factoring rewrites them as two brackets. Check that numbers multiply to c and add to b. Set each bracket to zero. The answers are the solutions.",
        simplifiedExplanation: "To solve quadratics: find two numbers that multiply and add correctly, then solve each bracket.",
      },
    },
  ],
  questionCheckpoints: [
    {
      id: "checkpoint_5",
      triggerMinute: 5,
      promptText: "Do you have any question before we continue?",
      promptAudio: "Do you have any question before we continue?",
      required: false,
      inputModes: ["text", "voice", "quick_action"],
      quickActions: ["No question", "Repeat this step", "Explain simpler"],
    },
    {
      id: "checkpoint_10",
      triggerMinute: 10,
      promptText: "Do you have any question before we continue?",
      promptAudio: "Do you have any question before we continue?",
      required: false,
      inputModes: ["text", "voice", "quick_action"],
      quickActions: ["No question", "Repeat this step", "Explain simpler"],
    },
    {
      id: "checkpoint_15",
      triggerMinute: 15,
      promptText: "Do you have any question before we continue?",
      promptAudio: "Do you have any question before we continue?",
      required: false,
      inputModes: ["text", "voice", "quick_action"],
      quickActions: ["No question", "Repeat this step", "Explain simpler"],
    },
  ],
  requiredMidLessonQuestion: {
    id: "mid_q1",
    triggerPercentage: 50,
    questionText: "Which two numbers multiply to 6 and add to 5?",
    correctAnswer: "2 and 3",
    acceptableAnswers: ["2 and 3", "3 and 2", "two and three", "2,3", "3,2"],
    feedbackCorrect: "Correct! Two and three multiply to six and add to five. Excellent work.",
    feedbackIncorrect: "Good effort. Let me check it together. Two times three is six, and two plus three is five. So the answer is 2 and 3.",
    boardCorrection: [
      {
        id: "mid_correct_1",
        type: "calculation",
        text: "2 × 3 = 6 ✓",
        readExactly: true,
        accessibleDescription: "2 times 3 equals 6, check",
        writingSpeed: "normal",
        explanation: "This confirms the multiplication - 2 times 3 equals 6, which is our c value.",
      },
      {
        id: "mid_correct_2",
        type: "calculation",
        text: "2 + 3 = 5 ✓",
        readExactly: true,
        accessibleDescription: "2 plus 3 equals 5, check",
        writingSpeed: "normal",
        explanation: "This confirms the addition - 2 plus 3 equals 5, which is our b value.",
      },
    ],
    hint: "Think: what pairs multiply to 6? (1,6), (2,3). Which pair also adds to 5?",
  },
  exitTicket: {
    id: "exit_1",
    questionText: "What two conditions do we check when finding factor numbers?",
    correctAnswer: "Multiply to c and add to b",
    acceptableAnswers: [
      "multiply to c and add to b",
      "multiply to c, add to b",
      "multiply and add",
      "product equals c, sum equals b",
      "the numbers must multiply to c and add to b",
    ],
    feedback: "Correct! We always check that the numbers multiply to c and add to b.",
  },
  homework: [
    "Solve x² + 4x + 3 = 0",
    "Solve x² + 8x + 15 = 0",
    "Solve x² - 5x + 6 = 0",
  ],
};
