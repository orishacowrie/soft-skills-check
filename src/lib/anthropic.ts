/**
 * AI client — GPT-4o-mini primary, Claude Haiku fallback
 */

const OPENAI_API = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

export async function callAI(
  systemPrompt: string,
  userMessage: string,
  options?: { maxTokens?: number }
): Promise<string> {
  const maxTokens = options?.maxTokens ?? 2048;

  // Primary: GPT-4o-mini (cheapest, fastest, great at JSON)
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch(OPENAI_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = (await res.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const content = data.choices[0]?.message?.content?.trim();
      if (!content) throw new Error("Empty OpenAI response");
      return content;
    } catch (err) {
      console.error("[openai] GPT-4o-mini failed:", err);
      // Fall through to Claude
    }
  }

  // Fallback: Claude Haiku
  if (process.env.ANTHROPIC_API_KEY) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }
    return textBlock.text;
  }

  throw new Error("No API key configured (OPENAI_API_KEY or ANTHROPIC_API_KEY)");
}

// Backward compatibility alias
export const callClaude = callAI;

// Legacy export for recommend-topics
export function getAnthropicClient() {
  const Anthropic = require("@anthropic-ai/sdk").default;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}
