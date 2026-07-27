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

function workoutPayload(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Workout name is required" } as const;
  }

  return {
    value: {
      name: name.trim(),
      description:
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
    },
  } as const;
}

export async function createWorkout(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = workoutPayload(formData);
  if ("error" in payload) return { error: payload.error };

  const response = await fastApiFetch("/workouts/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.value),
  });

  await handleUnauthorized(response);
  if (!response.ok) {
    return {
      error: await readApiError(response, "Could not create workout"),
    };
  }

  revalidatePath("/workouts");
  revalidatePath("/routines");
  return { success: "Workout created" };
}

export async function updateWorkout(
  workoutId: number,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = workoutPayload(formData);
  if ("error" in payload) return { error: payload.error };

  const response = await fastApiFetch(`/workouts/${workoutId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload.value),
  });

  await handleUnauthorized(response);
  if (!response.ok) {
    return {
      error: await readApiError(response, "Could not update workout"),
    };
  }

  revalidatePath("/workouts");
  revalidatePath("/routines");
  return { success: "Changes saved" };
}

export async function deleteWorkout(workoutId: number) {
  const response = await fastApiFetch(`/workouts/${workoutId}`, {
    method: "DELETE",
  });

  await handleUnauthorized(response);
  if (!response.ok) {
    throw new Error(
      await readApiError(response, "Could not delete workout"),
    );
  }

  revalidatePath("/workouts");
  revalidatePath("/routines");
}
