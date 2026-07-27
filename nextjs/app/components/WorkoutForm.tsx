"use client";

import { useActionState } from "react";

import { createWorkout } from "@/app/actions/workouts";
import type { ActionState } from "@/app/lib/types";

const initialState: ActionState = {};

export default function WorkoutForm() {
  const [state, formAction, pending] = useActionState(
    createWorkout,
    initialState,
  );

  return (
    <form action={formAction} className="create-card">
      <div className="card-heading">
        <p className="eyebrow">New movement</p>
        <h2>Add a workout</h2>
      </div>
      <label className="field" htmlFor="workout-name">
        <span>Name</span>
        <input
          id="workout-name"
          name="name"
          maxLength={100}
          placeholder="e.g. Barbell squat"
          required
        />
      </label>
      <label className="field" htmlFor="workout-description">
        <span>Notes</span>
        <textarea
          id="workout-description"
          name="description"
          maxLength={500}
          placeholder="Sets, reps, cues..."
          rows={3}
        />
      </label>
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
        {pending ? "Adding..." : "Add workout"}
      </button>
    </form>
  );
}
