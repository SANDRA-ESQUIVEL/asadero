package com.thebroasterhouse.asadero.ventas.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ventas")
@Data
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, length = 20)
    private String idVenta;
    
    private LocalDateTime fecha;
    
    @Column(length = 100)
    private String empleado;
    
    // Cliente
    private Long clienteId;
    @Column(length = 100)
    private String clienteNombre;
    @Column(length = 20)
    private String clienteDocumento;
    @Column(length = 20)
    private String clienteTelefono;
    @Column(length = 100)
    private String clienteCorreo;
    
    // Pedido
    @Column(length = 20)
    private String tipoPedido;
    @Column(length = 150)
    private String direccionEntrega;
    
    // Pago
    @Column(length = 30)
    private String formaPago;
    @Column(length = 10)
    private String monedaPago;
    private Double tasaDolar;
    private Double montoRecibido;
    private Double cambio;
    
    @Column(length = 20)
    private String estadoPago;
    @Column(length = 20)
    private String estadoPedido;
    
    // Salsas
    @Column(length = 200)
    private String salsas;
    
    // Incluye
    private Boolean guantes;
    private Boolean servilletas;
    private Boolean desechables;
    
    @Column(length = 500)
    private String observaciones;
    
    private Double total;
    
    // Detalle como JSON (texto)
    @Column(columnDefinition = "TEXT")
    private String detalle;
}