let data = [];

fetch("/DarkCornerXXX/data/videos.json")
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

if (!home) {
  console.error("homeGrid no existe en el DOM");
  return;
}
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

  const home = document.getElementById("home");
  const category = document.getElementById("category");

  if (!home || !category) {
    console.error("Faltan secciones home/category en HTML");
    return;
  }

  home.classList.add("hidden");
  category.classList.remove("hidden");

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
