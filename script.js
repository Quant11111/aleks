// Configuration
const CLOUDFRONT_URL = "https://d5u195w6r6k85.cloudfront.net";
let portfolioData = [];

// DOM Elements
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const modal = document.getElementById("media-modal");
const modalClose = document.querySelector(".modal-close");

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  loadPortfolioData();
  initializeScrollAnimations();
  initializeModal();
  initializeSmoothScroll();
});

// Navigation mobile
function initializeNavigation() {
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Fermer le menu mobile au clic sur un lien
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Navbar transparent au scroll
  let lastScrollTop = 0;
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scroll vers le bas
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scroll vers le haut
      navbar.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });
}

// Chargement des données du portfolio
async function loadPortfolioData() {
  try {
    const response = await fetch("./content.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    portfolioData = await response.json();
    generatePortfolioSections();
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    showErrorMessage();
  }
}

// Génération des sections du portfolio
function generatePortfolioSections() {
  const sections = {
    communication: document.getElementById("communication-grid"),
    evenement: document.getElementById("evenements-grid"),
    graphisme: document.getElementById("graphisme-grid"),
    "motion-design": document.getElementById("motion-design-grid"),
  };

  // Filtrer les données par type (exclure les éléments cachés et landing)
  portfolioData.forEach((item) => {
    if (
      item.type &&
      sections[item.type] &&
      !item.hideText &&
      item.type !== "landing"
    ) {
      const portfolioItem = createPortfolioItem(item);
      sections[item.type].appendChild(portfolioItem);
    }
  });

  // Ajouter les animations
  initializePortfolioAnimations();
}

// Création d'un élément de portfolio
function createPortfolioItem(item) {
  const portfolioItem = document.createElement("div");
  portfolioItem.className = `portfolio-item format-${item.format}`;
  portfolioItem.setAttribute("data-item", JSON.stringify(item));

  const mediaElement = createMediaElement(item);
  const contentElement = createContentElement(item);
  const overlayElement = createOverlayElement();

  portfolioItem.appendChild(mediaElement);
  portfolioItem.appendChild(contentElement);
  portfolioItem.appendChild(overlayElement);

  // Ajouter l'événement de clic
  portfolioItem.addEventListener("click", () => openModal(item));

  return portfolioItem;
}

// Création de l'élément média
function createMediaElement(item) {
  const mediaDiv = document.createElement("div");
  mediaDiv.className = "portfolio-media";

  if (item.photos && item.photos.length > 0) {
    const img = document.createElement("img");
    img.src = `${CLOUDFRONT_URL}/${item.photos[0].name}`;
    img.alt = item.photos[0].description || item.name;
    img.loading = "lazy";
    mediaDiv.appendChild(img);
  } else if (item.videos && item.videos.length > 0) {
    const videoFile = item.videos[0];
    const isGif = videoFile.name.toLowerCase().endsWith(".gif");

    if (isGif) {
      // Traiter les GIFs comme des images
      const img = document.createElement("img");
      img.src = `${CLOUDFRONT_URL}/${videoFile.name}`;
      img.alt = videoFile.description || item.name;
      img.loading = "lazy";
      mediaDiv.appendChild(img);
    } else {
      // Traiter les vraies vidéos
      const video = document.createElement("video");
      video.src = `${CLOUDFRONT_URL}/${videoFile.name}`;
      video.muted = true;
      video.loop = true;
      video.setAttribute("preload", "metadata");

      // Lecture au hover pour les vidéos (pas les GIFs)
      mediaDiv.addEventListener("mouseenter", () => {
        video.play().catch(() => {}); // Ignorer les erreurs de lecture
      });

      mediaDiv.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });

      mediaDiv.appendChild(video);
    }
  }

  return mediaDiv;
}

// Création de l'élément contenu
function createContentElement(item) {
  const contentDiv = document.createElement("div");
  contentDiv.className = "portfolio-content";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const description = document.createElement("p");
  description.textContent = item.description;

  contentDiv.appendChild(title);
  contentDiv.appendChild(description);

  return contentDiv;
}

// Création de l'overlay
function createOverlayElement() {
  const overlay = document.createElement("div");
  overlay.className = "portfolio-overlay";
  overlay.innerHTML = "<span>Voir le projet</span>";
  return overlay;
}

// Gestion de la modal
function initializeModal() {
  modalClose.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fermer la modal avec Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });
}

// Ouverture de la modal
function openModal(item) {
  const modalTitle = document.querySelector(".modal-title");
  const modalDescription = document.querySelector(".modal-description");
  const modalMedia = document.querySelector(".modal-media");

  modalTitle.textContent = item.name;
  modalDescription.textContent = item.description;

  // Vider le contenu média précédent
  modalMedia.innerHTML = "";

  // Créer le carrousel si plusieurs médias
  const totalMedia =
    (item.photos ? item.photos.length : 0) +
    (item.videos ? item.videos.length : 0);

  if (totalMedia > 1) {
    createCarousel(item, modalMedia);
  } else {
    // Ajouter le média unique
    if (item.photos && item.photos.length > 0) {
      const img = document.createElement("img");
      img.src = `${CLOUDFRONT_URL}/${item.photos[0].name}`;
      img.alt = item.photos[0].description || item.name;
      modalMedia.appendChild(img);
    } else if (item.videos && item.videos.length > 0) {
      const videoFile = item.videos[0];
      const isGif = videoFile.name.toLowerCase().endsWith(".gif");

      if (isGif) {
        // Traiter les GIFs comme des images
        const img = document.createElement("img");
        img.src = `${CLOUDFRONT_URL}/${videoFile.name}`;
        img.alt = videoFile.description || item.name;
        modalMedia.appendChild(img);
      } else {
        // Traiter les vraies vidéos
        const video = document.createElement("video");
        video.src = `${CLOUDFRONT_URL}/${videoFile.name}`;
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        modalMedia.appendChild(video);
      }
    }
  }

  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

// Création du carrousel
function createCarousel(item, container) {
  // Combiner photos et vidéos
  const allMedia = [];

  if (item.photos) {
    item.photos.forEach((photo) => {
      allMedia.push({ type: "image", ...photo });
    });
  }

  if (item.videos) {
    item.videos.forEach((video) => {
      const isGif = video.name.toLowerCase().endsWith(".gif");
      allMedia.push({ type: isGif ? "gif" : "video", ...video });
    });
  }

  // Créer le conteneur du carrousel
  const carouselContainer = document.createElement("div");
  carouselContainer.className = "carousel-container";

  // Créer le conteneur des slides
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "carousel-slides";

  // Créer les slides
  allMedia.forEach((media, index) => {
    const slide = document.createElement("div");
    slide.className = `carousel-slide ${index === 0 ? "active" : ""}`;

    if (media.type === "image" || media.type === "gif") {
      const img = document.createElement("img");
      img.src = `${CLOUDFRONT_URL}/${media.name}`;
      img.alt = media.description || item.name;
      slide.appendChild(img);
    } else {
      const video = document.createElement("video");
      video.src = `${CLOUDFRONT_URL}/${media.name}`;
      video.controls = true;
      video.muted = true;
      slide.appendChild(video);
    }

    slidesContainer.appendChild(slide);
  });

  // Créer les boutons de navigation
  const prevButton = document.createElement("button");
  prevButton.className = "carousel-nav carousel-prev";
  prevButton.innerHTML = "‹";
  prevButton.setAttribute("aria-label", "Image précédente");

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-nav carousel-next";
  nextButton.innerHTML = "›";
  nextButton.setAttribute("aria-label", "Image suivante");

  // Créer les indicateurs
  const indicators = document.createElement("div");
  indicators.className = "carousel-indicators";

  allMedia.forEach((_, index) => {
    const indicator = document.createElement("button");
    indicator.className = `carousel-indicator ${index === 0 ? "active" : ""}`;
    indicator.setAttribute("data-slide", index);
    indicator.setAttribute("aria-label", `Aller à l'image ${index + 1}`);
    indicators.appendChild(indicator);
  });

  // Assembler le carrousel
  carouselContainer.appendChild(slidesContainer);
  carouselContainer.appendChild(prevButton);
  carouselContainer.appendChild(nextButton);
  carouselContainer.appendChild(indicators);

  container.appendChild(carouselContainer);

  // Initialiser les événements du carrousel
  initializeCarouselEvents(carouselContainer, allMedia.length);
}

// Initialisation des événements du carrousel
function initializeCarouselEvents(container, totalSlides) {
  let currentSlide = 0;

  const slides = container.querySelectorAll(".carousel-slide");
  const indicators = container.querySelectorAll(".carousel-indicator");
  const prevButton = container.querySelector(".carousel-prev");
  const nextButton = container.querySelector(".carousel-next");

  // Fonction pour changer de slide
  function goToSlide(index) {
    // Arrêter toutes les vraies vidéos (pas les GIFs)
    container.querySelectorAll("video").forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });

    // Mettre à jour les classes active
    slides[currentSlide].classList.remove("active");
    indicators[currentSlide].classList.remove("active");

    currentSlide = index;

    slides[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");
  }

  // Navigation avec les boutons
  prevButton.addEventListener("click", () => {
    const newIndex = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    goToSlide(newIndex);
  });

  nextButton.addEventListener("click", () => {
    const newIndex = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
    goToSlide(newIndex);
  });

  // Navigation avec les indicateurs
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index);
    });
  });

  // Navigation au clavier
  const keyboardHandler = (e) => {
    if (modal.style.display === "block") {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevButton.click();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextButton.click();
      }
    }
  };

  document.addEventListener("keydown", keyboardHandler);

  // Nettoyer les événements quand le modal se ferme
  const originalCloseModal = window.closeModal;
  window.closeModal = function () {
    document.removeEventListener("keydown", keyboardHandler);
    originalCloseModal();
  };
}

// Fermeture de la modal
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";

  // Arrêter toutes les vidéos
  const videos = modal.querySelectorAll("video");
  videos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
}

// Animations au scroll
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observer les sections
  document.querySelectorAll(".portfolio-section").forEach((section) => {
    section.classList.add("fade-in");
    observer.observe(section);
  });

  // Observer les éléments de portfolio (après leur création)
  setTimeout(() => {
    document.querySelectorAll(".portfolio-item").forEach((item) => {
      item.classList.add("fade-in");
      observer.observe(item);
    });
  }, 100);
}

// Animations spécifiques pour le portfolio
function initializePortfolioAnimations() {
  const portfolioGrids = document.querySelectorAll(".portfolio-grid");

  portfolioGrids.forEach((grid) => {
    grid.classList.add("stagger-children");

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(grid);
  });
}

// Navigation smooth scroll
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Mise à jour de la navigation active
  window.addEventListener("scroll", updateActiveNavigation);
}

// Mise à jour de la navigation active
function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  const scrollPos = window.pageYOffset + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Gestion des erreurs
function showErrorMessage() {
  const errorMessage = document.createElement("div");
  errorMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ef4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        z-index: 9999;
        text-align: center;
    `;
  errorMessage.innerHTML = `
        <h3>Erreur de chargement</h3>
        <p>Impossible de charger le contenu du portfolio.</p>
        <button onclick="this.parentElement.remove(); location.reload();" 
                style="background: white; color: #ef4444; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; margin-top: 1rem; cursor: pointer;">
            Réessayer
        </button>
    `;
  document.body.appendChild(errorMessage);
}

// Optimisation des performances
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Lazy loading pour les images
function initializeLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Preload des images critiques
function preloadCriticalImages() {
  const criticalImages = [
    `${CLOUDFRONT_URL}/home/hellocaleks.MOV`, // Vidéo hero
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = src.endsWith(".MOV") || src.endsWith(".mp4") ? "video" : "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

// Service Worker pour la mise en cache (optionnel)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Analytics et tracking (placeholder)
function trackEvent(category, action, label) {
  // Intégration Google Analytics ou autre outil d'analytics
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}

// Gestion des erreurs globales
window.addEventListener("error", function (e) {
  console.error("Erreur JavaScript:", e.error);
  // Optionnel: envoyer l'erreur à un service de monitoring
});

// Optimisation pour les appareils tactiles
function initializeTouchOptimizations() {
  // Améliorer les interactions tactiles
  document.addEventListener("touchstart", function () {}, { passive: true });

  // Désactiver le zoom sur double tap pour certains éléments
  document.querySelectorAll(".portfolio-item, .btn").forEach((element) => {
    element.addEventListener("touchend", function (e) {
      e.preventDefault();
      e.target.click();
    });
  });
}

// Initialisation des optimisations tactiles
if ("ontouchstart" in window) {
  initializeTouchOptimizations();
}

// Préchargement et optimisations finales
document.addEventListener("DOMContentLoaded", function () {
  preloadCriticalImages();
  initializeLazyLoading();
});

// Export pour les tests (si nécessaire)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadPortfolioData,
    createPortfolioItem,
    openModal,
    closeModal,
  };
}
