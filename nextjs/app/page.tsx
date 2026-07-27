import { redirect } from "next/navigation";

import { getCurrentUser } from "@/app/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();
  redirect(user ? "/workouts" : "/login");
}
