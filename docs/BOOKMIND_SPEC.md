# BOOKMIND — AI-NATIVE, VOICE-FIRST READING COMPANION
## Master Product + Design + Engineering Prompt / Build Plan

> **Purpose:** This is a single source-of-truth prompt for designing and building the first version of an AI-native platform for serious readers. It is intended to be given to Claude Code (with the **Impeccable** design skill enabled) and used as the product, UX, architecture, and implementation specification.

---

# 1. PRODUCT VISION

Build a beautiful, voice-first, AI-native web application for people who actively read books and want a permanent, searchable home for everything they discover while reading.

The core mental model is:

> **“I am reading a book. I found something interesting. I want to capture it, understand it, remember it, and find it again later.”**

The product should become the reader's personal layer on top of their books.

A reader should be able to:

- Capture a favorite line or passage.
- Type or paste a quote.
- Take a photo of a paragraph/page and extract the text with OCR.
- Ask for the meaning of a sentence or paragraph.
- Ask for a simpler explanation of difficult writing.
- Look up the meaning of a word.
- Save annotations against a specific book.
- Add personal thoughts, tags, themes, and context.
- Browse everything they have captured from a book.
- Search their library and annotations manually.
- Export/sync notes to Notion or Obsidian.
- Eventually ask a chatbot questions across their personal reading library.
- Eventually retrieve related passages semantically rather than remembering exact keywords.
- Eventually use voice as the primary interaction mechanism.

The product should not feel like another generic notes app.

It should feel like:

**Kindle highlights + Readwise + Obsidian + Dictionary + AI tutor + personal literary archive**, designed around the act of reading.

---

# 2. PRODUCT PRINCIPLES

Design and build around these principles:

### 2.1 Capture should be frictionless

The distance between:

> “I found something interesting”

and

> “It is safely stored in my library”

should be as close to zero as possible.

Prefer:

- One-tap capture.
- Camera capture.
- Voice capture.
- Paste.
- Keyboard shortcuts.
- Drag-and-drop.
- Mobile-friendly interaction.

### 2.2 Understanding should happen in context

Do not make the reader copy text into ChatGPT.

If the user captures:

> “A man is not what he thinks he is, but what he hides.”

the product should understand:

- which book it came from,
- the exact passage,
- the surrounding context if available,
- the user's question,
- and the type of explanation requested.

### 2.3 The book is the primary object

The core hierarchy should be:

**Library → Book → Passage/Highlight → Annotation → Meaning/Context → Personal Thought**

Not:

**Notes → random note → optional book metadata**

The book should always remain the anchor.

### 2.4 AI should augment the reader, not replace reading

Avoid turning the product into a “summarize every book” machine.

The product should encourage:

- curiosity,
- reflection,
- comprehension,
- recall,
- personal interpretation,
- rereading.

AI should help the reader understand what they encountered rather than encourage them to skip the book.

### 2.5 Voice is a first-class interaction

Voice should not simply be a microphone button added to a normal SaaS interface.

Design interactions such as:

> “Save this.”

> “What does this mean?”

> “Explain this like I'm new to philosophy.”

> “Why is this sentence important?”

> “Add this to my notes.”

> “What other passages have I saved about loneliness?”

The system should understand conversational context.

---

# 3. TARGET USERS

Design primarily for four overlapping personas.

## Persona A — The Annotator

Highlights books constantly.

Needs:

- beautiful annotation storage,
- easy capture,
- tags,
- book organization,
- export.

## Persona B — The Curious Reader

Frequently encounters difficult language, philosophical ideas, unfamiliar words, historical references, or concepts.

Needs:

- contextual explanations,
- dictionary,
- AI explanations,
- examples,
- related concepts.

## Persona C — The Knowledge Builder

Uses books as raw material for a personal knowledge system.

Needs:

- structured notes,
- backlinks,
- tags,
- exports,
- Obsidian/Notion integration,
- semantic retrieval eventually.

## Persona D — The Reflective Reader

Captures passages because they resonate emotionally or intellectually.

Needs:

- personal reflections,
- themes,
- resurfacing,
- rediscovery,
- “why did I save this?” context.

---

# 4. V1 PRODUCT SCOPE

Do NOT overbuild V1.

The first version should prove one core loop:

> **Capture → Understand → Annotate → Organize → Retrieve → Export**

### V1 MUST HAVE

#### Library

- Add a book.
- Search books.
- Book cover.
- Title.
- Author.
- ISBN where available.
- Reading status.
- Personal notes count.
- Highlight count.
- Last activity.
- Bookshelf/grid/list views.

#### Book page

Show:

- Cover.
- Title.
- Author.
- Metadata.
- User notes.
- Highlights.
- Vocabulary.
- AI explanations.
- Tags/themes.
- Activity.

#### Capture

Support:

1. Manual text entry.
2. Paste.
3. Camera/photo.
4. Voice capture.

#### OCR

User takes a photo.

Pipeline:

`Image → preprocessing → OCR → extracted text → user confirmation → save`

The user must be able to correct OCR before saving.

#### Annotation

Every saved passage should support:

- Original text.
- Book.
- Page number, if known.
- Chapter, if known.
- Location, if known.
- Personal note.
- Tags.
- Created date.
- Optional AI explanation.
- Optional word lookup.

#### AI explanation

Actions:

- Explain.
- Simplify.
- Explain context.
- Explain difficult words.
- Explain metaphor.
- Explain philosophical idea.
- Give an example.
- Translate.
- Ask follow-up.

The interface should provide a few suggested actions before requiring the user to write a prompt.

#### Dictionary

For a selected word:

- Definition.
- Part of speech.
- Pronunciation.
- Example sentence.
- Contextual meaning.
- Synonyms where useful.

Prefer contextual meaning over merely showing a generic dictionary definition.

#### Search

V1 should support:

- Books.
- Authors.
- Exact quotes.
- Notes.
- Tags.
- Vocabulary.

Semantic search can be introduced if practical, but it should not block the first release.

#### Export

Initial integrations:

- Markdown export.
- Obsidian-compatible Markdown.
- Notion export/integration.

The architecture should make additional destinations easy later.

---

# 5. V1 NON-GOALS

Do not make these prerequisites for launch:

- Full Kindle integration.
- DRM bypass.
- Automatic importing of copyrighted books.
- Social network/feed.
- Public quote marketplace.
- Full audiobook platform.
- Complex recommendation engine.
- Multi-agent AI architecture.
- Massive knowledge graph.
- Native mobile apps.
- Chatbot over every book in existence.
- Automated book summarization as the main feature.

The product should be valuable even if the user manually adds books and passages.

---

# 6. THE CORE USER JOURNEY

Design the application around this journey:

### Step 1 — User opens the app

They see their reading library and recent discoveries.

### Step 2 — User opens a book

They see the book and everything they have captured from it.

### Step 3 — User encounters a passage

They can:

- type it,
- paste it,
- photograph it,
- speak it.

### Step 4 — AI understands the capture

OCR if necessary.

Detect:

- likely quote,
- paragraph,
- vocabulary,
- possible ambiguity.

### Step 5 — User chooses an action

Examples:

**Save**

**Explain**

**Simplify**

**Define**

**Reflect**

**Translate**

**Add note**

### Step 6 — User adds personal context

Example:

> “This reminds me of the conversation I had with my father.”

### Step 7 — Save

The annotation becomes part of the book.

### Step 8 — Later retrieval

The user opens the book and finds:

> “The paragraph I saved about fear.”

Eventually:

> “What did I save about fear?”

The system should retrieve it semantically.

---

# 7. INFORMATION ARCHITECTURE

Use a simple architecture.

## Primary navigation

- Library
- Recent
- Search
- Capture
- Settings

Optional later:

- Discover
- Insights
- Chat

## Main entities

### User

- id
- name
- email
- avatar
- preferences

### Book

- id
- title
- subtitle
- author
- ISBN
- cover_url
- publisher
- publication_date
- description
- language
- created_at
- updated_at

### Annotation

- id
- user_id
- book_id
- source_text
- normalized_text
- page_number
- chapter
- location
- source_type
- personal_note
- created_at
- updated_at

### AI Insight

- id
- annotation_id
- type
- prompt
- response
- model
- created_at

### Vocabulary Entry

- id
- annotation_id
- word
- definition
- contextual_definition
- part_of_speech
- pronunciation
- examples

### Tag

- id
- user_id
- name

### AnnotationTag

- annotation_id
- tag_id

### Integration

- id
- user_id
- provider
- access_token_reference
- metadata

Do not store raw third-party credentials insecurely.

---

# 8. DESIGN DIRECTION

The design should feel like a premium literary workspace rather than a conventional productivity SaaS.

Reference qualities:

- quiet,
- intellectual,
- warm,
- editorial,
- tactile,
- minimal,
- focused,
- sophisticated.

Avoid:

- excessive gradients,
- generic AI-dashboard aesthetics,
- too many cards,
- overly bright SaaS colors,
- dense analytics dashboards,
- gamification,
- noisy animations.

The interface should communicate:

> **“This is a place where ideas live.”**

---

# 9. VISUAL LANGUAGE

Use a restrained editorial system.

### Typography

Use a combination of:

- Serif display typography for book/literary moments.
- Highly legible sans-serif for UI.
- Monospace only for technical metadata when necessary.

Example direction:

- Display: Instrument Serif / DM Serif Display / Newsreader.
- UI: Inter / Geist / IBM Plex Sans.

Do not blindly use these fonts. Evaluate hierarchy and readability.

### Color

Prefer:

- warm off-white,
- paper-like backgrounds,
- ink-like text,
- subtle gray,
- muted accent color.

Dark mode should feel like:

> reading at night

rather than:

> developer dashboard.

### Surfaces

Use:

- subtle borders,
- very soft shadows,
- restrained corner radius,
- generous whitespace.

Avoid excessive floating cards.

---

# 10. KEY SCREEN DESIGN

## 10.1 Library

The library should immediately communicate:

> “These are the books I'm thinking about.”

Include:

- book grid,
- search,
- filters,
- recent activity,
- reading status,
- annotation count.

Book cards should be visually literary.

Avoid making them look like ecommerce product cards.

---

## 10.2 Book Detail

This is one of the most important screens.

Structure:

### Header

Book cover + metadata + actions.

### Primary content

A chronological or grouped stream of annotations.

Each annotation should visually resemble a beautiful digital marginal note.

Show:

- highlighted text,
- page/chapter,
- personal note,
- tags,
- AI insight indicator.

Actions:

- Explain
- Define
- Add note
- Edit
- Export
- Copy

---

# 11. CAPTURE EXPERIENCE

The capture interaction should be extremely fast.

Use a central capture action.

Possible options:

### Type

Textarea with book selection.

### Camera

Camera/image upload.

Flow:

`Photo → crop → OCR → extracted passage → correction → book → save`

### Voice

Press and hold or tap:

> “Capture this…”

Voice transcription appears live.

Then:

> “What book is this from?”

if the book cannot be inferred.

---

# 12. VOICE-FIRST UX

Voice interaction architecture:

`Microphone → speech-to-text → intent detection → action → AI response → optional text/audio response`

Use short conversational responses.

Example:

User:

> “What does this mean?”

System:

> “It’s basically saying that people often understand themselves through the things they avoid confronting.”

Then:

> “Want me to break down the sentence?”

The UI should always provide a visual transcript.

Never make voice the only way to use the product.

Voice should be:

- optional,
- fast,
- interruptible,
- context-aware.

---

# 13. PHOTO / OCR UX

This is a major differentiator.

Design the camera experience around books.

The user photographs a page.

The system should:

1. Detect page boundaries.
2. Correct perspective.
3. Improve contrast.
4. Run OCR.
5. Detect paragraphs.
6. Present extracted text.
7. Let the user select the exact paragraph.
8. Let them ask for meaning.
9. Save the result.

Do not automatically save OCR text without confirmation.

OCR confidence should be visible only when useful.

---

# 14. AI INTERACTION DESIGN

Avoid a giant generic “Ask AI” box.

Instead use contextual AI actions.

For selected text:

- Explain
- Simplify
- Define
- Analyze
- Contextualize
- Translate
- Give example
- Add reflection

Then allow:

> Ask anything about this passage…

AI responses should be tied to the source passage.

Display:

- source passage,
- AI answer,
- optional follow-up,
- save insight.

---

# 15. AI ARCHITECTURE

For V1 use a straightforward AI service abstraction.

Do NOT tightly couple the entire application to one provider.

Create an internal interface such as:

`AIProvider`

with methods conceptually similar to:

- explainText()
- simplifyText()
- defineWord()
- analyzePassage()
- generateEmbedding()
- transcribeAudio()

Then providers can be swapped.

Potential model stack:

- OpenAI for general reasoning and embeddings.
- Whisper or a hosted speech-to-text provider for voice.
- A reliable OCR engine such as Google Cloud Vision, AWS Textract, Azure Document Intelligence, or a specialized OCR provider.
- Dictionary API or lexical data source for dictionary functionality.

Select providers based on:

- latency,
- cost,
- accuracy,
- privacy,
- API reliability,
- language support.

Do not hard-code provider-specific logic into UI components.

---

# 16. RECOMMENDED TECH STACK

Use a modern TypeScript-first stack.

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand only where client state genuinely benefits from it
- Framer Motion for subtle motion

Why:

Next.js provides a strong full-stack React foundation.

TypeScript reduces integration mistakes.

Tailwind + shadcn/ui allows fast creation of a coherent design system.

TanStack Query handles server state cleanly.

Zustand should not become a global dumping ground.

---

## Backend

Start with Next.js server-side functionality for V1 where appropriate.

Use:

- Route Handlers / Server Actions
- PostgreSQL
- Prisma ORM

If the backend becomes independently scalable, extract services later.

Do not prematurely create microservices.

---

## Database

PostgreSQL.

Recommended extensions:

- pgvector for embeddings.
- Full-text search where useful.

Why:

The domain is highly relational:

User → Books → Annotations → AI Insights → Tags → Integrations.

Postgres also gives a clean path toward semantic retrieval.

---

## Storage

Use object storage for:

- uploaded book/page images,
- OCR source images,
- avatars,
- generated assets.

Possible:

- S3
- Cloudflare R2
- Supabase Storage

Choose one based on the deployment environment.

---

## Authentication

Use a mature authentication solution such as:

- Clerk
- Auth.js
- Supabase Auth

Prefer a solution that minimizes custom security code.

---

## Deployment

Potential default:

- Vercel for Next.js.
- Managed PostgreSQL.
- Object storage.
- Background jobs where required.

Do not introduce Kubernetes for V1.

---

# 17. BACKGROUND PROCESSING

OCR and AI tasks may be slow.

Do not make the UI wait unnecessarily.

Use a job architecture for:

- OCR.
- Embedding generation.
- Large AI processing.
- Export generation.

Possible tools:

- Inngest
- Trigger.dev
- BullMQ + Redis

For V1, choose the simplest reliable option.

---

# 18. SEARCH ARCHITECTURE

V1:

Use PostgreSQL full-text search for:

- book titles,
- authors,
- annotation text,
- notes,
- tags.

Then introduce hybrid search:

`keyword search + semantic vector search`

Eventually:

`query → intent detection → hybrid retrieval → reranking → response`

Example:

User:

> “Find that quote I saved about being afraid of becoming ordinary.”

Semantic retrieval should find relevant passages even if the exact word “ordinary” isn't present.

---

# 19. FUTURE CHATBOT ARCHITECTURE

Do not build the full chatbot in V1.

Design the data model so it becomes possible.

Future query:

> “What did I learn about loneliness from the books I've read this year?”

Pipeline:

`Voice/Text → Query Understanding → Retrieval → Reranking → Context Assembly → LLM → Answer + Source Citations`

Every AI answer should cite the user's saved passages.

Example:

> You saved three passages related to loneliness.

Then show the original book and passage.

The chatbot should never fabricate a quote.

---

# 20. NOTION + OBSIDIAN INTEGRATION

## Obsidian

Obsidian is fundamentally Markdown/file based.

Export structure could be:

`Books/Book Name.md`

with annotations represented as sections or blockquotes.

Example conceptual format:

```markdown
# The Book Title

## Annotation — Chapter 4

> Original passage

**Page:** 83

### My note

My personal interpretation...

### AI explanation

...

#theme/philosophy
```

Make the exporter deterministic and customizable.

Future:

- local vault sync,
- folder mapping,
- YAML frontmatter,
- backlinks.

## Notion

Create pages/databases through the Notion API.

Allow the user to map:

- Book
- Author
- Passage
- Personal note
- Tags
- AI insight

Never make integrations mandatory.

---

# 21. DATA PRIVACY

This product deals with potentially sensitive intellectual and personal notes.

Design privacy intentionally.

Requirements:

- User-owned data.
- Encryption in transit.
- Secure credential storage.
- Minimal third-party data sharing.
- Clear AI data policy.
- Ability to delete account and content.
- Avoid sending unnecessary metadata to AI providers.
- Do not train models on user content unless explicitly permitted by the provider/product policy.
- Make privacy settings understandable.

Book content may be copyrighted.

The product should be designed around **user-provided excerpts and annotations**, not unauthorized distribution of entire books.

Never build features intended to bypass DRM or reproduce copyrighted books at scale.

---

# 22. COPYRIGHT / CONTENT MODEL

The platform should store:

- user-generated notes,
- user-created annotations,
- short user-selected excerpts,
- OCR text supplied by the user,
- metadata from legitimate book metadata sources.

Do not make “upload an entire copyrighted book and ask anything” the core product assumption.

For AI context, prefer:

- user-selected passages,
- nearby user-provided text,
- user notes,
- public-domain material,
- appropriately licensed sources.

This keeps the product legally and ethically cleaner.

---

# 23. DESIGN SYSTEM COMPONENTS

Create reusable primitives.

### Core

- Button
- IconButton
- Input
- Textarea
- Select
- Dialog
- Drawer
- Popover
- Tooltip
- Toast

### Literary components

- BookCard
- BookCover
- BookHeader
- Highlight
- AnnotationCard
- PassageViewer
- QuoteBlock
- ChapterMarker
- VocabularyCard
- AIInsight
- PersonalNote
- Tag
- Timeline

### AI components

- AIActionBar
- AIResponse
- VoiceInput
- Transcript
- StreamingResponse
- SuggestedPrompt

### Capture components

- CaptureSheet
- CameraCapture
- OCRPreview
- TextSelection
- VoiceCapture

Build components compositionally.

Avoid page-specific one-off components where a reusable pattern exists.

---

# 24. MOTION DESIGN

Motion should reinforce comprehension.

Use Framer Motion selectively.

Examples:

- Book opens into detail view.
- Annotation appears with subtle fade/slide.
- AI response streams naturally.
- Voice capture has a subtle audio-reactive indicator.
- OCR text transitions into editable text.
- Search results update smoothly.

Avoid:

- excessive bouncing,
- constant floating animations,
- decorative motion,
- long transitions.

Animation should usually be fast and unobtrusive.

---

# 25. RESPONSIVE DESIGN

The product should be desktop-first but genuinely mobile usable.

Desktop:

- library browsing,
- annotation management,
- search,
- export.

Mobile:

- capture,
- camera,
- voice,
- quick lookup.

Design the capture experience especially well for mobile.

The ideal mobile flow should be:

`Open → Capture → Understand → Save`

in seconds.

---

# 26. ACCESSIBILITY

Follow strong accessibility defaults:

- keyboard navigation,
- semantic HTML,
- visible focus,
- proper labels,
- accessible dialogs,
- reduced motion support,
- sufficient contrast,
- screen reader-friendly interactions,
- captions/transcripts for voice.

Do not sacrifice accessibility for visual aesthetics.

---

# 27. IMPECCABLE DESIGN SKILL INTEGRATION

The implementation will use the **Impeccable** design skill inside Claude Code.

Treat Impeccable as the design quality-control layer.

Before implementing screens:

1. Establish the visual direction.
2. Define typography.
3. Define spacing.
4. Define color tokens.
5. Define component hierarchy.
6. Define interaction patterns.
7. Check responsive behavior.
8. Check accessibility.
9. Check visual consistency.

Use Impeccable to critique and improve the UI rather than blindly accepting the first implementation.

The design workflow should be:

`Product requirement → UX flow → visual direction → design system → implementation → Impeccable critique → refinement`

When asking Claude Code to implement UI, explicitly instruct it to use Impeccable's design principles and critique the resulting interface for:

- hierarchy,
- spacing,
- typography,
- visual noise,
- interaction quality,
- consistency,
- responsiveness,
- accessibility,
- unnecessary components,
- generic AI-SaaS patterns.

Do not let the product become a collection of default shadcn cards.

---

# 28. DESIGN PATTERNS

Use these patterns deliberately.

### Command pattern

For contextual actions:

`Explain`, `Define`, `Save`, `Export`.

### Strategy pattern

For AI providers:

`OpenAIProvider`, `OtherProvider`.

### Repository pattern

For data access if the backend becomes more complex.

### Adapter pattern

For:

- Notion,
- Obsidian,
- dictionary providers,
- OCR providers.

### Event-driven processing

For:

- OCR completion,
- embedding generation,
- export generation.

### Optimistic UI

For lightweight actions such as:

- saving tags,
- adding notes,
- updating annotations.

### Progressive disclosure

Don't show every AI feature immediately.

Reveal complexity when the user needs it.

---

# 29. API / SERVICE BOUNDARIES

Conceptually define services such as:

### Books

- createBook
- getBook
- searchBooks
- updateBook

### Annotations

- createAnnotation
- updateAnnotation
- deleteAnnotation
- listAnnotations

### Capture

- uploadImage
- runOCR
- saveCapture

### AI

- explainPassage
- defineWord
- analyzePassage

### Search

- searchLibrary
- semanticSearch

### Integrations

- connectNotion
- exportNotion
- exportObsidian

Keep these boundaries logical rather than creating microservices prematurely.

---

# 30. ERROR HANDLING

Every AI/OCR interaction should have graceful failure.

Examples:

OCR fails:

> “We couldn't read this page clearly. Try another photo or edit the text manually.”

AI fails:

> “The explanation couldn't be generated right now. Your passage is safely saved.”

Voice fails:

> “We couldn't hear that clearly. Try again or type it instead.”

Never lose captured user content because an AI request failed.

**Capture persistence should happen before expensive AI processing whenever possible.**

---

# 31. OBSERVABILITY

Track product events without collecting unnecessary private content.

Useful events:

- book_created
- annotation_created
- photo_capture_started
- ocr_completed
- ai_explanation_requested
- ai_explanation_completed
- voice_capture_used
- dictionary_lookup
- export_started
- export_completed

Measure:

- capture completion rate,
- OCR success rate,
- time from capture to save,
- AI latency,
- export success rate,
- retention around annotation creation.

Do not build a huge analytics system before product-market validation.

---

# 32. V1 IMPLEMENTATION PHASES

## Phase 0 — Product decisions

Resolve the interview questions in Section 39.

## Phase 1 — Foundation

Build:

- Next.js project.
- TypeScript.
- Tailwind.
- shadcn/ui.
- Auth.
- PostgreSQL.
- Prisma.
- Base design tokens.
- CI/CD.
- Error handling.

## Phase 2 — Library

Build:

- Add book.
- Book metadata.
- Library.
- Book detail.

## Phase 3 — Annotation engine

Build:

- Manual capture.
- Text selection.
- Annotation creation.
- Personal notes.
- Tags.

## Phase 4 — AI

Build:

- Explain.
- Simplify.
- Dictionary.
- Contextual actions.
- Streaming responses.

## Phase 5 — Camera/OCR

Build:

- Camera/upload.
- Crop.
- OCR.
- Correction.
- Passage selection.

## Phase 6 — Voice

Build:

- voice capture,
- transcription,
- contextual commands,
- visual transcript.

## Phase 7 — Search

Build:

- full-text search,
- filters,
- recent items.

## Phase 8 — Export

Build:

- Markdown,
- Obsidian-compatible export,
- Notion integration.

## Phase 9 — Quality

Run:

- accessibility audit,
- responsive audit,
- Impeccable design review,
- performance review,
- security review,
- AI hallucination testing,
- OCR edge-case testing.

---

# 33. TESTING STRATEGY

Use:

- unit tests for core domain logic,
- integration tests for APIs,
- Playwright for critical user journeys,
- component testing where valuable.

Critical E2E paths:

### Test A

Create book → capture quote → save → reopen book → find quote.

### Test B

Photo → OCR → correct text → explain → save.

### Test C

Voice → transcription → save annotation.

### Test D

Annotation → export Markdown → verify structure.

### Test E

Connect Notion → export → verify page.

### Test F

Search → retrieve annotation → open source book.

---

# 34. AI QUALITY REQUIREMENTS

AI must:

- distinguish source text from generated explanation,
- never modify the original quote silently,
- avoid inventing book context,
- state uncertainty,
- preserve user content,
- cite the selected passage,
- avoid pretending to know surrounding text it was not given.

For contextual explanations:

If the system only has one paragraph, do not imply access to the entire chapter.

Use language like:

> “Based on this passage…”

rather than:

> “The author is definitely saying…”

---

# 35. PERFORMANCE TARGETS

Aim for:

- instant-feeling navigation,
- fast library loading,
- optimistic saves,
- streaming AI output,
- background OCR processing,
- lazy loading for images,
- cached book metadata.

Do not let AI become the bottleneck for normal note-taking.

The user should be able to save a passage even when AI is unavailable.

---

# 36. PRODUCT NORTH STAR

The most important metric should not be:

- number of AI prompts,
- number of tokens consumed,
- number of pages generated.

A better north-star concept is:

> **Meaningful reading discoveries captured and successfully retrieved.**

Supporting metrics:

- weekly active readers,
- annotations per active reader,
- capture-to-save rate,
- repeat retrieval,
- export usage,
- voice usage,
- AI-assisted understanding rate.

---

# 37. FUTURE ROADMAP

## V1.1

- Better OCR.
- Better dictionary.
- Improved search.
- Keyboard shortcuts.
- Bulk tagging.

## V2

- Semantic search.
- Personal reading chatbot.
- “Ask my library.”
- Related passages.
- Automatic theme clustering.

## V3

- Voice-first conversational assistant.
- Reading memory.
- Spaced resurfacing.
- Personal knowledge graph.
- Reading insights.

## V4

Potential integrations:

- Kindle highlights where officially supported.
- Apple Books where supported.
- Readwise.
- Goodreads.
- Zotero.
- browser extension.
- mobile app.

---

# 38. BRAND / PRODUCT PERSONALITY

The product should feel:

- intelligent but not pretentious,
- literary but not academic,
- technological but not robotic,
- personal but not social-media-like,
- calm but not boring.

Voice:

> thoughtful friend who loves books

not:

> AI productivity assistant

---

# 39. PRODUCT INTERVIEW — QUESTIONS TO ANSWER BEFORE BUILDING

Before implementation, ask the founder/user these questions one at a time as a product interview.

Do NOT ask all questions in a giant form immediately.

The goal is to challenge assumptions and uncover product hooks.

## A. The core problem

1. What frustrates you most when you find a great line in a book today?
2. Where do you currently store highlights?
3. What do you do when you don't understand a paragraph?
4. Do you actually revisit your old highlights? If yes, when?
5. What would make you use this every week rather than once?
6. What existing product do you wish already solved this?

## B. The emotional hook

7. What feeling should someone get when they open their library?
8. Should the product feel more like a private journal, a library, or a knowledge base?
9. What would make someone say, “I can't imagine reading without this anymore”?
10. What is the magical 10-second interaction?

## C. Capture

11. Which capture method should feel fastest: voice, camera, paste, or typing?
12. When taking a photo, should the app automatically identify the book?
13. Should users be able to capture without first selecting a book?
14. How should the product handle an unknown book?
15. Should every annotation require a personal note?

## D. AI

16. What is more valuable: understanding a difficult passage or discovering related ideas?
17. Should AI explain passages neutrally or adapt to the reader's level?
18. Should users be able to choose “simple”, “deep”, “academic”, or “conversational” explanations?
19. Should AI challenge the user's interpretation?
20. Should AI remember previous conversations about a book?

## E. Voice

21. Should voice primarily be for capture or full conversation?
22. Should the AI speak answers back?
23. Should the user be able to interrupt the AI?
24. What should happen if the user says “save this” without explicitly saying which book?
25. Should voice commands work while the user is physically reading a book?

## F. Discovery

26. Should the home screen show recent discoveries or books?
27. Should the app proactively resurface old highlights?
28. Would you want:

> “You saved something similar six months ago.”

29. Would you want weekly reflections based on what you read?
30. Should the app identify recurring themes in your reading?

## G. Knowledge system

31. Should a book be treated as a folder, document, or knowledge graph?
32. Are tags useful or do you prefer automatic themes?
33. Do you want your own thoughts to be more prominent than AI-generated insights?
34. Should notes be atomic and linkable like Obsidian?
35. What does “personal knowledge” mean to you?

## H. Notion / Obsidian

36. Which is more important: Notion or Obsidian?
37. Should sync be one-way or bidirectional?
38. If the same note is edited in both places, which system wins?
39. Should exports preserve backlinks?
40. Should the user own a clean Markdown representation of everything?

## I. Social layer

41. Should this ever be social?
42. Would you want to share an annotation with another reader?
43. Should there be public reading collections?
44. Would seeing other people's interpretations improve the product or destroy its intimacy?
45. Could there eventually be book-specific discussion spaces?

## J. Business

46. What would you personally pay for?
47. Which feature would justify a subscription?
48. Should basic capture remain free forever?
49. Should AI usage be metered?
50. Would you trust the product more if it had a local/offline mode?

## K. Privacy / trust

51. How private should your annotations be?
52. Would you allow your notes to be processed by AI providers?
53. Would you want a “local-only” mode?
54. Should users be able to export their entire library at any time?
55. What would make you stop trusting the product?

## L. The hard question

56. If we could only build ONE magical feature in V1, what should it be?

57. If we removed AI completely, would the product still be useful?

58. If the answer is no, are we building a genuinely useful reading product or merely wrapping an LLM around notes?

59. What is the smallest experience that proves people want this?

60. What would make you personally use this for the next 5 years?

---

# 40. FOUNDER DECISION FRAMEWORK

After answering the interview, summarize the decisions into:

### Problem

One sentence.

### Target user

One primary persona.

### Core loop

One five-step loop.

### Magic moment

One interaction.

### V1 promise

One sentence beginning:

> “Whenever I…”

### Non-goals

Maximum five.

### Success metric

One primary metric.

### Differentiator

Why this instead of:

- Notion,
- Obsidian,
- Readwise,
- Kindle,
- ChatGPT,
- a dictionary?

---

# 41. CLAUDE CODE EXECUTION INSTRUCTIONS

When implementing this product:

1. Read this entire specification before writing code.
2. Ask the founder interview questions before making irreversible product assumptions.
3. Summarize the answers into a product decision document inside the same project context.
4. Create the design system before building individual screens.
5. Use the Impeccable skill for visual critique and refinement.
6. Build the smallest complete vertical slice first.
7. Avoid premature abstractions.
8. Avoid microservices for V1.
9. Keep AI provider integrations behind interfaces.
10. Keep OCR provider integrations behind interfaces.
11. Keep export providers behind adapters.
12. Make user data persistent before adding AI processing.
13. Never allow AI failures to destroy captured content.
14. Write tests for critical workflows.
15. Verify mobile and desktop experiences.
16. Run accessibility checks.
17. Review the interface for generic SaaS patterns.
18. Prefer simple architecture with clean boundaries.
19. Document important technical decisions.
20. Do not implement speculative features until the core loop is excellent.

---

# 42. FIRST BUILD COMMAND FOR CLAUDE CODE

Start by acting as a senior product designer + staff full-stack engineer.

Do NOT immediately start coding.

First:

1. Read this specification.
2. Conduct the founder interview from Section 39.
3. Identify contradictions and unresolved product decisions.
4. Propose the smallest compelling V1.
5. Define the information architecture.
6. Define the design system.
7. Define the database schema.
8. Define the service boundaries.
9. Define the first vertical slice.
10. Only then begin implementation.

After the interview, produce a concise implementation proposal and wait for approval before making major architectural commitments.

The implementation priority is:

> **Capture quality > annotation quality > understanding quality > retrieval quality > integrations > advanced AI.**

The product should be useful before it is intelligent.

The intelligence should make the product dramatically better rather than compensate for a weak foundation.

---

# 43. FINAL PRODUCT TEST

Before calling V1 complete, ask:

> Can a reader photograph a paragraph from a physical book, understand it, save it with context, find it again later, and export it to their knowledge system without friction?

If yes, the core product works.

Then ask:

> Does the product feel like the natural digital memory layer for everything I discover while reading?

If yes, the product has the foundation for becoming the reader's long-term knowledge companion.

