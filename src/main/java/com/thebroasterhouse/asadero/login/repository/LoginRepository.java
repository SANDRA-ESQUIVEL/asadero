package com.thebroasterhouse.asadero.login.repository;

import com.thebroasterhouse.asadero.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByIdEmpleado(String idEmpleado);
    
    Optional<Usuario> findByCorreoEmpresa(String correoEmpresa);
}