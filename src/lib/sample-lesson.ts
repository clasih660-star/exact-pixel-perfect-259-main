/**
 * Sample Lesson: Solving Quadratic Equations
 * This demonstrates the complete Klassruum lesson structure with:
 * - Learning objectives
 * - Prerequisite checks
 * - Animated whiteboard sequence
 * - Teacher and learner notes
 * - Question checkpoints
 * - Misconception handling
 * - Guided and independent practice
 * - Exit ticket
 * - Homework
 */

import type { Lesson } from "@/lib/lesson-types";

export const sampleQuadraticsLesson: Lesson = {
  id: "lesson_quadratics_001",
  institutionId: "inst_klassruum_demo",
  courseId: "course_math_form_2",
  title: "Solving Quadratic Equations by Factoring",
  subject: "Mathematics",
  description:
    "Learn to solve quadratic equations using the factoring method. This lesson covers finding factors, understanding the zero product rule, and verifying solutions.",
  minimumDurationMinutes: 25,
  estimatedDurationMinutes: 35,
  difficulty: "intermediate",
  tags: ["algebra", "quadratic-equations", "factoring", "core"],
  createdAt: "2026-06-01T10:00:00Z",
  updatedAt: "2026-06-01T10:00:00Z",

  objective: {
    id: "obj_1",
    title: "Factor and Solve Quadratic Equations",
    description:
      "By the end of this lesson, learners will be able to solve quadratic equations using the factoring method and verify their solutions.",
    successCriteria: [
      "Identify factors of quadratic expressions",
      "Apply the zero product rule correctly",
      "Solve quadratic equations and verify solutions",
      "Explain the reasoning behind each step",
    ],
  },

  prerequisiteCheck: {
    id: "prereq_1",
    question: "Do you remember how to multiply two brackets, like (x + 2)(x + 3)?",
    guidance:
      "If not, we'll review this quickly before we begin the main lesson.",
    reviewMaterial:
      "Multiplying two brackets: (x + a)(x + b) = x² + (a+b)x + ab",
  },

  steps: [
    {
      id: "step_1",
      order: 1,
      title: "What is a Quadratic Equation?",
      estimatedMinutes: 3,
      boardItems: [
        {
          id: "b1",
          type: "heading",
          text: "Solving Quadratic Equations",
          readExactly: true,
          accessibleDescription: "The board title is Solving Quadratic Equations.",
        },
        {
          id: "b2",
          type: "heading",
          text: "What is a Quadratic Equation?",
          readExactly: true,
          explanation: "A quadratic equation is a polynomial equation of degree two.",
          accessibleDescription: "What is a Quadratic Equation?",
        },
        {
          id: "b3",
          type: "equation",
          text: "ax² + bx + c = 0",
          readExactly: true,
          explanation:
            "This is the standard form. a, b, and c are constants, and a cannot be zero.",
          accessibleDescription: "ax squared plus bx plus c equals zero",
        },
        {
          id: "b4",
          type: "bullet",
          text: "a is the coefficient of x²",
          readExactly: true,
          explanation: "a must not be zero, otherwise it is not quadratic.",
          accessibleDescription: "a is the coefficient of x squared",
        },
        {
          id: "b5",
          type: "bullet",
          text: "b is the coefficient of x",
          readExactly: true,
          explanation: "b can be any number, including zero.",
          accessibleDescription: "b is the coefficient of x",
        },
        {
          id: "b6",
          type: "bullet",
          text: "c is the constant term",
          readExactly: true,
          explanation: "c can also be any number, including zero.",
          accessibleDescription: "c is the constant term",
        },
      ],
      teacherNotes:
        "Start by making sure students understand what makes an equation quadratic. Emphasize that the highest power must be exactly 2. Give examples of equations that are and are not quadratic.",
      learnerNotes: {
        summary:
          "A quadratic equation is an equation where the highest power of x is 2. It always has the form ax² + bx + c = 0.",
        keyPoints: [
          "The degree of the equation must be exactly 2",
          "The coefficient a cannot be zero (or else it would not be quadratic)",
          "It can be written in the form ax² + bx + c = 0",
        ],
        examples: [
          "x² + 5x + 6 = 0 (quadratic, a=1, b=5, c=6)",
          "2x² - 7x + 3 = 0 (quadratic, a=2, b=-7, c=3)",
          "x² = 9 (quadratic, same as x² - 9 = 0)",
        ],
        commonMistakes: [
          "Thinking x³ + 2x + 1 = 0 is quadratic (it is cubic)",
          "Saying a can be zero (it cannot be zero for a quadratic)",
        ],
      },
      accessibility: {
        boardDescription:
          "The board defines a quadratic equation in the form ax² + bx + c = 0, where a is not zero. It explains each coefficient.",
        screenReaderText:
          "A quadratic equation is of the form ax squared plus bx plus c equals zero, where a is not equal to zero.",
        simplifiedExplanation:
          "A quadratic equation has x squared as the highest power of x.",
      },
    },

    {
      id: "step_2",
      order: 2,
      title: "Factoring Quadratic Expressions",
      estimatedMinutes: 8,
      boardItems: [
        {
          id: "b7",
          type: "heading",
          text: "How to Factor a Quadratic",
          readExactly: true,
          accessibleDescription: "How to Factor a Quadratic",
        },
        {
          id: "b8",
          type: "bullet",
          text: "Look for two numbers that multiply to c.",
          readExactly: true,
          explanation:
            "These two numbers will be the key to factoring the expression.",
          accessibleDescription: "Find two numbers that multiply to c",
        },
        {
          id: "b9",
          type: "bullet",
          text: "These same numbers must add to b.",
          readExactly: true,
          explanation: "Both conditions must be true for factoring to work.",
          accessibleDescription: "The same numbers must add to b",
        },
        {
          id: "b10",
          type: "bullet",
          text: "Then write: (x + m)(x + n) where m and n are those numbers.",
          readExactly: true,
          explanation:
            "This is the factored form of the quadratic expression.",
          accessibleDescription: "Write the factors as x plus m times x plus n",
        },
        {
          id: "b11",
          type: "bullet",
          text: "Always expand to check your answer.",
          readExactly: true,
          explanation: "Multiply out the brackets to verify you got it right.",
          accessibleDescription: "Expand to verify your factoring",
        },
      ],
      teacherNotes:
        "Walk through the factoring process step by step. Use a worked example to show each step. Common issue: students forget to verify their factoring by expanding.",
      learnerNotes: {
        summary:
          "To factor a quadratic expression x² + bx + c, find two numbers m and n such that m × n = c and m + n = b. Then the factors are (x + m)(x + n).",
        keyPoints: [
          "Find m and n where m × n = c (product condition)",
          "And m + n = b (sum condition)",
          "Write the factors as (x + m)(x + n)",
          "Always verify by expanding",
        ],
        examples: [
          "x² + 5x + 6: Need two numbers that multiply to 6 and add to 5 → 2 and 3 → (x + 2)(x + 3)",
          "x² + 7x + 12: Need numbers that multiply to 12 and add to 7 → 3 and 4 → (x + 3)(x + 4)",
        ],
        commonMistakes: [
          "Forgetting to check that the sum equals b",
          "Not verifying by expanding the factors",
          "Using the wrong sign in the factors",
        ],
        formulasOrRules: [
          "For x² + bx + c = (x + m)(x + n): m × n = c and m + n = b",
        ],
      },
      accessibility: {
        boardDescription:
          "The board shows the four-step process for factoring: find two numbers that multiply to c, check they add to b, write the factored form, and verify by expanding.",
        screenReaderText:
          "To factor x squared plus bx plus c, find m and n where m times n equals c and m plus n equals b. Then the factors are x plus m times x plus n.",
        simplifiedExplanation:
          "To factor a quadratic, find two numbers that multiply together to make c and add together to make b.",
      },
    },

    {
      id: "step_3",
      order: 3,
      title: "Using the Zero Product Rule",
      estimatedMinutes: 5,
      boardItems: [
        {
          id: "b12",
          type: "heading",
          text: "The Zero Product Rule",
          readExactly: true,
          accessibleDescription: "The Zero Product Rule",
        },
        {
          id: "b13",
          type: "bullet",
          text: "If (x + m)(x + n) = 0",
          readExactly: true,
          explanation: "Then one of the factors must equal zero.",
          accessibleDescription: "If x plus m times x plus n equals zero",
        },
        {
          id: "b14",
          type: "bullet",
          text: "Either x + m = 0 or x + n = 0",
          readExactly: true,
          explanation:
            "The only way a product can be zero is if one factor is zero.",
          accessibleDescription: "Either x plus m equals zero or x plus n equals zero",
        },
        {
          id: "b15",
          type: "bullet",
          text: "Solve each to find x = -m or x = -n",
          readExactly: true,
          explanation: "These are the two solutions to the quadratic equation.",
          accessibleDescription: "The solutions are x equals negative m or x equals negative n",
        },
        {
          id: "b16",
          type: "bullet",
          text: "Always check both solutions in the original equation.",
          readExactly: true,
          explanation: "Verification confirms your solutions are correct.",
          accessibleDescription: "Verify both solutions in the original equation",
        },
      ],
      teacherNotes:
        "The zero product rule is fundamental. Emphasize that this is the KEY principle that lets us go from factored form to solutions.",
      learnerNotes: {
        summary:
          "The zero product rule states: if a product equals zero, then at least one of the factors must be zero. This allows us to find solutions.",
        keyPoints: [
          "If (x + m)(x + n) = 0, then x + m = 0 or x + n = 0",
          "Solve each equation: x = -m or x = -n",
          "These are the two solutions to the original quadratic",
        ],
        examples: [
          "If (x + 2)(x + 3) = 0, then x + 2 = 0 or x + 3 = 0, so x = -2 or x = -3",
        ],
        commonMistakes: [
          "Forgetting that it is OR not AND",
          "Not solving each equation separately",
          "Losing the negative signs",
        ],
      },
      accessibility: {
        boardDescription:
          "The zero product rule: if a product of factors equals zero, at least one factor must be zero. This is used to solve by setting each factor to zero and solving.",
        screenReaderText:
          "If x plus m times x plus n equals zero, then either x plus m equals zero or x plus n equals zero, giving solutions x equals negative m or x equals negative n.",
        simplifiedExplanation:
          "If two things multiply to zero, one of them must be zero. So if (x + 2)(x + 3) = 0, then x = -2 or x = -3.",
      },
    },

    {
      id: "step_4",
      order: 4,
      title: "Complete Example",
      estimatedMinutes: 6,
      boardItems: [
        {
          id: "b17",
          type: "heading",
          text: "Solve: x² + 5x + 6 = 0",
          readExactly: true,
          accessibleDescription: "Solve x squared plus 5x plus 6 equals zero",
        },
        {
          id: "b18",
          type: "bullet",
          text: "Step 1: Find factors of 6 that add to 5.",
          readExactly: true,
          explanation: "We need two numbers that multiply to 6 and add to 5.",
          accessibleDescription: "Find factors of 6 that add to 5",
        },
        {
          id: "b19",
          type: "calculation",
          text: "2 × 3 = 6  and  2 + 3 = 5  ✓",
          readExactly: true,
          explanation: "Both conditions are satisfied, so we have found the numbers.",
          accessibleDescription: "2 times 3 equals 6 and 2 plus 3 equals 5",
        },
        {
          id: "b20",
          type: "bullet",
          text: "Step 2: Write the factored form.",
          readExactly: true,
          explanation: "Use the two numbers to write the factored form.",
          accessibleDescription: "Write the factored form",
        },
        {
          id: "b21",
          type: "equation",
          text: "x² + 5x + 6 = (x + 2)(x + 3)",
          readExactly: true,
          explanation: "This is the factored form of the quadratic.",
          accessibleDescription: "x squared plus 5x plus 6 equals x plus 2 times x plus 3",
        },
        {
          id: "b22",
          type: "bullet",
          text: "Step 3: Apply the zero product rule.",
          readExactly: true,
          explanation:
            "Set each factor equal to zero and solve for x.",
          accessibleDescription: "Apply the zero product rule",
        },
        {
          id: "b23",
          type: "calculation",
          text: "(x + 2) = 0  →  x = -2",
          readExactly: true,
          explanation: "First solution from the first factor.",
          accessibleDescription: "x plus 2 equals zero so x equals negative 2",
        },
        {
          id: "b24",
          type: "calculation",
          text: "(x + 3) = 0  →  x = -3",
          readExactly: true,
          explanation: "Second solution from the second factor.",
          accessibleDescription: "x plus 3 equals zero so x equals negative 3",
        },
        {
          id: "b25",
          type: "bullet",
          text: "Step 4: Verify the solutions.",
          readExactly: true,
          explanation: "Check that both solutions work in the original equation.",
          accessibleDescription: "Verify the solutions",
        },
        {
          id: "b26",
          type: "calculation",
          text: "x = -2: (-2)² + 5(-2) + 6 = 4 - 10 + 6 = 0  ✓",
          readExactly: true,
          explanation: "The first solution satisfies the equation.",
          accessibleDescription: "Negative 2 squared plus 5 times negative 2 plus 6 equals 0",
        },
        {
          id: "b27",
          type: "calculation",
          text: "x = -3: (-3)² + 5(-3) + 6 = 9 - 15 + 6 = 0  ✓",
          readExactly: true,
          explanation: "The second solution satisfies the equation.",
          accessibleDescription: "Negative 3 squared plus 5 times negative 3 plus 6 equals 0",
        },
        {
          id: "b28",
          type: "answer",
          text: "Solutions: x = -2 or x = -3",
          readExactly: true,
          explanation: "Both solutions are correct.",
          accessibleDescription: "The solutions are x equals negative 2 or x equals negative 3",
        },
      ],
      teacherNotes:
        "This is the complete worked example. Take time to show each step clearly. Pause and ask questions to check understanding.",
      learnerNotes: {
        summary: "Here is the complete step-by-step solution to x² + 5x + 6 = 0.",
        keyPoints: [
          "Factor: find 2 and 3 (multiply to 6, add to 5)",
          "Write: (x + 2)(x + 3) = 0",
          "Solve: x = -2 or x = -3",
          "Check: both solutions work",
        ],
        examples: [],
        commonMistakes: [],
      },
      accessibility: {
        boardDescription:
          "Complete solution showing all four steps: finding factors, writing factored form, applying zero product rule, and verifying solutions.",
        screenReaderText:
          "To solve x squared plus 5x plus 6 equals zero: factor into x plus 2 times x plus 3, apply the zero product rule to get x equals negative 2 or x equals negative 3, then verify both solutions.",
        simplifiedExplanation:
          "Solve x² + 5x + 6 = 0: Factor to (x + 2)(x + 3) = 0, so x = -2 or x = -3. Check both work.",
      },
    },
  ],

  notes: {
    learnerNotes: {
      summary:
        "Quadratic equations can be solved by factoring. Factor the expression into two brackets, apply the zero product rule, and solve each resulting linear equation.",
      sections: [
        {
          title: "What is a Quadratic Equation?",
          content:
            "A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0. The highest power of x is 2.",
          keyPoints: [
            "Standard form: ax² + bx + c = 0",
            "a cannot be zero",
            "Can have 0, 1, or 2 real solutions",
          ],
        },
        {
          title: "The Factoring Method",
          content:
            "This method works when the quadratic can be factored into linear factors. We find two numbers that multiply to c and add to b.",
          keyPoints: [
            "Factor into (x + m)(x + n)",
            "Requires: m × n = c and m + n = b",
            "Works best for simple quadratics",
          ],
        },
        {
          title: "Solving Using the Zero Product Rule",
          content:
            "Once factored, use the zero product rule: if a product is zero, at least one factor must be zero.",
          keyPoints: [
            "If (x + m)(x + n) = 0, then x + m = 0 or x + n = 0",
            "Solve each equation separately",
            "You get two solutions (usually)",
          ],
        },
      ],
      formulasAndRules: [
        {
          formula: "x² + bx + c = (x + m)(x + n)",
          when: "When m × n = c and m + n = b",
          example: "x² + 5x + 6 = (x + 2)(x + 3)",
        },
        {
          formula: "If (x + m)(x + n) = 0, then x = -m or x = -n",
          when: "Zero product rule",
          example: "From (x + 2)(x + 3) = 0, we get x = -2 or x = -3",
        },
      ],
      commonMistakes: [
        {
          mistake:
            "Using numbers that multiply to c but do not add to b",
          correction:
            "Check both conditions: the numbers must multiply to c AND add to b",
        },
        {
          mistake:
            "Forgetting to check the solutions in the original equation",
          correction:
            "Always substitute both solutions back into the original equation to verify",
        },
        {
          mistake: "Losing track of negative signs",
          correction:
            "Be careful with signs: if (x + 2) = 0, then x = -2 (not x = 2)",
        },
      ],
    },
    teacherGuide: {
      keyMessages: [
        "Factoring is a powerful problem-solving strategy for quadratics",
        "The zero product rule is the KEY principle that lets us solve",
        "Always verify solutions by substituting back into the original equation",
        "This method only works when the quadratic can be factored with integer factors",
      ],
      commonStudentConfusions: [
        "Confusing factoring x² + bx + c with factoring out a common factor",
        "Using only the product condition and forgetting the sum condition",
        "Making sign errors when applying the zero product rule",
        "Not realizing both solutions should be checked",
      ],
      timingNotes:
        "Spend the most time on the worked example. Go slow and ask questions after each step. If students seem lost, do a second example using different numbers.",
      adaptations: {
        forSlowLearners:
          "Provide a list of factor pairs to help them identify the correct numbers. Use smaller numbers in practice problems. Spend extra time on the verification step.",
        forFastLearners:
          "Challenge them to explain why the factoring method works. Introduce quadratics with leading coefficients other than 1. Discuss when factoring is not possible.",
      },
    },
  },

  questionCheckpoints: [
    {
      id: "qc1",
      triggerMinute: 5,
      promptText: "Do you have any questions before we continue?",
      promptAudio: "Do you have any questions before we continue?",
      required: false,
      inputModes: ["text", "voice", "quick_action"],
    },
    {
      id: "qc2",
      triggerMinute: 10,
      promptText:
        "Can you explain what the zero product rule means in your own words?",
      promptAudio:
        "Can you explain what the zero product rule means in your own words?",
      required: false,
      inputModes: ["text", "voice"],
    },
    {
      id: "qc3",
      triggerMinute: 18,
      promptText: "Do you understand how we verified our solutions?",
      promptAudio: "Do you understand how we verified our solutions?",
      required: false,
      inputModes: ["text", "voice", "quick_action"],
    },
  ],

  requiredMidLessonQuestion: {
    id: "mlq1",
    triggerPercentage: 50,
    questionText: "For the expression x² + 7x + 12, which two numbers multiply to 12 and add to 7?",
    correctAnswers: [
      "3 and 4",
      "4 and 3",
      "three and four",
      "four and three",
    ],
    feedbackCorrect:
      "Correct! 3 × 4 = 12 and 3 + 4 = 7. So the factors are (x + 3)(x + 4).",
    feedbackIncorrect:
      "Let me help. We need two numbers that multiply to 12 and add to 7. Let us think through the factor pairs of 12: 1 and 12, 2 and 6, 3 and 4. Which pair adds to 7?",
    hints: [
      "Think about factor pairs of 12",
      "Which pair of factors adds to 7?",
      "The factors are 3 and 4",
    ],
  },

  guidedPractice: {
    id: "gp1",
    problem: "Solve x² + 9x + 20 = 0",
    solution: "x = -4 or x = -5",
    explanation:
      "We factor 20 into 4 and 5 (because 4 × 5 = 20 and 4 + 5 = 9). So (x + 4)(x + 5) = 0, giving x = -4 or x = -5.",
    workingSteps: [
      "Factor 20: what numbers multiply to 20 and add to 9?",
      "Answer: 4 and 5",
      "Factored form: (x + 4)(x + 5) = 0",
      "Apply zero product rule: x + 4 = 0 or x + 5 = 0",
      "Solve: x = -4 or x = -5",
      "Verify: (-4)² + 9(-4) + 20 = 16 - 36 + 20 = 0 ✓",
    ],
  },

  independentPractice: {
    id: "ip1",
    problem: "Solve x² + 8x + 15 = 0",
    difficulty: "medium",
    timeLimit: 300, // 5 minutes
  },

  exitTicket: {
    id: "et1",
    question:
      "Solve x² + 6x + 8 = 0. Show all your working including factoring, applying the zero product rule, and verifying your solutions.",
    difficulty: "medium",
  },

  homework: {
    id: "hw1",
    title: "Practice Factoring and Solving Quadratics",
    problems: [
      {
        id: "hw_1",
        problem: "Solve x² + 7x + 12 = 0",
        difficulty: "easy",
      },
      {
        id: "hw_2",
        problem: "Solve x² + 9x + 14 = 0",
        difficulty: "easy",
      },
      {
        id: "hw_3",
        problem: "Solve x² + 11x + 24 = 0",
        difficulty: "medium",
      },
      {
        id: "hw_4",
        problem: "Solve x² + 13x + 36 = 0",
        difficulty: "medium",
      },
      {
        id: "hw_5",
        problem:
          "Solve x² + 15x + 50 = 0. Explain why 5 and 10 are the correct factors.",
        difficulty: "hard",
      },
    ],
    estimatedMinutes: 20,
    reviewMaterial:
      "Check your factoring by multiplying the factors out. Always verify your solutions in the original equation.",
  },

  attachedResources: [
    {
      title: "Quadratic Equations Worksheet",
      type: "pdf",
      url: "/resources/quadratic-worksheet.pdf",
    },
    {
      title: "Khan Academy: Solving by Factoring",
      type: "link",
      url: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratics-multiplying-factoring",
    },
  ],
};
