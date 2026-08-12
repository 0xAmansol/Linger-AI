"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { exportBookToObsidian } from "@/lib/actions/export";

export function ExportButton({ bookId }: { bookId: string }) {
  const [pending, startTransition] = useTransition();

  function handleExport() {
    startTransition(async () => {
      const result = await exportBookToObsidian(bookId);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      const blob = new Blob([result.data.content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Obsidian vaults use a flat filename on import; the `Books/` prefix
      // in obsidianFilename() documents where it belongs once dropped into
      // a vault, not a path the browser can write to directly.
      a.download = result.data.filename.split("/").pop() ?? "export.md";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Exported Markdown for Obsidian");
    });
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} disabled={pending}>
      <Download />
      {pending ? "Exporting…" : "Export"}
    </Button>
  );
}
