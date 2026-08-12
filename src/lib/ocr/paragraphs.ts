/**
 * Best-effort paragraph split from OCR'd text. The user always confirms and
 * can pick a different paragraph before saving (spec Section 13, step 7), so
 * this only needs to be a reasonable first guess, not a perfect parse.
 */
export function splitParagraphs(text: string): string[] {
  const byBlankLine = text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (byBlankLine.length > 1) return byBlankLine;

  return text
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
