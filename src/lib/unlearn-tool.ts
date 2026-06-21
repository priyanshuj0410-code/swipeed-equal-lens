"use client";

import { useSyncExternalStore } from "react";

// Shared Unlearn/Relearn tool state for the path world — read by the toolbar (page chrome) and the
// interactive myth notes (inside the R3F scene), without prop-drilling through PathScene.
export type UnlearnToolName = "none" | "eraser" | "pen";

type State = { tool: UnlearnToolName; hide: boolean; resetSeq: number };
let state: State = { tool: "none", hide: false, resetSeq: 0 };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const unlearnTool = {
  get: () => state,
  setTool: (tool: UnlearnToolName) => {
    if (state.tool !== tool) {
      state = { ...state, tool };
      emit();
    }
  },
  toggleHide: () => {
    state = { ...state, hide: !state.hide };
    emit();
  },
  reset: () => {
    state = { ...state, resetSeq: state.resetSeq + 1 };
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useUnlearnTool(): State {
  return useSyncExternalStore(unlearnTool.subscribe, unlearnTool.get, unlearnTool.get);
}
