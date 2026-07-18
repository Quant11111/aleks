"use client";

import Image from "next/image";
import LazyVideo from "./LazyVideo";
import type { ResolvedMedia } from "@/lib/portfolio";

interface MediaProps {
  media: ResolvedMedia;
  mode?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  /** Contrôle la lecture (survol de carte) pour les vidéos. */
  play?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

/**
 * Rend un média résolu (image / gif / vidéo) en remplissant son conteneur
 * (qui doit être `position: relative`). Images optimisées via next/image.
 */
export default function Media({
  media,
  mode = "cover",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  play,
  autoPlay = false,
  controls = false,
  className,
}: MediaProps) {
  if (media.kind === "video") {
    return (
      <LazyVideo
        src={media.url}
        className={className}
        cover={mode === "cover"}
        controls={controls}
        autoPlay={autoPlay}
        play={play}
      />
    );
  }

  // image ou gif animé (gif : on désactive l'optimisation pour garder l'animation)
  return (
    <Image
      src={media.url}
      alt={media.alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={media.kind === "gif"}
      className={className}
      style={{ objectFit: mode }}
    />
  );
}
