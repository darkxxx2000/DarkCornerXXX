const container = document.getElementById("channels");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

let channelCategories = [];

/* =========================
   INIT
========================= */

async function loadChannelCategories() {

    try {
        const res = await fetch("./data/channelCategories.json");
        channelCategories = await res.json();

        renderChannelCategories(channelCategories);

    } catch (err) {
        console.error("Error loading channel categories:", err);
    }
}

loadChannelCategories();

/* =========================
   LEVEL 2: CHANNEL CATEGORIES
========================= */

function renderChannelCategories(data) {

    container.innerHTML = "";

    data.forEach(cat => {

        const card = document.createElement("div");
        card.className = "channel-card";

        card.innerHTML = `
            <img src="${cat.cover}">
            <h2>${cat.name}</h2>
        `;

        card.addEventListener("click", () => {
            loadChannelCategory(cat.slug);
        });

        container.appendChild(card);
    });
}

/* =========================
   LEVEL 3: LOAD CATEGORY CONTENT
========================= */

async function loadChannelCategory(slug) {

    container.innerHTML = "";

    const back = document.createElement("button");
    back.innerText = "← Back";
    back.className = "back-btn";

    back.addEventListener("click", () => {
        renderChannelCategories(channelCategories);
    });

    container.appendChild(back);

    try {
        const res = await fetch(`./data/channels/${slug}.json`);
        const artists = await res.json();

        artists.forEach(artist => {

            const section = document.createElement("section");
            section.className = `artist-card ${artist.color || "red"}`;

            section.innerHTML = `
                <h2>${artist.title}</h2>

                <div class="artist-layout">

                    <div class="main">
                        <img src="${artist.mainImage.src}">
                    </div>

                    <div class="thumbs">
                        ${artist.items.map((img, i) => `
                            <img src="${img.image}" data-index="${i}">
                        `).join("")}
                    </div>

                </div>
            `;

            /* MAIN CLICK → LINK */
            section.querySelector(".main img")
                .addEventListener("click", () => {
                    window.open(artist.mainImage.link, "_blank");
                });

            /* THUMBS → LIGHTBOX */
            section.querySelectorAll(".thumbs img")
                .forEach((img, index) => {
                    img.addEventListener("click", () => {
                        openLightbox(artist.items, index);
                    });
                });

            container.appendChild(section);
        });

    } catch (err) {
        console.error(err);
    }
}

/* =========================
   LIGHTBOX (GALERÍA)
========================= */

function openLightbox(images, start = 0) {

    let current = start;

    lightbox.classList.add("active");

    function render() {
        lightboxImg.src = images[current].image;
    }

    render();

    lightbox.onclick = () => {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
    };
}
