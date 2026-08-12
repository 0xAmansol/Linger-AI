"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag } from "@/components/ui/tag";
import { setAnnotationTags } from "@/lib/actions/annotations";

export function TagEditor({
  annotationId,
  tags,
}: {
  annotationId: string;
  tags: string[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(tags.join(", "));
  const [pending, startTransition] = useTransition();

  function handleSave() {
    const names = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    startTransition(async () => {
      await setAnnotationTags(annotationId, names);
      setOpen(false);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-1.5 text-ink-faint">
            <Plus className="size-3" />
            {tags.length === 0 ? "Add tags" : ""}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
            Tags
          </label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="comma, separated, tags"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={pending}>
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
