import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Meeting} from "../../../interfaces/meeting";
import {MeetingService} from "../../../services/meeting.service";
import {Router} from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
})
export class MeetingsPage implements OnInit {


    todayDate = moment().format('YYYY-M-D');

  private userId = localStorage.getItem('idUser');
  // todo osetrit error
  //todo osetri ked nemam ziadny zaznam

  timeMeeting$: Observable<Meeting[]> =
      this.meetingService.getMeetingsByIdUser(this.userId, this.todayDate);


  //todo vytvorit pipe na zoradanie dat podla datumu
  // maximalny zobrazit 10 prispevok na stranku potom pouzit pagination
  // znova vytiahnut data od 10 po 20
  // alebo vytiahnut vsetkz za mesiac may ,jun , jul


  //todo show with date in list of meetings
  // todo create button for Details , Delete , Update ,Change
  constructor(public meetingService: MeetingService,
      private router: Router) { }

  ngOnInit() {
  }

  selectMeeting(meeting:Meeting):void {
    console.log('click detail');
    this.router.navigate(['/detail-meeting'], {queryParams: {docIdMeeting: meeting.id, idBusiness: meeting.idBusiness}});

  }

}
