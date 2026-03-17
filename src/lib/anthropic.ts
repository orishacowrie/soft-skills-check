import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient(): Anthropic {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number }
): Promise<string> {
  const anthropic = getAnthropicClient();

  // Try Haiku first, fall back to Sonnet if unavailable
  const models = ["claude-haiku-4-5-20251001", "claude-sonnet-4-20250514"];
  let lastError: unknown;

  for (const model of models) {
    try {
      const message = await anthropic.messages.create({
        model,
        max_tokens: options?.maxTokens ?? 2048,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      const textBlock = message.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from Claude");
      }

      return textBlock.text;
    } catch (err) {
      console.error(`[anthropic] ${model} failed:`, err);
      lastError = err;
    }
  }

  throw lastError;
}
