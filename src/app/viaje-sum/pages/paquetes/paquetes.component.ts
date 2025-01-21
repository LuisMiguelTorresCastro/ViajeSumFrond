import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-paquetes',
    templateUrl: './paquetes.component.html',
    styleUrls: ['./paquetes.component.css'],
    standalone: false
})
export class PaquetesComponent implements OnInit {
  sanitizedUrl: any; // Variable para la URL sanitizada

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  }
}