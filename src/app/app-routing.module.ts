import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';


const routes: Routes = [
  {
    path: 'Viajes',
    loadChildren: () => import('./viaje-sum/viaje-sum.module').then(m => m.ViajeSumModule) 
  },
  {
    path: 'Auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) 
  },
  {
    path: 'Login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule) 
  },
  {
    path: 'Us',
    loadChildren: () => import('./reserva/reserva-module').then(m => m.ReservaModule) 
  },
  {
    path: '',
    redirectTo: 'Viajes',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: Error404PageComponent
  },
  {
    path: '**',
    redirectTo: '404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
