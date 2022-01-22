import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CalendarMode, Step} from "ionic2-calendar/calendar";
import {MeetingService} from "../../../services/meeting.service";
import {TimeMeeting} from "../../../interfaces/timeMeeting";
import {Meeting} from "../../../interfaces/meeting";
import {ActivatedRoute, Params, Router} from "@angular/router";
import * as moment from 'moment';
import {CalendarComponent} from "ionic2-calendar";
import {Business} from "../../../interfaces/business";
import {BusinessService} from "../../../services/business.service";


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

    private idUser= localStorage.getItem('idUser');
    business: Business;
    subscription;

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
        private route: ActivatedRoute,
        private businessService : BusinessService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                console.log("I got business id " + this.selectedBusinessId);

                this.getOneBusiness(this.selectedBusinessId);
            }
        })
    }

    next():void {
        this.myCal.slideNext();
    }

    back():void {
        this.myCal.slidePrev();
    }

    reverseTimeList():void{
        this.timeMeeting.reverse();
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
            console.log('here we are mnau ');
            
        }// todo pouzit Fork join aj pre vytiahnutie detail About Business

    }

    onViewTittleChanged(title):void {
        console.log(title + ' this is tittle');
        this.viewTitle = title;
    }


    private getMeetingsByIdUserByDate(idUser: string, dateForCalendar: string): void {

        // dany den minus 24 hodin
        // rovnasa dany datum

        const helpTime = moment(dateForCalendar).format('YYYY-MM-DDT00:00:00+01:00');

        console.log('zmeneny time ');
        console.log('2222222222222222222222222222222');

        console.log(helpTime);
        this.meetingService.getMeetingsByIdUserForOneDay(idUser, dateForCalendar).subscribe();

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
            console.log('11111111111111111111111111111111111111111');

        this.meetingService.getMeetingsByIdBusinessByDate(idBusiness, dateForCalendar).subscribe(meetings => {

            this.timeMeeting = meetings;
            this.meetingsByDateBusiness = meetings;

        }, error => {
            // todo set ErrorMessage Something is wrong
            console.log("you got error ");
            console.log(error);
        })
    }


    selectMeeting(meeting:Meeting):void{
        this.router.navigate(['/detail-meeting'], {
            queryParams: {
                docIdMeeting: meeting.id,
                idBusiness: meeting.idBusiness
                //todo add parametaer calendar link after delete and change should redirect to back
                // on this url calendar meetints
            }
        });
    }

    getOneBusiness(documentID: string): void {

        this.subscription = this.businessService.getOneBusiness(documentID).subscribe((business) => {
                this.business = business;
            }, error => {
                console.log(error);
            }
        );
    }

    ngOnDestroy(): void {
        this.selectedBusinessId = null;
       // this.subscription.unsubscribe();
    }
}
