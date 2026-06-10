let videos = [];

fetch("data/videos.json")
.then(r => r.json())
.then(data => {
  videos = data;
  renderAll();
});

function renderAll(){

  renderHome();
  renderCategory("machine");
  renderCategory("shibari");
  renderCategory("sybian");
  renderCategory("huge");
  renderCategory("bbc");

}

function renderHome(){

  const home = document.getElementById("homeGrid");

  videos.slice(0,10).forEach(v => {
    const card = createCard(v);
    home.appendChild(card);
  });

}

function renderCategory(cat){

  const grid = document.querySelector(`[data-cat="${cat}"]`);

  videos.filter(v => v.category === cat)
  .forEach(v => {
    grid.appendChild(createCard(v));
  });

}

function createCard(video){

  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${video.image}">
    <h3>${video.title}</h3>
  `;

  div.onclick = () => openModal(video.url);

  return div;

}

function openModal(url){

  const modal = document.getElementById("modal");
  const frame = document.getElementById("videoFrame");

  frame.src = url;
  modal.classList.remove("hidden");

}

document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("videoFrame").src = "";
};
