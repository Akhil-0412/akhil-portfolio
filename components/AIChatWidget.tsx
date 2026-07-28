"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { X, Send, Mic, MicOff, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TextLoop } from "@/components/motion-primitives/text-loop";
import { TextMorph } from "@/components/motion-primitives/text-morph";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { TextScramble } from "@/components/motion-primitives/text-scramble";

// ─── VisionOS glass material ──────────────────────────────────────────────────
// No border. Pure backdrop-blur + radial gradient fill that fades into nothing.
const GLASS_STYLE: React.CSSProperties = {
  borderRadius: "22px",
  padding: "20px 24px",
  backdropFilter: "blur(28px)",
  WebkitBackdropFilter: "blur(28px)",
  background:
    "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 60%, transparent 100%)",
  boxShadow:
    "0 0 0 0.5px rgba(255,255,255,0.08), 0 8px 48px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
};

// ─── Left-pointing bubble tail (glass-matching) ───────────────────────────────
function BubbleTail() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top: "50%",
        left: -12,
        transform: "translateY(-50%)",
        width: 0,
        height: 0,
        borderTop: "10px solid transparent",
        borderBottom: "10px solid transparent",
        borderRight: "12px solid rgba(255,255,255,0.07)",
        filter: "drop-shadow(-2px 0 6px rgba(0,0,0,0.15))",
      }}
    />
  );
}

export default function AIChatWidget({
  isOpen,
  onClose,
  iconRect,
}: {
  isOpen: boolean;
  onClose: () => void;
  iconRect?: DOMRect | null;
}) {
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();
  const isLoading = status === "submitted" || status === "streaming";

  const timestampsRef = useRef<Record<string, Date>>({});

  const [historyOffset, setHistoryOffset] = useState<number>(0);

  useEffect(() => {
    if (isLoading) setHistoryOffset(0);
  }, [isLoading]);

  const formatTime = (date?: Date | string) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(date));
  };

  // Auto-focus and reset
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
    else { setInput(""); }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Voice recognition
  const SpeechRecognition =
    typeof window !== "undefined"
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;
  const recognition = useRef<any>(null);
  useEffect(() => {
    if (!SpeechRecognition) return;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = true;
    recognition.current.onresult = (e: any) =>
      setInput(Array.from(e.results).map((r: any) => r[0].transcript).join(""));
    recognition.current.onerror = () => setIsListening(false);
    recognition.current.onend = () => setIsListening(false);
  }, [SpeechRecognition]);

  const toggleListen = () => {
    if (isListening) { recognition.current?.stop(); setIsListening(false); }
    else { setInput(""); recognition.current?.start(); setIsListening(true); }
  };

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    if (isListening) { recognition.current?.stop(); setIsListening(false); }
    sendMessage({ text: input });
    setInput("");
  }, [input, isLoading, isListening, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    if (e.key === "Escape") onClose();
  };

  // Bubble anchors dynamically to the 3D robot's head via CSS variables injected by HeroRobot
  const bubblePos = {
    position: "fixed" as const,
    top: "calc(var(--ai-head-y, 35vh) - 80px)",
    left: "calc(var(--ai-head-x, 42vw) + 160px)",
    transform: "translateY(-50%)",
  };

  const assistantMessages = messages.filter(m => m.role === "assistant");
  const activeAssistantIndex = Math.max(0, assistantMessages.length - 1 - historyOffset);
  const lastAssistantMessage = assistantMessages[activeAssistantIndex];

  if (lastAssistantMessage?.id && !timestampsRef.current[lastAssistantMessage.id]) {
    timestampsRef.current[lastAssistantMessage.id] = (lastAssistantMessage as any).createdAt 
      ? new Date((lastAssistantMessage as any).createdAt) 
      : new Date();
  }
  const activeAiTime = lastAssistantMessage ? timestampsRef.current[lastAssistantMessage.id] : null;

  let activeUserId: string | null = null;
  if (lastAssistantMessage) {
    const globalIndex = messages.findIndex(m => m.id === lastAssistantMessage.id);
    if (globalIndex > 0) {
      for (let i = globalIndex - 1; i >= 0; i--) {
        if (messages[i].role === 'user') {
          activeUserId = messages[i].id;
          break;
        }
      }
    }
  } else if (!lastAssistantMessage && messages.length > 0 && messages[messages.length - 1].role === 'user') {
    activeUserId = messages[messages.length - 1].id;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── APPLE INTELLIGENCE LAYERS ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="apple-border-base apple-border-layer-1" />
            <div className="apple-border-base apple-border-layer-2" />
            <div className="apple-border-base apple-border-layer-3" />
            <div className="apple-border-base apple-border-layer-4" />
            <div className="apple-border-base apple-border-layer-5" />
          </motion.div>

          {/* ── INVISIBLE OVERLAY: catches clicks to close chat, no blur so avatar stays sharp ── */}
          <div
            className="fixed inset-0 z-[80]"
            onClick={onClose}
          />

          {/* ── SPEECH BUBBLE: anchored beside the AI robot ── */}
          <motion.div
            initial={{ opacity: 0, x: -16, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -12, scale: 0.92 }}
            transition={{ delay: 0.12, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...bubblePos, zIndex: 99, width: "fit-content", minWidth: 280, maxWidth: 480 }}
          >
            {/* Glass bubble — no border, pure material */}
            <div style={GLASS_STYLE} className="relative">
              <BubbleTail />

              {messages.length === 0 ? (
                <>
                  {/* AI label */}
                  <p
                    className="text-[9px] font-mono uppercase tracking-[0.18em] mb-3"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    AI · Akhil's Assistant
                  </p>

                  {/* TextLoop cycling prompts */}
                  <div className="text-white text-[15px] font-medium leading-snug min-h-[2.2rem] flex items-center">
                    <TextLoop interval={3.5}>
                      <span>How can I assist you today?</span>
                      <span>Anything you want to know about Akhil?</span>
                      <span>Ask about his projects 🚀</span>
                      <span>Want some fun facts? 🎯</span>
                      <span>Curious about his skills?</span>
                      <span>Ask me anything ✦</span>
                    </TextLoop>
                  </div>
                </>
              ) : (
                /* Assistant Reply View */
                <div className="relative w-full flex items-start gap-4 transition-all duration-300">
                  {/* Current Assistant Message */}
                  <div className="flex-1 min-w-0 flex flex-col pt-1">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-medium flex items-center justify-between pointer-events-auto">
                      <span>Akhil's AI {activeAiTime && `· ${formatTime(activeAiTime)}`}</span>
                      
                      {/* Pagination arrows */}
                      {assistantMessages.length > 1 && (
                        <div className="flex items-center gap-1 opacity-70">
                           <button 
                             onClick={() => setHistoryOffset(h => Math.min(assistantMessages.length - 1, h + 1))} 
                             disabled={historyOffset === assistantMessages.length - 1} 
                             className="hover:text-white disabled:opacity-30 p-1 rounded hover:bg-white/10 transition-colors pointer-events-auto"
                           >
                             <ChevronUp className="w-3 h-3" />
                           </button>
                           <button 
                             onClick={() => setHistoryOffset(h => Math.max(0, h - 1))} 
                             disabled={historyOffset === 0} 
                             className="hover:text-white disabled:opacity-30 p-1 rounded hover:bg-white/10 transition-colors pointer-events-auto"
                           >
                             <ChevronDown className="w-3 h-3" />
                           </button>
                        </div>
                      )}
                    </div>
                    <div className="text-[14px] leading-relaxed break-words text-white/95">
                      {lastAssistantMessage ? (
                        (() => {
                          // UIMessage in @ai-sdk/react v4 stores content in .parts[]
                          const msgText =
                            lastAssistantMessage.parts
                              ?.filter((p) => p.type === "text")
                              .map((p) => (p as any).text as string)
                              .join("") ??
                            (typeof (lastAssistantMessage as any).content === "string"
                              ? (lastAssistantMessage as any).content
                              : "");

                          if (isLoading) {
                            return <span className="text-gray-400 italic">...</span>;
                          }

                          return (
                            <TextEffect
                              key={lastAssistantMessage.id}
                              per="char"
                              trigger
                              variants={{
                                container: {
                                  hidden: { opacity: 0 },
                                  visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.007 },
                                  },
                                },
                                item: {
                                  hidden: { opacity: 0, filter: "blur(6px)", y: 2 },
                                  visible: {
                                    opacity: 1,
                                    filter: "blur(0px)",
                                    y: 0,
                                    transition: { duration: 0.25 },
                                  },
                                },
                              }}
                            >
                              {msgText || "..."}
                            </TextEffect>
                          );
                        })()
                      ) : (
                        <span className="text-gray-400 italic">...</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Thinking Indicator */}
                  {isLoading && (
                    <div className="absolute -bottom-6 left-12">
                      <TextShimmer className="font-mono text-[11px] text-gray-400" duration={1}>
                        Thinking...
                      </TextShimmer>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── USER MESSAGES LOG ── */}
          <div 
            className="fixed bottom-24 right-2 z-[90] flex flex-col-reverse items-end gap-2 max-h-[60vh] overflow-y-auto pointer-events-none [&::-webkit-scrollbar]:hidden pl-12 pr-6 pb-4 pt-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <AnimatePresence initial={false}>
              {messages.filter(m => m.role === 'user').map((msg) => {
                const isActive = msg.id === activeUserId;
                const msgContent = msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') ?? (typeof (msg as any).content === 'string' ? (msg as any).content : '');
                
                if (msg.id && !timestampsRef.current[msg.id]) {
                  timestampsRef.current[msg.id] = (msg as any).createdAt ? new Date((msg as any).createdAt) : new Date();
                }
                const time = timestampsRef.current[msg.id];

                return (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.6, 
                      y: 0,
                      scale: isActive ? 1.05 : 1,
                      x: isActive ? -12 : 0
                    }}
                    exit={{ opacity: 0 }}
                    className={`rounded-lg border px-4 py-2 text-sm text-white max-w-xs pointer-events-auto shadow-lg backdrop-blur-md transition-colors ${
                      isActive ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
                    }`}
                    style={{ transformOrigin: "right center" }}
                  >
                    <div className="flex items-end justify-between gap-3">
                      <span className="leading-snug">{msgContent}</span>
                      {time && (
                        <span className="text-[9px] text-gray-400 whitespace-nowrap mb-[1px]">
                          {formatTime(time)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ── CHAT UI LAYER: close button + large input (above blur, below dock) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="fixed inset-0 z-[85] flex flex-col items-center justify-end pb-12 pointer-events-none"
          >
            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.22 }}
              onClick={onClose}
              className="pointer-events-auto absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-400 hover:text-white transition-colors text-xs"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 0 0 0.5px rgba(255,255,255,0.07)",
              }}
            >
              <X className="w-3 h-3" />
              Esc
            </motion.button>

            {/* ── LARGE CENTRED INPUT ── */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-xl px-8 flex flex-col items-center gap-3"
            >
              <div
                className="relative w-full flex flex-col items-center justify-center translate-x-12"
                style={{ minHeight: "5rem" }}
              >
                {/* Placeholder TextLoop with TextScramble */}
                {!input && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <TextLoop interval={3.5}>
                      <TextScramble className="text-gray-500 text-xl font-light tracking-[0.1em] uppercase" duration={1.2} characterSet=". ">
                        What PC does Akhil use?
                      </TextScramble>
                      <TextScramble className="text-gray-500 text-xl font-light tracking-[0.1em] uppercase" duration={1.2} characterSet=". ">
                        What are his top skills?
                      </TextScramble>
                      <TextScramble className="text-gray-500 text-xl font-light tracking-[0.1em] uppercase" duration={1.2} characterSet=". ">
                        Tell me a fun fact.
                      </TextScramble>
                    </TextLoop>
                  </div>
                )}
                
                {/* Visible Morphing Text */}
                <TextMorph className="text-[2.5rem] font-semibold text-white text-center tracking-tight leading-tight pointer-events-none">
                  {input || " "}
                </TextMorph>

                {/* Invisible Input for Keyboard Capture (removes native caret) */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                />
              </div>

              {/* Hairline separator */}
              <div
                className="w-full h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.18) 65%, transparent 100%)",
                }}
              />

              {/* Action buttons */}
              <div className="flex items-center gap-2.5">
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-full text-white transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 0 0.5px rgba(255,255,255,0.1)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
