import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service'; // Importa el servicio

@Component({
    selector: 'app-registerAdmin',
    templateUrl: './register.admin.html',
    styleUrls: ['./register.admin.css'],
    standalone: false
})
export class RegisterAdminComponent implements OnInit {
  nombreUsuario!: string;
  apellidoUsuario!: string;
  telefonoUsuario!: string;
  correoUsuario!: string;
  direccionUsuario!: string;
  ciudad!: string;
  estado!: string;
  codigoPostal!: string;
  password!: string;
  confirmPassword!: string;
  isPasswordValid: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService // Inyecta el servicio
  ) {}

  ngOnInit(): void {
    // ... (código de inicialización si es necesario)
  }

  checkPassword(): void {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    this.isPasswordValid = regex.test(this.password);
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.successMessage = '';
      return;
    }

    this.checkPassword();
    if (!this.isPasswordValid) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.';
      this.successMessage = '';
      return;
    }

    if (!this.nombreUsuario || !this.apellidoUsuario || !this.telefonoUsuario || !this.correoUsuario ||
        !this.direccionUsuario || !this.ciudad || !this.estado || !this.codigoPostal) {
      this.errorMessage = 'Por favor completa todos los campos.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';

    const userData = {
      nombreUsuario: this.nombreUsuario,
      apellidoUsuario: this.apellidoUsuario,
      telefonoUsuario: this.telefonoUsuario,
      correoElectronico: this.correoUsuario,
      contraseñaUsuario: this.password,
      direccionUsuario: this.direccionUsuario,
      ciudad: this.ciudad,
      estado: this.estado,
      codigoPostal: this.codigoPostal
    };

    this.authService.registerAdmin(userData).subscribe({
      next: (response) => {
        this.successMessage = 'Administrador registrado correctamente.';
        this.errorMessage = '';
        // Limpiar los campos después del registro exitoso
        this.nombreUsuario = '';
        this.apellidoUsuario = '';
        this.telefonoUsuario = '';
        this.correoUsuario = '';
        this.password = '';
        this.confirmPassword = '';
        this.direccionUsuario = '';
        this.ciudad = '';
        this.estado = '';
        this.codigoPostal = '';
        // Puedes redirigir al usuario a otra página aquí, por ejemplo, la página de inicio de sesión
        // this.router.navigate(['/login']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'El correo electrónico ya está registrado.';
        } else {
          this.errorMessage = 'Error al registrar el administrador. Por favor intenta de nuevo.';
        }
        this.successMessage = '';
      }
    });
  }
}