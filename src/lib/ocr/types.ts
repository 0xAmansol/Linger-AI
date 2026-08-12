export interface OCRInput {
  /** Raw image bytes, base64-encoded (no data-URL prefix). */
  imageBase64: string;
  mimeType: string;
}

export interface OCRResult {
  /** Full extracted text, as detected. */
  text: string;
  /** Best-effort paragraph segmentation — the user picks the real one. */
  paragraphs: string[];
  /** 0-1, or null when the provider doesn't report one. Surface only when low. */
  confidence: number | null;
}

export interface OCRProvider {
  readonly name: string;
  extractText(input: OCRInput): Promise<OCRResult>;
}

export class OCRProviderError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown
  ) {
    super(message);
    this.name = "OCRProviderError";
  }
}
