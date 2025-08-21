const GALLERY_CONFIG = {
  count: 12,
  path: "./assets/images/",
  prefix: "GALLERY",
  ext: ".png",
};

const createImageList = ({ count, path, prefix, ext }) =>
  Array.from({ length: count }, (_, i) => {
    const index = String(i + 1).padStart(2, "0");
    return {
      src: `${path}${prefix}${index}${ext}`,
      alt: `Gallery Image ${index}`,
    };
  });

const Gallery = (() => {
  const images = createImageList(GALLERY_CONFIG);

  let currentIndex = null;
  let minimap, bigImage, previewIndex;
  let hasAnimated = false;

  const isDesktop = () => window.matchMedia("(min-width: 1025px)").matches;

  const preloadImage = (src, callback) => {
    const img = new Image();
    img.onload = () => callback(null, img);
    img.onerror = () => callback("error", null);
    img.src = src;
  };

  const animateInitialReveal = () => {
    if (!isDesktop() || hasAnimated) return;

    gsap.set(bigImage, { clipPath: "inset(100% 0 0 0)" });
    gsap.to(bigImage, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.5,
      ease: "power2.out",
      onComplete: () => (hasAnimated = true),
    });
  };

  const updateBigImage = (index) => {
    if (index === currentIndex || !images[index]) return;

    currentIndex = index;
    const { src, alt } = images[index];

    preloadImage(src, (err, loadedImg) => {
      if (err) {
        bigImage.src = "./assets/images/placeholder.png";
        bigImage.alt = "Failed to load image";
        return;
      }

      // Replace only after image is fully loaded
      bigImage.src = loadedImg.src;
      bigImage.alt = alt;

      previewIndex.textContent = String(index + 1).padStart(3, "0");

      highlightActiveThumbnail(index);
      if (!hasAnimated) animateInitialReveal();
    });
  };

  const highlightActiveThumbnail = (index) => {
    minimap.querySelectorAll("button").forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
      btn.setAttribute("aria-current", i === index ? "true" : "false");
    });
  };

  const createThumbnailButton = ({ src, alt }, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.classList.add("thumbnail-button");
    button.setAttribute("aria-label", alt);
    button.setAttribute("tabindex", "0");

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";

    img.onerror = () => {
      img.src = "./assets/images/placeholder.png";
    };

    button.appendChild(img);

    button.addEventListener("mouseenter", () => updateBigImage(index));
    button.addEventListener("focus", () => updateBigImage(index));
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        updateBigImage(index);
      }
    });

    li.appendChild(button);
    return li;
  };

  const setupMinimapScroll = () => {
    let scrollTarget = 0;
    let isScrolling = false;

    const smoothScrollStep = () => {
      const delta = (scrollTarget - minimap.scrollLeft) * 0.2;
      if (Math.abs(delta) > 0.5) {
        minimap.scrollLeft += delta;
        requestAnimationFrame(smoothScrollStep);
      } else {
        minimap.scrollLeft = scrollTarget;
        isScrolling = false;
      }
    };

    minimap.addEventListener("wheel", (e) => {
      e.preventDefault();
      scrollTarget += e.deltaY || e.deltaX;
      scrollTarget = Math.max(
        0,
        Math.min(scrollTarget, minimap.scrollWidth - minimap.clientWidth)
      );
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScrollStep);
      }
    }, { passive: false });
  };

  const init = () => {
    minimap = document.getElementById("minimap");
    bigImage = document.getElementById("bigImage");
    previewIndex = document.getElementById("previewIndex");

    if (!minimap || !bigImage || !previewIndex) {
      console.error("Gallery init failed: missing DOM elements.");
      return;
    }

    images.forEach((imgData, index) => {
      const thumbEl = createThumbnailButton(imgData, index);
      minimap.appendChild(thumbEl);
    });

    preloadImage(images[0].src, (err, img) => {
      if (!err) updateBigImage(0);
    });

    setupMinimapScroll();
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", Gallery.init);
