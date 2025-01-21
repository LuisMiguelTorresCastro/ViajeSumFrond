import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../viaje-sum/auth-service/auth-service';

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.css']
})
export class AdmComponent implements OnInit {
  showTree = false;
  isMenuOpen = false; // Variable para controlar el estado del menú

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Podrías verificar la autenticación aquí y redirigir si no está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']); // O la ruta de login
    }
  }

  toggleTree() {
    this.showTree = !this.showTree;
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Cierra la sesión
    this.isMenuOpen = false;    // Cierra el menú
    this.router.navigate(['/']); // Redirige al inicio (usando Router)
  }

  // Método para alternar el estado del menú (abierto/cerrado)
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}