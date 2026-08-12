"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { CaptureSheet } from "@/components/capture-sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CaptureButton({
  bookId,
  bookTitle,
}: {
  bookId?: string;
  bookTitle?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 z-40 size-12 rounded-full shadow-raised"
            onClick={() => setOpen(true)}
            aria-label="Capture a passage"
          >
            <Plus className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Capture a passage</TooltipContent>
      </Tooltip>
      <CaptureSheet open={open} onOpenChange={setOpen} bookId={bookId} bookTitle={bookTitle} />
    </>
  );
}
