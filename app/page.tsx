import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Stats from "@/components/Stats";
import FeaturedProject from "@/components/FeaturedProject";
import Work from "@/components/Work";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Stats />
      <FeaturedProject
        name="Showreel"
        kicker="Showreel"
        tagline="Un medley de créations motion design 2D & 3D. La synthèse d'un langage visuel en mouvement."
        ctaLabel="Voir le showreel"
      />
      <Work />
      <FeaturedProject
        name="Union Sauvage, URBX Festival"
        kicker="Projet phare"
        tagline="Une journée de 10h à 2h : défilé, marché de créateurs, street art, showcases et DJ sets. 3 000 visiteurs au cœur d'un ancien couvent réhabilité."
        ctaLabel="Découvrir l'événement"
      />
      <Contact />
    </>
  );
}
