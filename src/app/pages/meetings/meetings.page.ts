import { Component, OnInit } from '@angular/core';
import {TimeMeeting} from "../../interfaces/timeMeeting";
import {MeetingService} from "../../services/meeting.service";

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {

  timeMeeting: TimeMeeting[] = [];
  private userId = localStorage.getItem('idUser');


  //todo show with date in list of meetings
  constructor(public meetingService: MeetingService) { }

  ngOnInit() {
    this.getMeetingsByIdUser();
  }

  private getMeetingsByIdUser(){
    this.meetingService.getMeetingsByIdUser(this.userId).subscribe(value=>{

      console.log('only your meeting are ');
      console.log(value);

    });
  }

}
