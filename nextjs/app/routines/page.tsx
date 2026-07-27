import type { Metadata } from "next";
import { redirect } from "next/navigation";

import DashboardNav from "@/app/components/DashboardNav";
import RoutineEditor from "@/app/components/RoutineEditor";
import RoutineForm from "@/app/components/RoutineForm";
import { fastApiFetch } from "@/app/lib/api";
import { getCurrentUser } from "@/app/lib/auth";
import type { Routine, Workout } from "@/app/lib/types";

export const metadata: Metadata = {
  title: "Routines",
};

async function getRoutineData() {
  const [routinesResponse, workoutsResponse] = await Promise.all([
    fastApiFetch("/routines/"),
    fastApiFetch("/workouts/"),
  ]);

  if (
    routinesResponse.status === 401 ||
    workoutsResponse.status === 401
  ) {
    redirect("/login");
  }

  if (!routinesResponse.ok || !workoutsResponse.ok) {
    throw new Error("Failed to retrieve routines");
  }

  return {
    routines: (await routinesResponse.json()) as Routine[],
    workouts: (await workoutsResponse.json()) as Workout[],
  };
}

export default async function RoutinesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { routines, workouts } = await getRoutineData();

  return (
    <div className="dashboard-shell">
      <DashboardNav username={user.username} />
      <main className="dashboard-main">
        <section className="page-intro">
          <div>
            <p className="eyebrow">Training plans</p>
            <h1>Your routines</h1>
          </div>
          <p>
            Turn individual movements into repeatable sessions you can come
            back to.
          </p>
        </section>

        <div className="content-grid">
          <RoutineForm workouts={workouts} />
          <section className="collection" aria-label="Saved routines">
            <div className="collection-heading">
              <h2>Saved routines</h2>
              <span>{routines.length}</span>
            </div>
            {routines.length === 0 ? (
              <div className="empty-state">
                <strong>No routines yet.</strong>
                <p>Group your workouts into your first training plan.</p>
              </div>
            ) : (
              <div className="routine-list">
                {routines.map((routine) => (
                  <RoutineEditor
                    key={routine.id}
                    routine={routine}
                    workouts={workouts}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
