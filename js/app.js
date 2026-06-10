let allVideos = [];

document.addEventListener("DOMContentLoaded", () => {

  fetch("data/videos.json")
    .then(res => res.json())
    .then(videos => {

      allVideos = videos;

      renderVideos(allVideos);
      setupSearch();
      updateCounters();

    })
    .catch(err => console.error("ERROR JSON:", err));

});

function renderVideos(videos) {

  const grid = document.getElementById("all-grid");
  grid.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${video.image}" loading="lazy">
      <div class="card-content">
        <div class="card-title">${video.title}</div>
      </div>
    `;

    card.onclick = () => {
      if (video.type === "embed") {
        openEmbedModal(video.url);
      } else {
        window.open(video.url, "_blank");
      }
    };

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

    const filtered = allVideos.filter(v =>
      v.title.toLowerCase().includes(value)
    );

    renderVideos(filtered);
  });
}

/* =========================
   FILTRO
========================= */
function filterCategory(category) {

  const filtered = allVideos.filter(v =>
    v.category.toLowerCase().trim() === category
  );

  renderVideos(filtered);
}

/* =========================
   CONTADORES
========================= */
function updateCounters() {

  const categories = ["machine", "shibari", "huge", "vibrator", "bbc"];

  categories.forEach(cat => {

    const count = allVideos.filter(v =>
      v.category.toLowerCase().trim() === cat
    ).length;

    const el = document.getElementById(`count-${cat}-nav`);

    if (el) el.textContent = `(${count})`;
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
      <span id="close">&times;</span>
      <iframe src="${url}" allowfullscreen></iframe>
    </div>
  `;

  document.body.appendChild(modal);

  modal.onclick = (e) => {
    if (e.target.id === "modal" || e.target.id === "close") {
      modal.remove();
    }
  };
}
