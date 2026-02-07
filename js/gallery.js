// js/gallery.js

function titleFromSrc(src) {
  const file = (src.split("/").pop() || "").trim();
  const noExt = file.replace(/\.[^.]+$/, "");
  return noExt
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createLightbox() {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-backdrop" aria-hidden="true"></div>
    <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Image viewer">
      <button class="lightbox-close" type="button" aria-label="Close">×</button>
      <img class="lightbox-img" alt="">
      <div class="lightbox-caption" aria-live="polite"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lbImg = lightbox.querySelector(".lightbox-img");
  const lbCap = lightbox.querySelector(".lightbox-caption");
  const lbClose = lightbox.querySelector(".lightbox-close");
  const lbBackdrop = lightbox.querySelector(".lightbox-backdrop");

  function open({ src, title }) {
    lbImg.src = src;
    lbImg.alt = title || "Artwork";
    lbCap.textContent = title || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    lbImg.src = "";
    lbCap.textContent = "";
    document.body.style.overflow = "";
  }

  lbClose.addEventListener("click", close);
  lbBackdrop.addEventListener("click", close);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) close();
  });

  return { open, close };
}

async function loadGallery() {
  const container = document.querySelector(".gallery");
  if (!container) return;

  const galleryName = container.dataset.gallery;
  const lightbox = createLightbox();

  try {
    const res = await fetch("data/galleries.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`galleries.json failed: ${res.status}`);

    const data = await res.json();
    const images = data[galleryName] || [];

    if (!images.length) {
      container.innerHTML = "<p>No works uploaded yet.</p>";
      return;
    }

    const frag = document.createDocumentFragment();

    for (const src of images) {
      const title = titleFromSrc(src);

      // <figure class="gallery-item">
      const figure = document.createElement("figure");
      figure.className = "gallery-item";

      // <button class="gallery-open"> ... </button>
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-open";
      btn.setAttribute("aria-label", `Open ${title || "image"}`);

      // Frame + mat structure:
      // <div class="gallery-frame">
      //   <div class="gallery-mat">
      //     <img>
      //   </div>
      // </div>
      const frame = document.createElement("div");
      frame.className = "gallery-frame";

      const mat = document.createElement("div");
      mat.className = "gallery-mat";

      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = title;

      mat.appendChild(img);
      frame.appendChild(mat);
      btn.appendChild(frame);
      figure.appendChild(btn);

      img.addEventListener("load", () => {
      const r = img.naturalWidth / img.naturalHeight;
      if (r >= 2.1) figure.classList.add("span-3");
      else if (r >= 1.35) figure.classList.add("span-2");
      });


      // Caption under frame
      const cap = document.createElement("figcaption");
      cap.className = "gallery-caption";
      cap.textContent = title;
      figure.appendChild(cap);

      btn.addEventListener("click", () => lightbox.open({ src, title }));

      frag.appendChild(figure);
    }

    container.appendChild(frag);
  } catch (err) {
    console.error("Gallery load failed:", err);
    container.innerHTML = "<p>Failed to load gallery.</p>";
  }
}

loadGallery();

