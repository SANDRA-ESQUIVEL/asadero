package com.thebroasterhouse.asadero.proveedores.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "proveedores")
@Data
public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 20, unique = true)
    private String idProveedor;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(nullable = false, length = 10)
    private String tipoProveedor; // empresa o persona
    
    @Column(length = 150)
    private String razonSocial;
    
    @Column(length = 10)
    private String tipoNit; // RUT, NIT, CE
    
    @Column(nullable = false, length = 20, unique = true)
    private String nit;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(length = 150)
    private String direccion;
    
    @Column(length = 100)
    private String email;
    
    @Column(nullable = false)
    private boolean activo = true;
    
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaModificacion;
}