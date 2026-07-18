"use client";

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ScrollApi {
  scrollTo: (target: string | HTMLElement | number, offset?: number) => void;
  stop: () => void;
  start: () => void;
}

const ScrollContext = createContext<ScrollApi | null>(null);

/** API de défilement (nav ancrée, verrouillage modal). Fallback natif si Lenis absent. */
export function useScrollApi(): ScrollApi {
  const ctx = useContext(ScrollContext);
  if (ctx) return ctx;
  // Fallback (reduced-motion ou hors provider)
  return {
    scrollTo: (target, offset = 0) => {
      if (typeof window === "undefined") return;
      const el =
        typeof target === "string"
          ? document.querySelector(target)
          : target instanceof HTMLElement
            ? target
            : null;
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    },
    stop: () => {
      document.body.style.overflow = "hidden";
    },
    start: () => {
      document.body.style.overflow = "";
    },
  };
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [api, setApi] = useState<ScrollApi | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return; // on garde le scroll natif

    const lenis = new Lenis({
      duration: 1.1,
      // ease-out exponentiel, cohérent avec la signature du site
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    setApi({
      scrollTo: (target, offset = 0) =>
        lenis.scrollTo(target as string, {
          offset,
          duration: 1.2,
        }),
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setApi(null);
    };
  }, []);

  return (
    <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
  );
}
