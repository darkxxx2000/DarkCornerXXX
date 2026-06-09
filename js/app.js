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
    grid.innerHTML = "";
  });

  videos.forEach(video => {

    const grid = document.querySelector(
      `.grid[data-category="${video.category}"]`
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

      if (video.type === "video") {
        openVideoModal(video.url);
      }

      if (video.type === "link") {
        window.open(video.url, "_blank");
      }

    });

    grid.appendChild(card);

  });

}

/* =========================
   MODAL VIDEO PRO
========================= */
function openVideoModal(url) {

  document.querySelector("#modal")?.remove();

  const modal = document.createElement("div");
  modal.id = "modal";

  modal.innerHTML = `
    <div class="modal-box">

      <span id="close">&times;</span>

      <video id="player" controls autoplay>
        <source src="${url}" type="video/mp4">
        Tu navegador no soporta video.
      </video>

    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target.id === "modal" || e.target.id === "close") {
      modal.remove();
    }
  });

}
