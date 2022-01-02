import { Component, OnInit } from '@angular/core';
import {TimeMeeting} from "../../interfaces/timeMeeting";
import {MeetingService} from "../../services/meeting.service";
import {Observable} from "rxjs";
import {Meeting} from 'src/app/interfaces/meeting';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {

  constructor(public meetingService: MeetingService) { }

  ngOnInit() {
  }



}
