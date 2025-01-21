// detalles.component.ts
import { Component, OnInit } from '@angular/core';
import { PaqueteService } from './detalles.service';


@Component({
    selector: 'app-reg-Paquete',
    templateUrl: './detalles.html',
    styleUrls: ['./detalles.css'],
    standalone: false
})
export class DetallesComponent implements OnInit {
  paquetes: any[] = [];
  paqueteDetalles: any;
  metodosPago: any[] = [];
  cantidad: number = 1;
  selectedMetodoPago: number | null = null;
  idUsuario: number = 1; // Asume que el usuario autenticado tiene el ID 1; en producción, obtén esto de la autenticación

  constructor(private paqueteService: PaqueteService) { }

  ngOnInit(): void {
    this.obtenerPaquetes();
    this.obtenerMetodosPago();
  }

  obtenerPaquetes(): void {
    this.paqueteService.getPaquetes().subscribe(
      (data) => {
        this.paquetes = data;
      },
      (error) => {
        console.error('Error al obtener paquetes:', error);
      }
    );
  }

  obtenerPaqueteDetalles(id: number): void {
    this.paqueteService.getPaqueteById(id).subscribe(
      (data) => {
        this.paqueteDetalles = data;
      },
      (error) => {
        console.error('Error al obtener los detalles del paquete:', error);
      }
    );
  }

  // Método para crear una reserva
  crearReserva(): void {
    if (this.paqueteDetalles) {
      const idPaquete = this.paqueteDetalles.idPaquete;
      this.paqueteService.createReserva(this.idUsuario, idPaquete, this.cantidad).subscribe(
        (response) => {
          console.log('Reserva creada exitosamente:', response);
          alert('Reserva creada exitosamente');
        },
        (error) => {
          console.error('Error al crear la reserva:', error);
          alert('Hubo un problema al crear la reserva');
        }
      );
    }
  }

  // Obtener métodos de pago
  obtenerMetodosPago(): void {
    this.paqueteService.getMetodosPago().subscribe(
      (data) => {
        this.metodosPago = data;
      },
      (error) => {
        console.error('Error al obtener métodos de pago:', error);
      }
    );
  }

  // Método para realizar el pago de una reserva
  realizarPago(idReserva: number): void {
    if (this.selectedMetodoPago && this.paqueteDetalles) {
      const monto = this.paqueteDetalles.costo * this.cantidad;
      this.paqueteService.realizarPago(idReserva, this.selectedMetodoPago, monto).subscribe(
        (response) => {
          console.log('Pago registrado exitosamente:', response);
          alert('Pago registrado exitosamente');
        },
        (error) => {
          console.error('Error al registrar el pago:', error);
          alert('Hubo un problema al registrar el pago');
        }
      );
    } else {
      alert('Por favor selecciona un método de pago');
    }
  }
}
