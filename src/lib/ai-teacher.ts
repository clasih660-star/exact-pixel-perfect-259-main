import type { LessonState, TeacherResponse, LessonStepKey, ChatTurn, QuizQuestion } from "./types";

const QUICK_ACTION_RESPONSES: Record<string, Partial<TeacherResponse>> = {
  "I don't understand. Can you explain it differently?": {
    speak:
      "Of course! Let me break this down in a different way. Think of factoring like un-multiplying - we're working backwards to find what was multiplied together. If you multiply (x - 2) and (x - 3), you get x² - 5x + 6. So factoring is finding those original pieces!",
    simpleExplanation:
      "Factoring is working backwards from multiplication to find what numbers were multiplied together.",
    encouragementLevel: "medium",
  },
  "Can you repeat that please?": {
    speak:
      "Sure! Let me say that again. We're looking for two numbers that multiply to give us the constant term and add to give us the coefficient of x. Once we find those numbers, we can write the equation as factors and solve.",
    simpleExplanation:
      "We need two special numbers - when multiplied they give one result, when added they give another.",
    encouragementLevel: "low",
  },
  "Give me a real-world example.": {
    speak:
      "Great question! Imagine you're designing a rectangular garden. If the area is 24 square meters and the perimeter is 20 meters, you could use quadratic equations to find the length and width. The equation would be x² - 10x + 24 = 0, which factors to (x - 4)(x - 6) = 0, giving us sides of 4 and 6 meters!",
    simpleExplanation:
      "Garden designers use quadratic equations to find the right dimensions when they know the area and perimeter.",
    encouragementLevel: "medium",
  },
  "Please slow down and break it into smaller steps.": {
    speak:
      "No problem! Let's take this one step at a time. First step: identify what numbers we need. We need two numbers. Second step: figure out what they should do. They should multiply to one number and add to another. Third step: test number pairs until we find the right ones. Fourth step: write them as factors. Fifth step: solve each factor.",
    simpleExplanation:
      "Let's break it down: find the right numbers, test them, write as factors, then solve.",
    encouragementLevel: "high",
  },
  "I understand this, can we move a bit faster?": {
    speak:
      "Awesome! Since you're comfortable, let's pick up the pace. We can skip some of the detailed explanations and focus on the key patterns. Ready for a more challenging problem?",
    simpleExplanation: "Great! We'll focus on the main ideas and try harder problems.",
    encouragementLevel: "high",
  },
  "I'm ready — test me with a question.": {
    speak:
      "Let's see how you do! Here's your question: What are the solutions to x² - 7x + 10 = 0? Remember, find two numbers that multiply to 10 and add to -7. Tell me your answer!",
    quiz: {
      question: "What are the solutions to x² - 7x + 10 = 0?",
      options: ["x = 1 and x = 10", "x = 2 and x = 5", "x = -2 and x = -5", "x = -1 and x = -10"],
      correctIndex: 1,
      explanation: "The numbers are -2 and -5 because -2 × -5 = 10 and -2 + (-5) = -7",
    },
    encouragementLevel: "medium",
  },
  "Can you give me a hint without telling me the answer?": {
    speak:
      "Here's a hint: Think about all the pairs of numbers that multiply to give you the constant term. Then check which of those pairs adds to give you the coefficient of x. Pay attention to whether the numbers should be positive or negative!",
    simpleExplanation:
      "List all number pairs that multiply correctly, then check which pair also adds correctly.",
    encouragementLevel: "low",
  },
  "Why is this important? How will I use this in real life?": {
    speak:
      "This is such an important question! Quadratic equations are everywhere: engineers use them to design bridges and buildings, economists use them to find maximum profit, scientists use them to model projectile motion, and even video game developers use them for realistic physics. Whenever something involves curved paths, optimization, or maximum/minimum values, quadratics are involved!",
    simpleExplanation:
      "Quadratic equations help engineers, scientists, and economists solve real problems about curves and finding the best solutions.",
    encouragementLevel: "medium",
  },
};

const STEP_TRANSITIONS: Record<LessonStepKey, LessonStepKey> = {
  hook: "concept",
  concept: "worked_example",
  worked_example: "guided_practice",
  guided_practice: "independent_question",
  independent_question: "correction",
  correction: "quiz",
  quiz: "summary",
  summary: "summary",
};

const CORRECT_RESPONSES = [
  "Excellent! That's absolutely correct!",
  "Perfect! You've got it!",
  "Great job! Your solution is spot on!",
  "Well done! You're mastering this!",
  "Fantastic! That's the right answer!",
];

const INCORRECT_RESPONSES = [
  "Not quite, but you're on the right track. Let's look at this together.",
  "Almost there! Let me help you see where to adjust.",
  "Good try! Let's work through this step by step.",
  "That's not quite right, but I can see you're thinking about it. Let's fix this together.",
  "Close, but not exactly. Let me guide you to the correct approach.",
];

const PARTIAL_RESPONSES = [
  "You're partially correct! Let's refine your answer.",
  "Good start! There's one more thing to consider.",
  "You're on the right path! Let's complete the solution.",
];

export function generateTeacherResponse(
  studentMessage: string,
  currentState: LessonState,
  lessonData: any,
): TeacherResponse {
  const lowerMessage = studentMessage.toLowerCase();

  // Check for quick action responses
  const quickActionMatch = QUICK_ACTION_RESPONSES[studentMessage];
  if (quickActionMatch) {
    return {
      speak: quickActionMatch.speak || "Let me help you with that.",
      board: {
        title: "Helpful Explanation",
        lines: [
          quickActionMatch.simpleExplanation || "Let me explain this differently.",
          "",
          "Key points to remember:",
          "• Break problems into smaller steps",
          "• Look for patterns",
          "• Practice with examples",
        ],
      },
      nextStep: currentState.step,
      confusionDelta: -0.1,
      encouragementLevel: quickActionMatch.encouragementLevel || "medium",
      simpleExplanation: quickActionMatch.simpleExplanation,
      ...(quickActionMatch.quiz && { quiz: quickActionMatch.quiz }),
    };
  }

  // Check for quiz answers
  const quizAnswerMatch = studentMessage.match(/my answer[:\s]+["']?([^"']+)["']?/i);
  if (quizAnswerMatch) {
    const answer = quizAnswerMatch[1].trim();
    const isCorrect = evaluateQuizAnswer(answer, currentState);

    if (isCorrect) {
      return {
        speak:
          CORRECT_RESPONSES[Math.floor(Math.random() * CORRECT_RESPONSES.length)] +
          " Ready to move to the next topic?",
        board: {
          title: "Correct Answer!",
          lines: [
            "✓ " + answer,
            "",
            "Great job! You've mastered this step.",
            "Let's move on to the next concept.",
          ],
          highlight: answer,
        },
        nextStep: STEP_TRANSITIONS[currentState.step],
        confusionDelta: -0.2,
        evaluation: "correct",
        encouragementLevel: "high",
      };
    } else {
      return {
        speak: INCORRECT_RESPONSES[Math.floor(Math.random() * INCORRECT_RESPONSES.length)],
        board: {
          title: "Let's Review",
          lines: [
            "Your answer: " + answer,
            "",
            "Let's think through this again:",
            "1. What numbers multiply to the constant?",
            "2. What numbers add to the coefficient?",
            "3. Check your signs (+ or -)",
          ],
        },
        nextStep: currentState.step,
        confusionDelta: 0.1,
        evaluation: "incorrect",
        encouragementLevel: "medium",
      };
    }
  }

  // Check for "I think I got it wrong"
  if (lowerMessage.includes("wrong") || lowerMessage.includes("mistake")) {
    return {
      speak:
        "That's okay! Making mistakes is how we learn. Let me help you understand where things went wrong and get back on track.",
      board: {
        title: "Learning from Mistakes",
        lines: [
          "It's okay to make mistakes!",
          "",
          "Let's identify the issue:",
          "• Review the steps we took",
          "• Find where things diverged",
          "• Correct and learn from it",
        ],
      },
      nextStep: "correction",
      confusionDelta: 0.15,
      evaluation: "incorrect",
      encouragementLevel: "high",
    };
  }

  // Check for understanding
  if (
    lowerMessage.includes("understand") ||
    lowerMessage.includes("get it") ||
    lowerMessage.includes("makes sense")
  ) {
    return {
      speak:
        "I'm so glad that makes sense! You're doing great. Let's continue building on this understanding.",
      board: {
        title: "Progress Made!",
        lines: [
          "✓ Understanding confirmed",
          "",
          "You're ready for the next step!",
          "Let's continue our journey.",
        ],
      },
      nextStep: STEP_TRANSITIONS[currentState.step],
      confusionDelta: -0.15,
      evaluation: "correct",
      encouragementLevel: "high",
    };
  }

  // Check for confusion
  if (
    lowerMessage.includes("confused") ||
    lowerMessage.includes("don't know") ||
    lowerMessage.includes("stuck")
  ) {
    return {
      speak:
        "No worries at all! Let me approach this from a different angle. Sometimes hearing it explained another way helps everything click.",
      board: {
        title: "Alternative Approach",
        lines: [
          "Let's try a different way to understand this.",
          "",
          "Think of it like a puzzle:",
          "• We have some pieces (numbers)",
          "• We know how they fit together",
          "• We need to find the right combination",
        ],
      },
      nextStep: currentState.step,
      confusionDelta: 0.05,
      encouragementLevel: "high",
    };
  }

  // Check for ready to continue
  if (
    lowerMessage.includes("ready") ||
    lowerMessage.includes("continue") ||
    lowerMessage.includes("next")
  ) {
    return {
      speak: "Perfect! Let's move on to the next step. I'm excited to see you tackle this!",
      board: {
        title: "Moving Forward",
        lines: [
          "Ready for the next challenge!",
          "",
          "Let's apply what we've learned",
          "to a new situation.",
        ],
      },
      nextStep: STEP_TRANSITIONS[currentState.step],
      confusionDelta: -0.1,
      encouragementLevel: "medium",
    };
  }

  // Default response
  return {
    speak:
      "I appreciate your input! Let me help you with that. Remember, we're working together to master this concept.",
    board: {
      title: "Working Together",
      lines: [
        "Let's continue our learning journey.",
        "",
        "Focus on understanding the:",
        "• Key concepts",
        "• Step-by-step process",
        "• Patterns and relationships",
      ],
    },
    nextStep: currentState.step,
    confusionDelta: 0,
    encouragementLevel: "medium",
  };
}

function evaluateQuizAnswer(answer: string, state: LessonState): boolean {
  // This is a simplified evaluation - in a real implementation,
  // you'd compare against the actual correct answer
  const correctAnswers = ["2 and 5", "x = 2 and x = 5", "x=2 and x=5"];
  return correctAnswers.some((correct) => answer.toLowerCase().includes(correct.toLowerCase()));
}

export function generateConfusedResponse(currentState: LessonState): TeacherResponse {
  const explanations = [
    "I notice you might be feeling a bit confused. That's completely normal! Let's take a step back and look at the foundation of this concept.",
    "Let's slow down and make sure we understand each piece before moving forward. Confusion is just your brain working hard to learn!",
    "It seems like this part is tricky. Let me explain it using a different approach that might click better for you.",
  ];

  return {
    speak: explanations[Math.floor(Math.random() * explanations.length)],
    board: {
      title: "Let's Clarify",
      lines: [
        "Breaking it down:",
        "",
        "Step 1: Understand what we're solving for",
        "Step 2: Identify the given information",
        "Step 3: Choose the right method",
        "Step 4: Apply it carefully",
      ],
    },
    nextStep: currentState.step,
    confusionDelta: -0.1,
    encouragementLevel: "high",
  };
}

export function generateEncouragement(state: LessonState): string {
  if (state.correct > state.mistakes) {
    return "You're doing fantastic! Your accuracy shows you really understand this material.";
  } else if (state.confusionScore > 0.5) {
    return "I can see you're working hard. Don't get discouraged - every mistake is a learning opportunity!";
  } else {
    return "You're making great progress! Keep up the good work and don't hesitate to ask questions.";
  }
}

export function generateNextStepPrompt(currentStep: LessonStepKey): string {
  const prompts: Record<LessonStepKey, string> = {
    hook: "Ready to learn about the concept behind this?",
    concept: "Want to see how this works in practice?",
    worked_example: "Ready to try solving one together with my guidance?",
    guided_practice: "Ready to try one on your own?",
    independent_question: "Let me check your work and give you feedback!",
    correction: "Perfect! Ready to test your knowledge?",
    quiz: "Great job on the quiz! Let's summarize what we learned.",
    summary: "Excellent work! You've completed this lesson!",
  };
  return prompts[currentStep] || "Ready to continue?";
}

export function adjustResponseStyle(
  baseResponse: TeacherResponse,
  studentLevel: "beginner" | "intermediate" | "advanced",
): TeacherResponse {
  if (studentLevel === "beginner") {
    return {
      ...baseResponse,
      speak: simplifyLanguage(baseResponse.speak),
      simpleExplanation: baseResponse.simpleExplanation || baseResponse.speak,
    };
  } else if (studentLevel === "advanced") {
    return {
      ...baseResponse,
      speak: addDepth(baseResponse.speak),
      encouragementLevel: "low",
    };
  }
  return baseResponse;
}

function simplifyLanguage(text: string): string {
  // Simplify complex language for beginners
  return text
    .replace(/consequently/gi, "so")
    .replace(/furthermore/gi, "also")
    .replace(/therefore/gi, "so")
    .replace(/however/gi, "but")
    .replace(/utilize/gi, "use")
    .replace(/demonstrate/gi, "show")
    .replace(/illustrate/gi, "show");
}

function addDepth(text: string): string {
  // Add more depth and nuance for advanced students
  return (
    text + " This connects to broader mathematical principles you'll encounter in advanced topics."
  );
}

export function shouldOfferQuiz(currentState: LessonState): boolean {
  // Offer quiz after some progress has been made
  const stepOrder = [
    "hook",
    "concept",
    "worked_example",
    "guided_practice",
    "independent_question",
    "correction",
    "quiz",
    "summary",
  ];
  const currentIndex = stepOrder.indexOf(currentState.step);
  return currentIndex >= 4 && currentState.confusionScore < 0.4;
}

export function calculateConfusionDelta(studentMessage: string, currentState: LessonState): number {
  const lowerMessage = studentMessage.toLowerCase();

  // Indicators of understanding
  if (
    lowerMessage.includes("understand") ||
    lowerMessage.includes("get it") ||
    lowerMessage.includes("easy")
  ) {
    return -0.15;
  }

  // Indicators of confusion
  if (
    lowerMessage.includes("confused") ||
    lowerMessage.includes("don't know") ||
    lowerMessage.includes("stuck")
  ) {
    return 0.15;
  }

  // Indicators of partial understanding
  if (
    lowerMessage.includes("kind of") ||
    lowerMessage.includes("sort of") ||
    lowerMessage.includes("maybe")
  ) {
    return 0.05;
  }

  return 0;
}
