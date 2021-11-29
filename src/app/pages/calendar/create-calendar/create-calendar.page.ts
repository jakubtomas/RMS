import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CalendarService} from "../../../services/calendar.service";
//import { ToastController } from 'ionic-angular';
import {Calendar} from "../../../interfaces/calendar";
import {ToastController} from "@ionic/angular";

import {Day} from "../../../interfaces/day";

@Component({
    selector: 'app-create-calendar',
    templateUrl: './create-calendar.page.html',
    styleUrls: ['./create-calendar.page.scss'],
})
export class CreateCalendarPage implements OnInit {

    messageFirebase: string;
    validForm: boolean = false;
    selectedBusinessId: string;
    calendar: Calendar;
    isUpdateCalendar: boolean = false;
    docIdCalendar: string;
    errorsFromHours: string[] = [];

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

    async showToast(msg: string) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss();
        await toast.present();
    }


    saveData() {
        console.log("save data ");

        console.log(" calendar");
        console.log(this.contactForm.value);
        console.log(this.contactForm.value.MondayOpening);
        console.log(this.contactForm.value.ClosingOpening);


        //todo logaritmus  count all opening , closing Hours
        // porovnanie can not be empty opening and also closing if yes show error message


        let calendar: Calendar = {
            idBusiness: this.selectedBusinessId,

            week: this.mapOpeningClosingHours(),
            break: 'hello',
        };//todo prestavky niesu nastavene
        //todo typovanie v interface

        console.log("save datat");
        console.log(JSON.stringify(calendar));

        if (this.errorsFromHours.length === 0) {// when we do not have errors
            this.calendarService.addCalendar(calendar).then(value => {
                this.showToast("Calendar successfully created");
                //  this.router.navigate(['/detail-business', {businessId: this.selectedBusinessId}])
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
        const hours = [
            {day: "Monday", openingHours: formData.MondayOpening, closingHours: formData.MondayClosing},
            {day: "Tuesday", openingHours: formData.TuesdayOpening, closingHours: formData.TuesdayClosing},
            {day: "Wednesday", openingHours: formData.WednesdayOpening, closingHours: formData.WednesdayClosing},
            {day: "Thursday", openingHours: formData.ThursdayOpening, closingHours: formData.ThursdayClosing},
            {day: "Friday", openingHours: formData.FridayOpening, closingHours: formData.FridayClosing},
            {day: "Saturday", openingHours: formData.SaturdayOpening, closingHours: formData.SaturdayClosing},
            {day: "Sunday", openingHours: formData.SundayOpening, closingHours: formData.SundayClosing},

        ];

        this.errorsFromHours = [];
        // check hours 
        hours.forEach((value, index) => {
            console.log('-----------------------');
            if (value.openingHours == '' && value.closingHours != '') {

                console.log(value.day + '  Opening hours is empty but, we got closing ' + index);
                this.errorsFromHours.push(value.day + ' Opening hours is empty we got closing');
            } else if (value.openingHours != '' && value.closingHours == '') {
                this.errorsFromHours.push(value.day + '  Closing hours is empty but we got Opening ');
                console.log(value.day + '  Closing hours is empty but we got Opening ' + index);
            }
        });

        return hours;
    }


    getOneCalendar(docCalendarId: string) {
        this.calendarService.getOneCalendar(docCalendarId).subscribe(calendar$ => {
            console.log(calendar$);

            this.calendar = calendar$;
            this.contactForm.setValue({
                MondayOpening: calendar$.week[0]?.openingHours,
                MondayClosing: calendar$.week[0]?.closingHours,
                TuesdayOpening: calendar$.week[1]?.openingHours,
                TuesdayClosing: calendar$.week[1]?.closingHours,
                WednesdayOpening: calendar$.week[2]?.openingHours,
                WednesdayClosing: calendar$.week[2]?.closingHours,
                ThursdayOpening: calendar$.week[3]?.openingHours,
                ThursdayClosing: calendar$.week[3]?.closingHours,
                FridayOpening: calendar$.week[4]?.openingHours,
                FridayClosing: calendar$.week[4]?.closingHours,
                SaturdayOpening: calendar$.week[5]?.openingHours,
                SaturdayClosing: calendar$.week[5]?.closingHours,
                SundayOpening: calendar$.week[6]?.openingHours,
                SundayClosing: calendar$.week[6]?.closingHours
            });

        }, error => {
            console.log("you got error ");
            console.log(error);
        })
    }

    updateCalendars() {

        console.log('call update functio n');


        let updateCalendar: Calendar = {
            idBusiness: this.calendar.idBusiness,

            week: this.mapOpeningClosingHours(),
            break: 'no break',
        };
        //create data according the creat calendar ts


        if (this.errorsFromHours.length === 0) {
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
}
