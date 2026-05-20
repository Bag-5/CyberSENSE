import { analyzeScamContent } from "@/lib/ai/openrouter";

type AnalyzeScamRequest = {
  content?: string;
};

function isValidContent(content: string) {
  const cleaned = content.replace(/\s+/g, " ").trim();
  return cleaned.length >= 12 && cleaned.length <= 5000;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeScamRequest;
    const content = typeof body.content === "string" ? body.content : "";

    if (!isValidContent(content)) {
      return Response.json(
        {
          error:
            "Please paste at least a short suspicious message, email, or login page text.",
        },
        { status: 400 },
      );
    }

    const result = await analyzeScamContent(content);

    return Response.json({
      analysis: result.analysis,
      modelUsed: result.modelUsed,
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The scam analyzer is unavailable.";

    const status =
      message.includes("OPENROUTER_API_KEY") || message.includes("Please paste")
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

