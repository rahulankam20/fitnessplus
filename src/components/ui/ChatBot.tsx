"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findFaqMatch, FAQ_SUGGESTIONS } from "@/lib/chatbotFaq";
import { BRAND } from "@/lib/constants";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

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
  const chatPanelRef = useRef<HTMLDivElement>(null);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  // Keyboard accessibility: Escape key closes the chat window
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = (textToSend?: string) => {
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

    // Simulate instant rule-based match answer
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
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <aside aria-label="FAQ Assistant Chatbot">
      {/* Floating Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-red-500 border border-red-400/50 shadow-2xl flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 animate-pulse-glow"
        aria-label={isOpen ? "Close Fitness Plus FAQ chat" : "Open Fitness Plus FAQ chat"}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {isOpen ? (
          /* Close Icon */
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Chat Message Icon */
          <div className="relative">
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white border border-red-600"></span>
              </span>
            )}
          </div>
        )}
      </motion.button>

      {/* Expandable Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatPanelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-modal="false"
            aria-label="Fitness Plus FAQ Chat Window"
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] h-[520px] flex flex-col rounded-2xl overflow-hidden glass-card border border-red-500/20 bg-[#09090b]/95 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-red-950/80 via-black to-red-950/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 flex items-center justify-center font-heading font-bold text-red-500 text-xs">
                  FP
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                </div>
                <div>
                  <h2 className="font-heading text-sm font-bold tracking-wider text-white uppercase">
                    {BRAND.name} FAQ Assistant
                  </h2>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Instant Rule-Based Bot • Online
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Chat Window"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-red-600 text-white rounded-br-none shadow-md font-medium"
                        : "bg-white/[0.06] text-gray-200 border border-white/10 rounded-bl-none shadow-inner"
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
            <div className="px-3 py-2 border-t border-white/5 bg-black/40 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
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
              className="p-3 bg-black/80 border-t border-white/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Ask about hours, pricing, free trial..."
                className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
                aria-label="Type your question"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center shrink-0"
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
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
