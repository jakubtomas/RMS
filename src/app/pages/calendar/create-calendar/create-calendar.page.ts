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

    //data for component
    ionTitle: string;
    ionButton: string;


    daysOfWeek: Day[];
    //
    // options: Day[] = [
    //     {day: "Monday", openingHours: "empty", closingHours: "empty"},
    //     {day: "Tuesday", openingHours: "empty", closingHours: "empty"},
    //     {day: "Wednesday", openingHours: "empty", closingHours: "empty"},
    //     {day: "Thursday", openingHours: "empty", closingHours: "empty"},
    //     {day: "Friday", openingHours: "empty", closingHours: "empty"},
    //     {day: "Saturday", openingHours: "empty", closingHours: "empty"},
    //     {day: "Sunday", openingHours: "empty", closingHours: "empty"},
    // ];

    get calendarName(): FormControl {
        return this.contactForm.get('calendarName') as FormControl;
    }

    get openingHours(): FormControl {
        return this.contactForm.get('openingHours') as FormControl;
    }

    get closingHours(): FormControl {
        return this.contactForm.get('closingHours') as FormControl;
    }

    get ordersFormArray() {
        return this.contactForm.controls.options as FormArray;
    }

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
            console.log(params['docCalendarId'] + " docCalendar");
            console.log(params['UpdateCalendar'] + "is Update Calendar");

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


        });

    dessertOptions: string[] = ["Monday", "Tuesday", "Wednesday",
                                "Thursday", "Friday", "Saturday", "Sunday"];


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

        this.setOpeningClosingHours();

        //todo logaritmus  count all opening , closing Hours
        // porovnanie can not be empty opening and also closing if yes show error message


        let calendar: Calendar = {
            idBusiness: this.selectedBusinessId,

            week: this.daysOfWeek,
            break: 'hello',
        };//todo prestavky niesu nastavene
        //todo typovanie v interface

        console.log("save datat");
        console.log(JSON.stringify(calendar));

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

    private setOpeningClosingHours() {
        const FormData = this.contactForm.value;
        this.daysOfWeek = [
            {day: "Monday", openingHours: FormData.MondayOpening, closingHours: FormData.MondayClosing},
            {day: "Tuesday", openingHours: FormData.TuesdayOpening, closingHours: FormData.TuesdayClosing},
            {day: "Wednesday", openingHours: FormData.WednesdayOpening, closingHours: FormData.WednesdayClosing},
            {day: "Thursday", openingHours: FormData.ThursdayOpening, closingHours: FormData.ThursdayClosing},
            {day: "Friday", openingHours: FormData.FridayOpening, closingHours: FormData.FridayClosing},
            {day: "Saturday", openingHours: FormData.SaturdayOpening, closingHours: FormData.SaturdayClosing},
            {day: "Sunday", openingHours: FormData.SundayOpening, closingHours: FormData.SundayClosing},

        ];
    }


    getOneCalendar(docCalendarId: string) {
        this.calendarService.getOneCalendar(docCalendarId).subscribe(calendar$ => {
            console.log(calendar$);

            this.calendar = calendar$;
            if (calendar$.week.length > 5) {
                this.contactForm.setValue({
                    MondayOpening: calendar$.week[0].openingHours,
                    MondayClosing: calendar$.week[0].closingHours,
                    TuesdayOpening: calendar$.week[1].openingHours,
                    TuesdayClosing: calendar$.week[1].closingHours,
                    WednesdayOpening: calendar$.week[2].openingHours,
                    WednesdayClosing: calendar$.week[2].closingHours,
                    ThursdayOpening: calendar$.week[3].openingHours,
                    ThursdayClosing: calendar$.week[3].closingHours,
                    FridayOpening: calendar$.week[4].openingHours,
                    FridayClosing: calendar$.week[4].closingHours,
                    SaturdayOpening: calendar$.week[5].openingHours,
                    SaturdayClosing: calendar$.week[5].closingHours,
                    SundayOpening: calendar$.week[6].openingHours,
                    SundayClosing: calendar$.week[6].closingHours
                });
            }
        }, error => {
            console.log("you got error ");
            console.log(error);
        })
    }

    //todo prerobit
    updateCalendars() {


        this.setOpeningClosingHours();
        let updateCalendar: Calendar = {
            idBusiness: this.calendar.idBusiness,

            week: this.daysOfWeek,
            break: 'hello',
        };
        // create data according the creat calendar ts
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
