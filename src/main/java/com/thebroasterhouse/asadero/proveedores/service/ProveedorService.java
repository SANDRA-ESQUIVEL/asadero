package com.thebroasterhouse.asadero.proveedores.service;

import com.thebroasterhouse.asadero.proveedores.dto.ProveedorDTO;
import com.thebroasterhouse.asadero.proveedores.model.Proveedor;
import com.thebroasterhouse.asadero.proveedores.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProveedorService {
    
    @Autowired
    private ProveedorRepository proveedorRepository;
    
    public List<ProveedorDTO> getAllProveedores() {
        return proveedorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<ProveedorDTO> getProveedorById(Long id) {
        return proveedorRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public ProveedorDTO createProveedor(ProveedorDTO dto) {
        Proveedor proveedor = convertToEntity(dto);
        proveedor.setIdProveedor(generarIdProveedor());
        proveedor.setFechaRegistro(LocalDateTime.now());
        proveedor = proveedorRepository.save(proveedor);
        return convertToDTO(proveedor);
    }
    
    public Optional<ProveedorDTO> updateProveedor(Long id, ProveedorDTO dto) {
        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setNombre(dto.getNombre());
                    proveedor.setTipoProveedor(dto.getTipoProveedor());
                    proveedor.setRazonSocial(dto.getRazonSocial());
                    proveedor.setTipoNit(dto.getTipoNit());
                    proveedor.setNit(dto.getNit());
                    proveedor.setTelefono(dto.getTelefono());
                    proveedor.setDireccion(dto.getDireccion());
                    proveedor.setEmail(dto.getEmail());
                    proveedor.setFechaModificacion(LocalDateTime.now());
                    proveedorRepository.save(proveedor);
                    return convertToDTO(proveedor);
                });
    }
    
    public Optional<ProveedorDTO> updateEstado(Long id, boolean activo) {
        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setActivo(activo);
                    proveedor.setFechaModificacion(LocalDateTime.now());
                    proveedorRepository.save(proveedor);
                    return convertToDTO(proveedor);
                });
    }
    
    public boolean deleteProveedor(Long id) {
        if (proveedorRepository.existsById(id)) {
            proveedorRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private String generarIdProveedor() {
        long count = proveedorRepository.count();
        return "PROV" + String.format("%03d", count + 1);
    }
    
    private ProveedorDTO convertToDTO(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setId(proveedor.getId());
        dto.setIdProveedor(proveedor.getIdProveedor());
        dto.setNombre(proveedor.getNombre());
        dto.setTipoProveedor(proveedor.getTipoProveedor());
        dto.setRazonSocial(proveedor.getRazonSocial());
        dto.setTipoNit(proveedor.getTipoNit());
        dto.setNit(proveedor.getNit());
        dto.setTelefono(proveedor.getTelefono());
        dto.setDireccion(proveedor.getDireccion());
        dto.setEmail(proveedor.getEmail());
        dto.setActivo(proveedor.isActivo());
        dto.setFechaRegistro(proveedor.getFechaRegistro());
        dto.setFechaModificacion(proveedor.getFechaModificacion());
        return dto;
    }
    
    private Proveedor convertToEntity(ProveedorDTO dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(dto.getNombre());
        proveedor.setTipoProveedor(dto.getTipoProveedor());
        proveedor.setRazonSocial(dto.getRazonSocial());
        proveedor.setTipoNit(dto.getTipoNit());
        proveedor.setNit(dto.getNit());
        proveedor.setTelefono(dto.getTelefono());
        proveedor.setDireccion(dto.getDireccion());
        proveedor.setEmail(dto.getEmail());
        return proveedor;
    }
}