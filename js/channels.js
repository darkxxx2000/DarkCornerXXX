const container = document.getElementById("channels");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

let channelsData = [];

/* =========================
   INIT
========================= */

async function loadChannels() {
    try {
        const res = await fetch("./data/channels.json");
        channelsData = await res.json();
        renderChannels(channelsData);
    } catch (err) {
        console.error("Error loading channels:", err);
        container.innerHTML = "<p>Error loading channels</p>";
    }
}

loadChannels();

/* =========================
   RENDER CHANNELS
========================= */

function renderChannels(data) {

    container.innerHTML = "";

    data.forEach((channel) => {

        const section = document.createElement("section");
        section.className = "channel";

        section.innerHTML = `
            <h2 class="channel-title">${channel.title}</h2>

            <div class="channel-layout">

                <!-- MAIN -->
                <div class="channel-main">
                    <img class="main-img" src="${channel.mainImage}" alt="${channel.title}">
                </div>

                <!-- THUMBS (NETFLIX ROW) -->
                <div class="channel-thumbs">
                    ${channel.gallery.map((img, index) => `
                        <img 
                            src="${img.thumb}" 
                            data-full="${img.full}" 
                            data-index="${index}"
                        >
                    `).join("")}
                </div>

            </div>
        `;

        /* =========================
           ELEMENTOS
        ========================= */

        const mainImg = section.querySelector(".main-img");
        const thumbs = section.querySelectorAll(".channel-thumbs img");

        /* =========================
           CLICK MAIN → LINK EXTERNO
        ========================= */

        mainImg.addEventListener("click", () => {
            window.open(channel.mainLink, "_blank");
        });

        /* =========================
           HOVER THUMB → PREVIEW (NETFLIX STYLE)
        ========================= */

        thumbs.forEach((thumb) => {

            thumb.addEventListener("mouseenter", () => {
                mainImg.src = thumb.dataset.full;
            });

            /* CLICK THUMB → LIGHTBOX */
            thumb.addEventListener("click", () => {
                openLightbox(thumb.dataset.full);
            });
        });

        container.appendChild(section);
    });
}

/* =========================
   LIGHTBOX
========================= */

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("active");
}

/* CLOSE LIGHTBOX */
lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
});
