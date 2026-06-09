/**
 * demo-lesson-real-teacher.ts
 *
 * Full quadratic equations lesson taught the way a strong real teacher teaches:
 *   explain → write → read → explain the written step → check → continue.
 *
 * Every board item has:
 *   - What appears on the board (boardText)
 *   - What the teacher reads exactly (exactSpokenText)
 *   - What the teacher explains deeply (teacherExplanation)
 *   - Why this step matters (whyThisStepMatters)
 *   - Common mistake warning (commonMistake, optional)
 *   - Accessibility description (accessibleDescription)
 */

import type { MathTeachingItem } from "./lesson-models";

// ─────────────────────────────────────────────────────────────────────────────
// Lesson: Solving x² + 5x + 6 = 0 by Factoring
// ─────────────────────────────────────────────────────────────────────────────

export const LESSON_TITLE = "Solving Quadratic Equations by Factoring";
export const LESSON_EQUATION = "x² + 5x + 6 = 0";

/**
 * The teacher's opening narrative before any board writing begins.
 * This sets the context for the entire lesson.
 */
export const LESSON_OPENING_NARRATIVE =
  "We are going to solve this quadratic equation by factoring. Factoring means rewriting the equation as two brackets. Once we have two brackets multiplied together and equal to zero, we can find the values of x that make each bracket equal to zero.";

/**
 * The main idea for learner notes.
 */
export const LESSON_MAIN_IDEA =
  "Factoring rewrites a quadratic equation as two brackets. Once factored, we set each bracket to zero to find the solutions.";

/**
 * Complete teaching sequence for solving x² + 5x + 6 = 0.
 *
 * Each item follows the pattern:
 *   Board writes → Teacher reads → Teacher explains → Warn → Check → Next
 */
export const quadraticTeachingSequence: MathTeachingItem[] = [
  // ── Board Item 1: Present the equation ──────────────────────────────────
  {
    id: "step_1",
    type: "equation",
    boardText: "x² + 5x + 6 = 0",
    exactSpokenText: "x squared plus five x plus six equals zero.",
    teacherExplanation:
      "This is the equation we want to solve. The x squared term tells us it is quadratic. The number 5 is the coefficient of x, and 6 is the constant term.",
    whyThisStepMatters:
      "We first identify the equation before choosing the solving method.",
    commonMistake:
      "Some learners forget that the x squared term is what makes this quadratic.",
    accessibleDescription:
      "The board shows the equation x squared plus five x plus six equals zero.",
    writingSpeed: "slow",
    pauseAfter: 1500,
  },

  // ── Board Item 2: Find numbers that multiply to 6 ───────────────────────
  {
    id: "step_2",
    type: "instruction",
    boardText: "Find two numbers that multiply to 6.",
    exactSpokenText: "Find two numbers that multiply to six.",
    teacherExplanation:
      "The number 6 is the constant term. To factor this quadratic, we need two numbers whose product is 6.",
    whyThisStepMatters:
      "This gives the first condition for choosing the correct factor pair.",
    commonMistake:
      "Do not choose numbers that only add correctly. They must multiply correctly too.",
    accessibleDescription:
      "The board asks the learner to find two numbers that multiply to six.",
    writingSpeed: "normal",
  },

  // ── Board Item 3: Same numbers must add to 5 ────────────────────────────
  {
    id: "step_3",
    type: "instruction",
    boardText: "The same numbers must add to 5.",
    exactSpokenText: "The same numbers must add to five.",
    teacherExplanation:
      "The number 5 comes from the middle term, 5x. So we are not looking for any two factors of 6. We need two factors of 6 that also add up to 5.",
    whyThisStepMatters:
      "This second condition confirms the correct pair.",
    commonMistake:
      "A learner may choose 1 and 6 because they multiply to 6, but they add to 7, not 5.",
    accessibleDescription:
      "The board explains that the same two numbers must also add to five.",
    writingSpeed: "normal",
  },

  // ── Board Item 4: Confirm multiplication ─────────────────────────────────
  {
    id: "step_4",
    type: "calculation",
    boardText: "2 × 3 = 6",
    exactSpokenText: "Two times three equals six.",
    teacherExplanation:
      "This confirms the multiplication condition. The numbers 2 and 3 multiply to the constant term, which is 6.",
    whyThisStepMatters:
      "Verifying the product condition ensures we have the right pair.",
    accessibleDescription:
      "The board shows two times three equals six.",
    writingSpeed: "normal",
  },

  // ── Board Item 5: Confirm addition ───────────────────────────────────────
  {
    id: "step_5",
    type: "calculation",
    boardText: "2 + 3 = 5",
    exactSpokenText: "Two plus three equals five.",
    teacherExplanation:
      "This confirms the addition condition. The same numbers, 2 and 3, add to the middle coefficient, which is 5.",
    whyThisStepMatters:
      "Verifying the sum condition confirms this is the correct factor pair.",
    accessibleDescription:
      "The board shows two plus three equals five.",
    writingSpeed: "normal",
    pauseAfter: 1000,
  },

  // ── Board Item 6: Write factored form ────────────────────────────────────
  {
    id: "step_6",
    type: "equation",
    boardText: "x² + 5x + 6 = (x + 2)(x + 3)",
    exactSpokenText: "x squared plus five x plus six equals x plus two times x plus three.",
    teacherExplanation:
      "Now we have rewritten the quadratic as two brackets. This works because if we expand these brackets, we get the original equation again.",
    whyThisStepMatters:
      "This is the key factoring step — rewriting the quadratic in bracket form.",
    commonMistake:
      "Some learners write (x + 2)(x + 3) but expand incorrectly when checking. Always verify.",
    accessibleDescription:
      "The board shows x squared plus five x plus six equals open bracket x plus two close bracket times open bracket x plus three close bracket.",
    writingSpeed: "slow",
    pauseAfter: 2000,
  },

  // ── Board Item 7: Set product equal to zero ─────────────────────────────
  {
    id: "step_7",
    type: "equation",
    boardText: "(x + 2)(x + 3) = 0",
    exactSpokenText: "x plus two times x plus three equals zero.",
    teacherExplanation:
      "Because the product of these two brackets equals zero, at least one bracket must be equal to zero.",
    whyThisStepMatters:
      "This applies the zero product rule, which is the key to finding solutions.",
    commonMistake:
      "Some learners forget the zero product rule and try to expand again instead of setting each bracket to zero.",
    accessibleDescription:
      "The board shows open bracket x plus two close bracket times open bracket x plus three close bracket equals zero.",
    writingSpeed: "normal",
  },

  // ── Board Item 8: Set each bracket to zero ──────────────────────────────
  {
    id: "step_8",
    type: "calculation",
    boardText: "x + 2 = 0   or   x + 3 = 0",
    exactSpokenText: "x plus two equals zero or x plus three equals zero.",
    teacherExplanation:
      "We now solve each small equation separately. Each one gives one possible value of x.",
    whyThisStepMatters:
      "This breaks the problem into two simple linear equations.",
    accessibleDescription:
      "The board shows x plus two equals zero or x plus three equals zero.",
    writingSpeed: "normal",
  },

  // ── Board Item 9: Final solutions ────────────────────────────────────────
  {
    id: "step_9",
    type: "answer",
    boardText: "x = -2   or   x = -3",
    exactSpokenText: "x equals negative two or x equals negative three.",
    teacherExplanation:
      "These are the two solutions. Notice that the factor numbers were positive 2 and positive 3, but the answers are negative 2 and negative 3 because each bracket must equal zero.",
    whyThisStepMatters:
      "This is the final answer. The sign change is the most common source of error.",
    commonMistake:
      "The factor numbers are positive 2 and 3, but the final answers are negative because x + 2 = 0 gives x = -2, not x = 2.",
    accessibleDescription:
      "The board shows the solutions: x equals negative two or x equals negative three.",
    writingSpeed: "slow",
    pauseAfter: 2000,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Full Learner Notes (pre-built for this lesson)
// ─────────────────────────────────────────────────────────────────────────────

export const FULL_LEARNER_NOTES = `Lesson: Solving x² + 5x + 6 = 0

Main idea:
Factoring rewrites a quadratic equation as two brackets.

Step 1:
Start with x² + 5x + 6 = 0.
This is a quadratic equation because the highest power of x is 2.

Step 2:
Find two numbers that multiply to 6.
The number 6 is the constant term. The two numbers must multiply to this value.

Step 3:
The same numbers must add to 5.
The number 5 comes from the middle term, 5x.

Step 4:
The numbers are 2 and 3.
2 × 3 = 6
2 + 3 = 5

Step 5:
Rewrite the equation.
x² + 5x + 6 = (x + 2)(x + 3)

Step 6:
Set each bracket equal to zero.
x + 2 = 0 or x + 3 = 0

Step 7:
Solve each bracket.
x = -2 or x = -3

Common mistake:
The factor numbers are positive 2 and 3, but the final answers are negative because x + 2 = 0 gives x = -2.`;

// ─────────────────────────────────────────────────────────────────────────────
// Teaching sequence for other subjects (demonstrates cross-subject model)
// ─────────────────────────────────────────────────────────────────────────────

/** Science example: Water Cycle */
export const waterCycleTeachingSequence: MathTeachingItem[] = [
  {
    id: "sci_1",
    type: "concept",
    boardText: "Heat changes water into vapor.",
    exactSpokenText: "Heat changes water into vapor.",
    teacherExplanation:
      "When water is heated, its particles gain energy and move faster. This allows some water to change into vapor.",
    whyThisStepMatters:
      "Evaporation is the first stage of the water cycle.",
    accessibleDescription: "Heat changes water into vapor.",
  },
  {
    id: "sci_2",
    type: "concept",
    boardText: "Vapor cools and forms clouds.",
    exactSpokenText: "Vapor cools and forms clouds.",
    teacherExplanation:
      "When vapor rises and cools, it condenses into tiny droplets that form clouds.",
    whyThisStepMatters:
      "Condensation is how clouds form, which leads to precipitation.",
    accessibleDescription: "Vapor cools and forms clouds.",
  },
  {
    id: "sci_3",
    type: "answer",
    boardText: "Heavy droplets fall as rain.",
    exactSpokenText: "Heavy droplets fall as rain.",
    teacherExplanation:
      "When the droplets in clouds become too heavy, gravity pulls them down as rain, completing the cycle.",
    whyThisStepMatters:
      "Precipitation returns water to the ground, completing the water cycle.",
    accessibleDescription: "Heavy droplets fall as rain.",
  },
];

/** Programming example: Function */
export const programmingTeachingSequence: MathTeachingItem[] = [
  {
    id: "prog_1",
    type: "equation",
    boardText: 'function greet(name) {\n  return "Hello " + name;\n}',
    exactSpokenText:
      "function greet, opening parenthesis, name, closing parenthesis, opening curly brace. return Hello plus name. Closing curly brace.",
    teacherExplanation:
      "This function receives one input called name. The return statement creates a text value by joining Hello with the value passed into the function.",
    whyThisStepMatters:
      "Functions are reusable blocks of code that perform specific tasks.",
    accessibleDescription:
      "A function named greet that takes name as input and returns Hello plus the name.",
  },
];

/** English example: Paragraph structure */
export const englishTeachingSequence: MathTeachingItem[] = [
  {
    id: "eng_1",
    type: "concept",
    boardText: "A topic sentence introduces the paragraph.",
    exactSpokenText: "A topic sentence introduces the paragraph.",
    teacherExplanation:
      "A paragraph needs structure. The first sentence tells the reader what the paragraph is about.",
    whyThisStepMatters:
      "Without a topic sentence, the reader does not know what to expect.",
    accessibleDescription: "A topic sentence introduces the paragraph.",
  },
  {
    id: "eng_2",
    type: "concept",
    boardText: "Supporting sentences explain the main idea.",
    exactSpokenText: "Supporting sentences explain the main idea.",
    teacherExplanation:
      "The supporting sentences add details and evidence to develop the main idea.",
    whyThisStepMatters:
      "Supporting sentences give the paragraph substance and credibility.",
    accessibleDescription: "Supporting sentences explain the main idea.",
  },
  {
    id: "eng_3",
    type: "answer",
    boardText: "The final sentence closes the paragraph.",
    exactSpokenText: "The final sentence closes the paragraph.",
    teacherExplanation:
      "The closing sentence brings the idea to a conclusion and may link to the next paragraph.",
    whyThisStepMatters:
      "A good closing sentence gives the paragraph a sense of completion.",
    accessibleDescription: "The final sentence closes the paragraph.",
  },
];