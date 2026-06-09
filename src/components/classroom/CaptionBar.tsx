import { Subtitles, Bot } from "lucide-react";

interface CaptionBarProps {
  message: string;
  speaker?: "teacher" | "student" | "system";
}

export function CaptionBar({ message, speaker = "teacher" }: CaptionBarProps) {
  const speakerColors = {
    teacher: "bg-blue-600",
    student: "bg-green-600",
    system: "bg-gray-600",
  };

  const speakerLabels = {
    teacher: "Mr. Klass",
    student: "You",
    system: "System",
  };

  return (
    <div className="ai-speaking-bar">
      <div className="flex items-center gap-2 text-blue-400">
        <Bot size={18} />
      </div>
      <div className="speaking-text">
        <strong>{speakerLabels[speaker]}:</strong> {message}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Toggle captions"
          title="Toggle captions"
        >
          <Subtitles size={16} />
        </button>
      </div>
    </div>
  );
}
