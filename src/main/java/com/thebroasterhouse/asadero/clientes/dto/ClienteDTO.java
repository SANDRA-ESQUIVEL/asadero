package com.thebroasterhouse.asadero.clientes.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClienteDTO {
    private Long id;
    private String idCliente;
    private String nombres;
    private String apellidos;
    private String tipoDocumento;
    private String numeroDocumento;
    private String email;
    private String direccion;
    private String telefono;
    private boolean activo;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaModificacion;
}