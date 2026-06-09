import { useState } from "react";
import { MessageSquare, FileText, BookOpen, Accessibility } from "lucide-react";
import { StepsPanel } from "./StepsPanel";
import { ChatPanel } from "./ChatPanel";
import { NotesPanel } from "./NotesPanel";
import { AccessPanel } from "./AccessPanel";
import type { ClassroomContext, LearnerAccessProfile, LessonStepKey, ChatMessage } from "@/lib/types";

type TabType = "steps" | "chat" | "notes" | "access";

interface LearnPanelProps {
  classroomContext: ClassroomContext;
  messages?: ChatMessage[];
  isLoading?: boolean;
  initialNotes?: string;
  onStepChange?: (step: LessonStepKey) => void;
  onSendMessage?: (message: string) => void;
  onQuickAction?: (action: string) => void;
  onNotesSave?: (notes: string) => void;
  onAccessChange?: (profile: Partial<LearnerAccessProfile>) => void;
  children?: React.ReactNode;
}

export function LearnPanel({
  classroomContext,
  messages,
  isLoading = false,
  initialNotes,
  onStepChange,
  onSendMessage,
  onQuickAction,
  onNotesSave,
  onAccessChange,
  children,
}: LearnPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("chat");

  const tabs = [
    { id: "chat" as TabType, icon: MessageSquare, label: "Chat" },
    { id: "steps" as TabType, icon: BookOpen, label: "Steps" },
    { id: "notes" as TabType, icon: FileText, label: "Notes" },
    { id: "access" as TabType, icon: Accessibility, label: "Access" },
  ];

  return (
    <div className="chat-panel">
      {/* Tabs */}
      <div className="chat-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`chat-tab ${activeTab === tab.id ? "active" : ""}`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "steps" && <StepsPanel classroomContext={classroomContext} onStepChange={onStepChange} />}
        {activeTab === "chat" && (
          <ChatPanel
            classroomContext={classroomContext}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
            onQuickAction={onQuickAction}
          >
            {children}
          </ChatPanel>
        )}
        {activeTab === "notes" && (
          <NotesPanel classroomContext={classroomContext} initialNotes={initialNotes} onNotesSave={onNotesSave} />
        )}
        {activeTab === "access" && (
          <AccessPanel classroomContext={classroomContext} onAccessChange={onAccessChange} />
        )}
      </div>
    </div>
  );
}
