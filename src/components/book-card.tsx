import Link from "next/link";

import { BookCover } from "@/components/book-cover";
import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/generated/prisma/client";

const STATUS_LABEL: Record<ReadingStatus, string> = {
  READING: "Reading",
  WANT_TO_READ: "Want to read",
  FINISHED: "Finished",
  ABANDONED: "Abandoned",
};

function relativeActivity(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function BookCard({
  book,
}: {
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    readingStatus: ReadingStatus;
    updatedAt: Date;
    _count: { annotations: number };
  };
}) {
  return (
    <Link
      href={`/books/${book.id}`}
      className="group relative flex gap-3 rounded-card border border-border bg-paper-raised p-3 shadow-card transition-shadow hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Guide-card tab: reading-status marker, catalog-tab motif */}
      <span
        className={cn(
          "absolute -top-2 left-4 rounded-t-sm border border-b-0 border-border-strong bg-paper-sunken px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted"
        )}
      >
        {STATUS_LABEL[book.readingStatus]}
      </span>

      <BookCover title={book.title} coverUrl={book.coverUrl} className="w-16 shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col justify-between pt-1">
        <div>
          <h3 className="line-clamp-2 font-serif text-base leading-snug text-ink">
            {book.title}
          </h3>
          <p className="mt-1 truncate text-sm text-ink-muted">{book.author}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-wide text-ink-faint" data-numeric>
            {book._count.annotations} {book._count.annotations === 1 ? "note" : "notes"}
          </span>
          <span className="font-mono text-[11px] tracking-wide text-ink-faint">
            {relativeActivity(book.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
