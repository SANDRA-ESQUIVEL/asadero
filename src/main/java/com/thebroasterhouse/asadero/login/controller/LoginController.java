package com.thebroasterhouse.asadero.login.controller;

import com.thebroasterhouse.asadero.login.repository.LoginRepository;
import com.thebroasterhouse.asadero.usuarios.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private LoginRepository loginRepository;

    // LOGIN - Validar usuario y contraseña
    @GetMapping("/login/{idEmpleado}/{password}")
    public ResponseEntity<Usuario> login(
            @PathVariable String idEmpleado, 
            @PathVariable String password) {
        
        Optional<Usuario> usuario = loginRepository.findByIdEmpleado(idEmpleado);
        
        if (usuario.isPresent() && usuario.get().getPassword().equals(password)) {
            return ResponseEntity.ok(usuario.get());
        }
        
        return ResponseEntity.notFound().build();
    }

    // RECUPERAR CONTRASEÑA - Buscar por ID empleado
    @GetMapping("/recuperar/{idEmpleado}")
    public ResponseEntity<Usuario> recuperar(@PathVariable String idEmpleado) {
        
        Optional<Usuario> usuario = loginRepository.findByIdEmpleado(idEmpleado);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        }
        
        return ResponseEntity.notFound().build();
    }
}