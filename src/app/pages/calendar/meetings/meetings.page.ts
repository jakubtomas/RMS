import {Component, OnInit} from '@angular/core';
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


    //todayDate = moment().format('YYYY-M-D');
    //todayDate = moment().format('L');
    todayDate = moment().format('L');
    dayForMeeting = moment().subtract(24, "hours").format();

    private userId = localStorage.getItem('idUser');
    // todo osetrit error
    //todo osetri ked nemam ziadny zaznam

    timeMeeting = [];
    playTime = 'hello';
    hodina;
    // this.meetingService.getMeetingsByIdUser(this.userId, this.todayDate);

    // todo pipe pre vytvorenie datumu Format Dates
    // moment().format('MMMM Do YYYY, h:mm:ss a');
    //todo vytvorit pipe na zoradanie dat podla datumu
    // maximalny zobrazit 10 prispevok na stranku potom pouzit pagination
    // znova vytiahnut data od 10 po 20
    // alebo vytiahnut vsetkz za mesiac may ,jun , jul


    //todo show with date in list of meetings
    // todo create button for Details , Delete , Update ,Change
    constructor(public meetingService: MeetingService,
        private router: Router) {
    }

    ngOnInit() {
        this.getMeetingsByIdUser()
    }


    private getMeetingsByIdUser() {
        this.meetingService.getMeetingsByIdUserOrderByDate(this.userId, this.dayForMeeting).subscribe(meetings => {
            this.timeMeeting = meetings;

            /*
             console.log(meetings);
             console.log('--------------------');
             console.log(meetings.length);
             console.log('--------------------');
             this.playTime = meetings[0].time.start;
             console.log('---------------');
             console.log(this.playTime);
             console.log(moment(this.playTime, 'HH:mm').hours()*60);
             console.log(moment(this.playTime, 'HH:mm').minutes());
             console.log('---------------');
             */
            //console.log(moment.duration(moment(this.playTime, 'HH:mm')));

            if (meetings.length > 0 ) {
                this.hodina = moment
                    .duration(moment(meetings[0].time.start, 'HH:mm').diff(moment('24:00', 'HH:mm'))).asMinutes();
            }

        }, error => {
            console.log("you got error ");
            console.log(error);
        })


        /* this.hodina = moment
         .duration(moment(this.playTime, 'HH:mm').add("70","minutes")
         .diff(moment(this.playTime, 'HH:mm'))
         ).asMinutes();*/
    }


    selectMeeting(meeting: Meeting): void {
        console.log('click detail');
        this.router.navigate(['/detail-meeting'], {
            queryParams: {
                docIdMeeting: meeting.id,
                idBusiness: meeting.idBusiness
            }
        });

    }

}
