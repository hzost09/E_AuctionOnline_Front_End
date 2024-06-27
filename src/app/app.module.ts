import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';

import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { tokenInterceptorInterceptor } from './Interceptor/token-interceptor.interceptor';
import { AdminComponent } from './component/admin/admin.component';
import { HomeComponent } from './component/home/home.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { LoginComponent } from './component/login/login.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { UserPageComponent } from './component/user-page/user-page.component';
import { ItemDetailPageComponent } from './component/item-detail-page/item-detail-page.component';
import { RegisterComponent } from './component/register/register.component';
import { EmailResetFormComponent } from './component/email-reset-form/email-reset-form.component';
import { AuthService } from './service/Auth.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomeComponent,
    ResetPasswordComponent,
    VerifyEmailComponent,
    LoginComponent,
    NavbarComponent,
    UserPageComponent,
    ItemDetailPageComponent,
    EmailResetFormComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    HttpClientModule,

  ],
  providers: [
   provideHttpClient(withInterceptors([tokenInterceptorInterceptor])),
    DatePipe,
    provideClientHydration(),
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
