package com.thebroasterhouse.asadero.inventario.repository;

import com.thebroasterhouse.asadero.inventario.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductoRepository
        extends JpaRepository<Producto, Long> {

    Optional<Producto> findByCodigoProducto(String codigoProducto);
}
