"use client";

import { useActionState } from "react";

import {
  register,
  type RegisterState,
} from "@/app/actions/auth";

const initialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    register,
    initialState,
  );

  return (
    <form action={formAction} className="stack-form">
      <label className="field" htmlFor="username">
        <span>Username</span>
        <input
          id="username"
          name="username"
          minLength={3}
          maxLength={50}
          autoComplete="username"
          placeholder="choose a username"
          required
        />
      </label>

      <label className="field" htmlFor="password">
        <span>Password</span>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="at least 8 characters"
          required
        />
      </label>

      <label className="field" htmlFor="confirmation">
        <span>Confirm password</span>
        <input
          id="confirmation"
          name="confirmation"
          type="password"
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          placeholder="repeat your password"
          required
        />
      </label>

      {state.error && (
        <p className="form-message error-message" role="alert">
          {state.error}
        </p>
      )}

      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
