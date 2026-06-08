import { useState } from "react";
import { MessageSquare, FileText, BookOpen, Accessibility } from "lucide-react";
import { StepsPanel } from "./StepsPanel";
import { ChatPanel } from "./ChatPanel";
import { NotesPanel } from "./NotesPanel";
import { AccessPanel } from "./AccessPanel";
import type { ClassroomContext } from "@/lib/types";

type TabType = "steps" | "chat" | "notes" | "access";

interface LearnPanelProps {
  classroomContext: ClassroomContext;
  children?: React.ReactNode;
}

export function LearnPanel({ classroomContext, children }: LearnPanelProps) {
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
        {activeTab === "steps" && <StepsPanel classroomContext={classroomContext} />}
        {activeTab === "chat" && (
          <ChatPanel classroomContext={classroomContext}>{children}</ChatPanel>
        )}
        {activeTab === "notes" && <NotesPanel classroomContext={classroomContext} />}
        {activeTab === "access" && <AccessPanel classroomContext={classroomContext} />}
      </div>
    </div>
  );
}
