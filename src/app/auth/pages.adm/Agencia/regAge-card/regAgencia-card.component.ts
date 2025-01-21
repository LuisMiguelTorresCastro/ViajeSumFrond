import { Component, Input, OnInit } from '@angular/core';
import { Agencia } from '../agencia.interface';

@Component({
    selector: 'app-reg-agencia-card',
    templateUrl: './regAgencia-card.component.html',
    styleUrls: ['./regAgencia-card.component.css'],
    standalone: false
})
export class RegAgenciaCardComponent implements OnInit {
  @Input() agencia!: Agencia;
  imageUrl: string | null = null;

  ngOnInit() {
    if (this.agencia) {
      this.imageUrl = this.agencia.imageUrl || null;
    } else {
      console.warn('Agencia no está definida');
    }
    console.log('Agencia:', this.agencia);
    console.log('Image URL:', this.imageUrl);
  }
}
