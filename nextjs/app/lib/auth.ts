import "server-only";

import { fastApiFetch } from "./api";

export type CurrentUser = {
  id: number;
  username: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const response = await fastApiFetch("/auth/me");

  if (!response.ok) {
    return null;
  }

  return response.json();
}
