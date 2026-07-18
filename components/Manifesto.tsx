"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { profile } from "@/lib/portfolio";
import { EASE_OUT, maskLine, staggerContainer } from "@/lib/anim";
import Reveal from "./Reveal";
import styles from "./Manifesto.module.css";

const LINES: ReactNode[] = [
  <>Je conçois des identités</>,
  <>
    qui se <em className={`${styles.accent} text-gradient`}>regardent</em>, des
    événements
  </>,
  <>
    qui se <em className={`${styles.accent} text-gradient`}>vivent</em> et des
    images
  </>,
  <>
    qui ne s'<em className={`${styles.accent} text-gradient`}>oublient</em> pas.
  </>,
];

export default function Manifesto() {
  const reduce = useReducedMotion();

  return (
    <section className={styles.section} aria-label="Manifeste">
      <div className="container">
        <Reveal as="span" className={styles.eyebrow}>
          (Manifeste)
        </Reveal>

        <motion.p
          className={styles.statement}
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer(0.12)}
        >
          {LINES.map((line, i) => (
            <span key={i} className={styles.line}>
              <motion.span
                className={styles.lineInner}
                variants={maskLine}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <div className={styles.footer}>
          <Reveal as="span" className={styles.signature}>
            À propos
          </Reveal>
          <Reveal as="p" className={styles.bio} delay={0.05}>
            {profile.name}, designer graphique, motion designer et coordinatrice
            événementielle basée entre {profile.locations[0]}, {profile.locations[1]} et{" "}
            {profile.locations[2]}. De l'identité visuelle à l'animation 3D, de la
            direction artistique à l'organisation d'événements réunissant des
            milliers de personnes — je façonne des expériences où le graphisme
            rencontre le réel.
          </Reveal>
        </div>
      </div>
    </section>
  );
}
