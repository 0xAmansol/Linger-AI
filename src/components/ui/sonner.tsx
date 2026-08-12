"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      // Sonner sets its toast background via the --normal-bg/--normal-border/
      // --normal-text custom properties it defines per theme (light/dark),
      // which win the cascade over a `classNames.toast` background utility —
      // so it has to be retinted through those variables, not Tailwind classes.
      style={
        {
          "--normal-bg": "var(--paper-raised)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--ink)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "rounded-card shadow-raised font-sans",
          description: "text-ink-muted",
          actionButton: "bg-accent text-accent-foreground rounded-control",
          cancelButton: "bg-paper-sunken text-ink-muted rounded-control",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
