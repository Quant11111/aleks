"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { hero, profile } from "@/lib/portfolio";
import { EASE_OUT } from "@/lib/anim";
import { useScrollApi } from "./SmoothScroll";
import LazyVideo from "./LazyVideo";
import styles from "./Hero.module.css";

const TITLE_LINES = ["CREATIVE", "DIRECTOR"];

export default function Hero() {
  const reduce = useReducedMotion();
  const scroll = useScrollApi();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="accueil" ref={ref} className={styles.hero} aria-label="Accueil">
      <motion.div
        className={styles.text}
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
      >
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
        >
          Portfolio · Directrice de création
        </motion.span>

        <h1 className={styles.title}>
          {TITLE_LINES.map((line, i) => (
            <span key={line} className={styles.line}>
              <motion.span
                className={`${styles.lineInner} ${i === 1 ? "text-gradient" : ""}`}
                initial={reduce ? undefined : { y: "110%" }}
                animate={reduce ? undefined : { y: "0%" }}
                transition={{
                  duration: 1,
                  ease: EASE_OUT,
                  delay: 0.25 + i * 0.12,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.55 }}
        >
          {profile.roles.join(", ").replace(/, ([^,]*)$/, " & $1")}.
          <br />
          {profile.locations.slice(0, 3).join(" — ")}.
        </motion.p>

        <motion.button
          type="button"
          className={styles.cta}
          onClick={() => scroll.scrollTo("#work", -60)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.7 }}
        >
          Voir les projets
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1v12M2 8l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
        </motion.button>
      </motion.div>

      <motion.div
        className={styles.media}
        style={reduce ? undefined : { y: mediaY, scale: mediaScale }}
      >
        <LazyVideo src={hero.video} poster={hero.poster} autoPlay cover />
        <div className={styles.overlay} />
      </motion.div>

      <span className={styles.scrollCue} aria-hidden="true">
        Scroll
      </span>
    </section>
  );
}
