package com.thebroasterhouse.asadero.usuarios.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UsuarioDTO {
    private Long id;
    
    @NotBlank(message = "Nombre es obligatorio")
    @JsonProperty("nombre")
    private String nombre;
    
    @NotBlank
    private String apellido;
    
    @NotBlank
    private String numeroDocumento;
    
    @NotBlank
    private String tipoDocumento;
    
    private String correoPersonal;
    
    private String telefono;
    
    @NotBlank
    private String idEmpleado;
    
    @NotBlank
    private String password;
    
    private String correoEmpresa;
    
    private String rol;
    
    private List<String> permisos;
    
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private boolean activo;
}