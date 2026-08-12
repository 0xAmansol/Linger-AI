"use server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateObsidianMarkdown, obsidianFilename } from "@/lib/export/obsidian";

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function exportBookToObsidian(
  bookId: string
): Promise<ActionResult<{ filename: string; content: string }>> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const book = await db.book.findUnique({
    where: { id: bookId, userId: user.id },
    include: {
      annotations: {
        include: {
          tags: { include: { tag: true } },
          aiInsights: { orderBy: { createdAt: "asc" } },
          vocabulary: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });
  if (!book) return { ok: false, error: "Book not found." };

  const content = generateObsidianMarkdown({
    title: book.title,
    author: book.author,
    annotations: book.annotations.map((a) => ({
      sourceText: a.sourceText,
      pageNumber: a.pageNumber,
      chapter: a.chapter,
      personalNote: a.personalNote,
      createdAt: a.createdAt,
      tags: a.tags.map((t) => t.tag.name),
      insights: a.aiInsights.map((i) => ({ type: i.type, response: i.response })),
      vocabulary: a.vocabulary.map((v) => ({
        word: v.word,
        contextualDefinition: v.contextualDefinition,
        definition: v.definition,
      })),
    })),
  });

  return { ok: true, data: { filename: obsidianFilename(book.title), content } };
}
