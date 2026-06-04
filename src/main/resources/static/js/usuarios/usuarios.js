//=================================================================
// VARIABLES GLOBALES USUARIOS
//=================================================================
const estadoUsuarios = {
    seleccionadoModificar: null,
    seleccionadoDesactivar: null,
    seleccionadoEliminar: null
};

let datosUsuarioTemporal = {};
let datosModificacionTemporal = {};
//=================================================================
// BASE DE DATOS TEMPORAL USUARIOS
//=================================================================
let usuarios = [];
//=================================================================
// MAPEAR BACKEND → FRONTEND
//=================================================================
function mapearUsuarioBackend(usuario) {
    return {
        id: usuario.id,

        nombre: usuario.nombre,
        apellido: usuario.apellido,

        tipoDocumento: usuario.tipoDocumento,
        documento: usuario.numeroDocumento,

        correoPersonal: usuario.correoPersonal,
        telefono: usuario.telefono,

        idEmpleado: usuario.idEmpleado,

        correoEmpresa: usuario.correoEmpresa,

        rolEmpleado: (usuario.rol === 'ADMINISTRADOR' ? 'admin' : 'vendedor'),

        contrasena: usuario.password,

        confirmacionContrasena: usuario.password,

        permisos: usuario.permisos || [],

        estado: usuario.activo
            ? 'Activo'
            : 'Inactivo',

        fechaInicioDesactivacion: '',
        fechaFinDesactivacion: '',
        motivoDesactivacion: ''
    };
}
//=================================================================
// CARGAR USUARIOS DESDE SPRING
//=================================================================
function cargarUsuariosBackend() {

    fetch(
        '/api/usuarios'
    )

    .then(response =>
        response.json()
    )

    .then(data => {

        usuarios =
            data.map(
                mapearUsuarioBackend
            );

        estadoUsuarios.seleccionadoModificar =
            null;

        estadoUsuarios.seleccionadoDesactivar =
            null;

        estadoUsuarios.seleccionadoEliminar =
            null;

        mostrarUsuariosModificar();
        mostrarUsuariosDesactivar();
        mostrarUsuariosEliminar();
    })

    .catch(error => {

        console.error(
            'Error cargando usuarios:',
            error
        );

    });
}



//==================================================================================================================================
// FUNCIONES AUXILIARES PARA CREAR USUARIOS
//==================================================================================================================================
//=================================================================
// GENERAR ID EMPLEADO AUTOMÁTICO DEPENDIENDO DEL ROL
//=================================================================
function generarIdEmpleado() {
    const rolSelect = document.getElementById('rolEmpleado_usuario');
        if (!rolSelect) {
            return '';
        }

        if (!rolSelect.value) {
            const idInput = document.getElementById('idEmpleado_usuario');

            if (idInput) {
                idInput.value = '';
            }
            return '';
        }

    const prefijo = rolSelect.value === 'admin' ? 'ADMIN' : 'VEND';

    const numeros = usuarios
        .filter(u => u.idEmpleado.startsWith(prefijo))
        .map(u => parseInt(u.idEmpleado.slice(-3)));

    const siguiente = numeros.length === 0 ? 1 : Math.max(...numeros) + 1;

    return `${prefijo}${String(siguiente).padStart(3,'0')}`;
}
//=================================================================
//FUNCIÓN PARA PODER LLAMAR EL ID SIN document.getElementById
//=================================================================
function actualizarIdEmpleado() {
    const idInput = document.getElementById('idEmpleado_usuario');

    if (!idInput) {
        return;
    }

    idInput.value = generarIdEmpleado();
}
//=================================================================
// CONFIGURAR EVENT LISTENER ROL
//=================================================================
function configurarEventRolUsuario() {
    const rolSelect = document.getElementById('rolEmpleado_usuario');
        if (!rolSelect) {
            return;
        }

        rolSelect.replaceWith(
            rolSelect.cloneNode(true)
        );

    const nuevoRolSelect = document.getElementById('rolEmpleado_usuario');
        nuevoRolSelect.addEventListener('change', actualizarIdEmpleado);
}
//==================================================================================================================================
// INICIALIZAR MODAL DE USUARIO ID 
//==================================================================================================================================
function inicializarCrearUsuario() {
    const tipoDocSelect = document.getElementById('tipoDocumento_usuario');
        if (tipoDocSelect) {
            tipoDocSelect.selectedIndex = 0;
        }
    
    configurarEventRolUsuario();        
    actualizarIdEmpleado();   
}
//==================================================================================================================================
// CREAR USUARIO:
//==================================================================================================================================
//=================================================================
// VALIDAR Y PASAR - CREAR USUARIO PASO 1
//=================================================================
function validarYpasar(formId, modalActual, modalSiguiente) {

    if (!validarFormulario(formId)) {
        return false;
    }

    if (!validarNumeroDocumento(document.getElementById('documento_usuario'))) {
        alert('El número de documento no coincide con el tipo seleccionado');
        document.getElementById('documento_usuario').value = '';
        document.getElementById('tipoDocumento_usuario').value = '';
        document.getElementById('tipoDocumento_usuario').focus();
        return false;
    }

    datosUsuarioTemporal = {
        nombre: document.getElementById('nombre_usuario').value,
        apellido: document.getElementById('apellido_usuario').value,
        tipoDocumento: document.getElementById('tipoDocumento_usuario').value,
        documento: document.getElementById('documento_usuario').value,
        correoPersonal: document.getElementById('correoPersonal_usuario').value,
        telefono: document.getElementById('telefono_usuario').value
    };

    actualizarIdEmpleado(); 
    cerrarModal(modalActual, false);
    abrirModal(modalSiguiente);

    return false;
}
//=================================================================
// VALIDAR Y PASAR - CREAR USUARIO PASO 2
//=================================================================
function validarYpasarPaso2(formId, modalActual, modalSiguiente) {

    if (!validarFormulario(formId)) {
        return false;
    }

    if (!validarContraseñasIguales(document.getElementById(formId))) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    if (!validarContrasenaSegura('contrasenaCreada_usuario')) {
        alert('La contraseña no cumple los requisitos de seguridad');
        document.getElementById('contrasenaCreada_usuario').value = "";
        document.getElementById('confirmacionContrasenaCreada_usuario').value = "";
        document.getElementById('contrasenaCreada_usuario').focus();
        return false;
    }

    actualizarIdEmpleado();

    datosUsuarioTemporal.rolEmpleado = document.getElementById('rolEmpleado_usuario').value;    
    datosUsuarioTemporal.idEmpleado = document.getElementById('idEmpleado_usuario').value;
    datosUsuarioTemporal.contrasena = document.getElementById('contrasenaCreada_usuario').value;
    datosUsuarioTemporal.confirmacionContrasena = document.getElementById('confirmacionContrasenaCreada_usuario').value;
    datosUsuarioTemporal.correoEmpresa = document.getElementById('correoEmpresa_usuario').value;

    cerrarModal(modalActual, false);
    abrirModal(modalSiguiente);

    return false;
}
//=================================================================
// FINALIZAR CREACIÓN DE USUARIO PASO 3
//=================================================================
function finalizarProceso(formId, modalActual) {

    if (!validarPermisosSeleccionados(formId)) {
        return false;
    }

    const permisos = [];

    document
        .querySelectorAll(
            '#llenarCampos3 input[type="checkbox"]:checked'
        )

        .forEach(check => {
            permisos.push(check.value);
        });

    const nuevoUsuario = {

        nombre:
            formatearNombre(datosUsuarioTemporal.nombre),

        apellido:
            formatearNombre(datosUsuarioTemporal.apellido),        

        tipoDocumento:
            datosUsuarioTemporal.tipoDocumento,

        numeroDocumento:
            datosUsuarioTemporal.documento,

        correoPersonal: datosUsuarioTemporal.correoPersonal.toLowerCase().trim(),

        telefono:
            datosUsuarioTemporal.telefono,

        idEmpleado:
            datosUsuarioTemporal.idEmpleado,

        password:
            datosUsuarioTemporal.contrasena,

        correoEmpresa: datosUsuarioTemporal.correoEmpresa.toLowerCase().trim(),


        rol: datosUsuarioTemporal.rolEmpleado === 'admin' ? 'ADMINISTRADOR' : 'VENDEDOR',        

        permisos:
            permisos,

        activo: true
    };

    fetch(
        '/api/usuarios',
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify(
                nuevoUsuario
            )
        }
    )

    .then(response => {

        if (!response.ok) {
            throw new Error(
                'No se pudo crear el usuario'
            );
        }

        return response.json();
    })

    .then(() => {

        cargarUsuariosBackend();

        datosUsuarioTemporal = {};

        alert(
            'Usuario creado correctamente'
        );

        cerrarModal(
            modalActual,
            true,
            'usuarios'
        );
    })

    .catch(error => {

        console.error(error);

        alert(
            'Error al crear usuario'
        );
    });

    return false;
}




//==================================================================================================================================
// FUNCIONES AUXILIARES PARA MODIFICAR USUARIOS
//==================================================================================================================================
//=================================================================
// GENERAR ID EMPLEADO SEGÚN ROL
//=================================================================
function generarIdEmpleadoPorRol(rol, usuarioActualId = null) {
    const prefijos = {admin: 'ADMIN', vendedor: 'VEND'};
    const prefijo = prefijos[rol] || 'EMP';
    
    const usuarioActual = estadoUsuarios.seleccionadoModificar;
    if (usuarioActual && usuarioActual.idEmpleado?.startsWith(prefijo)) {
        return usuarioActual.idEmpleado;
    }
    
    const usuariosExistentes = usuarios
        .filter(u => u.idEmpleado?.startsWith(prefijo))
        .map(u => parseInt(u.idEmpleado.slice(-3)))
        .sort((a, b) => a - b);
    
    // Encuentra el primer número libre
    let siguiente = 1;
    for (let num of usuariosExistentes) {
        if (num !== siguiente) break;
        siguiente++;
    }
    
    return `${prefijo}${String(siguiente).padStart(3, '0')}`;
}
//=================================================================
// ACTUALIZAR ID AL CAMBIAR ROL EN MODIFICAR
//=================================================================
function actualizarIdEmpleadoModificar() {
    const rolSelect = document.getElementById('rolEmpleado_usuario_mod');
    const idInput = document.getElementById('idEmpleado_usuario_mod');

        if (!rolSelect || !idInput) {
            return;
        }

    const rol = rolSelect.value;

    if (!rol) {
        idInput.value = '';
        return;
    }

    idInput.value = generarIdEmpleadoPorRol(rol, estadoUsuarios.seleccionadoModificar?.id);
}
//=================================================================
// CONFIGURAR EVENT ROL MODIFICAR
//=================================================================
function configurarEventRolUsuarioModificar() {
    const rolSelect = document.getElementById('rolEmpleado_usuario_mod');
    if (!rolSelect) return;

    const valorActual = rolSelect.value;

    const nuevoRol = rolSelect.cloneNode(true);
        rolSelect.replaceWith(nuevoRol);
        nuevoRol.value = valorActual;
        nuevoRol.addEventListener('change', actualizarIdEmpleadoModificar);
}
//==================================================================================================================================
// MODIFICAR USUARIO:
//==================================================================================================================================
//=================================================================
// MOSTAR LOS USUARIOS MODIFICAR
//=================================================================
function mostrarUsuariosModificar() {
    const lista = document.getElementById('usuariosListaModificar');

    if (!lista) {
        return;
    }

    lista.innerHTML = '';
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    usuarios.forEach(usuario => {
        
        // SAME lógica de fechas
        let estadoMostrar = usuario.estado;
        
        if (usuario.fechaInicioDesactivacion && usuario.fechaFinDesactivacion) {
            const inicio = new Date(usuario.fechaInicioDesactivacion);
            const fin = new Date(usuario.fechaFinDesactivacion);
            
            if (hoy >= inicio && hoy <= fin) {
                estadoMostrar = 'Inactivo';
            } else if (hoy < inicio) {
                estadoMostrar = 'Activo';
            } else {
                estadoMostrar = 'Activo';
            }
        }

        lista.innerHTML += `

            <div class="usuario-card"
                onclick="seleccionarUsuarioModificar(event, ${usuario.id})">
                <strong>${usuario.rolEmpleado === 'admin' ? 'Administrador' : 'Vendedor'}</strong><br>
                ${usuario.nombre} ${usuario.apellido}
                <p> Estado:<strong class="${estadoMostrar === 'Activo' ? 'texto-activo' : 
                    'texto-inactivo'}"> ${estadoMostrar}</strong></p>
            </div>
        `;
    });
}
//=================================================================
// SELECCIONAR USUARIO MODIFICAR
//=================================================================
function seleccionarUsuarioModificar(event, idUsuario) {
    const usuario = usuarios.find(u => u.id === idUsuario);

    if (!usuario) {
        return;
    }

    estadoUsuarios.seleccionadoModificar = usuario;

    document.querySelectorAll('#usuariosListaModificar .usuario-card')
        .forEach(card => {
            card.classList.remove('seleccionado');
        });

    event.currentTarget.classList.add('seleccionado');

    console.log('✅ Usuario seleccionado:', usuario);
}
//=================================================================
// ABRIR MODAL MODIFICAR 
//=================================================================
function abrirModificarUsuario() {

    if (!estadoUsuarios.seleccionadoModificar) {
        alert('Seleccione un usuario');
        return;
    }

    document.getElementById('nombre_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.nombre;

    document.getElementById('apellido_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.apellido;

    document.getElementById('tipoDocumento_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.tipoDocumento;

    document.getElementById('documento_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.documento;

    document.getElementById('correoPersonal_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.correoPersonal;

    document.getElementById('telefono_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.telefono;

    const rolMap = {'admin': 'admin', 'vendedor': 'vendedor'};
    const rolValor = rolMap[estadoUsuarios.seleccionadoModificar.rolEmpleado] || 'vendedor';
    document.getElementById('rolEmpleado_usuario_mod').value = rolValor;

    document.getElementById('idEmpleado_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.idEmpleado;

    document.getElementById('correoEmpresa_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.correoEmpresa;

    document.getElementById('contrasena_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.contrasena || '';

    document.getElementById('confirmacionContrasena_usuario_mod').value =
        estadoUsuarios.seleccionadoModificar.confirmacionContrasena || '';

    document.querySelectorAll(
        '#ModificarCampos4 input[type="checkbox"]'
    ).forEach(check => {

        const permisoContenedor = check.closest('.permiso-mod');
        const permisoExistente = estadoUsuarios.seleccionadoModificar.permisos.includes(check.value);

        check.checked = permisoExistente;

        permisoContenedor.classList.remove('permiso-original');

        if (permisoExistente) {
            permisoContenedor.classList.add('permiso-original');
        }
    });

    configurarEventRolUsuarioModificar();
    //actualizarIdEmpleadoModificar();

    cerrarModal('modalModificar1', false);
    abrirModal('modalModificar2');
}
//=================================================================
// DETECTAR CAMBIOS EN PERMISOS EN MODIFICAR
//=================================================================
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll(
        '#ModificarCampos4 input[type="checkbox"]'
    ).forEach(check => {

        check.addEventListener('change', () => {

            const permisoContenedor =
                check.closest('.permiso-mod');

            const permisoOriginal =
                estadoUsuarios.seleccionadoModificar?.permisos.includes(check.value);

            if (check.checked && permisoOriginal) {
                permisoContenedor.classList.add('permiso-original');
            }
            else {
                permisoContenedor.classList.remove('permiso-original');
            }
        });
    });
});
//=================================================================
// ACTUALIZAR USUARIO PASO 1
//=================================================================
function actualizarUsuario(formId, modalActual, modalSiguiente) {

    if (!validarFormulario(formId)) {
        return false;
    }

    if (!validarNumeroDocumento(document.getElementById('documento_usuario_mod'))) {
        alert('El número de documento no coincide con el tipo seleccionado');
        document.getElementById('documento_usuario_mod').value = '';
        document.getElementById('tipoDocumento_usuario_mod').value = '';        
        document.getElementById('documento_usuario_mod').focus();
        return false;
    }

    cerrarModal(modalActual, false);
    abrirModal(modalSiguiente);

    return false;
}
//=================================================================
// ACTUALIZAR USUARIO PASO 2
//=================================================================
function actualizarUsuario2(formId, modalActual, modalSiguiente) {

    if (!validarFormulario(formId)) {
        return false;
    }

    if (!validarContraseñasIguales(document.getElementById(formId))) {
        return false;
    }

    if (!validarContrasenaSegura('contrasena_usuario_mod')) {
        alert('La contraseña no cumple los requisitos de seguridad');
        document.getElementById('contrasena_usuario_mod').value = "";
        document.getElementById('confirmacionContrasena_usuario_mod').value = "";
        document.getElementById('contrasena_usuario_mod').focus();        
        return false;
    }

    actualizarIdEmpleadoModificar();

    cerrarModal(modalActual, false);
    abrirModal(modalSiguiente);

    return false;
}
//=================================================================
// FINALIZAR MODIFICACIÓN PASO 3
//=================================================================
function finalizarProcesoActualizarUsuario(formId, modalActual) {

    if (!validarPermisosSeleccionados(formId)) {
        return false;
    }

    actualizarIdEmpleadoModificar();

    const permisos = [];

    document.querySelectorAll('#ModificarCampos4 input[type="checkbox"]:checked')
    .forEach(check => {
        permisos.push(check.value);
    });

    // DECLARAR variable fora para usar después
    let usuarioGuardado = null;

    datosModificacionTemporal = {

        ...estadoUsuarios.seleccionadoModificar,

        nombre: document.getElementById('nombre_usuario_mod').value,
        apellido: document.getElementById('apellido_usuario_mod').value,
        tipoDocumento: document.getElementById('tipoDocumento_usuario_mod').value,
        documento: document.getElementById('documento_usuario_mod').value,
        correoPersonal: document.getElementById('correoPersonal_usuario_mod').value,
        telefono: document.getElementById('telefono_usuario_mod').value,
        rolEmpleado: document.getElementById('rolEmpleado_usuario_mod').value,        
        idEmpleado: document.getElementById('idEmpleado_usuario_mod').value,
        contrasena: document.getElementById('contrasena_usuario_mod').value,
        confirmacionContrasena: document.getElementById('confirmacionContrasena_usuario_mod').value,
        correoEmpresa: document.getElementById('correoEmpresa_usuario_mod').value,
        permisos: permisos
    };

    console.log('✅ Usuario Modificado:',datosModificacionTemporal);

    fetch(
        `/api/usuarios/${datosModificacionTemporal.id}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nombre: datosModificacionTemporal.nombre,
                apellido: datosModificacionTemporal.apellido,
                tipoDocumento: datosModificacionTemporal.tipoDocumento,
                numeroDocumento: datosModificacionTemporal.documento,
                correoPersonal: datosModificacionTemporal.correoPersonal,
                telefono: datosModificacionTemporal.telefono,
                idEmpleado: datosModificacionTemporal.idEmpleado,
                correoEmpresa: datosModificacionTemporal.correoEmpresa,
                rol: datosModificacionTemporal.rolEmpleado === 'admin' ? 'ADMINISTRADOR' : 'VENDEDOR',
                password: datosModificacionTemporal.contrasena,
                permisos: datosModificacionTemporal.permisos,
                activo: datosModificacionTemporal.estado === 'Activo'
            })
        }
    )

    .then(() => {
        
        // GUARDAR el usuario con los NUEVOS valores del formulario
        usuarioGuardado = {
            ...estadoUsuarios.seleccionadoModificar,
            rolEmpleado: document.getElementById('rolEmpleado_usuario_mod').value,
            idEmpleado: document.getElementById('idEmpleado_usuario_mod').value
        };
        
        console.log('✅ Guardando usuario antes de recargar:', usuarioGuardado);
        
        return cargarUsuariosBackend();

    })
    .then(() => {

        // RESTAURAR el usuario seleccionado
        if (usuarioGuardado) {
            estadoUsuarios.seleccionadoModificar = usuarioGuardado;
            console.log('✅ Usuario restaurado:', estadoUsuarios.seleccionadoModificar);
        }

    })
    .then(() => {

        console.log('✅ Usuario modificado');

        alert('Usuario Modificado Correctamente');

        cerrarModal(modalActual, true, 'usuarios');

    })

    .catch(error => {

        console.error(error);

        alert('Error al modificar usuario');

    });

    return false;
}



//==================================================================================================================================
// DESACTIVAR USUARIO:
//==================================================================================================================================
//=================================================================
// MOSTRAR USUARIOS DESACTIVAR
//=================================================================
function mostrarUsuariosDesactivar() {
    const lista = document.getElementById('usuariosListaDesactivar');

    if (!lista) {
        return;
    }

    lista.innerHTML = '';
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    usuarios.forEach(usuario => {
        
        // Calcular estado real basado en fechas
        let estadoReal = usuario.estado;
        
        if (usuario.fechaInicioDesactivacion && usuario.fechaFinDesactivacion) {
            const inicio = new Date(usuario.fechaInicioDesactivacion);
            const fin = new Date(usuario.fechaFinDesactivacion);
            
            if (hoy >= inicio && hoy <= fin) {
                estadoReal = 'Inactivo';
            } else {
                estadoReal = 'Activo';
            }
        }

        lista.innerHTML += `

            <div class="usuario-desactivar"
                onclick="seleccionarUsuarioDesactivar(event, ${usuario.id}, '${estadoReal}')">
                <strong>${usuario.rolEmpleado === 'admin' ? 'Administrador' : 'Vendedor'}</strong><br>
                ${usuario.nombre} ${usuario.apellido}
                <p>Estado:<strong class="${estadoReal === 'Activo' ? 'texto-activo' : 'texto-inactivo'}"> ${estadoReal}</strong></p>
            </div>
        `;
    });
}
//=================================================================
// SELECCIONAR USUARIO DESACTIVAR
//=================================================================
function seleccionarUsuarioDesactivar(event, idUsuario, estadoActual) {
    
    // Si está inactivo,-preguntar directamente para activar
    if (estadoActual === 'Inactivo') {
        if (!confirm('¿Deseas activar este usuario?')) {
            return;
        }
        
        // Buscar usuario y activar
        const usuario = usuarios.find(u => u.id === idUsuario);
        if (!usuario) return;
        
        usuario.estado = 'Activo';
        
        fetch(
            `/api/usuarios/${usuario.id}/estado`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    activo: true
                })
            }
        )
        .then(() => {
            return cargarUsuariosBackend();
        })
        .then(() => {
            alert('Usuario activado correctamente');
        })
        .catch(error => {
            console.error(error);
            alert('Error al activar usuario');
        });
        
        return;
    }
    
    // Si está activo, seleccionar normal
    const usuario = usuarios.find(u => u.id === idUsuario);

    if (!usuario) {
        return;
    }

    estadoUsuarios.seleccionadoDesactivar = usuario;

    document.querySelectorAll('.usuario-desactivar')
        .forEach(card => {
            card.classList.remove('seleccionado');
        });

    event.currentTarget.classList.add('seleccionado');

    console.log('✅ Usuario seleccionado:', usuario);
}
//=================================================================
// ABRIR MODAL DESACTIVAR
//=================================================================
function abrirModalDesactivar() {

    if (!estadoUsuarios.seleccionadoDesactivar) {

        alert('Seleccione un usuario');
        return;
    }

    const usuario = estadoUsuarios.seleccionadoDesactivar;
    const boton = document.getElementById('btnConfirmarDesactivar');

    if (usuario.estado === 'Activo') {
        boton.textContent = 'Confirmar Desactivación';
    } else {
        boton.textContent = 'Activar Usuario';
    }

    cerrarModal('modalDesactivar', false);
    abrirModal('modalDesactivar1');
}
//=================================================================
// CONTINUAR DESACTIVACIÓN MODAL 2
//=================================================================
function continuarDesactivacion(event) {
    event.preventDefault();

    if (!validarFormulario('seleccionarCampos1')) {
        return false;
    }

    const fechaInicioInput = document.getElementById('fechaInicioDesactivar');
    const fechaFinInput = document.getElementById('fechaFinDesactivar');
    const motivoInput = document.getElementById('motivoDesactivacion');

    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;

    fechaInicioInput.classList.remove('campo-error');
    fechaFinInput.classList.remove('campo-error');

    const usuario = estadoUsuarios.seleccionadoDesactivar;

    if (!usuario) {
        return false;
    }

    if (fechaInicio > fechaFin) {
        alert('La fecha de inicio no puede ser mayor');
        fechaInicioInput.classList.add('campo-error');
        fechaInicioInput.value = '';
        fechaFinInput.classList.add('campo-error');
        fechaFinInput.value = '';

        return false;
    }

    if (usuario.estado === 'Activo') {

        usuario.estado = 'Inactivo';
        usuario.fechaInicioDesactivacion = fechaInicio;
        usuario.fechaFinDesactivacion = fechaFin;
        usuario.motivoDesactivacion = motivoInput.value;

        console.log('✅ Usuario desactivado:', usuario);

    }
    else {
        usuario.estado = 'Activo';

        usuario.fechaInicioDesactivacion = '';
        usuario.fechaFinDesactivacion = '';
        usuario.motivoDesactivacion = '';

    }

fetch(
    `/api/usuarios/${usuario.id}/estado`,
    {
        method: 'PATCH',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({

            activo: usuario.estado === 'Activo',

            fechaInicioDesactivacion:
                usuario.fechaInicioDesactivacion,

            fechaFinDesactivacion:
                usuario.fechaFinDesactivacion,

            motivoDesactivacion:
                usuario.motivoDesactivacion
        })
    }
)

.then(() => {
    return cargarUsuariosBackend();
})
.then(() => {

    console.log('✅ Estado actualizado');

    alert(
        usuario.estado === 'Activo'
            ? 'Usuario activado correctamente'
            : 'Usuario desactivado correctamente'
    );

    cerrarModal('modalDesactivar1', true, 'usuarios');

})

.catch(error => {

    console.error(error);

    alert('Error al actualizar estado');

}); 

    return false;
}



//==================================================================================================================================
// ELIMINAR USUARIO:
//==================================================================================================================================
//=================================================================
// MOSTRAR USUARIOS ELIMINAR
//=================================================================
function mostrarUsuariosEliminar() {
    const lista = document.getElementById('usuariosListaEliminar');

    if (!lista) {
        return;
    }

    lista.innerHTML = '';
    
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    usuarios.forEach(usuario => {
        
        // Calcular estado basado en fechas
        let estadoMostrar = usuario.estado;
        
        if (usuario.fechaInicioDesactivacion && usuario.fechaFinDesactivacion) {
            const inicio = new Date(usuario.fechaInicioDesactivacion);
            const fin = new Date(usuario.fechaFinDesactivacion);
            
            if (hoy >= inicio && hoy <= fin) {
                estadoMostrar = 'Inactivo';
            } else {
                estadoMostrar = 'Activo';
            }
        }

        lista.innerHTML += `

            <div class="usuario-eliminar"
                onclick="seleccionarUsuarioEliminar(event, ${usuario.id})">
                <strong>${usuario.rolEmpleado === 'admin' ? 'Administrador' : 'Vendedor'}</strong><br>
                ${usuario.nombre} ${usuario.apellido}
                <p>Estado:<strong class="${estadoMostrar === 'Activo' ? 'texto-activo' : 'texto-inactivo'}"> ${estadoMostrar}</strong></p>
            </div>
        `;
    });
}
//=================================================================
// SELECCIONAR USUARIO ELIMINAR
//=================================================================
function seleccionarUsuarioEliminar(event, idUsuario) {
    const usuario = usuarios.find(u => u.id === idUsuario);

    if (!usuario) {
        return;
    }

    estadoUsuarios.seleccionadoEliminar = usuario;

    document.querySelectorAll('.usuario-eliminar')
        .forEach(card => {
            card.classList.remove('seleccionado');
        });

    event.currentTarget.classList.add('seleccionado');

    console.log('✅ Usuario seleccionado:', usuario);
}//=================================================================
// ABRIR MODAL ELIMINAR 
//=================================================================
function abrirModalEliminar() {

    if (!estadoUsuarios.seleccionadoEliminar) {
        alert('Seleccione un usuario');
        return;
    }

    const usuario = estadoUsuarios.seleccionadoEliminar;

    if (confirm(`¿Eliminar permanentemente a ${usuario.nombre}?`)) {

    fetch(
        `/api/usuarios/${usuario.id}`,
        {
            method: 'DELETE'
        }
    )

    .then(() => {

        cargarUsuariosBackend();

        estadoUsuarios.seleccionadoEliminar = null;

        console.log('✅ Usuario eliminado');

        alert('Usuario eliminado correctamente');

        cerrarModal('modalEliminar', true, 'usuarios');

    })

    .catch(error => {

        console.error(error);

        alert('Error al eliminar usuario');

    });        
        
}
}



//=================================================================
// CARGA INICIAL
//=================================================================
document.addEventListener(
    'DOMContentLoaded',
    function () {

        cargarUsuariosBackend();

    }
);

