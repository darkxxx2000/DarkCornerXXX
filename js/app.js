const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];
let currentCategory = null;

/* =========================
   CARGA JSON
========================= */

async function loadVideos() {

    try {
        const response = await fetch("./data/videos.json");
        categories = await response.json();
        renderHome();
    } catch (error) {
        console.error(error);
        gallery.innerHTML = `
            <div class="error-message">
                Error cargando contenido.
            </div>
        `;
    }
}

/* =========================
   HOME
========================= */

function renderHome() {

    currentCategory = null;
    gallery.innerHTML = "";

    clearActiveMenu();

    document
        .querySelector('[data-category="HOME"]')
        ?.classList.add("active-link");

    categories.forEach(category => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${category.cover}" alt="${category.name}">
            <div class="card-title">
                ${category.name}
            </div>
        `;

        card.addEventListener("click", () => {
            renderCategory(category.name);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   SUB GALERÍA
========================= */

function renderSubGallery(item) {

    gallery.innerHTML = "";

    const backButton = document.createElement("div");
    backButton.className = "back-button";
    backButton.innerHTML = "← Volver";

    backButton.addEventListener("click", () => {
        renderCategory(currentCategory);
    });

    gallery.appendChild(backButton);

    item.gallery.forEach(subItem => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${subItem.image}" alt="${subItem.title}">
            <div class="card-title">${subItem.title}</div>
        `;

        card.addEventListener("click", () => {
            openVideo(subItem.embed, subItem.type);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   CATEGORIA
========================= */

function renderCategory(categoryName) {

    currentCategory = categoryName;
    gallery.innerHTML = "";

    setActiveMenu(categoryName);

    const category = categories.find(c => c.name === categoryName);

    if (!category) {
        gallery.innerHTML = `
            <div class="error-message">
                Categoría no encontrada.
            </div>
        `;
        return;
    }

    const backButton = document.createElement("div");
    backButton.className = "back-button";
    backButton.innerHTML = "← Volver";

    backButton.addEventListener("click", renderHome);

    gallery.appendChild(backButton);

    category.items.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="card-title">
                ${item.title}
            </div>
        `;

        card.addEventListener("click", () => {

            if (item.gallery) {
                renderSubGallery(item);
                return;
            }

            openVideo(item.embed, item.type);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   VIDEO
========================= */

function openVideo(url, type = "embed") {

    if (type === "link") {
        window.open(url, "_blank");
        return;
    }

    if (!url) return;

    if (url.includes(".mp4")) {

        videoContainer.innerHTML = `
            <video controls autoplay style="width:100%;max-height:80vh;background:black;">
                <source src="${url}" type="video/mp4">
            </video>
        `;

    } else {

        videoContainer.innerHTML = `
            <iframe src="${url}" allowfullscreen loading="lazy"></iframe>
        `;
    }

    modal.style.display = "flex";

    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

function closeVideo() {

    modal.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
        videoContainer.innerHTML = "";
    }, 250);
}

/* =========================
   MENU
========================= */

function clearActiveMenu() {
    document.querySelectorAll("nav a")
        .forEach(link => link.classList.remove("active-link"));
}

function setActiveMenu(categoryName) {

    clearActiveMenu();

    document.querySelectorAll("nav a")
        .forEach(link => {
            if (link.dataset.category === categoryName) {
                link.classList.add("active-link");
            }
        });
}

/* =========================
   ANIMACION
========================= */

function animateGallery() {

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
            card.style.transition = "all .4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, index * 50);
    });
}

/* =========================
   NAV EVENTS (FIX PRINCIPAL)
========================= */

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();

        const category = item.dataset.category;

        if (!category) return;

        if (category === "HOME") {
            renderHome();
            return;
        }

        renderCategory(category);
    });
});

/* =========================
   MODAL EVENTS
========================= */

closeModal.addEventListener("click", closeVideo);

window.addEventListener("click", e => {
    if (e.target === modal) closeVideo();
});

/* =========================
   INIT
========================= */

loadVideos();
