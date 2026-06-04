//=================================================================
// VARIABLES GLOBALES PROVEEDORES
//=================================================================
const estadoProveedores = {
    seleccionadoModificar: null,
    seleccionadoDesactivar: null,
    seleccionadoEliminar: null
};

let proveedores = [];


//=================================================================
// MAPEAR BACKEND CON FRONTEND
//=================================================================
function mapearProveedorBackend(proveedor) {
    return {
        id: proveedor.id,
        idProveedor: proveedor.idProveedor,
        nombre: proveedor.nombre,
        tipoProveedor: proveedor.tipoProveedor,
        razonSocial: proveedor.razonSocial,
        tipoNit: proveedor.tipoNit,
        nit: proveedor.nit,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        email: proveedor.email,
        estado: proveedor.activo ? 'Activo' : 'Inactivo'
    };
}

//=================================================================
// CARGAR PROVEEDORES DESDE SPRING
//=================================================================
function cargarProveedoresBackend() {
    fetch('/api/proveedores')
    .then(response => response.json())
    .then(data => {
        proveedores = data.map(mapearProveedorBackend);
        estadoProveedores.seleccionadoModificar = null;
        estadoProveedores.seleccionadoDesactivar = null;
        estadoProveedores.seleccionadoEliminar = null;
        mostrarTodosProveedoresMod();
        mostrarTodosDesactivarProveedor();
        mostrarTodosEliminarProveedor();
    })
    .catch(error => {
        console.error('Error cargando proveedores:', error);
    });
}


//==================================================================================================================================
// FUNCIONES AUXILIARES PARA CREAR ID DE PROVEEDORES Y TIPO RAZON SOCIAL
//==================================================================================================================================
//=================================================================
// INICIALIZAR MODAL PROVEEDOR PARA ID AUTOMATICO
//=================================================================
function inicializarModalProveedor() {
    const inputId = document.getElementById('id_proveedor');
    if (inputId) {
        const siguiente = proveedores.length + 1;
        inputId.value = 'PROV' + String(siguiente).padStart(3, '0');
    }
}

//=================================================================
// MOSTRAR / OCULTAR RAZON SOCIAL
//=================================================================
function toggleRazonSocial(tipoFormulario = 'registro') {
    let tipo = tipoFormulario === 'registro' 
        ? document.getElementById('tipoProveedor').value
        : document.getElementById('tipoProveedor_mod').value;
    
    let campo = tipoFormulario === 'registro'
        ? document.getElementById('razonSocial_proveedor')
        : document.getElementById('razonSocial_proveedor_mod');
    
    if (tipo === 'persona') {
        campo.value = '';
        campo.disabled = true;
        campo.classList.add('campo-deshabilitado');
    } else {
        campo.disabled = false;
        campo.classList.remove('campo-deshabilitado');
    }
}



//==================================================================================================================================
// REGISTRAR PROVEEDOR
//==================================================================================================================================
function registrarProveedor(event) {
    event.preventDefault();

    if (!validarFormulario('registroProveedor')) {
        return false;
    }

    const nuevoProveedor = {
        nombre: formatearNombre(document.getElementById('nombre_proveedor').value),        
        tipoProveedor: document.getElementById('tipoProveedor').value,
        razonSocial: document.getElementById('razonSocial_proveedor').value,
        tipoNit: document.getElementById('tipoNit_proveedor').value,
        nit: document.getElementById('nit_proveedor').value,
        telefono: document.getElementById('telefono_proveedor').value,
        direccion: formatearNombre(document.getElementById('direccion_proveedor').value),        
        email: document.getElementById('email_proveedor').value.toLowerCase().trim()      
    };

    fetch('/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProveedor)
    })
    .then(response => {
        if (!response.ok) throw new Error('No se pudo crear');
        return response.json();
    })
    .then(data => {
        alert('Proveedor registrado correctamente.\n\nID: ' + data.idProveedor);
        cargarProveedoresBackend();
        cerrarModal('modalRegistrarProveedor', true, 'proveedores');
    })
    .catch(error => {
        console.error(error);
        alert('Error al registrar');
    });

    return false;
}



//==================================================================================================================================
// MODIFICAR PROVEEDOR
//==================================================================================================================================
//=================================================================
// MOSTRAR TODOS PROVEEDORES MODIFICAR
//=================================================================
function mostrarTodosProveedoresMod() {
    const lista = document.getElementById('listaProveedoresMod');
    if (!lista) return;
    lista.innerHTML = '';
    proveedores.forEach(p => {
        lista.innerHTML += `
            <div class="itemModificar-resultado">
                <p><strong>${p.nombre}</strong></p>
                <p>${p.tipoNit}: ${p.nit}</p>
                <p>Estado:<strong class="${p.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${p.estado}</strong></p>
                <button type="button" onclick="seleccionarProveedorModificar(event, ${p.id})" class="btn-seleccionarModificar">Seleccionar</button>
            </div>`;
    });
}
//=================================================================
// BUSCAR PROVEEDOR MODIFICAR
//=================================================================
function buscarProveedorMod() {
    const texto = document.getElementById('buscarProveedorMod').value.toLowerCase();
    const lista = document.getElementById('listaProveedoresMod');
    if (!lista) return;
    lista.innerHTML = '';
    if (texto === '') { lista.innerHTML = '<p>Debes buscar...</p>'; return; }
    const resultados = proveedores.filter(p => p.nombre.toLowerCase().includes(texto) || p.nit.toLowerCase().includes(texto));
    resultados.forEach(p => {
        lista.innerHTML += `<div class="itemModificar-resultado"><p><strong>${p.nombre}</strong></p><p>${p.tipoNit}: ${p.nit}</p><button onclick="seleccionarProveedorModificar(event,${p.id})">Seleccionar</button></div>`;
    });
}
//=================================================================
// SELECCIONAR PROVEEDOR MODIFICAR
//=================================================================
function seleccionarProveedorModificar(event, idProveedor) {
    const proveedor = proveedores.find(p => p.id === idProveedor);

    if (!proveedor) return;

    document.querySelectorAll('.itemModificar-resultado').forEach(i => i.classList.remove('seleccionado'));
    
    event.currentTarget.parentElement.classList.add('seleccionado');
    
    estadoProveedores.seleccionadoModificar = proveedor;
    
    document.getElementById('formModificarProveedor').style.display = 'block';
    document.getElementById('proveedorIdModificar').value = proveedor.id;
    
    document.getElementById('id_proveedor_mod').value = proveedor.idProveedor;
    document.getElementById('nombre_proveedor_mod').value = proveedor.nombre;
    document.getElementById('tipoProveedor_mod').value = proveedor.tipoProveedor;
    document.getElementById('razonSocial_proveedor_mod').value = proveedor.razonSocial || '';
    document.getElementById('tipoNit_proveedor_mod').value = proveedor.tipoNit;
    document.getElementById('nit_proveedor_mod').value = proveedor.nit;
    document.getElementById('telefono_proveedor_mod').value = proveedor.telefono;
    document.getElementById('direccion_proveedor_mod').value = proveedor.direccion;
    document.getElementById('email_proveedor_mod').value = proveedor.email;
}
//=================================================================
// ACTUALIZAR PROVEEDOR
//=================================================================
function actualizarProveedor(event) {

    event.preventDefault();

    if (!validarFormulario('formModificarProveedor')) return false;

    const proveedorActualizado = {
        nombre: document.getElementById('nombre_proveedor_mod').value,
        tipoProveedor: document.getElementById('tipoProveedor_mod').value,
        razonSocial: document.getElementById('razonSocial_proveedor_mod').value,
        tipoNit: document.getElementById('tipoNit_proveedor_mod').value,
        nit: document.getElementById('nit_proveedor_mod').value,
        telefono: document.getElementById('telefono_proveedor_mod').value,
        direccion: document.getElementById('direccion_proveedor_mod').value,
        email: document.getElementById('email_proveedor_mod').value
    };

    const id = document.getElementById('proveedorIdModificar').value;

    fetch(`/api/proveedores/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proveedorActualizado)
    })
    .then(() => {
        cargarProveedoresBackend();
        alert('Proveedor modificado correctamente');
        cerrarModal('modalModificarProveedor', true, 'proveedores');
    })
    .catch(error => { console.error(error); alert('Error'); });
    return false;
}



//==================================================================================================================================
// DESACTIVAR PROVEEDOR
//==================================================================================================================================
//=================================================================
// MOSTRAR TODOS DESACTIVAR PROVEEDOR
//=================================================================
function mostrarTodosDesactivarProveedor() {
    const lista = document.getElementById('listaDesactivarProveedor');
    if (!lista) return;
    lista.innerHTML = '';
    proveedores.forEach(p => {
        lista.innerHTML += `
            <div class="itemDesactivar-resultado">
                <p><strong>${p.nombre}</strong></p>
                <p>${p.tipoNit}: ${p.nit}</p>
                <p>Estado:<strong class="${p.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${p.estado}</strong></p>
                <button type="button" onclick="seleccionarProveedorDesactivar(event, ${p.id})" class="btn-seleccionarDesactivar">Seleccionar</button>
            </div>`;
    });
}
//=================================================================
// BUSCAR DESACTIVAR PROVEEDOR
//=================================================================
function buscarDesactivarProveedor() {

    const texto = document.getElementById('buscarDesactivarProveedor').value.toLowerCase();
    const lista = document.getElementById('listaDesactivarProveedor');

    if (!lista) return;

    lista.innerHTML = '';

    const resultados = proveedores.filter(p => p.nombre.toLowerCase().includes(texto));
    resultados.forEach(p => {
        lista.innerHTML += `<div class="itemDesactivar-resultado">
        <p>${p.nombre}</p>
        <button onclick="seleccionarProveedorDesactivar(event,${p.id})">Seleccionar</button></div>`;
    });
}
//=================================================================
// SELECCIONAR PROVEEDOR DESACTIVAR
//=================================================================
function seleccionarProveedorDesactivar(event, idProveedor) {
    const proveedor = proveedores.find(p => p.id === idProveedor);
    if (!proveedor) return;
    document.querySelectorAll('.itemDesactivar-resultado').forEach(i => i.classList.remove('seleccionado'));
    event.currentTarget.parentElement.classList.add('seleccionado');
    estadoProveedores.seleccionadoDesactivar = proveedor;
    document.getElementById('confirmacionDesactivarProveedor').style.display = 'block';
    document.getElementById('proveedorIdDesactivar').value = proveedor.id;
    document.getElementById('mensajeConfirmacionProveedor').innerHTML = 
        proveedor.estado === 'Activo'
        ? `¿Desactivar a <strong>${proveedor.nombre}</strong>?`
        : `¿Activar a <strong>${proveedor.nombre}</strong>?`;
}
//=================================================================
// CONFIRMAR DESACTIVAR PROVEEDOR
//=================================================================
function confirmarDesactivarProveedor() {
    const motivo = document.getElementById('motivoDesactivacionProveedor');
    if (!motivo.value) { alert('Seleccione motivo'); return false; }
    const id = document.getElementById('proveedorIdDesactivar').value;
    const proveedor = estadoProveedores.seleccionadoDesactivar;
    const nuevoEstado = proveedor.estado === 'Activo' ? false : true;
    fetch(`/api/proveedores/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado })
    })
    .then(() => {
        cargarProveedoresBackend();
        alert(nuevoEstado ? 'Proveedor activado' : 'Proveedor desactivado');
        cerrarModal('modalDesactivarProveedor', true, 'proveedores');
    })
    .catch(error => { console.error(error); alert('Error'); });
    return false;
}



//==================================================================================================================================
// ELIMINAR PROVEEDOR
//==================================================================================================================================
//=================================================================
// MOSTRAR TODOS ELIMINAR PROVEEDOR
//=================================================================
function mostrarTodosEliminarProveedor() {
    const lista = document.getElementById('listaEliminarProveedor');
    if (!lista) return;
    lista.innerHTML = '';
    proveedores.forEach(p => {
        lista.innerHTML += `
            <div class="itemEliminar-resultado">
                <p><strong>${p.nombre}</strong></p>
                <p>${p.tipoNit}: ${p.nit}</p>
                <button type="button" onclick="seleccionarProveedorEliminar(event, ${p.id})" class="btn-seleccionarEliminar">Seleccionar</button>
            </div>`;
    });
}
//=================================================================
// BUSCAR ELIMINAR PROVEEDOR
//=================================================================
function buscarEliminarProveedor() {
    const texto = document.getElementById('buscarEliminarProveedor').value.toLowerCase();
    const lista = document.getElementById('listaEliminarProveedor');
    if (!lista) return;
    lista.innerHTML = '';
    const resultados = proveedores.filter(p => p.nombre.toLowerCase().includes(texto));
    resultados.forEach(p => {
        lista.innerHTML += `<div class="itemEliminar-resultado"><p>${p.nombre}</p><button onclick="seleccionarProveedorEliminar(event,${p.id})">Seleccionar</button></div>`;
    });
}
//=================================================================
// SELECCIONAR PROVEEDOR ELIMINAR
//=================================================================
function seleccionarProveedorEliminar(event, idProveedor) {
    const proveedor = proveedores.find(p => p.id === idProveedor);
    if (!proveedor) return;
    document.querySelectorAll('.itemEliminar-resultado').forEach(i => i.classList.remove('seleccionado'));
    event.currentTarget.parentElement.classList.add('seleccionado');
    estadoProveedores.seleccionadoEliminar = proveedor;
    document.getElementById('confirmacionEliminarProveedor').style.display = 'block';
    document.getElementById('proveedorIdEliminar').value = proveedor.id;
    document.getElementById('mensajeEliminarProveedor').innerHTML = `¿Eliminar a ${proveedor.nombre}?`;
}
//=================================================================
// CONFIRMAR ELIMINAR PROVEEDOR
//=================================================================
function confirmarEliminarProveedor() {
    const id = document.getElementById('proveedorIdEliminar').value;
    fetch(`/api/proveedores/${id}`, { method: 'DELETE' })
    .then(() => {
        cargarProveedoresBackend();
        alert('Proveedor eliminado');
        cerrarModal('modalEliminarProveedor', true, 'proveedores');
    })
    .catch(error => { console.error(error); alert('Error'); });
    return false;
}
//=================================================================
// CARGA INICIAL
//=================================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProveedoresBackend();
});
