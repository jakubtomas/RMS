import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {BusinessService} from "../../../services/business.service";
import {AlertController, ToastController} from "@ionic/angular";
import {CalendarService} from "../../../services/calendar.service";
import {CalendarMode, Step} from "ionic2-calendar/calendar";
import * as moment from 'moment';
import {TimeMeeting} from "../../../interfaces/timeMeeting";
import {CalendarComponent} from "ionic2-calendar";
import {MeetingService} from "../../../services/meeting.service";
import {Meeting} from "../../../interfaces/meeting";

@Component({
    selector: 'app-create-meeting',
    templateUrl: './create-meeting.page.html',
    styleUrls: ['./create-meeting.page.scss'],
})
export class CreateMeetingPage implements OnInit {

    selectedDay;
    timeMeeting: TimeMeeting[] = [];
    selectedDayByCalendar: string;
    selectedDateByCalendar: Date;
    meetingsByDateBusiness: Meeting[] = [];
    defaultOpeningHours: TimeMeeting[] = [];
    businessCalendar: boolean = true;
    selectedBusinessId: string;

    //todo set correct date month number
    //todo nastavenie kalendar kolko dni vpred sa moze registrovat
    // kazda pobocka si to moze  urcit sama
    viewTitle: string;
    eventSource = [];

    calendar = {
        mode: 'month' as CalendarMode,
        step: 30 as Step,
        currentDate: new Date()
    };

    @ViewChild(CalendarComponent) myCal: CalendarComponent;

    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router,
        private toastCtrl: ToastController,
        public alertController: AlertController,
        private meetingService: MeetingService,
        private calendarService: CalendarService) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
                console.log("I got business id " + this.selectedBusinessId);
            }
        })
    }

    private async showToast(msg: string) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss();
        await toast.present();
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

        //console.log();
        console.log(' new format ' + moment(event).format('YYYY-M-D'));
        this.selectedDateByCalendar = event;
        this.selectedDayByCalendar = event.toString().substring(0, 3);
        this.selectedDay = 'hello';

        console.log('checko hours ' + moment(this.selectedDateByCalendar).format('L'));
        console.log('checko hours ' + moment(this.selectedDateByCalendar).format());

        this.getOpeningHoursByIdBusiness(this.selectedBusinessId);

    }

    private getOpeningHoursByIdBusiness(idBusiness: string): void {
        this.calendarService.getOpeningHoursByIdBusiness(idBusiness).subscribe(calendar => {

            if (calendar.length < 1) {
                this.businessCalendar = false;
                return
            }

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

            // create logaritmus
            const realEnd = moment(close, 'HH:mm');

            let isCalculate = true;
            let starts = moment(open, 'HH:mm');
            let ends = moment(open, 'HH:mm');

            this.defaultOpeningHours = [];
            while (isCalculate) {
                // todo change dates acccording to data from firestore
                ends.add('15', "minutes");

                if (ends <= realEnd) {
                    this.defaultOpeningHours.push(
                        {start: starts.format('HH:mm'), end: ends.format('HH:mm')}
                    );
                    starts = moment(ends);
                } else {
                    isCalculate = false;
                }
            }


            this.timeMeeting = [];


            if (this.defaultOpeningHours.length > 0) {

                const dateForFirestore = moment(this.selectedDateByCalendar).format('L');

                this.getMeetingsByIdBusinessByDate(idBusiness, dateForFirestore);
            }
            // when I have data in help Array I will call function for data
            // for meeting in this day , this Business
            // And just do filter according to conditions


            //// after push we have to filter which opening are okey and no
            //// take data from firestore collection meetings according to idBusiness
            //// this.timeMeeting = helpArray;

        }, error => {
            // todo set ErrorMessage Something is wrong
            console.log("you got error ");
            console.log(error);
        })
    }

    selectTime(time) {
        console.log('your time is ' + time.toString() + '   ' + JSON.stringify(time));

        //this.timeMeeting = [];
        console.log('I know ' + this.selectedDateByCalendar);

        if (this.selectedDateByCalendar && time) {
            this.showAlertForConfirmMeeting(this.selectedDateByCalendar, time);
           // this.showAlert('mockSttring');
        }
    }

    private async showAlertForConfirmMeeting(date: Date, time): Promise<any> {


        //console.log(date.getDate() + ' ' + date.getMonth() + '  ' + date.getFullYear());
        const confirmDay = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
        // 2022-01-06T14:24:36+01:00
        //console.log(' vstupny cas  je ' + date );
        let upravenyCas = moment(date).format("YYYY-MM-DD");
        /*console.log(' upraveny cas ' + upravenyCas);
        console.log(' upraveny cas ' + upravenyCas+"T00:00:00+01:00");
*/
//        upravenyCas = upravenyCas + "T00:00:00+01:00";
        upravenyCas = upravenyCas + "T00:00:00";

        //const modifyDate = moment(upravenyCas).add(0, 'minutes').format();
        const modifyDate = upravenyCas;
/*

        console.log('------------------------------------------------');
        console.log(' last Upravenz cas  ' + modifyDate);
        console.log('--------------');
        const value = moment(time.start, 'HH:mm').add(0, 'minutes').format();
        console.log('novy format casu  ' + value );
        console.log('novy format casu  ' + value );
*/


        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Confirm Meeting',

            message: 'Are you sure you want to create appointment?' +
                '\n' + '' + confirmDay + ' ' + JSON.stringify(time) + ' ' + time.valueOf('start').toString(),
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('no');
                        //todo when click no List of meeting is invisible

                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        // todo show message you created succ appointment
                        // function which save data into Firestore
                        console.log('continue');

                        this.saveMeeting(time,modifyDate );

                    }
                }]
        });

        await alert.present();
    }


    private saveMeeting(time, modifyDate): void {
        const userId = localStorage.getItem('idUser');

        console.log(time.start);
        const minutesFromHour = moment(time.start, 'HH:mm').hours() * 60;
        const minutesFromMinutes = moment(time.start, 'HH:mm').minutes();
        const startInMinutes = minutesFromHour + minutesFromMinutes;
        // try new Date ('2017-01-01')
        // modifyDate = moment(modifyDate).add(startInMinutes, 'minutes').format();
        
        const beforeSave = moment(modifyDate).add(startInMinutes, 'minutes').format();
        console.log('before save');
        console.log(beforeSave);
        console.log(beforeSave.substring(0, 16));

        const meetingData: Meeting = {

            // here is this
            dateForCalendar: moment(this.selectedDateByCalendar).format('L'),
            //date: beforeSave.substring(0, 16),
            date: beforeSave,
            time: {
                end: time.end,
                start: time.start
                //startMinutes: startInMinutes
            },
            minutes: startInMinutes,
            idBusiness: this.selectedBusinessId,
            idUser: userId
        };
        this.meetingService.addMeeting(meetingData).then(value => {
            //this.showToast("Calendar successfully created");
            //// this.router.navigate(['/detail-business'], {queryParams: {businessId: this.selectedBusinessId}})
            this.showToast('Meeting have been successfully created')
            // todo sett SuccesMessage you created new meeting

        }).catch((error) => {
            console.log('error');
            console.log(error);

            // todo set ErrorMessage we did not add Meeting
            //this.showToast("Something is wrong")
        });
    }

    private getMeetingsByIdBusinessByDate(idBusiness: string, dateForCalendar: string): void {
        this.meetingService.getMeetingsByIdBusinessByDate(idBusiness, dateForCalendar).subscribe(meetings => {


            this.timeMeeting = [];
            console.log('your meetings for this day ');
            console.log(meetings);
            this.meetingsByDateBusiness = meetings;


            this.filterReservedHours(this.defaultOpeningHours, meetings)
            /*
             this.defaultOpeningHours.forEach(time => {
             let permissionForSave = true;
             meetings.forEach(timeDB => {

             if (time.start === timeDB.time.start && time.end === timeDB.time.end) {
             permissionForSave = false;
             }
             });

             if (permissionForSave) {
             this.timeMeeting.push(time)
             }
             });
             */

            /*
             this.timeMeeting = [];
             this.defaultOpeningHours.forEach(time => {
             let permissionForSave = true;
             meetings.forEach(timeDB => {

             if (time.start === timeDB.time.start && time.end === timeDB.time.end) {
             permissionForSave = false;
             }
             });

             if (permissionForSave) {
             this.timeMeeting.push(time)
             }
             });
             */
            // this.filterReservedHours(this.defaultOpeningHours, meetings)

        }, error => {
            // todo set ErrorMessage Something is wrong
            console.log("you got error ");
            console.log(error);
        })

    }


    private filterReservedHours(openingHour: TimeMeeting[], reservedHours: Meeting[]): void {

        this.timeMeeting = [];
        openingHour.forEach(time => {
            let permissionForSave = true;
            reservedHours.forEach(timeDB => {

                if (time.start === timeDB.time.start && time.end === timeDB.time.end) {
                    permissionForSave = false;
                }
            });

            if (permissionForSave) {
                this.timeMeeting.push({
                    start: time.start,
                    end: time.end,
                    isAvailable: true
                });
            } else {
                this.timeMeeting.push({
                    start: time.start,
                    end: time.end,
                    isAvailable: false
                })
            }
        });

    }

    reverseTimeList(): void {
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
