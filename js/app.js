let allVideos = [];

fetch("data/videos.json")
  .then(res => res.json())
  .then(videos => {

    allVideos = videos;

    renderVideos(allVideos);
    setupSearch();

  });

/* =========================
   RENDER HOME GRID
========================= */
function renderVideos(videos) {

  const grid = document.getElementById("homeGrid");
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
   BUSCADOR (HOME ONLY)
========================= */
function setupSearch() {

  const input = document.getElementById("searchInput");

  input.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = allVideos.filter(v =>
      v.title.toLowerCase().includes(value)
    );

    renderVideos(filtered);

  });

}

/* =========================
   MODAL
========================= */
function openModal(url) {

  let modal = document.getElementById("modal");

  if (!modal) {

    modal = document.createElement("div");
    modal.id = "modal";

    modal.innerHTML = `
      <div class="modal-box">
        <span id="close">&times;</span>
        <iframe id="videoFrame" src="${url}" allowfullscreen></iframe>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target.id === "modal" || e.target.id === "close") {
        modal.remove();
      }
    });

  } else {
    document.getElementById("videoFrame").src = url;
  }

}
