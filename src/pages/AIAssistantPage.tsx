import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  FileText,
  ShieldCheck,
  Info,
  Clock,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { assistantService } from '../services/assistantService';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const AIAssistantPage: React.FC = () => {
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

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText || input).trim();
    if (!text) return;

    setErrorState(null);
    setLastQuery(text);
    setInput('');

    // Add user message
    addChatMessage({
      sender: 'user',
      text
    });

    setIsTyping(true);

    try {
      const response = await assistantService.askQuestion(text, {
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
      setErrorState('Unable to process response. Please check network and retry.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    clearChatHistory();
    addChatMessage({
      sender: 'assistant',
      text: `Hello Aarav! New chat started. I am your Campus Assistant. You can ask me about your attendance, fee balances, today's classes, upcoming exams, or official college policies. All answers are grounded in your student records and verified college circulars.`,
      sources: ['AITS Student Portal Knowledge Base']
    });
  };

  const suggestedPrompts = [
    'What is my attendance %?',
    'Can I miss any classes?',
    'Which subject needs improvement?',
    "What are today's classes?",
    'When is the next exam?',
    'What are my pending assignments?',
    'What is my outstanding fee balance?',
    'What is the 75% attendance rule?',
    'Summarize recent notices',
    'Show me attendance for Rahul' // tests refusal!
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <Breadcrumbs items={[{ label: 'Campus AI Assistant' }]} />

      {/* Header Card */}
      <div className="bg-app-surface border border-app-border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-app-accent text-white flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-app-text">Campus Assistant</h1>
              <Badge variant="accent" size="sm">Demo Engine</Badge>
            </div>
            <p className="text-xs text-app-muted mt-0.5">
              Answers grounded in college circulars & student records ({student.name}, {student.studentCode})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="flex-1 bg-app-surface border border-app-border rounded flex flex-col overflow-hidden min-h-0">
        {/* Messages List Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 text-xs bg-app-bg/25">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-app-accent text-white rounded-br-none font-normal'
                    : 'bg-app-surface border border-app-border text-app-text rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>

              {/* Document Sources Chips */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap pl-1">
                  <span className="text-[10px] text-app-muted flex items-center gap-1">
                    <FileText className="w-3 h-3 text-app-accent" />
                    Cited Documents:
                  </span>
                  {msg.sources.map((src, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-app-accent/10 border border-app-accent/20 text-app-accent px-2 py-0.5 rounded"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-app-muted mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Typing state */}
          {isTyping && (
            <div className="flex items-center gap-2 p-3 bg-app-surface border border-app-border rounded w-24">
              <span className="w-2 h-2 rounded-full bg-app-accent animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-app-accent animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-app-accent animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          {/* Error & Retry */}
          {errorState && (
            <div className="p-3 bg-app-danger/10 border border-app-danger/20 rounded text-xs text-app-danger flex items-center justify-between">
              <span>{errorState}</span>
              <button
                onClick={() => handleSendMessage(lastQuery)}
                className="font-semibold underline ml-3"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Chips Carousel */}
        <div className="p-2.5 border-t border-app-border bg-app-surface overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
          <Sparkles className="w-4 h-4 text-app-accent shrink-0 ml-1" />
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isTyping}
              className="whitespace-nowrap px-3 py-1.5 text-xs rounded bg-app-bg border border-app-border text-app-text hover:border-app-accent hover:text-app-accent transition-colors disabled:opacity-50 shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form Bar */}
        <div className="p-3 sm:p-4 border-t border-app-border bg-app-surface shrink-0">
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask attendance %, fees, today's classes, next exam, or regulations..."
              disabled={isTyping}
              className="flex-1 h-10 px-3.5 text-xs bg-app-bg border border-app-border rounded text-app-text placeholder:text-app-muted focus:outline-none focus:border-app-accent"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!input.trim() || isTyping}
              icon={<Send className="w-4 h-4" />}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
