import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogAgeComponent } from '../regAge-confirm-dialog/confirm-dialog-Age.component';

@Component({
    selector: 'app-delagencia',
    templateUrl: './delAgencia.component.html',
    styleUrls: ['./delAgencia.component.css'],
    standalone: false
})
export class DelAgenciaComponent implements OnInit {
  deleteFormGroup!: FormGroup;
  agencias: any[] = []; // Lista de agencias
  agenciaId: string | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.deleteFormGroup = this._formBuilder.group({
      idAgencia: [{ value: '', disabled: true }],
      nombreAgencia: ['', Validators.required]
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

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogAgeComponent, {
      width: '300px',
      data: { message: '¿Estás seguro de que deseas eliminar esta agencia?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAgencia();
      }
    });
  }

  deleteAgencia() {
    if (!this.deleteFormGroup.value.nombreAgencia) {
      console.error('Nombre de agencia no definido');
      return;
    }

    const agenciaToDelete = this.agencias.find(agencia => agencia.nombreAgencia === this.deleteFormGroup.value.nombreAgencia);

    if (!agenciaToDelete) {
      console.error('Agencia no encontrada');
      return;
    }

    this.agenciaId = agenciaToDelete.idAgencia; // Asignar el ID de la agencia a eliminar

    this.http.delete(`http://localhost:3000/agencias/${this.agenciaId}`)
      .subscribe(response => {
        console.log('Agencia eliminada:', response);
        window.location.reload(); // Recargar la página después de eliminar
      }, error => {
        console.error('Error al eliminar la agencia:', error);
      });
  }
}
