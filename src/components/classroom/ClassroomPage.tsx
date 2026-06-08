import { AITeacherPanel } from "./AITeacherPanel";
import { WhiteboardPanel } from "./WhiteboardPanel";
import { LearnPanel } from "./LearnPanel";
import { AudioControlBar } from "./AudioControlBar";
import { CaptionBar } from "./CaptionBar";
import type { ClassroomContext, TeacherState } from "@/lib/types";

interface ClassroomPageProps {
  classroomContext: ClassroomContext;
  teacherState: TeacherState;
  isSpeaking: boolean;
  isListening: boolean;
  showCaptions: boolean;
  currentMessage?: string;
  onToggleCaptions: () => void;
  onEndLesson: () => void;
  children?: React.ReactNode;
}

export function ClassroomPage({
  classroomContext,
  teacherState,
  isSpeaking,
  isListening,
  showCaptions,
  currentMessage,
  onToggleCaptions,
  onEndLesson,
  children,
}: ClassroomPageProps) {
  const { lesson, progress, learnerAccessProfile } = classroomContext;
  const currentStep = lesson.steps.find((step) => step.key === progress.currentStep);

  return (
    <div className="lesson-layout">
      {/* AI Teacher Panel */}
      <AITeacherPanel
        teacherState={teacherState}
        currentStep={progress.currentStep}
        isSpeaking={isSpeaking}
      />

      {/* Main Content Area */}
      <div className="lesson-main">
        {/* Lesson Content */}
        <div className="lesson-content">
          {/* Lesson Title Bar */}
          <div className="lesson-title-bar">
            <h1 className="lesson-title">{lesson.title}</h1>
            <div className="lesson-actions">
              <button className="lesson-action-btn">
                <span>📋</span> Notes
              </button>
              <button className="lesson-action-btn">
                <span>⏱️</span> {progress.timeSpentMinutes}m
              </button>
              <button className="lesson-action-btn">
                <span>⚙️</span> Settings
              </button>
            </div>
          </div>

          {/* Equation Display */}
          {currentStep?.whiteboardContent && (
            <WhiteboardPanel
              title={currentStep?.title || "Whiteboard"}
              content={currentStep.whiteboardContent}
              highlight={currentStep?.whiteboardDescription}
              step={progress.currentStep}
            />
          )}

          {/* Learn Panel with Tabs */}
          <LearnPanel classroomContext={classroomContext}>{children}</LearnPanel>
        </div>

        {/* Audio Control Bar */}
        <AudioControlBar
          isMuted={!learnerAccessProfile.audioEnabled}
          isSpeaking={isSpeaking}
          isListening={isListening}
          speechRate={learnerAccessProfile.speechRate}
          onToggleMute={() => {}}
          onToggleListen={() => {}}
          onEndLesson={onEndLesson}
          onChangeRate={() => {}}
        />

        {/* Caption Bar */}
        {showCaptions && currentMessage && <CaptionBar message={currentMessage} />}
      </div>
    </div>
  );
}
