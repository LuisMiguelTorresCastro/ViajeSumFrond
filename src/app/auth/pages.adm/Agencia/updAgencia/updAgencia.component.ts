import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogAgeComponent } from '../regAge-confirm-dialog/confirm-dialog-Age.component';


@Component({
    selector: 'app-updagencia',
    templateUrl: './updAgencia.component.html',
    styleUrls: ['./updAgencia.component.css'],
    standalone: false
})
export class UpdAgenciaComponent implements OnInit {
  updFormGroup!: FormGroup;
  agenciaId: string | null = null;
  agencias: any[] = []; 
  isLinear = true;  

  constructor(
    private _formBuilder: FormBuilder, 
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.updFormGroup = this._formBuilder.group({
      nombreAgencia: ['', Validators.required],
      descripcion: ['', Validators.required],
      imageUrl: [''],
      correo: [''],
      telefono: [''],
      direccion: ['']
    });

    this.loadAgencias(); 
  }

  loadAgencias() {
    this.http.get<any[]>('https://viajesumback.onrender.com/agencias').subscribe(response => {
      this.agencias = response;
    }, error => {
      console.error('Error al cargar las agencias:', error);
    });
  }

  onAgenciaSelected(name: string) {
    const selectedAgencia = this.agencias.find(agencia => agencia.nombreAgencia === name);

    if (selectedAgencia) {
      this.agenciaId = selectedAgencia.idAgencia;
      this.updFormGroup.patchValue(selectedAgencia);
    } else {
      console.error('Agencia no encontrada');
    }
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogAgeComponent, {
      width: '300px',
      data: { message: '¿Estás seguro de que deseas guardar estos datos?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updAgencia();
      }
    });
  }

  updAgencia() {
    if (!this.agenciaId) {
      console.error('ID de agencia no definido');
      return;
    }

    const formData = {
      nombreAgencia: this.updFormGroup.get('nombreAgencia')?.value,
      descripcion: this.updFormGroup.get('descripcion')?.value,
      imageUrl: this.updFormGroup.get('imageUrl')?.value,
      correo: this.updFormGroup.get('correo')?.value,
      telefono: this.updFormGroup.get('telefono')?.value,
      direccion: this.updFormGroup.get('direccion')?.value
    };

    this.http.patch(`http://localhost:3000/agencias/${this.agenciaId}`, formData)
      .subscribe(response => {
        console.log('Agencia actualizada:', response);
        window.location.reload(); // Recargar la página después de eliminar
      }, error => {
        console.error('Error al actualizar la agencia:', error);
      });
  }
}
