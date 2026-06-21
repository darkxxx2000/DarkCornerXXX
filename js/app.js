const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];
let currentCategory = null;

/* =========================
   CARGA CATEGORÍAS
========================= */

async function loadVideos() {

    try {
        const response = await fetch("./data/categories.json");
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

    /* =========================
       🔥 CARD CHANNELS (NUEVO)
    ========================= */

    const channelsCard = document.createElement("div");
    channelsCard.className = "card";

    channelsCard.innerHTML = `
        <img src="images/channels-cover.jpg" alt="CHANNELS">
        <div class="card-title">CHANNELS</div>
    `;

    channelsCard.addEventListener("click", () => {
        window.location.href = "channels.html";
    });

    gallery.appendChild(channelsCard);

    /* =========================
       CATEGORÍAS NORMALES
    ========================= */

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
            renderCategory(category);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   CATEGORÍA (CARGA DINÁMICA JSON)
========================= */

async function renderCategory(category) {

    currentCategory = category;
    gallery.innerHTML = "";

    setActiveMenu(category.name);

    if (!category || !category.file) {
        gallery.innerHTML = `
            <div class="error-message">
                Categoría no encontrada.
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(category.file);
        const items = await response.json();

        const backButton = document.createElement("div");
        backButton.className = "back-button";
        backButton.innerHTML = "← Volver";

        backButton.addEventListener("click", renderHome);

        gallery.appendChild(backButton);

        items.forEach(item => {

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

    } catch (error) {
        console.error(error);
        gallery.innerHTML = `
            <div class="error-message">
                Error cargando categoría.
            </div>
        `;
    }
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
   VIDEO PLAYER
========================= */

function openVideo(url, type = "embed") {

    if (!url) return;

    switch (type) {

        case "link":
            window.open(url, "_blank");
            return;

        case "mp4":
            videoContainer.innerHTML = `
                <video controls autoplay playsinline style="width:100%;max-height:80vh;background:black;">
                    <source src="${url}" type="video/mp4">
                </video>
            `;
            break;

        case "embed":
            videoContainer.innerHTML = `
                <iframe
                    src="${url}"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            `;
            break;

        default:
            console.error("Tipo no soportado:", type);
            return;
    }

    modal.style.display = "flex";

    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

/* =========================
   CERRAR MODAL
========================= */

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
   ANIMACIÓN
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
   NAV EVENTS
========================= */

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {

        // 🔥 LINKS EXTERNOS (channels.html)
        if (item.dataset.external === "true") {
            return; // navegación normal
        }

        e.preventDefault();

        const categoryName = item.dataset.category;

        if (!categoryName) return;

        if (categoryName === "HOME") {
            renderHome();
            return;
        }

        const category = categories.find(c => c.name === categoryName);

        if (category) {
            renderCategory(category);
        }
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
