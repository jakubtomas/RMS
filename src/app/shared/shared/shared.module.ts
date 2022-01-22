import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormatMeetingPipe} from "./pipes/format-meeting.pipe";



@NgModule({
  declarations: [FormatMeetingPipe],
  imports: [
    CommonModule
  ],
  exports: [FormatMeetingPipe]
})
export class SharedModule { }
