"use client";

import { useActionState } from "react";

import {
  deleteWorkout,
  updateWorkout,
} from "@/app/actions/workouts";
import type { ActionState, Workout } from "@/app/lib/types";
import SubmitButton from "./SubmitButton";

const initialState: ActionState = {};

export default function WorkoutEditor({
  workout,
}: {
  workout: Workout;
}) {
  const updateAction = updateWorkout.bind(null, workout.id);
  const deleteAction = deleteWorkout.bind(null, workout.id);
  const [state, formAction, pending] = useActionState(
    updateAction,
    initialState,
  );

  return (
    <article className="item-card">
      <div className="item-card-copy">
        <span className="item-index">
          {workout.id.toString().padStart(2, "0")}
        </span>
        <div>
          <h2>{workout.name}</h2>
          <p>{workout.description || "No notes yet."}</p>
        </div>
      </div>

      <details className="edit-panel">
        <summary>Edit</summary>
        <form action={formAction} className="inline-editor">
          <label className="field">
            <span>Name</span>
            <input
              name="name"
              defaultValue={workout.name}
              maxLength={100}
              required
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              name="description"
              defaultValue={workout.description ?? ""}
              maxLength={500}
              rows={3}
            />
          </label>
          {state.error && (
            <p className="form-message error-message">{state.error}</p>
          )}
          {state.success && (
            <p className="form-message success-message">{state.success}</p>
          )}
          <button className="small-button" type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </button>
        </form>
        <form action={deleteAction}>
          <SubmitButton
            className="danger-button"
            pendingLabel="Deleting..."
          >
            Delete workout
          </SubmitButton>
        </form>
      </details>
    </article>
  );
}
