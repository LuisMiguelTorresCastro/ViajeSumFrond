import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogPaqComponent } from '../regPaq-confirm-dialog/confirm-dialog-Paq.component';
import { Paquete } from '../Paquete.interface';


@Component({
    selector: 'app-reg-Paquete',
    templateUrl: './regPaquete.component.html',
    styleUrls: ['./regPaquete.component.css'],
    standalone: false
})
export class RegPaqueteComponent implements OnInit {
  firstFormGroup!: FormGroup;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      nombrePaquete: ['', Validators.required],
      descripcion: ['', Validators.required], // Agregado validador
      categoria: ['', Validators.required], // Agregado validador
      costo: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]], // Validar como número con hasta 2 decimales
      estado: ['activo'],
      descuento: ['', Validators.pattern(/^\d+(\.\d{1,2})?$/)],  // Validar como número con hasta 2 decimales
      valoracion: ['', Validators.pattern(/^\d+(\.\d{1,2})?$/)], // Validar como número con hasta 2 decimales
      tipo: ['', Validators.required], // Agregado validador
      imageUrl: [''], // Validar como URL
    });
  }
  
  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogPaqComponent, {
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
    if (this.firstFormGroup.invalid) {
      return; // No enviar si el formulario es inválido
    }

    const paquete: Paquete = this.firstFormGroup.value; // Obtener datos como Paquete

    this.http.post('https://viajesumback.onrender.com/Paquetes', paquete) // Enviar el objeto Paquete
      .subscribe(response => {
        console.log('Success:', response);
        // ... (código para recargar la página o mostrar un mensaje de éxito) ...
      },error => {
        console.error('Error:', error);
        // Aquí puedes agregar código para manejar el error y mostrar un mensaje al usuario.
        alert("Hubo un error al guardar el paquete. Por favor, inténtalo de nuevo.");
      });
  }
}