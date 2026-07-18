"use client";

import { profile } from "@/lib/portfolio";
import { useScrollApi } from "./SmoothScroll";
import Reveal from "./Reveal";
import styles from "./Contact.module.css";

export default function Contact() {
  const scroll = useScrollApi();

  return (
    <footer id="contact" className={styles.contact}>
      <div className="container">
        <Reveal as="span" className={styles.eyebrow}>
          (Contact)
        </Reveal>

        <Reveal>
          <h2 className={styles.headline}>
            Travaillons <em className="text-gradient">ensemble</em>.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <a href={`mailto:${profile.email}`} className={styles.emailLink}>
            {profile.email}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M5 17L17 5M17 5H7M17 5v10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.item}>
            <h3>Téléphone</h3>
            <a href={`tel:${profile.phoneHref}`}>{profile.phoneDisplay}</a>
          </Reveal>
          <Reveal className={styles.item} delay={0.06}>
            <h3>Localisation</h3>
            <span>{profile.locations.join(", ")}</span>
          </Reveal>
          <Reveal className={styles.item} delay={0.12}>
            <h3>Services</h3>
            <span className={styles.services}>
              {profile.services.map((s, i) => (
                <span key={s}>
                  {s}
                  {i < profile.services.length - 1 ? " • " : ""}
                </span>
              ))}
            </span>
          </Reveal>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>© {new Date().getFullYear()} {profile.name}</span>
          <button
            type="button"
            className={styles.top}
            onClick={() => scroll.scrollTo(0)}
          >
            Haut de page
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 11V1M2 5l4-4 4 4" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
