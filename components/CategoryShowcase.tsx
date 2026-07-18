"use client";

import {
  categoryMeta,
  projectsByCategory,
  type CategoryId,
} from "@/lib/portfolio";
import LineReveal from "./LineReveal";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import styles from "./CategoryShowcase.module.css";

interface CategoryShowcaseProps {
  category: CategoryId;
  alt?: boolean;
}

export default function CategoryShowcase({
  category,
  alt = false,
}: CategoryShowcaseProps) {
  const meta = categoryMeta(category);
  const projects = projectsByCategory(category);

  return (
    <section
      id={`cat-${category}`}
      className={`${styles.showcase} ${alt ? styles.alt : ""}`}
      aria-label={meta.title}
    >
      <div className="container">
        <header className={styles.head}>
          <div className={styles.headTop}>
            <span className={styles.index}>{meta.index}</span>
            <LineReveal
              as="h2"
              lines={[meta.title]}
              className={styles.title}
            />
          </div>
          <div className={styles.meta}>
            <Reveal as="p" className={styles.tagline}>
              {meta.tagline}
            </Reveal>
            <Reveal as="span" className={styles.count} delay={0.05}>
              {String(projects.length).padStart(2, "0")} projet
              {projects.length > 1 ? "s" : ""}
            </Reveal>
          </div>
        </header>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              className={styles.cell}
              delay={Math.min(i, 5) * 0.06}
            >
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
