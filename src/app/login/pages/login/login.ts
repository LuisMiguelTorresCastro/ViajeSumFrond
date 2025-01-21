import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../viaje-sum/auth-service/auth-service';


@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.css'],
    standalone: false
})
export class LoginComponent {

  constructor(private router: Router, private authService: AuthService) {}

  async onSubmit(form: NgForm) {
    if (form.invalid) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const correoElectronico = form.value.email;
    const contraseñaUsuario = form.value.password;

    try {
        const response = await fetch('https://viajesumback.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correoElectronico, contraseñaUsuario }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Inicio de sesión exitoso.');

            // Almacenar el token usando el AuthService
            this.authService.login(data.token);

            // Redirigir según el rol
            if (data.isAdmin) {
                this.router.navigate(['/Auth/adm']);
            } else {
                this.router.navigate(['/Viajes/inicio']);
            }
        } else {
            alert(data.message || 'Credenciales inválidas.');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema al iniciar sesión. Inténtalo de nuevo.');
    }
  }
}
