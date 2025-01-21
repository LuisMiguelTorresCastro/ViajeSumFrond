import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Register } from '../register.interface';
import { interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { AuthService } from '../auth.service'; // Importa el servicio

@Component({
    selector: 'app-confirm-dialog-reg',
    templateUrl: './confirm-dialog-reg.component.html',
    styleUrls: ['./confirm-dialog-reg.component.css'],
    standalone: false
})
export class ConfirmDialogregComponent implements OnInit, OnDestroy {
  message: string;
  token: string = '';
  timeLeft: number = 300; // 5 minutos en segundos
  displayTime: string = '5:00';
  private timerSubscription!: Subscription;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogregComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Register,
    private authService: AuthService // Inyecta el servicio
  ) {
    this.message = '¿Estás seguro de que deseas guardar estos datos? Ingresa el token que te enviamos por correo electrónico.';
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startTimer() {
    this.timerSubscription = interval(1000)
      .pipe(
        takeWhile(() => this.timeLeft > 0),
        map(() => {
          this.timeLeft--;
          return this.secondsToTime(this.timeLeft);
        })
      )
      .subscribe({
        next: (time) => {
          this.displayTime = time;
          if (this.timeLeft === 0) {
            this.errorMessage = 'El tiempo para ingresar el token ha expirado.';
            this.dialogRef.disableClose = true; // Deshabilita el cierre del diálogo
          }
        },
        complete: () => {
          // Acciones adicionales al completar el temporizador, si son necesarias
        }
      });
  }

  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  secondsToTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authService.verifyToken(this.token, this.data.correoElectronico).subscribe({
      next: (response) => {
        this.successMessage = 'Token validado correctamente.';
        console.log('Token validado', response);
        this.stopTimer();
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error al validar el token', error);
        this.errorMessage = error.error.error || 'Error al validar el token. Inténtalo de nuevo.';
      }
    });
  }
}