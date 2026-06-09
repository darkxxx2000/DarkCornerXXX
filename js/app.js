let allVideos = [];

fetch("data/videos.json")
  .then(res => res.json())
  .then(videos => {

    allVideos = videos;

    renderVideos(videos);
    setupSearch();

  });

function renderVideos(videos) {

  document.querySelectorAll(".grid").forEach(g => g.innerHTML = "");

  videos.forEach(video => {

    const grid = document.querySelector(
      `.grid[data-category="${video.category}"]`
    );

    if (!grid) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${video.image}">
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
