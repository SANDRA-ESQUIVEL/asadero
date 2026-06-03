package com.thebroasterhouse.asadero.inventario.controller;

import com.thebroasterhouse.asadero.inventario.model.Producto;
import com.thebroasterhouse.asadero.inventario.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }
    
    @GetMapping("/{codigo}")
    public ResponseEntity<Producto> getProductoByCodigo(@PathVariable String codigo) {
        return productoService.getProductoByCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.createProducto(producto);
    }
    
    @PutMapping("/{codigo}")
    public ResponseEntity<Producto> updateProducto(
            @PathVariable String codigo,
            @RequestBody Producto producto) {
        return productoService.updateProducto(codigo, producto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{codigo}/stock")
    public ResponseEntity<Producto> updateStock(
            @PathVariable String codigo,
            @RequestBody Map<String, Integer> data) {
        Integer stock = data.get("stockInicial");
        return productoService.updateStock(codigo, stock)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Producto> deleteProducto(@PathVariable String codigo) {
        return productoService.deleteProducto(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}