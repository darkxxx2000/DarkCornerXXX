let videos = [];

fetch("data/videos.json")
.then(r => r.json())
.then(data => {
  videos = data;
  renderAll();
});

function renderAll(){
  renderHome();

  ["machine","shibari","sybian","huge","bbc"]
  .forEach(renderCategory);
}

function renderHome(){
  const home = document.getElementById("homeGrid");
  videos.slice(0,10).forEach(v => home.appendChild(createCard(v)));
}

function renderCategory(cat){
  const grid = document.querySelector(`[data-cat="${cat}"]`);

  videos
  .filter(v => v.category === cat)
  .forEach(v => grid.appendChild(createCard(v)));
}

function createCard(video){

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${video.image}">
    <h3>${video.title}</h3>
  `;

  card.onclick = () => openModal(video.url);

  return card;
}

function openModal(url){

  const modal = document.getElementById("modal");
  const frame = document.getElementById("videoFrame");

  frame.src = url;   // 👈 EMBED DIRECTO
  modal.classList.remove("hidden");
}

document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("videoFrame").src = "";
};
