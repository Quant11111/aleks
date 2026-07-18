"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, inViewOnce } from "@/lib/anim";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Décalage vertical initial (px) */
  y?: number;
  /** Retard (s) — utile pour orchestrer une séquence */
  delay?: number;
  duration?: number;
  as?: "div" | "section" | "li" | "span" | "p";
}

/** Enveloppe un bloc pour le révéler en fondu montant à l'entrée dans le viewport. */
export default function Reveal({
  children,
  className,
  y = 32,
  delay = 0,
  duration = 0.7,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  );
}
