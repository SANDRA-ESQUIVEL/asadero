// =============================
// VARIABLES GLOBALES INVENTARIO
// =============================
let productoSeleccionado = null;
// ============================================================================================================
// PARA REGISTRO DE PRODUCTOS
// ============================================================================================================
// GENERAR ID PARA PRODUCTO
function generarIdProducto() {

    let contador = localStorage.getItem("contadorProductos");

        if (!contador) {
            contador = 1;
        } else {
            contador = parseInt(contador) + 1;
        }

    localStorage.setItem("contadorProductos", contador);

    // Formato del cogigo o ID 
    return "Prod-" + new Date().getFullYear() + "-" + String(contador).padStart(3, "0");
}

// =============================
// REGISTRAR PRODUCTO
// =============================
function iniciarRegistroProducto() {

    // ID del producto
    const campoId = document.getElementById("codigoProducto");
        if (campoId) {
            campoId.value = generarIdProducto();
        }

    // para la seleccion del nomnbre del producto
    const selectProducto = document.getElementById("nombreProducto");
        if (selectProducto) {
            selectProducto.selectedIndex = 0; // selecciona producto
            selectProducto.dispatchEvent(new Event("change")); // llena los campos automáticos
        }

    // para llamar el formulario se llama con el id= fromRegistroProducto
    const form = document.getElementById("formRegistroProducto");
    if (!form) return;
    
    form.onsubmit = function(e) {
        e.preventDefault();

        if (!validarCamposVacios(form)) {
            alert("⚠️ Debes llenar todos los campos antes de continuar.");
            return;
        }

        const producto = {
            id: document.getElementById("codigoProducto").value,
            nombre: document.getElementById("nombreProducto").value,
            categoria: document.getElementById("categoriaProducto").value,
            tipo: document.getElementById("tipoProducto").value,            
            unidad: document.getElementById("unidadMedida").value,
            proveedor: document.getElementById("proveedorProducto").value,
            precioCompraBase: parseFloat(document.getElementById("precioUnitarioCompra").value),
            precioVentaBase: parseFloat(document.getElementById("precioUnitarioVenta").value),
            ubicacion: document.getElementById("ubicacionProducto").value,
            stockInicial: 0,
            stockMinimo: parseInt(document.getElementById("stockMinimoProducto").value)
        };
           
        let productos = JSON.parse(localStorage.getItem("productos")) || [];

        // Validar id y nombre
        const existe = productos.some(p => 
            p.id === producto.id || 
            p.nombre.toLowerCase() === producto.nombre.toLowerCase()
        );

        if (existe) {
            alert("⚠️ Este producto ya está registrado");
            return;
        }

        productos.push(producto);

        localStorage.setItem("productos", JSON.stringify(productos));

        alert("✅ Producto creado correctamente");
       
        form.reset(); // limpia formulario
        document.getElementById("codigoProducto").value = generarIdProducto(); // nuevo ID
        cancelarProceso("modalRegistroProducto"); // cerrar modal
    }
    
    // DATOS PREDEFINIDOS
    const productosData = {
        "Pollo": {
            categoria: "Alimentos",
            tipo: "Materia prima",
            unidad: "Presa",
            ubicacion: "Nevera 1",
            precioVenta: 15000,
            stockMinimo: 5,
            
            precioCompraBase: 8000,
            precioVentaBase: 15000
        },
        "Costillas": {
            categoria: "Alimentos",
            tipo: "Materia prima",
            unidad: "Porción",
            ubicacion: "Nevera 2",
            precioVenta: 18000,
            stockMinimo: 3,
            
            precioCompraBase: 10000,
            precioVentaBase: 18000
        },
        "Gaseosa": {
            categoria: "Bebidas",
            tipo: "Producto preparado",
            unidad: "Botella",
            ubicacion: "Nevera 3",
            precioVenta: 5000,
            stockMinimo: 10,
            
            precioCompraBase: 2000,
            precioVentaBase: 5000
        }
    };

//Detecta que producto se eligio y llena los campos de autocompletado
const nombreProducto = document.getElementById("nombreProducto");

    if (nombreProducto) {

        nombreProducto.onchange = function () {

            const data = productosData[this.value];

            if (data) {
                document.getElementById("categoriaProducto").value = data.categoria;
                document.getElementById("tipoProducto").value = data.tipo;
                document.getElementById("unidadMedida").value = data.unidad;
                document.getElementById("ubicacionProducto").value = data.ubicacion;
                document.getElementById("precioUnitarioVenta").value = data.precioVenta;
                document.getElementById("stockMinimoProducto").value = data.stockMinimo;

            }
        };

        // Fuerza la carga automatica de los campos
        nombreProducto.dispatchEvent(new Event("change"));
    }
}


// ============================================================================================================
// PARA MOVIMIENTOS DE INVENTARIO - ENTRADAS - SALIDAS
// ============================================================================================================
// MODAL ENTRADAS= GENERAR ID PARA LA ENTRADA DE PRODUCTOS
function generarIdEntrada() {

    let contador = localStorage.getItem("contadorEntradas") || 0;
    contador++;

    localStorage.setItem("contadorEntradas", contador);

    return "E-" + new Date().getFullYear() + "-" + String(contador).padStart(3, "0");
}

//MODAL SALIDAS= GENERAR ID PARA LA SALIDA DE PRODUCTOS
function generarIdSalida() {

    let contador = localStorage.getItem("contadorSalidas") || 0;
    contador++;

    localStorage.setItem("contadorSalidas", contador);

    return "S-" + new Date().getFullYear() + "-" + String(contador).padStart(3, "0");
}

//Suma todas las entradas
function calcularEntradas(productoId) {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    return movimientos
        .filter(m => m.productoId === productoId && m.tipo === "entrada")
        .reduce((sum, m) => sum + m.cantidad, 0);
}

//Suma todas las salidas
function calcularSalidas(productoId) {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
    return movimientos
        .filter(m => m.productoId === productoId && m.tipo === "salida")
        .reduce((sum, m) => sum + m.cantidad, 0);
}

//Formula: stock inicial + Entradas - Salidas
function calcularStock(productoId) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id === productoId);

    if (!producto) return 0;

    // Reutilizamos tus funciones que ya funcionan perfecto
    const entradas = calcularEntradas(productoId);
    const salidas = calcularSalidas(productoId);

    return (producto.stockInicial || 0) + entradas - salidas;
}

// Para registrar Movimientos del inventario
function registrarMovimiento(fecha, producto, tipo, cantidad, precio, idMovimiento, fechaVencimiento = null) {
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    const nuevoMovimiento = {
        idMovimiento: idMovimiento,
        productoId: producto.id,
        nombre: producto.nombre,
        tipo: tipo,
        cantidad: cantidad,
        precio: precio,
        fecha: fecha,
        fechaVencimiento: fechaVencimiento 
    };

        // 👇 guardar precio según tipo
        if (tipo === "entrada") {
            nuevoMovimiento.precioCompra = precio;
        }

        if (tipo === "salida") {
            nuevoMovimiento.precioVenta = precio;
        }

    movimientos.push(nuevoMovimiento);

    localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

//===========================================
//FUNCIONES DE APERTURA
//===========================================
//Abrir modal para la Entrada de productos al inventario
function abrirEntrada(id) {
    productoSeleccionado = id;

    abrirModalDesdeArchivo(
        '/html_modales/inventario/entrada_inventario.html',
        'modalEntradaInventario'
    );

    setTimeout(() => {
        cargarDatosEntrada();
    }, 100);
}

//Abrir modal para la Salida de productos al inventario
function abrirSalida(id) {
    productoSeleccionado = id;

    abrirModalDesdeArchivo(
        '/html_modales/inventario/salida_inventario.html',
        'modalSalidaInventario'
    );

    setTimeout(() => {
        cargarDatosSalida();
    }, 100);
}

//===========================================
//FUNCIONES PARA CARGAR DATOS
//===========================================
// PARA MODAL ENTRADA_INVENTARIO= CARGAR DATOS ENTRANTES INVENTARIO
function cargarDatosEntrada() {
    // Función interna para actualizar la fecha y hora
    const actualizarReloj = () => {
        const ahora = new Date();

    const dia = String(ahora.getDate()).padStart(2, "0");
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const año = ahora.getFullYear();

    const horas = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");

    const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;

    const campo = document.getElementById("fechaIngreso");
    if (campo) campo.value = fechaFormateada;
};

    actualizarReloj();
    window.relojEntrada = setInterval(actualizarReloj, 1000);//Guarda la fecha y hora en que se realizo la entrada de producto

        //ID Entrada
        const campoIdEntrada = document.getElementById("codigoEntrada");
            if (campoIdEntrada) {
                campoIdEntrada.value = generarIdEntrada();
            }

        const campoCantidad = document.getElementById("cantidadEntrada");
        if (campoCantidad) {
            campoCantidad.value = "";
        }

        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        let producto = productos.find(p => p.id === productoSeleccionado);

        const campoProducto = document.getElementById("productoEntrada");
        if (producto && campoProducto) {
            campoProducto.value = producto.nombre;
        }

        const campofechaVencimiento = document.getElementById("fechaVencimiento");

                if (campofechaVencimiento) {
                    campofechaVencimiento.disabled = false; 
                    campofechaVencimiento.value = "";                    
                }

    iniciarGuardarEntrada();
}

// PARA MODAL SALIDA_INVENTARIO= CARGAR DATOS SALIENTES INVENTARIO
function cargarDatosSalida() {
    const actualizarRelojSalida = () => {
        const ahora = new Date();

        const dia = String(ahora.getDate()).padStart(2, "0");
        const mes = String(ahora.getMonth() + 1).padStart(2, "0");
        const año = ahora.getFullYear();

        const horas = String(ahora.getHours()).padStart(2, "0");
        const minutos = String(ahora.getMinutes()).padStart(2, "0");
        const segundos = String(ahora.getSeconds()).padStart(2, "0");

        const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;

        const campo = document.getElementById("fechaSalida");
        if (campo) campo.value = fechaFormateada;
    };

    actualizarRelojSalida();
    window.relojSalida = setInterval(actualizarRelojSalida, 1000);

    
    //ID Salida
    const campoIdSalida = document.getElementById("codigoSalida");
        if (campoIdSalida) {
            campoIdSalida.value = generarIdSalida();
        }

    document.getElementById("cantidadSalida").value = "";

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id === productoSeleccionado);

        if (producto) {
            document.getElementById("productoSalida").value = producto.nombre;
        }

    iniciarGuardarSalida();
}

// PARA LA ENTRADA DE PRODUCTOS
function iniciarGuardarEntrada() {   
    const form = document.getElementById("formEntradaInventario");

    if (!form) {
        console.warn("Esperando a que el formulario de entrada cargue...");
        return; 
    }

    form.onsubmit = function(e) {
        e.preventDefault();

        if (window.relojEntrada) {
            clearInterval(window.relojEntrada);
        }

        const idE = document.getElementById("codigoEntrada");
        const fechaGuardada = document.getElementById("fechaIngreso").value;
        const cantE = document.getElementById("cantidadEntrada");
        const precE = document.getElementById("precioEntrada");
        const fechaVen = document.getElementById("fechaVencimiento");

        if (!idE || !cantE || !precE) {
            alert("Error: No se encontraron los campos del formulario.");
            return;
        }
        
        if (!fechaGuardada) {
            alert("Error con la fecha");
            return;
        }

        let idEntrada = idE.value;
        let cantidad = parseInt(cantE.value);
        let precio = parseFloat(precE.value);
        let fVencimiento = fechaVen.value;

            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Cantidad inválida");
                return;
            }

            if (isNaN(precio) || precio <= 0) {
                alert("Precio inválido");
                return;
            }

        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        let producto = productos.find(p => p.id === productoSeleccionado);

            if (!producto) {
                alert("Producto no encontrado");
                return;
            }
         
        registrarMovimiento(fechaGuardada, producto, "entrada", cantidad, precio, idEntrada, fVencimiento);

        alert("Entrada " + idEntrada + " registrada correctamente");

        cerrarModal('modalEntradaInventario');
        
        setTimeout(() => {
            cargarInventario();
        }, 100);
    }
}

// PARA LA SALIDA DE PRODUCTOS
function iniciarGuardarSalida() {
    const form = document.getElementById("formSalidaInventario");

    form.onsubmit = function(e) {
        e.preventDefault();

        if (window.relojSalida) {
            clearInterval(window.relojSalida);
        }


        let idSalida = document.getElementById("codigoSalida").value;
        let fechaSalida = document.getElementById("fechaSalida").value;
        let cantidad = parseInt(document.getElementById("cantidadSalida").value);
        let precio = parseFloat(document.getElementById("precioSalida").value);

            if (isNaN(cantidad) || cantidad <= 0) {
                alert("Cantidad inválida");
                return;
            }
            
            if (isNaN(precio) || precio <= 0) {
                alert("Precio inválido");
                return;
            }

        let productos = JSON.parse(localStorage.getItem("productos")) || [];
        let producto = productos.find(p => p.id === productoSeleccionado);

            if (!producto) {
                alert("Producto no encontrado");
                return;
            }

        let stockActual = calcularStock(producto.id);
            
            if (cantidad > stockActual) {
                alert("No hay suficiente stock. Disponible: " + stockActual);
                return;
            }         

        registrarMovimiento(fechaSalida, producto, "salida", cantidad, precio, idSalida, null);

        alert("Salida registrada con ID: " + idSalida);

        cerrarModal('modalSalidaInventario');

        setTimeout(() => {
            cargarInventario();
        }, 100);

    }
};



//Para la tabla de inventario
function cargarInventario() {
    const tbody = document.getElementById("bodyInventario");
    if (!tbody) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    tbody.innerHTML = "";

    productos.forEach(producto => {

        const movsProducto = movimientos.filter(m => m.productoId === producto.id);

        const ultimoMov = movsProducto.length > 0 ? movsProducto[movsProducto.length - 1] : null;
        const ultimoID = ultimoMov ? ultimoMov.idMovimiento : '---';

        const ultimaEntrada = [...movsProducto].reverse().find(m => m.tipo === "entrada");
        const ultimaSalida = [...movsProducto].reverse().find(m => m.tipo === "salida");

        const entradas = calcularEntradas(producto.id);
        const salidas = calcularSalidas(producto.id);
        const total = calcularStock(producto.id);

        const fechaE = ultimaEntrada ? ultimaEntrada.fecha.split('T')[0] : '-';
        const fechaS = ultimaSalida ? ultimaSalida.fecha.split('T')[0] : '-';
        const fechaV = ultimaEntrada && ultimaEntrada.fechaVencimiento ? ultimaEntrada.fechaVencimiento : '-';

        const estado = total <= producto.stockMinimo ? "⚠️ Bajo" : "✅ Normal";

        const fila = `
            <tr>
                <td>${producto.id}</td>
                <td>${ultimoID}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.tipo}</td>
                <td>${producto.unidad}</td>
                <td>${producto.stockInicial}</td>
                <td style="color: green; font-weight: bold;">${entradas}</td>
                <td>${fechaE}</td>
                <td style="color: red; font-weight: bold;">${salidas}</td>
                <td>${fechaS}</td>                
                <td>${total}</td>
                <td>${producto.stockMinimo}</td>
                <td>${fechaV}</td>                
                <td>${estado}</td>
                <td>
                    <button onclick="abrirEntrada('${producto.id}')">➕</button>
                    <button onclick="abrirSalida('${producto.id}')">➖</button>
                    <button onclick="eliminarProducto('${producto.id}')">🗑️</button>
                </td>
            </tr>
        `;

        tbody.innerHTML += fila;
    });
}

//Para Eliminar el Producto del inventario
function eliminarProducto(id) {
    const confirmar = confirm("¿Estás segura de eliminar este producto? Se borrará también todo su historial de entradas y salidas.");

        if (!confirmar) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

    let productosFiltrados = productos.filter(p => p.id !== id);
    let movimientosFiltrados = movimientos.filter(m => m.productoId !== id);

    localStorage.setItem("productos", JSON.stringify(productosFiltrados));
    localStorage.setItem("movimientos", JSON.stringify(movimientosFiltrados));

    alert("🗑️ Producto e historial eliminados correctamente");

    cargarInventario();
}

//================================
//BUSCADOR DE INVENTARIO
//================================
document.addEventListener("input", function(e) {

    if (e.target.id === "buscarInventario") {

        const filtro = e.target.value.toLowerCase();
        const filas = document.querySelectorAll("#bodyInventario tr");

        filas.forEach(fila => {
            const texto = fila.textContent.toLowerCase();
            fila.style.display = texto.includes(filtro) ? "" : "none";
        });
    }

});
