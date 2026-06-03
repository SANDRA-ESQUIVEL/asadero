package com.thebroasterhouse.asadero.usuarios.service;

import com.thebroasterhouse.asadero.usuarios.dto.UsuarioDTO;
import com.thebroasterhouse.asadero.usuarios.model.Usuario;
import com.thebroasterhouse.asadero.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<UsuarioDTO> getUsuarioById(Long id) {
        return usuarioRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public UsuarioDTO createUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = convertToEntity(usuarioDTO);
        usuario.setFechaCreacion(LocalDateTime.now());
        usuario = usuarioRepository.save(usuario);
        return convertToDTO(usuario);
    }
    
    public Optional<UsuarioDTO> updateUsuario(Long id, UsuarioDTO usuarioDTO) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNombre(usuarioDTO.getNombre());
                    usuario.setApellido(usuarioDTO.getApellido());
                    usuario.setNumeroDocumento(usuarioDTO.getNumeroDocumento());
                    usuario.setTipoDocumento(usuarioDTO.getTipoDocumento());
                    usuario.setCorreoPersonal(usuarioDTO.getCorreoPersonal());
                    usuario.setTelefono(usuarioDTO.getTelefono());
                    usuario.setIdEmpleado(usuarioDTO.getIdEmpleado());
                    usuario.setPassword(usuarioDTO.getPassword());
                    usuario.setCorreoEmpresa(usuarioDTO.getCorreoEmpresa());
                    usuario.setRol(Usuario.Rol.valueOf(usuarioDTO.getRol()));
                    usuario.setPermisos(usuarioDTO.getPermisos());
                    usuario.setFechaModificacion(LocalDateTime.now());
                    usuarioRepository.save(usuario);
                    return convertToDTO(usuario);
                });
    }
    
    public boolean deleteUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public Optional<UsuarioDTO> actualizarEstadoUsuario(Long id, Map<String, Object> datos) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    Boolean activo = (Boolean) datos.get("activo");
                    usuario.setActivo(activo != null ? activo : usuario.isActivo());
                    usuario.setFechaModificacion(LocalDateTime.now());
                    usuarioRepository.save(usuario);
                    return convertToDTO(usuario);
                });
    }
    
    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setNumeroDocumento(usuario.getNumeroDocumento());
        dto.setTipoDocumento(usuario.getTipoDocumento());
        dto.setCorreoPersonal(usuario.getCorreoPersonal());
        dto.setTelefono(usuario.getTelefono());
        dto.setIdEmpleado(usuario.getIdEmpleado());
        dto.setPassword(usuario.getPassword());
        dto.setCorreoEmpresa(usuario.getCorreoEmpresa());
        dto.setRol(usuario.getRol().name());
        dto.setPermisos(usuario.getPermisos());
        dto.setFechaCreacion(usuario.getFechaCreacion());
        dto.setFechaModificacion(usuario.getFechaModificacion());
        dto.setActivo(usuario.isActivo());
        return dto;
    }
    
    private Usuario convertToEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setNumeroDocumento(dto.getNumeroDocumento());
        usuario.setTipoDocumento(dto.getTipoDocumento());
        usuario.setCorreoPersonal(dto.getCorreoPersonal());
        usuario.setTelefono(dto.getTelefono());
        usuario.setIdEmpleado(dto.getIdEmpleado());
        usuario.setPassword(dto.getPassword());
        usuario.setCorreoEmpresa(dto.getCorreoEmpresa());
        usuario.setRol(Usuario.Rol.valueOf(dto.getRol()));
        usuario.setPermisos(dto.getPermisos());
        return usuario;
    }
}