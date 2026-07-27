"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { readApiError } from "@/app/lib/api";

export type LoginState = {
  error?: string;
};

export type RegisterState = {
  error?: string;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

async function requestToken(username: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const response = await fetch(
    `${process.env.FASTAPI_URL}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as TokenResponse;
}

async function createSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 20 * 60,
    path: "/",
  });
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    return { error: "Username and password are required" };
  }

  const token = await requestToken(username.trim(), password);
  if (!token) {
    return { error: "Incorrect username or password" };
  }

  await createSession(token.access_token);
  redirect("/workouts");
}

export async function register(
  _previousState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const username = formData.get("username");
  const password = formData.get("password");
  const confirmation = formData.get("confirmation");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof confirmation !== "string"
  ) {
    return { error: "All fields are required" };
  }

  if (username.trim().length < 3) {
    return { error: "Username must be at least 3 characters" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (password !== confirmation) {
    return { error: "Passwords do not match" };
  }

  const response = await fetch(`${process.env.FASTAPI_URL}/auth/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username.trim(),
      password,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      error: await readApiError(response, "Could not create account"),
    };
  }

  const token = await requestToken(username.trim(), password);
  if (!token) {
    return { error: "Account created. Please log in." };
  }

  await createSession(token.access_token);
  redirect("/workouts");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/login");
}
