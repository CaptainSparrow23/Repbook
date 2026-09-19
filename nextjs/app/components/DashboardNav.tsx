import { logout } from "@/app/actions/auth";
import NavLink from "@/app/components/NavLink";

export default function DashboardNav({
  username,
}: {
  username: string;
}) {
  return (
    <header className="dashboard-header">
      <NavLink href="/workouts" className="brand">
        REPBOOK
      </NavLink>
      <nav aria-label="Main navigation">
        <NavLink href="/workouts">Workouts</NavLink>
        <NavLink href="/routines">Routines</NavLink>
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
