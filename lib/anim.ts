import type { Variants, Transition } from "framer-motion";

/* Courbe d'accélération signature (identique au --ease-out du site). */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.6,
};

/* Apparition douce vers le haut (reveal générique). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay: i * 0.08 },
  }),
};

/* Conteneur qui décale l'apparition de ses enfants. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/* Ligne révélée derrière un masque (translateY). */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

/* Fenêtre d'observation par défaut pour les reveals au scroll. */
export const inViewOnce = { once: true, amount: 0.35 } as const;
