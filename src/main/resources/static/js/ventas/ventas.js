//==================================================================================================================================
// DATOS TEMPORALES PARA PRUEBAS
//==================================================================================================================================
const estadoVentas = {
    clienteSeleccionado: null,
    productosVenta: []
};

let ventas = [];
let ventasBackend = [];



//=================================================================
// CARGAR VENTAS DESDE BACKEND
//=================================================================
function cargarVentasDesdeBackend() {
    console.log('📥 Cargando ventas desde backend...');
    fetch('http://localhost:8080/api/ventas')
    .then(response => response.json())
    .then(data => {
        ventasBackend = data;
        ventas = data;
        cargarFiltrosVentas();
        
        const tbody = document.querySelector('#tablaVentas tbody');
        if (tbody) {
            renderizarVentas();
        }
        
        console.log(`✅ ${ventas.length} ventas cargadas`);
    })
    .catch(error => {
        console.error('Error cargando ventas:', error);
    });
}



//==================================================================================================================================
// FUNCIONES AUXILIARES PARA REGISTRO DE VENTA
//==================================================================================================================================
//=================================================================
//FUNCIÓN PARA INICIALIZAR VENTAS
//=================================================================
function inicializarVentas() {
    console.log('🛒 Inicializando módulo ventas...');
    limpiarErroresVisuales();

    const siguiente = ventasBackend.length + 1;
    document.getElementById('id_venta').value = 'VTA' + String(siguiente).padStart(3, '0');

    const usuarioActual = obtenerUsuarioActual();
    document.getElementById('empleadoVentaNombre').value = usuarioActual.completo;

    estadoVentas.clienteSeleccionado = null;
    estadoVentas.productosVenta = [];

    document.getElementById('bodyDetalleVenta').innerHTML = '';
    document.getElementById('totalVenta').value = '$0';
    console.log('✅ Ventas inicializadas');
}
//=================================================================
// BUSCAR CLIENTE PARA VENTA
//=================================================================
function buscarClienteVentaRegistro(valorBusqueda) {
    console.log('🔍 Buscando cliente...', valorBusqueda);
    limpiarErroresVisuales();

    valorBusqueda = valorBusqueda.trim().toLowerCase();
    if (!valorBusqueda) {
        limpiarClienteVenta();
        console.log('ℹ️ Campo búsqueda vacío');
        return;
    }

    const clienteEncontrado = clientes.find(cliente =>
        cliente.estado === 'Activo' && (
            `${cliente.nombres} ${cliente.apellidos}`.toLowerCase().includes(valorBusqueda) ||
            cliente.numeroDocumento.toLowerCase().includes(valorBusqueda) ||
            cliente.telefono.toLowerCase().includes(valorBusqueda)
        )
    );

    if (!clienteEncontrado) {
        limpiarClienteVenta();
        console.log('❌ Cliente no encontrado');
        alert('Cliente no registrado. Debe registrarlo para realizar la venta.');
        return;
    }

    console.log('✅ Cliente encontrado:', clienteEncontrado.nombres);

    estadoVentas.clienteSeleccionado = clienteEncontrado;

    document.getElementById('nombreClienteVenta').value = `${clienteEncontrado.nombres} ${clienteEncontrado.apellidos}`;
    document.getElementById('tipoDocumentoClienteVenta').value = clienteEncontrado.tipoDocumento;
    document.getElementById('numeroDocumentoClienteVenta').value = clienteEncontrado.numeroDocumento;
    document.getElementById('correoClienteVenta').value = clienteEncontrado.email;
    document.getElementById('telefonoClienteVenta').value = clienteEncontrado.telefono;
    document.getElementById('direccionClienteVenta').value = clienteEncontrado.direccion;

    console.log('✅ Cliente autocompletado');
}
//=================================================================
// LIMPIAR CLIENTE VENTA
//================================================================
function limpiarClienteVenta() {
    console.log('🧹 Limpiando cliente venta...');
    estadoVentas.clienteSeleccionado = null;

    document.getElementById('nombreClienteVenta').value = '';
    document.getElementById('tipoDocumentoClienteVenta').value = '';
    document.getElementById('numeroDocumentoClienteVenta').value = '';
    document.getElementById('correoClienteVenta').value = '';
    document.getElementById('telefonoClienteVenta').value = '';
    document.getElementById('direccionClienteVenta').value = '';

    console.log('✅ Cliente limpiado');
}
//=================================================================
//FUNCIÓN PARA TIPO DE PEDIDO
//=================================================================
function cambiarTipoPedido() {
    console.log('🚚 Verificando tipo pedido...');

    const tipoPedido = document.getElementById('tipoPedidoVenta').value;
    const campoDireccion = document.getElementById('campoDireccion');
    const direccionVenta = document.getElementById('direccionVenta');
    const opcionContraEntrega = document.getElementById('opcionContraEntrega');
    const formaPago = document.getElementById('formaPagoVenta');

    if (tipoPedido === 'DOMICILIO') {
        campoDireccion.style.display = 'block';
        opcionContraEntrega.style.display = 'block';
        console.log('🏠 Dirección habilitada');
        console.log('💳 Contra entrega habilitado');
    } else {
        campoDireccion.style.display = 'none';
        direccionVenta.value = '';
        console.log('✅ Dirección oculta');
        opcionContraEntrega.style.display = 'none';

        if (formaPago.value === 'Contra entrega') {
            formaPago.value = '';
        }
        console.log('🚫 Contra entrega oculto');
    }
}
//=================================================================
//FUNCIÓN PARA FORMA DE PAGO
//=================================================================
function cambiarFormaPagoVenta() {
    console.log('💵 Verificando forma pago...');

    const formaPago = document.getElementById('formaPagoVenta').value;
    const campoEfectivo = document.getElementById('campoPagoEfectivo');

    if (formaPago === 'Efectivo') {
        campoEfectivo.style.display = 'block';
    } else {
        campoEfectivo.style.display = 'none';
        document.getElementById('montoRecibidoVenta').value = '';
        document.getElementById('cambioVenta').value = '$0';
    }

    actualizarTotalVentaConMoneda();
}
//=================================================================
//FUNCIÓN PARA MONEDA DE PAGO
//=================================================================
function cambiarMonedaPago() {
    const moneda = document.getElementById('monedaPagoVenta').value;
    const campoTasa = document.getElementById('campoTasaDolar');

    document.getElementById('montoRecibidoVenta').value = '';
    document.getElementById('cambioVenta').value = '$0';

    if (moneda === 'USD') {
        campoTasa.style.display = 'block';
    } else {
        campoTasa.style.display = 'none';
    }

    calcularCambioVenta();
    actualizarTotalVentaConMoneda();
}
//=================================================================
//FORMATEAR MONTO RECIBIDO
//=================================================================
function formatearMontoRecibido() {
    const input = document.getElementById('montoRecibidoVenta');
    const moneda = document.getElementById('monedaPagoVenta').value;

    let valor = input.value.replace(/[^\d]/g, '');

    if (!valor) {
        input.value = '';
        return;
    }

    valor = Number(valor);

    if (moneda === 'USD') {
        input.value = `$${valor.toLocaleString('en-US')}`;
    } else {
        input.value = `$${valor.toLocaleString('es-CO')}`;
    }
}
//==================================================
// FORMATEAR TASA DÓLAR
//==================================================
function formatearTasaDolar() {
    const input = document.getElementById('tasaDolarVenta');

    let valor = input.value.replace(/[^\d]/g, '');

    if (!valor) {
        input.value = '';
        return;
    }

    valor = Number(valor);
    input.value = `$${valor.toLocaleString('es-CO')}`;

    actualizarTotalVentaConMoneda();
    calcularCambioVenta();
}



//==================================================================================================================================
//FUNCIONES EN LA PARTE DE DETALLE DE VENTA
//==================================================================================================================================
//=================================================================
// AGREGAR PRODUCTO PARA VENTA
//=================================================================
function agregarProducto() {
    console.log('🛒 Agregando producto a venta...');
    limpiarErroresVisuales();

    if (!productos || productos.length === 0) {
        alert('No hay productos registrados');
        return;
    }

    const tbody = document.getElementById('bodyDetalleVenta');
    let opciones = `<option value="">Seleccionar producto</option>`;

    // ✅ CORREGIDO: usar "categoria" no "categoriaProducto"
    const productsParaVenta = productos.filter(p => 
        p.estado === 'Activo' && 
        ['Alimentos', 'Bebidas', 'Acompañamientos'].includes(p.categoria)
    );

    productsParaVenta.forEach(producto => {
        opciones += `<option value="${producto.codigo}">${producto.nombre}</option>`;
    });

    if (productsParaVenta.length === 0) {
        alert('No hay productos de venta disponibles');
        return;
    }

    const fila = `
        <tr>
            <td><select onchange="seleccionarProducto(this)">${opciones}</select></td>
            <td><input type="text" class="stock-producto select-bloqueado" readonly></td>
            <td><input type="number" class="cantidad-producto" min="1" value="1" onchange="calcularSubtotal(this)"></td>
            <td><input type="text" class="precio-producto select-bloqueado" readonly></td>
            <td><input type="text" class="subtotal-producto select-bloqueado" readonly></td>
            <td class="celda-boton-eliminar"><button type="button" class="btn-eliminar-producto" onclick="eliminarFilaProducto(this)"> X </button></td>
        </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', fila);
    console.log('✅ Fila producto agregada');
}
//=================================================================
//FUNCIÓN PARA SELECCIONAR PRODUCTO
//=================================================================
function seleccionarProducto(selectProducto) {
    console.log('📦 Seleccionando producto...');
    const codigoProducto = selectProducto.value;
    const fila = selectProducto.closest('tr');
    const producto = productos.find(p => p.codigo === codigoProducto);

    const filas = document.querySelectorAll('#bodyDetalleVenta tr');
    let filaExistente = null;

    filas.forEach(f => {
        if (f !== fila) {
            const select = f.querySelector('select');
            if (select.value === codigoProducto) {
                filaExistente = f;
            }
        }
    });

    if (filaExistente) {
        console.log('🔁 Producto repetido, sumando cantidad');
        const inputCantidad = filaExistente.querySelector('.cantidad-producto');
        inputCantidad.value = parseInt(inputCantidad.value) + 1;
        calcularSubtotal(inputCantidad);
        fila.remove();
        return;
    }

    if (!producto) {
        console.log('❌ Producto no encontrado');
        return;
    }

    console.log('✅ Producto:', producto.nombre);

    const stockInput = fila.querySelector('.stock-producto');
    const precioInput = fila.querySelector('.precio-producto');
    const subtotalInput = fila.querySelector('.subtotal-producto');
    const cantidadInput = fila.querySelector('.cantidad-producto');

    stockInput.value = producto.stock;
    precioInput.value = `$${producto.precioVenta.toLocaleString('es-CO')}`;

    const subtotal = producto.precioVenta * parseInt(cantidadInput.value);
    subtotalInput.value = `$${subtotal.toLocaleString('es-CO')}`;

    fila.dataset.precio = producto.precioVenta;

    console.log('✅ Producto cargado en fila');
    calcularTotalVenta();
}
//=================================================================
//CALCULAR SUBTOTAL
//=================================================================
function calcularSubtotal(inputCantidad) {
    console.log('🧮 Calculando subtotal...');

    const fila = inputCantidad.closest('tr');
    const precio = parseFloat(fila.dataset.precio || 0);
    const cantidad = parseInt(inputCantidad.value) || 0;
    const subtotal = precio * cantidad;
    const subtotalInput = fila.querySelector('.subtotal-producto');

    subtotalInput.value = `$${subtotal.toLocaleString('es-CO')}`;

    console.log('✅ Subtotal:', subtotal);
    calcularTotalVenta();
}
//=================================================================
//ELIMINAR PRODUCTO EN DETALLE DE VENTA
//=================================================================
function eliminarFilaProducto(boton) {
    console.log('🗑️ Eliminando producto...');

    const fila = boton.closest('tr');
    fila.remove();

    calcularTotalVenta();
    console.log('✅ Producto eliminado');
}
//=================================================================
// CALCULAR TOTAL VENTA
//=================================================================
function calcularTotalVenta() {
    console.log('💰 Calculando total venta...');

    let total = 0;

    const filas = document.querySelectorAll('#bodyDetalleVenta tr');

    filas.forEach(fila => {
        const subtotalTexto = fila.querySelector('.subtotal-producto').value;
        const subtotal = Number(subtotalTexto.replace(/[^\d]/g, '')) || 0;
        total += subtotal;
    });

    document.getElementById('totalVenta').dataset.totalCop = total;

    actualizarTotalVentaConMoneda();
    calcularCambioVenta();

    console.log('✅ Total venta:', total);
}
//==================================================
// MOSTRAR TOTAL EN COP / USD
//==================================================
function actualizarTotalVentaConMoneda() {
    const totalInput = document.getElementById('totalVenta');
    if (!totalInput) return;

    const totalCOP = Number(totalInput.dataset.totalCop) || 0;
    const formaPago = document.getElementById('formaPagoVenta')?.value;
    const moneda = document.getElementById('monedaPagoVenta')?.value;

    if (formaPago !== 'Efectivo' || moneda !== 'USD') {
        totalInput.value = `$${totalCOP.toLocaleString('es-CO')}`;
        return;
    }

    const tasa = Number(document.getElementById('tasaDolarVenta').value.replace(/[^\d]/g, '')) || 0;

    if (!tasa) {
        totalInput.value = `$${totalCOP.toLocaleString('es-CO')}`;
        return;
    }

    const totalUSD = totalCOP / tasa;
    totalInput.value = `$${totalCOP.toLocaleString('es-CO')} / $${totalUSD.toFixed(2)} USD`;
}
//=================================================================
// CALCULAR CAMBIO CUANDO EL PAGO ES EFECTIVO
//=================================================================
function calcularCambioVenta() {
    const formaPago = document.getElementById('formaPagoVenta')?.value;
    if (formaPago !== 'Efectivo') return;

    const moneda = document.getElementById('monedaPagoVenta')?.value;
    const totalCOP = Number(document.getElementById('totalVenta')?.dataset.totalCop) || 0;
    const cambioInput = document.getElementById('cambioVenta');
    if (!cambioInput) return;

    if (moneda === 'COP') {
        const recibido = Number(document.getElementById('montoRecibidoVenta').value.replace(/[^\d]/g, '')) || 0;
        const cambio = recibido - totalCOP;
        if (cambio < 0) {
            cambioInput.value = `Falta $${Math.abs(cambio).toLocaleString('es-CO')}`;
        } else {
            cambioInput.value = `$${cambio.toLocaleString('es-CO')}`;
        }
        return;
    }

    const tasa = Number(document.getElementById('tasaDolarVenta').value.replace(/[^\d]/g, '')) || 0;
    if (!tasa) {
        cambioInput.value = '';
        return;
    }

    const recibidoUSD = Number(document.getElementById('montoRecibidoVenta').value.replace(/[^\d.]/g, '')) || 0;
    const totalUSD = totalCOP / tasa;
    const diferenciaUSD = recibidoUSD - totalUSD;

    if (diferenciaUSD < 0) {
        cambioInput.value = `Falta $${Math.abs(diferenciaUSD).toFixed(2)} USD`;
    } else {
        const cambioCOP = diferenciaUSD * tasa;
        cambioInput.value = `$${diferenciaUSD.toFixed(2)} USD / $${Math.round(cambioCOP).toLocaleString('es-CO')} COP`;
    }
}



//==================================================================================================================================
// REGISTRAR VENTA
//==================================================================================================================================
function registrarVenta(event) {
    event.preventDefault();
    console.log('🟡 === INICIANDO REGISTRO VENTA ===');

    limpiarErroresVisuales();

    if (!estadoVentas.clienteSeleccionado) {
        console.log('❌ Cliente no seleccionado');
        alert('Seleccione un cliente');
        return false;
    }

    const filas = document.querySelectorAll('#bodyDetalleVenta tr');
    if (filas.length === 0) {
        console.log('❌ Venta sin productos');
        alert('Agregue productos');
        return false;
    }

    const detalle = [];
    let totalVenta = 0;

    for (const fila of filas) {
        const selectProducto = fila.querySelector('select');
        const cantidadInput = fila.querySelector('.cantidad-producto');
        const codigoProducto = selectProducto.value;
        const cantidad = parseInt(cantidadInput.value);

        if (!codigoProducto) {
            alert('Seleccione todos los productos');
            return false;
        }

        const producto = productos.find(p => p.codigo === codigoProducto);
        if (!producto) return false;

        if (cantidad > producto.stock) {
            console.log('❌ Stock insuficiente:', producto.nombre);
            alert(`Stock insuficiente para ${producto.nombre}`);
            return false;
        }

        const subtotal = producto.precioVenta * cantidad;
        totalVenta += subtotal;

        detalle.push({
            productoId: producto.codigo,
            productoNombre: producto.nombre,
            cantidad: cantidad,
            precio: producto.precioVenta,
            subtotal: subtotal
        });

        // Descontar stock temporalmente
        producto.stock -= cantidad;
        console.log(`📦 Stock actualizado ${producto.nombre}:`, producto.stock);
    }

    // Obtener salsas
    const salsasSeleccionadas = Array.from(document.querySelectorAll('input[name="salsa"]:checked'))
        .map(s => s.value);

    // Estados
    const tipoPedido = document.getElementById('tipoPedidoVenta').value;
    const formaPago = document.getElementById('formaPagoVenta').value;

    let montoRecibido = 0;
    let cambioVenta = 0;

    if (formaPago === 'Efectivo') {
        const monedaPago = document.getElementById('monedaPagoVenta').value;
        const tasaTexto = document.getElementById('tasaDolarVenta').value.replace(/\$/g, '').replace(/\./g, '').replace(/,/g, '');
        const tasaDolar = parseFloat(tasaTexto) || 0;
        const montoTexto = document.getElementById('montoRecibidoVenta').value;

        if (monedaPago === 'USD') {
            montoRecibido = Number(montoTexto.replace(/[^\d.]/g, '')) || 0;
        } else {
            montoRecibido = Number(montoTexto.replace(/[^\d]/g, '')) || 0;
        }

        if (monedaPago === 'USD') {
            const totalUsd = totalVenta / tasaDolar;
            if (montoRecibido < totalUsd) {
                alert('El valor recibido no cubre el total');
                return false;
            }
            cambioVenta = montoRecibido - totalUsd;
        } else {
            if (montoRecibido < totalVenta) {
                alert('El valor recibido no cubre el total');
                return false;
            }
            cambioVenta = montoRecibido - totalVenta;
        }
    }

    let estadoPago = 'PENDIENTE';
    let estadoPedido = 'PENDIENTE';

    if (formaPago === 'Efectivo' || formaPago === 'Tarjeta' || formaPago === 'Transferencia') {
        estadoPago = 'PAGADO';
    }

    if (formaPago === 'Contra entrega') {
        estadoPago = 'PENDIENTE';
    }

    if (tipoPedido === 'LOCAL' || tipoPedido === 'PARA LLEVAR') {
        estadoPedido = 'EN PREPARACIÓN';
    }

    if (tipoPedido === 'DOMICILIO') {
        estadoPedido = 'EN CAMINO';
    }

    // Crear venta
    const nuevaVenta = {
        empleado: document.getElementById('empleadoVentaNombre').value,
        clienteId: estadoVentas.clienteSeleccionado.id,
        clienteNombre: estadoVentas.clienteSeleccionado.nombres + ' ' + estadoVentas.clienteSeleccionado.apellidos,
        clienteDocumento: estadoVentas.clienteSeleccionado.numeroDocumento,
        clienteTelefono: estadoVentas.clienteSeleccionado.telefono,
        clienteCorreo: estadoVentas.clienteSeleccionado.email,
        tipoPedido: tipoPedido,
        direccionEntrega: document.getElementById('direccionVenta').value,
        formaPago: formaPago,
        monedaPago: formaPago === 'Efectivo' ? document.getElementById('monedaPagoVenta').value : '',
        tasaDolar: formaPago === 'Efectivo' && document.getElementById('monedaPagoVenta').value === 'USD'
            ? Number(document.getElementById('tasaDolarVenta').value.replace(/[^\d]/g, '')) || 0 : 0,
        montoRecibido: montoRecibido,
        cambio: cambioVenta,
        estadoPago: estadoPago,
        estadoPedido: estadoPedido,
        salsas: salsasSeleccionadas,
        guantes: document.querySelector('input[name="guantes"]').checked,
        servilletas: document.querySelector('input[name="servilletas"]').checked,
        desechables: document.querySelector('input[name="desechables"]').checked,
        observaciones: document.getElementById('observacionesVenta').value,
        total: totalVenta,
        detalle: detalle
    };

    console.log('🧾 NUEVA VENTA:', nuevaVenta);

    // Guardar en backend
    fetch('http://localhost:8080/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaVenta)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error registrando venta');
        return response.json();
    })
    .then(data => {
        console.log('✅ Venta guardada en MySQL');

        // Actualizar stock en backend
        actualizarStockBackend(filas);

        // Recargar ventas
        cargarVentasDesdeBackend();

        // Recargar inventario
        if (typeof cargarProductosDesdeBackend === 'function') {
            cargarProductosDesdeBackend();
        }

        // Resetear formulario
        document.getElementById('formRegistrarVenta').reset();
        document.getElementById('bodyDetalleVenta').innerHTML = '';
        document.getElementById('totalVenta').value = '$0';
        limpiarClienteVenta();
        cambiarTipoPedido();

        // Nueva ID
        const siguiente = ventasBackend.length + 1;
        document.getElementById('id_venta').value = 'VTA' + String(siguiente).padStart(3, '0');

        console.log('🎉 VENTA REGISTRADA');
        alert('Venta registrada correctamente');
        cerrarModal('modalRegistrarVenta');
    })
    .catch(error => {
        console.error('❌ Error:', error);
        alert('No se pudo guardar la venta');
    });

    return false;
}
//=================================================================
//ACTUALIZAR STOCK PRODUCTOS
//=================================================================
function actualizarStockBackend(filas) {
    filas.forEach(fila => {
        const selectProducto = fila.querySelector('select');
        const cantidadInput = fila.querySelector('.cantidad-producto');
        const codigoProducto = selectProducto.value;
        const cantidad = parseInt(cantidadInput.value);

        const producto = productos.find(p => p.codigo === codigoProducto);
        if (producto) {
            const nuevoStock = producto.stock;
            fetch(`http://localhost:8080/api/productos/${codigoProducto}/stock`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stockInicial: nuevoStock })
            })
            .catch(error => console.error('Error actualizando stock:', error));
        }
    });
}
//==================================================================================================================================
//FUNCIONES AUXILIARES PARA CONSULTA VENTAS
//==================================================================================================================================
//=================================================================
//ABRIR CONSULTA DE VENTAS
//=================================================================
function abrirConsultaVentas() {
    console.log('📋 Abriendo consulta ventas...');
    abrirModal('modalConsultaVentas');
    cargarVentasDesdeBackend();
}
//==================================================================================================================================
//FILTROS CONSULTA VENTAS
//==================================================================================================================================
//=================================================================
//CARGAR FILTROS DE VENTAS
//=================================================================
function cargarFiltrosVentas() {
    console.log('⚙️ Cargando filtros ventas...');

    const clientes = [...new Set(ventas.map(v => v.clienteNombre))];
    const empleados = [...new Set(ventas.map(v => v.empleado))];
    const estadosPago = [...new Set(ventas.map(v => v.estadoPago))];
    const estadosPedido = [...new Set(ventas.map(v => v.estadoPedido))];
    const formasPago = [...new Set(ventas.map(v => v.formaPago))];

    cargarOpcionesFiltro('filtroCliente', clientes, 'Todos los clientes');
    cargarOpcionesFiltro('filtroEmpleado', empleados, 'Todos los empleados');
    cargarOpcionesFiltro('filtroEstadoPago', estadosPago, 'Todos los pagos');
    cargarOpcionesFiltro('filtroEstadoPedido', estadosPedido, 'Todos los pedidos');
    cargarOpcionesFiltro('filtroPago', formasPago, 'Todas las formas de pago');

    console.log('✅ Filtros cargados');
}
//=================================================================
//FUNCIÓN GENÉRICA PARA CARAGAR OPCIONES DE FILTROS
//=================================================================
function cargarOpcionesFiltro(idSelect, listaValores, textoDefault) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    select.innerHTML = `<option value="">${textoDefault}</option>`;

    const valoresUnicos = [...new Set(listaValores.filter(Boolean))];
    valoresUnicos.forEach(valor => {
        select.innerHTML += `<option value="${valor}"> ${valor}</option>`;
    });
}
//==================================================================================================================================
// PARA LOS BOTONES FILTRO
//==================================================================================================================================
//=================================================================
// FILTRAR VENTAS - BOTÓN FILTRAR
//=================================================================
function filtrarVentas() {
    console.log('🔍 Filtrando ventas...');

    const fechaInicio = document.getElementById('fechaInicioVentas').value;
    const fechaFin = document.getElementById('fechaFinVentas').value;
    const cliente = document.getElementById('filtroCliente').value;
    const empleado = document.getElementById('filtroEmpleado').value;
    const estado = document.getElementById('filtroEstadoPago').value;
    const estadoPedido = document.getElementById('filtroEstadoPedido').value;
    const formaPago = document.getElementById('filtroPago').value;

    console.log({ fechaInicio, fechaFin, cliente, empleado, estado, formaPago });

    let ventasFiltradas = ventas.filter(venta => {
        const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
        const cumpleFechaInicio = !fechaInicio || fechaVenta >= fechaInicio;
        const cumpleFechaFin = !fechaFin || fechaVenta <= fechaFin;
        const cumpleCliente = !cliente || venta.clienteNombre === cliente;
        const cumpleEmpleado = !empleado || venta.empleado === empleado;
        const cumpleEstadoPago = !estado || venta.estadoPago === estado;
        const cumpleEstadoPedido = !estadoPedido || venta.estadoPedido === estadoPedido;
        const cumplePago = !formaPago || venta.formaPago === formaPago;

        return cumpleFechaInicio && cumpleFechaFin && cumpleCliente && cumpleEmpleado &&
            cumpleEstadoPago && cumpleEstadoPedido && cumplePago;
    });

    console.log('✅ Ventas filtradas:', ventasFiltradas.length);
    renderizarVentas(ventasFiltradas);
}
//=================================================================
// FILTRAR VENTAS HOY - BOTÓN HOY
//=================================================================
function ventasHoy() {
    console.log('📅 Filtrando ventas HOY...');
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaInicioVentas').value = hoy;
    document.getElementById('fechaFinVentas').value = hoy;
    filtrarVentas();
}
//=================================================================
// FILTRAR VENTAS SEMANA - BOTÓN SEMANA
//=================================================================
function ventasSemana() {
    console.log('📅 Filtrando ventas SEMANA...');
    const hoy = new Date();
    const inicioSemana = new Date();
    inicioSemana.setDate(hoy.getDate() - 7);

    document.getElementById('fechaInicioVentas').value = inicioSemana.toISOString().split('T')[0];
    document.getElementById('fechaFinVentas').value = hoy.toISOString().split('T')[0];
    filtrarVentas();
}
//=================================================================
// FILTRAR VENTAS MES - BOTÓN MES
//=================================================================
function ventasMes() {
    console.log('📅 Filtrando ventas MES...');
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    document.getElementById('fechaInicioVentas').value = inicioMes.toISOString().split('T')[0];
    document.getElementById('fechaFinVentas').value = hoy.toISOString().split('T')[0];
    filtrarVentas();
}



//==================================================================================================================================
// TABLA VENTAS
//==================================================================================================================================
//=================================================================
// RENDERIZAR VENTAS
//=================================================================
function renderizarVentas(listaVentas = ventas) {
    console.log('📋 Renderizando ventas...');

    const tbody = document.querySelector('#tablaVentas tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (listaVentas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10">No se encontraron ventas</td></tr>';
        return;
    }

    listaVentas.forEach(venta => {
        const fila = `
            <tr>
                <td>${venta.idVenta}</td>
                <td>${new Date(venta.fecha).toLocaleString()}</td>
                <td>${venta.empleado}</td>
                <td>${venta.clienteNombre}</td>
                <td>${venta.tipoPedido}</td>
                <td>${venta.formaPago}</td>
                <td>${venta.estadoPago}</td>
                <td>$${venta.total.toLocaleString('es-CO')}</td>
                <td>${venta.estadoPedido}</td>
                <td class="acciones-venta">
                    <button class="btn-ver-venta" onclick="generarFacturaVenta('${venta.idVenta}')">Ver Factura</button>
                    <button class="btn-pagar" onclick="marcarVentaPagada('${venta.idVenta}')">Pagar</button>
                    <button class="btn-entregado" onclick="marcarPedidoEntregado('${venta.idVenta}')">Entregado</button>
                    <button class="btn-cancelar-pedido" onclick="cancelarVenta('${venta.idVenta}')">Cancelar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    console.log('✅ Ventas renderizadas');
}
//==================================================================================================================================
//FUNCIONES PARA LOS BOTONES DENTRO DE LA TABLA VENTAS
//==================================================================================================================================
//=================================================================
//MARCAR VENTA PAGADA
//=================================================================
function marcarVentaPagada(idVenta) {
    fetch(`http://localhost:8080/api/ventas/${idVenta}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoPago: 'PAGADO' })
    })
    .then(() => {
        cargarVentasDesdeBackend();
        console.log('💰 Venta pagada:', idVenta);
    })
    .catch(error => console.error(error));
}
//=================================================================
//MARCAR PEDIDO ENTREGADO
//=================================================================
function marcarPedidoEntregado(idVenta) {
    const venta = ventas.find(v => v.idVenta === idVenta);
    if (!venta) {
        console.log('❌ Venta no encontrada');
        return;
    }

    const estadoPedido = venta.formaPago === 'Contra entrega' ? 'ENTREGADO' : 'ENTREGADO';
    const estadoPago = venta.formaPago === 'Contra entrega' ? 'PAGADO' : venta.estadoPago;

    fetch(`http://localhost:8080/api/ventas/${idVenta}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoPedido: estadoPedido, estadoPago: estadoPago })
    })
    .then(() => {
        cargarVentasDesdeBackend();
        console.log('✅ Pedido entregado:', idVenta);
    })
    .catch(error => console.error(error));
}
//=================================================================
//CANCELAR VENTA
//=================================================================
function cancelarVenta(idVenta) {
    fetch(`http://localhost:8080/api/ventas/${idVenta}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estadoPago: 'CANCELADO', estadoPedido: 'CANCELADO' })
    })
    .then(() => {
        cargarVentasDesdeBackend();
        console.log('❌ Venta cancelada:', idVenta);
    })
    .catch(error => console.error(error));
}



//==================================================================================================================================
//FACTURA
//==================================================================================================================================
//=================================================================
// GENERAR FACTURA
//=================================================================
function generarFacturaVenta(ventaId) {
    console.log('🧾 Generando factura...', ventaId);

    const venta = ventas.find(v => v.idVenta === ventaId);
    if (!venta) {
        alert('Venta no encontrada');
        return;
    }

    const contenedor = document.getElementById('contenidoFactura');

    let productosHTML = '';
    if (venta.detalle) {
        venta.detalle.forEach(item => {
            productosHTML += `
                <tr>
                    <td>${item.productoNombre}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precio.toLocaleString('es-CO')}</td>
                    <td>$${item.subtotal.toLocaleString('es-CO')}</td>
                </tr>
            `;
        });
    }

    const salsas = venta.salsas?.length ? venta.salsas.join(', ') : 'Ninguna';
    const incluye = [];
    if (venta.guantes) incluye.push('Guantes');
    if (venta.servilletas) incluye.push('Servilletas');
    if (venta.desechables) incluye.push('Desechables');

    contenedor.innerHTML = `
        <div class="factura-contenido">
            <div class="factura-header">
                <h1>THE BROASTER HOUSE</h1>
                <p>Sistema de ventas</p>
            </div>
            <hr>
            <h3>Información de venta</h3>
            <p><strong>Factura:</strong> ${venta.idVenta}</p>
            <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
            <p><strong>Empleado:</strong> ${venta.empleado}</p>
            <hr>
            <h3>Datos del cliente</h3>
            <p><strong>Cliente:</strong> ${venta.clienteNombre || ''}</p>
            <p><strong>Documento:</strong> ${venta.clienteDocumento || ''}</p>
            <p><strong>Correo:</strong> ${venta.clienteCorreo || ''}</p>
            <p><strong>Dirección:</strong> ${venta.direccionEntrega || 'No aplica'}</p>
            <p><strong>Teléfono:</strong> ${venta.clienteTelefono || ''}</p>
            <hr>
            <p><strong>Tipo pedido:</strong> ${venta.tipoPedido || ''}</p>
            <p><strong>Forma de pago:</strong> ${venta.formaPago || ''}</p>
            ${venta.formaPago === 'Efectivo' ? `
                <p><strong>Moneda:</strong> ${venta.monedaPago || 'COP'}</p>
                ${venta.monedaPago === 'USD' ? `
                    <p><strong>Tasa dólar:</strong> $${(venta.tasaDolar || 0).toLocaleString('es-CO')} COP</p>
                    <p><strong>Monto recibido:</strong> $${Number(venta.montoRecibido || 0).toFixed(2)} USD</p>
                    <p><strong>Cambio:</strong> $${Number(venta.cambio || 0).toFixed(2)} USD</p>
                ` : `
                    <p><strong>Monto recibido:</strong> $${(venta.montoRecibido || 0).toLocaleString('es-CO')}</p>
                    <p><strong>Cambio:</strong> $${(venta.cambio || 0).toLocaleString('es-CO')}</p>
                `}` : ''}
            <p><strong>Estado pago:</strong> ${venta.estadoPago || ''}</p>
            <p><strong>Estado pedido:</strong> ${venta.estadoPedido || ''}</p>
            <p><strong>Salsas:</strong> ${salsas}</p>
            <p><strong>Incluye:</strong> ${incluye.length > 0 ? incluir.join(', ') : 'Ninguno'}</p>
            <p><strong>Observaciones:</strong> ${venta.observaciones || 'Ninguna'}</p>
            <hr>
            <h3>Detalle del pedido</h3>
            <table class="tabla-factura">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>${productosHTML}</tbody>
            </table>
            <hr>
            <div class="factura-total">
                ${venta.monedaPago === 'USD' ? `
                    <p><strong>TOTAL COP:</strong> $${venta.total.toLocaleString('es-CO')}</p>
                    <p><strong>TOTAL USD:</strong> $${(venta.total / (venta.tasaDolar || 1)).toFixed(2)}</p>
                ` : `<p><strong>TOTAL:</strong> $${venta.total.toLocaleString('es-CO')}</p>`}
            </div>
        </div>
    `;

    abrirModal('modalFacturaVenta', false);
    console.log('✅ Factura generada');
}
//=================================================================
// IMPRIMIR FACTURA
//=================================================================
function imprimirFactura() {
    console.log('🖨️ Imprimiendo factura...');
    window.print();
}
//==================================================================================================================================
//EXPORTAR
//==================================================================================================================================
//=================================================================
// FUNCIÓN PARA EXPORTAR VENTAS
//=================================================================
function obtenerVentasFiltradasActuales() {
    const fechaInicio = document.getElementById('fechaInicioVentas').value;
    const fechaFin = document.getElementById('fechaFinVentas').value;
    const cliente = document.getElementById('filtroCliente').value;
    const empleado = document.getElementById('filtroEmpleado').value;
    const estadoPago = document.getElementById('filtroEstadoPago').value;
    const estadoPedido = document.getElementById('filtroEstadoPedido').value;
    const formaPago = document.getElementById('filtroPago').value;

    return ventas.filter(v => {
        const fechaVenta = new Date(v.fecha).toISOString().split('T')[0];
        return (
            (!fechaInicio || fechaVenta >= fechaInicio) &&
            (!fechaFin || fechaVenta <= fechaFin) &&
            (!cliente || v.clienteNombre === cliente) &&
            (!empleado || v.empleado === empleado) &&
            (!estadoPago || v.estadoPago === estadoPago) &&
            (!estadoPedido || v.estadoPedido === estadoPedido) &&
            (!formaPago || v.formaPago === formaPago)
        );
    });
}
//=================================================================
// EXPORTAR VENTAS PARA EXCEL
//=================================================================
function exportarVentasExcel() {
    const datosVentas = obtenerVentasFiltradasActuales();
    if (datosVentas.length === 0) {
        alert('No hay ventas para exportar');
        return;
    }

    const datos = datosVentas.map(v => ({
        ID: v.idVenta,
        FECHA: new Date(v.fecha).toLocaleString(),
        EMPLEADO: v.empleado,
        CLIENTE: v.clienteNombre,
        DOCUMENTO: v.clienteDocumento,
        TELÉFONO: v.clienteTelefono,
        TIPO_PEDIDO: v.tipoPedido,
        DIRECCIÓN: v.direccionEntrega || 'N/A',
        FORMA_PAGO: v.formaPago,
        MONEDA: v.monedaPago || 'COP',
        TOTAL_COP: v.total,
        TOTAL_PRODUCTOS: v.detalle ? v.detalle.length : 0,
        ESTADO_PAGO: v.estadoPago,
        ESTADO_PEDIDO: v.estadoPedido,
        OBSERVACIONES: v.observaciones || ''
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    XLSX.writeFile(wb, `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`);
}
//=================================================================
// EXPORTAR VENTAS PARA PDF
//=================================================================
function exportarVentasPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const datosVentas = obtenerVentasFiltradasActuales();
    if (datosVentas.length === 0) {
        alert('No hay ventas para exportar');
        return;
    }

    const datos = datosVentas.map(v => [
        v.idVenta,
        new Date(v.fecha).toLocaleDateString(),
        v.empleado,
        v.clienteNombre,
        v.tipoPedido,
        v.formaPago,
        v.estadoPago,
        `$${v.total.toLocaleString('es-CO')}`,
        v.estadoPedido
    ]);

    doc.setFontSize(14);
    doc.text("REPORTE DE VENTAS", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 22);

    doc.autoTable({
        startY: 30,
        head: [['ID', 'Fecha', 'Empleado', 'Cliente', 'Tipo', 'Pago', 'Estado Pago', 'Total', 'Estado Pedido']],
        body: datos,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [40, 40, 40] }
    });

    doc.save(`reporte_ventas_${Date.now()}.pdf`);
}



//=================================================================
// CARGA INICIAL
//=================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Solo cargar si ya existe el HTML
    if (document.getElementById('tablaVentas')) {
        cargarVentasDesdeBackend();
    }
});
