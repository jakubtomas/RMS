import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarMeetingsPageRoutingModule } from './calendar-meetings-routing.module';

import { CalendarMeetingsPage } from './calendar-meetings.page';
import {NgCalendarModule} from "ionic2-calendar";
import {FormatMeetingPipe} from "../../../pipes/format-meeting.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarMeetingsPageRoutingModule,
    NgCalendarModule,
  ],
  declarations: [CalendarMeetingsPage,FormatMeetingPipe]
})
export class CalendarMeetingsPageModule {}
