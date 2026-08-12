"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Sparkle } from "lucide-react";
import { toast } from "sonner";

import { AIResponse } from "@/components/ai-response";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { defineWordInAnnotation, generateAnalysis, generateExplanation } from "@/lib/actions/ai";
import type { ExplanationLevel, InsightType } from "@/generated/prisma/client";

const LEVELS: { value: ExplanationLevel; label: string }[] = [
  { value: "SIMPLE", label: "Simple" },
  { value: "DEEP", label: "Deep" },
  { value: "ACADEMIC", label: "Academic" },
  { value: "CONVERSATIONAL", label: "Conversational" },
];

type AnalyzeOnlyType = Exclude<InsightType, "EXPLAIN" | "SIMPLIFY" | "FOLLOW_UP">;

const MORE_ACTIONS: { type: AnalyzeOnlyType; label: string }[] = [
  { type: "CONTEXT", label: "Explain the context" },
  { type: "METAPHOR", label: "Explain the metaphor" },
  { type: "PHILOSOPHICAL", label: "Draw out the idea" },
  { type: "EXAMPLE", label: "Give an example" },
  { type: "TRANSLATE", label: "Put it plainly" },
];

interface LiveInsight {
  id: string;
  type: string;
  prompt?: string;
  response: string;
}

export function AIActionBar({
  annotationId,
  sourceText,
  hasInsights,
  knownInsightIds,
}: {
  annotationId: string;
  sourceText: string;
  hasInsights: boolean;
  /** Ids already rendered from the server-refreshed `insights` prop above
   * this bar — once a locally-generated insight lands there too (after the
   * Server Action's revalidatePath refreshes this page), it's dropped here
   * so it doesn't render twice. */
  knownInsightIds: string[];
}) {
  const [pending, startTransition] = useTransition();
  const [live, setLive] = useState<LiveInsight[]>([]);
  const [levelPopoverMode, setLevelPopoverMode] = useState<"EXPLAIN" | "SIMPLIFY" | null>(null);
  const [defineOpen, setDefineOpen] = useState(false);
  const [word, setWord] = useState("");
  const [followUp, setFollowUp] = useState("");

  function runExplain(mode: "EXPLAIN" | "SIMPLIFY", level: ExplanationLevel) {
    setLevelPopoverMode(null);
    startTransition(async () => {
      const result = await generateExplanation(annotationId, mode, level);
      if (result.ok) {
        setLive((l) => [...l, { id: result.data.id, type: mode, response: result.data.response }]);
      } else {
        toast.error(result.error);
      }
    });
  }

  function runAnalysis(type: Exclude<InsightType, "EXPLAIN" | "SIMPLIFY" | "FOLLOW_UP">) {
    startTransition(async () => {
      const result = await generateAnalysis(annotationId, type);
      if (result.ok) {
        setLive((l) => [...l, { id: result.data.id, type, response: result.data.response }]);
      } else {
        toast.error(result.error);
      }
    });
  }

  function runFollowUp() {
    const question = followUp.trim();
    if (!question) return;
    setFollowUp("");
    startTransition(async () => {
      const result = await generateAnalysis(annotationId, "FOLLOW_UP", { followUpQuestion: question });
      if (result.ok) {
        setLive((l) => [...l, { id: result.data.id, type: "FOLLOW_UP", prompt: question, response: result.data.response }]);
      } else {
        toast.error(result.error);
      }
    });
  }

  function runDefine() {
    const w = word.trim();
    if (!w) return;
    setDefineOpen(false);
    startTransition(async () => {
      const result = await defineWordInAnnotation(annotationId, w, sourceText);
      if (result.ok) {
        toast.success(`Defined "${w}"`, { description: result.data.contextualDefinition });
      } else {
        toast.error(result.error);
      }
      setWord("");
    });
  }

  const visibleLive = live.filter((insight) => !knownInsightIds.includes(insight.id));

  return (
    <div className="flex flex-col gap-2">
      {visibleLive.map((insight) => (
        <AIResponse key={insight.id} type={insight.type} prompt={insight.prompt} response={insight.response} />
      ))}

      <div className="flex flex-wrap items-center gap-1.5">
        <Popover
          open={levelPopoverMode === "EXPLAIN"}
          onOpenChange={(o) => setLevelPopoverMode(o ? "EXPLAIN" : null)}
        >
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              <Sparkle />
              Explain
            </Button>
          </PopoverTrigger>
          <LevelPopoverContent onPick={(level) => runExplain("EXPLAIN", level)} />
        </Popover>

        <Popover
          open={levelPopoverMode === "SIMPLIFY"}
          onOpenChange={(o) => setLevelPopoverMode(o ? "SIMPLIFY" : null)}
        >
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              Simplify
            </Button>
          </PopoverTrigger>
          <LevelPopoverContent onPick={(level) => runExplain("SIMPLIFY", level)} />
        </Popover>

        <Popover open={defineOpen} onOpenChange={setDefineOpen}>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              Define
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
              Word to define
            </label>
            <Input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder='e.g. "ineffable"'
              onKeyDown={(e) => e.key === "Enter" && runDefine()}
              autoFocus
            />
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={runDefine} disabled={pending}>
                Define
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              More
              <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {MORE_ACTIONS.map((action) => (
              <DropdownMenuItem key={action.type} onSelect={() => runAnalysis(action.type)}>
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(hasInsights || live.length > 0) && (
        <div className="flex items-center gap-1.5 pt-1">
          <Input
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            placeholder="Ask anything about this passage…"
            onKeyDown={(e) => e.key === "Enter" && runFollowUp()}
            className="h-8 min-w-0 flex-1 text-sm"
          />
          <Button size="sm" variant="ghost" onClick={runFollowUp} disabled={pending || !followUp.trim()}>
            Ask
          </Button>
        </div>
      )}
    </div>
  );
}

function LevelPopoverContent({ onPick }: { onPick: (level: ExplanationLevel) => void }) {
  return (
    <PopoverContent className="w-56">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">
        Explanation level
      </p>
      <div className="flex flex-col gap-1">
        {LEVELS.map((level) => (
          <Button
            key={level.value}
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => onPick(level.value)}
          >
            {level.label}
          </Button>
        ))}
      </div>
    </PopoverContent>
  );
}
