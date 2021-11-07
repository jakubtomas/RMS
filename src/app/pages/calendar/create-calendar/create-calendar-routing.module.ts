import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateCalendarPage } from './create-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: CreateCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateCalendarPageRoutingModule {}
