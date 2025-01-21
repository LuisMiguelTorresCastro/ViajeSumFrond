import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login'; // Asegúrate de que la ruta sea correcta
import { RegisterComponent } from './pages/register/register'; // Asegúrate de que la ruta sea correcta
import { AdmComponent } from '../auth/pages.adm/adm/adm.component';
import { InicioComponent } from '../viaje-sum/pages/inicio/inicio.component';
import { RecuperacionComponent } from './pages/recuperacion/recuperacion.component';
import { RegisterAdminComponent } from './pages/registerAdmin/register.admin';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Ruta para el componente de inicio de sesión
  { path: 'register', component: RegisterComponent }, // Ruta para el componente de registro
  { path: 'adm', component: AdmComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'recuperacion', component: RecuperacionComponent },
  { path: 'registerAdmin', component: RegisterAdminComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirigir a 'login' por defecto
  { path: '**', redirectTo: 'login' } // Redirigir cualquier ruta desconocida a 'login'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
