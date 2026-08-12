# Linger — Product Decisions (V1)

Source spec: `BookMind_Master_Build_Prompt.md` (Section 39/40 founder interview).
These decisions were made directly with the founder before any code was written, per
Section 41-42 of the spec ("do not make irreversible product assumptions").

## Problem

Readers find great lines and hard ideas in physical books constantly, and lose almost
all of them — there is no fast, book-anchored way to capture a passage, understand it,
and find it again later.

## Target user (V1)

A blend of two personas:

- **The Annotator** — highlights constantly, wants beautiful storage, tags, fast
  capture, and clean export.
- **The Curious Reader** — hits difficult language or ideas often and wants
  in-context explanation without leaving the book or copy-pasting into ChatGPT.

V1 is designed for someone who is *both*: capture has to be as fast as a highlighter,
and every captured passage has to be explainable on the spot, at a level the reader
chooses.

## Core loop (five steps)

1. **Photograph** a passage in a physical book (primary capture method for V1).
2. **Confirm/correct** the OCR text and attach it to a book.
3. **Understand** — ask for an explanation at Simple / Deep / Academic / Conversational
   level, or define a word in context.
4. **Annotate** — add a personal note and tags.
5. **Retrieve** — find it again later on the book's page, or export it to Obsidian.

## Magic moment

Photograph a paragraph → it's OCR'd, corrected, and safely saved in seconds, with a
one-tap contextual AI explanation available immediately — no app-switching, no
copy-paste into another tool.

## V1 promise

> "Whenever I photograph or type a passage from a book, Linger saves it against that
> book instantly, lets me understand it at my own level, and I can always find it or
> export it later."

## Non-goals (V1)

1. Voice capture/conversation (design the data model for it, build it in a later phase).
2. Semantic/vector search and the reading chatbot (V2).
3. Notion integration (Obsidian export ships first; Notion is V1.1).
4. Social/sharing features of any kind.
5. Local-only/offline mode as a hard constraint — standard cloud processing with
   minimal data sent to AI providers is sufficient for V1.

## Success metric

Capture-to-save rate and repeat retrieval of saved passages — not AI prompt volume.
("Meaningful reading discoveries captured and successfully retrieved," Section 36.)

## Differentiator

- vs. **Kindle/Readwise**: works from a physical book via camera, not just digital
  highlights.
- vs. **ChatGPT**: every explanation is tied to a saved, book-anchored passage — never
  a disconnected chat.
- vs. **Notion/Obsidian**: the book, not the note, is the primary object; annotation
  structure is opinionated and reading-specific, then exported into those tools.
- vs. **a dictionary**: definitions are contextual to the sentence the reader is
  actually reading, not generic.

## Locked technical decisions

| Decision | Choice |
|---|---|
| Product name | **Linger** |
| Flagship V1 feature | Frictionless capture, camera/OCR-first |
| AI explanation style | Adaptive levels (Simple / Deep / Academic / Conversational) |
| Export | Obsidian-compatible Markdown in V1; Notion deferred to V1.1 |
| Privacy | Standard cloud; only the selected passage/context is sent to AI providers |
| Stack | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + PostgreSQL + Prisma + pgvector (schema-ready, unused until V2 semantic search) |
| Auth | Clerk |
| AI provider | OpenAI, behind an `AIProvider` interface (Strategy pattern) — swappable |
| OCR provider | Google Cloud Vision, behind an `OCRProvider` interface — swappable |
| Credentials | Scaffolded with `.env.example` placeholders + mock providers so the app runs end-to-end without live keys; real keys can be dropped in later |
| Background jobs | None for V1 — OCR/AI run as async server actions with optimistic UI; add Inngest/Trigger.dev only if latency becomes a real problem |

## Implementation priority

Per Section 42: **capture quality > annotation quality > understanding quality >
retrieval quality > integrations > advanced AI.**

The first vertical slice (this build) covers Phases 1-5 and 8 of Section 32:
Foundation → Library → Annotation engine → AI → Camera/OCR → Obsidian export.
Voice (Phase 6) and full search (Phase 7 beyond basic filtering) are left for the next
iteration, as agreed non-goals above.
