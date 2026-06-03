package com.thebroasterhouse.asadero.usuarios.controller;

import com.thebroasterhouse.asadero.usuarios.dto.UsuarioDTO;
import com.thebroasterhouse.asadero.usuarios.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    // GET - Listar todos
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }
    
    // GET - Por ID
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable Long id) {
        Optional<UsuarioDTO> usuario = usuarioService.getUsuarioById(id);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    // POST - Crear
    @PostMapping
    public ResponseEntity<UsuarioDTO> createUsuario(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO created = usuarioService.createUsuario(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    // PUT - Actualizar
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioDTO usuarioDTO) {
        Optional<UsuarioDTO> updated = usuarioService.updateUsuario(id, usuarioDTO);
        return updated.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    // DELETE - Eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (usuarioService.deleteUsuario(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<UsuarioDTO> actualizarEstadoUsuario(
            @PathVariable Long id, 
            @RequestBody Map<String, Object> datos) {
        
        Optional<UsuarioDTO> actualizado = usuarioService.actualizarEstadoUsuario(id, datos);
        return actualizado.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }
}