// Deterministic Obsidian-compatible Markdown export — spec Section 20.
// One file per book: `Books/<Book Title>.md`, annotations as sections with
// the passage as a blockquote, kept in the book's own page order rather
// than capture order so the file reads like the book, not an activity log.

export interface ExportInsight {
  type: string;
  response: string;
}

export interface ExportVocabulary {
  word: string;
  contextualDefinition: string | null;
  definition: string;
}

export interface ExportAnnotation {
  sourceText: string;
  pageNumber: number | null;
  chapter: string | null;
  personalNote: string | null;
  createdAt: Date;
  tags: string[];
  insights: ExportInsight[];
  vocabulary: ExportVocabulary[];
}

export interface ExportBook {
  title: string;
  author: string;
  annotations: ExportAnnotation[];
}

const INSIGHT_HEADING: Record<string, string> = {
  EXPLAIN: "AI explanation",
  SIMPLIFY: "Simplified",
  CONTEXT: "Context",
  METAPHOR: "Metaphor",
  PHILOSOPHICAL: "The idea",
  EXAMPLE: "Example",
  TRANSLATE: "In plain English",
  FOLLOW_UP: "Follow-up",
};

export function obsidianFilename(bookTitle: string): string {
  const safe = bookTitle.replace(/[\\/:*?"<>|]/g, "-").trim();
  return `Books/${safe}.md`;
}

function sectionHeading(annotation: ExportAnnotation): string {
  if (annotation.chapter) return `## Annotation — ${annotation.chapter}`;
  if (annotation.pageNumber != null) return `## Annotation — Page ${annotation.pageNumber}`;
  return "## Annotation";
}

function tagLine(tags: string[]): string | null {
  if (tags.length === 0) return null;
  return tags.map((t) => `#${t.replace(/\s+/g, "-")}`).join(" ");
}

function annotationBlock(annotation: ExportAnnotation): string {
  const lines: string[] = [sectionHeading(annotation), ""];

  lines.push(`> ${annotation.sourceText.replace(/\n/g, "\n> ")}`, "");

  if (annotation.pageNumber != null) {
    lines.push(`**Page:** ${annotation.pageNumber}`, "");
  }

  if (annotation.personalNote) {
    lines.push("### My note", "", annotation.personalNote, "");
  }

  for (const insight of annotation.insights) {
    const heading = INSIGHT_HEADING[insight.type] ?? insight.type;
    lines.push(`### ${heading}`, "", insight.response, "");
  }

  for (const vocab of annotation.vocabulary) {
    lines.push(
      `### Word: ${vocab.word}`,
      "",
      vocab.contextualDefinition || vocab.definition,
      ""
    );
  }

  const tags = tagLine(annotation.tags);
  if (tags) lines.push(tags, "");

  return lines.join("\n").trimEnd();
}

export function generateObsidianMarkdown(book: ExportBook): string {
  const ordered = [...book.annotations].sort((a, b) => {
    if (a.pageNumber != null && b.pageNumber != null) return a.pageNumber - b.pageNumber;
    if (a.pageNumber != null) return -1;
    if (b.pageNumber != null) return 1;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const parts = [`# ${book.title}`, "", `*${book.author}*`, ""];

  for (const annotation of ordered) {
    parts.push(annotationBlock(annotation), "", "---", "");
  }

  // Drop the trailing separator after the last annotation.
  if (ordered.length > 0) parts.splice(-2, 2);

  return parts.join("\n").trimEnd() + "\n";
}
