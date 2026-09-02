import type { AgentId } from "./personalities";
import type { SourceMode } from "./search-intent";
import type { WebSource } from "./you-search";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: AgentId;
  sourceMode?: SourceMode;
  sources?: WebSource[];
};

export type ChatRequest = {
  agent: AgentId;
  question: string;
  history?: Pick<ChatMessage, "role" | "content">[];
};
