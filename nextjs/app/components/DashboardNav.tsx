import Link from "next/link";

import { logout } from "@/app/actions/auth";

export default function DashboardNav({
  username,
}: {
  username: string;
}) {
  return (
    <header className="dashboard-header">
      <Link href="/workouts" className="brand">
        REPBOOK
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/workouts">Workouts</Link>
        <Link href="/routines">Routines</Link>
      </nav>
      <div className="account-menu">
        <span>{username}</span>
        <form action={logout}>
          <button className="text-button" type="submit">
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
