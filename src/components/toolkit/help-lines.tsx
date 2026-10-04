"use client";

import { Phone, ExternalLink } from "lucide-react";
import { helpLinesFor } from "@/content/help";

// The help sheet's rows of real services, shared by the help sheet and the Help Map's helplines step so the
// two can never list different numbers (SWED-128).
export function HelpLines({ entryAgeGate }: { entryAgeGate?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {helpLinesFor(entryAgeGate).map((line) => (
        <a key={line.href + line.detail} href={line.href} target={line.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="glass-card flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-[12px]">
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{line.name}</span>
            <span className="text-xs text-foreground/60">{line.detail}</span>
          </span>
          {line.href.startsWith("tel:") ? <Phone className="size-4 shrink-0 text-foreground/70" aria-hidden /> : <ExternalLink className="size-4 shrink-0 text-foreground/70" aria-hidden />}
        </a>
      ))}
    </div>
  );
}
