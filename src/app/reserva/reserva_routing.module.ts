import { NgModule } from '@angular/core';
import { InicioComponent } from '../viaje-sum/pages/inicio/inicio.component';
import { DetallesComponent } from './pages/details/detalles';
import { RouterModule, Routes } from '@angular/router';
import { Perfil } from './pages/perfil/perfil';

const routes: Routes = [
  { path: 'detalles', component: DetallesComponent },
  { path: 'perfil', component: Perfil },


  { path: 'inicio', component: InicioComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirigir a 'login' por defecto
  { path: '**', redirectTo: 'login' } // Redirigir cualquier ruta desconocida a 'login'
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservaRoutingModule { }
