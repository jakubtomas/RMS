import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CalendarService} from "../../../services/calendar.service";
//import { ToastController } from 'ionic-angular';
import {Calendar} from "../../../interfaces/calendar";
import {ToastController} from "@ionic/angular";


import {Day} from "../../../interfaces/day";
import * as moment from 'moment';
import {TimeMeeting} from "../../../interfaces/timeMeeting";
import {MeetingService} from "../../../services/meeting.service";

// import * as moment from 'moment';

@Component({
    selector: 'app-create-calendar',
    templateUrl: './create-calendar.page.html',
    styleUrls: ['./create-calendar.page.scss'],
})
export class CreateCalendarPage implements OnInit {

    messageFirebase: string;
    selectedBusinessId: string;
    calendar: Calendar;
    isUpdateCalendar: boolean = false;
    docIdCalendar: string;
    errorsFromHours: string[] = [];
    timeZone: string = moment().format().toString().substring(19, 22);//25
    minutesForMeeting = '15'; // todo dokoncit ulozenie dlzky meetingu
    timeMeeting: TimeMeeting[] = [];


    //data for component
    ionTitle: string;
    ionButton: string;

    contactForm = new FormGroup(
        {
            MondayOpening: new FormControl("",),
            MondayClosing: new FormControl("",),

            TuesdayOpening: new FormControl("",),
            TuesdayClosing: new FormControl("",),

            WednesdayOpening: new FormControl("",),
            WednesdayClosing: new FormControl("",),

            ThursdayOpening: new FormControl("",),
            ThursdayClosing: new FormControl("",),

            FridayOpening: new FormControl("",),
            FridayClosing: new FormControl("",),

            SaturdayOpening: new FormControl("",),
            SaturdayClosing: new FormControl("",),

            SundayOpening: new FormControl("",),
            SundayClosing: new FormControl("",),

            // todo validators form , kontrolovat obidva hodnoty requere
            // univerzalny , input moze byt string
        });


    constructor(private route: ActivatedRoute,
        private calendarService: CalendarService,
        private meetingService: MeetingService,
        private toastCtrl: ToastController,
        private router: Router) {

    }


    ngOnInit() {
        this.messageFirebase = null;
        this.isUpdateCalendar = false;

        this.route.queryParams.subscribe((params: Params) => {
            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
            }
            if (params['docCalendarId'] != undefined) {
                this.docIdCalendar = params['docCalendarId'];

                this.getOneCalendar(params['docCalendarId']);
                this.isUpdateCalendar = true;
            } else {
                this.isUpdateCalendar = false;
                console.log("nemam id");
            }
            this.setValuesForPage();
        });

    }


    setValuesForPage() {
        if (this.isUpdateCalendar) {
            this.ionTitle = 'Update opening hours';
            this.ionButton = 'Update';
        } else {
            this.ionTitle = 'Create opening hours';
            this.ionButton = 'Create';

        }
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


    saveData() {

        console.log("save data "  + this.minutesForMeeting);
        console.log(moment().format());

        console.log(" calendar");
        console.log(this.contactForm.value);
        console.log(this.contactForm.value.MondayOpening);
        console.log(this.contactForm.value.ClosingOpening);


        //todo logaritmus  count all opening , closing Hours
        // porovnanie can not be empty opening and also closing if yes show error message


        let calendar: Calendar = {
            idBusiness: this.selectedBusinessId,
// save
            week: this.mapOpeningClosingHours(),
            break: 'hello',
            timeZone: this.timeZone

        };

        //todo pri nacitany stranky create meeting s calendarom
        // ked nemam otvaracie hodiny show message lebo inak error in console




        // todo prestavky niesu nastavene
        // todo typovanie v interface
        // todo add Timezone , and change interface
        console.log("save datat");
        console.log(JSON.stringify(calendar));

        if (this.errorsFromHours.length === 0) {// when we do not have errors
            
            console.log('this data I am saving ');
            console.log(calendar);
            
            
            this.calendarService.addCalendar(calendar).then(value => {
                this.showToast("Calendar successfully created");
                this.router.navigate(['/detail-business'], {queryParams: {businessId: this.selectedBusinessId}})

            }).catch((error) => {
                console.log('error');
                console.log(error);
                this.showToast("Something is wrong")
            });
        }
    }


    private mapOpeningClosingHours(): Day[] {
        const formData = this.contactForm.value;

        const sundayO = formData.SundayOpening;
        const sundayC = formData.SundayClosing;

        console.log(sundayO + ' -- ' + sundayC);
        console.log('we are here ');

        // let duration =

        // let hodina = moment
        //     .duration(moment(sundayC, 'YYYY/MM/DD HH:mm')
        //         .diff(moment(sundayO, 'YYYY/MM/DD HH:mm'))
        //     ).asMinutes();
        // console.log(hodina);
        // console.log('Hodina');
        //
        // use this function for saving data intp firestore

        const withoutFormatDate = formData.MondayOpening;
        console.log('pred upravou');
        console.log(withoutFormatDate);

        console.log('po uprave ');
        const value = moment(formData.MondayOpening).format('HH:mm');
        console.log(value);
        console.log('vyipsaniae hodn oae ro');


        // save data into databas pomocou moment(formData.SundayOpening).format('HH:mm');

        //fetch data from database and and set opening and closing hours in create calendar page and detail page


        // ternarny operator                     closingHours: (moment(item.closingHours).format('LT') == 'Invalid date') ? '---' : moment(item.closingHours).format('LT')
        const hours = [
            {
                day: "Monday", // todo create ternar operater if formData.MondayOpening is empty string use '' else use
                //todo moment(formData.MondayOpening).format('HH:mm')
                openingHours: formData.MondayOpening == '' ? '' : moment(formData.MondayOpening).format('HH:mm'),
                closingHours: formData.MondayClosing == '' ? '' : moment(formData.MondayClosing).format('HH:mm')
            },
            {
                day: "Tuesday",
                openingHours: formData.TuesdayOpening == '' ? '' : moment(formData.TuesdayOpening).format('HH:mm'),
                closingHours: formData.TuesdayClosing == '' ? '' : moment(formData.TuesdayClosing).format('HH:mm')
            },
            {
                day: "Wednesday",
                openingHours: formData.WednesdayOpening == '' ? '' : moment(formData.WednesdayOpening).format('HH:mm'),
                closingHours: formData.WednesdayClosing == '' ? '' : moment(formData.WednesdayClosing).format('HH:mm')
            },
            {
                day: "Thursday",
                openingHours: formData.ThursdayOpening == '' ? '' : moment(formData.ThursdayOpening).format('HH:mm'),
                closingHours: formData.ThursdayClosing == '' ? '' : moment(formData.ThursdayClosing).format('HH:mm')
            },
            {
                day: "Friday",
                openingHours: formData.FridayOpening == '' ? '' : moment(formData.FridayOpening).format('HH:mm'),
                closingHours: formData.FridayClosing == '' ? '' : moment(formData.FridayClosing).format('HH:mm')
            },
            {
                day: "Saturday",
                openingHours: formData.SaturdayOpening == '' ? '' : moment(formData.SaturdayOpening).format('HH:mm'),
                closingHours: formData.SaturdayClosing == '' ? '' : moment(formData.SaturdayClosing).format('HH:mm')
            },
            {
                day: "Sunday",
                openingHours: formData.SundayOpening == '' ? '' : moment(formData.SundayOpening).format('HH:mm'),
                closingHours: formData.SundayClosing == '' ? '' : moment(formData.SundayClosing).format('HH:mm')
            },

        ];
        // todo function which control result of opening and closing and check that is minus value ,
        // otvaranie nieje skor ako zatvaranie a nieje to nahodou malo casu
        console.log("///////////////////////////////////////");
        console.log(hours[0].openingHours);
        console.log(hours[0].closingHours);


        // const hours = [
        //     {day: "Monday", openingHours: moment(formData.MondayOpening).format('HH:mm'), closingHours: moment(formData.MondayClosing).format(('HH:mm'))},
        //     {day: "Tuesday", openingHours: moment(formData.TuesdayOpening).format('HH:mm'), closingHours: moment(formData.TuesdayClosing).format(('HH:mm'))},
        //     {day: "Wednesday", openingHours: moment(formData.WednesdayOpening).format('HH:mm'), closingHours: moment(formData.WednesdayClosing).format(('HH:mm'))},
        //     {day: "Thursday", openingHours: moment(formData.ThursdayOpening).format('HH:mm'), closingHours: moment(formData.ThursdayClosing).format(('HH:mm'))},
        //     {day: "Friday", openingHours: moment(formData.FridayOpening).format('HH:mm'), closingHours: moment(formData.FridayClosing).format(('HH:mm'))},
        //     {day: "Saturday", openingHours: moment(formData.SaturdayOpening).format('HH:mm'), closingHours: moment(formData.SaturdayClosing).format(('HH:mm'))},
        //     {day: "Sunday", openingHours: moment(formData.SundayOpening).format('HH:mm'), closingHours: moment(formData.SundayClosing).format('HH:mm')},
        //
        // ];


        this.errorsFromHours = [];
        // check hours
        hours.forEach((value, index) => {
            console.log('-----------------------');
            if (value.openingHours == '' && value.closingHours != '') {

                this.errorsFromHours.push(value.day + ' Opening hours is empty we got closing');
            } else if (value.openingHours != '' && value.closingHours == '') {
                this.errorsFromHours.push(value.day + '  Closing hours is empty but we got Opening ');

            }
        });

        return hours;
    }

    resetForm(): void {
        this.contactForm.setValue({
            MondayOpening: '',
            MondayClosing: '',
            TuesdayOpening: '',
            TuesdayClosing: '',
            WednesdayOpening: '',
            WednesdayClosing: '',
            ThursdayOpening: '',
            ThursdayClosing: '',
            FridayOpening: '',
            FridayClosing: '',
            SaturdayOpening: '',
            SaturdayClosing: '',
            SundayOpening: '',
            SundayClosing: ''
        });
    }


    getOneCalendar(docCalendarId: string): void {
        this.calendarService.getOneCalendar(docCalendarId).subscribe(calendar => {


            const basicTime = '10:25';
            // const newTime2 = moment('Mon 03-Jul-2017, ' + basicTime, 'ddd DD-MMM-YYYY, hh:mm ');

            // const attemptValue =
            this.calendar = calendar;


            console.log(calendar);
            console.log(' show me this album ');

            console.log(calendar.week[0]?.openingHours);
            console.log(calendar.week[1]?.openingHours);

            const defaultInterval = '15';

            const open = calendar.week[0]?.openingHours;
            const close = calendar.week[0]?.closingHours;

            const openTime = moment(open, 'HH:mm');
            console.log('default openTime ' + openTime.format('HH:mm'));
            openTime.add('10', "minutes");
            console.log('after change  ' + openTime.format('HH:mm'));


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


            // todo I am saving time zone in last value of string
            // const time = "2021-12-20T" + basicTime + ':56.702+01:00';

            this.contactForm.setValue({ // todo create function and refactoring
                MondayOpening: calendar.week[0]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                MondayClosing: calendar.week[0]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.closingHours + ':00.000' + this.calendar.timeZone + ':00',
                TuesdayOpening: calendar.week[1]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[0]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                TuesdayClosing: calendar.week[1]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[1]?.closingHours + ':00.000' + this.calendar.timeZone + ':00',
                WednesdayOpening: calendar.week[2]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[2]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                WednesdayClosing: calendar.week[2]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[2]?.closingHours + ':00.000' + this.calendar.timeZone + ':00',
                ThursdayOpening: calendar.week[3]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[3]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                ThursdayClosing: calendar.week[3]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[3]?.closingHours + ':00.000' + this.calendar.timeZone + ':00',
                FridayOpening: calendar.week[4]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[4]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                FridayClosing: calendar.week[4]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[4]?.closingHours + ':00.000' + this.calendar.timeZone + ':00',
                SaturdayOpening: calendar.week[5]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[5]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                SaturdayClosing: calendar.week[5]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[5]?.closingHours + ':00.000' + this.calendar.timeZone + ':00',
                SundayOpening: calendar.week[6]?.openingHours == '' ? '' : '2021-12-20T' + calendar.week[6]?.openingHours + ':00.000' + this.calendar.timeZone + ':00',
                SundayClosing: calendar.week[6]?.closingHours == '' ? '' : '2021-12-20T' + calendar.week[6]?.closingHours + ':00.000' + this.calendar.timeZone + ':00'
                // show data for update

                // todo ukladanie casu do UTC , cas prekonvertovat do UTC , skonvertuje cas do toho pouzivatela

                //SundayOpening: calendar.week[6]?.openingHours,
                //SundayClosing: calendar.week[6]?.closingHours

            });

        }, error => {
            console.log("you got error ");
            console.log(error);
        })
    }

    updateCalendars(): void {

        console.log("click update calendars ");
        console.log(moment().format());


        let updateCalendar: Calendar = {
            idBusiness: this.calendar.idBusiness,
            week: this.mapOpeningClosingHours(),
            break: 'no break',
            timeZone: this.timeZone

        };

        if (this.errorsFromHours.length === 0) {
            console.log(' data for update ');
            console.log(updateCalendar);
            
            this.calendarService.updateCalendar(this.docIdCalendar, updateCalendar).then(() => {

                console.log("uspesny update ");
                this.router.navigate(['/detail-business'], {queryParams: {businessId: updateCalendar.idBusiness}});
                this.showToast("The Update Is Done Successfully")

            }).catch((error) => {
                console.log("error you got error ");
                console.log(error);
                // this.messageFirebase = "Something is wrong";
            });
        }

    }

    resetHours(event, item) {

        let week = this.mapOpeningClosingHours();

        week[item].openingHours = '';
        week[item].closingHours = '';

        /*this.contactForm.setValue({
            MondayOpening: '',
            MondayClosing: '',
            TuesdayOpening: '',
            TuesdayClosing: '',
            WednesdayOpening: '',
            WednesdayClosing: '',
            ThursdayOpening: '',
            ThursdayClosing: '',
            FridayOpening: '',
            FridayClosing: '',
            SaturdayOpening: '',
            SaturdayClosing: '',
            SundayOpening: '',
            SundayClosing: ''
        });
*/
        this.contactForm.setValue({
         MondayOpening: week[0]?.openingHours,
         MondayClosing: week[0]?.closingHours,
         TuesdayOpening: week[1]?.openingHours,
         TuesdayClosing: week[1]?.closingHours,
         WednesdayOpening: week[2]?.openingHours,
         WednesdayClosing: week[2]?.closingHours,
         ThursdayOpening: week[3]?.openingHours,
         ThursdayClosing: week[3]?.closingHours,
         FridayOpening: week[4]?.openingHours,
         FridayClosing: week[4]?.closingHours,
         SaturdayOpening: week[5]?.openingHours,
         SaturdayClosing: week[5]?.closingHours,
         SundayOpening: week[6]?.openingHours,
         SundayClosing: week[6]?.closingHours
         });

    }


}
