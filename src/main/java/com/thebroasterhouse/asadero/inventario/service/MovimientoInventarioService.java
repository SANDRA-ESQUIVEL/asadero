package com.thebroasterhouse.asadero.inventario.service;

import com.thebroasterhouse.asadero.inventario.model.MovimientoInventario;
import com.thebroasterhouse.asadero.inventario.repository.MovimientoInventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MovimientoInventarioService {
    
    @Autowired
    private MovimientoInventarioRepository repository;
    
    public List<MovimientoInventario> getAllMovimientos() {
        return repository.findAll();
    }
    
    public MovimientoInventario createMovimiento(MovimientoInventario movimiento) {
        return repository.save(movimiento);
    }
}