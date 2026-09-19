import { redirect } from "next/navigation";

import DashboardNav from "@/app/components/DashboardNav";
import { getCurrentUser } from "@/app/lib/auth";

// Layouts don't re-render on client navigation, so this redirect only runs on
// a full page load. Each page still redirects on a 401 from its own data fetch.
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="dashboard-shell">
      <DashboardNav username={user.username} />
      {children}
    </div>
  );
}
