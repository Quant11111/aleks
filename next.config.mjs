/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // Optimisation via next/image tout en CONSERVANT le CDN CloudFront d'Alexandra.
    // Next sert des AVIF/WebP redimensionnés depuis les médias sources CloudFront.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d5u195w6r6k85.cloudfront.net",
        pathname: "/**",
      },
    ],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 400, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
  },

  async headers() {
    return [
      {
        // En-têtes de sécurité + perf sur tout le site
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
