import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CalendarMode, Step} from "ionic2-calendar/calendar";
import {MeetingService} from "../../../services/meeting.service";
import {TimeMeeting} from "../../../interfaces/timeMeeting";
import {Meeting} from "../../../interfaces/meeting";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as moment from 'moment';
import {CalendarComponent} from "ionic2-calendar";


@Component({
    selector: 'app-calendar-meetings',
    templateUrl: './calendar-meetings.page.html',
    styleUrls: ['./calendar-meetings.page.scss'],
})
export class CalendarMeetingsPage implements OnInit, OnDestroy {

    timeMeeting: Meeting[] = [];
    meetingsByDateBusiness: Meeting[] = [];
    selectedDayByCalendar: string;
    selectedDateByCalendar: Date;
    selectedBusinessId: string;
    hodina;
    private idUser= localStorage.getItem('idUser');



    viewTitle: string;
    eventSource = [];
    calendar = {
        mode: 'month' as CalendarMode,
        step: 30 as Step,
        currentDate: new Date()
    };

    @ViewChild(CalendarComponent) myCal: CalendarComponent;

    constructor(
        private router: Router,
        private meetingService: MeetingService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                console.log("I got business id " + this.selectedBusinessId);
            }
        })
    }

    next() {
        this.myCal.slideNext();
    }

    back() {
        this.myCal.slidePrev();
    }

    onCurrentDateChanged(event: Date):void {
        console.log('click');
        console.log(event);
        console.log(event.getDay());

        this.selectedDateByCalendar = event;
        this.selectedDayByCalendar = event.toString().substring(0, 3);

        const dateForFirestore = moment(this.selectedDateByCalendar).format('L');

        if (this.selectedBusinessId && dateForFirestore) {
            this.getMeetingsByIdBusinessByDate(this.selectedBusinessId, dateForFirestore);
        } else {
            this.getMeetingsByIdUserByDate(this.idUser, dateForFirestore);
        }





        /* this.selectedDateByCalendar = event;
         //console.log();
         console.log(' new format ' + moment(event).format('YYYY-M-D'));

         this.selectedDayByCalendar = event.toString().substring(0, 3);
         this.selectedDay = 'hello';

         this.getOpeningHoursByIdBusiness(this.selectedBusinessId);
         */
    }

    onViewTittleChanged(title):void {
        console.log(title + ' this is tittle');
        this.viewTitle = title;
    }


    // control that I am Owner  of this business
    // fetch all meetings by idBusiness
    // console.log


    // get opening Hours  create list of hours according to
    // business and opening hours


    // create list according to opening hours and meetings
    // which we have

    private getMeetingsByIdUserByDate(idUser: string, dateForCalendar: string): void {

        //dany den minus 24 hodin
        // rovnasa dany datum

        const helpTime = moment(dateForCalendar).format('YYYY-MM-DDT00:00:00+01:00');

        console.log('zmeneny time ');
        console.log(helpTime);

        this.meetingService.getMeetingsByIdUserByDate(idUser, dateForCalendar).subscribe(meetings => {
            console.log(' your meetings by User by Date ');
            console.log(meetings);
            this.timeMeeting = meetings;
            console.log('your meetings for this day ');
            console.log(meetings);
            this.meetingsByDateBusiness = meetings;


            // this.filterReservedHours(this.defaultOpeningHours, meetings)

        }, error => {
            // todo set ErrorMessage Something is wrong
            console.log("you got error ");
            console.log(error);
        })
    }


    private getMeetingsByIdBusinessByDate(idBusiness: string, dateForCalendar: string): void {

        this.meetingService.getMeetingsByIdBusinessByDate(idBusiness, dateForCalendar).subscribe(meetings => {

            console.log(' your meetings by Id User ');
            console.log(meetings);

            this.timeMeeting = meetings;
            console.log('your meetings for this day ');
            console.log(meetings);
            this.meetingsByDateBusiness = meetings;


            // this.filterReservedHours(this.defaultOpeningHours, meetings)

        }, error => {
            // todo set ErrorMessage Something is wrong
            console.log("you got error ");
            console.log(error);
        })
    }

    ngOnDestroy(): void {
        this.selectedBusinessId = null;
    }
}
