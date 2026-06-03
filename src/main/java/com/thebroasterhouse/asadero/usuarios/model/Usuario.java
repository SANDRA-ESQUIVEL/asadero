package com.thebroasterhouse.asadero.usuarios.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    @NotBlank
    private String nombre;
    
    @Column(nullable = false, length = 100)
    @NotBlank
    private String apellido;
    
    @Column(nullable = false, length = 20, unique = true)
    @NotBlank
    private String numeroDocumento;
    
    @Column(nullable = false, length = 3)
    @NotBlank
    private String tipoDocumento;
    
    @Column(length = 100, unique = true)
    @Email
    private String correoPersonal;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(nullable = false, length = 20, unique = true)
    @NotBlank
    private String idEmpleado;
    
    @Column(nullable = false)
    @NotBlank
    private String password;
    
    @Column(length = 100)
    @Email
    private String correoEmpresa;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.VENDEDOR;

    @ElementCollection
    @CollectionTable(name = "usuario_permisos", joinColumns = @JoinColumn(name = "usuario_id"))
    @Column(name = "permiso")
    private List<String> permisos;
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private boolean activo = true;

    public enum Rol {
        ADMINISTRADOR, VENDEDOR
    }
}