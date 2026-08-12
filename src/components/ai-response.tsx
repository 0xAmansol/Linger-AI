import { Sparkle } from "lucide-react";

const TYPE_LABEL: Record<string, string> = {
  EXPLAIN: "Explained",
  SIMPLIFY: "Simplified",
  CONTEXT: "Context",
  METAPHOR: "Metaphor",
  PHILOSOPHICAL: "The idea",
  EXAMPLE: "Example",
  TRANSLATE: "In plain English",
  FOLLOW_UP: "Answered",
};

export function AIResponse({
  type,
  prompt,
  response,
}: {
  type: string;
  prompt?: string;
  response: string;
}) {
  return (
    <div className="rounded-control border border-border bg-paper-sunken px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-accent-muted">
        <Sparkle className="size-3" />
        {type === "FOLLOW_UP" && prompt ? `“${prompt}”` : TYPE_LABEL[type] ?? type}
      </div>
      <p className="text-sm leading-relaxed text-ink">{response}</p>
    </div>
  );
}
