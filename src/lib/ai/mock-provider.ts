import type {
  AIProvider,
  AIResponse,
  AnalyzeRequest,
  DefineWordRequest,
  ExplainRequest,
  WordDefinition,
} from "./types";

const LEVEL_TONE: Record<string, string> = {
  SIMPLE: "In plain terms:",
  DEEP: "Sitting with this a little longer:",
  ACADEMIC: "Read more formally:",
  CONVERSATIONAL: "Honestly?",
};

/**
 * No network calls — used when OPENAI_API_KEY is unset so the app runs and
 * is fully testable before real credentials exist. Deterministic and clearly
 * labeled as a mock so it's never mistaken for a real explanation.
 */
export class MockAIProvider implements AIProvider {
  readonly name = "mock";

  async explainText(req: ExplainRequest): Promise<AIResponse> {
    const tone = LEVEL_TONE[req.level] ?? "";
    return {
      text: `[Mock explanation — set OPENAI_API_KEY for a real one] ${tone} based on this passage from "${req.context.bookTitle}", the line is worth sitting with. A real explanation will appear once an AI provider is configured.`,
      model: "mock",
    };
  }

  async simplifyText(req: ExplainRequest): Promise<AIResponse> {
    return {
      text: `[Mock simplification] Here's the plain-language version of the passage from "${req.context.bookTitle}" — configure OPENAI_API_KEY to get a real one.`,
      model: "mock",
    };
  }

  async analyzePassage(req: AnalyzeRequest): Promise<AIResponse> {
    return {
      text: `[Mock ${req.type.toLowerCase()} response] This is a placeholder for "${req.context.bookTitle}". Configure OPENAI_API_KEY to get a real answer.`,
      model: "mock",
    };
  }

  async defineWord(req: DefineWordRequest): Promise<WordDefinition> {
    return {
      word: req.word,
      partOfSpeech: null,
      pronunciation: null,
      definition: `[Mock definition — configure OPENAI_API_KEY for a real one]`,
      contextualDefinition: `As used here: a placeholder definition of "${req.word}".`,
      examples: [],
      synonyms: [],
    };
  }

  async generateEmbedding(text: string): Promise<number[]> {
    // Deterministic pseudo-embedding so mock mode stays internally
    // consistent (same text -> same vector) without calling out to an API.
    const dims = 32;
    const vec = new Array<number>(dims).fill(0);
    for (let i = 0; i < text.length; i++) {
      vec[i % dims] += text.charCodeAt(i);
    }
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vec.map((v) => v / norm);
  }
}
