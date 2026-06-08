import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  SkipForward,
  Settings,
  X,
  Gauge,
} from "lucide-react";

interface AudioControlBarProps {
  isMuted: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  speechRate: number;
  onToggleMute: () => void;
  onToggleListen: () => void;
  onEndLesson: () => void;
  onChangeRate: (rate: number) => void;
}

export function AudioControlBar({
  isMuted,
  isSpeaking,
  isListening,
  speechRate,
  onToggleMute,
  onToggleListen,
  onEndLesson,
  onChangeRate,
}: AudioControlBarProps) {
  return (
    <div className="audio-bar">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className="audio-btn"
          aria-label={isMuted ? "Unmute" : "Mute"}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button className="audio-btn" aria-label="Pause/Resume" title="Pause/Resume">
          {isSpeaking ? <Pause size={18} /> : <Play size={18} />}
        </button>
      </div>

      <div className="sep-dot" />

      {/* Voice Input */}
      <button
        onClick={onToggleListen}
        className={`audio-on-btn ${isListening ? "mic-active" : ""}`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        <span>{isListening ? "Listening" : "Tap to speak"}</span>
      </button>

      <div className="sep-dot" />

      {/* Speed Control */}
      <div className="speed-control">
        <Gauge size={14} />
        <span>{speechRate}x</span>
      </div>

      <div className="sep-dot" />

      {/* Additional Controls */}
      <div className="flex items-center gap-1">
        <button
          className="audio-icon-btn"
          onClick={() => onChangeRate(Math.max(0.5, speechRate - 0.25))}
          aria-label="Slower"
          title="Slower"
        >
          <span className="ico">🐢</span>
          <span>Slower</span>
        </button>

        <button
          className="audio-icon-btn"
          onClick={() => onChangeRate(Math.min(2, speechRate + 0.25))}
          aria-label="Faster"
          title="Faster"
        >
          <span className="ico">🐇</span>
          <span>Faster</span>
        </button>

        <button className="audio-icon-btn" aria-label="Skip ahead" title="Skip ahead">
          <span className="ico">⏭️</span>
          <span>Skip</span>
        </button>

        <button className="audio-icon-btn" aria-label="Settings" title="Settings">
          <span className="ico">⚙️</span>
          <span>Settings</span>
        </button>
      </div>

      <div className="sep-dot" />

      {/* End Lesson */}
      <button
        onClick={onEndLesson}
        className="end-lesson-btn"
        aria-label="End lesson"
        title="End lesson"
      >
        <X size={16} />
        <span>End</span>
      </button>
    </div>
  );
}
