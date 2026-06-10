const gallery = document.getElementById("gallery");
const modal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const videoContainer = document.getElementById("videoContainer");

let allVideos = [];

async function loadVideos(){

    const response = await fetch("data/videos.json");

    allVideos = await response.json();

    renderGallery("HOME");
}

function renderGallery(category){

    gallery.innerHTML = "";

    let videos;

    if(category === "HOME"){
        videos = allVideos;
    }else{
        videos = allVideos.filter(
            item => item.category === category
        );
    }

    videos.forEach(video => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${video.image}" alt="${video.title}">
            <div class="card-title">${video.title}</div>
        `;

        card.addEventListener("click",()=>{

            modal.style.display = "flex";

            videoContainer.innerHTML = `
                <iframe
                src="${video.video}?autoplay=1"
                allowfullscreen
                allow="autoplay">
                </iframe>
            `;

        });

        gallery.appendChild(card);

    });

}

document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click",(e)=>{

        e.preventDefault();

        renderGallery(
            link.dataset.category
        );

    });

});

closeModal.addEventListener("click",()=>{

    modal.style.display="none";

    videoContainer.innerHTML="";

});

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        modal.style.display="none";

        videoContainer.innerHTML="";

    }

});

loadVideos();
