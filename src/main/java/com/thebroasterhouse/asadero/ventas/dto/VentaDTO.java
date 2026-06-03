package com.thebroasterhouse.asadero.ventas.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VentaDTO {
    private Long id;
    private String idVenta;
    private LocalDateTime fecha;
    private String empleado;
    private Long clienteId;
    private String clienteNombre;
    private String clienteDocumento;
    private String clienteTelefono;
    private String clienteCorreo;
    private String tipoPedido;
    private String direccionEntrega;
    private String formaPago;
    private String monedaPago;
    private Double tasaDolar;
    private Double montoRecibido;
    private Double cambio;
    private String estadoPago;
    private String estadoPedido;
    private List<String> salsas;
    private Boolean guantes;
    private Boolean servilletas;
    private Boolean desechables;
    private String observaciones;
    private Double total;
    private List<DetalleVentaDTO> detalle;
}