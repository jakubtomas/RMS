/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Meeting } from '../../../interfaces/meeting';
import { MeetingService } from '../../../services/meeting.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {


  todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');
  timeZone: string = moment().format().toString().substring(19, 25);//25
  dayForMeeting = moment().subtract(24, 'hours').format();
  currentTime;
  timeMeeting = [];
  meetingWithBusiness = [];

  private userId = localStorage.getItem('idUser');

  constructor(public meetingService: MeetingService,
    private router: Router) {
  }

  ngOnInit() {
    this.getMeetingsAndDetailsBusinessByIdUser();

    setInterval(() => {
      this.todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    }, 1000);
  }

  private getMeetingsAndDetailsBusinessByIdUser() {
    this.meetingService.getMeetingsAndDetailsBusinessByIdUser(this.userId, this.dayForMeeting)
      .subscribe(meetings => {
        this.meetingWithBusiness = meetings;


        if (meetings.length > 0) {
          this.currentTime = moment
            .duration(moment(meetings[0].meeting.time.start, 'HH:mm')
              .diff(moment('24:00', 'HH:mm'))).asMinutes();
        }

      }, error => {
        console.log(error);
      });
  }

  private getMeetingsByIdUser() {
    this.meetingService.getMeetingsByIdUserOrderByDate(this.userId, this.dayForMeeting).subscribe(meetings => {
      this.timeMeeting = meetings;

      if (meetings.length > 0) {
        this.currentTime = moment
          .duration(moment(meetings[0].time.start, 'HH:mm')
            .diff(moment('24:00', 'HH:mm'))).asMinutes();
      }

    }, error => {
      console.log(error);
    });
  }


  selectMeeting(meeting: Meeting): void {
    this.router.navigate(['/detail-meeting'], {
      queryParams: {
        docIdMeeting: meeting.id,
        idBusiness: meeting.idBusiness
      }
    });
  }

  reverseTimeList(): void {
    this.meetingWithBusiness.reverse();
  }

}
