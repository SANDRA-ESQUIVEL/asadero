package com.thebroasterhouse.asadero.ventas.repository;

import com.thebroasterhouse.asadero.ventas.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    Optional<Venta> findByIdVenta(String idVenta);
}