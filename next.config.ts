import type { NextConfig } from "next";

/** Security headers sent with every response. */
const securityHeaders = [
  // Stop the app from being embedded in iframes on other sites (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from guessing content types (MIME sniffing attacks).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin as referrer to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful browser features the app doesn't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
] as const;

const nextConfig: NextConfig = {
  // Produce a self-contained build so the app can run in a small Docker
  // container. Vercel deployments are unaffected by this setting.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders],
      },
    ];
  },
};

export default nextConfig;
