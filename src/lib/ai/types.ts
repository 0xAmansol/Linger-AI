import type { ExplanationLevel, InsightType } from "@/generated/prisma/client";

export type { ExplanationLevel, InsightType };

/** Everything the model is allowed to know about the passage — nothing more. */
export interface PassageContext {
  bookTitle: string;
  author: string;
  chapter?: string | null;
  pageNumber?: number | null;
  /** The reader's own note, when they've written one — never fabricated. */
  personalNote?: string | null;
}

export interface ExplainRequest {
  passage: string;
  context: PassageContext;
  level: ExplanationLevel;
}

export interface AnalyzeRequest {
  passage: string;
  context: PassageContext;
  type: InsightType;
  level?: ExplanationLevel;
  /** Required when type is FOLLOW_UP. */
  followUpQuestion?: string;
  /** Prior turns in this passage's thread, oldest first. */
  priorTurns?: { prompt: string; response: string }[];
}

export interface DefineWordRequest {
  word: string;
  /** The sentence the word appears in — definitions are contextual, not generic. */
  sentence: string;
  context: PassageContext;
}

export interface WordDefinition {
  word: string;
  partOfSpeech: string | null;
  pronunciation: string | null;
  definition: string;
  contextualDefinition: string;
  examples: string[];
  synonyms: string[];
}

export interface AIResponse {
  text: string;
  model: string;
}

export interface AIProvider {
  readonly name: string;

  explainText(req: ExplainRequest): Promise<AIResponse>;
  simplifyText(req: ExplainRequest): Promise<AIResponse>;
  analyzePassage(req: AnalyzeRequest): Promise<AIResponse>;
  defineWord(req: DefineWordRequest): Promise<WordDefinition>;
  generateEmbedding(text: string): Promise<number[]>;
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}
