"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, Loader2, Type } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createAnnotation } from "@/lib/actions/annotations";
import { listBooksForSelect } from "@/lib/actions/books";
import { runOCR } from "@/lib/actions/ocr";
import { cn } from "@/lib/utils";
import type { CaptureSource } from "@/generated/prisma/client";

type Mode = "type" | "photo";

interface BookOption {
  id: string;
  title: string;
  author: string;
}

export function CaptureSheet({
  open,
  onOpenChange,
  bookId: fixedBookId,
  bookTitle: fixedBookTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass these when capture is launched from a book's own page, so the
   * book is fixed instead of asking the reader to pick one. */
  bookId?: string;
  bookTitle?: string;
}) {
  const [mode, setMode] = useState<Mode>("type");
  const [pending, startTransition] = useTransition();
  const [pasted, setPasted] = useState(false);

  const [books, setBooks] = useState<BookOption[] | null>(fixedBookId ? [] : null);
  const [bookId, setBookId] = useState(fixedBookId ?? "");

  const [passage, setPassage] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [chapter, setChapter] = useState("");
  const [personalNote, setPersonalNote] = useState("");

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<"idle" | "loading" | "error">("idle");
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !fixedBookId && books === null) {
      listBooksForSelect().then(setBooks);
    }
  }, [open, fixedBookId, books]);

  function reset() {
    setMode("type");
    setPasted(false);
    setPassage("");
    setPageNumber("");
    setChapter("");
    setPersonalNote("");
    setImageDataUrl(null);
    setOcrStatus("idle");
    setOcrError(null);
    setParagraphs([]);
    if (!fixedBookId) setBookId("");
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    setImageDataUrl(dataUrl);
    setOcrStatus("loading");
    setOcrError(null);

    const base64 = dataUrl.split(",")[1] ?? "";
    const result = await runOCR(base64, file.type);
    if (result.ok) {
      setOcrStatus("idle");
      setPassage(result.data.text);
      setParagraphs(result.data.paragraphs);
    } else {
      setOcrStatus("error");
      setOcrError(result.error);
    }
  }

  function handleSave() {
    if (!bookId) {
      toast.error("Choose which book this is from.");
      return;
    }
    if (!passage.trim()) {
      toast.error("Nothing to save yet.");
      return;
    }

    const sourceType: CaptureSource = mode === "photo" ? "CAMERA" : pasted ? "PASTE" : "MANUAL";

    startTransition(async () => {
      try {
        await createAnnotation({
          bookId,
          sourceText: passage,
          pageNumber: pageNumber ? Number(pageNumber) : null,
          chapter: chapter || null,
          sourceType,
          sourceImageUrl: mode === "photo" ? imageDataUrl : null,
          personalNote: personalNote || null,
        });
        toast.success("Captured");
        handleOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Couldn't save that — your text is still here, try again."
        );
      }
    });
  }

  const bookLabel = fixedBookId
    ? fixedBookTitle
    : books?.find((b) => b.id === bookId)?.title;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Capture a passage</DialogTitle>
          <DialogDescription>
            {fixedBookId ? `From ${fixedBookTitle}` : "Type it, paste it, or photograph the page."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-1 rounded-control border border-border bg-paper-sunken p-1">
            <ModeButton active={mode === "type"} onClick={() => setMode("type")} icon={Type} label="Type or paste" />
            <ModeButton active={mode === "photo"} onClick={() => setMode("photo")} icon={Camera} label="Photograph" />
          </div>

          {mode === "photo" && (
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              {imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- user-captured photo, not an optimizable asset
                <img
                  src={imageDataUrl}
                  alt="Captured page"
                  className="max-h-48 w-full rounded-control border border-border object-cover"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 rounded-control border border-dashed border-border-strong py-8 text-ink-muted transition-colors hover:border-accent hover:text-ink"
                >
                  <Camera className="size-6" strokeWidth={1.5} />
                  <span className="text-sm">Take or choose a photo of the page</span>
                </button>
              )}
              {imageDataUrl && (
                <Button variant="ghost" size="sm" className="self-start" onClick={() => fileInputRef.current?.click()}>
                  Retake
                </Button>
              )}
              {ocrStatus === "loading" && (
                <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                  <Loader2 className="size-3.5 animate-spin" />
                  Reading the page…
                </p>
              )}
              {ocrStatus === "error" && (
                <p className="text-sm text-danger">{ocrError} You can still edit the text below by hand.</p>
              )}
              {paragraphs.length > 1 && (
                <div className="flex flex-col gap-1">
                  <Label>Pick the exact paragraph</Label>
                  <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
                    {paragraphs.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPassage(p)}
                        className={cn(
                          "rounded-control border px-2.5 py-1.5 text-left text-sm transition-colors",
                          passage === p
                            ? "border-accent bg-accent/10 text-ink"
                            : "border-border text-ink-muted hover:border-border-strong"
                        )}
                      >
                        {p.length > 120 ? `${p.slice(0, 120)}…` : p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="passage">{mode === "photo" ? "Extracted text — correct anything OCR missed" : "Passage"}</Label>
            <Textarea
              id="passage"
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              onPaste={() => setPasted(true)}
              placeholder="The line that stopped you…"
              rows={4}
              autoFocus={mode === "type"}
            />
          </div>

          {!fixedBookId && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="book">Book</Label>
              {books && books.length === 0 ? (
                <p className="text-sm text-ink-muted">Add a book to your library first.</p>
              ) : (
                <Select value={bookId} onValueChange={setBookId}>
                  <SelectTrigger id="book">
                    <SelectValue placeholder="Which book is this from?">{bookLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {books?.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title} — {b.author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="chapter">Chapter</Label>
              <Input id="chapter" value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Optional" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="page">Page</Label>
              <Input
                id="page"
                type="number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note">Your note</Label>
            <Textarea
              id="note"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Why did this stick with you? (optional)"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={pending || !passage.trim()}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Type;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-control py-1.5 text-sm font-medium transition-colors",
        active ? "bg-paper-raised text-ink shadow-card" : "text-ink-muted hover:text-ink"
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}
