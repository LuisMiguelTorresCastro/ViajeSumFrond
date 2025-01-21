import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://viajesumback.onrender.com/perfil'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) { }

  // --- Métodos para Usuarios ---

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  getUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  getUsuariosRegistradosEntre(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/registrados-entre/${fechaInicio}/${fechaFin}`);
  }

  getUsuariosActualizadosEntre(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/actualizados-entre/${fechaInicio}/${fechaFin}`);
  }

  getContarUsuariosPorRol(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/contar-por-rol`);
  }
  getUsuariosRegistradosConGoogle(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/registrados-con-google`);
  }

  // --- Métodos para Paquetes ---

  getPaquetes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paquetes`);
  }

  getPaqueteMasCaro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/paquetes/mas-caro`);
  }

  // --- Métodos para Agencias ---

  getAgencias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agencias`);
  }

  buscarAgencias(palabraClave: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agencias/buscar/${palabraClave}`);
  }
    // --- Métodos para Tweets ---

    getTweets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tweets`);
    }
}