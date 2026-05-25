import { chatCyberSENSEAssistant } from "@/lib/ai/openrouter";
import type { CyberAssistantMessage } from "@/types/assistant";

type AssistantChatRequest = {
  messages?: Array<{
    role?: "user" | "assistant";
    content?: string;
  }>;
};

function isValidMessageContent(content: string) {
  const cleaned = content.replace(/\s+/g, " ").trim();
  return cleaned.length >= 1 && cleaned.length <= 3000;
}

function normalizeMessages(messages: AssistantChatRequest["messages"]) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter((message): message is { role: "user" | "assistant"; content: string } => {
      return (
        message != null &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        isValidMessageContent(message.content)
      );
    })
    .slice(-12);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as AssistantChatRequest | null;
    const messages = normalizeMessages(body?.messages);

    if (!messages.length) {
      return Response.json(
        {
          error: "Please ask the assistant a question.",
          success: false,
        },
        { status: 400 },
      );
    }

    const result = await chatCyberSENSEAssistant(
      messages.map((message, index) => ({
        id: `${message.role}-${index}`,
        role: message.role,
        content: message.content,
      })) satisfies CyberAssistantMessage[],
    );

    return Response.json({
      ...result,
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The CyberSENSE Assistant is unavailable.";

    const status =
      message.includes("OPENROUTER_API_KEY") || message.includes("Please ask the assistant")
        ? 400
        : 502;

    return Response.json(
      {
        error: message,
        success: false,
      },
      { status },
    );
  }
}
