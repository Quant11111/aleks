"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { categoryMeta, type Project } from "@/lib/portfolio";
import { EASE_OUT } from "@/lib/anim";
import { useScrollApi } from "./SmoothScroll";
import Media from "./Media";
import styles from "./ProjectModal.module.css";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const reduce = useReducedMotion();
  const scroll = useScrollApi();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);

  const total = project.media.length;
  const meta = categoryMeta(project.category);
  const current = project.media[index];

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + total) % total);
    },
    [total]
  );

  // Verrou du scroll + mémorisation du focus déclencheur.
  useEffect(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    scroll.stop();
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      scroll.start();
      lastFocused.current?.focus?.();
    };
  }, [scroll]);

  // Clavier : Escape, flèches, piège à focus (Tab).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft" && total > 1) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight" && total > 1) {
        e.preventDefault();
        go(1);
      } else if (e.key === "Tab") {
        const nodes = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose, total]);

  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.985 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.985 },
      };

  return createPortal(
    <motion.div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Projet : ${project.name}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <motion.div
        className={styles.content}
        {...fade}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          aria-label="Fermer"
          onClick={onClose}
        >
          &times;
        </button>

        <div className={styles.stage}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className={styles.frame}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
            >
              <Media
                media={current}
                mode="contain"
                sizes="(max-width: 900px) 100vw, 62vw"
                controls={current.kind === "video"}
                autoPlay={current.kind === "video"}
                priority
              />
            </motion.div>
          </AnimatePresence>

          {total > 1 && (
            <>
              <button
                type="button"
                className={`${styles.nav} ${styles.prev}`}
                aria-label="Média précédent"
                onClick={() => go(-1)}
              >
                &#8249;
              </button>
              <button
                type="button"
                className={`${styles.nav} ${styles.next}`}
                aria-label="Média suivant"
                onClick={() => go(1)}
              >
                &#8250;
              </button>
              <div className={styles.counter} role="tablist" aria-label="Médias">
                {project.media.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Média ${i + 1} sur ${total}`}
                    className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className={styles.info} data-lenis-prevent>
          <div className={styles.kicker}>
            <span>{meta.label}</span>
          </div>
          <h2 className={styles.title}>{project.name}</h2>
          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
