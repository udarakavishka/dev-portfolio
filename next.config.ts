import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // llms.txt contains non-ASCII characters (em dashes); declare the charset.
      { source: "/llms.txt", headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }] },
    ];
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
