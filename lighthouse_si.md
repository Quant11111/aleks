# Plan d'Optimisation Speed Index (SI) - Portfolio Alexandra

## Diagnostic Initial

Le Speed Index mesure la rapidité d'affichage **visuel** du contenu. Un mauvais score SI indique que les utilisateurs voient le contenu se charger progressivement plutôt qu'instantanément.

### Facteurs Impactant Actuellement le SI

**Bloquants Majeurs Identifiés:**
1. **Vidéo hero autoplay** (index.html:104-109) - Bloque l'affichage initial avec ~3-5MB de vidéo
2. **Polices Google Fonts** (index.html:63-68) - Chargement bloquant de 2 familles de polices
3. **JavaScript bloquant** (script.js chargé à la fin mais exécuté avant affichage complet)
4. **Fetch de content.json** (script.js:55-67) - Chargement asynchrone retardant l'affichage du portfolio
5. **Absence de preload pour ressources critiques** - Pas de priorisation des assets importants
6. **CSS non-optimisé** (styles.css ~914 lignes) - Tout chargé d'un coup sans critical path CSS

---

## Milestones d'Amélioration

### MILESTONE 1 - Quick Wins (Gain SI: 0.8-1.2s) ✅ Priorité Haute

**Objectif:** Affichage instantané du squelette visuel de la page

#### Actions:
- [ ] **1.1 - Précharger les polices critiques**
  ```html
  <!-- Ajouter dans <head> avant le link Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.gstatic.com/s/inter/..." as="font" type="font/woff2" crossorigin>
  ```
  - Fichier: [index.html:63](index.html#L63)
  - Impact SI: -0.3 à -0.5s

- [ ] **1.2 - Ajouter font-display: swap aux polices**
  ```html
  <!-- Modifier le link existant ligne 65-68 -->
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@300;400;500&display=swap"
  ```
  - Fichier: [index.html:65-68](index.html#L65-L68)
  - Impact SI: -0.2 à -0.4s

- [ ] **1.3 - Précharger content.json**
  ```html
  <!-- Ajouter dans <head> -->
  <link rel="preload" href="./content.json" as="fetch" crossorigin>
  ```
  - Fichier: [index.html](index.html)
  - Impact SI: -0.3s

**Validation:** Tester avec Lighthouse → SI devrait passer de ~5s à ~3.8s

---

### MILESTONE 2 - Critical CSS (Gain SI: 0.6-1.0s) ✅ Priorité Haute

**Objectif:** Affichage immédiat du contenu above-the-fold

#### Actions:
- [ ] **2.1 - Extraire le CSS critique (Hero + Nav)**
  - Identifier les styles pour .hero, .navbar, .hero-title, .hero-video
  - Inline ce CSS dans `<style>` dans le `<head>`
  - Déplacer styles.css en fin de `<body>` avec `media="print" onload="this.media='all'"`

  ```html
  <head>
    <style>
      /* CSS critique inline (environ 100-150 lignes) */
      /* Variables, reset, navbar, hero section uniquement */
    </style>
  </head>
  <body>
    ...
    <link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="styles.css"></noscript>
  </body>
  ```
  - Fichiers: [index.html](index.html), [styles.css](styles.css)
  - Impact SI: -0.6 à -1.0s

**Validation:** Lighthouse → SI devrait passer à ~2.8-3.2s

---

### MILESTONE 3 - Optimisation Vidéo Hero (Gain SI: 1.0-1.5s) ✅ Priorité Critique

**Objectif:** Remplacer l'autoplay vidéo par une stratégie de chargement optimisée

#### Actions:
- [ ] **3.1 - Créer une image poster optimisée**
  - Extraire la première frame de `hellocaleks.MOV`
  - Convertir en WebP optimisé (~50-100KB max)
  - Upload sur CloudFront: `home/hellocaleks-poster.webp`

- [ ] **3.2 - Modifier la vidéo hero avec poster et lazy loading**
  ```html
  <!-- Modifier index.html:104-109 -->
  <video class="hero-video"
         poster="https://d5u195w6r6k85.cloudfront.net/home/hellocaleks-poster.webp"
         preload="none"
         muted
         loop
         playsinline
         id="heroVideo">
    <source src="https://d5u195w6r6k85.cloudfront.net/home/hellocaleks.MOV" type="video/mp4">
  </video>
  ```
  - Fichier: [index.html:104-109](index.html#L104-L109)

- [ ] **3.3 - Charger la vidéo après l'affichage initial**
  ```javascript
  // Ajouter dans script.js après DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    // Attendre que le contenu visible soit rendu
    setTimeout(() => {
      const heroVideo = document.getElementById('heroVideo');
      if (heroVideo && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              heroVideo.play().catch(() => {});
              observer.disconnect();
            }
          });
        });
        observer.observe(heroVideo);
      } else if (heroVideo) {
        heroVideo.play().catch(() => {});
      }
    }, 100);
  });
  ```
  - Fichier: [script.js](script.js)
  - Impact SI: -1.0 à -1.5s

**Validation:** Lighthouse → SI devrait passer à ~1.8-2.2s

---

### MILESTONE 4 - Optimisation JavaScript (Gain SI: 0.4-0.6s) ✅ Priorité Moyenne

**Objectif:** Minimiser le temps de blocage du thread principal

#### Actions:
- [ ] **4.1 - Différer le chargement du Service Worker**
  ```javascript
  // Modifier script.js:606-617
  // Déplacer l'enregistrement SW après 3 secondes
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered:', reg))
          .catch(err => console.log('SW failed:', err));
      }, 3000);
    });
  }
  ```
  - Fichier: [script.js:606-617](script.js#L606-L617)

- [ ] **4.2 - Optimiser loadPortfolioData avec cache**
  ```javascript
  // Ajouter un cache local storage pour content.json
  async function loadPortfolioData() {
    try {
      // Vérifier le cache localStorage
      const cached = localStorage.getItem('portfolio_cache');
      const cacheTime = localStorage.getItem('portfolio_cache_time');
      const now = Date.now();

      // Cache valide 1 heure
      if (cached && cacheTime && (now - parseInt(cacheTime)) < 3600000) {
        portfolioData = JSON.parse(cached);
        generatePortfolioSections();
      }

      // Fetch en background pour mise à jour
      const response = await fetch('./content.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      portfolioData = await response.json();

      // Mettre à jour le cache
      localStorage.setItem('portfolio_cache', JSON.stringify(portfolioData));
      localStorage.setItem('portfolio_cache_time', now.toString());

      generatePortfolioSections();
    } catch (error) {
      console.error('Erreur chargement:', error);
      showErrorMessage();
    }
  }
  ```
  - Fichier: [script.js:55-67](script.js#L55-L67)
  - Impact SI: -0.2 à -0.3s

- [ ] **4.3 - Ajouter l'attribut async au script**
  ```html
  <!-- Modifier index.html:201 -->
  <script src="script.js" defer></script>
  ```
  - Fichier: [index.html:201](index.html#L201)
  - Impact SI: -0.2 à -0.3s

**Validation:** Lighthouse → SI devrait passer à ~1.4-1.8s

---

### MILESTONE 5 - Optimisation Images Portfolio (Gain SI: 0.2-0.4s) ✅ Priorité Basse

**Objectif:** Améliorer le rendu visuel progressif du portfolio

#### Actions:
- [ ] **5.1 - Ajouter des placeholders LQIP (Low Quality Image Placeholder)**
  - Générer des versions blur/low-res (~2-5KB) des images de portfolio
  - Afficher ces placeholders pendant le chargement lazy

- [ ] **5.2 - Optimiser l'IntersectionObserver pour le lazy loading**
  ```javascript
  // Modifier script.js:430-441
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px 200px 0px", // Charger 200px avant d'être visible
  };
  ```
  - Fichier: [script.js:430-441](script.js#L430-L441)
  - Impact SI: -0.2 à -0.4s

**Validation:** Lighthouse → SI devrait atteindre objectif < 1.8s

---

## Objectifs de Score SI

| Milestone | Score SI Cible | État Actuel | Amélioration |
|-----------|---------------|-------------|--------------|
| Baseline  | ~5.0s         | ❌ Rouge    | -            |
| M1        | ~3.8s         | ⚠️ Orange   | ↑ 24%        |
| M2        | ~2.8s         | ⚠️ Orange   | ↑ 44%        |
| M3        | ~1.8s         | ✅ Vert     | ↑ 64%        |
| M4        | ~1.4s         | ✅ Vert     | ↑ 72%        |
| M5        | < 1.3s        | ✅ Vert     | ↑ 74%        |

**Seuils Lighthouse SI:**
- ✅ **Bon**: < 1.8s
- ⚠️ **Moyen**: 1.8-3.4s
- ❌ **Mauvais**: > 3.4s

---

## Ordre de Priorité Recommandé

1. **MILESTONE 3** (Impact critique) - Vidéo hero
2. **MILESTONE 1** (Quick wins) - Preload & fonts
3. **MILESTONE 2** (Impact majeur) - Critical CSS
4. **MILESTONE 4** (Optimisation JS) - Scripts différés
5. **MILESTONE 5** (Polish final) - Images portfolio

---

## Validation et Mesure

**Outils de mesure:**
- Lighthouse (Chrome DevTools) - Score officiel
- WebPageTest.org - Filmstrip visuel du SI
- Chrome DevTools Performance tab - Trace détaillée

**Processus de validation:**
1. Implémenter un milestone
2. Tester en mode incognito
3. Vider le cache
4. Exécuter Lighthouse 3 fois
5. Prendre la médiane des scores SI
6. Comparer avec baseline

**Commande de test:**
```bash
# Lancer le serveur local
./start.sh

# Ouvrir Chrome DevTools → Lighthouse
# Mode: Navigation
# Catégorie: Performance
# Device: Mobile & Desktop
```

---

## Notes Techniques

**Pourquoi le SI est mauvais actuellement:**
- La vidéo hero (3-5MB) bloque l'affichage visuel initial
- Les polices Google Fonts retardent le rendu du texte
- Tout le CSS est chargé avant affichage (render-blocking)
- content.json est fetché avant d'afficher le portfolio
- Pas de stratégie de priorisation des ressources critiques

**Impact de chaque optimisation:**
- Vidéo hero avec poster: **Impact le plus fort** (60% de l'amélioration)
- Critical CSS inline: **Impact majeur** (25% de l'amélioration)
- Preload & fonts: **Impact modéré** (10% de l'amélioration)
- JS defer & cache: **Impact modéré** (5% de l'amélioration)

**Architecture actuelle à préserver:**
- Pas de build process (vanilla JS/HTML/CSS)
- CloudFront CDN pour les medias (déjà optimal)
- Mobile-first responsive (bon pour Core Web Vitals)
