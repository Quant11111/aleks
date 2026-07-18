import { categories } from "@/lib/portfolio";
import CategoryShowcase from "./CategoryShowcase";
import Reveal from "./Reveal";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <div id="work">
      <div className={styles.intro}>
        <div className="container">
          <Reveal as="span" className={styles.eyebrow}>
            (Travaux)
          </Reveal>
          <Reveal>
            <h2 className={styles.heading}>
              Sélection de <em className="text-gradient">projets</em>
            </h2>
          </Reveal>
          <Reveal as="p" className={styles.lead} delay={0.05}>
            Quatre terrains d'expression — de l'événementiel au motion design.
            Chaque projet mêle direction artistique, sens du détail et impact
            réel.
          </Reveal>
        </div>
      </div>

      {categories.map((cat, i) => (
        <CategoryShowcase key={cat.id} category={cat.id} alt={i % 2 === 1} />
      ))}
    </div>
  );
}
