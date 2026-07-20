import type { Metadata } from "next";

import { getCurrentUser } from "@/engines/identity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const client = await createClient();
  const user = await getCurrentUser(client);
  // The layout guarantees a signed-in user; this satisfies the compiler.
  if (!user) {
    return null;
  }

  const firstName = user.fullName.split(" ")[0] || "there";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome, {firstName}
        </h1>
        <p className="text-muted-foreground text-sm">
          Your {user.company.name} workspace is ready.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Company</CardDescription>
            <CardTitle>{user.company.name}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Your role</CardDescription>
            <CardTitle className="capitalize">{user.role}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Signed in as</CardDescription>
            <CardTitle className="truncate text-base">{user.email}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What arrives next</CardTitle>
          <CardDescription>
            The modules in the sidebar unlock sprint by sprint.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Next up: Master Data — products, customers, and suppliers — the shared
          dictionaries every other module builds on. After that, Smart Costing
          turns supplier quotations into landed and company costs automatically.
        </CardContent>
      </Card>
    </div>
  );
}
