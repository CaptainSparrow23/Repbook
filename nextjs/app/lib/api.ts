import "server-only";

import { cookies } from "next/headers";

export async function fastApiFetch(
  path: string,
  options: RequestInit = {},
) {
  const apiUrl = process.env.FASTAPI_URL;
  if (!apiUrl) {
    throw new Error("FASTAPI_URL is not configured");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
}

export async function readApiError(
  response: Response,
  fallback: string,
) {
  try {
    const body: { detail?: string } = await response.json();
    return body.detail ?? fallback;
  } catch {
    return fallback;
  }
}
