"use client";

import { useActionState } from "react";

import { createRoutine } from "@/app/actions/routines";
import type { ActionState, Workout } from "@/app/lib/types";

const initialState: ActionState = {};

export default function RoutineForm({
  workouts,
}: {
  workouts: Workout[];
}) {
  const [state, formAction, pending] = useActionState(
    createRoutine,
    initialState,
  );

  return (
    <form action={formAction} className="create-card">
      <div className="card-heading">
        <p className="eyebrow">New plan</p>
        <h2>Build a routine</h2>
      </div>
      <label className="field">
        <span>Name</span>
        <input
          name="name"
          maxLength={100}
          placeholder="e.g. Lower body A"
          required
        />
      </label>
      <label className="field">
        <span>Notes</span>
        <textarea
          name="description"
          maxLength={500}
          placeholder="Goal, schedule, intent..."
          rows={3}
        />
      </label>
      <fieldset className="check-group">
        <legend>Workouts</legend>
        {workouts.length === 0 ? (
          <p>Add workouts before building a routine.</p>
        ) : (
          workouts.map((workout) => (
            <label key={workout.id}>
              <input
                type="checkbox"
                name="workouts"
                value={workout.id}
              />
              <span>{workout.name}</span>
            </label>
          ))
        )}
      </fieldset>
      {state.error && (
        <p className="form-message error-message" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="form-message success-message" role="status">
          {state.success}
        </p>
      )}
      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Building..." : "Create routine"}
      </button>
    </form>
  );
}
