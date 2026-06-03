package com.thebroasterhouse.asadero.proveedores.repository;

import com.thebroasterhouse.asadero.proveedores.model.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    Optional<Proveedor> findByIdProveedor(String idProveedor);
    boolean existsByNit(String nit);
}