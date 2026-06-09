let allVideos = [];

fetch("data/videos.json")
  .then(res => res.json())
  .then(videos => {

    allVideos = videos;

    renderVideos(allVideos);
    setupSearch();
    updateCounters();

  })
  .catch(error => {
    console.error("Error cargando videos.json:", error);
  });

/* =========================
   RENDER POR CATEGORÍA
========================= */
function renderVideos(videos) {

  document.querySelectorAll(".grid").forEach(grid => {
    grid.innerHTML = "";
  });

  videos.forEach(video => {

    const grid = document.querySelector(
      `.grid[data-category="${video.category}"]`
    );
console.log("Categoría:", video.category);
console.log(
  document.querySelector(
    `.grid[data-category="${video.category}"]`
  )
);
    if (!grid) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${video.image}" alt="${video.title}" loading="lazy">
      <div class="card-content">
        <div class="card-title">${video.title}</div>
      </div>
    `;

    card.addEventListener("click", () => {

      if (video.type === "link") {
        window.open(video.url, "_blank");
      }

      if (video.type === "modal") {
        openModal(video.url);
      }

    });

    grid.appendChild(card);

  });

}

/* =========================
   BUSCADOR
========================= */
function setupSearch() {

  const input = document.getElementById("searchInput");

  if (!input) return;

  input.addEventListener("input", e => {

    const value = e.target.value.toLowerCase();

    const filtered = allVideos.filter(video =>
      video.title.toLowerCase().includes(value)
    );

    renderVideos(filtered);

  });

}

/* =========================
   FILTRO CATEGORÍA
========================= */
function filterCategory(category) {

  const filtered = allVideos.filter(
    video => video.category === category
  );

  renderVideos(filtered);

}

/* =========================
   CONTADORES
========================= */
function updateCounters() {

  const categories = [
    "machine",
    "shibari",
    "huge",
    "vibrator",
    "bbc"
  ];

  categories.forEach(category => {

    const count = allVideos.filter(
      video => video.category === category
    ).length;

    const element = document.getElementById(
      `count-${category}-nav`
    );

    if (element) {
      element.textContent = `(${count})`;
    }

  });

}

/* =========================
   MODAL
========================= */
function openModal(url) {

  const modal = document.createElement("div");

  modal.id = "modal";

  modal.innerHTML = `
    <div class="modal-box">
      <span id="close">&times;</span>

      <video
        controls
        autoplay
        style="width:100%;border-radius:12px;">
        <source src="${url}">
      </video>

    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (
      e.target.id === "modal" ||
      e.target.id === "close"
    ) {
      modal.remove();
    }
  });

}
