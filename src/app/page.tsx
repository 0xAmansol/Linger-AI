import { BookOpen, Search } from "lucide-react";
import type { ReactNode } from "react";

import { AddBookDialog } from "@/components/add-book-dialog";
import { BookCard } from "@/components/book-card";
import { CaptureButton } from "@/components/capture-button";
import { Input } from "@/components/ui/input";
import { ShelfRail } from "@/components/shelf-rail";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ReadingStatus } from "@/generated/prisma/client";

const STATUSES: ReadingStatus[] = ["READING", "WANT_TO_READ", "FINISHED", "ABANDONED"];

export default async function LibraryPage({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const statusParam = typeof params.status === "string" ? params.status : "ALL";
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const activeStatus = STATUSES.includes(statusParam as ReadingStatus)
    ? (statusParam as ReadingStatus)
    : "ALL";

  const user = await getCurrentUser();

  const [books, statusCounts] = user
    ? await Promise.all([
        db.book.findMany({
          where: {
            userId: user.id,
            ...(activeStatus !== "ALL" ? { readingStatus: activeStatus } : {}),
            ...(q
              ? {
                  OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { author: { contains: q, mode: "insensitive" } },
                  ],
                }
              : {}),
          },
          orderBy: { updatedAt: "desc" },
          include: { _count: { select: { annotations: true } } },
        }),
        db.book.groupBy({
          by: ["readingStatus"],
          where: { userId: user.id },
          _count: { _all: true },
        }),
      ])
    : [[], []];

  const counts: Record<string, number> = { ALL: 0 };
  for (const row of statusCounts) {
    counts[row.readingStatus] = row._count._all;
    counts.ALL += row._count._all;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-24 pt-8 md:px-8 md:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Linger</h1>
          <p className="text-sm text-ink-muted">Your library, and everything you&rsquo;ve found in it.</p>
        </div>
        <div className="flex items-center gap-2">
          <form className="relative" action="/">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search books or authors"
              className="w-64 pl-8"
            />
            {activeStatus !== "ALL" && (
              <input type="hidden" name="status" value={activeStatus} />
            )}
          </form>
          <AddBookDialog />
        </div>
      </header>

      <div className="flex flex-col gap-6 md:flex-row">
        <ShelfRail active={activeStatus} counts={counts} />

        <div className="flex-1">
          {!user ? (
            <EmptyState
              title="Sign in to start your library"
              body="Once you're signed in, every book you add and everything you capture from it lives here."
            />
          ) : books.length === 0 && !q && activeStatus === "ALL" ? (
            <EmptyState
              title="Your library is empty"
              body="Add the book you're reading right now — Linger starts making sense the moment you capture something from it."
              action={<AddBookDialog />}
            />
          ) : books.length === 0 ? (
            <EmptyState
              title="Nothing here"
              body={q ? `No books match "${q}".` : "No books on this shelf yet."}
            />
          ) : (
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>

      {user && books.length > 0 && <CaptureButton />}
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
      <BookOpen className="size-8 text-ink-faint" strokeWidth={1.5} />
      <h2 className="font-serif text-lg text-ink">{title}</h2>
      <p className="max-w-sm text-sm text-ink-muted">{body}</p>
      {action}
    </div>
  );
}

