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

// ─── Google Theme Caret Animation ─────────────────────────────────────────────
const GOOGLE_CARET_STYLE = `
  @keyframes google-caret {
    0%, 24% { caret-color: #4285F4; } /* Blue */
    25%, 49% { caret-color: #EA4335; } /* Red */
    50%, 74% { caret-color: #FBBC05; } /* Yellow */
    75%, 100% { caret-color: #34A853; } /* Green */
  }
  .google-caret-anim {
    animation: google-caret 2s infinite;
  }
`;

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
  const [isFocused, setIsFocused] = useState(false);
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
          <style>{GOOGLE_CARET_STYLE}</style>

          {/* ── BREATHING EDGE GLOW: subtle, single-tone, opacity-only pulse ── */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="edge-glow" />
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
            {/* Glass bubble — no border, pure material.
                `layout` makes Framer Motion's FLIP engine own the box's size:
                whenever its rendered bounding box changes shape (full paragraph
                <-> just the "Thinking..." label, greeting <-> reply), it
                animates the transform from the old box to the new one directly
                — no measure-then-animate round trip, so nothing can race
                against TextEffect's own popLayout exit below. */}
            <motion.div
              layout
              transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              style={GLASS_STYLE}
              className="relative"
            >
              <BubbleTail />

              {messages.length === 0 ? (
                <>
                  {/* AI label */}
                  <p
                    className="text-[9px] font-mono uppercase tracking-[0.18em] mb-3"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    Augmented Robot Reply
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
                      {/* "Thinking..." replaces "Reply" while a response is in
                          flight, and the timestamp always trails at the end.
                          TextShimmer renders a <p> by default, so it needs
                          as="span" to stay valid inside this inline label. */}
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="shrink-0">Augmented Robot</span>
                        {isLoading ? (
                          <TextShimmer as="span" className="shrink-0" duration={1}>
                            Thinking...
                          </TextShimmer>
                        ) : (
                          <span className="shrink-0">Reply</span>
                        )}
                        {activeAiTime && (
                          <span className="shrink-0">· {formatTime(activeAiTime)}</span>
                        )}
                      </span>

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
                          const rawMsgText =
                            lastAssistantMessage.parts
                              ?.filter((p) => p.type === "text")
                              .map((p) => (p as any).text as string)
                              .join("") ??
                            (typeof (lastAssistantMessage as any).content === "string"
                              ? (lastAssistantMessage as any).content
                              : "");

                          // Ultimate fail-safe: scrub long dashes from the LLM output entirely
                          const msgText = rawMsgText
                            .replace(/ [–—‑] /g, ', ')
                            .replace(/[–—‑]/g, ',');

                          // trigger={!isLoading}: the instant a new question is sent,
                          // isLoading flips true and this unmounts — AnimatePresence
                          // plays the exit animation using the props from the render
                          // just before that (still the previous answer's text), and
                          // TextEffect's exit variants set staggerDirection: -1, so it
                          // un-reveals word-by-word in reverse of how it came in. While
                          // isLoading stays true nothing here re-renders, so only the
                          // "Thinking..." label is visible. When the new answer lands,
                          // isLoading flips false and it reveals forward again.
                          return (
                            <TextEffect
                              per="word"
                              preset="fade-in-blur"
                              trigger={!isLoading}
                              speedReveal={2}
                              as="span"
                              className="whitespace-pre-wrap"
                            >
                              {msgText}
                            </TextEffect>
                          );
                        })()
                      ) : (
                        !isLoading && <span className="text-gray-400 italic">...</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* ── USER MESSAGES LOG & INPUT CONTAINER ──
              Centred on the right half of the viewport (75% mark) rather than
              pinned to the right edge, so it balances the robot on the left. */}
          <div className="fixed bottom-28 left-[75%] -translate-x-1/2 z-[90] flex flex-col items-end w-full max-w-md pointer-events-none gap-4">
            
            {/* USER MESSAGES LOG */}
            <div 
              className="flex flex-col justify-end items-end gap-2 max-h-[50vh] overflow-y-auto w-full pt-4 pb-2 pr-2 pl-8 [&::-webkit-scrollbar]:hidden"
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
                      className={`rounded-xl border px-4 py-2.5 text-sm text-white max-w-xs pointer-events-auto shadow-lg backdrop-blur-md transition-colors ${
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

            {/* ── INPUT FORM ── */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-sm flex items-center gap-3 px-4 py-2 rounded-2xl mr-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
              }}
            >
              <div className="relative flex-1 flex items-center justify-center min-h-[2.5rem]">
                {/* Placeholder TextLoop (hidden when focused or typing) */}
                {!input && !isFocused && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden whitespace-nowrap">
                    <TextLoop interval={3.5}>
                      <TextScramble className="text-gray-400 text-[13px] font-light tracking-wide uppercase text-center" duration={1.2} characterSet=". ">
                        Ask about his projects...
                      </TextScramble>
                      <TextScramble className="text-gray-400 text-[13px] font-light tracking-wide uppercase text-center" duration={1.2} characterSet=". ">
                        What are his top skills?
                      </TextScramble>
                      <TextScramble className="text-gray-400 text-[13px] font-light tracking-wide uppercase text-center" duration={1.2} characterSet=". ">
                        Tell me a fun fact.
                      </TextScramble>
                      <TextScramble className="text-gray-400 text-[13px] font-light tracking-wide uppercase text-center" duration={1.2} characterSet=". ">
                        What PC does Akhil use?
                      </TextScramble>
                    </TextLoop>
                  </div>
                )}
                
                {/* Visible Morphing Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <TextMorph className="text-[15px] font-medium text-white tracking-tight text-center">
                    {input || ""}
                  </TextMorph>
                </div>

                {/* Visible Input with Native Blinking Caret (Transparent Text) */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="absolute inset-0 w-full h-full bg-transparent outline-none text-[15px] font-medium text-transparent text-center google-caret-anim"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 rounded-xl text-white transition-colors disabled:opacity-25"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </motion.form>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
