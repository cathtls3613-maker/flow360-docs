import Link from "next/link";

/** Centered layout shared by the sign-in and sign-up pages. */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-xl font-bold tracking-tight"
        aria-label="FLOW360 home"
      >
        FLOW360
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
