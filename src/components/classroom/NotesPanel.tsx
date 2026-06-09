import { useState } from "react";
import { Save, Download, Trash2, Plus } from "lucide-react";
import type { ClassroomContext } from "@/lib/types";

interface NotesPanelProps {
  classroomContext: ClassroomContext;
  initialNotes?: string;
  onNotesSave?: (notes: string) => void;
}

export function NotesPanel({ classroomContext, initialNotes, onNotesSave }: NotesPanelProps) {
  const [notes, setNotes] = useState<string>(
    initialNotes ||
      (classroomContext.progress.confusionScore > 0.5
        ? `Notes for ${classroomContext.lesson.title}:\n\n• Key concepts learned:\n• Questions to review:\n• Practice problems:`
        : ""),
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    onNotesSave?.(notes);
    setIsSaving(false);
  };

  const handleDownload = () => {
    const blob = new Blob([notes], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${classroomContext.lesson.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your notes?")) {
      setNotes("");
    }
  };

  const addNote = () => {
    setNotes((prev) => prev + "\n• ");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Lesson Notes</h3>
          <p className="text-xs text-gray-500 mt-0.5">{classroomContext.lesson.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addNote}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add bullet point"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Save notes"
          >
            <Save size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Download notes"
          >
            <Download size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Clear notes"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Notes Editor */}
      <div className="flex-1 p-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start taking notes... • Key concepts • Questions • Practice problems"
          className="w-full h-full resize-none text-sm leading-relaxed focus:outline-none"
          style={{ fontFamily: "'Georgia', serif" }}
        />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{notes.split(/\s+/).filter(Boolean).length} words</span>
          <span>{isSaving ? "Saving…" : "Auto-saved"}</span>
        </div>
      </div>
    </div>
  );
}
