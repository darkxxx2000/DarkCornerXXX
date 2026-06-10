let data = [];

fetch("./data/videos.json")
  .then(r => {
    if (!r.ok) throw new Error("No se pudo cargar videos.json");
    return r.json();
  })
  .then(json => {
    data = json;
    renderHome();
  })
  .catch(err => {
    console.error("ERROR CARGANDO JSON:", err);
  });

/* =========================
   HOME (CATEGORÍAS)
========================= */
function renderHome(){

  const home = document.getElementById("homeGrid");
  home.innerHTML = "";

  data.forEach(cat => {

    const card = document.createElement("div");
    card.className = "home-card";

    card.innerHTML = `
      <img src="${cat.cover}">
      <h3>${cat.category.toUpperCase()}</h3>
    `;

    card.onclick = () => openCategory(cat);

    home.appendChild(card);
  });
}

/* =========================
   CATEGORY VIEW
========================= */
function openCategory(cat){

  document.getElementById("home").classList.add("hidden");
  document.getElementById("category").classList.remove("hidden");

  document.getElementById("categoryTitle").innerText =
    cat.category.toUpperCase();

  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = "";

  cat.items.forEach(v => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${v.image}">
      <h3>${v.title}</h3>
    `;

    card.onclick = () => openModal(v.url);

    grid.appendChild(card);
  });
}

/* =========================
   MODAL EMBED
========================= */
function openModal(url){

  const modal = document.getElementById("modal");
  const frame = document.getElementById("frame");

  frame.src = url;
  modal.classList.remove("hidden");
}

document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("frame").src = "";
};
