import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Importar ChangeDetectorRef
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Paquete } from '../Paquete.interface';

@Component({
    selector: 'app-updPaquete',
    templateUrl: './updPaquete.component.html',
    styleUrls: ['./updPaquete.component.css'],
    standalone: false
})
export class UpdPaqueteComponent implements OnInit {
  updFormGroup!: FormGroup;
  paqueteNombre: string | null = null;
  paqueteIdSeleccionado: number | null = null; // Guarda el ID del paquete seleccionado
  paquetes: Paquete[] = [];
  

  constructor(
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private changeDetector: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.updFormGroup = this._formBuilder.group({
      nombrePaquete: ['', Validators.required],
      descripcion: [''],
      categoria: [''],
      costo: ['', [Validators.required, Validators.min(0)]],
      estado: ['activo'],
      descuento: [''],
      valoracion: [''],
      tipo: [''],
      imageUrl: [''],
    });

    this.loadPaquetes();

    this.updFormGroup.get('nombrePaquete')?.valueChanges.subscribe(nombre => {
      // Detectar cambios manualmente
      this.changeDetector.detectChanges();
    });
  }

  loadPaquetes() {
    this.http.get<Paquete[]>('https://viajesumback.onrender.com/Paquetes').subscribe(
      (response) => {
        this.paquetes = response;
      },
      (error) => {
        console.error('Error al cargar los Paquetes:', error);
      }
    );
  }

  onPaqueteSelected(nombrePaquete: string) {
    const paqueteSeleccionado = this.paquetes.find(
      (p) => p.nombrePaquete === nombrePaquete
    );
    if (paqueteSeleccionado) {
      // Guarda el ID del paquete seleccionado
      this.paqueteIdSeleccionado = paqueteSeleccionado.idPaquete;
      this.paqueteNombre = nombrePaquete;
      this.updFormGroup.patchValue(paqueteSeleccionado);
    }
  }

  updPaquete() {
    if (this.updFormGroup.invalid) {
      console.error('Formulario inválido');
      return;
    }
  
    const paqueteActualizado: Paquete = this.updFormGroup.value;
    const nuevoNombrePaquete = paqueteActualizado.nombrePaquete;
  
    if (!this.paqueteIdSeleccionado) {
      console.error('ID del paquete no encontrado');
      return;
    }
  
    // Construir el encabezado de la solicitud
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.patch(`https://viajesumback.onrender.com/Paquetes/${this.paqueteIdSeleccionado}`, paqueteActualizado, { headers })
      .subscribe(
        (response) => {
          console.log('Paquete actualizado:', response);
          this.loadPaquetes();
          this.updFormGroup.reset();
          this.paqueteNombre = null;
          this.paqueteIdSeleccionado = null;
        },
        (error) => {
          console.error('Error al actualizar el Paquete:', error);
        }
      );
  }
}
