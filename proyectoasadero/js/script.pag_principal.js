//===============================================================================================
// INDEX - PAGINA PRINCIPAL
//===============================================================================================
function seleccionaRol(rol) {
    localStorage.setItem("rolSeleccionado", rol);
    window.location.href = "seleccionar_usuario.html";
}


//===============================================================================================
// SELECCIONAR USUARIO 
//===============================================================================================
const rol = localStorage.getItem("rolSeleccionado");
const rolPrincipal = document.getElementById("rolPrincipal");
    // Mostrar el botón grande con el rol
    if(rolPrincipal) {
        rolPrincipal.textContent = rol === "admin" ? "ADMINISTRADOR" : "VENDEDOR";
    }

const listaAdmin = document.getElementById("listaAdmin");
const listaVendedores = document.getElementById("listaVendedores");

    // Mostrar solo el contenedor correspondiente
    if (rol === "admin" && listaAdmin) {
        listaAdmin.style.display = "block";
    } else if (rol === "vendedor" && listaVendedores) {
        listaVendedores.style.display = "block";
    }

function seleccionarUsuario(nombre) {
        localStorage.setItem("usuarioSeleccionado", nombre);
        window.location.href = "ingresar_usuario.html"; 
    }


//===============================================================================================
// INGRESO DE USUARIO CON ID Y CONTRASEÑA
//===============================================================================================
function acceso() {

    // ============================
    // VALIDAR USUARIO SELECCIONADO
    // ============================
    const usuarioSeleccionado = localStorage.getItem("usuarioSeleccionado");

    if (!usuarioSeleccionado) {
        alert("⚠️ No se ha seleccionado un usuario.");
        window.location.href = "seleccionar_usuario.html";
        return;
    }

    // ============================
    // CAPTURAR DATOS DEL FORMULARIO
    // ============================
    const idusuario = document.getElementById("idEmpleado").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!idusuario || !password) {
        alert("⚠️ Por favor completa todos los campos.");
        return;
    }

    // ============================
    // BASE DE DATOS SIMULADA
    // ============================
    const usuarios = {
        "Pepita Perez": { id: "Administrador", password: "admin123" },
        "Juanita Diaz": { id: "Vendedor001", password: "vend001" },
        "Anita Lopez": { id: "Vendedor002", password: "vend002" }
    };

    const datosUsuario = usuarios[usuarioSeleccionado];

    // VALIDAR QUE EXISTA EL USUARIO
    if (!datosUsuario) {
        alert("❌ Usuario no encontrado.");
        localStorage.removeItem("usuarioSeleccionado");
        window.location.href = "seleccionar_usuario.html";
        return;
    }

    // VALIDAR ID
    if (idusuario !== datosUsuario.id) {
        alert("❌ ID de usuario incorrecto.");
        document.getElementById("idEmpleado").value = "";
        document.getElementById("password").value = "";
        document.getElementById("idEmpleado").focus();
        return;
    }

    // VALIDAR CONTRASEÑA
    if (password !== datosUsuario.password) {
        alert("❌ Contraseña incorrecta.");
        document.getElementById("password").value = "";
        document.getElementById("password").focus();
        return;
    }

    // ============================
    // ACCESO EXITOSO
    // ============================
    alert("✅ Bienvenido " + usuarioSeleccionado);

    localStorage.setItem("sesionActiva", "true");

    // 🔥 (Opcional para futuro backend)
    console.log("📦 Datos validados:", {
        usuarioSeleccionado,
        idusuario
    });

    window.location.href = "/html_menu/menu_principal.html";
}


//===============================================================================================
// OLVIDE CONTRASEÑA
//===============================================================================================
//Bonton Olvido Contraseña
function abrirOlvido() {
    window.open("olvide_contrasena.html", "_blank");
}

//Dar clic en Reposision de Contraseña
function reponer() {
    if (confirm("¿Seguro que quieres Reponer Contraseña?")) 
        alert(`✅ Se ha enviado una nueva contraseña al correo: **************@gmail.com`);
        {
    window.close();    } 
}

//Dar clic en boton Atras
function atrasar() {
    window.close(); 
};


