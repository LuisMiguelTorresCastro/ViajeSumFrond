import { Component } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';

@Component({
    selector: 'app-navbar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: false
})
export class SidebarComponent {
  layoutClass: string = 'left-sidebar'; // Valor por defecto
  isMenuVisible: boolean = false; // Estado del menú desplegable
  iconColor: string | undefined;

  constructor(private authService: AuthService){
    this.setIconColor(); // Establece el color inicial del icono
  } 
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Método para establecer el color del icono
  setIconColor() {
    this.iconColor = this.getRandomColor();
  }
  // Métodos para cambiar el layout
  setLeftSidebar() {
    this.layoutClass = 'left-sidebar';
  }

  setRightSidebar() {
    this.layoutClass = 'right-sidebar';
  }

  setNoSidebar() {
    this.layoutClass = 'no-sidebar';
  }

  // Método para alternar la visibilidad del menú
  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible; // Cambia el estado del menú
  }

  // Método para cerrar el menú
  closeMenu() {
    this.isMenuVisible = false; // Cierra el menú
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Método para cerrar sesión
  logout() {
    this.authService.logout(); // Cerrar sesión
    this.closeMenu(); // Cerrar el menú
    window.location.href = '/'; // Redirigir al usuario al inicio
  }
}
