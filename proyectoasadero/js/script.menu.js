document.addEventListener("DOMContentLoaded", function () {
    const sesion = localStorage.getItem("sesionActiva");
        if (sesion !== "true") {
            window.location.href = "../html/ingresar_usuario.html";
            }

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

        colocarFechaActual();

    });


//PARA EVITAR VOLVER ATRÁS
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            window.location.reload();
            }
    });

    history.pushState(null, null, location.href);
    window.addEventListener("popstate", function () {
        localStorage.removeItem("sesionActiva");
        window.location.href = "../html/ingresar_usuario.html";
    });


// FUNCION PARA CERRAR SESION
function cerrarSesion() {
    if (confirm("¿Seguro que quieres cerrar sesión?")) {

        localStorage.removeItem("sesionActiva");
        localStorage.removeItem("usuarioSeleccionado");

        window.location.href = "index.html";
    }
};    

