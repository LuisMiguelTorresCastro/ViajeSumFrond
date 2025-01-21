import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../material/material.module';
import { RegAgenciaComponent } from './pages.adm/Agencia/regAgencia/regAgencia.component';
import { AdmComponent } from './pages.adm/adm/adm.component';
import { HttpClientModule } from '@angular/common/http';
import { RegAgenciaCardComponent } from './pages.adm/Agencia/regAge-card/regAgencia-card.component';
import { UpdAgenciaComponent } from './pages.adm/Agencia/updAgencia/updAgencia.component';
import { DelAgenciaComponent } from './pages.adm/Agencia/delAgencia/delAgencia.component';
import { RegPaqueteComponent } from './pages.adm/Paquetes/regPaquetes/regPaquete.component';
import { UpdPaqueteComponent } from './pages.adm/Paquetes/updPaquetes/updPaquete.component';
import { DelPaqueteComponent } from './pages.adm/Paquetes/delPaquetes/delPaquete.component';
import { RegPaqueteCardComponent } from './pages.adm/Paquetes/regPaq-card/regPaq-card.component';
import { ConfirmDialogAgeComponent } from './pages.adm/Agencia/regAge-confirm-dialog/confirm-dialog-Age.component';
import { ConfirmDialogPaqComponent } from './pages.adm/Paquetes/regPaq-confirm-dialog/confirm-dialog-Paq.component';
import { TwitchComponent } from './pages.adm/twitch/twitch.component';
import { TweetComponent } from './pages.adm/tweets/tweets.component';


@NgModule({
  declarations: [
    RegAgenciaComponent,
    RegAgenciaCardComponent,
    ConfirmDialogAgeComponent,
    AdmComponent,
    UpdAgenciaComponent,
    DelAgenciaComponent,
    RegPaqueteComponent,
    UpdPaqueteComponent,
    DelPaqueteComponent,
    RegPaqueteCardComponent,
    ConfirmDialogPaqComponent,
    TwitchComponent,
    TweetComponent,

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule,
    HttpClientModule,
    
  ],
})
export class AuthModule { }
