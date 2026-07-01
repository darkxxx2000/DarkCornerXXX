// =========================================
// DARK CORNER - ADMIN MODE + LOGIN + EDITOR
// =========================================

window.addEventListener("DOMContentLoaded", () => {

    let adminMode = false;

    // =============================
    // CREDENCIALES ADMIN
    // =============================
    const ADMIN_USER = "guyana";
    const ADMIN_PASS = "gaviotah15";

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
    // TOGGLE ADMIN (CON LOGIN)
    // =============================
    function toggleAdmin(){

        if(!adminMode){

            const user = prompt("Usuario admin:");
            const pass = prompt("Contraseña:");

            if(user === ADMIN_USER && pass === ADMIN_PASS){

                adminMode = true;
                adminBar.classList.add("show");
                console.log("Admin ON");

            } else {
                alert("Acceso denegado ❌");
            }

        } else {

            adminMode = false;
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

            if(value && value.trim() !== ""){

                localStorage.setItem("logoText", value);

                applySavedData();

                const input = document.getElementById("editLogo");
                if(input) input.value = "";

                alert("Logo guardado ✔");
            }
        }
    });

    // =============================
    // APLICAR DATOS GUARDADOS
    // =============================
    function applySavedData(){

        const logo = localStorage.getItem("logoText");

        const logoEl = document.querySelector(".logo");

        if(logoEl && logo){
            logoEl.innerHTML = logo;
        }
    }

    // =============================
    // INICIALIZAR AL CARGAR
    // =============================
    applySavedData();

});
