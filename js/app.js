const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let categories = [];

async function loadVideos() {
    try {
        const response = await fetch("./data/videos.json");
        categories = await response.json();
        renderHome();
    } catch (error) {
        console.error("Error cargando JSON:", error);
        gallery.innerHTML = "<p>Error cargando contenido.</p>";
    }
}

function renderHome() {

    gallery.innerHTML = "";

    categories.forEach(category => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${category.cover}" alt="${category.name}">
            <div class="card-title">${category.name}</div>
        `;

        card.addEventListener("click", () => {
            renderCategory(category.name);
        });

        gallery.appendChild(card);
    });
}

function renderCategory(categoryName) {

    gallery.innerHTML = "";

    const category = categories.find(
        c => c.name === categoryName
    );

    if (!category) {
        gallery.innerHTML = "<p>Categoría no encontrada.</p>";
        return;
    }

    category.items.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="card-title">${item.title}</div>
        `;

        card.addEventListener("click", () => {

            modal.style.display = "flex";

            videoContainer.innerHTML = `
                <iframe
                    src="${item.embed}"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            `;
        });

        gallery.appendChild(card);
    });
}

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        const category = link.dataset.category;

        if (category === "HOME") {
            renderHome();
        } else {
            renderCategory(category);
        }
    });
});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";
    videoContainer.innerHTML = "";
});

window.addEventListener("click", e => {

    if (e.target === modal) {
        modal.style.display = "none";
        videoContainer.innerHTML = "";
    }
});

loadVideos();
