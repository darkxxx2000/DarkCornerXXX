let allVideos = [];

/* =========================
   CARGA JSON
========================= */
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
   RENDER
========================= */
function renderVideos(videos) {

  const grid = document.getElementById("all-grid");
  grid.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${video.image}" loading="lazy" alt="${video.title}">
      <div class="card-content">
        <div class="card-title">${video.title}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (video.type === "embed") {
        openEmbedModal(video.url);
      } else {
        window.open(video.url, "_blank");
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

  const filtered = allVideos.filter(video =>
    video.category.toLowerCase().trim() === category
  );

  renderVideos(filtered);
}

/* =========================
   CONTADORES
========================= */
function updateCounters() {

  const categories = ["machine", "shibari", "huge", "vibrator", "bbc"];

  categories.forEach(category => {

    const count = allVideos.filter(video =>
      video.category.toLowerCase().trim() === category
    ).length;

    const element = document.getElementById(`count-${category}-nav`);

    if (element) {
      element.textContent = `(${count})`;
    }
  });
}

/* =========================
   MODAL
========================= */
function openEmbedModal(url) {

  document.querySelector("#modal")?.remove();

  const modal = document.createElement("div");
  modal.id = "modal";

  modal.innerHTML = `
    <div class="modal-box">
      <span id="close" style="cursor:pointer;font-size:30px;">&times;</span>

      <iframe
        src="${url}"
        allowfullscreen
        frameborder="0">
      </iframe>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target.id === "modal" || e.target.id === "close") {
      modal.remove();
    }
  });
}
