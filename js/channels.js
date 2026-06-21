const container = document.getElementById("channels");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

async function loadChannels() {

    const res = await fetch("./data/channels.json");
    const data = await res.json();

    renderChannels(data);
}

function renderChannels(channels) {

    container.innerHTML = "";

    channels.forEach(channel => {

        const section = document.createElement("section");
        section.className = "channel";

        section.innerHTML = `
            <h2 class="channel-title">${channel.title}</h2>

            <div class="channel-layout">

                <div class="main">
                    <img src="${channel.mainImage}" class="main-img">
                </div>

                <div class="gallery">
                    ${channel.gallery.map(img => `
                        <img src="${img.thumb}" class="thumb">
                    `).join("")}
                </div>

            </div>
        `;

        // CLICK MAIN IMAGE → LINK
        section.querySelector(".main-img").addEventListener("click", () => {
            window.open(channel.mainLink, "_blank");
        });

        // CLICK THUMBS → LIGHTBOX
        section.querySelectorAll(".thumb").forEach((img, index) => {
            img.addEventListener("click", () => {
                lightboxImg.src = channel.gallery[index].full;
                lightbox.classList.add("active");
            });
        });

        container.appendChild(section);
    });
}

// LIGHTBOX CLOSE
lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
});

loadChannels();
