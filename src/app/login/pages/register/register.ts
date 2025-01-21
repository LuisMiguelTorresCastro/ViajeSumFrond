import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogregComponent } from '../register-confirm-dialog/confirm-dialog-reg.component';
import { AuthService } from '../auth.service';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword: boolean = false;
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
      correoElectronico: new FormControl('', [Validators.required, Validators.email]),
      direccionUsuario: new FormControl('', Validators.required),
      ciudad: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      estado: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      codigoPostal: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.pattern(/^[0-9]{5}$/)]),
      contraseñaUsuario: new FormControl('', [Validators.required, this.passwordValidator()]),
      confirmPassword: new FormControl('', Validators.required),
    }, { validators: this.passwordsMatchValidator });
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      return regex.test(control.value) ? null : { passwordInvalid: true };
    };
  }

  passwordsMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('contraseñaUsuario')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatch: true };
  };

  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      this.registerForm.markAllAsTouched();
      return;
    }

    const userData = this.registerForm.value;
    delete userData.confirmPassword; // Eliminamos el campo que no se envía al backend

    this.authService.registerUser(userData).subscribe({
      next: (response: any) => {
        console.log('Usuario registrado temporalmente', response);
        this.openConfirmDialog(userData);
      },
      error: (error: any) => {
        console.error('Error en el registro temporal', error);
        // Aquí puedes manejar errores específicos del servidor, como correo duplicado, etc.
        if (error.error && error.error.error) {
            // Si el error viene del backend y tiene un formato específico (por ejemplo, { error: "Correo duplicado" })
            alert(error.error.error)
        } else {
            // Si el error es más genérico o no se reconoce el formato
            alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        }
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
        Object.keys(this.registerForm.controls).forEach(key => {
          this.registerForm.get(key)?.setErrors(null);
        });
        this.router.navigate(['/Viajes/inicio']);
      }
    });
  }

  goToInicio(): void {
    this.router.navigate(['/Viajes/inicio']);
  }

  // Función para obtener el mensaje de error de un control específico
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.errors) return '';
  
    if (control.errors['required']) return 'Este campo es obligatorio.';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres.`;
    if (control.errors['pattern']) {
      if (controlName === 'telefonoUsuario') return 'El número debe tener 10 dígitos.';
      if (controlName === 'codigoPostal') return 'El CP debe tener 5 dígitos.';
      return 'Formato inválido.';
    }
    if (control.errors['email']) return 'Correo electrónico inválido.';
    if (control.errors['passwordInvalid']) return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
    if (control.errors['passwordsNotMatch']) return 'Las contraseñas no coinciden.';
  
    return '';
  }
}
