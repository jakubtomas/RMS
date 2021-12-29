import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BusinessService} from "../../../services/business.service";
import {AlertController, ToastController} from "@ionic/angular";
import {CalendarService} from "../../../services/calendar.service";
import { CalendarMode, Step} from "ionic2-calendar/calendar";
import {Observable} from "rxjs";
import {Business} from "../../../interfaces/business";
//import * as moment from "../create-calendar/create-calendar.page";
import * as moment from 'moment';
import {TimeMeeting} from "../../../interfaces/timeMeeting";
import {Calendar} from "../../../interfaces/calendar";

import {CalendarComponent} from "ionic2-calendar";

@Component({
    selector: 'app-create-meeting',
    templateUrl: './create-meeting.page.html',
    styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {

    selectedDay;
    timeMeeting: TimeMeeting[] = [];
    calendarDB: Calendar;
    selectedDayByCalendar: string;
    selectedDateByCalendar: Date;
    //todo nastavenie kalendar kolko dni vpred sa moze registrovat
    // kazda pobocka si to moze  urcit sama

    //todo when we dont have opening hours in Sunday show message this day is closed
    viewTitle: string;
    eventSource = [];
    calendar = {
        mode: 'month' as CalendarMode,
        step: 30 as Step,
        currentDate: new Date(),

    };

    selectedBusinessId: string;

    @ViewChild(CalendarComponent) myCal: CalendarComponent;

    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router,
        private toastCtrl: ToastController,
        public alertController: AlertController,
        private calendarService: CalendarService) {
    }

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

    onViewTittleChanged(title) {
        console.log(title + ' this is tittle');
        
        this.viewTitle = title;
    }

    onCurrentDateChanged(event: Date) {
        console.log('click');
        console.log(event);
        console.log(event.getDay());
        this.selectedDateByCalendar = event;
        //console.log();

        this.selectedDayByCalendar = event.toString().substring(0, 3);
        this.selectedDay = 'hello';

        this.getOneCalendar(this.selectedBusinessId);

    }

    getOneCalendar(docCalendarId: string): void { // ifflfzGx1qHnIlRkNPQH
        this.calendarService.getOneCalendarByIdBusiness(docCalendarId).subscribe(calendar => {


            const basicTime = '10:25';
            // const newTime2 = moment('Mon 03-Jul-2017, ' + basicTime, 'ddd DD-MMM-YYYY, hh:mm ');

            // const attemptValue =
            // this.calendarDB = calendar;


            let open;
            let close;
            switch (this.selectedDayByCalendar) {
                case 'Mon':
                    console.log("It is a pondelok.");
                    open = calendar[0].week[0]?.openingHours;
                    close = calendar[0].week[0]?.closingHours;
                    break;
                case 'Tue':
                    console.log("It is a utorok.");
                    open = calendar[0].week[1]?.openingHours;
                    close = calendar[0].week[1]?.closingHours;
                    break;
                case 'Wed':
                    console.log("It is a Streda.");
                    open = calendar[0].week[2]?.openingHours;
                    close = calendar[0].week[2]?.closingHours;
                    break;
                case 'Thu':
                    console.log("It is a Stvrotok.");
                    open = calendar[0].week[3]?.openingHours;
                    close = calendar[0].week[3]?.closingHours;
                    break;
                case 'Fri':
                    console.log("It is a Piatok.");
                    open = calendar[0].week[4]?.openingHours;
                    close = calendar[0].week[4]?.closingHours;
                    break;
                case 'Sat':
                    console.log("It is a Sobota.");
                    open = calendar[0].week[5]?.openingHours;
                    close = calendar[0].week[5]?.closingHours;
                    break;
                case 'Sun':
                    console.log("It is a Nedela.");
                    open = calendar[0].week[6]?.openingHours;
                    close = calendar[0].week[6]?.closingHours;
                    break;
                default:
                    console.log("No such day exists!");
                    break;
            }


            // todo pridat intervali , pridat aj do DB s DB

            // create logaritmus
            const realEnd = moment(close, 'HH:mm');

            let isCalculate = true;
            let starts = moment(open, 'HH:mm');
            let ends = moment(open, 'HH:mm');
            this.timeMeeting = [];

            while (isCalculate) {

                ends.add('15', "minutes");

                if (ends <= realEnd) {

                    this.timeMeeting.push(
                        {start: starts.format('HH:mm'), end: ends.format('HH:mm')}
                    );
                    starts = moment(ends);
                } else {
                    isCalculate = false;
                }

            }
            console.log(this.timeMeeting);

        }, error => {
            console.log("you got error ");
            console.log(error);
        })
    }

    selectTime(time){
        console.log('your time is ' + time.toString() +'   '  + JSON.stringify(time) );


        console.log('I know ' + this.selectedDateByCalendar);

        if (this.selectedDateByCalendar && time) {
            this.showAlertForConfirmMeeting(this.selectedDateByCalendar, time);
        }
        //create Object
        // toggle
        // id user from localStorage
    }

    async showAlertForConfirmMeeting(date :Date , time): Promise<any> {
        console.log(date.getDate() + ' ' + date.getDay() + '  ' + date.getFullYear());

        const confirmDay = date.getDate() + '.' + date.getDay() + '.' + date.getFullYear();

        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm Meeting',
            animated: true,
            backdropDismiss: true,
            message: 'Are you sure you want to create appointment?' +
                '\n' + '' +  confirmDay +  ' ' + JSON.stringify(time) + ' ' + time.valueOf('start').toString(),
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('no');
                        
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        // todo show message you created succ appointment
                        // function which save data into Firestore 
                            console.log('continue');
                            
                    }
                }]
        });

        await alert.present();
    }


    saveMeeting(){
        const userId = localStorage.getItem('idUser');


    }

    reverseTimeList():void {
        this.timeMeeting.reverse();
    }

    // add calendar plugin
    //take data for generate calendar
    // show calendar


    // 1 GUI
    // maybe set default day actually day with list
    //functionality click on day and show list of free
    // 2 create collection Firestore for meeting

}
