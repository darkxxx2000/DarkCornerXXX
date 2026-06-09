fetch("data/videos.json")
  .then(res => res.json())
  .then(videos => {

    videos.forEach(video => {

      const grid = document.querySelector(
        `.grid[data-category="${video.category}"]`
      );

      if (!grid) return;

      const card = document.createElement("a");

      card.className = "card";
      card.href = "#";

      card.innerHTML = `
        <img src="${video.image}">
        <div class="card-content">
          <div class="card-title">${video.title}</div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        e.preventDefault();

        if (video.type === "link") {
          window.open(video.url, "_blank");
        }

        if (video.type === "modal") {
          openModal(video.url);
        }
      });

      grid.appendChild(card);

    });

  });

function openModal(url) {

  let modal = document.getElementById("modal");

  if (!modal) {

    modal = document.createElement("div");
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

}
