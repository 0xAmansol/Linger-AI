import { GoogleVisionOCRProvider } from "./google-vision-provider";
import { MockOCRProvider } from "./mock-provider";
import type { OCRProvider } from "./types";

export * from "./types";

let cached: OCRProvider | undefined;

/** Strategy-pattern factory: swap providers here, never in UI/route code. */
export function getOCRProvider(): OCRProvider {
  if (cached) return cached;
  const credentialsB64 = process.env.GOOGLE_CLOUD_VISION_CREDENTIALS_BASE64;
  if (credentialsB64) {
    const credentials = JSON.parse(Buffer.from(credentialsB64, "base64").toString("utf-8"));
    cached = new GoogleVisionOCRProvider(credentials);
  } else {
    cached = new MockOCRProvider();
  }
  return cached;
}
