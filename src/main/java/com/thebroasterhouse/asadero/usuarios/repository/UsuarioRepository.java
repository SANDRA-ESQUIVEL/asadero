package com.thebroasterhouse.asadero.usuarios.repository;

import com.thebroasterhouse.asadero.usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByIdEmpleado(String idEmpleado);
    Optional<Usuario> findByNumeroDocumento(String numeroDocumento);
    boolean existsByIdEmpleado(String idEmpleado);
}