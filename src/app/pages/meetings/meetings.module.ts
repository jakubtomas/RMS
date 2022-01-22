import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MeetingsPageRoutingModule } from './meetings-routing.module';
import { MeetingsPage } from './meetings.page';
import {FormatMeetingPipe} from "../../shared/shared/pipes/format-meeting.pipe";
import {SharedModule} from "../../shared/shared/shared.module";
//import {FormatMeetingPipe} from "../../pipes/format-meeting.pipe";
//import {FormatMeetingPipe} from "../../pipes/format-meeting.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeetingsPageRoutingModule,
    SharedModule
  ],
  declarations: [MeetingsPage]
})
export class MeetingsPageModule {}
