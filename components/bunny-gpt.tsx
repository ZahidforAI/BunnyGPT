"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  Globe2,
  Menu,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage } from "@/lib/chat-types";
import {
  AGENTS,
  AGENT_LIST,
  type AgentId,
  type AgentProfile,
} from "@/lib/personalities";

const STORAGE_KEY = "bunnygpt-session-v2";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function SourceBadge({ mode }: { mode?: ChatMessage["sourceMode"] }) {
  if (!mode) return null;
  const labels = {
    official: "BunnyHood knowledge",
    live: "Live research",
    hybrid: "Hybrid intelligence",
  } as const;
  return (
    <span className={`source-badge source-${mode}`}>
      {mode === "official" ? <Check size={12} /> : <Globe2 size={12} />}
      {labels[mode]}
    </span>
  );
}

function BrandMark() {
  return (
    <div className="brand-lockup" aria-label="BunnyGPT">
      <span className="brand-icon" aria-hidden="true">
        <Image src="/bunny-hood-logo.png" alt="" width={48} height={48} priority />
      </span>
      <span>BUNNY<span className="lime">GPT</span></span>
    </div>
  );
}

function AgentCard({
  agent,
  onSelect,
}: {
  agent: AgentProfile;
  onSelect: (agent: AgentId) => void;
}) {
  return (
    <button className="agent-card" onClick={() => onSelect(agent.id)}>
      <div className="agent-art-wrap">
        <Image
          src={agent.image}
          alt={`${agent.name} BunnyHood character`}
          width={420}
          height={420}
          className="agent-art"
        />
        <span className="agent-index">0{AGENT_LIST.findIndex((item) => item.id === agent.id) + 1}</span>
      </div>
      <div className="agent-card-copy">
        <p>{agent.description}</p>
        <div>
          <h3>{agent.name}</h3>
          <ChevronRight aria-hidden="true" />
        </div>
        <span>{agent.label}</span>
      </div>
    </button>
  );
}

function EntryScreen({ onSelect }: { onSelect: (agent: AgentId) => void }) {
  const selectRef = useRef<HTMLDivElement>(null);
  return (
    <main className="entry-shell">
      <section className="entry-hero">
        <div className="signal-line"><i /> 3999 AGENTS · ROBINHOOD CHAIN</div>
        <div className="entry-hero-grid">
          <div className="entry-hero-copy">
            <h1>BUNNY<span>GPT</span></h1>
            <p>
              Meet the intelligence before you own the agent. Choose a BunnyHood
              archetype and ask about the Hood, markets, crypto, AI, or what is
              happening now.
            </p>
            <Button
              className="lime-button"
              onClick={() => selectRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Choose your Bunny <ArrowRight size={17} />
            </Button>
          </div>
          <div className="entry-hero-art">
            <Image
              src="/bunny_gpt.jpg"
              alt="BunnyGPT digital BunnyHood character"
              width={1536}
              height={1536}
              priority
              sizes="(max-width: 760px) 100vw, 46vw"
            />
            <span><i /> BUNNYGPT ONLINE</span>
          </div>
        </div>
        <div className="entry-stat-row">
          <span><b>03</b> ARCHETYPES</span>
          <span><b>LIVE</b> WEB INTELLIGENCE</span>
          <span><b>01</b> HOOD</span>
        </div>
      </section>

      <section className="agent-select-section" ref={selectRef}>
        <div className="section-kicker">SELECT AGENT</div>
        <div className="section-heading-row">
          <h2>Choose your <em>Bunny.</em></h2>
          <p>Same knowledge. Three different minds.</p>
        </div>
        <div className="agent-grid">
          {AGENT_LIST.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onSelect={onSelect} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ChatMessageView({
  message,
  agent,
  isStreaming = false,
}: {
  message: ChatMessage;
  agent: AgentProfile;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";
  const messageAgent = message.agent && AGENTS[message.agent] ? AGENTS[message.agent] : agent;
  return (
    <article className={`message-row ${isUser ? "message-user" : "message-agent"}`}>
      {!isUser && (
        <div className="message-avatar">
          <Image src={messageAgent.image} alt="" width={48} height={48} />
        </div>
      )}
      <div className="message-stack">
        <div className="message-meta">
          <strong>{isUser ? "YOU" : messageAgent.name.toUpperCase()}</strong>
          {!isUser && <SourceBadge mode={message.sourceMode} />}
        </div>
        <div className="message-bubble">
          {message.content &&
            message.content.split("\n").map((line, index) =>
              line.trim() ? <p key={index}>{line}</p> : <br key={index} />,
            )}
          {isStreaming && <span className="stream-cursor" aria-hidden="true" />}
        </div>
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="sources-panel">
            <div className="sources-title"><Globe2 size={14} /> Sources</div>
            {message.sources.map((source, index) => (
              <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                <span>{index + 1}</span>
                <p>{source.title}</p>
                <ExternalLink size={13} />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function AgentRail({
  selected,
  onSwitch,
  onReset,
}: {
  selected: AgentId;
  onSwitch: (agent: AgentId) => void;
  onReset: () => void;
}) {
  const agent = AGENTS[selected];
  return (
    <aside className="agent-rail">
      <div className="rail-art">
        <Image src={agent.image} alt={`${agent.name} Bunny`} width={440} height={440} />
        <span><i /> ONLINE</span>
      </div>
      <p className="rail-label">ACTIVE ARCHETYPE</p>
      <h2>{agent.name}</h2>
      <p className="rail-description">{agent.description}</p>

      <div className="rail-switcher" aria-label="Switch agent">
        {AGENT_LIST.map((item) => (
          <button
            key={item.id}
            className={item.id === selected ? "active" : ""}
            onClick={() => onSwitch(item.id)}
          >
            <span className="rail-agent-name">
              <Image src={item.image} alt="" width={32} height={32} />
              <span>{item.name}</span>
            </span>
            {item.id === selected && <Check size={14} />}
          </button>
        ))}
      </div>

      <button className="reset-button" onClick={onReset}>
        <RotateCcw size={14} /> New conversation
      </button>
    </aside>
  );
}

export default function BunnyGPT() {
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const requestControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;
        const parsed = JSON.parse(stored) as { agent?: AgentId; messages?: ChatMessage[] };
        if (parsed.agent && AGENTS[parsed.agent]) setSelectedAgent(parsed.agent);
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages.slice(-30));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!selectedAgent) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ agent: selectedAgent, messages: messages.slice(-30) }),
    );
    endRef.current?.scrollIntoView({ behavior: loading ? "auto" : "smooth" });
  }, [messages, selectedAgent, loading]);

  function selectAgent(agent: AgentId) {
    setSelectedAgent(agent);
    setMobileMenu(false);
    setError("");
  }

  function resetConversation() {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setMessages([]);
    setInput("");
    setError("");
    setLoading(false);
    setStreamingMessageId(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  async function sendMessage(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || !selectedAgent || loading) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: cleanQuestion,
    };
    const assistantId = makeId();
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "", agent: selectedAgent },
    ]);
    setInput("");
    setError("");
    setLoading(true);
    setStreamingMessageId(assistantId);
    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          agent: selectedAgent,
          question: cleanQuestion,
          history,
        }),
      });
      if (!response.ok) {
        const rawError = await response.text();
        let message = "The Bunny agent could not answer.";
        try {
          const payload = JSON.parse(rawError) as { error?: string };
          if (payload.error) message = payload.error;
        } catch {
          if (rawError.trim()) message = rawError.slice(0, 240);
        }
        throw new Error(message);
      }

      if (!response.body) throw new Error("The Bunny agent returned no response stream.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answerReceived = false;
      let streamError = "";

      const handleEvent = (block: string) => {
        const lines = block.split(/\r?\n/);
        const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim();
        const data = lines
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).trimStart())
          .join("\n");
        if (!event || !data) return;

        const payload = JSON.parse(data) as {
          text?: string;
          message?: string;
          sourceMode?: ChatMessage["sourceMode"];
          sources?: ChatMessage["sources"];
        };

        if (event === "meta") {
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    sourceMode: payload.sourceMode,
                    sources: payload.sources ?? [],
                  }
                : message,
            ),
          );
        }

        if (event === "token" && payload.text) {
          answerReceived = true;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? { ...message, content: message.content + payload.text }
                : message,
            ),
          );
        }

        if (event === "error") {
          streamError = payload.message || "The Bunny agent could not answer.";
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() ?? "";
        for (const block of blocks) handleEvent(block);
        if (done) break;
      }
      if (buffer.trim()) handleEvent(buffer);
      if (streamError) throw new Error(streamError);
      if (!answerReceived) throw new Error("The Bunny agent returned an empty answer.");
    } catch (caught) {
      if (controller.signal.aborted) return;
      setMessages((current) =>
        current.filter(
          (message) => message.id !== assistantId || Boolean(message.content.trim()),
        ),
      );
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setLoading(false);
        setStreamingMessageId(null);
      }
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  const active = selectedAgent ? AGENTS[selectedAgent] : null;

  return (
    <div className="site-frame">
      <header className="topbar">
        <button className="brand-button" onClick={() => setSelectedAgent(null)}>
          <BrandMark />
        </button>
        <div className="topbar-right">
          <span className="beta-pill"><i /> PUBLIC BETA</span>
          <a href="https://www.bunnyhood.xyz/" target="_blank" rel="noreferrer">
            BUNNY HOOD <ExternalLink size={13} />
          </a>
          {selectedAgent && (
            <button className="mobile-menu-button" onClick={() => setMobileMenu((value) => !value)} aria-label="Switch agent">
              {mobileMenu ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </header>

      {!selectedAgent || !active ? (
        <EntryScreen onSelect={selectAgent} />
      ) : (
        <main className="chat-shell">
          <AgentRail selected={selectedAgent} onSwitch={selectAgent} onReset={resetConversation} />

          {mobileMenu && (
            <div className="mobile-agent-menu">
              {AGENT_LIST.map((agent) => (
                <button key={agent.id} onClick={() => selectAgent(agent.id)} className={agent.id === selectedAgent ? "active" : ""}>
                  <Image src={agent.image} alt="" width={48} height={48} />
                  <span><b>{agent.name}</b><small>{agent.description}</small></span>
                  {agent.id === selectedAgent && <Check size={15} />}
                </button>
              ))}
            </div>
          )}

          <section className="conversation-panel">
            <div className="conversation-head">
              <div className="conversation-identity">
                <Image src={active.image} alt={`${active.name} Bunny`} width={64} height={64} />
                <div>
                  <p><i /> {active.name.toUpperCase()} ONLINE</p>
                  <h1>Talk to the <em>Hood.</em></h1>
                </div>
              </div>
              <div className="conversation-head-actions">
                <span>SESSION MEMORY · ON</span>
                <button
                  type="button"
                  className="clear-chat-button"
                  onClick={resetConversation}
                  disabled={messages.length === 0 && !loading}
                  aria-label="Clear chat"
                >
                  <Trash2 size={14} /> Clear chat
                </button>
              </div>
            </div>

            <div className="messages" aria-live="polite" aria-busy={loading}>
              {messages.length === 0 && (
                <div className="empty-chat">
                  <div className="empty-agent-avatar">
                    <Image src={active.image} alt={`${active.name} Bunny`} width={96} height={96} priority />
                  </div>
                  <h2>{active.greeting}</h2>
                  <p>Start with one of these, or ask your own question.</p>
                  <div className="suggestion-grid">
                    {active.prompts.map((prompt) => (
                      <button key={prompt} onClick={() => void sendMessage(prompt)}>
                        <span>{prompt}</span><ArrowRight size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <ChatMessageView
                  key={message.id}
                  message={message}
                  agent={active}
                  isStreaming={message.id === streamingMessageId}
                />
              ))}
              <div ref={endRef} />
            </div>

            <div className="composer-wrap">
              {error && <div className="error-banner">{error}</div>}
              <form className="composer" onSubmit={handleSubmit}>
                <Textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${active.name} anything…`}
                  maxLength={4000}
                  rows={1}
                  disabled={loading}
                  aria-label={`Message ${active.name}`}
                />
                <Button type="submit" className="send-button" disabled={!input.trim() || loading} aria-label="Send message">
                  <Send size={18} />
                </Button>
              </form>
              <p>BunnyGPT can be wrong. Verify important market information. Never share keys or seed phrases.</p>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
