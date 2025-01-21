import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Si existe un token, el usuario está autenticado
  }

  // Almacenar el token en el localStorage
  login(token: string) {
    localStorage.setItem('token', token);
  }

  // Cerrar sesión (eliminar el token)
  logout() {
    localStorage.removeItem('token');
  }

  // Obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
