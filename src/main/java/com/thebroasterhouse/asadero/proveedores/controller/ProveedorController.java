package com.thebroasterhouse.asadero.proveedores.controller;

import com.thebroasterhouse.asadero.proveedores.dto.ProveedorDTO;
import com.thebroasterhouse.asadero.proveedores.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {
    
    @Autowired
    private ProveedorService proveedorService;
    
    @GetMapping
    public List<ProveedorDTO> getAllProveedores() {
        return proveedorService.getAllProveedores();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProveedorDTO> getProveedorById(@PathVariable Long id) {
        return proveedorService.getProveedorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ProveedorDTO createProveedor(@RequestBody ProveedorDTO dto) {
        return proveedorService.createProveedor(dto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProveedorDTO> updateProveedor(@PathVariable Long id, @RequestBody ProveedorDTO dto) {
        return proveedorService.updateProveedor(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ProveedorDTO> updateEstado(@PathVariable Long id, @RequestBody Map<String, Boolean> datos) {
        Boolean activo = datos.get("activo");
        return proveedorService.updateEstado(id, activo != null ? activo : true)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProveedor(@PathVariable Long id) {
        if (proveedorService.deleteProveedor(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}