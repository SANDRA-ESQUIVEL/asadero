package com.thebroasterhouse.asadero.proveedores.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProveedorDTO {
    private Long id;
    private String idProveedor;
    private String nombre;
    private String tipoProveedor;
    private String razonSocial;
    private String tipoNit;
    private String nit;
    private String telefono;
    private String direccion;
    private String email;
    private boolean activo;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaModificacion;
}