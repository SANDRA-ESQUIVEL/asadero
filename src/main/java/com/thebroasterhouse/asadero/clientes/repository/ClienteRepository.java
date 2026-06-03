package com.thebroasterhouse.asadero.clientes.repository;

import com.thebroasterhouse.asadero.clientes.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByIdCliente(String idCliente);
    boolean existsByNumeroDocumento(String numeroDocumento);
}