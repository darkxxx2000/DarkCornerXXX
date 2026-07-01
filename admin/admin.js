document
.getElementById("loginBtn")
.addEventListener("click",()=>{

    const user=document.getElementById("user").value;

    const pass=document.getElementById("pass").value;

    if(user==="admin" && pass==="1234"){

        window.location="dashboard.html";

    }

    else{

        document.getElementById("msg").innerHTML="Usuario o contraseña incorrectos.";

    }

});
