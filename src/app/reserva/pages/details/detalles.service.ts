// paquete.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {
  private apiUrl = 'https://viajesumback.onrender.com'; // Cambia esta URL según tu configuración

  constructor(private http: HttpClient) { }

  // Obtener todos los paquetes
  getPaquetes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/paquetes`);
  }

  // Obtener detalles de un paquete específico por ID
  getPaqueteById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paquetes/${id}`);
  }

  // Crear una nueva reserva
  createReserva(idUsuario: number, idPaquete: number, cantidad: number): Observable<any> {
    const body = { idUsuario, idPaquete, cantidad };
    return this.http.post(`${this.apiUrl}/reservas`, body);
  }

  // Realizar un pago
  realizarPago(idReserva: number, idMetodoPago: number, monto: number): Observable<any> {
    const body = { idReserva, idMetodoPago, monto };
    return this.http.post(`${this.apiUrl}/pago`, body);
  }

  // Obtener métodos de pago
  getMetodosPago(): Observable<any> {
    return this.http.get(`${this.apiUrl}/metodos-pago`);
  }
}
