//=================================================================
// VARIABLES GLOBALES CLIENTES
//=================================================================
const estadoClientes = {
    seleccionadoModificar: null,
    seleccionadoDesactivar: null,
    seleccionadoEliminar: null
};

let datosClienteTemporal = {};
let datosClienteModificadoTemporal = {};
let clientes = [];


//=================================================================
// MAPEAR BACKEND CON FRONTEND
//=================================================================
function mapearClienteBackend(cliente) {
    return {
        id: cliente.id,
        idCliente: cliente.idCliente,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        tipoDocumento: cliente.tipoDocumento,
        numeroDocumento: cliente.numeroDocumento,
        email: cliente.email,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        estado: cliente.activo ? 'Activo' : 'Inactivo'
    };
}
//=================================================================
// CARGAR CLIENTES DESDE SPRING
//=================================================================
function cargarClientesBackend() {
    fetch('/api/clientes')
    .then(response => response.json())
    .then(data => {
        clientes = data.map(mapearClienteBackend);
        estadoClientes.seleccionadoModificar = null;
        estadoClientes.seleccionadoDesactivar = null;
        estadoClientes.seleccionadoEliminar = null;
        mostrarTodosClientesMod();
        mostrarTodosDesactivarCliente();
        mostrarTodosEliminarCliente();
    })
    .catch(error => {
        console.error('Error cargando clientes:', error);
    });
}
//=================================================================
// INICIALIZAR MODAL (FUNCIÓN VACÍA - EL ID LO GENERA EL BACKEND)
//=================================================================
function inicializarModalCliente() {
    const inputId = document.getElementById('id_cliente');
    if (inputId) {
        // Contar clientes actuales y generar ID temporal
        const siguiente = clientes.length + 1;
        inputId.value = 'CLI' + String(siguiente).padStart(4, '0');
    }
}



//==================================================================================================================================
// REGISTRAR CLIENTE
//==================================================================================================================================
function registrarCliente(event) {
    event.preventDefault();
    
    if (!validarFormulario('registroCliente')) {
        return false;
    }

    if (!validarNumeroDocumento(document.getElementById('numeroDocumento_cliente'))) {
        alert('El número de documento no coincide con el tipo seleccionado');
        document.getElementById('numeroDocumento_cliente').value = '';
        document.getElementById('tipoDocumento_cliente').value = '';
        document.getElementById('tipoDocumento_cliente').focus();
        return false;
    }

    const nuevoCliente = {
        nombres: formatearNombre(document.getElementById('nombres_cliente').value),        
        apellidos: formatearNombre(document.getElementById('apellidos_cliente').value),        
        tipoDocumento: document.getElementById('tipoDocumento_cliente').value,
        numeroDocumento: document.getElementById('numeroDocumento_cliente').value,
        email: document.getElementById('email_cliente').value.toLowerCase().trim(),        
        direccion: document.getElementById('direccion_cliente').value,
        telefono: document.getElementById('telefono_cliente').value
    };

    fetch('/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoCliente)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo crear el cliente');
        }
        return response.json();
    })
    .then(data => {
        // data es el cliente creado con su ID
        const idGenerado = data.idCliente || data.id;
        alert('Cliente registrado correctamente.\n\nID generado: ' + idGenerado);
        cargarClientesBackend();
        cerrarModal('modalRegistrarCliente', true, 'clientes');
    })    
    .catch(error => {
        console.error(error);
        alert('Error al registrar cliente');
    });

    return false;
}



//==================================================================================================================================
// MODIFICAR CLIENTE
//==================================================================================================================================
//=================================================================
//MOSTRAR TODOS CLIENTES MODIFICAR
//=================================================================
function mostrarTodosClientesMod() {
    const lista = document.getElementById('listaClientesMod');
    if (!lista) return;

    lista.innerHTML = '';

    clientes.forEach(cliente => {
        lista.innerHTML += `
            <div class="itemModificar-resultado">
                <p><strong>${cliente.nombres} ${cliente.apellidos}</strong></p>
                <p>${cliente.tipoDocumento}: ${cliente.numeroDocumento}</p>
                <p>Estado:<strong class="${cliente.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${cliente.estado}</strong></p>                                    
                <button type="button" onclick="seleccionarClienteModificar(event, ${cliente.id})" class="btn-seleccionarModificar">Seleccionar</button>
            </div>
        `;
    });
}
//=================================================================
// BUSCAR CLIENTE MODIFICAR
//=================================================================
function buscarClienteMod() {
    const textoBusqueda = document.getElementById('buscarClienteMod').value.toLowerCase();
    const lista = document.getElementById('listaClientesMod');
    if (!lista) return;
    
    lista.innerHTML = '';

    if (textoBusqueda === '') {
        lista.innerHTML = '<p>Debes Buscar por ID, nombres, apellidos, teléfono...</p>';
        return;
    }

    const resultados = clientes.filter(cliente =>
        cliente.nombres.toLowerCase().includes(textoBusqueda) ||
        cliente.apellidos.toLowerCase().includes(textoBusqueda) ||
        cliente.numeroDocumento.toLowerCase().includes(textoBusqueda) ||
        cliente.telefono.includes(textoBusqueda)
    );

    if (resultados.length === 0) {
        lista.innerHTML = '<p>Cliente No Encontrado</p>';
        return;
    }

    resultados.forEach(cliente => {
        lista.innerHTML += `
            <div class="itemModificar-resultado">
                <p><strong>${cliente.nombres} ${cliente.apellidos}</strong></p>
                <p>${cliente.tipoDocumento}: ${cliente.numeroDocumento}</p>
                <p>Estado:<strong class="${cliente.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${cliente.estado}</strong></p>
                <button type="button" onclick="seleccionarClienteModificar(event, ${cliente.id})" class="btn-seleccionarModificar">Seleccionar</button>
            </div>
        `;
    });
}
//=================================================================
// SELECCIONAR CLIENTE MODIFICAR
//=================================================================
function seleccionarClienteModificar(event, idCliente) {
    const cliente = clientes.find(c => c.id === idCliente);
    if (!cliente) return;

    document.querySelectorAll('.itemModificar-resultado').forEach(item => item.classList.remove('seleccionado'));
    document.querySelectorAll('.btn-seleccionarModificar').forEach(btn => btn.classList.remove('btn-seleccionado'));    
    
    event.currentTarget.parentElement.classList.add('seleccionado');  
    event.currentTarget.classList.add('btn-seleccionado');

    estadoClientes.seleccionadoModificar = cliente;

    document.getElementById('formModificarCliente').style.display = 'block';
    document.getElementById('clienteIdModificar').value = cliente.id;

    document.getElementById('id_cliente_mod').value = cliente.idCliente;
    document.getElementById('nombres_cliente_mod').value = cliente.nombres;
    document.getElementById('apellidos_cliente_mod').value = cliente.apellidos;
    document.getElementById('tipoDocumento_cliente_mod').value = cliente.tipoDocumento;
    document.getElementById('numeroDocumento_cliente_mod').value = cliente.numeroDocumento;
    document.getElementById('email_cliente_mod').value = cliente.email;
    document.getElementById('direccion_cliente_mod').value = cliente.direccion;
    document.getElementById('telefono_cliente_mod').value = cliente.telefono;

    console.log('✅ Seleccionado modificar:', cliente.id);
}
//=================================================================
// ACTUALIZAR CLIENTE
//=================================================================
function actualizarCliente(event) {
    event.preventDefault();

    if (!validarFormulario('formModificarCliente')) {
        return false;
    }

    if (!validarNumeroDocumento(document.getElementById('numeroDocumento_cliente_mod'))) {
        alert('El número de documento no coincide con el tipo seleccionado');
        document.getElementById('numeroDocumento_cliente_mod').value = '';
        document.getElementById('tipoDocumento_cliente_mod').value = '';
        document.getElementById('numeroDocumento_cliente_mod').focus();
        return false;
    }

    const clienteActualizado = {
        nombres: document.getElementById('nombres_cliente_mod').value,
        apellidos: document.getElementById('apellidos_cliente_mod').value,
        tipoDocumento: document.getElementById('tipoDocumento_cliente_mod').value,
        numeroDocumento: document.getElementById('numeroDocumento_cliente_mod').value,
        email: document.getElementById('email_cliente_mod').value,
        direccion: document.getElementById('direccion_cliente_mod').value,
        telefono: document.getElementById('telefono_cliente_mod').value
    };

    const idCliente = document.getElementById('clienteIdModificar').value;

    fetch(`/api/clientes/${idCliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteActualizado)
    })
    .then(() => {
        cargarClientesBackend();
        alert('Cliente Modificado Correctamente');
        cerrarModal('modalModificarCliente', true, 'clientes');
    })
    .catch(error => {
        console.error(error);
        alert('Error al modificar cliente');
    });

    return false;
}



//==================================================================================================================================
// DESACTIVAR CLIENTE
//==================================================================================================================================
//=================================================================
//MOSTRAR TODOS CLIENTES DESACTIVAR
//=================================================================
function mostrarTodosDesactivarCliente() {
    const lista = document.getElementById('listaDesactivarCliente');
    if (!lista) return;

    lista.innerHTML = '';

    clientes.forEach(cliente => {
        lista.innerHTML += `
            <div class="itemDesactivar-resultado">
                <p><strong>${cliente.nombres} ${cliente.apellidos}</strong></p>
                <p>${cliente.tipoDocumento}: ${cliente.numeroDocumento}</p>
                <p>Estado:<strong class="${cliente.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${cliente.estado}</strong></p>                
                <button type="button" onclick="seleccionarClienteDesactivar(event, ${cliente.id})" class="btn-seleccionarDesactivar">Seleccionar</button>
            </div>
        `;
    });
}
//=================================================================
// BUSCAR CLIENTE DESACTIVAR
//=================================================================
function buscarDesactivarCliente() {
    const textoBusqueda = document.getElementById('buscarDesactivarCliente').value.toLowerCase();
    const lista = document.getElementById('listaDesactivarCliente');
    if (!lista) return;
    
    lista.innerHTML = '';

    if (textoBusqueda === '') {
        lista.innerHTML = '<p>Debes Buscar por ID, nombres, apellidos, teléfono...</p>';
        return;
    }

    const resultados = clientes.filter(cliente =>
        cliente.nombres.toLowerCase().includes(textoBusqueda) ||
        cliente.apellidos.toLowerCase().includes(textoBusqueda) ||
        cliente.numeroDocumento.toLowerCase().includes(textoBusqueda) ||
        cliente.telefono.includes(textoBusqueda)
    );

    if (resultados.length === 0) {
        lista.innerHTML = '<p>Cliente No Encontrado</p>';
        return;
    }

    resultados.forEach(cliente => {
        lista.innerHTML += `
            <div class="itemDesactivar-resultado">
                <p><strong>${cliente.nombres} ${cliente.apellidos}</strong></p>
                <p>${cliente.tipoDocumento}: ${cliente.numeroDocumento}</p>
                <p>Estado:<strong class="${cliente.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${cliente.estado}</strong></p>                
                <button type="button" onclick="seleccionarClienteDesactivar(event, ${cliente.id})" class="btn-seleccionarDesactivar">Seleccionar</button>
            </div>
        `;
    });
}
//=================================================================
// SELECCIONAR CLIENTE DESACTIVAR
//=================================================================
function seleccionarClienteDesactivar(event, idCliente) {
    const cliente = clientes.find(c => c.id === idCliente);
    if (!cliente) return;

    document.querySelectorAll('.itemDesactivar-resultado').forEach(item => item.classList.remove('seleccionado'));
    document.querySelectorAll('.btn-seleccionarDesactivar').forEach(btn => btn.classList.remove('btn-seleccionado'));    
    
    event.currentTarget.parentElement.classList.add('seleccionado');  
    event.currentTarget.classList.add('btn-seleccionado');    

    estadoClientes.seleccionadoDesactivar = cliente;

    document.getElementById('confirmacionDesactivarCliente').style.display = 'block';
    document.getElementById('clienteIdDesactivar').value = cliente.id;

    if (cliente.estado === 'Activo') {
        document.getElementById('mensajeConfirmacionCliente').innerHTML =
            `¿Desactivar a <strong>${cliente.nombres} ${cliente.apellidos}</strong>?`;
    } else {
        document.getElementById('mensajeConfirmacionCliente').innerHTML =
            `¿Activar nuevamente a <strong>${cliente.nombres} ${cliente.apellidos}</strong>?`;
    }

    console.log('✅ Seleccionado desactivar:', cliente.id);
}
//=================================================================
// CONFIRMAR DESACTIVAR CLIENTE Y ACTIVAR CLIENTE
//=================================================================
function confirmarDesactivarCliente() {
    const motivo = document.getElementById('motivoDesactivacionCliente');

    motivo.classList.remove('campo-error');

    if (!motivo.value) {
        motivo.classList.add('campo-error');
        alert('Seleccione un motivo');
        return false;
    }

    const idCliente = document.getElementById('clienteIdDesactivar').value;
    const cliente = estadoClientes.seleccionadoDesactivar;
    
    const nuevoEstado = cliente.estado === 'Activo' ? false : true;

    fetch(`/api/clientes/${idCliente}/estado`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            activo: nuevoEstado
        })
    })
    .then(() => {
        cargarClientesBackend();
        alert(nuevoEstado ? 'Cliente activado correctamente' : 'Cliente desactivado correctamente');
        cerrarModal('modalDesactivarCliente', true, 'clientes');
    })
    .catch(error => {
        console.error(error);
        alert('Error al actualizar estado');
    });

    return false;
}



//==================================================================================================================================
// ELIMINAR CLIENTES
//==================================================================================================================================
//=================================================================
// MOSTRAR TODOS CLIENTES ELIMINAR
//=================================================================
function mostrarTodosEliminarCliente() {
    const lista = document.getElementById('listaEliminarCliente');
    if (!lista) return;

    lista.innerHTML = '';

    clientes.forEach(cliente => {
        lista.innerHTML += `
            <div class="itemEliminar-resultado">
                <p><strong>${cliente.nombres} ${cliente.apellidos}</strong></p>
                <p>${cliente.tipoDocumento}: ${cliente.numeroDocumento}</p>
                <p>Estado:<strong class="${cliente.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${cliente.estado}</strong></p>
                <button type="button" onclick="seleccionarClienteEliminar(event, ${cliente.id})" class="btn-seleccionarEliminar">Seleccionar</button>
            </div>
        `;
    });
}
//=================================================================
// BUSCAR CLIENTE ELIMINAR
//=================================================================
function buscarEliminarCliente() {
    const textoBusqueda = document.getElementById('buscarEliminarCliente').value.toLowerCase();
    const lista = document.getElementById('listaEliminarCliente');
    if (!lista) return;
    
    lista.innerHTML = '';

    if (textoBusqueda === '') {
        lista.innerHTML = '<p>Debes Buscar por ID, nombres, apellidos, teléfono...</p>';
        return;
    }

    const resultados = clientes.filter(cliente =>
        cliente.nombres.toLowerCase().includes(textoBusqueda) ||
        cliente.apellidos.toLowerCase().includes(textoBusqueda) ||
        cliente.numeroDocumento.toLowerCase().includes(textoBusqueda) ||
        cliente.telefono.includes(textoBusqueda)
    );

    if (resultados.length === 0) {
        lista.innerHTML = '<p>Cliente No Encontrado</p>';
        return;
    }

    resultados.forEach(cliente => {
        lista.innerHTML += `
            <div class="itemEliminar-resultado">
                <p><strong>${cliente.nombres} ${cliente.apellidos}</strong></p>
                <p>${cliente.tipoDocumento}: ${cliente.numeroDocumento}</p>
                <p>Estado:<strong class="${cliente.estado === 'Activo' ? 'texto-activo' : 'texto-inactivo'}">${cliente.estado}</strong></p>                
                <button type="button" onclick="seleccionarClienteEliminar(event, ${cliente.id})" class="btn-seleccionarEliminar">Seleccionar</button>
            </div>
        `;
    });
}
//=================================================================
// SELECCIONAR CLIENTE ELIMINAR
//=================================================================
function seleccionarClienteEliminar(event, idCliente) {
    const cliente = clientes.find(c => c.id === idCliente);
    if (!cliente) return;

    document.querySelectorAll('.itemEliminar-resultado').forEach(item => item.classList.remove('seleccionado'));
    document.querySelectorAll('.btn-seleccionarEliminar').forEach(btn => btn.classList.remove('btn-seleccionado'));    
    
    event.currentTarget.parentElement.classList.add('seleccionado');  
    event.currentTarget.classList.add('btn-seleccionado');    

    estadoClientes.seleccionadoEliminar = cliente;

    document.getElementById('confirmacionEliminarCliente').style.display = 'block';
    document.getElementById('clienteIdEliminar').value = cliente.id;
    document.getElementById('mensajeEliminarCliente').innerHTML =
        `¿Eliminar definitivamente a <strong>${cliente.nombres} ${cliente.apellidos}</strong>?`;

    console.log('✅ Seleccionado eliminar:', cliente.id);
}
//=================================================================
// CONFIRMAR ELIMINAR CLIENTE
//=================================================================
function confirmarEliminarCliente() {
    const motivo = document.getElementById('motivoEliminarCliente');
    motivo.classList.remove('campo-error');

    if (!motivo.value) {
        motivo.classList.add('campo-error');
        alert('Seleccione un motivo');
        return false;
    }

    const idCliente = document.getElementById('clienteIdEliminar').value;

    fetch(`/api/clientes/${idCliente}`, {
        method: 'DELETE'
    })
    .then(() => {
        cargarClientesBackend();
        alert('Cliente eliminado correctamente');
        cerrarModal('modalEliminarCliente', true, 'clientes');
    })
    .catch(error => {
        console.error(error);
        alert('Error al eliminar cliente');
    });

    return false;
}
//=================================================================
// CARGA INICIAL
//=================================================================
document.addEventListener('DOMContentLoaded', function() {
    cargarClientesBackend();
});
