import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegAgenciaComponent } from './pages.adm/Agencia/regAgencia/regAgencia.component';
import { AdmComponent } from './pages.adm/adm/adm.component';
import { InicioComponent } from '../viaje-sum/pages/inicio/inicio.component';
import { DelAgenciaComponent } from './pages.adm/Agencia/delAgencia/delAgencia.component';
import { UpdAgenciaComponent } from './pages.adm/Agencia/updAgencia/updAgencia.component';
import { RegPaqueteComponent } from './pages.adm/Paquetes/regPaquetes/regPaquete.component';
import { UpdPaqueteComponent } from './pages.adm/Paquetes/updPaquetes/updPaquete.component';
import { DelPaqueteComponent } from './pages.adm/Paquetes/delPaquetes/delPaquete.component';
import { RegisterAdminComponent } from '../login/pages/registerAdmin/register.admin';
import { TweetComponent } from './pages.adm/tweets/tweets.component';
import { TwitchComponent } from './pages.adm/twitch/twitch.component';

const routes: Routes = [
  {
    path:'',
    component: AdmComponent,
    children: [
      { path: 'registro', component: RegAgenciaComponent },
      { path: 'edit', component: UpdAgenciaComponent },
      { path: 'eliminar', component: DelAgenciaComponent },

      { path: 'registrop', component: RegPaqueteComponent },
      { path: 'editp', component: UpdPaqueteComponent },
      { path: 'eliminarp', component: DelPaqueteComponent },

      { path: 'registerAdmin', component: RegisterAdminComponent },

      { path: 'twitter', component: TweetComponent },
      { path: 'twitch', component: TwitchComponent },

      { path: 'inicio', component: InicioComponent },
      { path: '**',redirectTo: 'adm'}
     ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
