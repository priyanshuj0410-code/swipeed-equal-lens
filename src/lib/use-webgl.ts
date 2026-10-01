import { useSyncExternalStore } from "react";

// null while hydrating (callers render 3D optimistically), then whether this browser can draw WebGL
let detected: boolean | undefined;

function detect(): boolean {
  if (detected === undefined) {
    try {
      const c = document.createElement("canvas");
      detected = !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      detected = false;
    }
  }
  return detected;
}

const subscribe = () => () => {};

export function useWebgl(): boolean | null {
  return useSyncExternalStore(subscribe, detect, () => null);
}
