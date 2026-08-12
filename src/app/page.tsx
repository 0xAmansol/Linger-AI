import Link from "next/link";
import { ArrowRight, Camera, Sparkle, Type } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

const DEMO_QUOTE =
  "You have power over your mind — not outside events. Realize this, and you will find strength.";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:px-8">
        <span className="font-serif text-xl text-ink">Linger</span>
        <Button asChild size="sm">
          <Link href="/library">
            Open your library
            <ArrowRight />
          </Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:gap-12 md:px-8 md:py-20">
        <div className="flex flex-col gap-6">
          <h1 className="font-serif text-4xl leading-[1.1] text-ink md:text-5xl">
            Whenever you find a line worth keeping,{" "}
            <span className="italic">Linger keeps it.</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ink-muted">
            Photograph a page, type a passage, or paste a quote — Linger saves it against
            the exact book, explains it at your level, and makes sure you can find it
            again.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/library">
                Start your library
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="#walkthrough">See how it works</a>
            </Button>
          </div>
        </div>

        <DemoAnnotationCard />
      </section>

      {/* Walkthrough */}
      <section id="walkthrough" className="border-t border-border bg-paper-sunken/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 md:px-8 md:py-24">
          <p className="text-center font-mono text-xs uppercase tracking-[0.15em] text-ink-faint">
            The loop
          </p>

          <WalkthroughStep
            eyebrow="01"
            title="Capture it in seconds"
            body="Type it, paste it, or photograph the page — whichever is fastest when you're mid-chapter and don't want to lose the moment."
            reverse={false}
          >
            <DemoCaptureArtifact />
          </WalkthroughStep>

          <WalkthroughStep
            eyebrow="02"
            title="Understand it at your level"
            body="Ask for a Simple, Deep, Academic, or Conversational explanation — every answer is tied to the exact passage you saved, never a disconnected chat you'll lose track of."
            reverse
          >
            <DemoExplainArtifact />
          </WalkthroughStep>

          <WalkthroughStep
            eyebrow="03"
            title="Find it again, or take it with you"
            body="Every passage lives on its book's own page in your library — and exports to clean, Obsidian-ready Markdown the moment you want your own copy."
            reverse={false}
          >
            <DemoExportArtifact />
          </WalkthroughStep>
        </div>
      </section>

      {/* Differentiators */}
      <section className="mx-auto w-full max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.15em] text-ink-faint">
          Why not just...
        </p>
        <dl className="flex flex-col divide-y divide-border">
          <LedgerRow term="Kindle or Readwise">
            They work from digital highlights. Linger works from the book in your
            hands — photograph any page, digital or print.
          </LedgerRow>
          <LedgerRow term="ChatGPT">
            A chat disappears. Every Linger explanation stays attached to the exact
            passage you saved, findable months later.
          </LedgerRow>
          <LedgerRow term="Notion or Obsidian">
            General note apps don&rsquo;t know what a book is. In Linger, the book is the
            object everything else hangs off — not an afterthought property.
          </LedgerRow>
          <LedgerRow term="A dictionary">
            A dictionary gives you the common meaning. Linger gives you the meaning
            of the word in the sentence you&rsquo;re actually reading.
          </LedgerRow>
        </dl>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border px-4 py-16 text-center md:px-8 md:py-24">
        <h2 className="mx-auto max-w-lg font-serif text-3xl leading-tight text-ink">
          Your next great line is already in the book you&rsquo;re reading.
        </h2>
        <Button size="lg" asChild className="mt-8">
          <Link href="/library">
            Start your library
            <ArrowRight />
          </Link>
        </Button>
      </section>

      <footer className="border-t border-border px-4 py-8 text-center md:px-8">
        <p className="font-serif italic text-ink-muted">
          Linger — a place for what you&rsquo;ve found in your books.
        </p>
      </footer>
    </div>
  );
}

function WalkthroughStep({
  eyebrow,
  title,
  body,
  reverse,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  reverse: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-2 md:gap-16">
      <div className={reverse ? "md:order-2" : undefined}>
        <span className="font-mono text-sm text-ink-faint" data-numeric>
          {eyebrow}
        </span>
        <h3 className="mt-2 font-serif text-2xl text-ink">{title}</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">{body}</p>
      </div>
      <div className={reverse ? "md:order-1" : undefined}>{children}</div>
    </div>
  );
}

function LedgerRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-5 md:grid-cols-[10rem_1fr] md:gap-6">
      <dt className="font-mono text-xs uppercase tracking-wide text-ink-faint">{term}</dt>
      <dd className="text-sm leading-relaxed text-ink-muted">{children}</dd>
    </div>
  );
}

function DemoAnnotationCard() {
  return (
    <div className="rounded-card border border-border bg-paper-raised p-5 shadow-raised">
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink-faint" data-numeric>
        Meditations · Book II · p. 43
      </span>
      <p className="mt-3 font-serif text-[17px] italic leading-relaxed text-ink">
        {DEMO_QUOTE}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Tag>stoicism</Tag>
        <Tag>control</Tag>
      </div>
      <div className="mt-4 rounded-control border border-border bg-paper-sunken px-3 py-2.5">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-accent-muted">
          <Sparkle className="size-3" />
          Explained · Simple
        </div>
        <p className="text-sm leading-relaxed text-ink">
          Based on this passage: focus on what you actually control — your own
          reactions — instead of fighting things you never could.
        </p>
      </div>
    </div>
  );
}

function DemoCaptureArtifact() {
  return (
    <div className="rounded-card border border-border bg-paper-raised p-5 shadow-card">
      <div className="flex gap-1 rounded-control border border-border bg-paper-sunken p-1">
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-control bg-paper-raised py-1.5 text-sm font-medium text-ink shadow-card">
          <Type className="size-3.5" />
          Type or paste
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 py-1.5 text-sm font-medium text-ink-muted">
          <Camera className="size-3.5" />
          Photograph
        </span>
      </div>
      <div className="mt-3 rounded-control border border-border bg-paper px-3 py-3 text-sm italic text-ink-faint">
        The line that stopped you…
      </div>
    </div>
  );
}

function DemoExplainArtifact() {
  return (
    <div className="rounded-card border border-border bg-paper-raised p-5 shadow-card">
      <p className="font-serif text-[15px] italic leading-relaxed text-ink">
        &ldquo;{DEMO_QUOTE}&rdquo;
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Simple", "Deep", "Academic", "Conversational"].map((level, i) => (
          <span
            key={level}
            className={
              i === 0
                ? "rounded-control bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                : "rounded-control border border-border-strong px-2.5 py-1 text-xs font-medium text-ink-muted"
            }
          >
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}

function DemoExportArtifact() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          { title: "Meditations", author: "Marcus Aurelius" },
          { title: "The Odyssey", author: "Homer" },
        ].map((book) => (
          <div
            key={book.title}
            className="rounded-card border border-border bg-paper-raised p-3 shadow-card"
          >
            <div className="mb-2 aspect-[2/3] w-full rounded-sm bg-paper-sunken" />
            <p className="truncate font-serif text-sm text-ink">{book.title}</p>
            <p className="truncate text-xs text-ink-muted">{book.author}</p>
          </div>
        ))}
      </div>
      <div className="rounded-control border border-border bg-paper-sunken px-3 py-2.5 font-mono text-[11px] leading-relaxed text-ink-muted">
        <span className="text-ink">## Annotation — Book II</span>
        <br />
        &gt; You have power over your mind…
        <br />
        <span className="text-ink-faint">#stoicism #control</span>
      </div>
    </div>
  );
}
