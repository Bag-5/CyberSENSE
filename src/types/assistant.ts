export type CyberAssistantRole = "user" | "assistant";

export type CyberAssistantMessage = {
  id: string;
  role: CyberAssistantRole;
  content: string;
};

export type CyberAssistantReply = {
  reply: string;
  suggestedPrompts: string[];
  quickTips: string[];
  safetyNote: string;
};

export type CyberAssistantResponse = CyberAssistantReply & {
  modelUsed: string;
};
