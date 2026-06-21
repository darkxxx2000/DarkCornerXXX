const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];
let currentCategory = null;

/* =========================
   ROUTING (URL HASH)
========================= */

function setRoute(route) {
    history.pushState({}, "", `#${route}`);
}

function getRoute() {
    return location.hash.replace("#", "") || "home";
}

/* =========================
   INIT
========================= */

async function loadVideos() {
    try {
        const response = await fetch("./data/categories.json");
        categories = await response.json();

        handleRoute();
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
   ROUTE HANDLER
========================= */

function handleRoute() {
    const route = getRoute();

    if (route === "home") {
        renderHome();
        return;
    }

    const category = categories.find(
        c => c.name.toLowerCase() === route.toLowerCase()
    );

    if (category) {
        renderCategory(category, false);
        return;
    }

    renderHome();
}

/* =========================
   HOME
========================= */

function renderHome(push = true) {

    currentCategory = null;
    gallery.innerHTML = "";

    clearActiveMenu();

    document
        .querySelector('[data-category="HOME"]')
        ?.classList.add("active-link");

    if (push) setRoute("home");

    /* =========================
       CHANNELS CARD (SOLO 1)
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
       CATEGORÍAS
    ========================= */

    categories.forEach(category => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${category.cover}" alt="${category.name}">
            <div class="card-title">${category.name}</div>
        `;

        card.addEventListener("click", () => {
            renderCategory(category, true);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   CATEGORY
========================= */

async function renderCategory(category, push = true) {

    if (!category || !category.file) {
        gallery.innerHTML = `
            <div class="error-message">
                Categoría no encontrada.
            </div>
        `;
        return;
    }

    currentCategory = category;
    gallery.innerHTML = "";

    setActiveMenu(category.name);

    if (push) setRoute(category.name);

    gallery.appendChild(
        createBackButton(renderHome)
    );

    try {
        const response = await fetch(category.file);
        const items = await response.json();

        items.forEach(item => {

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="card-title">${item.title}</div>
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

    gallery.appendChild(
        createBackButton(() => renderCategory(currentCategory, false))
    );

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
   BACK BUTTON
========================= */

function createBackButton(action) {

    const btn = document.createElement("div");
    btn.className = "back-button";
    btn.innerHTML = "← Volver";

    btn.addEventListener("click", action);

    return btn;
}

/* =========================
   VIDEO PLAYER
========================= */

function openVideo(url, type = "embed") {

    if (!url) return;

    switch (type) {

        case "link":
            window.open(url, "_blank", "noopener,noreferrer");
            return;

        case "mp4":
            videoContainer.innerHTML = `
                <video controls autoplay playsinline style="width:100%;max-height:80vh;background:black;">
                    <source src="${url}" type="video/mp4">
                </video>
            `;
            break;

        default:
            videoContainer.innerHTML = `
                <iframe src="${url}" allowfullscreen loading="lazy"></iframe>
            `;
    }

    modal.style.display = "flex";

    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

/* =========================
   CLOSE MODAL
========================= */

function closeVideo() {

    modal.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
        videoContainer.innerHTML = "";
    }, 250);
}

/* =========================
   MENU ACTIVE
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

        if (item.dataset.external === "true") return;

        e.preventDefault();

        const categoryName = item.dataset.category;

        if (!categoryName) return;

        if (categoryName === "HOME") {
            renderHome();
            return;
        }

        const category = categories.find(
            c => c.name === categoryName
        );

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

/* ESC KEY */
window.addEventListener("keydown", e => {
    if (e.key === "Escape") closeVideo();
});

/* =========================
   BACK BUTTON BROWSER
========================= */

window.addEventListener("popstate", handleRoute);

/* =========================
   INIT
========================= */

loadVideos();
