window.addEventListener("DOMContentLoaded", () => {

    let adminMode = false;

    const ADMIN_USER = "guyana";
    const ADMIN_PASS = "gaviotah15";

    // =============================
    // OVERLAY LOGIN
    // =============================
    const loginBox = document.createElement("div");
    loginBox.id = "loginBox";

    loginBox.innerHTML = `
        <div class="loginCard">
            <h2>ADMIN LOGIN</h2>

            <input id="user" placeholder="Usuario">
            <input id="pass" type="password" placeholder="Contraseña">

            <button id="loginBtn">Entrar</button>

            <p id="msg"></p>
        </div>
    `;

    document.body.appendChild(loginBox);

    // =============================
    // ADMIN BAR
    // =============================
    const adminBar = document.createElement("div");
    adminBar.id = "adminBar";

    adminBar.innerHTML = `
        <button id="adminExit">✖ Salir</button>
        <span>🔒 ADMIN MODE</span>

        <hr>

        <input id="editLogo" placeholder="Editar logo">
        <button id="saveLogo">Guardar</button>
    `;

    document.body.appendChild(adminBar);

    // =============================
    // LOGIN
    // =============================
    document.getElementById("loginBtn").addEventListener("click", () => {

        const user = document.getElementById("user").value;
        const pass = document.getElementById("pass").value;

        if(user === ADMIN_USER && pass === ADMIN_PASS){

            adminMode = true;

            loginBox.style.display = "none";
            adminBar.classList.add("show");

        } else {
            document.getElementById("msg").innerText = "Credenciales incorrectas";
        }
    });

    // =============================
    // LOGOUT
    // =============================
    document.addEventListener("click",(e)=>{
        if(e.target.id === "adminExit"){
            adminMode = false;
            adminBar.classList.remove("show");
            loginBox.style.display = "flex";
        }
    });

    // =============================
    // GUARDAR LOGO
    // =============================
    document.addEventListener("click",(e)=>{
        if(e.target.id === "saveLogo"){

            const value = document.getElementById("editLogo").value;

            if(value.trim() !== ""){
                localStorage.setItem("logoText", value);
                document.querySelector(".logo").innerHTML = value;
            }
        }
    });

    // =============================
    // CARGAR DATOS
    // =============================
    const saved = localStorage.getItem("logoText");
    if(saved){
        document.querySelector(".logo").innerHTML = saved;
    }

});
