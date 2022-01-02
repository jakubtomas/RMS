import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailMeetingPage } from './detail-meeting.page';

const routes: Routes = [
  {
    path: '',
    component: DetailMeetingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailMeetingPageRoutingModule {}
