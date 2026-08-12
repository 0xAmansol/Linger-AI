"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updatePersonalNote } from "@/lib/actions/annotations";

export function PersonalNote({
  annotationId,
  note,
}: {
  annotationId: string;
  note: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(note ?? "");
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updatePersonalNote(annotationId, value);
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Why did this stick with you?"
          rows={2}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-auto self-start px-0 text-ink-faint hover:bg-transparent hover:text-ink-muted"
        onClick={() => setEditing(true)}
      >
        + Add a note
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="group/note flex items-start gap-1.5 text-left text-sm text-ink-muted"
    >
      <p className="leading-relaxed">{note}</p>
      <Pencil className="mt-1 size-3 shrink-0 opacity-0 transition-opacity group-hover/note:opacity-100" />
    </button>
  );
}
