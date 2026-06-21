const channels = [
{
  title: "Maya Yang (Machine)",
  mainImage: "https://ei.phncdn.com/videos/202409/06/457455651/original/(m=eGNdHgaaaa)(mh=eb29UiXuWa1_4y2R)6.jpg",
  mainLink: "https://es.pornhub.com/pornstar/masha-yang/videos",
  gallery: [
    "https://ei.phncdn.com/videos/202409/06/457455651/original/(m=eGNdHgaaaa)(mh=eb29UiXuWa1_4y2R)6.jpg",
    "https://sitio.com/2.jpg",
    "https://sitio.com/3.jpg",
    "https://sitio.com/4.jpg"
  ]
},
{
  title: "Canal 2",
  mainImage: "https://sitio.com/main2.jpg",
  mainLink: "https://otro-sitio.com",
  gallery: [
    "https://sitio.com/a.jpg",
    "https://sitio.com/b.jpg"
  ]
}
];

const container = document.getElementById("container");

container.innerHTML = channels.map(c => `
<a class="card" href="${c.mainLink}">
    <img src="${c.mainImage}">
    <h3>${c.title}</h3>
</a>
`).join("");
