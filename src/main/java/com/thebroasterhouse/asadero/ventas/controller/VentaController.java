package com.thebroasterhouse.asadero.ventas.controller;

import com.thebroasterhouse.asadero.ventas.dto.VentaDTO;
import com.thebroasterhouse.asadero.ventas.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {
    
    @Autowired
    private VentaService ventaService;
    
    @GetMapping
    public List<VentaDTO> getAllVentas() {
        return ventaService.getAllVentas();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VentaDTO> getVentaById(@PathVariable Long id) {
        return ventaService.getVentaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public VentaDTO createVenta(@RequestBody VentaDTO dto) {
        return ventaService.createVenta(dto);
    }
    
    @PatchMapping("/{idVenta}/estado")
    public ResponseEntity<VentaDTO> updateEstado(
            @PathVariable String idVenta,
            @RequestBody Map<String, String> datos) {
        String estadoPago = datos.get("estadoPago");
        String estadoPedido = datos.get("estadoPedido");
        return ventaService.updateEstado(idVenta, estadoPago, estadoPedido)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}