import rawContent from "./content.json";

/* ============================================================================
   Domaine — Portfolio d'Alexandra
   Le contenu (content.json) est CONSERVÉ à l'identique ; on le type et on
   dérive ici les informations éditoriales à mettre en valeur.
   ========================================================================== */

export const CDN = "https://d5u195w6r6k85.cloudfront.net";

export type CategoryId =
  | "evenement"
  | "communication"
  | "graphisme"
  | "motion-design";

export type MediaFormat = "portrait" | "paysage" | "carre";

export type MediaKind = "image" | "video" | "gif";

export interface MediaAsset {
  name: string;
  description: string;
}

export interface RawProject {
  name: string;
  type: string;
  description: string;
  format: string;
  hideText?: boolean;
  photos?: MediaAsset[];
  videos?: MediaAsset[];
}

export interface ResolvedMedia {
  kind: MediaKind;
  url: string;
  alt: string;
}

export interface Project {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  format: MediaFormat;
  cover: ResolvedMedia;
  media: ResolvedMedia[];
}

/* --- Helpers médias -------------------------------------------------------- */

/** Construit une URL CDN en encodant chaque segment (gère les espaces, accents…). */
export function mediaUrl(name: string): string {
  return `${CDN}/${name.split("/").map(encodeURIComponent).join("/")}`;
}

function kindOf(name: string): MediaKind {
  const n = name.toLowerCase();
  if (n.endsWith(".gif")) return "gif";
  if (/\.(mp4|mov|webm|m4v)$/.test(n)) return "video";
  return "image";
}

function resolveAsset(asset: MediaAsset, fallbackAlt: string): ResolvedMedia {
  return {
    kind: kindOf(asset.name),
    url: mediaUrl(asset.name),
    alt: asset.description || fallbackAlt,
  };
}

/** Slug stable et unique à partir du nom + index (pour les clés/ancres). */
function slugify(input: string, index: number): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "projet"}-${index}`;
}

const CATEGORY_IDS: CategoryId[] = [
  "evenement",
  "communication",
  "graphisme",
  "motion-design",
];

function isCategory(type: string): type is CategoryId {
  return (CATEGORY_IDS as string[]).includes(type);
}

/* --- Construction des projets typés ---------------------------------------- */

const projects: Project[] = (rawContent as RawProject[])
  .map((raw, index): Project | null => {
    // On ignore les entrées cachées et la vidéo "landing" (doublon du court-métrage).
    if (raw.hideText || !isCategory(raw.type)) return null;

    const assets: ResolvedMedia[] = [
      ...(raw.photos ?? []).map((p) => resolveAsset(p, raw.name)),
      ...(raw.videos ?? []).map((v) => resolveAsset(v, raw.name)),
    ];
    if (assets.length === 0) return null;

    return {
      id: slugify(raw.name, index),
      name: raw.name,
      category: raw.type,
      description: raw.description ?? "",
      format: (["portrait", "paysage", "carre"].includes(raw.format)
        ? raw.format
        : "carre") as MediaFormat,
      cover: assets[0],
      media: assets,
    };
  })
  .filter((p): p is Project => p !== null);

export const allProjects = projects;

export function projectsByCategory(category: CategoryId): Project[] {
  return projects.filter((p) => p.category === category);
}

/* --- Métadonnées éditoriales des catégories -------------------------------- */

export interface CategoryMeta {
  id: CategoryId;
  index: string;
  /** Libellé court (navigation) */
  label: string;
  /** Titre éditorial */
  title: string;
  tagline: string;
}

export const categories: CategoryMeta[] = [
  {
    id: "evenement",
    index: "01",
    label: "Events",
    title: "Événementiel",
    tagline:
      "Défilés, festivals, inaugurations. Des rassemblements pensés comme des expériences collectives.",
  },
  {
    id: "communication",
    index: "02",
    label: "Com",
    title: "Communication",
    tagline:
      "Contenus social, affiches et brochures. Une présence digitale qui fédère et fait grandir les communautés.",
  },
  {
    id: "graphisme",
    index: "03",
    label: "Design",
    title: "Design graphique",
    tagline:
      "Identités, illustrations, packaging. Un vocabulaire visuel affirmé, du concept à l'objet.",
  },
  {
    id: "motion-design",
    index: "04",
    label: "Motion",
    title: "Motion design",
    tagline:
      "Animation 2D & 3D, court-métrage, stop-motion. Donner un mouvement — et une âme — aux images.",
  },
];

export function categoryMeta(id: CategoryId): CategoryMeta {
  return categories.find((c) => c.id === id)!;
}

/* --- Profil & contact (conservés du site actuel) --------------------------- */

export const profile = {
  name: "Alexandra",
  roleShort: "Directrice de création",
  roles: [
    "Designer graphique",
    "Motion designer",
    "Coordinatrice événementielle",
  ],
  locations: ["Lille", "Paris", "Biarritz", "Bordeaux", "Marseille"],
  email: "aleks.solinas@gmail.com",
  phoneDisplay: "+33 6 18 66 35 65",
  phoneHref: "+33618663565",
  services: ["Design", "Motion", "Events"],
};

/* --- Média du hero (identique au site actuel) ------------------------------ */

export const hero = {
  video: mediaUrl("home/i_am_alexandra.mp4"),
  poster: mediaUrl("home/i_am_alexandra_poster.webp"),
};

/* --- Manifeste (forme nouvelle, fond dérivé du positionnement) ------------- */

export const manifesto = [
  "Je conçois des identités",
  "qui se regardent, des événements",
  "qui se vivent et des images",
  "qui ne s'oublient pas.",
];

/* --- Chiffres d'impact (informations tirées du contenu existant) ----------- */

export interface ImpactStat {
  value: number;
  suffix: string;
  label: string;
  context: string;
}

export const impactStats: ImpactStat[] = [
  {
    value: 3000,
    suffix: "+",
    label: "Visiteurs en une journée",
    context: "Union Sauvage · URBX Festival",
  },
  {
    value: 1500,
    suffix: "+",
    label: "Personnes rassemblées",
    context: "Closing mediumRARE",
  },
  {
    value: 1900,
    suffix: "",
    label: "Abonnés en 18 mois",
    context: "Communauté mediumRARE",
  },
  {
    value: 223,
    suffix: "k",
    label: "De reach média",
    context: "Relais presse & Lille Addict",
  },
];

/** Retourne un projet par nom exact (sélection des projets phares). */
export function projectByName(name: string): Project | undefined {
  return projects.find((p) => p.name === name);
}

/** Premier projet d'une catégorie possédant une vidéo (pour les blocs parallax). */
export function firstVideoProject(category: CategoryId): Project | undefined {
  return projects.find(
    (p) => p.category === category && p.cover.kind === "video"
  );
}
