//==========================
// PARA RESETEO USUARIOS
//==========================

// FUNCION PARA RESETEO GLOBAL
function resetearFlujoUsuarios() {
    usuarioSeleccionadoModificar = null;
    usuarioSeleccionadoEliminar = null;
    usuarioSeleccionadoDesactivar = null;

    // Quitar selección visual
    document.querySelectorAll(".usuario-card, .usuario-modificar, .usuario-eliminar, .usuario-desactivar")
    .forEach(c => c.classList.remove("seleccionado"));

    // Resetear todos los formularios
    document.querySelectorAll("#modalCrearUsuario1 form, #modalCrearUsuario2 form, #modalCrearUsuario3 form")
    .forEach(form => form.reset());

    // Cerrar todos los modales
    document.querySelectorAll(".modalmod, .modalEliminar, .modalDesactivar")
    .forEach(modal => modal.style.display = "none");
    
}

// FUNCION PARA VALIDAR PERMISOS
function validarPermisos(selector) {
    const seleccionados = document.querySelectorAll(selector + ":checked");
    if (seleccionados.length === 0) {
        alert("⚠️ Debes seleccionar al menos un permiso.");
        return false;
    }
    return true;
}

function finalizarProceso(formId, modalActual) {
    if (!validarPermisos(`#${formId} input[type="checkbox"]`)) return false;
    cerrarModal(modalActual);
    alert("✅ Usuario creado correctamente");
    return false; // evita recarga
}


// ===========================================================================================================================
// CREAR USUARIO
// ===========================================================================================================================
function limpiarCrearUsuario() {
    // Limpiar todos los formularios del proceso
    document.querySelectorAll("#llenarCampos1, #llenarCampos2, #llenarCampos3")
        .forEach(form => limpiarFormulario(form));
    // Desmarcar permisos
    limpiarCheckboxes('#modalCrearUsuario3 input[type="checkbox"]');
    // Limpiar fecha
    document.querySelectorAll('[name="fecha"], #fecha').forEach(campo => campo.value = "");
}

// ====================================
// FORMULARIO 1 (DATOS PERSONALES)
// ====================================
document.getElementById("llenarCampos1")?.addEventListener("submit", e => {
    e.preventDefault();
    validarYpasar("llenarCampos1", "modalCrearUsuario1", "modalCrearUsuario2");
});

// ====================================
// FORMULARIO 2 (ID + CONTRASEÑA)
// ====================================
document.getElementById("llenarCampos2")?.addEventListener("submit", e => {
    e.preventDefault();

    const idsRegistrados = Object.values(window.baseUsuarios).map(u => u.idEmpleado);
    const form = e.target;
    const idEmpleadoInput = form.querySelector('[name="idEmpleado"]');
    const idEmpleado = idEmpleadoInput.value.trim();
    // Validar ID existente
    if (idsRegistrados.includes(idEmpleado)) {
        alert("⚠️ El ID ingresado ya existe. Por favor ingrese uno diferente.");
        marcarError(idEmpleadoInput);
        idEmpleadoInput.value = "";
        idEmpleadoInput.focus();
        return;
    }
        limpiarError(idEmpleadoInput);
        // Validar contraseñas
        if (!validarContraseñas("contrasena_crear", "confirmacioncontrasena_crear")) return;
            validarYpasar("llenarCampos2", "modalCrearUsuario2", "modalCrearUsuario3");
});

// =========================================
// FORMULARIO 3 SELECCION DE PERMISOS
// =========================================
document.getElementById("llenarCampos3")?.addEventListener("submit", e => {
    e.preventDefault();

    const permisos = document.querySelectorAll('#modalCrearUsuario3 input[type="checkbox"]');
        if (!Array.from(permisos).some(chk => chk.checked)) {
            alert("⚠️ Debes seleccionar al menos un permiso antes de finalizar.");
            return;
        }

        if (!validarYpasar("llenarCampos3", "modalCrearUsuario3", null)) return;

    // Guardar datos
    const datos = {};

    document.querySelectorAll("#modalCrearUsuario1 input, #modalCrearUsuario2 input, #modalCrearUsuario2 select")
        .forEach(campo => datos[campo.name] = campo.value);

    datos.permisos = Array.from(
        document.querySelectorAll('#modalCrearUsuario3 input[type="checkbox"]:checked')
    ).map(chk => chk.value);

    window.baseUsuarios[datos.idEmpleado] = datos;

    localStorage.setItem("usuarios", JSON.stringify(window.baseUsuarios));

    alert("✅ Usuario creado correctamente.");

    limpiarCrearUsuario();
    cerrarModal("modalCrearUsuario3");
});


//=================================================================================================
// MODIFICAR USUARIO
//=================================================================================================

//===============================
// BASE DE USUARIOS (GLOBAL)
//===============================

window.baseUsuarios = {
    "Administrador": {
        estado: "ACTIVO",
        nombre: "Pepita",
        apellido: "Perez",
        documento: "123456",
        tipoDocumento: "CC",
        correoPersonal: "pepita@gmail.com",
        telefono: "3001234567",
        idEmpleado: "Administrador",
        contrasena:"admin123",
        confirmarContrasena:"admin123",
        correoEmpresa: "broasterhouse@gmail.com",
        rolEmpleado: "admin",
        permisos: ["crear", "modificar", "registrarVentas"]
    },

    "Vendedor001": {
        estado: "ACTIVO",
        nombre: "Cata",
        apellido: "Sanchez",
        documento: "654321",
        tipoDocumento: "TI",
        correoPersonal: "cata@gmail.com",
        telefono: "3009876543",
        idEmpleado: "Vendedor001",
        contrasena:"vend001",
        confirmarContrasena:"vend001",
        correoEmpresa: "broasterhouse@gmail.com",
        rolEmpleado: "empleado",
        permisos: ["registrarVentas", "historialVentas"]
    },

    "Vendedor002": {
        estado: "ACTIVO",
        nombre: "Juanita",
        apellido: "Diaz",
        documento: "789456",
        tipoDocumento: "CE",
        correoPersonal: "juanita@gmail.com",
        telefono: "3014567890",
        idEmpleado: "Vendedor002",
        contrasena:"vend002",
        confirmarContrasena:"vend002",
        correoEmpresa: "broasterhouse@gmail.com",
        rolEmpleado: "empleado",
        permisos: ["consultarInventario"]
    }
};

window.baseUsuarios = JSON.parse(localStorage.getItem("usuarios")) || window.baseUsuarios;
//========================================
// PARA VARIABLES CONTROL POR PROCESO
//========================================
// Variable para guardar el usuario actual
let usuarioSeleccionadoModificar = null;
let usuarioSeleccionadoEliminar = null;
let usuarioSeleccionadoDesactivar = null;

//========================================
// SELECCIONAR USUARIO (Con toggle)
//========================================
function seleccionarUsuario(elemento) {

    const usuario = elemento.dataset.usuario;
    const data = window.baseUsuarios[usuario];

    if (!data) {
        alert("❌ Usuario no encontrado.");
        return;
    }

    if (data.estado === "INACTIVO") {
        alert("⚠️ Este usuario está inactivo y no puede ser modificado.");
        return;
    }

    const tarjetas = document.querySelectorAll(".usuario-modificar");

    // Si ya está seleccionado → deseleccionar
    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        usuarioSeleccionadoModificar = null;
    } else {
        // Quitar selección a todos
        tarjetas.forEach(card => card.classList.remove("seleccionado"));

        // Seleccionar el actual
        elemento.classList.add("seleccionado");
        usuarioSeleccionadoModificar = usuario;
    }

    console.log("Seleccionado:", usuarioSeleccionadoModificar);
}

//=============================================
// PASO 1 → PASO 2 (cargar datos personales)
//=============================================
document.addEventListener("click", function(e) {

    if (e.target && e.target.id === "btnModificarPaso1") {

    if (!usuarioSeleccionadoModificar) {
        alert("Debe seleccionar un usuario primero.");
        return;
    }

    const data = window.baseUsuarios[usuarioSeleccionadoModificar];

    // Cargar campos del modal 2
    document.getElementById("campoNombreModificar").value = data.nombre;
    document.getElementById("campoApellidoModificar").value = data.apellido;
    document.getElementById("campoDocumentoModificar").value = data.documento;
    document.getElementById("campoTipoDocumentoModificar").value = data.tipoDocumento;
    document.getElementById("campoCorreoPersonalModificar").value = data.correoPersonal;
    document.getElementById("campoTelefonoModificar").value = data.telefono;

    // Mostrar siguiente modal
    abrirModal("modalModificar2");
}
});

//=========================
// PASO 2 → PASO 3
//=========================
document.addEventListener("submit", function(e) {

    if (e.target && e.target.id === "ModificarCampos2") {
        e.preventDefault();

    if (!validarYpasar("ModificarCampos2", "modalModificar2", "modalModificar3")) return;

    const data = window.baseUsuarios[usuarioSeleccionadoModificar];

    document.getElementById("campoIdEmpleadoModificar").value = data.idEmpleado;
    document.getElementById("contrasena_modificada").value = data.contrasena;
    document.getElementById("confirmacioncontrasena_modificada").value = data.confirmarContrasena;
    document.getElementById("campoCorreoEmpresaModificar").value = data.correoEmpresa;
    document.getElementById("campoRolEmpleadoModificar").value = data.rolEmpleado;

    // Mostrar siguiente modal
    abrirModal("modalModificar3");
    }
});

//================================
// PASO 3 → PASO 4 (permisos)
//================================
document.addEventListener("submit", function(e) {

    if (e.target && e.target.id === "ModificarCampos3") {
        e.preventDefault();
   
        const dataActual = window.baseUsuarios[usuarioSeleccionadoModificar];
        const idActual = dataActual.idEmpleado;
        const nuevoID = document.getElementById("campoIdEmpleadoModificar").value.trim();

            // primero validarYpasar (aquí ya valida ID también)
            if (!validarYpasar("ModificarCampos3", "modalModificar3", "modalModificar4")) return;

            // Actualizar ID solo si cambió correctamente
            if (nuevoID !== idActual) {
                dataActual.idEmpleado = nuevoID;
            }

        // Cargar permisos
        const data = window.baseUsuarios[usuarioSeleccionadoModificar];

        document.querySelectorAll("#ModificarCampos4 input[type='checkbox']")
            .forEach(ch => ch.checked = false);

        data.permisos.forEach(permiso => {
            const chk = document.querySelector(`#ModificarCampos4 input[value='${permiso}']`);
            if (chk) chk.checked = true;
        });
    }
});

//=======================================
// PASO FINAL — BOTON MODIFICAR
//=======================================
document.addEventListener("click", function(e) {

    if (e.target && e.target.id === "btnModificar") {
        e.preventDefault();

    // Verificar que al menos un permiso esté seleccionado
const permisosSeleccionados = document.querySelectorAll("#ModificarCampos4 input[type='checkbox']:checked");

    if (permisosSeleccionados.length === 0) {
        alert("⚠️ Debes seleccionar al menos un permiso.");
        return;  
    }

    if (!validarYpasar("ModificarCampos4", "modalModificar4", null)) return;

const usuario = {
            nombre: document.getElementById("campoNombreModificar").value,
            apellido: document.getElementById("campoApellidoModificar").value,
            documento: document.getElementById("campoDocumentoModificar").value,
            tipoDocumento: document.getElementById("campoTipoDocumentoModificar").value,
            correoPersonal: document.getElementById("campoCorreoPersonalModificar").value,
            telefono: document.getElementById("campoTelefonoModificar").value,

            idEmpleado: document.getElementById("campoIdEmpleadoModificar").value,
            contrasena: document.getElementById("contrasena_modificada").value,
            correoEmpresa: document.getElementById("campoCorreoEmpresaModificar").value,
            rolEmpleado: document.getElementById("campoRolEmpleadoModificar").value,

            permisos: Array.from(permisosSeleccionados).map(chk => chk.value)
        };

        const idAnterior = usuarioSeleccionadoModificar;
        const nuevoID = usuario.idEmpleado;

        const datosAnteriores = window.baseUsuarios[idAnterior] || {};

        if (idAnterior !== nuevoID) {
            delete window.baseUsuarios[idAnterior];
        

            document.querySelectorAll(".usuario-modificar").forEach(card => {
                if (card.dataset.usuario === idAnterior) {
                    card.dataset.usuario = nuevoID;
                }
            });
        }

        window.baseUsuarios[nuevoID] = {
            ...datosAnteriores,
            ...usuario
        };

    usuarioSeleccionadoModificar = nuevoID;
//=====================================================================================================================
        // 🔥 SIMULACIÓN DE ENVÍO A API
        console.log("Enviar a API:", usuario);


        localStorage.setItem("usuarios", JSON.stringify(window.baseUsuarios));
//=====================================================================================================================
        alert("✅ Usuario modificado correctamente");

        cerrarModal("modalModificar4");
        resetearFlujoUsuarios();
    }
});


//=================================================================================================
// ELIMINAR USUARIO
//=================================================================================================

// Función para seleccionar/deseleccionar usuario
function eliminarUsuario(elemento) {
    const usuario = elemento.dataset.usuario;

    if (window.baseUsuarios[usuario]?.estado === "INACTIVO") {
        alert("⚠️ No puedes eliminar un usuario inactivo.");
        return;
    }

    const tarjetas = document.querySelectorAll(".usuario-eliminar");

    // Si ya está seleccionado → deseleccionar
    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        usuarioSeleccionadoEliminar = null;
        return;
    }

    // Seleccionar nuevo
    tarjetas.forEach(card => card.classList.remove("seleccionado"));
    elemento.classList.add("seleccionado");
    usuarioSeleccionadoEliminar = usuario;
}

// Botón ELIMINAR → Paso 1
document.addEventListener("click", function(e) {

    if (e.target && e.target.id === "btnEliminarPaso1") {

        if (!usuarioSeleccionadoEliminar) {
            alert("⚠️ Debes seleccionar un usuario para eliminar.");
            return;
        }

        if (usuarioSeleccionadoEliminar === "Administrador") {
            alert("⚠️ No puedes eliminar el usuario administrador.");
            return;
        }

        if (!window.baseUsuarios[usuarioSeleccionadoEliminar]) {
            alert("⚠️ El usuario ya no existe.");
            return;
        }

        const confirmar = confirm(`⚠️ ¿Deseas eliminar al usuario "${usuarioSeleccionadoEliminar}"?`);

        if (confirmar) {
            delete window.baseUsuarios[usuarioSeleccionadoEliminar];

            localStorage.setItem("usuarios", JSON.stringify(window.baseUsuarios));

            alert(`✅ Usuario "${usuarioSeleccionadoEliminar}" eliminado correctamente.`);

            usuarioSeleccionadoEliminar = null;

            document.querySelectorAll(".usuario-eliminar")
                .forEach(c => c.classList.remove("seleccionado"));

            resetearFlujoUsuarios();
            cerrarModal("modalEliminar");
        }
    }
});


//=================================================================================================
// DESACTIVAR USUARIO
//=================================================================================================

// Función para seleccionar/deseleccionar usuario
function desactivarUsuario(elemento) {
    const usuario = elemento.dataset.usuario;
    const tarjetas = document.querySelectorAll(".usuario-desactivar");

    // Si ya está seleccionado → deseleccionar
    if (elemento.classList.contains("seleccionado")) {
        elemento.classList.remove("seleccionado");
        usuarioSeleccionadoDesactivar = null;
        return;
    }

    // Seleccionar nuevo
    tarjetas.forEach(card => card.classList.remove("seleccionado"));
    elemento.classList.add("seleccionado");
    usuarioSeleccionadoDesactivar = usuario;

//==============================================================================================================
    console.log("Seleccionado:", usuarioSeleccionadoDesactivar);
//==============================================================================================================
}

//=================================
// ABRIR EL SIGUIENTE MODAL
//=================================
function abrirDesactivar() {
    abrirModal("modalDesactivar");

    // aquí se hace la limpieza
    const modal = document.getElementById("modalDesactivar");
    // Resetear formulario
    const form = modal.querySelector("form");
    if (form) form.reset();

    if (!usuarioSeleccionadoDesactivar) {
        document.querySelectorAll(".usuario-desactivar")
            .forEach(card => card.classList.remove("seleccionado"));
    }
}

// Botón DESACTIVAR → Paso 1
document.addEventListener("click", function(e) {

    if (e.target && e.target.id === "btnDesactivarPaso1") {

        if (!usuarioSeleccionadoDesactivar) {
            alert("⚠️ Debes seleccionar un usuario para desactivar.");
            return;
        }

    const confirmar = confirm(`⚠️ ¿Deseas desactivar al usuario "${usuarioSeleccionadoDesactivar}"?`);

        if (confirmar) {
            cerrarModal("modalDesactivar");
            abrirModal("modalDesactivar1");
        }
    }
});

document.addEventListener("submit", function(e) {

    if (e.target && e.target.id === "seleccionarCampos1") {

        e.preventDefault();
        e.stopPropagation();

//============================================================================================================
        console.log("🔥 SUBMIT CONTROLADO");
//==============================================================================================================

        const campoInicio = document.getElementById("fechaInicio");
        const campoFin = document.getElementById("fechaFin");
        const campoMotivo = document.getElementById("motivoDesactivacion");

        const inicio = campoInicio.value;
        const fin = campoFin.value;
        const motivo = campoMotivo.value;

        // Limpiar errores antes de validar
        limpiarError(campoInicio);
        limpiarError(campoFin);
        limpiarError(campoMotivo);
          
            if (fin < inicio) {
                marcarError(campoInicio);
                marcarError(campoFin);

                alert("⚠️ La fecha de finalización no puede ser anterior a la fecha de inicio.");
                return;
            }

            if (!motivo) {
                marcarError(campoMotivo);

                alert("⚠️ Debes seleccionar un motivo de desactivación.");
                return;
            }

            if (usuarioSeleccionadoDesactivar && window.baseUsuarios[usuarioSeleccionadoDesactivar]) {
            window.baseUsuarios[usuarioSeleccionadoDesactivar].estado = "INACTIVO";

            // Guardar en localStorage
            localStorage.setItem("usuarios", JSON.stringify(window.baseUsuarios));
     
            alert("Usuario desactivado correctamente.");
            resetearFlujoUsuarios(); // Limpiar variables y cerrar modales
            } else {
                alert("⚠️ Por favor, selecciona un usuario de la lista primero.");
            }

        cerrarModal("modalDesactivar1");
    }
    });


// Agrega o verifica esta función en tu JS
function seleccionarParaDesactivar(elemento) {
    const id = elemento.dataset.usuario;
    
    // Quitar selección visual previa
    document.querySelectorAll(".usuario-desactivar").forEach(card => card.classList.remove("seleccionado"));
    
    // Marcar nuevo seleccionado
    elemento.classList.add("seleccionado");
    usuarioSeleccionadoDesactivar = id; // AQUÍ se asigna el valor
    console.log("Listo para desactivar:", usuarioSeleccionadoDesactivar);
}



function actualizarEstadoVisual(usuario) {
    const tarjetas = document.querySelectorAll(".usuario-desactivar");

    tarjetas.forEach(card => {

        const usuarioCard = card.dataset.usuario; // 🔥 AQUÍ VA

        if (usuarioCard === usuario) {

            let estadoSpan = card.querySelector(".estado");

            if (!estadoSpan) {
                estadoSpan = document.createElement("span");
                estadoSpan.classList.add("estado");
                card.appendChild(document.createElement("br"));
                card.appendChild(estadoSpan);
            }

            const estado = window.baseUsuarios[usuario].estado;

            estadoSpan.textContent = estado;

            estadoSpan.classList.remove("activo", "inactivo");

            if (estado === "ACTIVO") {
                estadoSpan.classList.add("activo");
            } else {
                estadoSpan.classList.add("inactivo");
            }
        }
    });
}