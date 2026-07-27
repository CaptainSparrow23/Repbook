import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import RegisterForm from "./RegisterForm";
import { getCurrentUser } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Create account",
};

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/workouts");

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="brand brand-dark">
          REPBOOK
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Start tracking</p>
          <h1>Build a training habit that sticks.</h1>
          <p>Create your account and save your first workout.</p>
        </div>
        <RegisterForm />
        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </section>
      <aside className="auth-visual auth-visual-alt" aria-hidden="true">
        <div className="visual-copy">
          <span>YOUR TRAINING, ORGANIZED</span>
          <strong>Plan it.<br />Put in the work.</strong>
        </div>
      </aside>
    </main>
  );
}
