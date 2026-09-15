import { Button, Card } from "@equal-lens/brand";

// Smoke test for the @equal-lens/brand package wiring. Visit /brand-test.
export default function BrandTest() {
  return (
    <main style={{ padding: 48, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--font-hand)" }}>@equal-lens/brand smoke test</h1>
      <Button variant="primary">Hello</Button>
      <Card>This is a brand Card. It confirms the sticker outline, lip and brand fonts render.</Card>
    </main>
  );
}
