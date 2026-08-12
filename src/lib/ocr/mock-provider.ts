import { splitParagraphs } from "./paragraphs";
import type { OCRInput, OCRProvider, OCRResult } from "./types";

// Kept as a single paragraph (no blank line) so the paragraph picker — meant
// for a real multi-paragraph page photo — doesn't show up around a single
// placeholder sentence and make the mock look broken.
const PLACEHOLDER_TEXT = `[Mock OCR — set GOOGLE_CLOUD_VISION_CREDENTIALS_BASE64 for real text extraction] This is placeholder text standing in for what a real photo would produce — edit it into the actual passage you captured, or configure Google Cloud Vision to extract it automatically next time.`;

/**
 * No network calls — used when Google Vision credentials are unset so the
 * camera capture flow is still fully testable end-to-end. The user corrects
 * this placeholder the same way they'd correct any OCR mistake.
 */
export class MockOCRProvider implements OCRProvider {
  readonly name = "mock";

  async extractText(_input: OCRInput): Promise<OCRResult> {
    return {
      text: PLACEHOLDER_TEXT,
      paragraphs: splitParagraphs(PLACEHOLDER_TEXT),
      confidence: null,
    };
  }
}
