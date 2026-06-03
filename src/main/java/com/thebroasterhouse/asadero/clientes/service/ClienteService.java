package com.thebroasterhouse.asadero.clientes.service;

import com.thebroasterhouse.asadero.clientes.dto.ClienteDTO;
import com.thebroasterhouse.asadero.clientes.model.Cliente;
import com.thebroasterhouse.asadero.clientes.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<ClienteDTO> getAllClientes() {
        return clienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<ClienteDTO> getClienteById(Long id) {
        return clienteRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public ClienteDTO createCliente(ClienteDTO clienteDTO) {
        Cliente cliente = convertToEntity(clienteDTO);
        cliente.setIdCliente(generarIdCliente());
        cliente.setFechaRegistro(LocalDateTime.now());
        cliente = clienteRepository.save(cliente);
        return convertToDTO(cliente);
    }
    
    public Optional<ClienteDTO> updateCliente(Long id, ClienteDTO clienteDTO) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setNombres(clienteDTO.getNombres());
                    cliente.setApellidos(clienteDTO.getApellidos());
                    cliente.setTipoDocumento(clienteDTO.getTipoDocumento());
                    cliente.setNumeroDocumento(clienteDTO.getNumeroDocumento());
                    cliente.setEmail(clienteDTO.getEmail());
                    cliente.setDireccion(clienteDTO.getDireccion());
                    cliente.setTelefono(clienteDTO.getTelefono());
                    cliente.setFechaModificacion(LocalDateTime.now());
                    clienteRepository.save(cliente);
                    return convertToDTO(cliente);
                });
    }
    
    public Optional<ClienteDTO> updateEstado(Long id, boolean activo) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    cliente.setActivo(activo);
                    cliente.setFechaModificacion(LocalDateTime.now());
                    clienteRepository.save(cliente);
                    return convertToDTO(cliente);
                });
    }
    
    public boolean deleteCliente(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private String generarIdCliente() {
        long count = clienteRepository.count();
        return "CLI" + String.format("%04d", count + 1);
    }
    
    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setIdCliente(cliente.getIdCliente());
        dto.setNombres(cliente.getNombres());
        dto.setApellidos(cliente.getApellidos());
        dto.setTipoDocumento(cliente.getTipoDocumento());
        dto.setNumeroDocumento(cliente.getNumeroDocumento());
        dto.setEmail(cliente.getEmail());
        dto.setDireccion(cliente.getDireccion());
        dto.setTelefono(cliente.getTelefono());
        dto.setActivo(cliente.isActivo());
        dto.setFechaRegistro(cliente.getFechaRegistro());
        dto.setFechaModificacion(cliente.getFechaModificacion());
        return dto;
    }
    
    private Cliente convertToEntity(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombres(dto.getNombres());
        cliente.setApellidos(dto.getApellidos());
        cliente.setTipoDocumento(dto.getTipoDocumento());
        cliente.setNumeroDocumento(dto.getNumeroDocumento());
        cliente.setEmail(dto.getEmail());
        cliente.setDireccion(dto.getDireccion());
        cliente.setTelefono(dto.getTelefono());
        return cliente;
    }
}