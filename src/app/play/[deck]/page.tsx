import { Play } from "@/components/play";
import type { DeckId } from "@/lib/types";

export default async function PlayRoute({
  params,
}: {
  params: Promise<{ deck: string }>;
}) {
  const { deck } = await params;
  return <Play deckId={deck as DeckId} />;
}
