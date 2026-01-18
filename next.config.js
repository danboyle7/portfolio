// NOTE: If we add sentry, add https://*.sentry.io to connect-src.
const isDev = process.env.NODE_ENV === "development";
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://formsubmit.co;
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

/** @type {import("next").NextConfig} */
const config = {
  // Enable static export for Cloudflare Pages
  // Remove or comment this out for Vercel/other serverful deployments
  output: "export",
  distDir: 'static',

  // Image optimization settings for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for better static hosting compatibility
  trailingSlash: true,

  // Security headers (used by Vercel and other platforms)
  // For Cloudflare Pages, these are also defined in public/_headers
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default config;
