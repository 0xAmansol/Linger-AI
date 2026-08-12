"use client";

import { useTransition } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateReadingStatus } from "@/lib/actions/books";
import type { ReadingStatus } from "@/generated/prisma/client";

const OPTIONS: { value: ReadingStatus; label: string }[] = [
  { value: "READING", label: "Reading" },
  { value: "WANT_TO_READ", label: "Want to read" },
  { value: "FINISHED", label: "Finished" },
  { value: "ABANDONED", label: "Abandoned" },
];

export function ReadingStatusSelect({
  bookId,
  status,
}: {
  bookId: string;
  status: ReadingStatus;
}) {
  const [, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      onValueChange={(value) =>
        startTransition(() => updateReadingStatus(bookId, value as ReadingStatus))
      }
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
