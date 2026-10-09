
/* ============================================================
   MARIA SILVA — PORTFOLIO
   Navigation, scroll effects, footer year and image lightbox
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
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
  const images = Array.from(
    document.querySelectorAll(
      "main .case-figure img, main .case-image img, main .art-piece img"
    )
  ).filter(function (img) {
    return img.getAttribute("src") || img.currentSrc;
  });

  if (!images.length) {
    return;
  }

  let currentIndex = 0;
  let previousFocus = null;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image gallery");
  lightbox.hidden = true;

  lightbox.innerHTML = `
    <button class="lightbox-close" type="button"
      aria-label="Close image gallery">&times;</button>

    <button class="lightbox-arrow lightbox-prev" type="button"
      aria-label="Previous image">&#10094;</button>

    <figure class="lightbox-figure">
      <img class="lightbox-image" alt="">
      <figcaption class="lightbox-caption" hidden></figcaption>
    </figure>

    <button class="lightbox-arrow lightbox-next" type="button"
      aria-label="Next image">&#10095;</button>

    <p class="lightbox-counter" aria-live="polite"></p>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  const counter = lightbox.querySelector(".lightbox-counter");

  function getCaption(img) {
    const figure = img.closest("figure");
    const figcaption = figure
      ? figure.querySelector("figcaption")
      : null;

    return (
      (figcaption && figcaption.textContent.trim()) ||
      img.getAttribute("alt") ||
      ""
    );
  }

  function showImage(index) {
    currentIndex = (index + images.length) % images.length;

    const img = images[currentIndex];

    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt || "";

    const caption = getCaption(img);
    lightboxCaption.textContent = caption;
    lightboxCaption.hidden = !caption;

    counter.textContent =
      (currentIndex + 1) + " / " + images.length;

    const multipleImages = images.length > 1;
    previousButton.hidden = !multipleImages;
    nextButton.hidden = !multipleImages;
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

  images.forEach(function (img, index) {
    img.classList.add("lightbox-trigger");
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute(
      "aria-label",
      "Enlarge image" + (img.alt ? ": " + img.alt : "")
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

  closeButton.addEventListener("click", closeLightbox);

  previousButton.addEventListener("click", function () {
    showImage(currentIndex - 1);
  });

  nextButton.addEventListener("click", function () {
    showImage(currentIndex + 1);
  });

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
      showImage(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentIndex + 1);
    } else if (event.key === "Tab") {
      const controls = [
        closeButton,
        previousButton,
        nextButton
      ].filter(function (button) {
        return !button.hidden;
      });

      const first = controls[0];
      const last = controls[controls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
