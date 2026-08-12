"use server";

import { revalidatePath } from "next/cache";

import { getAIProvider } from "@/lib/ai";
import type { PassageContext } from "@/lib/ai";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ExplanationLevel, InsightType } from "@/generated/prisma/client";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function loadAnnotationContext(annotationId: string, userId: string) {
  const annotation = await db.annotation.findUnique({
    where: { id: annotationId, userId },
    include: { book: true },
  });
  if (!annotation) throw new Error("Annotation not found.");

  const context: PassageContext = {
    bookTitle: annotation.book.title,
    author: annotation.book.author,
    chapter: annotation.chapter,
    pageNumber: annotation.pageNumber,
    personalNote: annotation.personalNote,
  };
  return { annotation, context };
}

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");
  return user;
}

export async function generateExplanation(
  annotationId: string,
  mode: "EXPLAIN" | "SIMPLIFY",
  level: ExplanationLevel
): Promise<ActionResult<{ id: string; response: string }>> {
  try {
    const user = await requireUser();
    const { annotation, context } = await loadAnnotationContext(annotationId, user.id);
    const provider = getAIProvider();

    const result =
      mode === "EXPLAIN"
        ? await provider.explainText({ passage: annotation.sourceText, context, level })
        : await provider.simplifyText({ passage: annotation.sourceText, context, level });

    const insight = await db.aIInsight.create({
      data: {
        annotationId,
        type: mode,
        level,
        prompt: mode === "EXPLAIN" ? "Explain this passage" : "Simplify this passage",
        response: result.text,
        model: result.model,
      },
    });

    revalidatePath(`/books/${annotation.bookId}`);
    return { ok: true, data: { id: insight.id, response: insight.response } };
  } catch (error) {
    // The passage is already saved by this point — an AI failure never
    // costs the reader their capture (spec Section 30).
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "The explanation couldn't be generated right now. Your passage is safely saved.",
    };
  }
}

export async function generateAnalysis(
  annotationId: string,
  type: Exclude<InsightType, "EXPLAIN" | "SIMPLIFY">,
  options: { level?: ExplanationLevel; followUpQuestion?: string } = {}
): Promise<ActionResult<{ id: string; response: string }>> {
  try {
    const user = await requireUser();
    const { annotation, context } = await loadAnnotationContext(annotationId, user.id);
    const provider = getAIProvider();

    const priorInsights = await db.aIInsight.findMany({
      where: { annotationId, type: "FOLLOW_UP" },
      orderBy: { createdAt: "asc" },
      select: { prompt: true, response: true },
    });

    const result = await provider.analyzePassage({
      passage: annotation.sourceText,
      context,
      type,
      level: options.level,
      followUpQuestion: options.followUpQuestion,
      priorTurns: type === "FOLLOW_UP" ? priorInsights : undefined,
    });

    const insight = await db.aIInsight.create({
      data: {
        annotationId,
        type,
        level: options.level,
        prompt: options.followUpQuestion ?? type,
        response: result.text,
        model: result.model,
      },
    });

    revalidatePath(`/books/${annotation.bookId}`);
    return { ok: true, data: { id: insight.id, response: insight.response } };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "That couldn't be generated right now. Your passage is safely saved.",
    };
  }
}

export async function defineWordInAnnotation(
  annotationId: string,
  word: string,
  sentence: string
): Promise<ActionResult<{ id: string; contextualDefinition: string }>> {
  try {
    const user = await requireUser();
    const { annotation, context } = await loadAnnotationContext(annotationId, user.id);
    const provider = getAIProvider();

    const definition = await provider.defineWord({ word, sentence, context });

    const entry = await db.vocabularyEntry.create({
      data: {
        annotationId,
        word: definition.word,
        definition: definition.definition,
        contextualDefinition: definition.contextualDefinition,
        partOfSpeech: definition.partOfSpeech,
        pronunciation: definition.pronunciation,
        examples: definition.examples,
        synonyms: definition.synonyms,
      },
    });

    revalidatePath(`/books/${annotation.bookId}`);
    return { ok: true, data: { id: entry.id, contextualDefinition: entry.contextualDefinition ?? entry.definition } };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Couldn't look that word up right now.",
    };
  }
}
