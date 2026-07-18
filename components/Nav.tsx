"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollApi } from "./SmoothScroll";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Accueil", id: "accueil" },
  { label: "Events", id: "cat-evenement" },
  { label: "Com", id: "cat-communication" },
  { label: "Design", id: "cat-graphisme" },
  { label: "Motion", id: "cat-motion-design" },
  { label: "Contact", id: "contact" },
];

const NAV_OFFSET = -80;

export default function Nav() {
  const scroll = useScrollApi();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const lastY = useRef(0);

  // Auto-hide + état "scrolled"
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (!open) setHidden(y > lastY.current && y > 140);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Scroll-spy : section active
  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Verrou du scroll de fond quand le menu mobile est ouvert
  useEffect(() => {
    if (open) scroll.stop();
    else scroll.start();
  }, [open, scroll]);

  const goTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      // léger différé pour laisser le menu se fermer avant le scroll
      requestAnimationFrame(() => scroll.scrollTo(el, NAV_OFFSET));
    }
  };

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""} ${
        hidden ? styles.hidden : ""
      }`}
      aria-label="Navigation principale"
    >
      <div className={styles.inner}>
        <button
          className={styles.logo}
          onClick={() => goTo("accueil")}
          aria-label="Alexandra — Accueil"
        >
          ALEXANDRA<b>.</b>
        </button>

        <ul
          id="nav-menu"
          className={`${styles.menu} ${open ? styles.menuOpen : ""}`}
        >
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                className={`${styles.link} ${
                  active === l.id ? styles.active : ""
                }`}
                onClick={() => goTo(l.id)}
                aria-current={active === l.id ? "true" : undefined}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="nav-menu"
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>
    </nav>
  );
}
