const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];
let currentChannel = null;
let currentCategory = null;

/* =========================
   BASE PATH (IMPORTANTE PARA GITHUB PAGES)
========================= */

const BASE = location.pathname.includes("DarkCornerXXX")
    ? "/DarkCornerXXX"
    : "";

/* =========================
   ROUTING (FIX 404 GITHUB PAGES)
========================= */

function setRoute(route) {
    // evita romper GitHub Pages
    history.pushState({}, "", `${BASE}/${route}`);
}

function getRoute() {
    const path = location.pathname.replace(BASE, "").replace("/", "");
    return path || "home";
}

/* =========================
   INIT
========================= */

async function loadApp() {
    try {
        const res = await fetch(`${BASE}/data/categories.json`);

        if (!res.ok) {
            throw new Error("HTTP ERROR: " + res.status);
        }

        categories = await res.json();

        handleRoute();

    } catch (err) {
        console.error("LOAD APP ERROR:", err);
        gallery.innerHTML = `<div class="error-message">Error cargando categorías</div>`;
    }
}

/* =========================
   ROUTE HANDLER
========================= */

function handleRoute() {

    const route = getRoute();

    if (route === "home") {
        renderHome(false);
        return;
    }

    if (route === "channels") {
        renderChannels(false);
        return;
    }

    const category = categories.find(
        c => c.name.toLowerCase() === route.toLowerCase()
    );

    if (category) {
        renderCategory(category, false);
        return;
    }

    renderHome(false);
}

/* =========================
   HOME
========================= */

function renderHome(push = true) {

    currentChannel = null;
    currentCategory = null;

    gallery.innerHTML = "";
    clearActiveMenu();

    if (push) setRoute("home");

    const channelsCard = document.createElement("div");

    channelsCard.className = "card";

    channelsCard.innerHTML = `
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWcrJaKXlGMfPIRmnTg5CVtzEdi8x4zbGAUh6L5STo67jObCz5EnkMDqs&s=10">
        <div class="card-title">CHANNELS</div>
    `;

    channelsCard.addEventListener("click", () => {
        renderChannels(true);
    });

    gallery.appendChild(channelsCard);

    categories.forEach(cat => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${cat.cover}">
            <div class="card-title">${cat.name}</div>
        `;

        card.addEventListener("click", () => {
            renderCategory(cat, true);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   CHANNELS (FIX: ahora usa JSON opcional o fallback seguro)
========================= */

async function renderChannels(push = true) {

    currentChannel = "channels";
    currentCategory = null;

    gallery.innerHTML = "";
    clearActiveMenu();

    if (push) setRoute("channels");

    // FIX: si quieres, después puedes mover esto a JSON también
    const channels = [
        { name: "MACHINE", slug: "machine", cover: `${BASE}/images/channels/machine.jpg` },
        { name: "VIB", slug: "vib", cover: `${BASE}/images/channels/vib.jpg` },
        { name: "SHIBARI", slug: "shibari", cover: `${BASE}/images/channels/shibari.jpg` }
    ];

    const wrapper = document.createElement("div");
    wrapper.className = "channels-grid";

    channels.forEach(ch => {

        const item = document.createElement("div");

        item.className = "channel-circle";

        item.innerHTML = `
            <img src="${ch.cover}">
            <div class="channel-title">${ch.name}</div>
        `;

        item.addEventListener("click", () => {
            renderChannelCategory(ch.slug, true);
        });

        wrapper.appendChild(item);
    });

    gallery.appendChild(wrapper);

    animateGallery();
}

/* =========================
   CHANNEL CATEGORY (FIX PATH + ERROR HANDLING)
========================= */

async function renderChannelCategory(slug, push = true) {

    currentCategory = slug;
    gallery.innerHTML = "";

    gallery.appendChild(
        createBackButton(() => renderChannels(true))
    );

    if (push) setRoute(slug);

    try {
        const res = await fetch(`${BASE}/data/channels/${slug}.json`);

        if (!res.ok) {
            throw new Error("Channel JSON not found: " + slug);
        }

        const artists = await res.json();

        artists.forEach(artist => {

            const card = document.createElement("div");

            card.className = "card";

            card.innerHTML = `
                <img src="${artist.mainImage.src}">
                <div class="card-title">${artist.title}</div>
            `;

            card.addEventListener("click", () => {
                renderArtist(artist);
            });

            gallery.appendChild(card);
        });

        animateGallery();

    } catch (err) {
        console.error(err);
        gallery.innerHTML = `<div class="error-message">Error loading channel</div>`;
    }
}

/* =========================
   ARTIST
========================= */

function renderArtist(artist) {

    gallery.innerHTML = "";

    gallery.appendChild(
        createBackButton(() => renderChannels(true))
    );

    const block = document.createElement("div");

    block.className = "artist-block";

    block.innerHTML = `
        <div class="channel-section">

            <div class="big-image">
                <img src="${artist.mainImage.src}" class="main-link">
            </div>

            <div class="mini-grid">
                ${artist.items.map(i => `
                    <img src="${i.image}" class="mini-img">
                `).join("")}
            </div>

        </div>
    `;

    gallery.appendChild(block);

    block.querySelector(".main-link")
        .addEventListener("click", () => {
            window.open(artist.mainImage.link, "_blank");
        });

    block.querySelectorAll(".mini-img")
        .forEach((img, index) => {
            img.addEventListener("click", () => {
                openImageModal(artist.items, index);
            });
        });
}

/* =========================
   CATEGORY
========================= */

async function renderCategory(category, push = true) {

    currentCategory = category.name;
    gallery.innerHTML = "";

    if (push) setRoute(category.name.toLowerCase());

    gallery.appendChild(
        createBackButton(renderHome)
    );

    const res = await fetch(`${BASE}/${category.file}`);
    const items = await res.json();

    items.forEach(item => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${item.image}">
            <div class="card-title">${item.title}</div>
        `;

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   LIGHTBOX
========================= */

function openImageModal(images, start = 0) {

    let current = start;

    const modal = document.createElement("div");
    modal.className = "img-modal";

    function render() {
        modal.innerHTML = `
            <div class="img-modal-content">
                <span class="close">&times;</span>

                <img src="${images[current].image}" class="modal-img">

                <div class="nav">
                    <button class="prev">←</button>
                    <button class="next">→</button>
                </div>
            </div>
        `;

        modal.querySelector(".close").onclick = () => modal.remove();

        modal.querySelector(".prev").onclick = () => {
            current = (current - 1 + images.length) % images.length;
            render();
        };

        modal.querySelector(".next").onclick = () => {
            current = (current + 1) % images.length;
            render();
        };
    }

    render();
    document.body.appendChild(modal);
}

/* =========================
   UTILS
========================= */

function createBackButton(action) {
    const btn = document.createElement("div");
    btn.className = "back-button";
    btn.innerHTML = "← Volver";
    btn.addEventListener("click", action);
    return btn;
}

function clearActiveMenu() {
    document.querySelectorAll("nav a")
        .forEach(a => a.classList.remove("active-link"));
}

function animateGallery() {
    document.querySelectorAll(".card").forEach((c, i) => {
        c.style.opacity = 0;
        c.style.transform = "translateY(20px)";

        setTimeout(() => {
            c.style.transition = "0.4s ease";
            c.style.opacity = 1;
            c.style.transform = "translateY(0)";
        }, i * 50);
    });
}

/* =========================
   EVENTS
========================= */

window.addEventListener("popstate", handleRoute);

document.querySelectorAll(".nav-item").forEach(item => {

    item.addEventListener("click", e => {

        e.preventDefault();

        const cat = item.dataset.category;

        if (cat === "HOME") renderHome(true);
        if (cat === "CHANNELS") renderChannels(true);
    });
});

/* INIT */
loadApp();
