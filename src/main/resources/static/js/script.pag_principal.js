//==================================================================================================================================
// INICIALIZACIÓN GENERAL
//==================================================================================================================================
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    verificarSesionActiva();
    inicializarPagina();
});

//==================================================================================================================================
// VERIFICACIÓN DE SESIÓN
//==================================================================================================================================
function verificarSesionActiva() {
    const sesionActiva = localStorage.getItem("sesionActiva");
    if (sesionActiva === "true") {
        const paginaActual = window.location.pathname;
        if (!paginaActual.includes("menu_principal")) {
            window.location.href = "/html_menu/menu_principal.html";
        }
    }
}

//==================================================================================================================================
// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN
//==================================================================================================================================
function inicializarPagina() {
    const rol = localStorage.getItem("rolSeleccionado");
    const usuario = localStorage.getItem("usuarioSeleccionado");
    const btnRol = document.getElementById("rolPrincipal");
    
    // Configurar botón del rol si existe
    if (btnRol) {
        if (rol === "admin") {
            btnRol.textContent = "ADMINISTRADOR";
            mostrarListaAdmin();
        } else if (rol === "vendedor") {
            btnRol.textContent = "VENDEDOR";
            mostrarListaVendedores();
        } else if (usuario) {
            // En la página de login mostrar usuario seleccionado
            btnRol.textContent = usuario.toUpperCase();
        }
    }
}

//==================================================================================================================================
// FUNCION PARA ATRASAR 
//==================================================================================================================================
function volverPagina() {
    if (window.location.pathname.includes("seleccionar_usuario.html")) {
        localStorage.removeItem("rolSeleccionado");
        window.location.href = "index.html";
    } 

    if (window.location.pathname.includes("ingresar_usuario.html")) {
        localStorage.removeItem("usuarioSeleccionado");
        window.location.href = "seleccionar_usuario.html";
    } 
}

//==================================================================================================================================
// INDEX - PAGINA PRINCIPAL
//==================================================================================================================================
function seleccionaRol(rol) {
    localStorage.setItem("rolSeleccionado", rol);
    window.location.href = "seleccionar_usuario.html";
}

//==================================================================================================================================
// SELECCIONAR USUARIO 
//==================================================================================================================================
function seleccionarUsuario(nombre) {
    localStorage.setItem("usuarioSeleccionado", nombre);
    window.location.href = "ingresar_usuario.html"; 
}
//===============================================================================================
// SELECCIONAR USUARIO - FUNCION PARA LISTAS
//===============================================================================================
function mostrarListaAdmin() {
    const listaAdmin = document.getElementById("listaAdmin");
    if (listaAdmin) listaAdmin.style.display = "block";
    }

function mostrarListaVendedores() {
    const listaVendedores = document.getElementById("listaVendedores");
    if (listaVendedores) listaVendedores.style.display = "block";
    }

//==================================================================================================================================
// INGRESO DE USUARIO CON ID Y CONTRASEÑA - LOGIN
//==================================================================================================================================
function acceso() {
    const idEmpleado = document.getElementById("idEmpleado").value;
    const password = document.getElementById("password").value;
    
    fetch(`http://localhost:8080/api/usuarios/login/${idEmpleado}/${password}`)
    .then(res => res.json())
    .then(usuario => {
        if (usuario) {
            localStorage.setItem("sesionActiva", "true");
            localStorage.setItem("usuarioActual", usuario.nombre);
            window.location.href = "/html_menu/menu_principal.html";
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    });
}

//==================================================================================================================================
// OLVIDE CONTRASEÑA
//==================================================================================================================================
//Bonton Olvido Contraseña
function abrirOlvido() {
    window.open("/html/olvide_contrasena.html", "_blank");
}
//=================================================================
// DAR CLIC EN REPOSOCION DE CONTRAEÑA
//=================================================================
function reponer() {
    // Pedir el ID del empleado
    const idEmpleado = prompt("Ingresa tu ID de empleado:");
    
    if (!idEmpleado) return;
    
    fetch(`http://localhost:8080/api/recuperar/${idEmpleado}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Usuario no encontrado");
        }
        return response.json();
    })
    .then(usuario => {
        if (usuario) {
            alert(`Tu contraseña es: ${usuario.password}\n\nCambiala lo antes posible.`);
            window.close();
        }
    })
    .catch(error => {
        alert("Usuario no encontrado. Verifica tu ID.");
    });
}
//=================================================================
// DAR CLIC EN BOTON ATRAS
//=================================================================
function cerrarVentanaOlvido(){
    window.close(); 
}

//==================================================================================================================================
// LIMPIAR SESIÓN
//==================================================================================================================================
function limpiarSesion() {
    localStorage.clear();
    alert("Sesión limpiada. Recarga la página principal.");
}
