# Alexandra — Portfolio (refonte)

Refonte du portfolio d'[alexandra.saas-e.com](https://alexandra.saas-e.com) : une
expérience éditoriale « magazine de mode sombre », animée au scroll, inspirée du
rendu de [huts.com](https://huts.com). **La forme change, le fond est conservé** —
mêmes couleurs, même police, même CDN, mêmes médias, même contenu.

## Stack

| Choix | Raison |
| --- | --- |
| **Next.js 15** (App Router, TypeScript) | SSG (SEO béton, pages statiques), `next/image`, écosystème React pour l'animation. Rendu 100 % statique. |
| **Framer Motion** | Reveals au scroll, révélations ligne-par-ligne, parallax, compteurs, crossfade modal. |
| **Lenis** | Smooth scroll à inertie (le « toucher » façon site de référence). |
| **CSS Modules + variables** | Fidélité totale à la marque (couleurs exactes, `border-radius: 0`), zéro dépendance UI. |

> **Alternative envisagée :** Astro (zéro-JS) serait plus léger pour un site
> vitrine, mais l'expérience scroll très animée est nativement React/Framer Motion.
> Next.js reste le meilleur compromis expérience premium + SEO.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run start    # sert le build
```

## Contraintes du cahier des charges — statut

- ✅ **Couleurs conservées** : `#000` / `#fff` / accent magenta `#ff0066` (+ `#ff4d8a`), gris `#d4d4d4`/`#a3a3a3`.
- ✅ **Polices conservées** : `Inter` (corps) + `Playfair Display` (display, italique dégradé) — chargées via `next/font` (auto-hébergées, zéro requête externe, pas de CLS).
- ✅ **`border-radius: 0`** partout (`--radius: 0`), angles droits.
- ✅ **Expérience originale + animations scroll** : smooth scroll, reveals masqués, parallax hero/projets, compteurs, transitions modal.
- ✅ **SEO + chargement images** : métadonnées complètes, JSON-LD `Person`, `sitemap.xml`, `robots.txt`, OpenGraph ; images servies en **AVIF/WebP** redimensionnées via `next/image`, lazy-loading, aspect-ratio (anti-CLS).
- ✅ **CDN CloudFront conservé** : `d5u195w6r6k85.cloudfront.net`, mêmes médias (voir `lib/content.json`).
- ✅ **Contenu conservé, mis en forme** : ~30 projets, 4 catégories ; sections inédites (manifeste, chiffres d'impact, projets phares) dérivées du contenu existant.
- ✅ **Responsive** : testé 390 / 768 / 1080 / 1440 px, menu mobile plein écran.
- ✅ **Accessibilité** : focus visibles, skip-link, focus-trap modal, navigation clavier, `prefers-reduced-motion` (désactive Lenis + animations).

## Architecture

```
app/
  layout.tsx        Polices, métadonnées SEO, JSON-LD, providers (SmoothScroll, Modal, Nav)
  page.tsx          Composition des sections
  globals.css       Design system (tokens de marque, reset, utilitaires)
  sitemap.ts robots.ts manifest.ts   SEO / PWA
components/
  SmoothScroll.tsx  Provider Lenis + API scroll (ancres, verrou modal)
  Nav.tsx           Navigation auto-hide + scroll-spy + menu mobile
  Hero.tsx          Hero ciné (vidéo plein-cadre, reveal typo, parallax)
  Manifesto.tsx     Manifeste révélé ligne par ligne
  Stats.tsx         Chiffres d'impact (compteurs animés)
  Work.tsx / CategoryShowcase.tsx / ProjectCard.tsx   Grille magazine + cartes
  FeaturedProject.tsx  Bloc projet phare plein-cadre en parallax
  Contact.tsx       Footer éditorial (contact, services)
  ProjectModal.tsx / ModalProvider.tsx   Modal + carrousel accessibles
  Media.tsx / LazyVideo.tsx   Primitives image (next/image) & vidéo (lazy)
  Reveal.tsx / LineReveal.tsx / Counter.tsx   Primitives d'animation
lib/
  portfolio.ts      Types, sélecteurs, helpers CDN, métadonnées éditoriales
  content.json      Contenu source (conservé du site actuel)
  anim.ts           Variants & easings partagés
```

## Ajouter / modifier un projet

Éditer `lib/content.json` (même schéma que le site actuel : `name`, `type`,
`description`, `format`, `photos[]` / `videos[]` pointant vers un chemin CloudFront).
Les catégories, grilles et modals se régénèrent automatiquement.

## Déploiement — images & ressources serveur

Par défaut, `images.unoptimized: true` (dans `next.config.mjs`) : les médias sont
servis **directement depuis CloudFront**, sans ré-encodage côté serveur. C'est le
bon choix sur un **VPS modeste** — l'optimisation AVIF/WebP à la volée via `sharp`
est très gourmande en CPU (elle saturait le VPS et provoquait des crash-loops
`TimeoutError`). Les images gardent lazy-loading + aspect-ratio (anti-CLS) ; le CDN
fait le reste.

Sur un **hébergement costaud** (Vercel, VPS ≥ 2 vCPU dédiés), on peut ré-activer
l'optimisation Next : `unoptimized: false` + décommenter `formats`/`deviceSizes`.

**Ne pas builder sur un petit VPS.** `next build` est lourd (CPU/RAM). Compiler
plutôt sur un runner GitHub-hosted (ou une machine dédiée) et n'expédier que le
résultat (`.next`, `public`, `package.json`, `node_modules` de prod). Un runner
self-hosted qui build sur la même machine que le serveur de prod pinne le CPU.
