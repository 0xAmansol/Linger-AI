import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ReadingStatus } from "@/generated/prisma/client";

const SHELVES: { value: ReadingStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All books" },
  { value: "READING", label: "Reading" },
  { value: "WANT_TO_READ", label: "Want to read" },
  { value: "FINISHED", label: "Finished" },
  { value: "ABANDONED", label: "Abandoned" },
];

export function ShelfRail({
  active,
  counts,
}: {
  active: ReadingStatus | "ALL";
  counts: Record<string, number>;
}) {
  return (
    <nav
      aria-label="Filter by shelf"
      className="flex shrink-0 gap-1 overflow-x-auto pb-2 md:w-44 md:flex-col md:overflow-visible md:border-r md:border-border md:pb-0 md:pr-3"
    >
      {SHELVES.map((shelf) => {
        const isActive = shelf.value === active;
        const count = counts[shelf.value] ?? 0;
        return (
          <Link
            key={shelf.value}
            href={shelf.value === "ALL" ? "/" : `/?status=${shelf.value}`}
            className={cn(
              "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-control px-3 py-1.5 text-sm transition-colors md:whitespace-normal",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-ink-muted hover:bg-paper-sunken hover:text-ink"
            )}
          >
            <span>{shelf.label}</span>
            <span
              className={cn(
                "font-mono text-[11px]",
                isActive ? "text-accent-foreground/70" : "text-ink-faint"
              )}
              data-numeric
            >
              {count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
