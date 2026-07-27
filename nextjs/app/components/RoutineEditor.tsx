"use client";

import { useActionState } from "react";

import {
  deleteRoutine,
  updateRoutine,
} from "@/app/actions/routines";
import type {
  ActionState,
  Routine,
  Workout,
} from "@/app/lib/types";
import SubmitButton from "./SubmitButton";

const initialState: ActionState = {};

export default function RoutineEditor({
  routine,
  workouts,
}: {
  routine: Routine;
  workouts: Workout[];
}) {
  const updateAction = updateRoutine.bind(null, routine.id);
  const deleteAction = deleteRoutine.bind(null, routine.id);
  const [state, formAction, pending] = useActionState(
    updateAction,
    initialState,
  );
  const selected = new Set(routine.workouts.map((workout) => workout.id));

  return (
    <article className="routine-card">
      <div className="routine-topline">
        <div>
          <p className="eyebrow">Routine {routine.id}</p>
          <h2>{routine.name}</h2>
        </div>
        <span className="count-pill">
          {routine.workouts.length} movements
        </span>
      </div>
      <p className="routine-description">
        {routine.description || "No routine notes yet."}
      </p>
      <div className="routine-workouts">
        {routine.workouts.length === 0 ? (
          <span>No workouts assigned</span>
        ) : (
          routine.workouts.map((workout) => (
            <span key={workout.id}>{workout.name}</span>
          ))
        )}
      </div>
      <details className="edit-panel">
        <summary>Edit routine</summary>
        <form action={formAction} className="inline-editor">
          <label className="field">
            <span>Name</span>
            <input
              name="name"
              defaultValue={routine.name}
              maxLength={100}
              required
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <textarea
              name="description"
              defaultValue={routine.description ?? ""}
              maxLength={500}
              rows={3}
            />
          </label>
          <fieldset className="check-group">
            <legend>Workouts</legend>
            {workouts.map((workout) => (
              <label key={workout.id}>
                <input
                  type="checkbox"
                  name="workouts"
                  value={workout.id}
                  defaultChecked={selected.has(workout.id)}
                />
                <span>{workout.name}</span>
              </label>
            ))}
          </fieldset>
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
            Delete routine
          </SubmitButton>
        </form>
      </details>
    </article>
  );
}
