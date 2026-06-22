const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];
let currentChannel = null;
let currentCategory = null;

/* =========================
   ROUTING
========================= */

function setRoute(route) {
    history.pushState({}, "", `/${route}`);
}

function getRoute() {
    const path = location.pathname.replace("/", "");
    return path || "home";
}

/* =========================
   INIT
========================= */

async function loadApp() {
    try {
        const res = await fetch("/data/categories.json");

        if (!res.ok) {
            throw new Error("HTTP ERROR: " + res.status);
        }

        const text = await res.text();
        console.log("RAW JSON:", text);

        categories = JSON.parse(text);

        console.log("CATEGORIES PARSED:", categories);

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

    if (route.includes("-")) {
        renderArtistBySlug(route, false);
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

    /* CHANNELS CARD */
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

    /* CATEGORIES */
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
   CHANNELS (LEVEL 2)
========================= */

async function renderChannels(push = true) {

    currentChannel = "channels";
    currentCategory = null;

    gallery.innerHTML = "";
    clearActiveMenu();

    if (push) setRoute("channels");

    const channels = [
        {
            name: "MACHINE",
            slug: "machine",
            cover: "images/channels/machine.jpg"
        },
        {
            name: "VIB",
            slug: "vib",
            cover: "images/channels/vib.jpg"
        },
        {
            name: "SHIBARI",
            slug: "shibari",
            cover: "images/channels/shibari.jpg"
        }
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
   CHANNEL CATEGORY (LEVEL 3)
========================= */

async function renderChannelCategory(slug, push = true) {

    currentCategory = slug;
    gallery.innerHTML = "";

    gallery.appendChild(
        createBackButton(() => renderChannels(true))
    );

    if (push) setRoute(slug);

    try {
        const res = await fetch(`/data/channels/${slug}.json`);
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
    }
}

/* =========================
   ARTIST VIEW (LEVEL 4)
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
                ${artist.items.map((i, index) => `
                    <img src="${i.image}" data-index="${index}" class="mini-img">
                `).join("")}
            </div>

        </div>
    `;

    gallery.appendChild(block);

    /* LINK PRINCIPAL */
    block.querySelector(".main-link")
        .addEventListener("click", () => {
            window.open(artist.mainImage.link, "_blank");
        });

    /* MINI GALERÍA */
    block.querySelectorAll(".mini-img")
        .forEach((img, index) => {
            img.addEventListener("click", () => {
                openImageModal(artist.items, index);
            });
        });
}

/* =========================
   CATEGORY NORMAL (HOME LEVEL)
========================= */

async function renderCategory(category, push = true) {

    currentCategory = category.name;
    gallery.innerHTML = "";

    if (push) setRoute(category.name.toLowerCase());

    gallery.appendChild(
        createBackButton(renderHome)
    );

    const res = await fetch(category.file);
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
   MODAL IMAGE (LIGHTBOX)
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
   UTIL
========================= */

function clearActiveMenu() {
    document.querySelectorAll("nav a")
        .forEach(a => a.classList.remove("active-link"));
}

/* =========================
   ANIMATION
========================= */

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
