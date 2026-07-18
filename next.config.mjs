/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // IMPORTANT (VPS léger) : on N'optimise PAS les images côté serveur.
    // L'encodage AVIF/WebP à la volée via `sharp` est extrêmement gourmand en
    // CPU et faisait saturer le VPS (crash-loop TimeoutError). Les médias sont
    // déjà sur un CDN rapide (CloudFront) : on les sert directement.
    // -> zéro CPU image sur le serveur, tout en gardant lazy-loading + aspect-ratio.
    //
    // Pour ré-activer l'optimisation Next sur un hébergement plus costaud
    // (Vercel, VPS ≥ 2 vCPU dédiés) : passer `unoptimized: false` et décommenter
    // `formats`/`deviceSizes` ci-dessous.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d5u195w6r6k85.cloudfront.net",
        pathname: "/**",
      },
    ],
    // formats: ["image/avif", "image/webp"],
    // deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2560],
    // imageSizes: [96, 160, 240, 320, 400, 480],
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
