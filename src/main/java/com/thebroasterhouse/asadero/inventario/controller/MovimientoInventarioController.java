package com.thebroasterhouse.asadero.inventario.controller;

import com.thebroasterhouse.asadero.inventario.model.MovimientoInventario;
import com.thebroasterhouse.asadero.inventario.repository.MovimientoInventarioRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@CrossOrigin("*")
public class MovimientoInventarioController {

    private final MovimientoInventarioRepository repository;

    public MovimientoInventarioController(
            MovimientoInventarioRepository repository
    ) {
        this.repository = repository;
    }

    @GetMapping
    public List<MovimientoInventario> listar() {
        return repository.findAll();
    }

    @PostMapping
    public MovimientoInventario guardar(
            @RequestBody MovimientoInventario movimiento
    ) {
        return repository.save(movimiento);
    }
}