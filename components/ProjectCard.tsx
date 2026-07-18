"use client";

import { useState, type KeyboardEvent } from "react";
import type { Project } from "@/lib/portfolio";
import { useModal } from "./ModalProvider";
import Media from "./Media";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  sizes?: string;
}

export default function ProjectCard({ project, sizes }: ProjectCardProps) {
  const { openProject } = useModal();
  const [hovered, setHovered] = useState(false);
  const isVideo = project.cover.kind === "video";

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProject(project);
    }
  };

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      aria-label={`Voir le projet : ${project.name}`}
      onClick={() => openProject(project)}
      onKeyDown={onKey}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className={styles.media}>
        <Media
          media={project.cover}
          mode="cover"
          sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          play={isVideo ? hovered : undefined}
        />
      </div>

      {isVideo && (
        <span className={styles.badge} aria-hidden="true">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <path d="M0 0l12 7-12 7z" />
          </svg>
        </span>
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{project.name}</h3>
        {project.description && (
          <p className={styles.desc}>{project.description}</p>
        )}
      </div>
    </article>
  );
}
