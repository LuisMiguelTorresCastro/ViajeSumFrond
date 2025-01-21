import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Paquete } from '../Paquete.interface';

@Component({
    selector: 'app-confirm-dialog-Paq',
    templateUrl: './confirm-dialog-Paq.component.html',
    styleUrls: ['./confirm-dialog-Paq.component.css'],
    standalone: false
})
export class ConfirmDialogPaqComponent {
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogPaqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Paquete,
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
