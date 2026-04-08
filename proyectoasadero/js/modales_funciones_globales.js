//=============================
// PARA EL SUBMENU
//=============================

// FUNCION PARA CERRAR TODOS LOS SUBMENUS
function toggleSubmenu(id) {
    document.querySelectorAll(".submenu").forEach(menu => {
        menu.style.display = (menu.id === id && menu.style.display !== "block") ? "block" : "none";
    });
}


//============================
// PARA LA FECHA AUTOMATICA 
// ===========================

// Variable para guardar el temporizador
let temporizadorFecha;
// FUNCION PARA CONTROL DE FECHA AUTOMÁTICA
function colocarFechaActual() {
    const hoy = new Date();
    const fecha = hoy.getFullYear() + '-' +
    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
    String(hoy.getDate()).padStart(2, '0');
    const horas = hoy.getHours().toString().padStart(2, "0");
    const minutos = hoy.getMinutes().toString().padStart(2, "0");
    const segundos = hoy.getSeconds().toString().padStart(2, "0");

    const fechaCompleta = `${fecha} ${horas}:${minutos}:${segundos}`;

    // Coloca la fecha en todos los campos con id o name "fecha"
    document.querySelectorAll('#fecha, [name="fecha"]').forEach(input => {
        input.value = fechaCompleta;
    });
}
// Coloca la fecha al cargar la página
window.addEventListener("DOMContentLoaded", colocarFechaActual);


// =====================================================
// PARA ABRIR, CERRAR Y DAR CLIC ATRAS EN LOS MODALES
//======================================================

//FUNCION PARA ABRIR MODAL
function abrirModal(idModal) {
    document.querySelectorAll(".modalmod, .modalEliminar, .modalDesactivar")
    .forEach(m => {
        if (m.id !== "modalMovimientosInventario") {
            m.style.display = "none";
        }
    });
    
    const modal = document.getElementById(idModal);
        if (modal) modal.style.display = "block";

    if (modal && modal.querySelector(".campo-fecha")) {
        colocarFechaActual();
        clearInterval(temporizadorFecha);
        temporizadorFecha = setInterval(colocarFechaActual, 1000);
    }
}

//FUNCION PARA CERRAR MODAL
function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = "none";

    // Se cierra el modal de entrada, detenemos el reloj
    if (idModal === 'modalEntradaInventario' && window.relojEntrada) {
        clearInterval(window.relojEntrada);
    }
}
//FUNCION PARA BOTON CANCELAR
function cancelarProceso(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.style.display = "none";    
    
    clearInterval(temporizadorFecha);

    const form = modal.querySelector("form");
    if (form) form.reset();

    if (typeof resetearFlujoUsuarios === "function") {
        resetearFlujoUsuarios();
    }

    // Limpiar crear usuario SI existe
    if (typeof limpiarCrearUsuario === "function") {
        limpiarCrearUsuario();
    }
}

//FUNCION BOTON ATRÁS
function Atras(modalActual, modalAnterior) { 
    document.getElementById(modalActual).style.display = "none"; 
    document.getElementById(modalAnterior).style.display = "block"; 
}
// FUNCION PARA CARGAR Y ABRIR MODAL DESDE ARCHIVO
function abrirModalDesdeArchivo(ruta, idModal) {
    fetch(ruta)
        .then(response => response.text())
        .then(html => {
            const contenedor = document.getElementById("contenedorModales");

            const modalExistente = document.getElementById(idModal);
            if (modalExistente) {
                modalExistente.remove();
            }

            contenedor.insertAdjacentHTML("beforeend", html);

            // INICIALIZACIONES
            if (idModal === "modalRegistroProducto") {
                iniciarRegistroProducto();
            }

            if (idModal === "modalMovimientosInventario") {
                cargarInventario();
            }

            if (idModal === "modalEntradaInventario") {
                setTimeout(() => cargarDatosEntrada(), 100);
            }

            if (idModal === "modalSalidaInventario") {
                setTimeout(() => cargarDatosSalida(), 100);
            }

            // Limpia solo en crear usuario             
            if (idModal.includes("CrearUsuario1")) {
                limpiarCrearUsuario();
            }

            // 🔥 ABRIR MODAL
            abrirModal(idModal);
        })
        .catch(error => console.error("Error cargando el modal:", error));
}

//=================================================================
// PARA MARCAR ERRORES Y LIMPIAR CAMPOS Y RESTABLECER FORMULARIO
//=================================================================

// FUNCION PARA MARCAR CAMPO CON ERROR DE COLOR ROJO
function marcarError(campo) {
    campo.classList.add("error-campo");
}
// FUNCION PARA LIMPIAR CAMPO QUE TENGA EL ERROR
function limpiarError(campo) {
    campo.classList.remove("error-campo");
}
// FUNCION PARA LIMPIAR UN FORMULARIO COMPLETO
function limpiarFormulario(form) {
    form.reset();
    form.querySelectorAll("input, select, textarea")
        .forEach(campo => limpiarError(campo));
}
// FUNCION PARA DESMARCAR TODOS LOS PERMISOS SELECCIONADOS
function limpiarCheckboxes(selector) {
    document.querySelectorAll(selector).forEach(chk => chk.checked = false);
}


//===========================
// PARA LAS CONTRASEÑAS
//===========================

//FUNCION PARA MOSTRAR Y OCULTAR CONTRASEÑAS
function togglePassword(idCampo, boton) {
    const input = document.getElementById(idCampo);
    const visible = input.type === "text";

    input.type = visible ? "password" : "text";
    boton.textContent = visible ? "👁️" : "🙈";
}
//FUNCION VALIDACION CONTRASEÑAS
function validarContraseñas(idContrasena, idConfirmar) {
    const contrasenaInput = document.getElementById(idContrasena);
    const confirmarInput = document.getElementById(idConfirmar);

    const contrasena = contrasenaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    if (contrasena !== confirmar) {
        alert("⚠️ Las contraseñas no coinciden. Por favor verifica.");
        marcarError(contrasenaInput);
        marcarError(confirmarInput);

        contrasenaInput.value = "";
        confirmarInput.value = "";
        contrasenaInput.focus();
        return false;
    }

    limpiarError(contrasenaInput);
    limpiarError(confirmarInput);
    return true;
}


// ================================================================================
// VALIDACIONES GENERALES
// ================================================================================
//FUNCION VALIDACION CAMPOS SIN DILIGENCIAR
function validarCamposVacios(form) {
    let valido = true;

    form.querySelectorAll("input, select").forEach(campo => {
        
        if (!campo.value || campo.value === "") {
            marcarError(campo);
            valido = false;
        } else {
            limpiarError(campo);
        }

    });

    return valido;
}

//FUNCION PARA AVANZAR ENTRE MODALES
function validarYpasar(formId, modalActual, modalSiguiente) {
    const form = document.getElementById(formId);

    if (!validarCamposVacios(form)) {
        alert("⚠️ Debes llenar todos los campos antes de continuar.");
        return false;
    }

    // ================================
    // VALIDACIÓN DE CONTRASEÑAS
    // ================================

    // 👉 CREAR USUARIO
    if (formId === "llenarCampos2") {
        if (!validarContraseñas("contrasena_crear", "confirmacioncontrasena_crear")) {
            return false;
        }
    }

    // 👉 MODIFICAR USUARIO
    if (formId === "ModificarCampos3") {
        const pass = document.getElementById("contrasena_modificada").value.trim();
        const confirm = document.getElementById("confirmacioncontrasena_modificada").value.trim();

        // SOLO valida si el usuario escribió algo
        if (pass || confirm) {
            if (!validarContraseñas("contrasena_modificada", "confirmacioncontrasena_modificada")) {
                return false;
            }
        }

        // VALIDAR ID AQUÍ (CLAVE)
        const idsRegistrados = Object.values(window.baseUsuarios).map(u => u.idEmpleado);
        const idActual = window.baseUsuarios[usuarioSeleccionado].idEmpleado;
        const input = document.getElementById("campoIdEmpleado");
        const nuevoID = input.value.trim();

        if (nuevoID !== idActual && idsRegistrados.includes(nuevoID)) {
            alert("⚠️ Este ID ya está registrado. Por favor elige uno diferente.");
            input.value = "";//limpiar campo
            marcarError(input);// borde rojo
            input.focus(); 
            return false; // BLOQUEA EL CAMBIO DE MODAL
        }

        limpiarError(input);
    }
    

    // EVITA DOBLE ENVÍO
    if (form.dataset.enviado) return false;
    form.dataset.enviado = "true";

    // CAMBIO DE MODAL
    document.getElementById(modalActual).style.display = "none";

    if (modalSiguiente) 
        document.getElementById(modalSiguiente).style.display = "block";
    else 
        alert("✅ Proceso completado.");

    setTimeout(() => delete form.dataset.enviado, 300);
    return false;
}


// ===========================
// LIMPIAR ERRORES AUTOMÁTICO
// ===========================
document.addEventListener("input", function(e) {
    if (e.target.matches("input, select, textarea")) {
        limpiarError(e.target);
    }
});

document.addEventListener("change", function(e) {
    if (e.target.matches("input, select")) {
        limpiarError(e.target);
    }
});