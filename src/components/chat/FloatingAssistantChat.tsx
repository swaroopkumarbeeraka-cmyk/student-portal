import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  FileText
} from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { assistantService } from '../../services/assistantService';
import { Badge } from '../common/Badge';

export const FloatingAssistantChat: React.FC = () => {
  const location = useLocation();
  const {
    student,
    attendance,
    academics,
    fees,
    assignments,
    notices,
    timetable,
    chatMessages,
    addChatMessage,
    clearChatHistory
  } = usePortal();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Hide floating launcher on the dedicated full-page AI assistant
  if (location.pathname === '/ai-assistant') {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    setErrorState(null);
    setLastQuery(query);
    setInputText('');

    // Add user message
    addChatMessage({
      sender: 'user',
      text: query
    });

    setIsTyping(true);

    try {
      const response = await assistantService.askQuestion(query, {
        student,
        attendance,
        academics,
        fees,
        assignments,
        notices,
        timetable
      });

      addChatMessage({
        sender: 'assistant',
        text: response.text,
        sources: response.sources
      });
    } catch (err) {
      setErrorState('Unable to reach assistant service. Please check connection and try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSendMessage(lastQuery);
    }
  };

  const suggestedPrompts = [
    'What is my attendance %?',
    'Can I miss any classes?',
    'Which subject needs improvement?',
    "What are today's classes?",
    'When is my next exam?',
    'What is my outstanding fee balance?',
    'What is the 75% attendance rule?'
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Campus AI Assistant"
          className="fixed bottom-5 right-5 z-40 bg-app-accent text-white px-3.5 py-2.5 rounded-full shadow-lg flex items-center gap-2 hover:bg-app-accent-hover transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2"
        >
          <Bot className="w-5 h-5 shrink-0" />
          <span className="text-xs font-semibold tracking-wide hidden sm:inline">
            Campus AI Assistant
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-app-surface border border-app-border rounded-md shadow-2xl flex flex-col transition-all duration-200 ${
            isExpanded
              ? 'inset-3 sm:inset-auto sm:right-5 sm:bottom-5 sm:w-[540px] sm:h-[680px]'
              : 'bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-[380px] h-[100dvh] sm:h-[540px]'
          }`}
          role="dialog"
          aria-label="Campus AI Assistant Window"
        >
          {/* Header */}
          <div className="p-3.5 border-b border-app-border bg-app-surface flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-app-accent text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-app-text leading-none">
                    Campus Assistant
                  </h3>
                  <Badge variant="accent" size="sm">
                    Demo Engine
                  </Badge>
                </div>
                <p className="text-[10px] text-app-muted mt-0.5 leading-none">
                  Answers from college docs & student records
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-app-muted">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
                className="p-1.5 hover:text-app-text hover:bg-app-bg rounded transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat window"
                className="p-1.5 hover:text-app-text hover:bg-app-bg rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Banner note */}
          <div className="px-3 py-1.5 bg-app-bg border-b border-app-border text-[11px] text-app-muted flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-app-accent shrink-0" />
              Scoped to {student.name} ({student.studentCode})
            </span>
            <button
              onClick={clearChatHistory}
              title="Clear chat history"
              className="text-[10px] text-app-muted hover:text-app-danger flex items-center gap-0.5 hover:underline"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Clear
            </button>
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-app-bg/30">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-app-accent text-white rounded-br-none'
                      : 'bg-app-surface border border-app-border text-app-text rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Source chips */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-1 flex items-center gap-1 flex-wrap pl-1">
                    <span className="text-[10px] text-app-muted flex items-center gap-0.5">
                      <FileText className="w-2.5 h-2.5 text-app-accent" />
                      Sources:
                    </span>
                    {msg.sources.map((src, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-app-accent/10 border border-app-accent/20 text-app-accent px-1.5 py-0.2 rounded"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-app-muted mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-app-surface border border-app-border rounded w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-app-accent animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-app-accent animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-app-accent animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            {/* Error state */}
            {errorState && (
              <div className="p-2.5 bg-app-danger/10 border border-app-danger/20 rounded text-xs text-app-danger flex items-center justify-between">
                <span>{errorState}</span>
                <button
                  onClick={handleRetry}
                  className="font-medium underline hover:opacity-80 ml-2"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts carousel */}
          <div className="p-2 border-t border-app-border bg-app-surface overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-app-accent shrink-0 ml-1" />
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isTyping}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded bg-app-bg border border-app-border text-app-text hover:border-app-accent hover:text-app-accent transition-colors disabled:opacity-50 shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="p-2.5 border-t border-app-border bg-app-surface shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask attendance, exams, fees, timetable..."
                disabled={isTyping}
                className="flex-1 h-9 px-3 text-xs bg-app-bg border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                aria-label="Send query"
                className="h-9 w-9 bg-app-accent text-white rounded flex items-center justify-center hover:bg-app-accent-hover transition-colors disabled:opacity-40 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
