let allVideos = [];

document.addEventListener("DOMContentLoaded", () => {

  fetch("./data/videos.json")
    .then(res => {
      if (!res.ok) throw new Error("No se encontró videos.json");
      return res.json();
    })
    .then(videos => {

      allVideos = videos;

      renderVideos(allVideos);
      setupSearch();

    })
    .catch(err => console.error("ERROR:", err));

});

/* =========================
   RENDER DE VIDEOS
========================= */
function renderVideos(videos) {

  const grid = document.getElementById("all-grid");
  grid.innerHTML = "";

  videos.forEach(video => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${video.image}" alt="${video.title}" loading="lazy">
      <div class="card-content">
        <div class="card-title">${video.title}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      openEmbed(video.url);
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

    const filtered = allVideos.filter(v =>
      v.title.toLowerCase().includes(value)
    );

    renderVideos(filtered);
  });
}

/* =========================
   EMBED MODAL
========================= */
function openEmbed(url) {

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

  modal.addEventListener("click", (e) => {
    if (e.target.id === "modal" || e.target.id === "close") {
      modal.remove();
    }
  });
}
