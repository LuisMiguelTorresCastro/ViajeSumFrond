import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Agencia } from '../agencia.interface';

@Component({
    selector: 'app-confirm-dialog-Age',
    templateUrl: './confirm-dialog-Age.component.html',
    styleUrls: ['./confirm-dialog-Age.component.css'],
    standalone: false
})
export class ConfirmDialogAgeComponent {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogAgeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agencia,
  ) {
    this.message = '¿Estás seguro de que deseas guardar estos datos?';
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
