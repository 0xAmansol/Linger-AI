---
name: Linger
description: A library card catalog for what you've discovered while reading.
colors:
  paper: "#eeeae1"
  paper-raised: "#f5f2ea"
  paper-sunken: "#e5e0d3"
  ink: "#1e1b16"
  ink-muted: "#6b6457"
  ink-faint: "#948c7a"
  border: "#d9d2c2"
  border-strong: "#c2b8a2"
  accent: "#2b3a55"
  accent-foreground: "#f5f2ea"
  accent-muted: "#4a5a78"
  danger: "#7a3b32"
  danger-foreground: "#f5f2ea"
typography:
  display:
    fontFamily: "Spectral, ui-serif, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SF Mono, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.05em"
rounded:
  card: "3px"
  control: "6px"
  pill: "999px"
spacing:
  card-padding: "1rem"
  dialog-padding: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-muted}"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
---

# Design System: Linger

## Overview

**Creative North Star: "The Card Catalog"**

Linger is the reader's own library card catalog: every book a drawer, every passage a stamped index card. The system's job is to make capture and retrieval feel like archival work worth doing, not like filling out a form in a SaaS dashboard. Assigned by the skill's concept-seed roll from a grounded list of a serious reader's own visual world (marginalia, commonplace books, card catalogs, book jackets, field notebooks, letterpress, broadsheet reading rooms) — the roll landed on the card catalog; the founder confirmed it over three alternatives.

Confirmed visual rejections: no warm-cream-plus-terracotta "AI book app" default (the paper tone here is intentionally cooler and grayer, closer to real card stock than to parchment); no generic shadcn/AI-SaaS rounded-card dashboards; no gradients, glass decoration, or hard offset shadows.

**Key Characteristics:**
- Restrained color strategy — neutrals plus exactly one accent, appropriate to an Operate-mode reading/annotation tool.
- A crisp, small corner radius (3px on cards) rather than the soft 8-12px SaaS default — reads as a cut paper edge, not a rounded rectangle.
- Monospace is reserved for actual data (page numbers, dates, counts) — a card-catalog stamp, never decoration.
- Every "card" in the product is a literal extension of the catalog metaphor (a book tile, an annotation as an index card, a shelf filter as a staggered index tab) — not a generic content container.

## Colors

Restrained strategy: a warm, slightly gray-buff neutral scale carries the whole interface; one deep ink-stamp indigo is the only accent, and it earns its place by rarity.

### Primary
- **Ink-Stamp Indigo** (`#2b3a55`): The single accent. Active shelf tab, primary buttons, focus rings, "explained" label text, link color. Deliberately not a purple or a warm terracotta — closer to fountain-pen ink or a library due-date stamp, avoiding the palette the calibration guidance names as the default AI-generated look for literary subjects.

### Neutral
- **Paper** (`#eeeae1`): Page background. A gray-buff ivory, cooler and less saturated than a golden parchment cream.
- **Paper Raised** (`#f5f2ea`): Card and dialog surfaces, sitting one step lighter than the page.
- **Paper Sunken** (`#e5e0d3`): Recessed surfaces — AI response panels, hover states, scrollbar track.
- **Ink** (`#1e1b16`): Primary text. A warm near-black, never pure black.
- **Ink Muted** (`#6b6457`): Secondary text — authors, metadata prose, body copy inside AI responses.
- **Ink Faint** (`#948c7a`): Tertiary text — counts, placeholders, timestamps.
- **Border / Border Strong** (`#d9d2c2` / `#c2b8a2`): Hairline dividers and card edges; the strong variant marks an active/selected boundary (e.g. the active shelf tab's edge).

### Named Rules
**The One Accent Rule.** Ink-Stamp Indigo is the only saturated color in the system. It marks exactly one thing per screen — the active filter, the primary action, a live focus state — never decoration.

## Typography

**Display Font:** Spectral (self-hosted via `next/font/google`, fallback `ui-serif, Georgia, serif`)
**Body/UI Font:** the operating system's native sans-serif stack (no imported UI face)
**Label/Mono Font:** IBM Plex Mono (fallback `ui-monospace, SF Mono, Menlo, monospace`)

**Character:** Spectral was chosen because it's a face designed for on-screen literary reading, not for its "book" association alone — it carries the quotes and book titles. The UI chrome deliberately uses the reader's own system font rather than an imported face like Inter, which is exactly what most AI-generated interfaces default to; this keeps the interface feeling native and fast rather than imported. IBM Plex Mono renders only real data (page numbers, dates, call-number-style stamps), never as a "tech" costume.

### Hierarchy
- **Display** (400, `text-2xl`/1.5rem, 1.25 line-height, Spectral): Page titles ("Linger", book titles).
- **Title** (400, `text-lg`/1.125rem, Spectral italic): Quoted passages (`QuoteBlock`) and dialog titles.
- **Body** (400, `text-sm`/0.875rem, 1.5 line-height, system sans): UI copy, AI response text, personal notes.
- **Label** (500, `text-[11px]`, 0.05em tracking, uppercase, IBM Plex Mono): Stamped metadata — page/chapter/date, annotation and note counts, AI-insight type labels.

### Named Rules
**The Two-Voice Rule.** Spectral speaks for the book (quotes, titles); the system sans speaks for the interface (labels, buttons, controls). A quote never renders in the UI font, and UI chrome never renders in Spectral.

## Layout

Single-column content on mobile; a two-column library (a fixed-width shelf-filter rail plus a fluid book grid) from the `md` breakpoint up. Content is capped at `max-w-5xl` (library) / `max-w-3xl` (book detail), centered, with `px-4`/`md:px-8` side padding. The book grid runs 1/2/3 columns at default/`sm`/`lg`. Spacing rhythm favors generous separation between sections (`gap-6`–`gap-8`) over dense stacking; within a card, elements sit close (`gap-1.5`–`gap-3`).

Pages reserve extra bottom padding (`pb-24`) beneath their content for the fixed capture button — a partial mitigation for short pages on mobile, not a complete fix (see Do's and Don'ts).

## Elevation & Depth

Flat by default; a soft, dual-layer shadow only on genuinely raised surfaces (cards at rest, dialogs, popovers). No hard offset shadows, no neobrutalist block shadows — this world never earned that device.

### Shadow Vocabulary
- **`shadow-card`** (`0 1px 2px rgba(30,27,22,.07), 0 6px 16px rgba(30,27,22,.05)`): Resting state for book cards and annotation cards.
- **`shadow-raised`** (`0 2px 4px rgba(30,27,22,.1), 0 12px 28px rgba(30,27,22,.08)`): Hover state for cards; resting state for dialogs, popovers, dropdowns, and the capture FAB.

### Named Rules
**The Earned Elevation Rule.** A surface is flat until it's either interactive-and-hovered or floating above the page (dialog, popover, toast). Elevation signals "this is temporarily above the catalog," never decoration.

## Shapes

Corners are deliberately crisp, not the soft rounded-rectangle default of most AI-generated UI: cards use a 3px radius (`rounded-card`) — enough to soften a cut paper edge, not enough to read as a "rounded card component." Controls (buttons, inputs, dropdowns) use 6px (`rounded-control`) for comfortable touch targets. Tags and pills use a full 999px radius. The shelf rail's tabs are `rounded-l-card` only — square on the content-facing edge, so each tab reads as cut into a spine rather than as a floating chip.

## Components

### Buttons
- **Shape:** 6px radius (`rounded-control`), heights `sm`/8, default/9, `lg`/11, `icon`/9-square.
- **Primary:** Ink-Stamp Indigo background, Paper Raised text; hover shifts to Accent Muted.
- **Secondary:** Paper Raised background with a Border Strong outline — used for less-committal actions (Simplify, Define, Export).
- **Ghost:** No fill; Ink Muted text, Paper Sunken background on hover — used for tertiary actions (Cancel, More, delete/copy icon buttons).
- **Destructive:** Danger background, reserved for the delete-annotation confirmation only.

### Tags (Chips)
- **Style:** Full-pill radius, `border-border-strong` outline, IBM Plex Mono label text, no fill at rest.
- **State:** An `accent` variant (10%-opacity accent background) exists for future emphasis but is not yet used in shipped surfaces.

### Cards / Containers
- **Corner Style:** 3px (`rounded-card`).
- **Background:** Paper Raised on Paper.
- **Shadow Strategy:** `shadow-card` at rest, `shadow-raised` on hover (see Elevation).
- **Border:** 1px `border-border`, Border Strong when the card carries an active/selected state.
- **Internal Padding:** `p-3` (book cards, compact) to `p-4`–`p-6` (annotation cards, dialogs).

### Inputs / Fields
- **Style:** 6px radius, 1px `border-border`, Paper Raised background.
- **Focus:** Border shifts to Ink-Stamp Indigo; no glow or ring on the input itself (the ring lives on interactive elements without a border, via `:focus-visible`).

### Navigation — Shelf Rail (signature component)
The reading-status filter renders as a set of staggered index tabs, not a plain link list — each inactive shelf is indented further than the last (`md:ml-0` through `md:ml-5`, in order), evoking a dictionary's thumb-index or a card catalog's stepped guide cards. The active shelf resets to full width against the rail's divider, reading as the tab currently pulled forward. On mobile, the same shelves collapse to a horizontal scrolling row of pills — the tab metaphor doesn't survive the width constraint there, and pills are the honest fallback.

### Book Card (signature component)
A small status tab (`READING` / `WANT TO READ` / etc.) sits notched into the top edge of the cover, like a library guide card's genre tab. A generated cover swatch (a muted, hashed "cloth" tint with the title's initial in Spectral italic) stands in when no cover image exists — deliberately never a bright or random color. Annotation count and last-activity date render as stamped monospace metadata in the card's lower corners.

### Annotation Card (signature component)
The literal unit of the catalog: chapter/page/date as a stamped monospace header line, the passage itself in Spectral italic (never altered, always quoted verbatim), an inline-editable personal note, a tag editor, and the AI action bar. AI responses render in a `paper-sunken` panel with a small Sparkle-icon label naming the insight type — visually distinct from the reader's own words, never blended with them.

## Do's and Don'ts

### Do:
- **Do** keep the accent to exactly one hue (Ink-Stamp Indigo); a second accent needs a Named Rule update here first.
- **Do** render every quoted passage in Spectral italic, unaltered from what the reader captured.
- **Do** reserve monospace for real data (counts, dates, page numbers) — never as a "technical" costume.
- **Do** keep card corners crisp (3px) — resist the pull toward the generic 8-12px rounded-rectangle default.

### Don't:
- **Don't** add a second saturated accent color without updating the One Accent Rule.
- **Don't** use a kicker/eyebrow label above a heading anywhere — the craft floor bans it outright and the detector (`node .claude/skills/impeccable/scripts/detect.mjs`) currently reports zero findings against this rule; keep it that way.
- **Don't** reach for a colored `border-left` as a callout/card accent — not used anywhere in the shipped system, and it reads as generic-AI-dashboard the moment it appears.
- **Don't** treat the fixed capture button as fully collision-safe on short mobile pages. Known, disclosed limitation: a book with very little content can render short enough that the button visually overlaps the last interactive element on first paint; the page's `pb-24` makes it scroll-recoverable (confirmed: a ~60px scroll clears it) but does not prevent the initial-paint overlap. A future pass should either detect this case and hide/shrink the button, or restructure it as a non-overlapping bottom bar.
