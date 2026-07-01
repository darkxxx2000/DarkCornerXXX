document
.getElementById("loginBtn")
.addEventListener("click",()=>{

    const user=document.getElementById("user").value;

    const pass=document.getElementById("pass").value;

    if(user==="guyana" && pass==="gaviotah99"){

        window.location="dashboard.html";

    }

    else{

        document.getElementById("msg").innerHTML="Usuario o contraseña incorrectos.";

    }

});
