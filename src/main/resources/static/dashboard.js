//=================================================================
// VARIABLE GLOBAL DASHBOARD
//=================================================================
let ventasDashboard = [];


//==================================================================================================================================
// FUNCIÓN PARA ABRIR MODAL DASHBOARD
//==================================================================================================================================
function abrirDashboard() {
    abrirModalDesdeArchivo('/html_modales/dashboard/dashboard.html', 'modalDashboard');
    setTimeout(() => {
        cargarDashboard();
    }, 300);
}


//==================================================================================================================================
// OBTENER FECHA LOCAL YYYY-MM-DD
//==================================================================================================================================
function obtenerFechaLocal() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
}


//==================================================================================================================================
// FUNCIÓN PARA CARGAR DASHBOARD
//==================================================================================================================================
function cargarDashboard() {
    
    fetch('http://localhost:8080/api/ventas')
    .then(response => response.json())
    .then(ventas => {
        ventasDashboard = ventas;
        
        const hoy = obtenerFechaLocal();
        
        const ventasHoy = ventas.filter(venta => {
            if (!venta.fecha) return false;

            const fechaVenta = String(venta.fecha).split('T')[0];
            return fechaVenta === hoy;
        });
        
        const totalHoy = ventasHoy.reduce((acum, venta) => {
            return acum + Number(venta.total || 0);
        }, 0);
        
        const pedidosHoy = ventasHoy.length;
        
        const pedidosPendientes = ventas.filter(venta => {
            return venta.estadoPedido === 'PENDIENTE' || 
                   venta.estadoPedido === 'EN PREPARACIÓN' || 
                   venta.estadoPedido === 'EN CAMINO';
        }).length;
        
        const canceladasHoy = ventas.filter(venta => {
            const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
            return fechaVenta === hoy && venta.estadoPedido === 'CANCELADO';
        }).length;
        
        document.getElementById('ventasHoy').textContent = `$${totalHoy.toLocaleString('es-CO')}`;
        document.getElementById('pedidosHoy').textContent = pedidosHoy;
        document.getElementById('pendientesHoy').textContent = pedidosPendientes;
        document.getElementById('canceladasHoy').textContent = canceladasHoy;
        
        cargarProductosVendidos();
    })
    .catch(error => {
        console.error('Error cargando ventas:', error);
    });
}


//=================================================================
//FUNCIÓN PARA CARGAR TABLA DE PRODUCTOS MAS VENDIDOS
//=================================================================
function cargarProductosVendidos(tipo = 'hoy') {
    
    let listaVentas = ventasDashboard;
    
    if (tipo === 'hoy') {
        const hoy = obtenerFechaLocal();
        listaVentas = ventasDashboard.filter(venta => {
            const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];
            return fechaVenta === hoy;
        });
    }
    
    const conteo = {};
    
    listaVentas.forEach(venta => {
        if (!Array.isArray(venta.detalle)) return;
        
        venta.detalle.forEach(item => {
            const nombre = item.productoNombre;
            if (!conteo[nombre]) {
                conteo[nombre] = 0;
            }
            conteo[nombre] += Number(item.cantidad);
        });
    });
    
    const tbody = document.getElementById('bodyProductosDashboard');
    tbody.innerHTML = '';
    
    const productosOrdenados = Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    if (productosOrdenados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2">No hay productos</td></tr>';
        return;
    }
    
    productosOrdenados.forEach(([nombre, cantidad]) => {
        tbody.innerHTML += `
            <tr>
                <td>${nombre}</td>
                <td>${cantidad}</td>
            </tr>
        `;
    });
}


//=================================================================
// CARGA INICIAL
//=================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('modalDashboard')) {
        cargarDashboard();
    }
});