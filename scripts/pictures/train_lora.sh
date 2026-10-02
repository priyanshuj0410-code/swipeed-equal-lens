#!/usr/bin/env bash
# Train one picture LoRA with mflux-train (SWED-112), resuming from the newest checkpoint after a Metal GPU timeout.
#   scripts/pictures/train_lora.sh <name> [<name> ...]     names: characters, comic-style
# Configs live in scripts/pictures/lora/train-<name>.json; runs, checkpoints and previews go to .forge/pictures/lora/runs.
# On this Mac (M4, 24 GB) a step takes about 18 s at 384 px with 8-bit weights; 512 px overflows memory (80 to 110 s).
HERE="$(cd "$(dirname "$0")" && pwd)"
for name in "$@"; do
  cfg="$HERE/lora/train-$name.json"
  out=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1]))['checkpoint']['output_path'])" "$cfg")
  for attempt in 1 2 3 4 5; do
    last=$(ls -t "$out"/checkpoints/*_checkpoint.zip 2>/dev/null | head -1)
    echo "== $name attempt $attempt ${last:+(resume $last)}"
    if [ -n "$last" ]; then ~/.local/bin/mflux-train --resume "$last" && break
    else ~/.local/bin/mflux-train --config "$cfg" && break; fi
  done
  echo "== $name finished"
done
