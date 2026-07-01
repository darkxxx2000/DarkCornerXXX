// =========================================
// DARK CORNER - ADMIN MODE + EDITOR
// =========================================

let adminMode = false;

// =============================
// CREAR ADMIN BAR
// =============================
const adminBar = document.createElement("div");
adminBar.id = "adminBar";

adminBar.innerHTML = `
    <button id="adminExit">✖ Salir</button>
    <span class="adminTitle">🔒 MODO ADMIN</span>

    <hr>

    <label>Editar logo</label>
    <input id="editLogo" placeholder="Nuevo texto del logo">

    <button id="saveLogo">💾 Guardar Logo</button>

    <hr>

    <button id="btnEdit">✏ Editar (modo futuro)</button>
    <button id="btnNew">➕ Nuevo</button>
`;

document.body.appendChild(adminBar);

// =============================
// TOGGLE ADMIN
// =============================
function toggleAdmin(){
    adminMode = !adminMode;

    if(adminMode){
        adminBar.classList.add("show");
        console.log("Admin ON");
    } else {
        adminBar.classList.remove("show");
        console.log("Admin OFF");
    }
}

// =============================
// TECLA SECRETA
// CTRL + SHIFT + A
// =============================
document.addEventListener("keydown",(e)=>{
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==="a"){
        e.preventDefault();
        toggleAdmin();
    }
});

// =============================
// CERRAR ADMIN
// =============================
document.addEventListener("click",(e)=>{
    if(e.target && e.target.id === "adminExit"){
        adminMode = false;
        adminBar.classList.remove("show");
    }
});

// =============================
// GUARDAR LOGO
// =============================
document.addEventListener("click",(e)=>{
    if(e.target && e.target.id === "saveLogo"){

        const value = document.getElementById("editLogo").value;

        if(value.trim() !== ""){
            localStorage.setItem("logoText", value);
            applySavedData();
            alert("Logo guardado");
        }
    }
});

// =============================
// APLICAR DATOS GUARDADOS
// =============================
function applySavedData(){

    const logo = localStorage.getItem("logoText");

    if(logo){
        document.querySelector(".logo").innerHTML = logo;
    }

}

// =============================
// INICIALIZAR AL CARGAR
// =============================
window.addEventListener("DOMContentLoaded", ()=>{

    applySavedData();

});
