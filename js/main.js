
/* ============================================================
   MARIA SILVA — PORTFOLIO
   Navigation, scroll effects and image lightbox
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (event) {
      if (
        primaryNav.classList.contains("open") &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("open")) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");

  if (header) {
    const onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Image lightbox ---------- */
  const galleryImages = Array.from(
    document.querySelectorAll(
      "main .case-figure img, main .case-image img, main .art-piece img"
    )
  ).filter(function (img) {
    return img.getAttribute("src") || img.currentSrc;
  });

  if (!galleryImages.length) return;

  galleryImages.forEach(function (img, index) {
    img.classList.add("lightbox-trigger");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute(
      "aria-label",
      "Open image " + (index + 1) + " of " + galleryImages.length
    );

    img.addEventListener("click", function () {
      openLightbox(index);
    });

    img.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image gallery");

  lightbox.innerHTML = `
    <button class="lightbox-close" type="button"
      aria-label="Close image viewer">&times;</button>
    <button class="lightbox-arrow lightbox-prev" type="button"
      aria-label="Previous image">&#10094;</button>
    <figure class="lightbox-figure">
      <img class="lightbox-image" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-arrow lightbox-next" type="button"
      aria-label="Next image">&#10095;</button>
    <p class="lightbox-counter" aria-live="polite"></p>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxCounter = lightbox.querySelector(".lightbox-counter");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;
  let previousFocus = null;

  function showImage(index) {
    currentIndex =
      (index + galleryImages.length) % galleryImages.length;

    const sourceImage = galleryImages[currentIndex];
    const source = sourceImage.currentSrc || sourceImage.src;
    const figure = sourceImage.closest("figure");
    const captionElement = figure
      ? figure.querySelector("figcaption")
      : null;

    lightboxImage.src = source;
    lightboxImage.alt = sourceImage.alt || "Portfolio image";

    const caption = captionElement
      ? captionElement.textContent.trim()
      : sourceImage.alt || "";

    lightboxCaption.textContent = caption;
    lightboxCaption.hidden = !caption;
    lightboxCounter.textContent =
      (currentIndex + 1) + " / " + galleryImages.length;

    const hasMultipleImages = galleryImages.length > 1;
    prevButton.hidden = !hasMultipleImages;
    nextButton.hidden = !hasMultipleImages;
  }

  function openLightbox(index) {
    previousFocus = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;

    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function showPrevious() {
    showImage(currentIndex - 1);
  }

  function showNext() {
    showImage(currentIndex + 1);
  }

  closeButton.addEventListener("click", closeLightbox);
  prevButton.addEventListener("click", showPrevious);
  nextButton.addEventListener("click", showNext);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    } else if (event.key === "Tab") {
      const focusable = Array.from(
        lightbox.querySelectorAll("button:not([hidden])")
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
