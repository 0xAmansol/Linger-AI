import { MockAIProvider } from "./mock-provider";
import { OpenAIProvider } from "./openai-provider";
import type { AIProvider } from "./types";

export * from "./types";

let cached: AIProvider | undefined;

/** Strategy-pattern factory: swap providers here, never in UI/route code. */
export function getAIProvider(): AIProvider {
  if (cached) return cached;
  const apiKey = process.env.OPENAI_API_KEY;
  cached = apiKey ? new OpenAIProvider(apiKey) : new MockAIProvider();
  return cached;
}
