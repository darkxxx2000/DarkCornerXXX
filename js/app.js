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
    modal.style.display = "flex";
  }

}
function filterCategory(cat) {

  const filtered = allVideos.filter(v => v.category === cat);

  renderVideos(filtered);

}
let index = 0;
const step = 20;

window.addEventListener("scroll", () => {

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {

    const next = allVideos.slice(index, index + step);
    renderVideos(next);

    index += step;
  }

});
function updateCounters() {

  const categories = ["machine","shibari","huge","vibrator","bbc"];

  categories.forEach(cat => {

    const count = allVideos.filter(v => v.category === cat).length;

    const el = document.getElementById(`count-${cat}`);

    if (el) el.innerText = `(${count})`;

  });

}
