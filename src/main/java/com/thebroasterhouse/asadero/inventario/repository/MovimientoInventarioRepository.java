package com.thebroasterhouse.asadero.inventario.repository;

import com.thebroasterhouse.asadero.inventario.model.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoInventarioRepository
        extends JpaRepository<MovimientoInventario, Long> {
}