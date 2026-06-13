import type { TeacherVoiceState } from "@/lib/voice/types";

type TeacherVideoPlaceholderProps = {
  teacherName: string;
  imageUrl: string;
  voiceState: TeacherVoiceState;
};

export function TeacherVideoPlaceholder({
  teacherName,
  imageUrl,
  voiceState,
}: TeacherVideoPlaceholderProps) {
  const isSpeaking = voiceState === "playing";
  const isThinking = voiceState === "loading";
  const isFallback = voiceState === "fallback";

  return (
    <div className={`vc-teacher-video-placeholder ${isSpeaking ? "is-speaking" : ""}`}>
      <div className="vc-teacher-video-frame">
        <img src={imageUrl} alt={`${teacherName}, AI teacher`} />
        <span className="vc-teacher-video-badge">AI Teacher</span>
        {isFallback && <span className="vc-teacher-video-fallback">Browser Voice</span>}
        <div className="vc-teacher-video-caption">
          <span>{teacherName}</span>
          <span>{getVoiceStateLabel(voiceState)}</span>
        </div>
        {isSpeaking && (
          <div className="vc-teacher-video-wave" aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
        {isThinking && <div className="vc-teacher-video-thinking">Preparing voice response...</div>}
      </div>
    </div>
  );
}

function getVoiceStateLabel(state: TeacherVoiceState) {
  const labels: Record<TeacherVoiceState, string> = {
    idle: "Ready",
    loading: "Thinking",
    playing: "Speaking",
    paused: "Paused",
    ended: "Finished",
    error: "Voice unavailable",
    fallback: "Browser Voice",
  };

  return labels[state];
}
