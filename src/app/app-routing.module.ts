import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { AdminComponent } from './component/admin/admin.component';
import { UserPageComponent } from './component/user-page/user-page.component';
import { ItemDetailPageComponent } from './component/item-detail-page/item-detail-page.component';
import { adminGuardGuard } from './guard/admin-guard.guard';
import { userGuard } from './guard/user.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'register',component:RegisterComponent
  },
  {
    path:'reset',component:ResetPasswordComponent
  },
  {
    path:'verify',component:VerifyEmailComponent
  },
  {
    path:'dashboard',component:AdminComponent,canActivate:[adminGuardGuard]
  },
  {
    path:'details',component:UserPageComponent,canActivate:[userGuard]
  },
  {
    path:'item/:id',component:ItemDetailPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
