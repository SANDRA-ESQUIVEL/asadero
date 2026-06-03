package com.thebroasterhouse.asadero.ventas.dto;

import lombok.Data;

@Data
public class DetalleVentaDTO {
    private String productoId;
    private String productoNombre;
    private Integer cantidad;
    private Double precio;
    private Double subtotal;
}