"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF, Clone } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Flag, Flame, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Card as GameCard, DeckSummary, Flag as FlagType } from "@/lib/types";
import { cardPoints, POINTS } from "@/lib/scoring";
import { DECK_BY_ID } from "@/content/decks";
import { celebrate } from "@/lib/confetti";
import { useProfile } from "@/lib/store";

type Labels = { left: string; right: string };
type Props = {
  cards: GameCard[];
  deckId: DeckSummary["deckId"];
  mode?: "score" | "review";
  onComplete: (summary: DeckSummary) => void;
  labels?: Labels;
  backHref?: string;
  backLabel?: string;
};

const THOUGHTFUL_MS = 1200;
const EXIT_MS = 380;
const CARD_Y = 3.5;

function vibrate(p: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(p);
    } catch {
      /* unsupported */
    }
  }
}

// --- card face drawn to a transparent canvas -> texture sits on the glass card ----------
const C = { text: "#23202a", muted: "#5b6470", primary: "#3a5bd6", green: "#1f8f4e", red: "#cf4338" };

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function makeCardTexture(card: GameCard, phase: "play" | "reveal", correct: boolean, points: number, L: Labels) {
  const W = 540;
  const H = 720;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  const font = (s: number, w = 700) => `${w} ${s}px ui-rounded, "Segoe UI", system-ui, sans-serif`;

  // frosted-glass panel: translucent white + top sheen + bright hairline border
  ctx.fillStyle = "rgba(255,255,255,0.30)";
  roundRect(ctx, 0, 0, W, H, 46);
  ctx.fill();
  const sheen = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  sheen.addColorStop(0, "rgba(255,255,255,0.34)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  roundRect(ctx, 0, 0, W, H, 46);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2.5;
  roundRect(ctx, 1.5, 1.5, W - 3, H - 3, 45);
  ctx.stroke();
  const pad = 46;

  if (phase === "play") {
    ctx.font = font(22, 700);
    const tag = card.context_tag.toUpperCase();
    const tw = ctx.measureText(tag).width;
    ctx.fillStyle = "rgba(58,91,214,0.16)";
    roundRect(ctx, pad, pad, tw + 36, 42, 21);
    ctx.fill();
    ctx.fillStyle = C.primary;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tag, pad + 18, pad + 22);

    ctx.fillStyle = C.text;
    ctx.textAlign = "center";
    let fs = 42;
    ctx.font = font(fs);
    let lines = wrap(ctx, card.scenario_text, W - pad * 2);
    while (lines.length * fs * 1.25 > H - 280 && fs > 22) {
      fs -= 2;
      ctx.font = font(fs);
      lines = wrap(ctx, card.scenario_text, W - pad * 2);
    }
    const lh = fs * 1.25;
    let y = H / 2 - ((lines.length - 1) * lh) / 2;
    for (const ln of lines) {
      ctx.fillText(ln, W / 2, y);
      y += lh;
    }

    ctx.font = font(22, 700);
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.red;
    ctx.textAlign = "left";
    ctx.fillText("◀ " + L.left, pad, H - pad);
    ctx.fillStyle = C.green;
    ctx.textAlign = "right";
    ctx.fillText(L.right + " ▶", W - pad, H - pad);
  } else if (card.is_safeguarding) {
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = C.primary;
    ctx.font = font(26, 800);
    ctx.fillText("You matter", pad, pad);
    ctx.fillStyle = C.text;
    ctx.font = font(38, 800);
    let y = pad + 56;
    for (const ln of wrap(ctx, "This one is serious — and it's not your fault.", W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 48;
    }
    ctx.fillStyle = C.muted;
    ctx.font = font(24, 500);
    y += 16;
    for (const ln of wrap(ctx, card.feedback_short, W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 34;
    }
    ctx.fillStyle = C.muted;
    ctx.font = font(20, 700);
    ctx.fillText("Talk to an adult you trust · Get Help", pad, H - pad);
  } else {
    const col = correct ? C.green : C.red;
    ctx.fillStyle = col;
    roundRect(ctx, pad, pad - 6, W - pad * 2, 6, 3);
    ctx.fill();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = col;
    ctx.font = font(26, 800);
    ctx.fillText(correct ? "SPOT ON" : "LOOK AGAIN", pad, pad + 14);
    if (correct && points > 0) {
      ctx.textAlign = "right";
      ctx.fillText("+" + points, W - pad, pad + 14);
      ctx.textAlign = "left";
    }
    ctx.fillStyle = col;
    ctx.font = font(46, 800);
    let y = pad + 70;
    for (const ln of wrap(ctx, card.sign, W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 52;
    }
    ctx.fillStyle = C.text;
    ctx.font = font(25, 500);
    y += 14;
    for (const ln of wrap(ctx, card.feedback_short, W - pad * 2)) {
      ctx.fillText(ln, pad, y);
      y += 36;
    }
    if (card.is_disguised) {
      ctx.fillStyle = C.primary;
      ctx.font = font(20, 700);
      ctx.fillText("Disguised — nice catch", pad, H - pad);
    }
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// --- grassland backdrop -----------------------------------------------------------------
function SkyDome() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { top: { value: new THREE.Color("#79bdf7") }, bottom: { value: new THREE.Color("#eaf6ff") } },
        vertexShader: `varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP; uniform vec3 top; uniform vec3 bottom;
          void main(){ float h=normalize(vP).y*0.5+0.5; gl_FragColor=vec4(mix(bottom,top,smoothstep(0.0,0.82,h)),1.0); }`,
      }),
    []
  );
  return (
    <mesh material={mat}>
      <sphereGeometry args={[260, 32, 16]} />
    </mesh>
  );
}

function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(500, 500, 90, 90);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const base = new THREE.Color("#3da679");
    const light = new THREE.Color("#59c387");
    const dark = new THREE.Color("#20896b");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const t = (Math.sin(x * 0.12) * Math.cos(y * 0.1) + Math.sin((x + y) * 0.06)) * 0.5 + 0.5;
      tmp.copy(base);
      if (t > 0.5) tmp.lerp(light, (t - 0.5) * 1.1);
      else tmp.lerp(dark, (0.5 - t) * 0.9);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial vertexColors />
    </mesh>
  );
}

const TREES: { m: "tree" | "pine"; x: number; z: number; s: number }[] = [
  { m: "tree", x: -13, z: -20, s: 5 },
  { m: "pine", x: -7, z: -30, s: 5.6 },
  { m: "tree", x: 11, z: -24, s: 5 },
  { m: "pine", x: 17, z: -18, s: 5 },
  { m: "tree", x: -20, z: -33, s: 6 },
  { m: "pine", x: 23, z: -31, s: 5.4 },
  { m: "tree", x: 5, z: -40, s: 5.2 },
  { m: "pine", x: -27, z: -42, s: 6 },
];
function Trees() {
  const tree = useGLTF("/models/tree.glb");
  const pine = useGLTF("/models/tree-pine.glb");
  return (
    <>
      {TREES.map((p, i) => (
        <Clone key={i} object={(p.m === "tree" ? tree : pine).scene} position={[p.x, 0, p.z]} scale={p.s} rotation={[0, i * 1.3, 0]} />
      ))}
    </>
  );
}
useGLTF.preload("/models/tree.glb");
useGLTF.preload("/models/tree-pine.glb");

function Card3D({
  dx,
  exiting,
  card,
  phase,
  correct,
  points,
  L,
}: {
  dx: number;
  exiting: FlagType | null;
  card: GameCard;
  phase: "play" | "reveal";
  correct: boolean;
  points: number;
  L: Labels;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const texture = useMemo(() => makeCardTexture(card, phase, correct, points, L), [card, phase, correct, points, L]);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((s) => {
    const g = group.current;
    if (!g) return;
    const dir = exiting === "green" ? 1 : exiting === "red" ? -1 : 0;
    if (exiting) {
      target.set(dir * 10, CARD_Y + 0.8, 1.5);
      g.position.lerp(target, 0.18);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -dir * 0.5, 0.18);
    } else {
      target.set(dx * 0.011, CARD_Y + Math.sin(s.clock.elapsedTime * 1.1) * 0.05, 0);
      g.position.lerp(target, 0.2);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -dx * 0.0009, 0.2);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, dx * 0.0012, 0.2);
    }
  });
  return (
    <group ref={group} position={[0, CARD_Y, 0]}>
      {/* liquid-glass body: the grassland refracts through it */}
      <RoundedBox args={[3.0, 4.0, 0.3]} radius={0.16} smoothness={6}>
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.5}
          roughness={0.32}
          ior={1.18}
          clearcoat={0.5}
          clearcoatRoughness={0.25}
          metalness={0}
          color="#ffffff"
          attenuationColor="#eef4ff"
          attenuationDistance={2}
        />
      </RoundedBox>
      {/* frosted content panel + text */}
      <mesh position={[0, 0, 0.162]}>
        <planeGeometry args={[2.9, 3.9]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene(props: { dx: number; exiting: FlagType | null; card: GameCard; phase: "play" | "reveal"; correct: boolean; points: number; L: Labels }) {
  return (
    <Canvas dpr={[1, 1.8]} camera={{ position: [0, CARD_Y, 9.5], fov: 42 }} style={{ width: "100%", height: "100%" }}>
      <color attach="background" args={["#dbeefb"]} />
      <fog attach="fog" args={["#cfe6f7", 22, 110]} />
      <SkyDome />
      <hemisphereLight args={["#dcefff", "#8fc06a", 0.65]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 12, 8]} intensity={1.1} color="#fff3da" />
      <Ground />
      <Suspense fallback={null}>
        <Trees />
      </Suspense>
      <Card3D {...props} />
    </Canvas>
  );
}

// --- the game --------------------------------------------------------------------------
export function SwipeDeck3D({ cards, deckId, mode = "score", onComplete, labels, backHref = "/decks", backLabel = "Back" }: Props) {
  const { recordCard } = useProfile();
  const scoring = mode === "score";
  const L = useMemo<Labels>(() => labels ?? { left: "Red flag", right: "Green flag" }, [labels]);
  const deckTitle = DECK_BY_ID[deckId]?.title ?? "Deck";

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"play" | "reveal">("play");
  const [chosen, setChosen] = useState<FlagType | null>(null);
  const [exiting, setExiting] = useState<FlagType | null>(null);
  const [dx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const missedRef = useRef<GameCard[]>([]);
  const revealAt = useRef(0);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (exitTimer.current && clearTimeout(exitTimer.current)), []);

  const card = cards[index];
  const correct = chosen !== null && chosen === card.correct_flag;

  function commit(flag: FlagType) {
    if (phase !== "play" || exiting) return;
    const isCorrect = flag === card.correct_flag;
    vibrate(card.is_safeguarding ? [12, 40, 12] : 12);
    let pts = 0;
    let nextStreak = streak;
    if (scoring && !card.is_safeguarding) {
      nextStreak = isCorrect ? streak + 1 : 0;
      setStreak(nextStreak);
      setBestStreak((b) => Math.max(b, nextStreak));
      pts = cardPoints(card, isCorrect, nextStreak);
      setScore((s) => s + pts);
      if (isCorrect) setCorrectCount((c) => c + 1);
      else missedRef.current = [...missedRef.current, card];
      recordCard(card.signId, isCorrect);
    }
    if (scoring && isCorrect && !card.is_safeguarding && (card.is_disguised || nextStreak === 5 || nextStreak === 10)) {
      celebrate("small");
    }
    setLastPoints(pts);
    setChosen(flag);
    setExiting(flag);
    exitTimer.current = setTimeout(() => {
      setExiting(null);
      setPhase("reveal");
      revealAt.current = Date.now();
    }, EXIT_MS);
  }

  function next() {
    if (scoring && !card.is_safeguarding && Date.now() - revealAt.current > THOUGHTFUL_MS) {
      setScore((s) => s + POINTS.thoughtful);
    }
    if (index + 1 >= cards.length) {
      const scored = cards.filter((c) => !c.is_safeguarding).length;
      onComplete({ deckId, total: scored, correct: correctCount, score, bestStreak, missed: missedRef.current });
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
    setPhase("play");
  }

  const busy = phase !== "play" || exiting !== null;

  return (
    <div className="fixed inset-0 z-0 touch-none overscroll-none bg-[#dbeefb]">
      <Scene dx={dx} exiting={exiting} card={card} phase={phase} correct={correct} points={lastPoints} L={L} />

      <Link
        href={backHref}
        aria-label={backLabel}
        className={buttonVariants({ variant: "secondary", size: "icon", className: "fixed left-4 top-4 z-50 rounded-full shadow-md" })}
      >
        <ArrowRight className="size-5 rotate-180" aria-hidden />
      </Link>

      <div className="fixed inset-x-0 top-4 z-40 flex flex-col items-center gap-1.5 px-16">
        <span className="rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-md ring-1 ring-border backdrop-blur">
          {deckTitle} · {Math.min(index + 1, cards.length)}/{cards.length}
        </span>
        {scoring && (
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md" style={{ background: "var(--flame)" }}>
                <Flame className="size-3.5" aria-hidden /> {streak}
              </span>
            )}
            <span className="rounded-full bg-card/95 px-2.5 py-1 text-xs font-bold shadow-md ring-1 ring-border backdrop-blur">{score} pts</span>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-6 z-40 mx-auto flex w-full max-w-sm items-center gap-3 px-5">
        {phase === "reveal" ? (
          <button
            type="button"
            onClick={next}
            className="h-14 flex-1 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-lg transition-transform active:scale-95"
          >
            {index + 1 >= cards.length ? "Finish" : "Next"}
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => commit("red")}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold shadow-lg backdrop-blur transition-transform active:scale-95 disabled:opacity-60"
              style={{ background: "color-mix(in oklab, var(--flag-red) 18%, rgba(255,255,255,0.7))", color: "var(--flag-red)", border: "2px solid color-mix(in oklab, var(--flag-red) 40%, transparent)" }}
            >
              <Flag className="size-5" aria-hidden /> {L.left}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => commit("green")}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold shadow-lg backdrop-blur transition-transform active:scale-95 disabled:opacity-60"
              style={{ background: "color-mix(in oklab, var(--flag-green) 18%, rgba(255,255,255,0.7))", color: "var(--flag-green)", border: "2px solid color-mix(in oklab, var(--flag-green) 40%, transparent)" }}
            >
              <Check className="size-5" aria-hidden /> {L.right}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
