import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, X, HelpCircle } from "lucide-react";
import type { LearningMode } from "@/lib/types";
import { startListening, stopListening, speak } from "@/lib/speech";

interface QuestionSystemProps {
  mode: LearningMode;
  isOpen: boolean;
  questionText: string;
  onAnswer?: (answer: string, inputType: "text" | "voice") => void;
  onSkip?: () => void;
  onClose?: () => void;
  autoPlayAudio?: boolean;
}

export function QuestionSystem({
  mode,
  isOpen,
  questionText,
  onAnswer,
  onSkip,
  onClose,
  autoPlayAudio = true,
}: QuestionSystemProps) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const textInputRef = useRef<HTMLInputElement>(null);

  // Auto-play audio based on mode
  useEffect(() => {
    if (isOpen && autoPlayAudio) {
      if (mode === "blind") {
        // Audio on by default for blind mode
        speak(questionText);
      } else if (mode === "standard" || mode === "deaf") {
        // Optional audio, just show text
        if (mode === "standard") {
          speak(questionText, { rate: 0.9 });
        }
      }
    }
  }, [isOpen, mode, questionText, autoPlayAudio]);

  // Focus management
  useEffect(() => {
    if (isOpen && mode !== "blind") {
      textInputRef.current?.focus();
    }
  }, [isOpen, mode]);

  // Blind mode: auto-enable microphone
  useEffect(() => {
    if (isOpen && mode === "blind" && !isListening) {
      setIsListening(true);
      startListening((result) => {
        setTranscript(result);
        if (result.toLowerCase().includes("no question")) {
          handleSkip();
        } else {
          handleAnswer(result, "voice");
        }
      });
    }
    return () => {
      if (isListening) {
        stopListening();
        setIsListening(false);
      }
    };
  }, [isOpen, mode, isListening]);

  const handleAnswer = (answer: string, inputType: "text" | "voice" = "text") => {
    onAnswer?.(answer, inputType);
    setInputValue("");
    setTranscript("");
  };

  const handleSkip = () => {
    onSkip?.();
    setInputValue("");
    setTranscript("");
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setTranscript("");
      startListening((result) => {
        setTranscript(result);
        setIsListening(false);
      });
    }
  };

  // Standard Mode
  if (mode === "standard") {
    return isOpen ? (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-2">{questionText}</p>
            <div className="flex items-center gap-2">
              <input
                ref={textInputRef}
                type="text"
                placeholder="Type your answer or say 'no question'..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    handleAnswer(inputValue);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-lg transition-colors ${
                  isListening
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Voice input"
              >
                {isListening ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => handleAnswer(inputValue || transcript)}
                disabled={!inputValue.trim() && !transcript.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Send
              </button>
              <button
                onClick={handleSkip}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
              >
                Skip
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Deaf Mode
  if (mode === "deaf") {
    return isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Any question?</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">{questionText}</p>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 h-24 resize-none"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAnswer(inputValue)}
              disabled={!inputValue.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Question
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              No Question
            </button>
            <button
              onClick={onClose}
              className="col-span-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Repeat Board Step
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Blind Mode
  if (mode === "blind") {
    return isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Listening...</h3>

          <p className="text-sm text-gray-600 mb-4">{questionText}</p>

          <div
            className={`w-full p-4 rounded-lg mb-4 text-center transition-colors ${
              isListening
                ? "bg-red-50 border-2 border-red-500"
                : "bg-blue-50 border-2 border-blue-500"
            }`}
          >
            <p className="text-sm font-medium text-gray-700">
              {isListening
                ? "Microphone active. Speak now..."
                : "Ready to listen"}
            </p>
            {transcript && (
              <p className="text-sm text-gray-600 mt-2">You said: {transcript}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleVoiceInput}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isListening
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              No Question
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Speech Difficulty Mode
  if (mode === "speech_difficulty") {
    return isOpen ? (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-700 mb-3">{questionText}</p>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..."
              className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

            <button
              onClick={() => handleAnswer(inputValue)}
              disabled={!inputValue.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
            <button
              onClick={handleSkip}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              No Question
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  // ADHD Focus Mode - Minimal, large buttons
  if (mode === "adhd_focus") {
    return isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">{questionText}</h3>

          <div className="space-y-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Your answer"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            <button
              onClick={() => handleAnswer(inputValue)}
              disabled={!inputValue.trim()}
              className="w-full px-4 py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              Submit
            </button>

            <button
              onClick={handleSkip}
              className="w-full px-4 py-4 bg-gray-300 text-gray-800 rounded-lg text-lg font-bold hover:bg-gray-400"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Motor Support Mode - Larger targets
  if (mode === "motor_support") {
    return isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">{questionText}</h3>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your answer"
            className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            autoFocus
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswer(inputValue)}
              disabled={!inputValue.trim()}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 text-lg"
            >
              Send
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-4 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 text-lg"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  // Default fallback
  return null;
}
