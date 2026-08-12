# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, PostgreSQL + Prisma
(pgvector reserved, unused until V2 semantic search), Clerk for auth, deployed on
Vercel. Confirmed with the founder before scaffolding (see `docs/PRODUCT_DECISIONS.md`).

## Users

A blend of two reading personas, targeted together in V1:

- **The Annotator** — highlights constantly while reading, wants beautiful,
  fast, book-anchored storage with tags and clean export.
- **The Curious Reader** — hits difficult language, philosophical ideas, or
  unfamiliar words often and wants an explanation in context, without leaving
  the book or copy-pasting into a separate chat tool.

Both are actively reading physical books and want a permanent, searchable home
for what they capture — not a general notes app.

## Product Purpose

Linger is the reader's personal layer on top of the books they're actively
reading. A reader photographs, types, or pastes a passage; Linger saves it
against the exact book, lets them understand it at a level they choose, and
makes it retrievable later. Success is measured by discoveries captured and
later retrieved — not by AI usage volume.

## Positioning

Every AI explanation is tied to a saved, book-anchored passage — never a
disconnected chat. Capture works from a physical book via camera/OCR, not
only from digital highlights. The book, not the note, is the primary object,
which a general PKM tool (Notion/Obsidian) does not enforce by structure.

## Operating Context

The primary usage scene is a reader mid-book, physically holding it, who
encounters a passage worth keeping. Capture must complete in seconds:
photograph the page, correct the OCR text, attach it to a book, optionally
ask for an explanation, save. Retrieval happens later on the book's own page
in the library, or via Obsidian export into the reader's existing knowledge
vault.

## Capabilities and Constraints

- Capture: manual type/paste, camera photo → OCR → user-confirmed correction
  (flagship V1 capture path), and paste. Voice capture is designed for in the
  data model but not built in V1.
- AI actions (explain, simplify, define, analyze) run through an `AIProvider`
  interface; OpenAI is the concrete V1 implementation, swappable later.
- OCR runs through an `OCRProvider` interface; Google Cloud Vision is the
  concrete V1 implementation, swappable later.
- AI explanations are adaptive: the reader chooses Simple / Deep / Academic /
  Conversational per request.
- Only the selected passage and its immediate context are sent to AI
  providers — no broader library content, per the founder's privacy decision.
  No local-only/offline mode is required for V1.
- Export: deterministic Obsidian-compatible Markdown, one file per book.
  Notion integration is explicitly deferred (V1.1).
- No background job queue in V1 — OCR/AI run as async server actions with
  optimistic UI; captured content persists before AI processing runs, and an
  AI/OCR failure must never lose a captured passage.
- Semantic/vector search, the reading chatbot, and social/sharing features
  are explicit non-goals for V1 (see `docs/PRODUCT_DECISIONS.md`).
- Credentials are scaffolded with `.env.example` placeholders and mock
  provider implementations so the app runs end-to-end before real API keys
  are supplied.

## Brand Commitments

Product name: **Linger**. Voice: "a thoughtful friend who loves books," not
an AI productivity assistant — intelligent but not pretentious, literary but
not academic, calm but not boring (per source spec Section 38).

## Evidence on Hand

None yet — Linger is a new product with no existing users, testimonials, or
production content. Future work must not fabricate any.

## Product Principles

1. Capture quality comes before annotation quality, which comes before
   understanding quality, which comes before retrieval quality, which comes
   before integrations, which comes before advanced AI (source spec Section
   42) — in that order, always.
2. The book is the anchor for every passage, note, and AI insight; nothing is
   a freestanding note.
3. AI augments understanding of what was read; it never summarizes a book in
   place of reading it.
4. A captured passage must never be lost to an AI or OCR failure — persist
   first, enrich second.
5. Voice is designed for from the data model onward, even though it isn't
   built until a later phase.

## Accessibility & Inclusion

Standard strong web accessibility defaults apply (keyboard navigation,
semantic HTML, visible focus, accessible dialogs, reduced-motion support,
sufficient contrast, screen-reader-friendly interactions). No additional
product-specific accessibility requirement has been established beyond this.
