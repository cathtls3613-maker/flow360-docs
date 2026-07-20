import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * Request gatekeeper (Next.js proxy). Keeps Supabase sessions fresh and
 * enforces which pages require sign-in. Logic lives in
 * src/lib/supabase/proxy-session.ts.
 */
export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on every route except static assets and images.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
