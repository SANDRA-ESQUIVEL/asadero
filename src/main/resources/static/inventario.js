//=================================================================
// VARIABLES GLOBALES INVENTARIO
//=================================================================
const estadoInventario = {
    productoSeleccionado: null
};

let datosProductoTemporal = {};
let productoEditando = null;

//=================================================================
// DATOS FICTICIOS COMPLETOS PARA PROBAR TODOS REPORTES
//=================================================================
let productos = [];
let movimientosInventario = [];

//=================================================================
// DATOS PREDEFINIDOS PARA AUTOCOMPLETAR PRODUCTOS
//=================================================================
const productosPredefinidos = {

    'Pollo': {
        tipo: 'Materia Prima',
        categoria: 'Alimentos',
        ubicacion: 'Nevera 1',
        stockMinimo: 10,
        unidad: 'Kg'
    },

    'Filete Pechuga': {
        tipo: 'Materia Prima',
        categoria: 'Alimentos',
        ubicacion: 'Nevera 1',
        stockMinimo: 8,
        unidad: 'Kg'
    },

    'Costillas Cerdo': {
        tipo: 'Materia Prima',
        categoria: 'Alimentos',
        ubicacion: 'Nevera 2',
        stockMinimo: 5,
        unidad: 'Kg'
    },

    'Salchicha Manguera': {
        tipo: 'Ingrediente',
        categoria: 'Alimentos',
        ubicacion: 'Nevera 2',
        stockMinimo: 5,
        unidad: 'Kg'
    },

    'Papa': {
        tipo: 'Ingrediente',
        categoria: 'Acompañamientos',
        ubicacion: 'Nevera 3',
        stockMinimo: 15,
        unidad: 'Kg'
    },

    'Verduras': {
        tipo: 'Ingrediente',
        categoria: 'Alimentos',
        ubicacion: 'Nevera 4',
        stockMinimo: 5,
        unidad: 'Kg'
    },

    'Aceite': {
        tipo: 'Ingrediente',
        categoria: 'Otros',
        ubicacion: 'Cocina',
        stockMinimo: 3,
        unidad: 'Litro'
    },

    'Harina': {
        tipo: 'Ingrediente',
        categoria: 'Otros',
        ubicacion: 'Bodega',
        stockMinimo: 2,
        unidad: 'Kg'
    },

    'Arroz': {
        tipo: 'Ingrediente',
        categoria: 'Acompañamientos',
        ubicacion: 'Bodega',
        stockMinimo: 5,
        unidad: 'Kg'
    },

    'Granos': {
        tipo: 'Ingrediente',
        categoria: 'Acompañamientos',
        ubicacion: 'Bodega',
        stockMinimo: 5,
        unidad: 'Kg'
    },

    'Botella de Agua Cristal 600 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 6',
        stockMinimo: 10,
        unidad: 'Botella'
    },

    'Botella de Agua Cristal con Gas 600 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 6',
        stockMinimo: 10,
        unidad: 'Botella'
    },

    'Coca Cola 600 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 12,
        unidad: 'Botella'
    },

    'Coca Cola 1.5 L': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 6,
        unidad: 'Botella'
    },

    'Colombiana 600 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 12,
        unidad: 'Botella'
    },

    'Colombiana 1.5 L': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 6,
        unidad: 'Botella'
    },

    'Manzana Postobon 600 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 12,
        unidad: 'Botella'
    },

    'Manzana Postobon 1.5 L': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 6,
        unidad: 'Botella'
    },

    'Uva Postobon 600 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 12,
        unidad: 'Botella'
    },

    'Uva Postobon 1.5 L': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 5',
        stockMinimo: 6,
        unidad: 'Botella'
    },

    'Jugo Hit 500 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 6',
        stockMinimo: 10,
        unidad: 'Botella'
    },

    'Cerveza en Lata 330 ml': {
        tipo: 'Bebida',
        categoria: 'Bebidas',
        ubicacion: 'Nevera 7',
        stockMinimo: 12,
        unidad: 'Unidad'
    },

    'Salsas de Servicio': {
        tipo: 'Ingrediente',
        categoria: 'Salsas',
        ubicacion: 'Cocina',
        stockMinimo: 5,
        unidad: 'Unidad'
    },

    'Bolsas': {
        tipo: 'Desechable',
        categoria: 'Desechables',
        ubicacion: 'Bodega',
        stockMinimo: 5,
        unidad: 'Paquete'
    },

    'Servilletas': {
        tipo: 'Desechable',
        categoria: 'Desechables',
        ubicacion: 'Bodega',
        stockMinimo: 5,
        unidad: 'Paquete'
    },

    'Vasos Desechables': {
        tipo: 'Desechable',
        categoria: 'Desechables',
        ubicacion: 'Bodega',
        stockMinimo: 5,
        unidad: 'Paquete'
    },

    'Cubiertos Desechables': {
        tipo: 'Desechable',
        categoria: 'Desechables',
        ubicacion: 'Bodega',
        stockMinimo: 5,
        unidad: 'Paquete'
    },

    'Especias secas': {
        tipo: 'Ingrediente',
        categoria: 'Otros',
        ubicacion: 'Cocina',
        stockMinimo: 2,
        unidad: 'Kg'
    },

    'Salsa BBQ': {
        tipo: 'Ingrediente',
        categoria: 'Salsas',
        ubicacion: 'Cocina',
        stockMinimo: 3,
        unidad: 'Botella'
    },

    'Pollo Broaster Entero': {
        tipo: 'Venta',
        categoria: 'Pollos',
        ubicacion: 'Cocina',
        stockMinimo: 5,
        unidad: 'Unidad'
    },

    'Pollo BroasterCuarto': {
        tipo: 'Venta',
        categoria: 'Pollos',
        ubicacion: 'Cocina',
        stockMinimo: 10,
        unidad: 'Unidad'
    },

    'Papas Francesas': {
        tipo: 'Venta',
        categoria: 'Acompañamientos',
        ubicacion: 'Cocina',
        stockMinimo: 10,
        unidad: 'Porción'
    },

    'Aroz Blanca': {
        tipo: 'Venta',
        categoria: 'Acompañamientos',
        ubicacion: 'Cocina',
        stockMinimo: 10,
        unidad: 'Porción'
    }
};


//==================================================================================================================================
// FUNCIONES AUXILIARES PARA REGISTRO PRODUCTO
//==================================================================================================================================
//=================================================================
// GENERAR CODIGO ID PRODUCTO
//=================================================================
function generarCodigoProducto() {
    return generarCodigo(productos, 'PROD', 3); 
}
//=================================================================
// FUNCIÓN PARA ACTIVAR CAMPOS EN REGISTRO PRODUCTO
//=================================================================
function habilitarCamposProducto() {
    const campos = ['tipoProducto','categoriaProducto','ubicacionProducto','unidadMedidaProducto'];

    campos.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.disabled = false;
        el.classList.remove('select-bloqueado');
    });
}
//=================================================================
// FUNCIÓN PARA BLOQUEAR CAMPOS EN REGISTRO PRODUCTO
//=================================================================
function bloquearCamposProducto() {
    const campos = ['tipoProducto','categoriaProducto','ubicacionProducto','unidadMedidaProducto'];

    campos.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.disabled = true;
        el.classList.add('select-bloqueado');
    });
}
//=================================================================
// AUTOCOMPLETAR PRODUCTO
//=================================================================
function autocompletarProducto() {
    const nombreProducto = document.getElementById('nombreProducto').value;
    const contenedorOtro = document.getElementById('contenedorOtroProducto');
    const tipoProducto = document.getElementById('tipoProducto');
    const categoriaProducto = document.getElementById('categoriaProducto');
    const ubicacionProducto = document.getElementById('ubicacionProducto');
    const unidadMedidaProducto = document.getElementById('unidadMedidaProducto');

    const campos = [tipoProducto, categoriaProducto, ubicacionProducto, unidadMedidaProducto];

    if (!nombreProducto) {
        contenedorOtro.style.display = 'none';
        campos.forEach(c => { c.value = ''; });
        return;
    }

    if (nombreProducto === 'Otro') {
        contenedorOtro.style.display = 'block';
        campos.forEach(c => { c.value = ''; });
        return;
    }

    contenedorOtro.style.display = 'none';
    const datos = productosPredefinidos[nombreProducto];

    if (!datos) {
        campos.forEach(c => { c.value = ''; });
        return;
    }

    // ✅ SOLO autocompletar, NO bloquear
    tipoProducto.value = datos.tipo || '';
    categoriaProducto.value = datos.categoria || '';
    ubicacionProducto.value = datos.ubicacion || '';
    unidadMedidaProducto.value = datos.unidad || '';
}
//=================================================================
// CARGAR PROVEEDORES EN SELECT CAMPO PROVEEDOR
//=================================================================
function cargarProveedoresInventario() {
    const selectProveedor = document.getElementById('proveedorProducto');

    if (!selectProveedor) return;

    selectProveedor.innerHTML = `<option value="" disabled selected>Seleccionar proveedor</option>`;

    proveedores.forEach(proveedor => {

        if (proveedor.estado === 'Activo') {
            selectProveedor.innerHTML += `<option value="${proveedor.nombre}">${proveedor.nombre}</option>`;
        }
    });
}

//==================================================================================================================================
// REGISTRAR PRODUCTO:
//==================================================================================================================================
function registrarProducto(event) {

    console.log('🟢 Registrando producto...');

    event.preventDefault();

    limpiarErroresVisuales();

    if (!validarFormulario('formRegistroProducto')) {
        return false;
    }

    const codigo =
        document.getElementById(
            'codigoProducto'
        ).value.trim();

    const nombre =
        document.getElementById(
            'nombreProducto'
        ).value.trim();

    const codigoDuplicado =
        productos.some(
            p => p.codigo === codigo
        );

    if (codigoDuplicado) {
        alert(
            'Ya existe un producto con ese código'
        );
        return false;
    }

    const nuevoProducto = {

        fechaRegistro:
            document.getElementById(
                'fechaRegistroProducto'
            ).value,

        codigoProducto: codigo,

        nombreProducto: formatearNombre(nombre),

        otroNombreProducto: formatearNombre(document.getElementById('otroNombreProducto').value) || '',

        tipoProducto:
            document.getElementById(
                'tipoProducto'
            ).value,

        categoriaProducto:
            document.getElementById(
                'categoriaProducto'
            ).value,

        precioVenta:
            parseFloat(
                document.getElementById(
                    'precioVentaProducto'
                ).value
            ) || 0,

        costoCompra:
            parseFloat(
                document.getElementById(
                    'costoCompraProducto'
                ).value
            ) || 0,

        ubicacion: formatearNombre(document.getElementById('ubicacionProducto').value),

        stockInicial:
            parseInt(
                document.getElementById(
                    'stockInicialProducto'
                ).value
            ) || 0,

        stockMinimo:
            parseInt(
                document.getElementById(
                    'stockMinimoProducto'
                ).value
            ) || 0,

        unidadMedida:
            document.getElementById(
                'unidadMedidaProducto'
            ).value,

        proveedor:
            document.getElementById(
                'proveedorProducto'
            ).value,

        descripcion:
            document.getElementById(
                'descripcionProducto'
            ).value,

        estado:
            document.getElementById(
                'estadoProducto'
            ).value
    };

    fetch(
        'http://localhost:8080/api/productos',
        {
            method: 'POST',

            headers: {
                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify(
                nuevoProducto
            )
        }
    )

    .then(response => response.json())

    .then(() => {

        console.log('✅ Guardado en MySQL');

        cargarProductosDesdeBackend();

        setTimeout(() => {
            mostrarAlertas();
        }, 200);

        alert('Producto registrado correctamente');

        document.getElementById(
            'formRegistroProducto'
        ).reset();

        document.getElementById(
            'modalRegistroProducto'
        ).style.display = 'none';
    })

    .catch(error => {

        console.error(
            '❌ Error registrando:',
            error
        );

        alert(
            'Error registrando producto'
        );
    });

    return false;
}



//==================================================================================================================================
// FUNCIONES AUXILIARES PARA CONSULTAR INVENTARIO
//==================================================================================================================================
//=================================================================
// CARGAR PROVEEDORES EN EDITAR PRODUCTO
//=================================================================
function cargarProveedoresInventarioEditar() {
    const selectProveedor = document.getElementById('editarProveedorProducto');
        if (!selectProveedor) return;
        selectProveedor.innerHTML = '<option value="" disabled>Seleccionar proveedor</option>';

    proveedores.forEach(proveedor => {

        if (proveedor.estado === 'Activo') {
            selectProveedor.innerHTML += `
                <option value="${proveedor.nombre}">
                    ${proveedor.nombre}
                </option>
            `;
        }
    });
}

//==================================================================================================================================
// CONSULTAR INVENTARIO
//==================================================================================================================================
//=================================================================
// BOTÓN PARA MOSTRAR TODO EL INVENTARIO
//=================================================================
function mostrarTodoInventario() {
    console.log('📊 Mostrando todo el inventario...');
    
    limpiarFiltrosInventario();
    renderizarTablaInventario(productos);
}

function cargarProductosDesdeBackend() {

    fetch('http://localhost:8080/api/productos')

        .then(response => response.json())

        .then(data => {

            productos.length = 0;

            data.forEach(p => {

                productos.push({
                    codigo: p.codigoProducto,
                    nombre: p.nombreProducto,
                    tipo: p.tipoProducto,
                    categoria: p.categoriaProducto,
                    ubicacion: p.ubicacion,
                    precioVenta: p.precioVenta,
                    costoCompra: p.costoCompra,
                    stock: p.stockInicial,
                    stockMinimo: p.stockMinimo,
                    unidadMedida: p.unidadMedida,
                    proveedor: p.proveedor,
                    descripcion: p.descripcion,
                    estado: p.estado
                });
            });

            const tbody = document.getElementById('bodyInventario');
            if (tbody) {
                renderizarTablaInventario();
            }
        })

        .catch(error => {
            console.error('Error cargando productos:', error);
        });
}
//=================================================================
// BOTÓN PARA FILTRAR INVENTARIO
//=================================================================
function filtrarInventario() {
    console.log('🔎 Filtrando inventario...');
    
    const buscar = document.getElementById('buscarInventario').value.toLowerCase();
    const tipoFiltro = document.getElementById('filtroTipoInventario').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaInventario').value;
    const stockFiltro = document.getElementById('filtroStockInventario').value;
    
    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.codigo.toLowerCase().includes(buscar) || producto.nombre.toLowerCase().includes(buscar);
        const coincideTipo = !tipoFiltro || producto.tipo === tipoFiltro;
        const coincideCategoria = !categoriaFiltro || producto.categoria === categoriaFiltro;
        const coincideStock = !stockFiltro || (stockFiltro === 'bajo' && producto.stock <= producto.stockMinimo);
        
        return coincideBusqueda && coincideTipo && coincideCategoria && coincideStock;
    });
    
    renderizarTablaInventario(productosFiltrados);
    console.log(`✅ ${productosFiltrados.length} productos filtrados`);
}
//=================================================================
// BOTÓN PARA STOCK BAJO
//=================================================================
function mostrarStockBajo() {
    console.log('⚠️ Mostrando stock bajo...');
    
    const stockBajo = productos.filter(producto => 
        producto.stock <= producto.stockMinimo && producto.estado === 'Activo'
    );
    
    document.getElementById('buscarInventario').value = '';
    document.getElementById('filtroTipoInventario').value = '';
    document.getElementById('filtroCategoriaInventario').value = '';
    document.getElementById('filtroStockInventario').value = 'bajo';
    
    renderizarTablaInventario(stockBajo);
}
//=================================================================
// MOSTRAR ELEMENTOS VISUALES EN LA TABLA INVENTARIO
//=================================================================
function renderizarTablaInventario(productosMostrar = productos) {
    console.log('📦 Renderizando tabla inventario...');

    const tbody = document.getElementById('bodyInventario');

    if (!tbody) {
        console.log('⚠️ bodyInventario no existe');
        return;
    }

    tbody.innerHTML = '';

    if (!productosMostrar || productosMostrar.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center;">
                    No hay productos registrados
                </td>
            </tr>
        `;

        console.log('ℹ️ No hay productos para mostrar');
        return;
    }
    
    productosMostrar.forEach(producto => {
        const alertaStock = producto.stock <= producto.stockMinimo ? 'bajo-stock' : '';
        const estadoClass = `estado-${producto.estado.toLowerCase()}`;
        
        const fila = `
            <tr class="${alertaStock}">
                <td><strong>${producto.codigo}</strong></td>
                <td>${producto.nombre}</td>
                <td>${producto.tipo}</td>
                <td>${producto.categoria}</td>
                <td>${producto.ubicacion}</td>
                <td>$${producto.precioVenta.toLocaleString()}</td>
                <td><strong class="${producto.stock <= producto.stockMinimo ? 'stock-bajo' : ''}">${producto.stock}</strong></td>
                <td>${producto.unidadMedida}</td>                
                <td><strong>${producto.stockMinimo}</strong></td>
                <td><span class="badge ${estadoClass}"><strong>${producto.estado}</strong></span></td>
                <td>
                    <button class="btn-small btn-editar" onclick="editarProducto('${producto.codigo}')">Editar</button>
                    <button class="btn-small btn-eliminacion" onclick="eliminarProducto('${producto.codigo}')">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}
//=================================================================
// LIMPIAR FILTROS
//=================================================================
function limpiarFiltrosInventario() {

    const buscar = document.getElementById('buscarInventario');
    const tipo = document.getElementById('filtroTipoInventario');
    const categoria = document.getElementById('filtroCategoriaInventario');
    const stock = document.getElementById('filtroStockInventario');

    if (buscar) buscar.value = '';
    if (tipo) tipo.value = '';
    if (categoria) categoria.value = '';
    if (stock) stock.value = '';
}
//=================================================================
// EVENTOS AUTOMÁTICOS
//=================================================================
document.addEventListener('DOMContentLoaded', function() {

    cargarProductosDesdeBackend();
    const buscarInput = document.getElementById('buscarInventario');
    if (buscarInput) {
        buscarInput.addEventListener('input', filtrarInventario);
    }
});
//==================================================================================================================================
// BOTONES EDITAR Y ELIMINAR EN TABLA DE CONSULTAR INVENTARIO
//==================================================================================================================================
//=================================================================
// FUNCION BOTON EDITAR PRODUCTO
//=================================================================
function editarProducto(codigo) {
    console.log('✏️ Editando producto:', codigo);

    limpiarErroresVisuales();

    const producto = productos.find(p => p.codigo === codigo);
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

    abrirModal('modalEditarProducto', false);
    cargarProveedoresInventarioEditar();

    setTimeout(() => {
        document.getElementById('editarCodigoProducto').value = producto.codigo;
        document.getElementById('editarNombreProducto').value = producto.nombre;
        document.getElementById('editarTipoProducto').value = producto.tipo;
        document.getElementById('editarCategoriaProducto').value = producto.categoria;
        document.getElementById('editarPrecioVentaProducto').value = producto.precioVenta;
        document.getElementById('editarCostoCompraProducto').value = producto.costoCompra || 0;
        document.getElementById('editarUbicacionProducto').value = producto.ubicacion;
        document.getElementById('editarStockProducto').value = producto.stock;
        document.getElementById('editarStockMinimoProducto').value = producto.stockMinimo;
        document.getElementById('editarUnidadMedidaProducto').value = producto.unidadMedida;
        document.getElementById('editarProveedorProducto').value = producto.proveedor || '';
        document.getElementById('editarDescripcionProducto').value = producto.descripcion || '';
        document.getElementById('editarEstadoProducto').value = producto.estado;
    }, 0);

    console.log('✅ Modal editar abierto');
}
//=================================================================
// ACTUALIZAR Y GUARDAR LOS DATOS EDITADOS DEL PRODUCTO
//=================================================================
function actualizarProducto(event) {
    console.log('🟡 Actualizando producto...');
    event.preventDefault();

    limpiarErroresVisuales();

    if (!validarFormulario('formEditarProducto')) {
        console.log('❌ Validación fallida');
        return false;
    }

    const codigo =
        document.getElementById('editarCodigoProducto').value;

    const indexProducto =
        productos.findIndex(p => p.codigo === codigo);

    if (indexProducto === -1) {
        alert('Producto no encontrado');
        return false;
    }

    const nuevoNombre =
        document.getElementById('editarNombreProducto')
            .value.trim();

    const nombreDuplicado =
        productos.some((producto, index) =>
            index !== indexProducto &&
            producto.nombre.toLowerCase() ===
            nuevoNombre.toLowerCase()
        );

    if (nombreDuplicado) {

        alert('Ya existe otro producto con ese nombre');

        document.getElementById('editarNombreProducto')
            .classList.add('campo-error');

        return false;
    }

    const productoActualizado = {

        fechaRegistro: new Date().toLocaleDateString(),

        codigoProducto: codigo,

        nombreProducto: nuevoNombre,

        otroNombreProducto: '',

        tipoProducto:
            document.getElementById('editarTipoProducto').value,

        categoriaProducto:
            document.getElementById('editarCategoriaProducto').value,

        precioVenta:
            parseFloat(
                document.getElementById(
                    'editarPrecioVentaProducto'
                ).value
            ) || 0,

        costoCompra:
            parseFloat(
                document.getElementById(
                    'editarCostoCompraProducto'
                ).value
            ) || 0,

        ubicacion:
            document.getElementById(
                'editarUbicacionProducto'
            ).value,

        stockInicial:
            parseInt(
                document.getElementById(
                    'editarStockProducto'
                ).value
            ) || 0,

        stockMinimo:
            parseInt(
                document.getElementById(
                    'editarStockMinimoProducto'
                ).value
            ) || 0,

        unidadMedida:
            document.getElementById(
                'editarUnidadMedidaProducto'
            ).value,

        proveedor:
            document.getElementById(
                'editarProveedorProducto'
            ).value,

        descripcion:
            document.getElementById(
                'editarDescripcionProducto'
            ).value,

        estado:
            document.getElementById(
                'editarEstadoProducto'
            ).value
    };

    fetch(
        `http://localhost:8080/api/productos/${codigo}`,
        {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(productoActualizado)
        }
    )
    .then(response => response.json())

    .then(() => {

        console.log(
            '✅ Producto actualizado en MySQL'
        );

        cargarProductosDesdeBackend();

        setTimeout(() => {
            mostrarAlertas();
        }, 200);

        alert(
            'Producto actualizado correctamente'
        );

        document.getElementById(
            'modalEditarProducto'
        ).style.display = 'none';
    })

    .catch(error => {

        console.error(
            '❌ Error actualizando:',
            error
        );

        alert('Error al actualizar producto');
    });

    return false;
}
//=================================================================
// ELIMINAR PRODUCTO 
//=================================================================
function eliminarProducto(codigo) {
    console.log(
        '🗑️ Iniciando eliminación:',
        codigo
    );

    limpiarErroresVisuales();

    const producto =
        productos.find(
            p => p.codigo === codigo
        );

    if (!producto) {
        alert('Producto no encontrado');
        return;
    }

    if (producto.estado === 'Inactivo') {
        alert(
            'El producto ya está inactivo'
        );
        return;
    }

    const confirmar = confirm(
        `¿Desea eliminar el producto?\n\n` +
        `Código: ${producto.codigo}\n` +
        `Producto: ${producto.nombre}\n\n` +
        `Quedará INACTIVO.`
    );

    if (!confirmar) return;

    fetch(
        `http://localhost:8080/api/productos/${codigo}`,
        {
            method: 'DELETE'
        }
    )

    .then(response => response.json())

    .then(() => {

        console.log(
            '✅ Producto inactivado'
        );

        cargarProductosDesdeBackend();

        setTimeout(() => {
            mostrarAlertas();
        }, 200);

        alert(
            'Producto eliminado correctamente'
        );
    })

    .catch(error => {

        console.error(
            '❌ Error eliminando:',
            error
        );

        alert(
            'Error al eliminar producto'
        );
    });
}
//==================================================================================================================================
// FUNCION PARA EXPORTAR INVENTARIO
//==================================================================================================================================
function obtenerInventarioParaExportar(modo = 'filtrado') {
    if (modo === 'todo') return productos;

    const buscar = document.getElementById('buscarInventario').value.toLowerCase();
    const tipoFiltro = document.getElementById('filtroTipoInventario').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaInventario').value;
    const stockFiltro = document.getElementById('filtroStockInventario').value;

    return productos.filter(p => {
        const coincideBusqueda =
            p.codigo.toLowerCase().includes(buscar) ||
            p.nombre.toLowerCase().includes(buscar);

        const coincideTipo = !tipoFiltro || p.tipo === tipoFiltro;
        const coincideCategoria = !categoriaFiltro || p.categoria === categoriaFiltro;
        const coincideStock = !stockFiltro || (stockFiltro === 'bajo' && p.stock <= p.stockMinimo);

        return coincideBusqueda && coincideTipo && coincideCategoria && coincideStock;
    });
}
//=================================================================
// EXPORTAR EN EXCEL
//=================================================================
function exportarInventarioExcel(modo = 'filtrado') {
    const data = obtenerInventarioParaExportar(modo);
        if (!data.length) {
        alert('No hay datos para exportar');
            return;
        } 

    const datos = data.map(p => ({
        CODIGO: p.codigo,
        PRODUCTO: p.nombre,
        TIPO: p.tipo,
        CATEGORIA: p.categoria,
        UBICACION: p.ubicacion,
        PRECIO_VENTA: p.precioVenta,
        STOCK: p.stock,
        UNIDAD: p.unidadMedida,
        STOCK_MINIMO: p.stockMinimo,
        ESTADO: p.estado
    }));

    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    XLSX.writeFile(wb, `inventario_${modo}_${Date.now()}.xlsx`);
}
//=================================================================
// EXPORTAR PARA PDF
//=================================================================
function exportarInventarioPDF(modo = 'filtrado') {
    const data = obtenerInventarioParaExportar(modo);
        if (!data.length) {
            alert('No hay datos para exportar');
            return;
        }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const body = data.map(p => [
        p.codigo,
        p.nombre,
        p.tipo,
        p.categoria,
        p.ubicacion,
        `$${p.precioVenta.toLocaleString()}`,
        p.stock,
        p.unidadMedida,
        p.stockMinimo,
        p.estado
    ]);

    doc.text(`REPORTE INVENTARIO (${modo.toUpperCase()})`, 14, 10);
    doc.autoTable({
        head: [[
            "Código","Producto","Tipo","Categoría",
            "Ubicación","Precio","Stock","Unidad","Min","Estado"
        ]],
        body: body,
        startY: 20
    });
    doc.save(`inventario_${modo}_${Date.now()}.pdf`);
}



//==================================================================================================================================
// FUNCIONES AUXILIARES PARA REGISTRAR MOVIMIENTOS
//==================================================================================================================================
//=================================================================
// INICIALIZAR MOVIMIENTOS 
//=================================================================
function inicializarMovimientos() {
    console.log('⚙️ Inicializando movimientos...');
    const usuarioActual = obtenerUsuarioActual();
    document.getElementById('usuarioMovimiento').value = usuarioActual.completo;
    
    cargarProductosMovimiento();
    cargarMovimientosDesdeBackend();
    console.log('✅ Movimientos inicializados');
}
//=================================================================
// CARGAR PRODUCTOS EN SELECT APARECE EN HTML MOVIMIENTOS
//=================================================================
function cargarProductosMovimiento() {
    console.log('📦 Cargando productos en select...');
    const select = document.getElementById('productoMovimiento');
    select.innerHTML = '<option value="">Seleccionar producto</option>';
    
    const activos = productos.filter(p => p.estado === 'Activo');
    console.log(`✅ ${activos.length} productos activos cargados`);
    
    activos.forEach(producto => {
        select.innerHTML += `<option value="${producto.nombre}">${producto.nombre}</option>`;
    });
}
//=================================================================
// AUTOCOMPLETAR PRODUCTOS REGISTRADOS
//=================================================================
function autocompletarProductoMovimiento() {
    console.log('✏️ Autocompletando producto movimiento...');
    const nombreProducto = document.getElementById('productoMovimiento').value;
    console.log('Producto seleccionado:', nombreProducto);
    
    if (!nombreProducto) {
        console.log('❌ Ningún producto seleccionado');
        limpiarCamposProductoMovimiento();
        return;
    }
    
    const producto = productos.find(p => p.nombre === nombreProducto);
    
    if (!producto) {
        console.log('❌ Producto no encontrado:', nombreProducto);
        alert('Producto no encontrado en inventario');
        return;
    }
    
    estadoInventario.productoSeleccionado = { ...producto }; 
    
    console.log('✅ Producto encontrado:', producto.nombre, 'Stock:', producto.stock);
    
    // LLENAR CAMPOS
    document.getElementById('tipoProductoMovimiento').value = producto.tipo;
    document.getElementById('categoriaProductoMovimiento').value = producto.categoria;
    document.getElementById('ubicacionProductoMovimiento').value = producto.ubicacion;
    document.getElementById('stockActualMovimiento').value = producto.stock;
    
    console.log('✅ Campos autocompletados correctamente');
}
//=================================================================
//FUNCIÓN PARA LIMPIAR CAMPOS DE PRODUCTOS MOVIMIENTO
//=================================================================
function limpiarCamposProductoMovimiento() {
    console.log('🧹 Limpiando campos movimiento...');
    estadoInventario.productoSeleccionado = null;
    
    const campos = ['tipoProductoMovimiento','categoriaProductoMovimiento', 'ubicacionProductoMovimiento','stockActualMovimiento'];
    
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = '';
    });
    
    console.log('✅ Campos limpiados');
}
//=================================================================
// FUNCIÓN PARA GUARDAR LOS DATOS
//=================================================================
function guardarDatosInventario() {
    // Solo confirma que se guardó en arrays
    console.log('✅ Datos guardados en memoria:');
    console.log('- Productos:', productos.length);
    console.log('- Stock Pollo:', productos.find(p => p.nombre === 'Pollo')?.stock);
    console.log('- Movimientos:', movimientosInventario.length);
    console.log('Primer movimiento:', movimientosInventario[0]);
}
//=================================================================
// CARGAR MOVIMIENTOS DESDE BACKEND
//=================================================================
function cargarMovimientosDesdeBackend() {

    console.log(
        '📥 Cargando movimientos desde backend...'
    );

    fetch(
        'http://localhost:8080/api/movimientos'
    )
    .then(response => {

        if (!response.ok) {
            throw new Error(
                'No se pudieron cargar movimientos'
            );
        }

        return response.json();
    })
    .then(data => {

        movimientosInventario =
            data || [];

        console.log(
            `✅ ${movimientosInventario.length} movimientos cargados`
        );

        mostrarHistorialMovimientos();
    })
    .catch(error => {

        console.error(
            '❌ Error cargando movimientos:',
            error
        );
    });
}
//=================================================================
// LIMPIAR FORMULARIO MOVIMIENTO COMPLETO
//=================================================================
function limpiarFormularioMovimiento() {
    console.log('🧹 Limpiando formulario movimiento COMPLETO...');
    estadoInventario.productoSeleccionado = null;

    document.getElementById('productoMovimiento').value = '';
    document.getElementById('tipoMovimiento').value = '';
    document.getElementById('cantidadMovimiento').value = '';
    document.getElementById('motivoMovimiento').value = '';
    document.getElementById('tipoProductoMovimiento').value = '';
    document.getElementById('categoriaProductoMovimiento').value = '';
    document.getElementById('ubicacionProductoMovimiento').value = '';
    document.getElementById('stockActualMovimiento').value = '';

    const usuarioActual = obtenerUsuarioActual();
    document.getElementById('usuarioMovimiento').value = usuarioActual.completo;

    limpiarErroresVisuales();

    document.getElementById('productoMovimiento').focus();
    console.log('✅ Formulario movimiento limpio');
}
//==================================================================================================================================
// REGISTRAR MOVIMIENTO
//==================================================================================================================================
function registrarMovimiento(event) {
    console.log("🟡 === INICIANDO REGISTRO MOVIMIENTO ===");
    event.preventDefault();

    limpiarErroresVisuales();

    console.log("🔎 Validando formulario global...");

    if (!validarFormulario('formMovimientoInventario')) {
        console.log("❌ Validación global fallida");
        return false;
    }
    console.log("✅ Validación global aprobada");
    console.log('Producto seleccionado:', estadoInventario.productoSeleccionado);
   
    if (!estadoInventario.productoSeleccionado) {
        console.log("❌ ERROR: No hay producto seleccionado");
        alert('PRIMERO seleccione un producto del menú desplegable');
        document.getElementById('productoMovimiento').focus();
        document.getElementById('productoMovimiento').classList.add('campo-error');
        return false;
    }

    const tipoMovimiento = document.getElementById('tipoMovimiento').value;
    const cantidadInput = document.getElementById('cantidadMovimiento');
    const cantidad = parseInt(cantidadInput.value);
    const motivo = document.getElementById('motivoMovimiento').value.trim();

    console.log('Tipo movimiento:', tipoMovimiento);
    console.log('Cantidad:', cantidad);
    console.log('Motivo:', motivo || 'Sin especificar');

    const producto = estadoInventario.productoSeleccionado;
    const stockAnterior = producto.stock;
    let nuevoStock = producto.stock;

    console.log(`Stock actual ${producto.nombre}: ${producto.stock}`);

    if (tipoMovimiento === 'SALIDA' && nuevoStock < cantidad) {
        console.log(`❌ Stock insuficiente: ${nuevoStock} < ${cantidad}`);
        alert(`Stock insuficiente!\n${producto.nombre}\nDisponible: ${nuevoStock} ${producto.unidadMedida}`);
        return false;
    }

    if (tipoMovimiento === 'ENTRADA') nuevoStock += cantidad;
    else if (tipoMovimiento === 'SALIDA') nuevoStock -= cantidad;
    else if (tipoMovimiento === 'AJUSTE') nuevoStock = cantidad;

    console.log(`Nuevo stock: ${nuevoStock}`);

    const indexProducto = productos.findIndex(
        p => p.codigo === producto.codigo
    );

    if (indexProducto === -1) {
        console.log(
            '❌ ERROR: Producto no encontrado'
        );
        return false;
    }

    productos[indexProducto].stock = nuevoStock;

    fetch(
        `http://localhost:8080/api/productos/${producto.codigo}/stock`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                stockInicial: nuevoStock
            })
        }
    )
    .then(response => {

        if (!response.ok) {
            throw new Error(
                'Error al actualizar stock'
            );
        }

        return response.json();
    })
    .then(() => {

        console.log(
            '✅ Stock actualizado en MySQL'
        );

        const movimiento = {

            fecha: document.getElementById(
                'fechaMovimiento'
            ).value,

            producto: producto.nombre,

            tipo: tipoMovimiento,

            cantidad: cantidad,

            stockAnterior: stockAnterior,

            stockActual: nuevoStock,

            tipoProducto: producto.tipo,

            categoria: producto.categoria,

            ubicacion: producto.ubicacion,

            motivo: motivo || 'Sin motivo',

            usuario: document.getElementById(
                'usuarioMovimiento'
            ).value
        };

        return fetch(
            'http://localhost:8080/api/movimientos',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify(
                    movimiento
                )
            }
        )
        .then(response => {

            if (!response.ok) {
                throw new Error(
                    'Error guardando movimiento'
                );
            }

            return response.json();
        })
        .then(data => {

            console.log(
                '✅ Movimiento guardado en MySQL'
            );

            movimientosInventario.unshift(data);

            mostrarHistorialMovimientos();

            if (
                document.getElementById(
                    'bodyInventario'
                )
            ) {
                mostrarTodoInventario();
            }

            if (
                document.getElementById(
                    'bodyAlertas'
                )
            ) {
                mostrarAlertas();
            }

            alert(
                `${tipoMovimiento}\n\n${producto.nombre}\nCantidad: ${cantidad}\nStock actual: ${nuevoStock}`
            );

            limpiarFormularioMovimiento();
        });
            })
        .catch(error => {

            console.error(
                '❌ Error actualizando stock:',
                error
            );

            alert(
                'No se pudo registrar el movimiento en MySQL'
            );
        });

    console.log('🧹 Campos limpiados correctamente');

    return false;
}
//=================================================================
// MOSTRAR HISTORIAL DE MOVIMIENTOS
//=================================================================
function mostrarHistorialMovimientos() {
    console.log('📋 Mostrando historial movimientos...');
    const tbody = document.getElementById('bodyMovimientos');
    
    if (movimientosInventario.length === 0) {
        console.log('ℹ️ Sin movimientos registrados');
        tbody.innerHTML = `
            <tr>
                <td colspan="10">No hay movimientos registrados</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    const ultimos = movimientosInventario.slice(0, 50);
    console.log(`✅ ${ultimos.length} movimientos mostrados`);
    
    ultimos.forEach(mov => {
        const tipoClass = `tipo-${mov.tipo.toLowerCase()}`;

        const productoOriginal = productos.find(p => p.nombre === mov.producto);
        const stockBajo = productoOriginal && mov.stockActual <= productoOriginal.stockMinimo;

        const fila = `
            <tr>
                <td>${mov.fecha}</td>
                <td>${mov.producto}</td>
                <td><span class="${tipoClass}">${mov.tipo}</span></td>
                <td>${mov.cantidad}</td>
                <td><strong class="${stockBajo ? 'stock-bajo' : ''}">${mov.stockActual}</strong></td>
                <td>${mov.tipoProducto}</td>
                <td>${mov.categoria}</td>
                <td>${mov.ubicacion}</td>
                <td class="${mov.motivo === 'Alerta stock bajo' ? 'motivo-alerta' : ''}">${mov.motivo}</td>
                <td>${mov.usuario}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}
//=================================================================
// REFRESCAR TABLAS DESPUÉS DE MOVIMIENTO
//=================================================================
function refrescarTodo() {
    mostrarTodoInventario();    
    mostrarHistorialMovimientos(); 
    mostrarAlertas();          
    console.log('🔄 Todo refrescado');
}



//==================================================================================================================================
// ALERTAS
//==================================================================================================================================
function mostrarAlertas() {
    console.log('⚠️ Verificando alertas de stock...');

    limpiarErroresVisuales();

    const productosAlerta =
        productos.filter(p =>
            p.stock <= p.stockMinimo &&
            p.estado === 'Activo'
        );

    console.log(`🚨 ${productosAlerta.length} productos en alerta`);

    const totalAlertasEl = document.getElementById('totalAlertas');
    const tbody = document.getElementById('bodyAlertas');

    if (!totalAlertasEl || !tbody) {
        console.warn('⚠️ Modal alertas no está abierto');
        return;
    }

    totalAlertasEl.textContent = productosAlerta.length;

    if (productosAlerta.length === 0) {
        console.log('✅ ¡No hay alertas!');
        tbody.innerHTML = `
            <tr>
                <td colspan="8">¡Excelente! No hay productos en alerta</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';

    productosAlerta.forEach(producto => {

        const fila = `
            <tr class="alerta-roja">
                <td><strong>${producto.nombre}</strong></td>
                <td>${producto.tipo}</td>
                <td>${producto.categoria}</td>
                <td>${producto.ubicacion}</td>
                <td><strong style="color:red;">${producto.stock}</strong></td>
                <td>${producto.stockMinimo}</td>
                <td><span class="badge estado-activo">Activo</span></td>
                <td><button class="btn-reponer" onclick="reponerProducto('${producto.codigo}')">Reponer</button></td>
            </tr>
        `;

        tbody.innerHTML += fila;
    });

    console.log('✅ Alertas mostradas');
}
//=================================================================
// FUNCIÓN PARA PEDIR REPOSISCIÓN DE PRODUCTOS EN ALERTA
//=================================================================
function reponerProducto(codigo = null) {
    console.log('🔄 Iniciando reposición...');

    limpiarErroresVisuales();

    let productosReponer = [];

    // REPOSICIÓN INDIVIDUAL
    if (codigo) {
        const producto = productos.find(p =>
            p.codigo === codigo &&
            p.estado === 'Activo'
        );
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }
        productosReponer.push(producto);
    } else {
        // REPOSICIÓN GLOBAL
        productosReponer = productos.filter(p =>
            p.stock <= p.stockMinimo &&
            p.estado === 'Activo'
        );

        if (productosReponer.length === 0) {
            alert('No hay productos en alerta');
            return;
        }
    }

    // MENSAJE CONFIRMACIÓN
    let mensaje = 'Productos a reponer:\n\n';

    productosReponer.forEach(p => {
        mensaje += `• ${p.nombre}: ${p.stock}/${p.stockMinimo} ${p.unidadMedida}\n`;
    });

    mensaje += '\n¿Desea continuar?';

    if (!confirm(mensaje)) return;

    // REPONER PRODUCTOS
    let repuestos = 0;

    productosReponer.forEach(producto => {

        const cantidadReponer = producto.stockMinimo * 2;
            producto.stock += cantidadReponer;

        const movimiento = {

            id: Date.now() + Math.random(),

            fecha: document.getElementById('fechaAlertas')?.value || new Date().toISOString(),
            producto: producto.nombre,
            tipo: 'ENTRADA',
            cantidad: cantidadReponer,
            stockActual: producto.stock,
            tipoProducto: producto.tipo,
            categoria: producto.categoria,
            ubicacion: producto.ubicacion,
            motivo: 'Alerta stock bajo',
            usuario: obtenerUsuarioActual().completo
        };

        movimientosInventario.unshift(movimiento);

        repuestos++;
    });

    console.log(`✅ ${repuestos} productos repuestos`);

    alert(`Reposicionados ${repuestos} productos`);

    mostrarHistorialMovimientosSeguro();
    mostrarAlertas();
    mostrarTodoInventario();
}
//=================================================================
// VERIFICAR SI ELEMENTO EXISTE ANTES DE MODIFICAR
//=================================================================
function mostrarHistorialMovimientosSeguro() {
    const tbody = document.getElementById('bodyMovimientos');
    if (!tbody) {
        console.log('ℹ️ Modal Movimientos cerrado - no mostrar historial');
        return;
    }
    mostrarHistorialMovimientos();
}



//==================================================================================================================================
// REPORTES 
//==================================================================================================================================
function generarReporte() {
    console.log('🚀 === INICIANDO generarReporte() ===');
    limpiarErroresVisuales();

    const tipoReporte = document.getElementById('tipoReporte').value;
    const tipoFiltro = document.getElementById('filtroTipoReporte').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaReporte').value;

    console.log('📊 INPUTS:', {tipoReporte,tipoFiltro,categoriaFiltro});

    const tbody = document.getElementById('bodyReporte');
    const thead = document.getElementById('headReporte');

        if (!tbody || !thead) {
            console.log('❌ Tabla reporte no encontrada');
            return;
        }
        if (!tipoReporte) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">Seleccione un tipo de reporte</td>
                </tr>
            `;
            return;
        }

    mostrarFiltrosReporte(tipoReporte);

    const datosReporte = obtenerDatosReporte(tipoReporte,tipoFiltro,categoriaFiltro);

    renderizarReporte(tipoReporte,datosReporte,thead,tbody);
    verificarReporteSeleccionado();
    console.log('✅ === generarReporte() COMPLETADO ===');
}
//=================================================================
//MOSTRAR / OCULTAR FILTROS
//=================================================================
function mostrarFiltrosReporte(tipoReporte) {
    const filtroTipo = document.getElementById('filtroTipoReporte');
    const filtroCategoria = document.getElementById('filtroCategoriaReporte');

        if (!filtroTipo || !filtroCategoria) {
            return;
        }

    const mostrar = tipoReporte === 'movimientos';
        filtroTipo.style.display = mostrar ? 'inline-block' : 'none';
        filtroCategoria.style.display = mostrar ? 'inline-block' : 'none';
}
//=================================================================
//OBTENER DATOS
//=================================================================
function obtenerDatosReporte(tipoReporte,tipoFiltro,categoriaFiltro) {

    switch (tipoReporte) {
        case 'movimientos':
            return movimientosInventario.filter(m => {
                return ((!tipoFiltro || m.tipoProducto === tipoFiltro) && (!categoriaFiltro || m.categoria === categoriaFiltro));
            });
        case 'stock-bajo': return productos.filter(p => p.stock <= p.stockMinimo && p.estado === 'Activo');
        case 'consumo': return calcularConsumoProductos();
        case 'valor-inventario': return calcularValorInventario();
        case 'por-tipo': return calcularStockPorTipo();
        case 'por-categoria': return calcularStockPorCategoria();
        default: return [];
    }
}
//=================================================================
//CALCULAR CONSUMO
//=================================================================
function calcularConsumoProductos() {
    const consumoMap = {};
        movimientosInventario.forEach(m => {
            if (m.tipo === 'SALIDA') {
                consumoMap[m.producto] = (consumoMap[m.producto] || 0) + m.cantidad;
            }
        });

    return Object.entries(consumoMap).sort(([,a],[,b]) => b - a);
}
//=================================================================
//CALCULAR VALOR INVENTARIO
//=================================================================
function calcularValorInventario() {
    const totalValor =
        productos.reduce((sum, p) => {
            return sum + (p.stock * p.precioVenta);
        }, 0);

    const valorCategoria = {};
        productos.forEach(p => {
            valorCategoria[p.categoria] =(valorCategoria[p.categoria] || 0) + (p.stock * p.precioVenta);
        });

    return {totalValor,valorCategoria};
}
//=================================================================
//CALCULAR STOCK POR TIPO
//=================================================================
function calcularStockPorTipo() {
    const stockPorTipo = {};
        productos.forEach(p => {
            stockPorTipo[p.tipo] =(stockPorTipo[p.tipo] || 0) + p.stock;
        });

    return Object.entries(stockPorTipo);
}
//=================================================================
//CALCULAR STOCK POR CATEGORÍA
//=================================================================
function calcularStockPorCategoria() {
    const stockPorCategoria = {};
        productos.forEach(p => {
            stockPorCategoria[p.categoria] =(stockPorCategoria[p.categoria] || 0) + p.stock;
        });

    return Object.entries(stockPorCategoria);
}
//=================================================================
//RENDERIZAR REPORTES
//=================================================================
function renderizarReporte(tipoReporte,datosReporte,thead,tbody) {
    console.log('🎨 Renderizando reporte...');
    let html = '';

    if (!datosReporte || datosReporte.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">Sin datos</td>
            </tr>
        `;
        return;
    }

    switch (tipoReporte) {
        case 'movimientos':
            thead.innerHTML = `
                <tr>
                    <th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th>
                </tr>
            `;
            datosReporte.forEach(m => {
                html += `
                    <tr>
                        <td>${m.fecha}</td><td>${m.producto}</td><td>${m.tipo}</td><td>${m.cantidad}</td>
                    </tr>
                `;
            });
        break;

        case 'stock-bajo':
            thead.innerHTML = `
                <tr>
                    <th>Producto</th><th>Stock</th><th>Mínimo</th><th>Ubicación</th>
                </tr>
            `;
            datosReporte.forEach(p => {
                html += `
                    <tr>
                        <td>${p.nombre}</td><td>${p.stock}</td><td>${p.stockMinimo}</td><td>${p.ubicacion}</td>
                    </tr>
                `;
            });
        break;

        case 'consumo':
            thead.innerHTML = `
                <tr>
                    <th>Producto</th><th>Consumido</th>
                </tr>
            `;
            datosReporte.forEach(item => {
                html += `
                    <tr>
                        <td>${item[0]}</td><td>${item[1]}</td>
                    </tr>
                `;
            });
        break;

        case 'valor-inventario':
            const {totalValor,valorCategoria} = datosReporte;
            thead.innerHTML = `
                <tr>
                    <th>Categoría</th><th>Valor</th>
                </tr>
            `;
            html += `
                <tr>
                    <td><strong>VALOR TOTAL</strong></td><td><strong>$${totalValor.toLocaleString()}</strong></td>
                </tr>
            `;

            Object.entries(valorCategoria)
            .forEach(([cat, val]) => {
                html += `
                    <tr>
                        <td>${cat}</td><td>$${val.toLocaleString()}</td>
                    </tr>
                `;
            });
        break;

        case 'por-tipo':
            thead.innerHTML = `
                <tr>
                    <th>Tipo</th><th>Stock</th>
                </tr>
            `;
            datosReporte.forEach(item => {
                html += `
                    <tr>
                        <td>${item[0]}</td><td>${item[1]}</td>
                    </tr>
                `;
            });
        break;

        case 'por-categoria':
            thead.innerHTML = `
                <tr>
                    <th>Categoría</th><th>Stock</th>
                </tr>
            `;
            datosReporte.forEach(item => {
                html += `
                    <tr>
                        <td>${item[0]}</td><td>${item[1]}</td>
                    </tr>
                `;
            });
        break;
    }

    tbody.innerHTML = html;
    console.log('✅ Reporte renderizado');
}
//=================================================================
//MOSTRAR TODO
//=================================================================
function mostrarTodoReporte() {
    console.log('🔄 Limpiando reporte...');
    limpiarErroresVisuales();

    document.getElementById('tipoReporte').value = '';
    document.getElementById('headReporte').innerHTML = '';
    document.getElementById('bodyReporte').innerHTML = `
        <tr>
            <td colspan="4">Seleccione reporte</td>
        </tr>
    `;

    console.log('✅ Reporte limpio');
}
//=================================================================
//VERIFICAR BOTONES
//=================================================================
function verificarReporteSeleccionado() {
    const tipoReporte = document.getElementById('tipoReporte').value;
    const filas = document.querySelectorAll('#bodyReporte tr');
    const tieneDatos = filas.length > 0;
    const imprimirBtn = document.querySelector('[onclick="imprimirReporte()"]');
    const exportarBtn = document.querySelector('.btn-exportar');

    [imprimirBtn, exportarBtn].forEach(btn => {
        if (!btn) return;

        const habilitado = tipoReporte && tieneDatos;
            btn.disabled = !habilitado;
            btn.style.opacity = habilitado ? '1' : '0.5';
            btn.style.cursor = habilitado ? 'pointer' : 'not-allowed';
    });
}
//=================================================================
// FUNCION PARA IMPRIMIR
//=================================================================
function imprimirReporte() {
    console.log('🖨️ Iniciando impresión...');

    limpiarErroresVisuales();

    const tipoSelect = document.getElementById('tipoReporte');
    if (!tipoSelect || !tipoSelect.value) {
        console.log('❌ No hay reporte para imprimir');
        alert('Primero seleccione y genere un reporte');
        return;
    }
    console.log('✅ Imprimiendo reporte:', tipoSelect.value);
    window.print();
}
//==================================================================================================================================
// FUNCION PARA EXPORTAR
//==================================================================================================================================
//=================================================================
// EXPORTAR EN EXCEL
//=================================================================
function exportarReporteExc() {

    const tipo = document.getElementById('tipoReporte').value;
    const tipoFiltro = document.getElementById('filtroTipoReporte').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaReporte').value;

    const data = obtenerDatosReporte(tipo, tipoFiltro, categoriaFiltro);

    if (!data || !data.length) {
        alert('No hay datos para exportar');
        return;
    }

    let exportData = [];

    switch (tipo) {

        case 'movimientos':
            exportData = data.map(m => ({
                FECHA: m.fecha,
                PRODUCTO: m.producto,
                TIPO: m.tipo,
                CANTIDAD: m.cantidad,
                STOCK: m.stockActual
            }));
            break;

        case 'stock-bajo':
            exportData = data.map(p => ({
                PRODUCTO: p.nombre,
                STOCK: p.stock,
                MINIMO: p.stockMinimo,
                UBICACION: p.ubicacion
            }));
            break;

        case 'consumo':
            exportData = data.map(i => ({
                PRODUCTO: i[0],
                CONSUMO: i[1]
            }));
            break;

        default:
            exportData = data;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");

    XLSX.writeFile(wb, `reporte_${tipo}_${Date.now()}.xlsx`);
}

//=================================================================
// EXPORTAR EN EXCEL
//=================================================================
function exportarReporteExcel() {

    const tipo = document.getElementById('tipoReporte').value;
    const tipoFiltro = document.getElementById('filtroTipoReporte').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaReporte').value;

    const data = obtenerDatosReporte(
        tipo,
        tipoFiltro,
        categoriaFiltro
    );

    if (!data) {
        alert('No hay datos para exportar');
        return;
    }

    const wb = XLSX.utils.book_new();

    let wsData = [];

    switch (tipo) {

        case 'movimientos':

            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            wsData = [
                [
                    "Fecha",
                    "Producto",
                    "Tipo",
                    "Cantidad",
                    "Stock"
                ],

                ...data.map(m => [
                    m.fecha,
                    m.producto,
                    m.tipo,
                    m.cantidad,
                    m.stockActual
                ])
            ];
        break;

        case 'stock-bajo':

            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            wsData = [
                [
                    "Producto",
                    "Stock",
                    "Stock mínimo",
                    "Ubicación"
                ],

                ...data.map(p => [
                    p.nombre,
                    p.stock,
                    p.stockMinimo,
                    p.ubicacion
                ])
            ];
        break;

        case 'consumo':

            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            wsData = [
                [
                    "Producto",
                    "Consumo"
                ],

                ...data.map(i => [
                    i[0],
                    i[1]
                ])
            ];
        break;

        case 'valor-inventario':

            wsData = [
                [
                    "Categoría",
                    "Valor"
                ],

                [
                    "VALOR TOTAL",
                    data.totalValor
                ],

                ...Object.entries(data.valorCategoria)
                    .map(([categoria, valor]) => [
                        categoria,
                        valor
                    ])
            ];
        break;

        case 'por-tipo':

            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            wsData = [
                [
                    "Tipo",
                    "Stock"
                ],

                ...data.map(item => [
                    item[0],
                    item[1]
                ])
            ];
        break;

        case 'por-categoria':

            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            wsData = [
                [
                    "Categoría",
                    "Stock"
                ],

                ...data.map(item => [
                    item[0],
                    item[1]
                ])
            ];
        break;

        default:
            alert('Seleccione un reporte válido');
            return;
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Reporte"
    );

    XLSX.writeFile(
        wb,
        `reporte_${tipo}_${Date.now()}.xlsx`
    );
}
//=================================================================
// EXPORTAR EN PDF
//=================================================================
function exportarReportePDF() {

    const tipo = document.getElementById('tipoReporte').value;
    const tipoFiltro = document.getElementById('filtroTipoReporte').value;
    const categoriaFiltro = document.getElementById('filtroCategoriaReporte').value;

    const data = obtenerDatosReporte(tipo, tipoFiltro, categoriaFiltro);

    if (!data) {
        alert('No hay datos para exportar');
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    let body = [];
    let headers = [];

    switch (tipo) {

        case 'movimientos':
            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            headers = ["Fecha", "Producto", "Tipo", "Cantidad", "Stock"];
            body = data.map(m => [m.fecha, m.producto, m.tipo, m.cantidad, m.stockActual]);
        break;

        case 'stock-bajo':
            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            headers = ["Producto", "Stock", "Mínimo", "Ubicación"];
            body = data.map(p => [p.nombre, p.stock, p.stockMinimo, p.ubicacion]);
        break;

        case 'consumo':
            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            headers = ["Producto", "Consumo"];
            body = data.map(i => [i[0], i[1]]);
        break;

        case 'valor-inventario':

            headers = ["Categoría", "Valor"];
            body.push(["VALOR TOTAL", `$${data.totalValor.toLocaleString()}`]);

            Object.entries(data.valorCategoria)
                .forEach(([categoria, valor]) => {
                    body.push([categoria, `$${valor.toLocaleString()}`]);
                });
        break;

        case 'por-tipo':
            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            headers = ["Tipo", "Stock"];
            body = data.map(item => [item[0], item[1]]);
        break;

        case 'por-categoria':
            if (!data.length) {
                alert('No hay datos para exportar');
                return;
            }

            headers = ["Categoría", "Stock"];
            body = data.map(item => [item[0], item[1]]);
        break;

        default:
            alert('Seleccione un reporte válido');
            return;
    }

    doc.text(`REPORTE ${tipo.toUpperCase()}`, 14, 12);

    doc.autoTable({
        head: [headers],
        body: body,
        startY: 20,

        theme: 'grid',

        styles: {
            fontSize: 9,
            cellPadding: 2,
            overflow: 'linebreak',
            valign: 'middle'
        },

        margin: {
            left: 8,
            right: 8
        },

        tableWidth: 'auto'
    });

    doc.save(`reporte_${tipo}_${Date.now()}.pdf`);
}
//==================================================================================================================================
// EVENTOS REPORTES
//==================================================================================================================================
document.addEventListener('change', function(e) {
    console.log('🔄 Evento CHANGE:', e.target.id, e.target.value);
    if (e.target.id === 'tipoReporte') {
        console.log('🎯 Cambio en tipoReporte, verificando en 300ms...');
        setTimeout(verificarReporteSeleccionado, 300);
    }
});
