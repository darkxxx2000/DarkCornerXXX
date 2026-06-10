let allVideos = [];

document.addEventListener("DOMContentLoaded", () => {

  fetch("./data/videos.json")
    .then(res => {
      if (!res.ok) throw new Error("No se encontró videos.json");
      return res.json();
    })
    .then(videos => {

      console.log("VIDEOS OK:", videos);

      allVideos = videos;

      renderVideos(allVideos);
      setupSearch();
      updateCounters();

    })
    .catch(err => {
      console.error("ERROR CARGA JSON:", err);
    });

});

/* =========================
   RENDER
========================= */
function renderVideos(videos) {

  const grid = document.getElementById("all-grid");

  if (!grid) {
    console.error("NO EXISTE all-grid en HTML");
    return;
  }

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

  if (!input) return;

  input.addEventListener("input", e => {

    const value = e.target.value.toLowerCase();

    renderVideos(
      allVideos.filter(v =>
        v.title.toLowerCase().includes(value)
      )
    );
  });
}

/* =========================
   FILTRO
========================= */
function filterCategory(category) {

  renderVideos(
    allVideos.filter(v =>
      v.category.toLowerCase().trim() === category
    )
  );
}

/* =========================
   CONTADORES
========================= */
function updateCounters() {

  const categories = ["machine","shibari","huge","vibrator","bbc"];

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
