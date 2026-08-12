"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { CaptureSource } from "@/generated/prisma/client";

export interface CreateAnnotationInput {
  bookId: string;
  sourceText: string;
  pageNumber?: number | null;
  chapter?: string | null;
  sourceType: CaptureSource;
  sourceImageUrl?: string | null;
  personalNote?: string | null;
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export async function createAnnotation(input: CreateAnnotationInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  const sourceText = input.sourceText.trim();
  if (!sourceText) throw new Error("Nothing to save — the passage is empty.");

  const book = await db.book.findUnique({ where: { id: input.bookId, userId: user.id } });
  if (!book) throw new Error("Book not found.");

  // Capture persists before any AI processing runs, so a later AI failure
  // never loses what the reader just captured (spec Section 30).
  const annotation = await db.annotation.create({
    data: {
      userId: user.id,
      bookId: input.bookId,
      sourceText,
      normalizedText: normalize(sourceText),
      pageNumber: input.pageNumber ?? null,
      chapter: input.chapter?.trim() || null,
      sourceType: input.sourceType,
      sourceImageUrl: input.sourceImageUrl ?? null,
      personalNote: input.personalNote?.trim() || null,
    },
  });

  await db.book.update({ where: { id: book.id }, data: { updatedAt: new Date() } });

  revalidatePath(`/books/${input.bookId}`);
  revalidatePath("/");
  return annotation;
}

export async function updatePersonalNote(annotationId: string, personalNote: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  const annotation = await db.annotation.update({
    where: { id: annotationId, userId: user.id },
    data: { personalNote: personalNote.trim() || null },
  });

  revalidatePath(`/books/${annotation.bookId}`);
  return annotation;
}

export async function deleteAnnotation(annotationId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  const annotation = await db.annotation.delete({
    where: { id: annotationId, userId: user.id },
  });

  revalidatePath(`/books/${annotation.bookId}`);
  return annotation;
}

export async function setAnnotationTags(annotationId: string, tagNames: string[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  const annotation = await db.annotation.findUnique({
    where: { id: annotationId, userId: user.id },
  });
  if (!annotation) throw new Error("Annotation not found.");

  const names = [...new Set(tagNames.map((n) => n.trim().toLowerCase()).filter(Boolean))];

  const tags = await Promise.all(
    names.map((name) =>
      db.tag.upsert({
        where: { userId_name: { userId: user.id, name } },
        update: {},
        create: { userId: user.id, name },
      })
    )
  );

  await db.$transaction([
    db.annotationTag.deleteMany({ where: { annotationId } }),
    ...tags.map((tag) =>
      db.annotationTag.create({ data: { annotationId, tagId: tag.id } })
    ),
  ]);

  revalidatePath(`/books/${annotation.bookId}`);
}
