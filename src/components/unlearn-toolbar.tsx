"use client";

import { Toolbar, ToolbarButton, ToolbarSeparator } from "@equal-lens/brand";
import { useUnlearnTool, unlearnTool } from "@/lib/unlearn-tool";

// The path-world tool dock — the brand UN/RE toolbar. RESPONSIVE: full labels on web (≥640px),
// icon-only on mobile. Browse = travel + play; Unlearn (UN) smudges a myth; Relearn (RE) reveals
// the truth. Active tool = brand yellow.
export function UnlearnToolbar() {
  const { tool, hide } = useUnlearnTool();
  return (
    <Toolbar dock className="tb-pill">
      <ToolbarButton active={tool === "none"} onClick={() => unlearnTool.setTool("none")} title="Browse" aria-label="Browse">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
          <path d="M5 2 L5 20 L10 15 L13.5 22 L16 21 L12.5 14 L19 14 Z" />
        </svg>
        <span className="tb-label">Browse</span>
      </ToolbarButton>
      <ToolbarButton active={tool === "eraser"} onClick={() => unlearnTool.setTool("eraser")} title="Unlearn a myth" aria-label="Unlearn">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mascots/un.svg" alt="" className="tb-mascot" draggable={false} />
        <span className="tb-label">Unlearn</span>
      </ToolbarButton>
      <ToolbarButton active={tool === "pen"} onClick={() => unlearnTool.setTool("pen")} title="Relearn the truth" aria-label="Relearn">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mascots/re.svg" alt="" className="tb-mascot" draggable={false} />
        <span className="tb-label">Relearn</span>
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton active={hide} onClick={() => unlearnTool.toggleHide()} title={hide ? "Show notes" : "Hide notes"} aria-label="Hide notes">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </ToolbarButton>
      <ToolbarButton onClick={() => unlearnTool.reset()} title="Reset the myths" aria-label="Reset">
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span className="tb-label">reset</span>
      </ToolbarButton>
    </Toolbar>
  );
}
