window.addEventListener("DOMContentLoaded", () => {

    const USER = "guyana";
    const PASS = "gaviotah15";

    let logged = false;

    // =========================
    // LOGIN SCREEN
    // =========================
    const login = document.createElement("div");
    login.id = "login";

    login.innerHTML = `
        <div class="box">
            <h2>ADMIN LOGIN</h2>

            <input id="u" placeholder="Usuario">
            <input id="p" type="password" placeholder="Contraseña">

            <button id="go">Entrar</button>
            <p id="msg"></p>
        </div>
    `;

    document.body.appendChild(login);

    // =========================
    // ADMIN PANEL
    // =========================
    const panel = document.createElement("div");
    panel.id = "panel";

    panel.innerHTML = `
        <button id="exit">Salir</button>
        <h3>ADMIN</h3>

        <input id="logoInput" placeholder="Editar logo">
        <button id="save">Guardar</button>
    `;

    document.body.appendChild(panel);

    panel.style.display = "none";

    // =========================
    // LOGIN
    // =========================
    document.getElementById("go").onclick = () => {

        const u = document.getElementById("u").value;
        const p = document.getElementById("p").value;

        if(u === USER && p === PASS){

            logged = true;
            login.style.display = "none";
            panel.style.display = "block";

        } else {
            document.getElementById("msg").innerText = "Incorrecto";
        }
    };

    // =========================
    // LOGOUT
    // =========================
    document.getElementById("exit").onclick = () => {
        logged = false;
        login.style.display = "flex";
        panel.style.display = "none";
    };

    // =========================
    // GUARDAR LOGO
    // =========================
    document.getElementById("save").onclick = () => {

        const val = document.getElementById("logoInput").value;

        if(val.trim() !== ""){
            localStorage.setItem("logo", val);
            document.querySelector(".logo").innerHTML = val;
        }
    };

    // =========================
    // CARGAR LOGO
    // =========================
    const saved = localStorage.getItem("logo");
    if(saved){
        document.querySelector(".logo").innerHTML = saved;
    }

});
