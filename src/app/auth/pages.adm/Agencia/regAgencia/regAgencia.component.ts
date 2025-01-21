import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogAgeComponent } from '../regAge-confirm-dialog/confirm-dialog-Age.component';

@Component({
    selector: 'app-reg-agencia',
    templateUrl: './regAgencia.component.html',
    styleUrls: ['./regAgencia.component.css'],
    standalone: false
})
export class RegAgenciaComponent implements OnInit {
  firstFormGroup!: FormGroup;
  isLinear = false;

  constructor(
    private _formBuilder: FormBuilder, 
    private http: HttpClient,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nombreAgencia: ['', Validators.required],
      descripcion: ['', Validators.required],
      imageUrl: [''],
      correo: [''],
      telefono: [''],
      direccion: ['']
    });
  }

  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogAgeComponent, {
      width: '300px',
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveStep1();
      }
    });
  }

  saveStep1() {
    const formData = {
      nombreAgencia: this.firstFormGroup.get('nombreAgencia')?.value,
      descripcion: this.firstFormGroup.get('descripcion')?.value,
      imageUrl: this.firstFormGroup.get('imageUrl')?.value,
      correo: this.firstFormGroup.get('correo')?.value,
      telefono: this.firstFormGroup.get('telefono')?.value,
      direccion: this.firstFormGroup.get('direccion')?.value
    };

    this.http.post('https://viajesumback.onrender.com/agencias', formData)
      .subscribe(response => {
        console.log('Agencia guardada:', response);
        window.location.reload(); // Recargar la página después de eliminar
      }, error => {
        console.error('Error:', error);
      });
  }
}
