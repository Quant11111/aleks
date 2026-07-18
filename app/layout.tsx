import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { profile } from "@/lib/portfolio";
import SmoothScroll from "@/components/SmoothScroll";
import ModalProvider from "@/components/ModalProvider";
import Nav from "@/components/Nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://alexandra.saas-e.com";
const OG_IMAGE =
  "https://d5u195w6r6k85.cloudfront.net/home/i_am_alexandra_poster.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Alexandra — Directrice de création & Motion Designer | Portfolio",
    template: "%s | Alexandra",
  },
  description:
    "Portfolio d'Alexandra — designer graphique, motion designer et coordinatrice événementielle. Identités visuelles, motion design 2D/3D et événements à Lille, Paris et Biarritz.",
  keywords: [
    "designer graphique",
    "motion design",
    "directrice de création",
    "communication événementielle",
    "création visuelle",
    "graphisme",
    "animation 2D 3D",
    "identité visuelle",
    "événementiel",
    "Lille",
    "Paris",
    "Biarritz",
    "France",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: `${profile.name} — Portfolio`,
    title: "Alexandra — Directrice de création & Motion Designer",
    description:
      "Portfolio créatif : identités visuelles, motion design et événements qui rassemblent des milliers de personnes.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Alexandra — Directrice de création & Motion Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alexandra — Directrice de création & Motion Designer",
    description:
      "Portfolio créatif : identités visuelles, motion design et événementiel.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Directrice de création, Motion Designer",
  description:
    "Designer graphique, motion designer et coordinatrice événementielle.",
  url: SITE_URL,
  image: OG_IMAGE,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneHref,
  knowsAbout: [
    "Design graphique",
    "Motion design",
    "Communication événementielle",
    "Direction artistique",
    "Création visuelle",
  ],
  address: profile.locations.map((city) => ({
    "@type": "PostalAddress",
    addressLocality: city,
    addressCountry: "FR",
  })),
  worksFor: { "@type": "Organization", name: "Freelance" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://d5u195w6r6k85.cloudfront.net"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#accueil" className="skip-link">
          Aller au contenu principal
        </a>
        <SmoothScroll>
          <ModalProvider>
            <Nav />
            <main id="main">{children}</main>
          </ModalProvider>
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
