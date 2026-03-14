/* assets/pager.js */

/* 1) Orden maestro de proyectos (ajústalo a tus archivos reales) */
const PROJECTS = [
  { title: "London Bike Rides", url: "london-bike-rides.html" },
  { title: "Top 200 Spotify", url: "spotify.html" },
  { title: "The Walking Dead Popularity", url: "the-walking-dead-popularity.html" },
  { title: "Gasto en I+D Chile 2020", url: "gasto-i+d.html" },
  { title: "Walmart Sales", url: "walmart-sales.html" },
  { title: "Pokemon Data", url: "pokemon-data.html" },
  { title: "Panamericanos 2023", url: "juegos-panamericanos.html" },
  { title: "Air Traffic Chile (JAC)", url: "JAC.html" },
  { title: "Accidentes Valparaiso", url: "accidentes-valpo.html" }
];

/* 2) Utilidad para comparar rutas de forma robusta */
function fileFromPath(pathname) {
  try {
    const parts = pathname.split("/");
    return "/" + (parts[parts.length - 1] || "");
  } catch (error) { return pathname; }
}

/* 3) Render del pager + <link rel="prev|next"> en <head> */
function renderPager() {
  const container = document.querySelector(".proj-pager");
  if (!container) return;

  const currentFile = fileFromPath(location.pathname);
  const idx = PROJECTS.findIndex(p => fileFromPath(p.url) === currentFile);
  if (idx === -1) return;

  const prev = PROJECTS[idx - 1] || null;
  const next = PROJECTS[idx + 1] || null;

  let html = "";

  if (prev) {
    html += `
      <a class="prev" href="${prev.url}" rel="prev" aria-label="Proyecto anterior: ${prev.title}">
        <span>←</span>
        <span>
          <div class="label">Anterior</div>
          <div class="title">${prev.title}</div>
        </span>
      </a>`;
  } else {
    html += `<span></span>`;
  }

  if (next) {
    html += `
      <a class="next" href="${next.url}" rel="next" aria-label="Próximo proyecto: ${next.title}">
        <span>
          <div class="label">Siguiente</div>
          <div class="title">${next.title}</div>
        </span>
        <span>→</span>
      </a>`;
  }

  container.innerHTML = html;

  // Señales SEO en <head>
  const head = document.head;
  if (prev) {
    const lp = document.createElement("link");
    lp.rel = "prev";
    lp.href = prev.url;
    head.appendChild(lp);
  }
  if (next) {
    const ln = document.createElement("link");
    ln.rel = "next";
    ln.href = next.url;
    head.appendChild(ln);
  }
}

/* 4) Inicialización */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderPager);
} else {
  renderPager();
}
