import { Component, Input, OnInit } from '@angular/core';
import { Paquete } from '../Paquete.interface';

@Component({
    selector: 'paquete-paq-card',
    templateUrl: './regPaq-card.component.html',
    styleUrls: ['./regPaq-card.component.css'],
    standalone: false
})
export class RegPaqueteCardComponent implements OnInit {
  @Input() paquete!: Paquete; 

  ngOnInit() {
    console.log('Paquete:', this.paquete);
  }
}