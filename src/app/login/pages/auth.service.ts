import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://viajesumback.onrender.com/register'; // URL base de tu API

  constructor(private http: HttpClient) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }
  registerAdmin(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar-admin`, userData);
  }

  verifyToken(token: string, correoElectronico: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar`, { token, correoElectronico });
  }
  requestPasswordRecovery(correoElectronico: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar-recuperacion`, { correoElectronico });
  }

  verifyPasswordToken(token: string, correoElectronico: string, nuevaContrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar-contrasena`, { token, correoElectronico, nuevaContrasena });
  }

}