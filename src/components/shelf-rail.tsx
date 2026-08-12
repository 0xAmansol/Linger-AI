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

// Staggered indent per row — like a dictionary's thumb-index tabs, each cut
// to a different depth so every tab stays visible along the fore-edge. The
// active shelf resets to full width, reading as the tab currently pulled out.
const DESKTOP_INDENT = ["md:ml-0", "md:ml-2", "md:ml-3", "md:ml-4", "md:ml-5"];

export function ShelfRail({
  active,
  counts,
  basePath = "/library",
}: {
  active: ReadingStatus | "ALL";
  counts: Record<string, number>;
  basePath?: string;
}) {
  return (
    <nav
      aria-label="Filter by shelf"
      className="flex shrink-0 gap-1 overflow-x-auto pb-2 pr-4 md:w-44 md:flex-col md:gap-0.5 md:overflow-visible md:border-r md:border-border md:pb-0 md:pr-0"
    >
      {SHELVES.map((shelf, index) => {
        const isActive = shelf.value === active;
        const count = counts[shelf.value] ?? 0;
        return (
          <Link
            key={shelf.value}
            href={shelf.value === "ALL" ? basePath : `${basePath}?status=${shelf.value}`}
            className={cn(
              "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-control px-3 py-1.5 text-sm transition-[margin,background-color,color] md:whitespace-normal md:rounded-r-none md:rounded-l-card md:border md:border-r-0",
              isActive ? "md:ml-0" : DESKTOP_INDENT[index],
              isActive
                ? "bg-accent text-accent-foreground md:border-accent"
                : "border-transparent text-ink-muted hover:bg-paper-sunken hover:text-ink"
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
