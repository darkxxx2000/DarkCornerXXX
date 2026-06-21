const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];
let currentCategory = null;
let currentChannel = null;

/* =========================
   ROUTING (CLEAN URL)
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
        renderHome(false);
        return;
    }

    if (route === "channels") {
        renderChannels(false);
        return;
    }

    /* 🔽 SUBCANALES (machine, vib, etc) */
    if (route.includes("-")) {
        const slug = route;
        renderChannelContent("", slug, false);
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

    currentCategory = null;
    currentChannel = null;
    gallery.innerHTML = "";

    clearActiveMenu();

    document
        .querySelector('[data-category="HOME"]')
        ?.classList.add("active-link");

    if (push) setRoute("home");

    /* CHANNELS CARD */
    const channelsCard = document.createElement("div");
    channelsCard.className = "card";

    channelsCard.innerHTML = `
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWcrJaKXlGMfPIRmnTg5CVtzEdi8x4zbGAUh6L5STo67jObCz5EnkMDqs&s=10" alt="CHANNELS">
        <div class="card-title">CHANNELS</div>
    `;

    channelsCard.addEventListener("click", () => {
        renderChannels(true);
    });

    gallery.appendChild(channelsCard);

    /* CATEGORIES */
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
   CHANNELS (SUB MENU)
========================= */

function renderChannels(push = true) {

    currentCategory = "CHANNELS";
    currentChannel = null;

    gallery.innerHTML = "";
    clearActiveMenu();

    if (push) setRoute("channels");

    const channels = [
        {
            name: "FUCK MACHINE",
            slug: "fuck-machine",
            cover: "https://ic-vt-nss.xhcdn.com/a/NDk4OTlkMWJjZDQ0YmMxZWE3OTA0YWJiYTc0N2IxY2I/s(w:2560,h:1440),webp/025/010/176/v2/2560x1440.219.webp"
        },
        {
            name: "HUGE DILDO CHANNEL",
            slug: "huge-dildo-channel",
            cover: "https://cdni.pornpics.com/460/1/137/54326842/54326842_001_8465.jpg"
        },
        {
            name: "SHIBARI CHANNEL",
            slug: "shibari-channel",
            cover: "https://ic-vt-nss.xhcdn.com/a/NWVmNTQwOTNlOTYyYzZmZGExYzkwOTE2MDFhYWM3N2Y/s(w:2560,h:1440),webp/029/354/833/v2/2560x1440.225.webp"
        }
    ];

    channels.forEach(ch => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${ch.cover}">
            <div class="card-title">${ch.name}</div>
        `;

        card.addEventListener("click", () => {
            renderChannelContent(ch.name, ch.slug, true);
        });

        gallery.appendChild(card);
    });

    animateGallery();
}

/* =========================
   CHANNEL CONTENT (LEVEL 2)
========================= */

async function renderChannelContent(channelName, channelSlug, push = true) {

    currentChannel = channelSlug;

    gallery.innerHTML = "";

    gallery.appendChild(
        createBackButton(() => renderChannels(false))
    );

    if (push) setRoute(channelSlug);

    const file = `./data/channels/${channelSlug}.json`;

    try {
        const response = await fetch(file);
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
    }
}

/* =========================
   CATEGORY (LEVEL 1 OLD)
========================= */

async function renderCategory(category, push = true) {

    if (!category || !category.file) return;

    currentCategory = category;
    gallery.innerHTML = "";

    setActiveMenu(category.name);

    if (push) setRoute(category.name.toLowerCase());

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
    }
}

/* =========================
   SUB GALLERY
========================= */

function renderSubGallery(item) {

    gallery.innerHTML = "";

    gallery.appendChild(
        createBackButton(() => {
            if (currentChannel) {
                renderChannelContent(currentChannel, false);
            } else {
                renderCategory(currentCategory, false);
            }
        })
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
   HELPERS
========================= */

function findChannel(name) {
    const list = ["fuck machine", "huge dildo channel", "shibari channel"];
    if (list.includes(name)) return { name };
    return null;
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
   VIDEO
========================= */

function openVideo(url, type = "embed") {

    if (!url) return;

    if (type === "link") {
        window.open(url, "_blank");
        return;
    }

    videoContainer.innerHTML = `
        <iframe src="${url}" allowfullscreen></iframe>
    `;

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10);
}

/* =========================
   CLOSE MODAL
========================= */

function closeVideo() {
    modal.classList.remove("show");

    setTimeout(() => {
        modal.style.display = "none";
        videoContainer.innerHTML = "";
    }, 200);
}

/* =========================
   MENU
========================= */

function clearActiveMenu() {
    document.querySelectorAll("nav a")
        .forEach(l => l.classList.remove("active-link"));
}

function setActiveMenu(name) {

    clearActiveMenu();

    document.querySelectorAll("nav a")
        .forEach(link => {
            if (link.dataset.category === name) {
                link.classList.add("active-link");
            }
        });
}

/* =========================
   ANIMATION
========================= */

function animateGallery() {

    document.querySelectorAll(".card").forEach((card, i) => {
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
            card.style.transition = "0.4s ease";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, i * 50);
    });
}

/* =========================
   NAV EVENTS
========================= */

document.querySelectorAll('.nav-item').forEach(item => {

    item.addEventListener('click', e => {

        if (item.dataset.external === "true") return;

        e.preventDefault();

        const category = item.dataset.category;

        if (!category) return;

        if (category === "HOME") {
            renderHome(true);
            return;
        }

        if (category === "CHANNELS") {
            renderChannels(true);
            return;
        }

        const found = categories.find(
            c => c.name === category
        );

        if (found) renderCategory(found, true);
    });
});

/* =========================
   MODAL EVENTS
========================= */

closeModal.addEventListener("click", closeVideo);

window.addEventListener("click", e => {
    if (e.target === modal) closeVideo();
});

window.addEventListener("keydown", e => {
    if (e.key === "Escape") closeVideo();
});

/* BACK BUTTON */
window.addEventListener("popstate", handleRoute);

/* INIT */
loadVideos();
