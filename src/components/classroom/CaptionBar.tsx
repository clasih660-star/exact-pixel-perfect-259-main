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
        <span className="text-lg">👨‍🏫</span>
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

function Subtitles({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
