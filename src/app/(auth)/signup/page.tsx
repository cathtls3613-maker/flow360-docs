import type { Metadata } from "next";

import { SignUpForm } from "@/features/auth";
import { AuthCard } from "@/features/auth/components/auth-card";

export const metadata: Metadata = { title: "Create your workspace" };

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your company workspace"
      description="Set up FLOW360 for your distribution business in one minute"
    >
      <SignUpForm />
    </AuthCard>
  );
}
