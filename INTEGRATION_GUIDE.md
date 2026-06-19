# 🚀 Quick Integration Guide - Klassruum Components

## Using the AnimatedWhiteboard

```typescript
import { AnimatedWhiteboard } from '@/components/classroom/AnimatedWhiteboard'
import { BoardWriteItem } from '@/lib/types'

const boardItems: BoardWriteItem[] = [
  {
    id: 'b1',
    type: 'heading',
    text: 'Quadratic Equations',
    readExactly: true,
    accessibleDescription: 'The heading is Quadratic Equations'
  },
  {
    id: 'b2',
    type: 'equation',
    text: 'ax² + bx + c = 0',
    explanation: 'Standard form where a ≠ 0',
    accessibleDescription: 'ax squared plus bx plus c equals zero'
  }
]

<AnimatedWhiteboard
  items={boardItems}
  isPlaying={true}
  writingSpeed="normal" // or "slow", "fast"
  onItemComplete={(id) => console.log(`Finished: ${id}`)}
  onSequenceComplete={() => console.log('All items written')}
  isReplayMode={false}
/>
```

## Using the QuestionSystem

```typescript
import { QuestionSystem } from '@/components/classroom/QuestionSystem'
import type { LearningMode } from '@/lib/types'

const userMode: LearningMode = 'standard' // or 'deaf', 'blind', 'speech_difficulty', 'adhd_focus', 'motor_support'

<QuestionSystem
  mode={userMode}
  isOpen={showQuestion}
  questionText="Do you understand the zero product rule?"
  onAnswer={(answer, method) => {
    console.log(`Answer: ${answer} via ${method}`) // method: 'text' | 'voice'
  }}
  onSkip={() => console.log('User skipped')}
  onClose={() => setShowQuestion(false)}
/>
```

### Mode-Specific Behaviors

- **standard**: Bottom bar with text + voice input
- **deaf**: Modal popup (audio disabled)
- **blind**: Auto-listening mode (audio ON)
- **speech_difficulty**: Text-only (no voice)
- **adhd_focus**: Minimal UI, huge buttons
- **motor_support**: Large 44px+ touch targets

## Using Notes Panels

```typescript
import { LearnerNotesPanel, TeacherNotesPanel } from '@/components/classroom/IntegratedNotesPanel'

// For Students
<LearnerNotesPanel
  lessonTitle="Solving Quadratic Equations"
  summary="Learn to factor and solve..."
  sections={[
    {
      title: 'What is a Quadratic?',
      content: 'An equation with x² as highest power...',
      keyPoints: ['Standard form: ax²+bx+c=0', 'a ≠ 0']
    }
  ]}
  formulasAndRules={[
    {
      formula: 'x² + bx + c = (x+m)(x+n)',
      when: 'When m×n=c and m+n=b',
      example: 'x²+5x+6 = (x+2)(x+3)'
    }
  ]}
  commonMistakes={[
    {
      mistake: 'Forgetting to check the sum',
      correction: 'Always verify: multiply AND add'
    }
  ]}
/>

// For Teachers
<TeacherNotesPanel
  lessonTitle="Solving Quadratic Equations"
  keyMessages={[
    'Factoring is a powerful strategy',
    'Zero product rule is KEY'
  ]}
  commonStudentConfusions={[
    'Confusing factoring with common factor',
    'Using only product, forgetting sum'
  ]}
  timingNotes="Spend most time on worked examples"
  adaptations={{
    forSlowLearners: 'Provide factor pair list',
    forFastLearners: 'Challenge with different coefficients'
  }}
/>
```

## Using Lesson Completion Flow

```typescript
import {
  ExitTicketPrompt,
  HomeworkPanel,
  LessonCompletionSummary
} from '@/components/classroom/LessonCompletionFlow'

// 1. Show Exit Ticket
<ExitTicketPrompt
  questionText="Solve x²+6x+8=0 showing all working"
  onSubmit={(answer) => {
    // Send to backend for grading
    submitExitTicket(answer)
  }}
  isLoading={submitting}
/>

// 2. Show Homework
<HomeworkPanel
  homework={lesson.homework}
  onStart={() => navigation.navigate('/homework')}
  onSaveForLater={() => saveHomework(lesson.id)}
/>

// 3. Show Summary
<LessonCompletionSummary
  lessonTitle="Solving Quadratic Equations"
  stats={{
    timeSpent: 32, // minutes
    questionsAsked: 3,
    midLessonQuestionAnswered: true,
    overallScorePercent: 85
  }}
  practiceBreakdown={{
    guidedPractice: { attempted: 1, score: 100 },
    independentPractice: { attempted: 2, score: 75 }
  }}
  weakTopics={['Negative numbers in factoring']}
  onDashboard={() => nav.to('/student/dashboard')}
  onRetake={() => nav.to(`/classroom/${lesson.id}`)}
  onNext={() => nav.to(`/lesson/${nextLessonId}`)}
/>
```

## Loading a Lesson

```typescript
import { sampleQuadraticsLesson } from "@/lib/sample-lesson";
import type { Lesson, LessonProgress } from "@/lib/lesson-types";

// Initialize lesson
const lesson: Lesson = sampleQuadraticsLesson;

// Track progress
const progress: LessonProgress = {
  currentStepIndex: 0,
  completedSteps: [],
  askedQuestions: [],
  midLessonQuestionAnswered: false,
  practiceAnswers: [],
  exitTicketAnswered: false,
  misconceptionsDetected: [],
};

// Move through lesson
function nextStep() {
  progress.currentStepIndex++;
  progress.completedSteps.push(lesson.steps[progress.currentStepIndex - 1].id);
}

// On question checkpoint
if (lesson.questionCheckpoints[checkpointIndex].triggerMinute <= timeElapsed) {
  // Show QuestionSystem
}

// Mid-lesson required question
if (timeElapsed >= lesson.estimatedDurationMinutes / 2) {
  // Show required question
  progress.midLessonQuestionAnswered = true;
}

// End of lesson
progress.exitTicketAnswered = true;
// Show LessonCompletionSummary
```

## Complete Lesson Flow Example

```typescript
import { AnimatedWhiteboard } from '@/components/classroom/AnimatedWhiteboard'
import { QuestionSystem } from '@/components/classroom/QuestionSystem'
import { LearnerNotesPanel } from '@/components/classroom/IntegratedNotesPanel'
import { LessonCompletionSummary } from '@/components/classroom/LessonCompletionFlow'
import { sampleQuadraticsLesson } from '@/lib/sample-lesson'
import { useState, useEffect } from 'react'

export function ClassroomPage({ lessonId }: { lessonId: string }) {
  const lesson = sampleQuadraticsLesson
  const [step, setStep] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setTimeElapsed(t => t + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Trigger questions at checkpoints
  useEffect(() => {
    const checkpoint = lesson.questionCheckpoints.find(
      cp => cp.triggerMinute * 60 <= timeElapsed && cp.triggerMinute * 60 > timeElapsed - 1
    )
    if (checkpoint) setShowQuestion(true)
  }, [timeElapsed])

  if (showCompletion) {
    return (
      <LessonCompletionSummary
        lessonTitle={lesson.title}
        stats={{/* your stats */}}
        practiceBreakdown={{/* your data */}}
        weakTopics={[]}
        onDashboard={() => { /* navigate */ }}
        onRetake={() => { /* restart */ }}
        onNext={() => { /* next lesson */ }}
      />
    )
  }

  const currentStep = lesson.steps[step]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
      {/* Main Content */}
      <div>
        <AnimatedWhiteboard
          items={currentStep.boardItems}
          isPlaying={true}
          onSequenceComplete={() => {
            if (step < lesson.steps.length - 1) {
              setStep(step + 1)
            } else {
              setShowCompletion(true)
            }
          }}
        />
      </div>

      {/* Notes Sidebar */}
      <div className="max-h-[600px] overflow-y-auto">
        <button onClick={() => setShowNotes(!showNotes)} className="kr-primary-button w-full mb-4">
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
        {showNotes && (
          <LearnerNotesPanel
            lessonTitle={lesson.title}
            summary={currentStep.learnerNotes.summary}
            sections={[/* from step */]}
          />
        )}
      </div>

      {/* Question Modal */}
      <QuestionSystem
        mode="standard"
        isOpen={showQuestion}
        questionText={lesson.questionCheckpoints[Math.floor(timeElapsed / 300)].promptText}
        onAnswer={(answer) => {
          console.log('Answered:', answer)
          setShowQuestion(false)
        }}
        onSkip={() => setShowQuestion(false)}
      />
    </div>
  )
}
```

## Type System Reference

```typescript
// Import these from @/lib/types
type LearningMode =
  | "standard"
  | "deaf"
  | "blind"
  | "speech_difficulty"
  | "adhd_focus"
  | "motor_support";

interface BoardWriteItem {
  id: string;
  type: "heading" | "bullet" | "equation" | "calculation" | "question" | "answer";
  text: string;
  readExactly?: boolean;
  explanation?: string;
  accessibleDescription: string;
  writingSpeed?: "slow" | "normal" | "fast";
}

// Import these from @/lib/lesson-types
interface Lesson {
  id: string;
  institutionId: string;
  courseId: string;
  title: string;
  estimatedDurationMinutes: number; // min 25
  objective: LessonObjective;
  steps: LessonStep[];
  questionCheckpoints: QuestionCheckpoint[];
  requiredMidLessonQuestion: RequiredLessonQuestion;
  exitTicket: ExitTicket;
  homework: Homework;
  // ... more properties
}
```

## CSS Classes for Styling

```css
/* Dashboard */
.kr-dashboard-shell {
}
.kr-sidebar {
}
.kr-sidebar-nav {
}
.kr-kpi-card {
}
.kr-status-badge {
}
.kr-primary-button {
}
.kr-secondary-button {
}
.kr-continue-hero {
}
.kr-card {
}
.kr-card-title {
}
.kr-card-description {
}
```

## Important Notes

1. **Speech Integration**: Uses `src/lib/speech.ts` with `startListening()` and `stopListening()`

2. **Accessibility**: All components follow WCAG 2.1 AA standards

3. **Typing**: Everything is fully typed - no `any` type usage

4. **Performance**: Components use React.memo for optimization

5. **Mobile**: All components are responsive (mobile-first design)

---

**Next Steps**: Wire these into VideoClassroomPage and test the full flow!
