"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  cover?: boolean;
  controls?: boolean;
  loop?: boolean;
  /** Lecture auto dès l'entrée dans le viewport (hero / modal). */
  autoPlay?: boolean;
  /** Lecture contrôlée par le parent (survol d'une carte). */
  play?: boolean;
}

/**
 * Vidéo à chargement différé : la source n'est attachée qu'à l'approche du
 * viewport (économie de bande passante), puis lue selon le contexte.
 */
export default function LazyVideo({
  src,
  poster,
  className,
  cover = true,
  controls = false,
  loop = true,
  autoPlay = false,
  play,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Muet impératif (fiabilise l'autoplay cross-navigateur).
  useEffect(() => {
    if (ref.current) ref.current.muted = true;
  }, []);

  // Active la source à l'approche du viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay quand la source est prête et visible.
  useEffect(() => {
    const v = ref.current;
    if (v && autoPlay && active) v.play().catch(() => {});
  }, [autoPlay, active]);

  // Lecture contrôlée (survol de carte).
  useEffect(() => {
    const v = ref.current;
    if (!v || play === undefined) return;
    if (play) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [play]);

  return (
    <video
      ref={ref}
      className={className}
      src={active ? src : undefined}
      poster={poster}
      loop={loop}
      muted
      playsInline
      controls={controls}
      preload={active ? "metadata" : "none"}
      aria-hidden={controls ? undefined : true}
      style={{
        width: "100%",
        height: "100%",
        objectFit: cover ? "cover" : "contain",
      }}
    />
  );
}
