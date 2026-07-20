import { redirect } from "next/navigation";

import { getCurrentUser } from "@/engines/identity";
import { AppShell } from "@/components/app-shell/app-shell";
import { signOutAction } from "@/features/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/**
 * Everything behind the login depends on the visitor's session, so it
 * must render per-request — never pre-rendered at build time.
 */
export const dynamic = "force-dynamic";

/**
 * Layout for everything behind the login. Defense in depth: the proxy
 * already redirects signed-out visitors, and this layout verifies the
 * session again server-side before rendering anything.
 */
export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const client = await createClient();
  const user = await getCurrentUser(client);

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell user={user} onSignOut={signOutAction}>
      {children}
    </AppShell>
  );
}
