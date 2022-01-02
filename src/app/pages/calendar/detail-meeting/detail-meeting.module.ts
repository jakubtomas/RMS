import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailMeetingPageRoutingModule } from './detail-meeting-routing.module';

import { DetailMeetingPage } from './detail-meeting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailMeetingPageRoutingModule
  ],
  declarations: [DetailMeetingPage]
})
export class DetailMeetingPageModule {}
