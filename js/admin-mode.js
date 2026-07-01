window.addEventListener("DOMContentLoaded", () => {

    const USER = "guyana";
    const PASS = "gaviotah15";

    let logged = false;

    // =========================
    // LOGIN BOX (MATCH CSS)
    // =========================
    const login = document.createElement("div");
    login.id = "loginBox";

    login.innerHTML = `
        <div class="loginCard">
            <h2>ADMIN LOGIN</h2>

            <input id="u" placeholder="Usuario">
            <input id="p" type="password" placeholder="Contraseña">

            <button id="go">Entrar</button>
            <p id="msg"></p>
        </div>
    `;

    document.body.appendChild(login);

    // =========================
    // ADMIN BAR (MATCH CSS)
    // =========================
    const panel = document.createElement("div");
    panel.id = "adminBar";

    panel.innerHTML = `
        <span class="adminTitle">ADMIN PANEL</span>

        <button id="exit">Salir</button>

        <input id="logoInput" placeholder="Editar logo">
        <button id="save">Guardar</button>
    `;

    document.body.appendChild(panel);

    // =========================
    // LOGIN
    // =========================
    document.getElementById("go").onclick = () => {

        const u = document.getElementById("u").value;
        const p = document.getElementById("p").value;

        if (u === USER && p === PASS) {

            logged = true;
            login.style.display = "none";
            panel.classList.add("show");

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
        panel.classList.remove("show");
    };

    // =========================
    // SAVE LOGO
    // =========================
    document.getElementById("save").onclick = () => {

        const val = document.getElementById("logoInput").value;

        if (val.trim() !== "") {
            localStorage.setItem("logo", val);
            document.querySelector(".logo").innerHTML = val;
        }
    };

    // =========================
    // LOAD LOGO
    // =========================
    const saved = localStorage.getItem("logo");
    if (saved) {
        document.querySelector(".logo").innerHTML = saved;
    }

});
