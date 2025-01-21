import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-delPaquete',
    templateUrl: './delPaquete.component.html',
    styleUrls: ['./delPaquete.component.css'],
    standalone: false
})
export class DelPaqueteComponent implements OnInit {
  deleteFormGroup!: FormGroup;
  paquetes: any[] = []; // Lista de Paquetes
  paqueteId: string | null = null;

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.deleteFormGroup = this._formBuilder.group({
      nomPaquete: ['', Validators.required]
    });

    this.loadPaquetes(); // Cargar la lista de Paquetes
  }

  loadPaquetes() {
    this.http.get<any[]>('https://viajesumback.onrender.com/Paquetes').subscribe(response => {
      this.paquetes = response;
    }, error => {
      console.error('Error al cargar los Paquetes:', error);
    });
  }

  deletePaquete() {
    const nombrePaquete = this.deleteFormGroup.get('nomPaquete')?.value;

    if (!nombrePaquete) {
      console.error('Nombre de Paquete no definido');
      return;
    }

    const paqueteToDelete = this.paquetes.find(paquete => paquete.nombrePaquete === nombrePaquete);

    if (!paqueteToDelete) {
      console.error('Paquete no encontrado');
      return;
    }

    this.paqueteId = paqueteToDelete.idPaquete;

    if (!this.paqueteId) {
      console.error('ID del Paquete no definido');
      return;
    }

    this.http.delete(`http://localhost:3000/Paquetes/${this.paqueteId}`)
      .subscribe(response => {
        window.location.reload(); // Recargar la página después de eliminar
      }, error => {
        console.error('Error al eliminar el Paquete:', error);
      });
  }
}
