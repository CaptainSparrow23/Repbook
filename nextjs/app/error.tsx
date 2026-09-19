"use client";

// Also catches errors thrown by the (dashboard) layout, which its own
// segments' error boundaries don't wrap.
export default function RootError({
  unstable_retry,
}: {
  unstable_retry: () => void;
}) {
  return (
    <main className="error-shell">
      <p className="eyebrow">Something went wrong</p>
      <h1>We couldn&apos;t reach Repbook.</h1>
      <p>Check that the FastAPI server is running, then try again.</p>
      <button className="primary-button" onClick={() => unstable_retry()}>
        Try again
      </button>
    </main>
  );
}
