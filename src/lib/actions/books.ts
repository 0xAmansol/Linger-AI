"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ReadingStatus } from "@/generated/prisma/client";

export interface CreateBookInput {
  title: string;
  author: string;
  subtitle?: string;
  isbn?: string;
  coverUrl?: string;
  publisher?: string;
  description?: string;
  readingStatus?: ReadingStatus;
}

export async function createBook(input: CreateBookInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  const title = input.title.trim();
  const author = input.author.trim();
  if (!title || !author) {
    throw new Error("Title and author are required.");
  }

  const book = await db.book.create({
    data: {
      userId: user.id,
      title,
      author,
      subtitle: input.subtitle?.trim() || null,
      isbn: input.isbn?.trim() || null,
      coverUrl: input.coverUrl?.trim() || null,
      publisher: input.publisher?.trim() || null,
      description: input.description?.trim() || null,
      readingStatus: input.readingStatus ?? "READING",
    },
  });

  revalidatePath("/");
  return book;
}

export async function updateReadingStatus(bookId: string, status: ReadingStatus) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  await db.book.update({
    where: { id: bookId, userId: user.id },
    data: { readingStatus: status },
  });

  revalidatePath("/");
  revalidatePath(`/books/${bookId}`);
}

export async function listBooksForSelect() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db.book.findMany({
    where: { userId: user.id },
    select: { id: true, title: true, author: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function deleteBook(bookId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in.");

  await db.book.delete({ where: { id: bookId, userId: user.id } });
  revalidatePath("/");
}
