import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {CalendarService} from "../../../services/calendar.service";
//import { ToastController } from 'ionic-angular';
import {Calendar} from "../../../interfaces/calendar";
import {ToastController} from "@ionic/angular";
import {__await} from "tslib";

@Component({
    selector: 'app-create-calendar',
    templateUrl: './create-calendar.page.html',
    styleUrls: ['./create-calendar.page.scss'],
})
export class CreateCalendarPage implements OnInit {

    messageFirebase: string;
    validForm: boolean = false;
    selectedBusinessId: string;




    //registerForm: FormGroup;
    options = [
        {day: "Monday", openingHours: "empty", closingHours: "empty"},
        {day: "Tuesday", openingHours: "empty", closingHours: "empty"},
        {day: "Wednesday", openingHours: "empty", closingHours: "empty"},
        {day: "Thursday", openingHours: "empty", closingHours: "empty"},
        {day: "Friday", openingHours: "empty", closingHours: "empty"},
        {day: "Saturday", openingHours: "empty", closingHours: "empty"},
        {day: "Sunday", openingHours: "empty", closingHours: "empty"},
    ];

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
        this.dessertOptions.forEach(() => {
            this.ordersFormArray.push(new FormControl(false))
        })
    }


    ngOnInit() {
        this.messageFirebase = null;

        this.route.params.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
            }
        });

        //todo delete only for develop
        /* this.contactForm.setValue({
         calendarName: "Calendar s",
         openingHours: "10:45",
         closingHours: "10:45",
         });*/

    }


    contactForm = new FormGroup(
        {
            calendarName: new FormControl("", Validators.required),
            openingHours: new FormControl('', Validators.required),
            closingHours: new FormControl('', Validators.required),
            options: new FormArray([]),
        });

    dessertOptions: string[] = ["Monday", "Tuesday", "Wednesday",
                                "Thursday", "Friday", "Saturday", "Sunday"];


    async showToast(msg: string) {
        let toast = await this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: 'middle'
        });

        toast.onDidDismiss();
        await toast.present();
    }

    setData() {
        console.log(this.contactForm.value);
        const openingHour = this.contactForm.value.openingHours;
        const closingHour = this.contactForm.value.closingHours;
        const calendarName = this.contactForm.value.calendarName;

        const array = this.contactForm.value.options;

        array.forEach((element, index) => {

            if (element === true) {
                this.options[index] = {
                    day: this.options[index].day,
                    openingHours: openingHour, closingHours: closingHour
                };

                this.validForm = true;
            }
        });

    }

    saveData() {
        console.log("save data ");
        const calendarName = this.contactForm.value.calendarName;

        let calendar: Calendar = {
            idBusiness: this.selectedBusinessId,
            nameCalendar: calendarName,
            week: this.options,
            break: 'hello',
        };//todo prestavky niesu nastavene
        //todo typovanie v interface

        /*{
         id?: string;
         idBusiness: string;
         nameCalendar: string;
         options: string;
         break: string;
         }
         */
        console.log("save datat");

        this.calendarService.addCalendar(calendar).then(value => {

            console.log("pridane do db");
            console.log(value);

            this.showToast("Calendar successfully created");

            this.router.navigate(['/detail-business', {businessId: this.selectedBusinessId}])

        }).catch((error) => {
            console.log('this is error');

            console.log(error);
            this.showToast("Something is wrong")
        });
    }

}
