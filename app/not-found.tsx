import Link from "next/link";

export default function NotFound() {
  return (
    <main className="fallback">
      <div className="hud-panel max-w-md p-6 text-center">
        <p className="record-code text-accent">LOST IN SPACE · 404</p>
        <h1 className="font-display text-xl font-semibold text-ink">No such coordinates</h1>
        <p className="mt-2 text-sm text-muted">That star system or planet is not on the chart.</p>
        <Link href="/" className="hud-btn mt-4 inline-block">
          Back to the galaxy
        </Link>
      </div>
    </main>
  );
}
