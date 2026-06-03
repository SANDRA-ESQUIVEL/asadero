//==================================================================================================================================
//PARA LA VERIFICACIÓN DE INICIO DE SESION Y CARGAR DATOS DEL ROL Y DEL USUARIO
//==================================================================================================================================
document.addEventListener("DOMContentLoaded", function () {
    verificarSesion();
    cargarDatosUsuario();
});

function verificarSesion() {
    const sesion = localStorage.getItem("sesionActiva");
    if (sesion !== "true") {
        window.location.href = "/html/ingresar_usuario.html";
        return;
    }
}

function cargarDatosUsuario() {
    const rol = localStorage.getItem("rolSeleccionado");
    const usuario = localStorage.getItem("usuarioSeleccionado");
    
    if (rol) {
        document.getElementById("rolUsuario").textContent =
            rol === "admin" ? "ADMINISTRADOR" : "VENDEDOR";
    }
    if (usuario) {
        document.querySelectorAll(".usuarioSeleccionado")
            .forEach(el => el.textContent = usuario);
    }
}


//==================================================================================================================================
// PARA CUANDO SE DA CLIC EN LA FLECHA DE ATRAS= EL SISTEMA PEDIRA QUE SE INGRESE DE NUEVO
//==================================================================================================================================
//PARA EVITAR VOLVER ATRÁS
window.addEventListener("pageshow", function (event) {
    if (event.persisted) window.location.reload();
});

history.pushState(null, null, location.href);
window.addEventListener("popstate", function () {
    localStorage.removeItem("sesionActiva");
    if (history.length > 1) {
        history.back();
    } else {
        window.location.href = "../html/ingresar_usuario.html";
    }
});


//==================================================================================================================================
// PARA EL SUBMENU
//==================================================================================================================================
// FUNCION PARA CERRAR TODOS LOS SUBMENUS
function toggleSubmenu(id) {
    document.querySelectorAll(".submenu").forEach(menu => {
        menu.style.display = (menu.id === id && menu.style.display !== "block") ? "block" : "none";
    });
}

//==================================================================================================================================
// PARA CERRAR SESION DANDO CLIC EN EL BOTON QUE APARECE AL FINAL DEL MENU
//==================================================================================================================================
// FUNCION PARA CERRAR SESION
function cerrarSesion() {
    if (confirm("¿Seguro que quieres cerrar sesión?")) {
        localStorage.removeItem("sesionActiva");
        localStorage.removeItem("usuarioSeleccionado");
        localStorage.removeItem("rolSeleccionado");
        
        window.location.href = "/html/index.html";
    }
};    
