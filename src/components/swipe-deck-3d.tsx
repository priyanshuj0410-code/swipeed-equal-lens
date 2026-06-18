"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Flag, Flame, Sparkles, ArrowRight, LifeBuoy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Card as GameCard, DeckSummary, Flag as FlagType } from "@/lib/types";
import { cardPoints, POINTS } from "@/lib/scoring";
import { DECK_BY_ID } from "@/content/decks";
import { celebrate } from "@/lib/confetti";
import { useProfile } from "@/lib/store";

type Props = {
  cards: GameCard[];
  deckId: DeckSummary["deckId"];
  mode?: "score" | "review";
  onComplete: (summary: DeckSummary) => void;
  labels?: { left: string; right: string };
  backHref?: string;
  backLabel?: string;
};

const THOUGHTFUL_MS = 1200;
const EXIT_MS = 380;

function vibrate(p: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(p);
    } catch {
      /* unsupported */
    }
  }
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
      <sphereGeometry args={[200, 32, 16]} />
    </mesh>
  );
}

function Ground() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(400, 400, 80, 80);
    const pos = g.attributes.position;
    const colors: number[] = [];
    const base = new THREE.Color("#3da679");
    const light = new THREE.Color("#59c387");
    const dark = new THREE.Color("#20896b");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const t = (Math.sin(x * 0.18) * Math.cos(y * 0.16) + Math.sin((x + y) * 0.09)) * 0.5 + 0.5;
      tmp.copy(base);
      if (t > 0.5) tmp.lerp(light, (t - 0.5) * 1.2);
      else tmp.lerp(dark, (0.5 - t) * 1.0);
      colors.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <meshStandardMaterial vertexColors />
    </mesh>
  );
}

// gentle idle float + lean toward the dragged direction
function Card3D({ dx, exiting, children }: { dx: number; exiting: FlagType | null; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((s) => {
    const g = group.current;
    if (!g) return;
    const dir = exiting === "green" ? 1 : exiting === "red" ? -1 : 0;
    if (exiting) {
      target.set(dir * 9, 2.6, 1);
      g.position.lerp(target, 0.18);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -dir * 0.5, 0.18);
    } else {
      target.set(dx * 0.011, 2.6 + Math.sin(s.clock.elapsedTime * 1.1) * 0.05, 0);
      g.position.lerp(target, 0.2);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -dx * 0.0009, 0.2);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, dx * 0.0012, 0.2);
    }
  });
  return (
    <group ref={group} position={[0, 2.6, 0]}>
      <RoundedBox args={[3.4, 4.5, 0.3]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </RoundedBox>
      <Html transform position={[0, 0, 0.17]} scale={0.0118} zIndexRange={[20, 0]}>
        <div className="h-[380px] w-[286px] select-none">{children}</div>
      </Html>
    </group>
  );
}

function Scene({ dx, exiting, face }: { dx: number; exiting: FlagType | null; face: React.ReactNode }) {
  return (
    <Canvas dpr={[1, 1.8]} camera={{ position: [0, 2.8, 7.4], fov: 42 }} gl={{ antialias: true }} style={{ width: "100%", height: "100%" }}>
      <color attach="background" args={["#eaf6ff"]} />
      <fog attach="fog" args={["#dbeefb", 24, 120]} />
      <SkyDome />
      <hemisphereLight args={["#dcefff", "#8fc06a", 0.6]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} color="#fff3da" />
      <Ground />
      <Card3D dx={dx} exiting={exiting}>
        {face}
      </Card3D>
    </Canvas>
  );
}

// --- card faces (DOM, rendered onto the 3D card) ---------------------------------------
function PlayFace({ card, L }: { card: GameCard; L: { left: string; right: string } }) {
  return (
    <div className="flex h-full w-full flex-col gap-3 rounded-[1.6rem] bg-card p-5 text-card-foreground ring-1 ring-border">
      <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
        {card.context_tag}
      </span>
      <p className="flex flex-1 items-center text-balance text-center font-display text-[1.55rem] font-semibold leading-snug">
        {card.scenario_text}
      </p>
      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span className="flex items-center gap-1" style={{ color: "var(--flag-red)" }}>
          <Flag className="size-3.5" aria-hidden /> {L.left}
        </span>
        <span className="flex items-center gap-1" style={{ color: "var(--flag-green)" }}>
          {L.right} <Check className="size-3.5" aria-hidden />
        </span>
      </div>
    </div>
  );
}

function RevealFace({ card, correct, points }: { card: GameCard; correct: boolean; points: number }) {
  if (card.is_safeguarding) {
    return (
      <div className="flex h-full w-full flex-col gap-3 rounded-[1.6rem] bg-card p-5 text-card-foreground ring-1 ring-border">
        <span className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-primary">
          <LifeBuoy className="size-5" aria-hidden /> You matter
        </span>
        <p className="font-display text-2xl font-bold leading-tight">This one&apos;s serious — and it&apos;s not your fault.</p>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.feedback_short}</p>
        <p className="text-xs text-muted-foreground">Talk to an adult you trust. Tap Get Help anytime.</p>
      </div>
    );
  }
  const color = correct ? "var(--flag-green)" : "var(--flag-red)";
  return (
    <div className="relative flex h-full w-full flex-col gap-2.5 overflow-hidden rounded-[1.6rem] bg-card p-5 text-card-foreground ring-1 ring-border">
      <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: color }} aria-hidden />
      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide" style={{ color }}>
          {correct ? <Check className="size-5" aria-hidden /> : <Flag className="size-5" aria-hidden />}
          {correct ? "Spot on" : "Look again"}
        </span>
        {correct && points > 0 && (
          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: color }}>
            <Sparkles className="size-3" aria-hidden /> +{points}
          </span>
        )}
      </div>
      <p className="font-display text-[1.7rem] font-bold leading-tight" style={{ color }}>
        {card.sign}
      </p>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{card.feedback_short}</p>
      {card.is_disguised && (
        <span className="w-fit rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Disguised — nice catch</span>
      )}
    </div>
  );
}

// --- the game ---------------------------------------------------------------------------
export function SwipeDeck3D({ cards, deckId, mode = "score", onComplete, labels, backHref = "/decks", backLabel = "Back" }: Props) {
  const { recordCard } = useProfile();
  const scoring = mode === "score";
  const L = labels ?? { left: "Red flag", right: "Green flag" };
  const deckTitle = DECK_BY_ID[deckId]?.title ?? "Deck";

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"play" | "reveal">("play");
  const [chosen, setChosen] = useState<FlagType | null>(null);
  const [exiting, setExiting] = useState<FlagType | null>(null);
  const [dx, setDx] = useState(0);
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
    setDx(0);
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
    setDx(0);
  }

  const face =
    phase === "reveal" && chosen ? <RevealFace card={card} correct={correct} points={lastPoints} /> : <PlayFace card={card} L={L} />;
  const busy = phase !== "play" || exiting !== null;

  return (
    <div className="fixed inset-0 z-0 touch-none overscroll-none bg-[#eaf6ff]">
      <Scene dx={dx} exiting={exiting} face={face} />

      {/* back */}
      <Link
        href={backHref}
        aria-label={backLabel}
        className={buttonVariants({ variant: "secondary", size: "icon", className: "fixed left-4 top-4 z-50 rounded-full shadow-md" })}
      >
        <ArrowRight className="size-5 rotate-180" aria-hidden />
      </Link>

      {/* progress + score */}
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

      {/* actions */}
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
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-60"
              style={{ background: "color-mix(in oklab, var(--flag-red) 16%, var(--card))", color: "var(--flag-red)", border: "2px solid color-mix(in oklab, var(--flag-red) 38%, transparent)" }}
            >
              <Flag className="size-5" aria-hidden /> {L.left}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => commit("green")}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl text-base font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-60"
              style={{ background: "color-mix(in oklab, var(--flag-green) 16%, var(--card))", color: "var(--flag-green)", border: "2px solid color-mix(in oklab, var(--flag-green) 38%, transparent)" }}
            >
              <Check className="size-5" aria-hidden /> {L.right}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
