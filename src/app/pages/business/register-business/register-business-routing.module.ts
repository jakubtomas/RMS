import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterBusinessPage } from './register-business.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterBusinessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterBusinessPageRoutingModule {}
