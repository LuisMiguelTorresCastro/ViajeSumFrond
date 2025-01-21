import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login';
import { LoginRoutingModule } from './login-routing.module';
import { RegisterComponent } from './pages/register/register';
import { ConfirmDialogregComponent } from './pages/register-confirm-dialog/confirm-dialog-reg.component';
import { RecuperacionComponent } from './pages/recuperacion/recuperacion.component';
import { RegisterAdminComponent } from './pages/registerAdmin/register.admin';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ConfirmDialogregComponent,
    RecuperacionComponent,
    RegisterAdminComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    LoginRoutingModule,
  ],
})
export class LoginModule { }
