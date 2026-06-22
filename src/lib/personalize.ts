// Warmly thread the learner's name (captured at onboarding) into mascot copy. A name + "!" is a safe
// vocative before any sentence, so "Aanya! Welcome to the Body Lab!" reads naturally regardless of how the
// line starts. An empty/missing name leaves the copy untouched — nothing is ever "Hi !".

// First name, capitalised (handles a lowercase or multi-word entry like "aanya rao" → "Aanya").
export function firstName(name: string | undefined): string {
  const n = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : "";
}

// Prefix a line with a friendly vocative ("Aanya! …") when a name is set; otherwise return it unchanged.
export function greetWithName(text: string, name: string | undefined): string {
  const fn = firstName(name);
  return fn ? `${fn}! ${text}` : text;
}
