"use client";

export default function WorkoutsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="error-shell">
      <p className="eyebrow">Something went wrong</p>
      <h1>We couldn&apos;t load your training data.</h1>
      <p>Check that the FastAPI server is running, then try again.</p>
      <button className="primary-button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
