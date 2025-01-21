import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface RecuperacionData {
  correoElectronico: string;
}

interface VerificarTokenData {
  correoElectronico: string;
  token: string;
}

interface CambiarContrasenaData {
  correoElectronico: string;
  nuevaContrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecuperacionService {
  private apiUrl = 'https://viajesumback.onrender.com/recuperacion';

  constructor(private http: HttpClient) { }

  requestPasswordRecovery(correoElectronico: string): Observable<any> {
    const data: RecuperacionData = { correoElectronico };
    return this.http.post(`${this.apiUrl}/solicitar-recuperacion`, data)
      .pipe(
        catchError(error => {
          console.error('Error en la solicitud de recuperación:', error);
          return throwError(() => error);
        })
      );
  }

  verificarToken(correoElectronico: string, token: string): Observable<any> {
    const data: VerificarTokenData = { correoElectronico, token };
    return this.http.post(`${this.apiUrl}/verificar-token`, data)
      .pipe(
        catchError(error => {
          console.error('Error al verificar el token:', error);
          return throwError(() => error);
        })
      );
  }

  cambiarContrasena(correoElectronico: string, nuevaContrasena: string): Observable<any> {
    const data: CambiarContrasenaData = { correoElectronico, nuevaContrasena };
    return this.http.post(`${this.apiUrl}/cambiar-contrasena`, data)
      .pipe(
        catchError(error => {
          console.error('Error al cambiar la contraseña:', error);
          return throwError(() => error);
        })
      );
  }
}