"use client";

import { motion, useReducedMotion } from "framer-motion";
import { createElement, type ElementType } from "react";
import { EASE_OUT, maskLine, staggerContainer } from "@/lib/anim";

interface LineRevealProps {
  /** Chaque entrée est révélée derrière son propre masque. */
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Décalage entre les lignes (s) */
  stagger?: number;
  delay?: number;
}

/**
 * Révélation éditoriale ligne par ligne : chaque ligne monte derrière un
 * masque (overflow hidden), effet signature du site de référence.
 */
export default function LineReveal({
  lines,
  as = "h2",
  className,
  stagger = 0.12,
  delay = 0,
}: LineRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return createElement(
      as,
      { className },
      lines.map((line, i) => (
        <span key={i} style={{ display: "block" }}>
          {line}
        </span>
      ))
    );
  }

  return createElement(
    motion[as as keyof typeof motion] as ElementType,
    {
      className,
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, amount: 0.6 },
      variants: staggerContainer(stagger, delay),
    },
    lines.map((line, i) => (
      <span
        key={i}
        style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}
      >
        <motion.span
          style={{ display: "block", willChange: "transform" }}
          variants={maskLine}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          {line}
        </motion.span>
      </span>
    ))
  );
}
