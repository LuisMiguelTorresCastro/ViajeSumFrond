import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { ViajeSumRoutingModule } from './viaje-sum-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PaquetesComponent } from './pages/paquetes/paquetes.component';
import { AgenciasComponent } from './pages/agencias/agencias.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PaypalComponent } from './pages/paypal/paypal.componet';


@NgModule({
  declarations: [
    InicioComponent,
    PaquetesComponent,
    AgenciasComponent,
    SidebarComponent,
    PaypalComponent
  ],
  imports: [
    CommonModule,
    ViajeSumRoutingModule,
    MaterialModule,
  ],
  exports: [RouterModule]
})
export class ViajeSumModule { }

