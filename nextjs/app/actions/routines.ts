"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { fastApiFetch, readApiError } from "@/app/lib/api";
import type { ActionState } from "@/app/lib/types";

async function handleUnauthorized(response: Response) {
  if (response.status !== 401) return;
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  redirect("/login");
}

function routinePayload(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Routine name is required" } as const;
  }

  return {
    value: {
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      workouts: formData
        .getAll("workouts")
        .map(Number)
        .filter(Number.isInteger),
    },
  } as const;
}

export async function createRoutine(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = routinePayload(formData);
  if ("error" in payload) return { error: payload.error };

  const response = await fastApiFetch("/routines/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.value),
  });

  await handleUnauthorized(response);
  if (!response.ok) {
    return {
      error: await readApiError(response, "Could not create routine"),
    };
  }

  revalidatePath("/routines");
  return { success: "Routine created" };
}

export async function updateRoutine(
  routineId: number,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = routinePayload(formData);
  if ("error" in payload) return { error: payload.error };

  const response = await fastApiFetch(`/routines/${routineId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.value),
  });

  await handleUnauthorized(response);
  if (!response.ok) {
    return {
      error: await readApiError(response, "Could not update routine"),
    };
  }

  revalidatePath("/routines");
  return { success: "Changes saved" };
}

export async function deleteRoutine(routineId: number) {
  const response = await fastApiFetch(`/routines/${routineId}`, {
    method: "DELETE",
  });

  await handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not delete routine"),
    );
  }

  revalidatePath("/routines");
}
