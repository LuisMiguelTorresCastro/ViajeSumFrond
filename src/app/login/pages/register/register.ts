import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogregComponent } from '../register-confirm-dialog/confirm-dialog-reg.component';
import { AuthService } from '../auth.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html', // Asegúrate de que la ruta es correcta
  styleUrls: ['./register.css'],   // Asegúrate de que la ruta es correcta
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isPasswordValid: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      nombreUsuario: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      apellidoUsuario: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      telefonoUsuario: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]{10}$/)]),
      correoUsuario: new FormControl('', [Validators.required, Validators.email]),
      direccionUsuario: new FormControl('', Validators.required),
      ciudad: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      estado: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      codigoPostal: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]{5}$/)]),
      password: new FormControl('', [Validators.required, this.passwordValidator()]),
      confirmPassword: new FormControl('', Validators.required),
    }, { validators: this.passwordsMatchValidator });
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      this.isPasswordValid = regex.test(control.value);
      return this.isPasswordValid ? null : { passwordInvalid: true };
    };
  }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatch: true };
  };

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor, revisa los errores en el formulario.';
      this.successMessage = '';
      // Marcar todos los campos como tocados para mostrar los errores
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.errorMessage = '';
    const userData = {
      ...this.registerForm.value,
      correoElectronico: this.registerForm.value.correoUsuario,
      contraseñaUsuario: this.registerForm.value.password,
      rolUsuario: 'cliente'
    };
    delete userData.correoUsuario; // Eliminamos el campo duplicado
    delete userData.password; // Eliminamos el campo duplicado
    delete userData.confirmPassword; // Eliminamos el campo que no se envía al backend
    this.authService.registerUser(userData).subscribe({
      next: (response: any) => {
        console.log('Usuario registrado temporalmente', response);
        this.successMessage = 'Usuario registrado temporalmente. Revisa tu correo para verificar la cuenta.';
        this.errorMessage = '';
        this.openConfirmDialog(userData);
      },
      error: (error: any) => {
        console.error('Error en el registro temporal', error);
        this.errorMessage = error.error.error || 'Error al registrar el usuario.';
        this.successMessage = '';
      }
    });
  }

  openConfirmDialog(userData: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogregComponent, {
      width: '350px',
      data: userData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.registerForm.reset();
        this.router.navigate(['/Viajes/inicio']);
      }
    });
  }

  goToInicio(): void {
    this.router.navigate(['/Viajes/inicio']);
  }
}