import type { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardNav from "@/app/components/DashboardNav";
import WorkoutEditor from "@/app/components/WorkoutEditor";
import WorkoutForm from "@/app/components/WorkoutForm";
import { fastApiFetch } from "@/app/lib/api";
import { getCurrentUser } from "@/app/lib/auth";
import type { Workout } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "Workouts",
};

async function getWorkouts(): Promise<Workout[]> {
  const response = await fastApiFetch("/workouts/");
  if (response.status === 401) redirect("/login");
  if (!response.ok) throw new Error("Failed to retrieve workouts");
  return response.json();
}

export default async function WorkoutsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const workouts = await getWorkouts();

  return (
    <div className="dashboard-shell">
      <DashboardNav username={user.username} />
      <main className="dashboard-main">
        <section className="page-intro">
          <div>
            <p className="eyebrow">Movement library</p>
            <h1>Your workouts</h1>
          </div>
          <p>
            Keep the movements you return to in one clean list, then combine
            them into routines.
          </p>
        </section>

        <div className="content-grid">
          <WorkoutForm />
          <section className="collection" aria-label="Saved workouts">
            <div className="collection-heading">
              <h2>Saved movements</h2>
              <span>{workouts.length}</span>
            </div>
            {workouts.length === 0 ? (
              <div className="empty-state">
                <strong>Your movement library is empty.</strong>
                <p>Add your first workout using the form.</p>
              </div>
            ) : (
              <div className="item-list">
                {workouts.map((workout) => (
                  <WorkoutEditor key={workout.id} workout={workout} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
