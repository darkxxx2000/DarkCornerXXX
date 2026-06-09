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
   RENDER
========================= */
function renderVideos(videos) {
  document.querySelectorAll(".grid").forEach(grid => {
    grid.innerHTML = "<p style='color:white'>GRID OK</p>";
  });

  console.log("VIDEOS:", videos);

  videos.forEach(video => {
    console.log("VIDEO:", video);

    const grid = document.querySelector(
      `.grid[data-category="${video.category.toLowerCase().trim()}"]`
    );

    console.log("GRID FOUND:", grid);

    if (!grid) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${video.image}" style="width:200px;border:2px solid red;">
      <div>${video.title}</div>
    `;

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
   MODAL EMBED (PROPIO)
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
        frameborder="0"
        style="width:100%; height:70vh; border-radius:12px;">
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
