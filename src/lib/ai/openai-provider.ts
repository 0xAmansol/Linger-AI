import OpenAI from "openai";

import {
  buildAnalyzePrompt,
  buildDefineWordPrompt,
  buildExplainPrompt,
  buildSimplifyPrompt,
  SYSTEM_PROMPT,
} from "./prompts";
import type {
  AIProvider,
  AIResponse,
  AnalyzeRequest,
  DefineWordRequest,
  ExplainRequest,
  WordDefinition,
} from "./types";
import { AIProviderError } from "./types";

const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  private async complete(prompt: string): Promise<AIResponse> {
    try {
      const response = await this.client.responses.create({
        model: CHAT_MODEL,
        instructions: SYSTEM_PROMPT,
        input: prompt,
      });
      const text = response.output_text?.trim();
      if (!text) {
        throw new AIProviderError("OpenAI returned an empty response.");
      }
      return { text, model: CHAT_MODEL };
    } catch (error) {
      if (error instanceof AIProviderError) throw error;
      throw new AIProviderError("OpenAI request failed.", error);
    }
  }

  explainText(req: ExplainRequest): Promise<AIResponse> {
    return this.complete(buildExplainPrompt(req));
  }

  simplifyText(req: ExplainRequest): Promise<AIResponse> {
    return this.complete(buildSimplifyPrompt(req));
  }

  analyzePassage(req: AnalyzeRequest): Promise<AIResponse> {
    return this.complete(buildAnalyzePrompt(req));
  }

  async defineWord(req: DefineWordRequest): Promise<WordDefinition> {
    const { text } = await this.complete(buildDefineWordPrompt(req));
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      return {
        word: parsed.word ?? req.word,
        partOfSpeech: parsed.partOfSpeech ?? null,
        pronunciation: parsed.pronunciation ?? null,
        definition: parsed.definition ?? "",
        contextualDefinition: parsed.contextualDefinition ?? parsed.definition ?? "",
        examples: Array.isArray(parsed.examples) ? parsed.examples : [],
        synonyms: Array.isArray(parsed.synonyms) ? parsed.synonyms : [],
      };
    } catch (error) {
      throw new AIProviderError("Could not parse word definition response.", error);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
      });
      return response.data[0]?.embedding ?? [];
    } catch (error) {
      throw new AIProviderError("OpenAI embedding request failed.", error);
    }
  }
}
