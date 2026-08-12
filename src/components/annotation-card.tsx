"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AIActionBar } from "@/components/ai-action-bar";
import { AIResponse } from "@/components/ai-response";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PersonalNote } from "@/components/personal-note";
import { QuoteBlock } from "@/components/quote-block";
import { TagEditor } from "@/components/tag-editor";
import { deleteAnnotation } from "@/lib/actions/annotations";
import { cn } from "@/lib/utils";

export interface AnnotationCardData {
  id: string;
  sourceText: string;
  pageNumber: number | null;
  chapter: string | null;
  personalNote: string | null;
  createdAt: Date;
  tags: string[];
  insights: { id: string; type: string; prompt: string; response: string }[];
  vocabulary: { id: string; word: string; contextualDefinition: string | null; definition: string }[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function AnnotationCard({ annotation }: { annotation: AnnotationCardData }) {
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteAnnotation(annotation.id);
      toast.success("Annotation deleted");
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(annotation.sourceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const stamp = [
    annotation.chapter,
    annotation.pageNumber != null ? `p. ${annotation.pageNumber}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={cn(
        "group/card rounded-card border border-border bg-paper-raised p-4 shadow-card transition-opacity",
        pending && "opacity-50"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint" data-numeric>
          {stamp || formatDate(annotation.createdAt)}
          {stamp ? ` · ${formatDate(annotation.createdAt)}` : ""}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label="Copy passage"
            onClick={handleCopy}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-6" aria-label="Delete annotation">
                <Trash2 className="size-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <p className="mb-2 text-sm text-ink">Delete this annotation?</p>
              <div className="flex justify-end gap-2">
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <QuoteBlock text={annotation.sourceText} />

      <div className="mt-3 flex flex-col gap-2">
        <PersonalNote annotationId={annotation.id} note={annotation.personalNote} />
        <TagEditor annotationId={annotation.id} tags={annotation.tags} />
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
        {annotation.insights.map((insight) => (
          <AIResponse key={insight.id} type={insight.type} prompt={insight.prompt} response={insight.response} />
        ))}
        {annotation.vocabulary.map((entry) => (
          <div key={entry.id} className="rounded-control border border-border bg-paper-sunken px-3 py-2.5">
            <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-accent-muted">
              {entry.word}
            </div>
            <p className="text-sm leading-relaxed text-ink">
              {entry.contextualDefinition || entry.definition}
            </p>
          </div>
        ))}
        <AIActionBar
          annotationId={annotation.id}
          sourceText={annotation.sourceText}
          hasInsights={annotation.insights.length > 0}
          knownInsightIds={annotation.insights.map((i) => i.id)}
        />
      </div>
    </article>
  );
}
