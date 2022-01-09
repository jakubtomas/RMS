import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarMeetingsPage } from './calendar-meetings.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarMeetingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarMeetingsPageRoutingModule {}
