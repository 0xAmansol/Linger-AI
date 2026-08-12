import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

import { AnnotationCard } from "@/components/annotation-card";
import { BookCover } from "@/components/book-cover";
import { CaptureButton } from "@/components/capture-button";
import { ExportButton } from "@/components/export-button";
import { ReadingStatusSelect } from "@/components/reading-status-select";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function BookDetailPage({ params }: PageProps<"/books/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) notFound();

  const book = await db.book.findUnique({
    where: { id, userId: user.id },
    include: {
      annotations: {
        orderBy: { createdAt: "desc" },
        include: {
          tags: { include: { tag: true } },
          aiInsights: { orderBy: { createdAt: "asc" } },
          vocabulary: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });

  if (!book) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 pb-24 pt-8 md:px-8 md:py-8">
      <Link
        href="/library"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Library
      </Link>

      <header className="flex gap-5">
        <BookCover title={book.title} coverUrl={book.coverUrl} className="w-28 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <h1 className="font-serif text-2xl leading-tight text-ink">{book.title}</h1>
            {book.subtitle && <p className="font-serif text-base italic text-ink-muted">{book.subtitle}</p>}
            <p className="mt-1 text-sm text-ink-muted">{book.author}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-faint">
            {book.publisher && <span>{book.publisher}</span>}
            {book.isbn && <span className="font-mono">ISBN {book.isbn}</span>}
          </div>
          <div className="flex items-center gap-2">
            <ReadingStatusSelect bookId={book.id} status={book.readingStatus} />
            {book.annotations.length > 0 && <ExportButton bookId={book.id} />}
          </div>
        </div>
      </header>

      {book.description && (
        <p className="text-sm leading-relaxed text-ink-muted">{book.description}</p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-mono text-xs uppercase tracking-wider text-ink-faint">
          {book.annotations.length} {book.annotations.length === 1 ? "annotation" : "annotations"}
        </h2>

        {book.annotations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border py-16 text-center">
            <BookOpen className="size-8 text-ink-faint" strokeWidth={1.5} />
            <h3 className="font-serif text-lg text-ink">Nothing captured yet</h3>
            <p className="max-w-sm text-sm text-ink-muted">
              Capture your first passage from this book — type it, paste it, or photograph the page.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {book.annotations.map((annotation) => (
              <AnnotationCard
                key={annotation.id}
                annotation={{
                  id: annotation.id,
                  sourceText: annotation.sourceText,
                  pageNumber: annotation.pageNumber,
                  chapter: annotation.chapter,
                  personalNote: annotation.personalNote,
                  createdAt: annotation.createdAt,
                  tags: annotation.tags.map((t) => t.tag.name),
                  insights: annotation.aiInsights.map((i) => ({
                    id: i.id,
                    type: i.type,
                    prompt: i.prompt,
                    response: i.response,
                  })),
                  vocabulary: annotation.vocabulary.map((v) => ({
                    id: v.id,
                    word: v.word,
                    contextualDefinition: v.contextualDefinition,
                    definition: v.definition,
                  })),
                }}
              />
            ))}
          </div>
        )}
      </section>

      <CaptureButton bookId={book.id} bookTitle={book.title} />
    </div>
  );
}
