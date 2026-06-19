"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { EngineGameHost, hasEngineGame } from "@/components/games/engine-host";

// Standalone backdrop for direct links to /game/<id>. On the path itself these games
// play in place over the existing 3D scene; here we supply the same grassland behind them.
const GrasslandBackdrop = dynamic(
  () => import("@/components/grassland-backdrop").then((m) => m.GrasslandBackdrop),
  { ssr: false, loading: () => null }
);

export default function GamePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

  if (!hasEngineGame(id)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-8 text-center text-sm text-muted-foreground">
        This game is coming soon.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 touch-none overflow-hidden bg-[#bfe2fb]">
      <div className="absolute inset-0">
        <GrasslandBackdrop />
      </div>
      <EngineGameHost id={id} onExit={() => router.push("/path")} />
    </div>
  );
}
