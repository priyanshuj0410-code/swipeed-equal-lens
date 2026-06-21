"use client";

import { Toolbar, ToolbarButton, ToolbarSeparator } from "@equal-lens/brand";
import { useUnlearnTool, unlearnTool } from "@/lib/unlearn-tool";

// The path-world tool dock (replaces the old "Tap a node to start" footer). Browse = travel + play
// normally; Unlearn (UN eraser) smudges a myth note; Relearn (RE pen) reveals the truth.
export function UnlearnToolbar() {
  const { tool, hide } = useUnlearnTool();
  return (
    <Toolbar dock style={{ zIndex: 45, maxWidth: "96vw", overflowX: "auto" }}>
      <ToolbarButton active={tool === "none"} onClick={() => unlearnTool.setTool("none")} title="Browse">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
          <path d="M5 2 L5 20 L10 15 L13.5 22 L16 21 L12.5 14 L19 14 Z" />
        </svg>
        <span>Browse</span>
      </ToolbarButton>
      <ToolbarButton active={tool === "eraser"} onClick={() => unlearnTool.setTool("eraser")} title="Unlearn a myth">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mascots/un.svg" alt="" style={{ height: 24, width: "auto" }} />
        <span>Unlearn</span>
      </ToolbarButton>
      <ToolbarButton active={tool === "pen"} onClick={() => unlearnTool.setTool("pen")} title="Relearn the truth">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mascots/re.svg" alt="" style={{ height: 24, width: "auto" }} />
        <span>Relearn</span>
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton onClick={() => unlearnTool.toggleHide()} title={hide ? "Show notes" : "Hide notes"}>
        {hide ? "Show" : "Hide"}
      </ToolbarButton>
      <ToolbarButton onClick={() => unlearnTool.reset()} title="Reset the myths">
        reset
      </ToolbarButton>
    </Toolbar>
  );
}
