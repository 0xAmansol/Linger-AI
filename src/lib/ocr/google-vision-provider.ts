import { ImageAnnotatorClient } from "@google-cloud/vision";

import { splitParagraphs } from "./paragraphs";
import type { OCRInput, OCRProvider, OCRResult } from "./types";
import { OCRProviderError } from "./types";

export class GoogleVisionOCRProvider implements OCRProvider {
  readonly name = "google-vision";
  private client: ImageAnnotatorClient;

  constructor(credentials: object) {
    this.client = new ImageAnnotatorClient({ credentials });
  }

  async extractText({ imageBase64 }: OCRInput): Promise<OCRResult> {
    try {
      // documentTextDetection (not textDetection) is tuned for dense text —
      // a book page — rather than sparse scene text.
      const [result] = await this.client.documentTextDetection({
        image: { content: imageBase64 },
      });
      const annotation = result.fullTextAnnotation;
      const text = annotation?.text?.trim() ?? "";
      if (!text) {
        throw new OCRProviderError("No text detected in this photo.");
      }
      const confidence = annotation?.pages?.[0]?.confidence ?? null;
      return { text, paragraphs: splitParagraphs(text), confidence };
    } catch (error) {
      if (error instanceof OCRProviderError) throw error;
      throw new OCRProviderError("Google Cloud Vision request failed.", error);
    }
  }
}
