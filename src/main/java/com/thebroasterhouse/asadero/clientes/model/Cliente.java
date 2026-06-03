package com.thebroasterhouse.asadero.clientes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "clientes")
@Data
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 20, unique = true)
    private String idCliente;
    
    @Column(nullable = false, length = 100)
    @NotBlank
    private String nombres;
    
    @Column(nullable = false, length = 100)
    @NotBlank
    private String apellidos;
    
    @Column(nullable = false, length = 3)
    @NotBlank
    private String tipoDocumento;
    
    @Column(nullable = false, length = 30, unique = true)
    @NotBlank
    private String numeroDocumento;
    
    @Column(length = 100)
    @Email
    private String email;
    
    @Column(length = 150)
    private String direccion;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(nullable = false)
    private boolean activo = true;
    
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaModificacion;
}