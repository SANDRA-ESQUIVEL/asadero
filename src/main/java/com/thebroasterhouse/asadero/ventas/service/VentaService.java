package com.thebroasterhouse.asadero.ventas.service;

import com.thebroasterhouse.asadero.ventas.dto.DetalleVentaDTO;
import com.thebroasterhouse.asadero.ventas.dto.VentaDTO;
import com.thebroasterhouse.asadero.ventas.model.Venta;
import com.thebroasterhouse.asadero.ventas.repository.VentaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VentaService {
    
    @Autowired
    private VentaRepository ventaRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public List<VentaDTO> getAllVentas() {
        return ventaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<VentaDTO> getVentaById(Long id) {
        return ventaRepository.findById(id).map(this::convertToDTO);
    }
    
    public Optional<VentaDTO> getVentaByIdVenta(String idVenta) {
        return ventaRepository.findByIdVenta(idVenta).map(this::convertToDTO);
    }
    
    public VentaDTO createVenta(VentaDTO dto) {
        Venta venta = convertToEntity(dto);
        venta.setFecha(LocalDateTime.now());
        
        // Generar ID automático
        long count = ventaRepository.count();
        venta.setIdVenta("VTA" + String.format("%03d", count + 1));
        
        // Convertir detalle a JSON
        try {
            venta.setDetalle(objectMapper.writeValueAsString(dto.getDetalle()));
        } catch (JsonProcessingException e) {
            venta.setDetalle("[]");
        }
        
        // Convertir salsas a string
        if (dto.getSalsas() != null) {
            venta.setSalsas(String.join(",", dto.getSalsas()));
        }
        
        venta = ventaRepository.save(venta);
        return convertToDTO(venta);
    }
    
    public Optional<VentaDTO> updateEstado(String idVenta, String estadoPago, String estadoPedido) {
        return ventaRepository.findByIdVenta(idVenta)
                .map(venta -> {
                    if (estadoPago != null) venta.setEstadoPago(estadoPago);
                    if (estadoPedido != null) venta.setEstadoPedido(estadoPedido);
                    return convertToDTO(ventaRepository.save(venta));
                });
    }
    
    private VentaDTO convertToDTO(Venta venta) {
        VentaDTO dto = new VentaDTO();
        dto.setId(venta.getId());
        dto.setIdVenta(venta.getIdVenta());
        dto.setFecha(venta.getFecha());
        dto.setEmpleado(venta.getEmpleado());
        dto.setClienteId(venta.getClienteId());
        dto.setClienteNombre(venta.getClienteNombre());
        dto.setClienteDocumento(venta.getClienteDocumento());
        dto.setClienteTelefono(venta.getClienteTelefono());
        dto.setClienteCorreo(venta.getClienteCorreo());
        dto.setTipoPedido(venta.getTipoPedido());
        dto.setDireccionEntrega(venta.getDireccionEntrega());
        dto.setFormaPago(venta.getFormaPago());
        dto.setMonedaPago(venta.getMonedaPago());
        dto.setTasaDolar(venta.getTasaDolar());
        dto.setMontoRecibido(venta.getMontoRecibido());
        dto.setCambio(venta.getCambio());
        dto.setEstadoPago(venta.getEstadoPago());
        dto.setEstadoPedido(venta.getEstadoPedido());
        
        // Salsas
        if (venta.getSalsas() != null && !venta.getSalsas().isEmpty()) {
            dto.setSalsas(List.of(venta.getSalsas().split(",")));
        } else {
            dto.setSalsas(new ArrayList<>());
        }
        
        dto.setGuantes(venta.getGuantes());
        dto.setServilletas(venta.getServilletas());
        dto.setDesechables(venta.getDesechables());
        dto.setObservaciones(venta.getObservaciones());
        dto.setTotal(venta.getTotal());
        
        // Detalle
        try {
            List<DetalleVentaDTO> detalle = objectMapper.readValue(
                venta.getDetalle() != null ? venta.getDetalle() : "[]",
                new TypeReference<List<DetalleVentaDTO>>() {}
            );
            dto.setDetalle(detalle);
        } catch (JsonProcessingException e) {
            dto.setDetalle(new ArrayList<>());
        }
        
        return dto;
    }
    
    private Venta convertToEntity(VentaDTO dto) {
        Venta venta = new Venta();
        if (dto.getId() != null) {
            venta.setId(dto.getId());
        }
        venta.setIdVenta(dto.getIdVenta());
        venta.setEmpleado(dto.getEmpleado());
        venta.setClienteId(dto.getClienteId());
        venta.setClienteNombre(dto.getClienteNombre());
        venta.setClienteDocumento(dto.getClienteDocumento());
        venta.setClienteTelefono(dto.getClienteTelefono());
        venta.setClienteCorreo(dto.getClienteCorreo());
        venta.setTipoPedido(dto.getTipoPedido());
        venta.setDireccionEntrega(dto.getDireccionEntrega());
        venta.setFormaPago(dto.getFormaPago());
        venta.setMonedaPago(dto.getMonedaPago());
        venta.setTasaDolar(dto.getTasaDolar());
        venta.setMontoRecibido(dto.getMontoRecibido());
        venta.setCambio(dto.getCambio());
        venta.setEstadoPago(dto.getEstadoPago());
        venta.setEstadoPedido(dto.getEstadoPedido());
        venta.setGuantes(dto.getGuantes());
        venta.setServilletas(dto.getServilletas());
        venta.setDesechables(dto.getDesechables());
        venta.setObservaciones(dto.getObservaciones());
        venta.setTotal(dto.getTotal());
        return venta;
    }
}