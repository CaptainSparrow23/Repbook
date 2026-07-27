"use client";

import { useActionState } from "react";
import {
  login,
  type LoginState,
} from "@/app/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    login,
    initialState,
  );

  return (
    <form action={formAction} className="stack-form">
      <label className="field" htmlFor="username">
        <span>Username</span>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="your username"
          required
        />
      </label>

      <label className="field" htmlFor="password">
        <span>Password</span>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </label>

      {state.error && (
        <p className="form-message error-message" role="alert">
          {state.error}
        </p>
      )}

      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
