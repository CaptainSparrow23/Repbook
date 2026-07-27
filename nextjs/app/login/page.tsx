import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "./LoginForm";
import { getCurrentUser } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Log in",
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/workouts");

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="brand brand-dark">
          REPBOOK
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1>Pick up where you left off.</h1>
          <p>Log in to see your workouts and build your next routine.</p>
        </div>
        <LoginForm />
        <p className="auth-switch">
          New here? <Link href="/register">Create an account</Link>
        </p>
      </section>
      <aside className="auth-visual" aria-hidden="true">
        <div className="visual-copy">
          <span>TRAIN WITH INTENT</span>
          <strong>Small sessions.<br />Visible progress.</strong>
        </div>
      </aside>
    </main>
  );
}
