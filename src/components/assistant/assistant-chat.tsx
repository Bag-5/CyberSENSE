"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

import { cyberButtonClasses, cyberPanelClasses } from "@/components/ui/cyber";
import { assistantQuickPrompts } from "@/data/assistant";
import { cn } from "@/utils/cn";
import type { CyberAssistantMessage, CyberAssistantResponse } from "@/types/assistant";

type DisplayMessage = CyberAssistantMessage & {
  safetyNote?: string;
  modelUsed?: string;
};

type AssistantChatProps = {
  compact?: boolean;
  className?: string;
  currentName?: string | null;
};

function buildInitialMessages(name?: string | null): DisplayMessage[] {
  return [
    {
      id: "welcome",
      role: "assistant",
      content: `Hello${name ? ` ${name}` : ""}. I’m CyberSENSE Assistant. I can help you understand phishing, AI scams, ransomware, password safety, and suspicious messages in a safe, beginner-friendly way.`,
      safetyNote: "Educational and defensive only.",
    },
  ];
}

export function AssistantChat({
  compact = false,
  className,
  currentName,
}: AssistantChatProps) {
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<DisplayMessage[]>(() =>
    buildInitialMessages(currentName),
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const messageIdRef = useRef(0);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  async function sendMessage(value: string) {
    const trimmed = value.trim();
    if (!trimmed || isLoading) {
      return;
    }

    setErrorText(null);

    const nextMessages: DisplayMessage[] = [
      ...messages,
      {
        id: `user-${messageIdRef.current + 1}`,
        role: "user",
        content: trimmed,
      },
    ];
    messageIdRef.current += 1;

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "CyberSENSE Assistant could not answer right now.");
      }

      const payload = (await response.json()) as CyberAssistantResponse;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${messageIdRef.current + 1}`,
          role: "assistant",
          content: payload.reply,
          safetyNote: payload.safetyNote,
          modelUsed: payload.modelUsed,
        },
      ]);
      messageIdRef.current += 1;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "CyberSENSE Assistant could not answer right now.";

      setErrorText(message);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-error-${messageIdRef.current + 1}`,
          role: "assistant",
          content:
            "I could not complete that answer right now, but I can still help with safe, defensive cybersecurity advice. Please try again or choose one of the suggested prompts.",
          safetyNote: "The assistant is still available for safe learning questions.",
        },
      ]);
      messageIdRef.current += 1;
    } finally {
      setIsLoading(false);
      taRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  const shellClassName = cn(
    cyberPanelClasses(
      compact
        ? "flex min-h-0 h-[min(52rem,calc(100vh-2rem))] w-full flex-col overflow-hidden border border-cyan-300/15 bg-slate-950/95 shadow-[0_0_45px_rgba(34,211,238,0.18)]"
        : "flex min-h-0 min-h-[36rem] flex-col overflow-hidden border border-cyan-300/15 bg-slate-950/80 shadow-[0_0_45px_rgba(34,211,238,0.12)]",
    ),
    className,
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.45, ease: "easeOut" }}
      className={shellClassName}
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-100 uppercase">
            CyberSENSE Assistant
          </p>
          <h3 className="text-lg font-semibold tracking-[-0.04em] text-white">
            Ask a safe cyber question
          </h3>
          <p className="text-xs leading-5 text-slate-400">
            Educational only. Defensive guidance, simple explanations, zero harmful instructions.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-emerald-100 uppercase">
            Live model ready
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            className={cn(
              "max-w-[92%] rounded-[1.4rem] border px-4 py-3 text-sm leading-6 shadow-[0_0_24px_rgba(15,23,42,0.12)]",
              message.role === "user"
                ? "ml-auto border-cyan-300/20 bg-cyan-400/10 text-cyan-50"
                : "border-white/10 bg-slate-900/80 text-slate-100",
            )}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-[0.22em] uppercase",
                  message.role === "user" ? "text-cyan-100" : "text-amber-100",
                )}
              >
                {message.role === "user" ? "You" : "CyberSENSE Assistant"}
              </span>
              {message.modelUsed ? (
                <span className="text-[10px] text-slate-500">Model: {message.modelUsed}</span>
              ) : null}
            </div>
            <p className="whitespace-pre-line text-sm leading-6 text-inherit">{message.content}</p>

            {message.role === "assistant" && message.safetyNote ? (
              <div className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-400/10 px-3 py-2 text-xs text-amber-50/90">
                {message.safetyNote}
              </div>
            ) : null}

          </motion.div>
        ))}

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
              className="max-w-[92%] rounded-[1.4rem] border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300"
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-300 delay-75" />
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 delay-150" />
                <span className="ml-2">CyberSENSE Assistant is thinking...</span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 px-5 py-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
              Ask CyberSENSE Assistant
            </span>
            <textarea
              ref={taRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about phishing, AI scams, password safety, ransomware, or suspicious messages..."
              rows={compact ? 3 : 4}
              className="cyber-input w-full resize-none rounded-[1.2rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-200/20"
            />
          </label>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">
              {errorText ? <span className="text-rose-200">{errorText}</span> : null}
            </p>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cyberButtonClasses("primary", "md", "justify-center sm:min-w-32")}
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {assistantQuickPrompts.slice(0, 2).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] leading-none text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-50 sm:px-3 sm:py-2 sm:text-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
