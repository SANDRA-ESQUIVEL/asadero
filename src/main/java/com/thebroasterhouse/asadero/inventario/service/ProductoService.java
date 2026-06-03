package com.thebroasterhouse.asadero.inventario.service;

import com.thebroasterhouse.asadero.inventario.model.Producto;
import com.thebroasterhouse.asadero.inventario.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }
    
    public Optional<Producto> getProductoByCodigo(String codigo) {
        return productoRepository.findByCodigoProducto(codigo);
    }
    
    public Producto createProducto(Producto producto) {
        // Generar código automático si no existe
        if (producto.getCodigoProducto() == null || producto.getCodigoProducto().isEmpty()) {
            long count = productoRepository.count();
            producto.setCodigoProducto("PROD" + String.format("%03d", count + 1));
        }
        return productoRepository.save(producto);
    }
    
    public Optional<Producto> updateProducto(String codigo, Producto producto) {
        return productoRepository.findByCodigoProducto(codigo)
                .map(p -> {
                    p.setNombreProducto(producto.getNombreProducto());
                    p.setOtroNombreProducto(producto.getOtroNombreProducto());
                    p.setTipoProducto(producto.getTipoProducto());
                    p.setCategoriaProducto(producto.getCategoriaProducto());
                    p.setPrecioVenta(producto.getPrecioVenta());
                    p.setCostoCompra(producto.getCostoCompra());
                    p.setUbicacion(producto.getUbicacion());
                    p.setStockInicial(producto.getStockInicial());
                    p.setStockMinimo(producto.getStockMinimo());
                    p.setUnidadMedida(producto.getUnidadMedida());
                    p.setProveedor(producto.getProveedor());
                    p.setDescripcion(producto.getDescripcion());
                    p.setEstado(producto.getEstado());
                    return productoRepository.save(p);
                });
    }
    
    public Optional<Producto> updateStock(String codigo, Integer nuevoStock) {
        return productoRepository.findByCodigoProducto(codigo)
                .map(p -> {
                    p.setStockInicial(nuevoStock);
                    return productoRepository.save(p);
                });
    }
    
    public Optional<Producto> deleteProducto(String codigo) {
        return productoRepository.findByCodigoProducto(codigo)
                .map(p -> {
                    p.setEstado("Inactivo");
                    return productoRepository.save(p);
                });
    }
}