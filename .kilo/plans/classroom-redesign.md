# Classroom Redesign Plan

## Discoveries

- The current classroom uses a 3-column grid layout with proportions 1fr/360px/300px, which needs to be restructured to 22%/52%/26% proportions
- Existing `Avatar` component already has speaking animation with waveform effects and listening states
- `QuizCard` component exists but needs integration into the new chat interface
- Teacher states are currently simple boolean flags (speaking/listening) but need expansion to enum-based states (Listening/Thinking/Speaking/Explaining/Correcting/Encouraging)
- The whiteboard currently uses a simple card with lines array, but needs dot/grid background and step highlighting
- Current speech synthesis uses `speak()` function from `/lib/speech.ts`
- Progress tracking already exists with `persistProgress` function that fires after each turn

## Relevant Files

- `src/routes/classroom.$lessonId.tsx` - Main classroom component, contains current layout structure and state management
- `src/lib/teacher-types.ts` - Contains LessonStep enum, LessonState type, and ChatTurn type
- `src/lib/speech.ts` - Contains speech synthesis and recognition functions
- `src/components/QuizCard.tsx` - Existing quiz component for integration
- `src/components/brand/Logo.tsx` - Contains LogoMark component with gradient styling
- `src/lib/lessons.ts` - Contains Lesson type and lesson data structure
- `src/components/ui/*` - Available UI components (tabs, card, button, etc.)

## Implementation Notes

- The current `BoardState` type only has `title`, `lines`, and `highlight` - may need expansion for step-by-step layout
- Focus mode should toggle visibility of non-essential components while preserving state
- Mobile responsiveness needs to convert from 3-column to stacked layout while maintaining functionality
- Caption bar must work even when audio is muted - requires separate state management
- Accessibility toggles need to integrate with existing speech synthesis and recognition systems
- The existing `persistProgress` function should be preserved but may need updates for new state structure
- Teacher animation states need to be synchronized with speech synthesis events
