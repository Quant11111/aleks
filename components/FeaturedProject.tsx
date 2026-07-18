"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { categoryMeta, projectByName } from "@/lib/portfolio";
import { EASE_OUT } from "@/lib/anim";
import { useModal } from "./ModalProvider";
import Media from "./Media";
import styles from "./FeaturedProject.module.css";

interface FeaturedProjectProps {
  /** Nom exact du projet (issu du contenu). */
  name: string;
  kicker: string;
  tagline: string;
  ctaLabel?: string;
}

export default function FeaturedProject({
  name,
  kicker,
  tagline,
  ctaLabel = "Découvrir le projet",
}: FeaturedProjectProps) {
  const reduce = useReducedMotion();
  const { openProject } = useModal();
  const ref = useRef<HTMLElement>(null);
  const project = projectByName(name);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  if (!project) return null;
  const isVideo = project.cover.kind === "video";

  return (
    <section
      ref={ref}
      className={styles.featured}
      aria-label={`Projet phare : ${project.name}`}
    >
      <motion.div
        className={styles.mediaWrap}
        style={reduce ? undefined : { y }}
      >
        <Media
          media={project.cover}
          mode="cover"
          sizes="100vw"
          autoPlay={isVideo}
        />
        <div className={styles.overlay} />
      </motion.div>

      <div className={`container ${styles.inner}`}>
        <motion.span
          className={styles.kicker}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {kicker} · {categoryMeta(project.category).label}
        </motion.span>

        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.05 }}
        >
          {project.name}
        </motion.h2>

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.12 }}
        >
          {tagline}
        </motion.p>

        <motion.button
          type="button"
          className={styles.cta}
          onClick={() => openProject(project)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.18 }}
        >
          {ctaLabel}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            <path d="M1 6h13M9 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </motion.button>
      </div>
    </section>
  );
}
