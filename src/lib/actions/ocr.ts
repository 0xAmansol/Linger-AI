"use server";

import { getOCRProvider } from "@/lib/ocr";
import { getCurrentUser } from "@/lib/auth";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function runOCR(
  imageBase64: string,
  mimeType: string
): Promise<ActionResult<{ text: string; paragraphs: string[]; confidence: number | null }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };

  try {
    const result = await getOCRProvider().extractText({ imageBase64, mimeType });
    return { ok: true, data: result };
  } catch (error) {
    // We couldn't read the page — the photo itself isn't lost, the caller
    // still has it and can retry or type the passage instead (spec Section 30).
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "We couldn't read this page clearly. Try another photo or edit the text manually.",
    };
  }
}
