import type { Metadata } from "next";

import { SignInForm } from "@/features/auth";
import { AuthCard } from "@/features/auth/components/auth-card";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your FLOW360 workspace"
    >
      <SignInForm />
    </AuthCard>
  );
}
