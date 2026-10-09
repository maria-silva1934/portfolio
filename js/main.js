
/* ============================================================
   MARIA SILVA — PORTFOLIO
   Navigation, reveal animations, footer year and image lightbox
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
  ).filter(function (image) {
    return image.getAttribute("src") || image.currentSrc;
  });

  if (!images.length) return;

  let activeIndex = 0;
  let previousFocus = null;

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Expanded image viewer");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.hidden = true;

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
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");

  function getCaption(image) {
    const figure = image.closest("figure");
    const caption = figure && figure.querySelector("figcaption");

    if (caption) return caption.textContent.trim();

    return image.getAttribute("alt") || "";
  }

  function showImage(index) {
    activeIndex = (index + images.length) % images.length;

    const image = images[activeIndex];

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Portfolio project image";
    lightboxCaption.textContent = getCaption(image);
    lightboxCaption.hidden = !lightboxCaption.textContent;

    lightboxCounter.textContent =
      images.length > 1
        ? (activeIndex + 1) + " / " + images.length
        : "";

    const multipleImages = images.length > 1;
    previousButton.hidden = !multipleImages;
    nextButton.hidden = !multipleImages;
    lightboxCounter.hidden = !multipleImages;
  }

  function openLightbox(index) {
    previousFocus = document.activeElement;

    showImage(index);

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    if (lightbox.hidden) return;

    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  images.forEach(function (image, index) {
    image.classList.add("lightbox-trigger");
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");
    image.setAttribute(
      "aria-label",
      "Enlarge image: " + (image.alt || "Portfolio image")
    );

    image.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(index);
    });

    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  previousButton.addEventListener("click", function () {
    showImage(activeIndex - 1);
  });

  nextButton.addEventListener("click", function () {
    showImage(activeIndex + 1);
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (lightbox.hidden) return;

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft" && images.length > 1) {
      showImage(activeIndex - 1);
    } else if (event.key === "ArrowRight" && images.length > 1) {
      showImage(activeIndex + 1);
    } else if (event.key === "Tab") {
      const focusable = [closeButton];

      if (images.length > 1) {
        focusable.push(previousButton, nextButton);
      }

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
