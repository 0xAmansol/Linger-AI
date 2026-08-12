"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-card border border-border bg-paper-raised text-ink shadow-raised font-sans",
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
