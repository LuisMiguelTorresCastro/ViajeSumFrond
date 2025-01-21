import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PaquetesComponent } from './pages/paquetes/paquetes.component';
import { AgenciasComponent } from './pages/agencias/agencias.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { PaypalComponent } from './pages/paypal/paypal.componet';
import { AuthGuard } from './auth-service/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'paquetes', component: PaquetesComponent },
      { path: 'agencias', component: AgenciasComponent },
      { path: 'paypal', component: PaypalComponent, canActivate: [AuthGuard] },
      { path: 'paypal/:paqueteId', component: PaypalComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'inicio' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViajeSumRoutingModule { }
