import { Component, OnInit, OnDestroy } from '@angular/core'; // Importa OnDestroy
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RecuperacionService } from './recuperacion.service';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs'; // Importa Subscription y timer

@Component({
    selector: 'app-recuperacion',
    templateUrl: './recuperacion.component.html',
    styleUrls: ['./recuperacion.component.css'],
    standalone: false
})
export class RecuperacionComponent implements OnInit, OnDestroy { // Implementa OnDestroy
  cargando: boolean = false;
  mensaje: string = '';
  error: string = '';
  correoEnviado: boolean = false;
  tokenVerificado: boolean = false;
  mostrarContrasena: boolean = false;
  mostrarConfirmarContrasena: boolean = false;

  solicitudTokenForm: FormGroup;
  verificacionForm: FormGroup;
  cambioContrasenaForm: FormGroup;

  tiempoRestante: number = 300; // 5 minutos en segundos
  private temporizadorSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private recuperacionService: RecuperacionService, private router: Router) {
    this.solicitudTokenForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
    });

    this.verificacionForm = this.fb.group({
      token: ['', [Validators.required]],
    });
    this.verificacionForm.disable();

    this.cambioContrasenaForm = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
    this.cambioContrasenaForm.disable();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.detenerTemporizador(); // Limpia la suscripción al destruir el componente
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const nuevaContrasena = control.get('nuevaContrasena')?.value;
    const confirmarContrasena = control.get('confirmarContrasena')?.value;

    return nuevaContrasena === confirmarContrasena ? null : { passwordMismatch: true };
  };

  solicitarToken() {
    if (this.solicitudTokenForm.valid) {
      this.cargando = true;
      this.mensaje = '';
      this.error = '';

      const correoElectronico = this.solicitudTokenForm.get('correoElectronico')?.value;

      this.recuperacionService.requestPasswordRecovery(correoElectronico).subscribe({
        next: (response) => {
          this.cargando = false;
          this.mensaje = 'Se ha enviado un token a su correo electrónico.';
          this.correoEnviado = true;
          this.solicitudTokenForm.disable();
          this.verificacionForm.enable();
          this.iniciarTemporizador(); // Inicia el temporizador
          console.log("Respuesta del servidor:", response);
        },
        error: (error) => {
          this.cargando = false;
          this.error = error.error.error || 'Error al enviar el token. Por favor, inténtelo de nuevo.';
          console.error('Error al solicitar el token:', error);
        }
      });
    } else {
      this.error = 'Por favor, introduce un correo electrónico válido.';
    }
  }

  verificarToken() {
    if (this.verificacionForm.valid) {
      this.mensaje = '';
      this.error = '';
      const token = this.verificacionForm.get('token')?.value;
      const correoElectronico = this.solicitudTokenForm.get('correoElectronico')?.value;

      this.recuperacionService.verificarToken(correoElectronico, token).subscribe({
        next: (response) => {
          this.mensaje = 'Token verificado correctamente.';
          this.tokenVerificado = true;
          this.detenerTemporizador(); // Detiene el temporizador
          this.verificacionForm.disable();
          this.cambioContrasenaForm.enable();
          console.log("Respuesta del servidor:", response);
        },
        error: (error) => {
          this.error = error.error.error || 'Token inválido. Inténtelo de nuevo.';
          console.error('Error al verificar el token:', error);
        }
      });
    } else {
      this.error = 'Token inválido. Inténtelo de nuevo.';
    }
  }

  cambiarContrasena() {
    if (this.cambioContrasenaForm.valid) {
      this.mensaje = '';
      this.error = '';
      const nuevaContrasena = this.cambioContrasenaForm.get('nuevaContrasena')?.value;
      const correoElectronico = this.solicitudTokenForm.get('correoElectronico')?.value;

      this.recuperacionService.cambiarContrasena(correoElectronico, nuevaContrasena).subscribe({
          next: (response) => {
            this.mensaje = 'Contraseña actualizada exitosamente.';
            this.cambioContrasenaForm.disable();
            console.log("Respuesta del servidor:", response);
          },
          error: (error) => {
            this.error = error.error.error || 'Error al actualizar la contraseña. Inténtelo de nuevo.';
            console.error('Error al actualizar la contraseña:', error);
          }
        });
    } else {
      this.error = 'Las contraseñas no coinciden o no cumplen con los requisitos. Inténtelo de nuevo.';
    }
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  toggleMostrarConfirmarContrasena() {
    this.mostrarConfirmarContrasena = !this.mostrarConfirmarContrasena;
  }

  iniciarTemporizador() {
    this.tiempoRestante = 300;
    this.temporizadorSubscription = timer(0, 1000).subscribe(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        this.detenerTemporizador();
        this.error = 'Tiempo de espera agotado. Por favor, solicite un nuevo token.';
        this.verificacionForm.disable(); // Deshabilita el formulario de verificación
        this.correoEnviado = false; // Oculta el formulario de verificación
        this.solicitudTokenForm.enable(); // Habilita el formulario de solicitud de token
      }
    });
  }

  detenerTemporizador() {
    if (this.temporizadorSubscription) {
      this.temporizadorSubscription.unsubscribe();
    }
  }

  irALogin() {
    this.router.navigate(['/Login/login']);
  }  
  irAregresar() {
    this.router.navigate(['/Login/login']);
  }
}