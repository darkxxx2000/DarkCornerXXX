// =========================================
// DARK CORNER - ADMIN MODE
// =========================================

let adminMode = false;

// Crear barra de administración
const adminBar = document.createElement("div");
adminBar.id = "adminBar";

adminBar.innerHTML = `
    <button id="adminExit">✖ Salir</button>
    <span class="adminTitle">🔒 MODO ADMIN</span>

    <button id="btnEdit">✏ Editar</button>
    <button id="btnImage">🖼 Imagen</button>
    <button id="btnVideo">🎥 Video</button>
    <button id="btnNew">➕ Nuevo</button>
    <button id="btnSave">💾 Guardar</button>
`;

document.body.appendChild(adminBar);

// Mostrar / ocultar barra
function toggleAdmin(){

    adminMode = !adminMode;

    if(adminMode){
        adminBar.classList.add("show");
        console.log("Modo Admin ACTIVADO");
    }else{
        adminBar.classList.remove("show");
        console.log("Modo Admin DESACTIVADO");
    }

}

// CTRL + SHIFT + A
document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==="a"){

        e.preventDefault();

        toggleAdmin();

    }

});

// Botón salir
document.getElementById("adminExit").onclick=()=>{

    adminMode=false;

    adminBar.classList.remove("show");

};
