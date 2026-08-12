import type {
  AnalyzeRequest,
  DefineWordRequest,
  ExplainRequest,
  ExplanationLevel,
  PassageContext,
} from "./types";

// Section 34 of docs/BOOKMIND_SPEC.md: distinguish source text from generated
// explanation, never modify the quote, never invent surrounding context,
// state uncertainty, cite the passage — "Based on this passage...", never
// "The author is definitely saying...".
export const SYSTEM_PROMPT = `You are Linger's reading companion: a thoughtful friend who loves books, not a generic AI assistant.

You are given a single passage a reader captured from a book, and nothing else — no surrounding chapter, no full text of the book. Follow these rules strictly:

- Never alter, paraphrase, or "correct" the source passage. Quote it exactly if you need to reference it.
- You only have this one passage. Do not claim knowledge of the surrounding chapter, the rest of the book, or the author's full intent beyond it. Say "Based on this passage..." rather than "The author is definitely saying...".
- If the passage is ambiguous or you're not confident, say so plainly instead of inventing a confident-sounding answer.
- Be concise and conversational, like a well-read friend, not an academic paper. No bullet-point essays unless the request calls for structure.
- Never fabricate a quote, citation, or biographical fact you were not given.`;

function contextBlock(context: PassageContext): string {
  const lines = [`Book: "${context.bookTitle}" by ${context.author}`];
  if (context.chapter) lines.push(`Chapter: ${context.chapter}`);
  if (context.pageNumber != null) lines.push(`Page: ${context.pageNumber}`);
  if (context.personalNote) lines.push(`Reader's own note: "${context.personalNote}"`);
  return lines.join("\n");
}

const LEVEL_INSTRUCTIONS: Record<ExplanationLevel, string> = {
  SIMPLE: "Explain it plainly, as if to someone new to this kind of writing. Avoid jargon.",
  DEEP: "Give a substantive explanation that engages with the ideas seriously, at moderate length.",
  ACADEMIC:
    "Explain with academic precision: relevant terminology, structure, and, where genuinely warranted by the passage alone, literary or philosophical framing.",
  CONVERSATIONAL: "Explain it the way a sharp, well-read friend would over coffee — casual, warm, a little opinionated.",
};

export function buildExplainPrompt(req: ExplainRequest): string {
  return `${contextBlock(req.context)}

Passage:
"""
${req.passage}
"""

Explain what this passage means. ${LEVEL_INSTRUCTIONS[req.level]}`;
}

export function buildSimplifyPrompt(req: ExplainRequest): string {
  return `${contextBlock(req.context)}

Passage:
"""
${req.passage}
"""

Rewrite the *meaning* of this passage in simpler language, at a ${req.level.toLowerCase()} level. Make clear you are paraphrasing, not quoting.`;
}

const ANALYZE_INSTRUCTIONS: Record<AnalyzeRequest["type"], string> = {
  EXPLAIN: "Explain what this passage means.",
  SIMPLIFY: "Rewrite the meaning of this passage more simply.",
  CONTEXT: "Explain what context (historical, literary, or narrative) would help a reader understand this passage, being clear about what you can and can't know from the passage alone.",
  METAPHOR: "Explain the metaphor or figurative language in this passage and what it's doing.",
  PHILOSOPHICAL: "Draw out the philosophical idea or claim this passage is making, and its implications.",
  EXAMPLE: "Give a concrete, relatable example that illustrates the idea in this passage.",
  TRANSLATE: "Translate this passage's meaning into plain modern English (not a different language, unless the reader's note specifies one).",
  FOLLOW_UP: "Answer the reader's follow-up question about this passage.",
};

export function buildAnalyzePrompt(req: AnalyzeRequest): string {
  const parts = [contextBlock(req.context), "", `Passage:\n"""\n${req.passage}\n"""`];

  if (req.priorTurns?.length) {
    parts.push(
      "",
      "Earlier in this thread:",
      ...req.priorTurns.map((t) => `Q: ${t.prompt}\nA: ${t.response}`)
    );
  }

  if (req.type === "FOLLOW_UP" && req.followUpQuestion) {
    parts.push("", `Reader's question: ${req.followUpQuestion}`);
  } else {
    parts.push("", ANALYZE_INSTRUCTIONS[req.type]);
    if (req.level) parts.push(LEVEL_INSTRUCTIONS[req.level]);
  }

  return parts.join("\n");
}

export function buildDefineWordPrompt(req: DefineWordRequest): string {
  return `${contextBlock(req.context)}

Sentence: "${req.sentence}"
Word to define: "${req.word}"

Define this word as it's actually used in this sentence — prefer the contextual meaning over the most common dictionary sense if they differ. Respond as JSON matching exactly this shape, with no other text:
{"word": string, "partOfSpeech": string | null, "pronunciation": string | null, "definition": string, "contextualDefinition": string, "examples": string[], "synonyms": string[]}`;
}
