//==================================================================================================================================
// VARIABLES GLOBALES COMPARTIDAS
//==================================================================================================================================
// Variable para guardar el temporizador
let temporizadorFecha;


//==================================================================================================================================
// FUNCION PARA CARGAR LA FECHA ACTUAL DE MANERA AUTOMATICA EN TODOS LOS CAMPOS DE FECHA
//==================================================================================================================================
//=================================================================
// FUNCION PARA CONTROL DE FECHA AUTOMÁTICA
//================================================================= 
function colocarFechaActual(formato = 'completo') {
    const hoy = new Date();

    const fecha = hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0');

    const horas = hoy.getHours().toString().padStart(2, "0");
    const minutos = hoy.getMinutes().toString().padStart(2, "0");
    const segundos = hoy.getSeconds().toString().padStart(2, "0");

    const fechaCompleta = `${fecha} ${horas}:${minutos}:${segundos}`;

    document.querySelectorAll('.campo-fecha')
    .forEach(input => {
        if (formato === 'simple') {
            input.value = hoy.toLocaleDateString('es-CO');
        } else {
            input.value = fechaCompleta;
        }
    });
}
//=================================================================
//FUNCION DE TEMPORIZADOR PARA ACTUALIZAR FECHAS EN TIEMPO REAL
//=================================================================
function iniciarTemporizadorFecha() {
    if (temporizadorFecha) clearInterval(temporizadorFecha);
    temporizadorFecha = setInterval(colocarFechaActual, 1000);
}
//=================================================================
// FUNCIÓN PARA CUANDO SE HAGAN LOS REGISTROS
// Ejemplo: "JUAN PABLO" → "Juan Pablo"
//=================================================================
function formatearNombre(texto) {
    if (!texto) return '';
    
    return texto.toLowerCase().trim()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
}


//==================================================================================================================================
// FUNCIONES PARA LOS MODALES
//==================================================================================================================================
//=================================================================
// FUNCIÓN PARA CERRAR MODAL CON (X)
//=================================================================
function cerrarModal(idModal, resetear = true, tipoModulo = 'auto') {
    if (resetear) {
        resetearFlujo(tipoModulo);
    }

    const modal = document.getElementById(idModal);
    if (modal) {
        modal.style.display = "none";
    }
}
//=================================================================
//FUNCION PARA ABRIR MODAL GLOBAL
//=================================================================
function abrirModal(idModal, cerrarAnteriores = true) {

    if (cerrarAnteriores) {
        document.querySelectorAll('.modal, .modalmod, .modales, .modalregistro, .modalmodregistro')
        .forEach(modal => {
            modal.style.display = 'none';
        });
    }

    const modal = document.getElementById(idModal);

    if (modal) {

        modal.style.display = 'block';

        colocarFechaActual('completo');
        iniciarTemporizadorFecha();

        modal.scrollTop = 0;
        console.log(`✅ Modal abierto: ${idModal}`);
        return true;

    } else {
        console.warn(`❌ Modal no encontrado: ${idModal}`);
        return false;
    }
}
//=================================================================
// ABRIR MODAL DESDE ARCHIVO - FUNCION GLOBAL 
//=================================================================
function abrirModalDesdeArchivo(ruta, idModal) {
    fetch(ruta)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const contenedor = document.getElementById("contenedorModales");
                if (!contenedor) {
                    console.error("No existe contenedorModales");
                    return;
                }
            contenedor.innerHTML = "";

            contenedor.insertAdjacentHTML("beforeend", html);

            abrirModal(idModal);

            const modalLower = idModal.toLowerCase();
            
            setTimeout(() => {
                if (modalLower.includes('registroproducto')) {
                    document.getElementById('codigoProducto').value = generarCodigoProducto();
                    cargarProveedoresInventario();
                }
                else if (modalLower.includes('editarproducto')) {
                    const fechaActual = new Date().toLocaleDateString();
                    document.getElementById('fechaEditarProducto').value = fechaActual;
                    cargarProveedoresInventarioEditar();
                }
                else if (modalLower.includes('consultarinventario')) {
                    mostrarTodoInventario();
                }
                else if (modalLower.includes('movimientosinventario')) {
                    inicializarMovimientos();
                    setTimeout(() => {limpiarFormularioMovimiento();}, 50);
                }
                else if (modalLower.includes('alertas')) {
                    mostrarAlertas();
                }
                else if (modalLower.includes('reportes')) {
                    document.getElementById('tipoReporte').selectedIndex = 0;
                }
                else if (modalLower.includes('crearusuario')) {
                    inicializarCrearUsuario();
                }                              
                else if (document.getElementById('usuariosListaModificar')) {
                    mostrarUsuariosModificar();
                }
                else if (document.getElementById('usuariosListaDesactivar')) {
                    mostrarUsuariosDesactivar();
                }
                else if (document.getElementById('usuariosListaEliminar')) {
                    mostrarUsuariosEliminar();
                }
                else if (modalLower.includes('registrarcliente')) {
                    inicializarModalCliente();
                }                
                else if (modalLower.includes('registrarproveedor')) {
                    inicializarModalProveedor();
                }                   
                else if (modalLower.includes('registrarventa')) {
                    inicializarVentas();
                }
                else if (modalLower.includes('consultaventas')) {
                    abrirConsultaVentas();
                }
            }, 300); 
        })
        .catch(error => {
            console.error("❌ Error cargando modal:", ruta, error);
            alert(`Error al cargar modal:\n${error.message}`);
        });
}
//=================================================================
//FUNCION PARA BOTON ATRAS
//=================================================================
function Atras(modalActual, modalAnterior) {

    console.log('⬅️ VOLVIENDO ATRÁS SIN RESETEAR');

    cerrarModal(modalActual, false);
    abrirModal(modalAnterior);
}
//=================================================================
//FUNCION PARA BOTON CANCELAR
//=================================================================
function cancelarProceso(idModal) {
    if (confirm('¿Desea Cancelar Proceso?')) {
        limpiarErroresVisuales();
        cerrarModal(idModal);
    }
}


//==================================================================================================================================
// FUNCIÓN RESETEAR GLOBAL
//==================================================================================================================================
//=================================================================
//FUNCION RESETEO PRINCIPAL
//=================================================================
function resetearFlujo(tipoModulo = 'auto') {
    if (temporizadorFecha) {
        clearInterval(temporizadorFecha);
        temporizadorFecha = null;
        console.log('⏹️ Temporizador de fecha detenido');
    }
    
    const fechaActual = new Date().toLocaleDateString('es-CO');
    
    // PARA SABER CUAL ES EL MODULO
    if (tipoModulo === 'auto') {
        const modalAbierto = document.querySelector('.modal[style*="block"], .modalmod[style*="block"], .modales[style*="block"], .modalregistro[style*="block"]');
        if (modalAbierto) {
            const idModal = modalAbierto.id.toLowerCase();
            if (idModal.includes('usuario') || idModal.includes('modificar1')) tipoModulo = 'usuarios';
            else if (idModal.includes('cliente')) tipoModulo = 'clientes';
            else if (idModal.includes('proveedor')) tipoModulo = 'proveedores';
            else if (idModal.includes('inventario')) tipoModulo = 'inventario';            
            else if (idModal.includes('venta')) tipoModulo = 'ventas';
            else tipoModulo = 'general';
        } else {
            tipoModulo = 'general';
        }
    }

    console.log(`🔄 Reseteando flujo: ${tipoModulo.toUpperCase()}`);

    switch(tipoModulo) {
        case 'usuarios': _resetearUsuarios(); break;
        case 'clientes': _resetearClientes(); break;
        case 'proveedores': _resetearProveedores(); break;
        case 'inventario': _resetearInventario(); break;
        case 'ventas': _resetearVentas(); break;
        default: _resetearGeneral();
    }

    limpiarErroresVisuales();

    document.querySelectorAll('.campo-fecha[readonly]')
    .forEach(fecha => {
        fecha.value = fechaActual;
    });
    
    console.log(`✅ Flujo ${tipoModulo.toUpperCase()} reseteado completamente`);
}
//=================================================================================
// FUNCIONES INTERNAS DE RESETEAR FLUJO
//=================================================================================
//=================================================================
// RESETEO PARA USUARIOS:
//=================================================================
function _resetearUsuarios() {
    // Limpiar variables globales
    estadoUsuarios.seleccionadoModificar = null;
    estadoUsuarios.seleccionadoDesactivar = null;
    estadoUsuarios.seleccionadoEliminar = null;

    datosUsuarioTemporal = {};
    datosModificacionTemporal = {};
    
    console.log('✅ Variables de usuarios limpiadas');

    // Reseteo visual tarjetas 
    document.querySelectorAll(".usuario-card, .usuario-desactivar, .usuario-eliminar")
    .forEach(card => {
        card.style.background = ''; 
        card.style.color = ''; 
        card.style.transform = '';
        if (card.classList.contains("seleccionado")) {
            card.classList.remove("seleccionado");
        }
    });
    
    // Reseteo formularios usuarios
    document.querySelectorAll("form[id*='ModificarCampos'], form[id*='llenarCampos'], form[id='seleccionarCampos1']").forEach(form => {
        if (form) form.reset();
    });

    //limpiar mensajes de password
    ['mensajeSeguridadPassword_usuario', 'mensajeSeguridadPassword_usuarioMod']
    .forEach(id => {

        const mensaje = document.getElementById(id);

        if (mensaje) {
            mensaje.textContent = '';

            mensaje.classList.remove(
                'texto-debil',
                'texto-media',
                'texto-fuerte'
            );
        }
    });
    
    // Reseteo selects usuarios
    const selectsIds = ['tipoDocumento_usuario', 'rolEmpleado_usuario', 'tipoDocumento_usuario_mod', 
                       'rolEmpleado_usuario_mod', 'motivoDesactivacion'];
    selectsIds.forEach(id => {
        const select = document.getElementById(id); 
        if (select) select.selectedIndex = 0;
    });
    
    // Reseteo checkboxes permisos
    document.querySelectorAll("input[id*='permiso_']")
    .forEach(cb => {
        cb.checked = false;
    });
    
    // Ocultar modales usuarios
    const modalesIds = ['modalModificar1','modalModificar2','modalModificar3','modalModificar4',
                       'modalDesactivar','modalDesactivar1','modalEliminar'];
    modalesIds.forEach(id => { 
        const m = document.getElementById(id); 
        if (m) m.style.display = 'none'; 
    });
    
    console.log('✅ Reset usuarios COMPLETO');
}
//=================================================================
// RESETEO PARA CLIENTES:
//=================================================================
function _resetearClientes() {
    // Limpiar búsquedas - Limpiar listas - Ocultar secciones
    document.querySelectorAll('#buscarClienteMod, #buscarDesactivar, #buscarEliminar')
    .forEach(input => 
        input.value = '');
    document.querySelectorAll('#listaClientesMod, #listaDesactivar, #listaEliminar')
    .forEach(lista => 
        lista.innerHTML = '');
    document.querySelectorAll('#formModificarCliente, #confirmacionDesactivar, #confirmacionEliminar')
    .forEach(el => 
        el.style.display = 'none');
    
    const campoCliente = document.getElementById('clienteIdModificar');
    if (campoCliente) {
        campoCliente.value = '';
    }
}
//=================================================================
// RESETEO PARA PROVEEDORES:
//=================================================================
function _resetearProveedores() {
    // Limpiar búsquedas - Limpiar listas - Ocultar secciones
    document.querySelectorAll('#buscarProveedorMod, #buscarDesactivarProv, #buscarEliminarProv')
    .forEach(input => 
        input.value = '');
    document.querySelectorAll('#listaProveedoresMod, #listaDesactivarProv, #listaEliminarProv')
    .forEach(lista => 
        lista.innerHTML = '');    
    document.querySelectorAll('#formModificarProveedor, #confirmacionDesactivarProv, #confirmacionEliminarProv')
    .forEach(el => 
        el.style.display = 'none');
    
    const campoProveedor = document.getElementById('proveedorIdModificar');
    if (campoProveedor) {
        campoProveedor.value = '';
    }
}
//=================================================================
// RESETEO PARA INVENTARIO:
//=================================================================
function _resetearInventario() {
    // 🚨 BLOQUEO: si estás en modal de edición abierto, NO resetear
    const modalEditar = document.getElementById('modalEditarProducto');
        if (modalEditar && modalEditar.style.display === 'block') {
            console.log('🛑 Evitando reset: estás editando un producto');
            return;
        }

    // Limpiar filtros consulta inventario
    ['buscarInventario', 'filtroTipoInventario', 'filtroCategoriaInventario', 'filtroStockInventario']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'SELECT') el.selectedIndex = 0;
                else el.value = '';
            }
        });
    
    // Limpiar tablas
    ['#tablaInventario tbody', '#bodyInventario', '#tablaMovimientos tbody', '#bodyMovimientos', 
     '#tablaAlertas tbody', '#bodyAlertas', '#tablaReporte tbody', '#bodyReporte']
        .forEach(selector => {
            const tbody = document.querySelector(selector);
            if (tbody) tbody.innerHTML = '';
        });

    // Reset form registro producto
    const formProducto = document.getElementById('formRegistroProducto');
    if (formProducto) formProducto.reset();
    
    // Reset form movimiento
    const formMovimiento = document.getElementById('formMovimientoInventario');
    if (formMovimiento) formMovimiento.reset();
    
    // Limpiar selects específicos
    ['productoMovimiento', 'tipoProducto', 'categoriaProducto', 'ubicacionProducto', 
     'unidadMedidaProducto', 'proveedorProducto', 'estadoProducto', 'tipoMovimiento']
        .forEach(id => {
            const select = document.getElementById(id);
            if (select) select.selectedIndex = 0;
        });
    
    // Reset campos readonly
    ['codigoProducto', 'fechaMovimiento', 'usuarioMovimiento', 'tipoProductoMovimiento', 
     'categoriaProductoMovimiento', 'ubicacionProductoMovimiento', 'stockActualMovimiento']
        .forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.value = '';
        });
    
    // Reset contadores alertas
    const totalAlertas = document.getElementById('totalAlertas');
    if (totalAlertas) totalAlertas.textContent = '0';
    
    // Reset selects reportes
    ['tipoReporte', 'filtroTipoReporte', 'filtroCategoriaReporte'].forEach(id => {
        const select = document.getElementById(id);
        if (select) select.selectedIndex = 0;
    });
    
    console.log('📦 Inventario reseteado completamente');
}
//=================================================================
// RESETEO PARA VENTAS:
//=================================================================
function _resetearVentas() {
    // Limpiar filtros de consulta
    ['fechaInicioVentas', 'fechaFinVentas', 'filtroCliente', 'filtroEmpleado', 'filtroEstado', 'filtroPago']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'SELECT') el.selectedIndex = 0;
                else el.value = '';
            }
        });
    
    // Limpiar tabla de ventas
    const tablaVentas = document.querySelector('#tablaVentas tbody');
    if (tablaVentas) tablaVentas.innerHTML = '';
    
    // Reset form registrar venta
    const formVenta = document.getElementById('formRegistrarVenta');
    if (formVenta) formVenta.reset();
    
    // Limpiar selects específicos
    ['clienteVenta', 'tipoPedidoVenta', 'formaPagoVenta', 'estadoVenta']
    .forEach(id => {
        const select = document.getElementById(id);
        if (select) select.selectedIndex = 0;
    });
    
    // Reset checkboxes salsas e incluye
    document.querySelectorAll('input[name="salsa"], input[name="guantes"], input[name="servilletas"], input[name="desechables"]')
        .forEach(cb => 
            cb.checked = false);
    
    // Limpiar textarea y total
    ['observacionesVenta', 'totalVenta', 'empleadoVentaNombre']
    .forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = '';
    });
    
    const direccionVenta = document.getElementById('direccionVenta');
    if (direccionVenta && direccionVenta.parentElement) {
        direccionVenta.parentElement.style.display = 'none';
    }
    
    // Limpiar tabla detalle venta
    const tablaDetalle = document.querySelector('#tablaDetalleVenta tbody');
    if (tablaDetalle) tablaDetalle.innerHTML = '';
    
    console.log('Ventas reseteadas completamente');
}
//=================================================================
// PARA RESETEAR EN INPUTS Y SELECT
//=================================================================
function _resetearGeneral() {
    // Reseteo genérico para cualquier otro caso
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"], input[type="number"], textarea, select')
        .forEach(input => {

            if (!input.readOnly && !input.disabled) {

                if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
                else {
                    input.value = '';
                }
            }
        });
    
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]')
    .forEach(cb => 
        cb.checked = false);
}


//==================================================================================================================================
// VALIDACIÓN DE MANERA GLOBAL
//==================================================================================================================================
//=================================================================
// FUNCIÓN PARA VALIDACIÓN DE FORMULARIOS
//=================================================================
function validarFormulario(formId, mostrarErrores = true) {
    const form = document.getElementById(formId);
    
    if (!form) {
        console.warn(`❌ Formulario ${formId} no encontrado`);
        return false;
    }

    let esValido = true;

     form.querySelectorAll('input, select, textarea')
     .forEach(campo => {
        limpiarError(campo);
    });

    form.querySelectorAll('input, select, textarea')
    .forEach(campo => {

            const esVisible = campo.offsetParent !== null;

            if (
                esVisible && // 👈 SOLO CAMPOS VISIBLES
                !campo.readOnly &&
                !campo.disabled &&
                campo.type !== 'hidden' &&
                campo.type !== 'checkbox' &&
                campo.type !== 'radio'
            ) {

            if (
                String(campo.value).trim() === '' ||
                !campo.checkValidity()
            ) {
                marcarError(campo);
                esValido = false;
            }
        }
    });

    if (!validarEmail(form)) {
        esValido = false;
    }

    const passwordInput = form.querySelector('#contrasenaCreada_usuario, #contrasena_usuario_mod');

    if (passwordInput) {
        if (!validarContrasenaSegura(passwordInput.id)) {
            marcarError(passwordInput);
            esValido = false;
        }
    }

    if (!validarContraseñasIguales(form)) {
        esValido = false;
    }

    if (!esValido && mostrarErrores) {
        alert("Debes llenar todos los campos antes de continuar.");
        return false;
    }

    return true;
}
//=================================================================
// FUNCION PARA: SOLO NUMEROS= CC/TI Y ALFANUMERICO= CE/PA
//=================================================================
function validarNumeroDocumento(elemento) {

    const contenedor = elemento.closest('.casillas, .casillasid');
    if (!contenedor) return false;

    const selectTipoDoc = contenedor.querySelector('select[name="tipoDocumento_usuario"], ' + 'select[name="tipoDocumento_usuario_mod"], ' + 'select[name="tipoDocumento_cliente"], ' + 'select[name="tipoDocumento_cliente_mod"]');
    const inputNumeroDoc = contenedor.querySelector('input[name="documento_usuario"], ' + 'input[name="documento_usuario_mod"], ' + 'input[name="numeroDocumento_cliente"], ' + 'input[name="numeroDocumento_cliente_mod"]');

    if (!selectTipoDoc || !inputNumeroDoc) return false;

    const tipoDoc = selectTipoDoc.value;
    let valor = inputNumeroDoc.value.trim();

    limpiarError(selectTipoDoc);
    limpiarError(inputNumeroDoc);

    if (tipoDoc === 'CC' || tipoDoc === 'TI') {
        valor = valor.replace(/[^0-9]/g, '');
        inputNumeroDoc.maxLength = 10;
        inputNumeroDoc.pattern = '[0-9]{1,10}';
        inputNumeroDoc.title = 'Solo números';
        inputNumeroDoc.value = valor;
        const valido = /^[0-9]{1,10}$/.test(valor);
        
        if (!valido && valor !== '') {
            marcarError(inputNumeroDoc);
        }
        return valido;
    }

    else if (tipoDoc === 'CE' || tipoDoc === 'PA') {
        valor = valor.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        inputNumeroDoc.maxLength = 30;
        inputNumeroDoc.pattern = '[A-Z0-9]{1,30}';
        inputNumeroDoc.title = 'Alfanumérico';
        inputNumeroDoc.value = valor;
        const tieneLetras = /[A-Z]/.test(valor);
        const tieneNumeros = /[0-9]/.test(valor);
        const valido = tieneLetras && tieneNumeros;

        if (!valido && valor !== '') {
            marcarError(inputNumeroDoc);
        }
        return valido;
    }

    marcarError(selectTipoDoc);

    return false;
}
//=================================================================
// FUNCIÓN PARA COLOCAR SOLO NÚMEROS CAMPO TELEFONO - NIT
//=================================================================
function soloNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}
//=================================================================
// VALIDACION DE EMAIL
//=================================================================
function validarEmail(form) {

    let esValido = true;

    form.querySelectorAll('input[type="email"]')
    .forEach(email => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            email.value.trim() !== '' &&
            !emailRegex.test(email.value)
        ) {

            marcarError(email);
            esValido = false;
        }
    });

    return esValido;
}
//=================================================================
// FUNCIÓN PARA VALIDACIÓN DE CONTRASEÑA SEGURA 
//=================================================================
function validarContrasenaSegura(inputId) {
    const input = document.getElementById(inputId);

    if (!input) return true;

    const valor = input.value;

    let mensaje = null;
        if (inputId === 'contrasenaCreada_usuario') {
            mensaje = document.getElementById('mensajeSeguridadPassword_usuario');
        }
        else if (inputId === 'contrasena_usuario_mod') {
            mensaje = document.getElementById('mensajeSeguridadPassword_usuarioMod');
        }

    let nivel = 0;
    let requisitos = [];

    // VALIDACIONES
    if (valor.length >= 6) nivel++;
        else requisitos.push('6+ caracteres');
    if (/[A-Z]/.test(valor)) nivel++;
        else requisitos.push('1 Mayúscula');
    if (/[a-z]/.test(valor)) nivel++;
        else requisitos.push('1 Minúscula');
    if (/\d/.test(valor)) nivel++;
        else requisitos.push('1 Número');
    if (/[!@#$%^&*(),.?":{}|<>]/.test(valor)) nivel++;
        else requisitos.push('1 Especial');

    input.classList.remove('password-debil', 'password-media', 'password-fuerte');
    if (mensaje) {
    mensaje.classList.remove(
        'texto-debil',
        'texto-media',
        'texto-fuerte'
    );
}

    // CONTRASEÑA VACÍA
    if (valor.length === 0) {
        if (mensaje) {
            mensaje.textContent = '';
        }
        return false;
    }

    // DÉBIL
    if (nivel <= 2) {
        input.classList.add('password-debil');
        mensaje.classList.add('texto-debil');
        mensaje.textContent =
            'Seguridad baja → Falta: ' + requisitos.join(', ');
        return false;
    }

    // MEDIA
    if (nivel <= 4) {
        input.classList.add('password-media');
        mensaje.classList.add('texto-media');
        mensaje.textContent =
            'Seguridad media → Falta: ' + requisitos.join(', ');
        return false;
    }

    // FUERTE
    input.classList.add('password-fuerte');
    mensaje.classList.add('texto-fuerte');
    if (mensaje) {
    mensaje.textContent = 'Contraseña segura';
}
    return true;
}
//=================================================================
// FUNCIÓN PARA VALIDAR QUE LAS CONTRASEÑAS COINCIDAN
//=================================================================
function validarContraseñasIguales(form) {

    const pass1 = form.querySelector('#contrasenaCreada_usuario, #contrasena_usuario_mod');
    const pass2 = form.querySelector('#confirmacionContrasenaCreada_usuario, #confirmacionContrasena_usuario_mod');

    if (!pass1 || !pass2) return true;

    pass1.classList.remove('campo-error');
    pass2.classList.remove( 'campo-error', 'password-debil', 'password-fuerte');

    pass2.style.backgroundColor = '';

    if (
        pass1.value.trim() === '' ||
        pass2.value.trim() === ''
    ) {

        marcarError(pass1);
        marcarError(pass2);
        pass2.classList.add('password-debil');
        pass2.style.backgroundColor = '#ffe5e5';

        return false;
    }

    if (pass1.value !== pass2.value) {

        pass1.classList.add('campo-error');
        pass2.classList.add(
            'campo-error',
            'password-debil'
        );

        pass2.style.backgroundColor = '#ffe5e5';

        return false;
    }

    pass2.classList.add('password-fuerte');
    pass2.style.backgroundColor = '#e8ffe8';

    return true;
}
//=================================================================
//FUNCIÓN PARA VALIDAR SELECCION DE PERMISOS
//=================================================================
function validarPermisosSeleccionados(formId) {

    const form = document.getElementById(formId);
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    let alMenosUno = false;

    checkboxes.forEach(cb => {
        if (cb.checked) {
            alMenosUno = true;
        }
    });

    if (!alMenosUno) {
        alert('Debe seleccionar al menos un permiso para continuar');
        return false;
    }

    return true;
}
//=================================================================
//FUNCIÓN PARA MARCAR EN ROJO LOS CAMPOS SIN DILIGENCIAR
//=================================================================
function marcarError(campo) {
    campo.classList.add('campo-error');
}
//=================================================================
//FUNCIÓN PARA LIMPIAR LOS CAMPOS QUE ESTAN EN ROJO 
//=================================================================
function limpiarError(campo) {
    campo.classList.remove('campo-error');
}
//=================================================================
//FUNCIÓN PARA LIMPIAR ERRORES VISUALES
//=================================================================
function limpiarErroresVisuales() {
    document.querySelectorAll('input, select, textarea')
    .forEach(campo => {
        limpiarError(campo);

        campo.classList.remove(
            'password-debil',
            'password-media',
            'password-fuerte'
        );

        campo.style.backgroundColor = '';
    });
}
//=================================================================
// FUNCION PARA LIMPIAR UN FORMULARIO COMPLETO
//=================================================================
function limpiarFormulario(form) {
    form.reset();
    form.querySelectorAll("input, select, textarea")
    .forEach(campo => {
        limpiarError(campo);

        campo.classList.remove(
            'password-debil',
            'password-media',
            'password-fuerte'
        );

        campo.style.backgroundColor = '';
    });
}
//=================================================================
// FUNCION PARA DESMARCAR TODOS LOS PERMISOS SELECCIONADOS
//=================================================================
function limpiarCheckboxes(selector) {
    document.querySelectorAll(selector)
    .forEach(chk => 
        chk.checked = false);
}


//==================================================================================================================================
// FUNCIÓN GLOBAL PARA SELECCIONAR Y DESELECCIONAR TARJETAS
//==================================================================================================================================
function seleccionarCard(event, selectorCards, propiedadEstado, datos) {

    const cardSeleccionada = event.currentTarget;
    const yaSeleccionada = cardSeleccionada.classList.contains('seleccionado');

    document.querySelectorAll(selectorCards)
        .forEach(card => {
            card.classList.remove('seleccionado');
        });

    if (yaSeleccionada) {
        estadoUsuarios[propiedadEstado] = null;
        console.log('❌ Deseleccionado:', propiedadEstado);
        return;
    }

    cardSeleccionada.classList.add('seleccionado');
    estadoUsuarios[propiedadEstado] = datos;

    console.log('✅ Seleccionado:', propiedadEstado, datos);
}


//=================================================================
// BOTÓN ACTIVO GLOBAL
//=================================================================
function seleccionarBotonActivo(
    botonSeleccionado,
    selectorBotones,
    claseActiva = 'btn-activo'
) {

    document.querySelectorAll(selectorBotones)
    .forEach(btn => {
        btn.classList.remove(claseActiva);
    });

    botonSeleccionado.classList.add(claseActiva);
}

//==================================================================================================================================
// OBTENER USUARIO ACTUAL GLOBAL
//==================================================================================================================================
function obtenerUsuarioActual() {
    console.log('👤 Obteniendo usuario actual...');
    const usuario = localStorage.getItem("usuarioSeleccionado");
    const rol = localStorage.getItem("rolSeleccionado");
    const usuarioActual = {
        nombre: usuario || 'Usuario Sistema',
        rol: rol === "admin" ? "ADMINISTRADOR" : "VENDEDOR",
        completo: `${usuario || 'Usuario Sistema'} (${rol === "admin" ? "ADMIN" : "VENDEDOR"})`
    };
    console.log('✅ Usuario:', usuarioActual.completo);
    return usuarioActual;
}



//==================================================================================================================================
// GENERADOR DE CÓDIGOS AUTOMÁTICO - GLOBAL
//==================================================================================================================================
function generarCodigo(arrayDatos, prefijo='PROD', longitud=3) {
    if (arrayDatos.length === 0) {
        return `${prefijo}${'1'.padStart(longitud,'0')}`;
    }

    const numeros = arrayDatos.map(item => {
        const codigo = typeof item === 'object'? (item.codigo || item.id): item;
        return parseInt( String(codigo).slice(-longitud));});

    const maximo = Math.max(...numeros);

    return `${prefijo}${String(maximo + 1).padStart(longitud,'0')}`;
}


//==================================================================================================================================
// EVENTOS DE MANERA GLOBAL
//==================================================================================================================================
//=================================================================
//CIERRE DE MODAL CON ESC
//=================================================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modales = Array.from(document.querySelectorAll('.modal, .modalmod, .modales, .modalregistro, .modalmodregistro'));
        const abiertos = modales.filter(m => m.style.display === 'block');
        const modalAbierto = abiertos[abiertos.length - 1];

        if (modalAbierto) {
            if (modalAbierto.id === 'modalFacturaVenta') {
                modalAbierto.style.display = 'none';
            } else {
                cerrarModal(modalAbierto.id);
            }
            document.activeElement.blur();
        }
    }
});
//==================================================================================================================================
// INICIALIZACIÓN GLOBAL
//=================================================================
document.addEventListener("DOMContentLoaded", function() {
    colocarFechaActual('completo');
    iniciarTemporizadorFecha();
});
//==================================================================================================================================
// QUITAR ERROR AL ESCRIBIR
//==================================================================================================================================
document.addEventListener('input', function(e) {
    if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA'
    ) {
        if (e.target.value.trim() !== '') {
            limpiarError(e.target);
        }
    }
});
//==================================================================================================================================
// QUITAR ERROR AL SELECCIONAR
//==================================================================================================================================
document.addEventListener('change', function(e) {
    if (e.target.tagName === 'SELECT') {
        if (e.target.value.trim() !== '') {
            limpiarError(e.target);
        }
    }
});