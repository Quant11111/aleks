"use client";

import { impactStats } from "@/lib/portfolio";
import Counter from "./Counter";
import Reveal from "./Reveal";
import styles from "./Stats.module.css";

export default function Stats() {
  return (
    <section className={styles.section} aria-label="Impact">
      <div className="container">
        <div className={styles.head}>
          <Reveal as="span" className={styles.eyebrow}>
            (Impact)
          </Reveal>
          <Reveal as="p" className={styles.headline} delay={0.05}>
            Des projets qui rassemblent, fédèrent et laissent une trace.
          </Reveal>
        </div>

        <div className={styles.grid}>
          {impactStats.map((stat, i) => (
            <Reveal key={stat.label} className={styles.stat} delay={i * 0.08}>
              <span className={styles.value}>
                <Counter value={stat.value} />
                {stat.suffix && <sup>{stat.suffix}</sup>}
              </span>
              <span className={styles.label}>{stat.label}</span>
              <span className={styles.context}>{stat.context}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
