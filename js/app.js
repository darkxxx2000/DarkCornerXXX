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

        const response = await fetch("data/categories.json");

        if (!response.ok) {
            throw new Error(`No se pudo cargar categories.json (${response.status})`);
        }

        categories = await response.json();

        renderHome();

    } catch (error) {

        console.error(error);

        gallery.innerHTML = `
            <div class="error-message">
                ${error.message}
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

    // LINKS: siempre nueva pestaña
    if (type === "link") {
        window.open(url, "_blank");
        return;
    }

    // MP4: reproducir interno
    if (type === "mp4") {
        videoContainer.innerHTML = `
            <video controls autoplay style="width:100%;max-height:80vh;background:black;">
                <source src="${url}">
            </video>
        `;
        modal.style.display = "flex";
        return;
    }

    // EMBED: SOLO si es iframe seguro
    if (url.includes("xhamster")) {
        // fallback estable
        window.open(url, "_blank");
        return;
    }

    // embed normal
    videoContainer.innerHTML = `
        <iframe
            src="${url}"
            allow="autoplay; fullscreen"
            allowfullscreen
            style="width:100%;height:80vh;border:0;">
        </iframe>
    `;

    modal.style.display = "flex";
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

        // PERMITIR LINKS EXTERNOS O PÁGINAS
        if (!item.dataset.category) {
            return;
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
