"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findFaqMatch, FAQ_SUGGESTIONS } from "@/lib/chatbotFaq";
import { BRAND } from "@/lib/constants";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Panel animation variants — spring feels more tactile than ease curves
const panelVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.97,
    // Use GPU-composited properties only (transform + opacity) — no layout triggers
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 32,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.97,
    transition: {
      duration: 0.18,
      ease: "easeIn" as const,
    },
  },
};

// Icon crossfade variants — prevents jarring DOM swap on button icon toggle
const iconVariants = {
  hidden: { opacity: 0, rotate: -15, scale: 0.7 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 30 },
  },
  exit: {
    opacity: 0,
    rotate: 15,
    scale: 0.7,
    transition: { duration: 0.1 },
  },
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: `Welcome to ${BRAND.name}! 🏋️‍♂️\nI'm your instant FAQ assistant. Ask me anything about our opening hours, membership pricing, free trial pass, trainers, or gym policies!`,
      timestamp: formatTime(new Date()),
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track whether open state change or new message triggered the effect
  const prevOpenRef = useRef(false);

  // Scroll only when a new message arrives (not on every isOpen toggle re-render)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle open/close side-effects separately from message updates
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      // Just opened — scroll and focus once
      scrollToBottom();
      setUnreadCount(0);
      const id = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      prevOpenRef.current = true;
      return () => clearTimeout(id);
    }
    if (!isOpen) {
      prevOpenRef.current = false;
    }
  }, [isOpen, scrollToBottom]);

  // Scroll when new messages arrive, but only if panel is open
  useEffect(() => {
    if (isOpen && messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Escape key closes the panel
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = useCallback((textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");

    const match = findFaqMatch(query);
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: match.answer,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 200);
  }, [inputValue]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <aside aria-label="FAQ Assistant Chatbot">
      {/* ── Floating Toggle Button ─────────────────────────────────── */}
      {/*
        - Removed animate-pulse-glow class: the CSS box-shadow animation
          fights Framer Motion transforms and causes compositing flashes
          on mobile. The red gradient + shadow-2xl is already eye-catching.
        - `will-change: transform` is set by Framer Motion automatically.
      */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 border border-red-400/50 shadow-2xl shadow-red-900/50 flex items-center justify-center text-white cursor-pointer"
        aria-label={isOpen ? "Close Fitness Plus FAQ chat" : "Open Fitness Plus FAQ chat"}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Animated icon crossfade — no DOM unmount/remount flash */}
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.svg
              key="close-icon"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          ) : (
            <motion.div
              key="chat-icon"
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative"
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white border border-red-600" />
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Expandable Chat Panel ──────────────────────────────────── */}
      {/*
        Key changes vs original:
        - `will-change: transform` on the outer wrapper so the GPU layer is
          pre-allocated and doesn't flash on first render.
        - Replaced `backdrop-blur-2xl` (triggers compositing on every paint)
          with an explicit solid background + softer blur — more stable on iOS.
        - `overflow-hidden` moved to a stable inner wrapper so it doesn't
          clip the spring-animated outer shell.
        - `mode="wait"` removed from outer AnimatePresence — we want the exit
          to happen simultaneously with page interaction, not block it.
      */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="false"
            aria-label="Fitness Plus FAQ Chat Window"
            style={{ willChange: "transform, opacity" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[min(520px,70svh)] flex flex-col rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl shadow-black/60"
          >
            {/*
              Separate background layer — keeps blur stable and avoids
              the "white flash" some mobile browsers show when a
              backdrop-filter element first composites onto the GPU.
            */}
            <div className="absolute inset-0 bg-[#09090b] opacity-[0.97] rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 to-transparent rounded-2xl pointer-events-none" />

            {/* All interactive content sits above the background layers */}
            <div className="relative flex flex-col h-full">

              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-red-950/70 via-black/60 to-red-950/70 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center font-heading font-bold text-red-500 text-xs shrink-0">
                    FP
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                  </div>
                  <div>
                    <h2 className="font-heading text-sm font-bold tracking-wider text-white uppercase leading-tight">
                      {BRAND.name} FAQ Assistant
                    </h2>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Instant Bot • Online
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Close Chat Window"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Message Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs overscroll-contain">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-red-600 text-white rounded-br-none shadow-md font-medium"
                          : "bg-white/[0.06] text-gray-200 border border-white/10 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-2 border-t border-white/5 bg-black/30 overflow-x-auto whitespace-nowrap flex gap-1.5 shrink-0 overscroll-x-contain">
                {FAQ_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => handleSendMessage(suggestion.query)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-colors shrink-0 cursor-pointer"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-2 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask about hours, pricing, free trial..."
                  className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-colors"
                  aria-label="Type your question"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
