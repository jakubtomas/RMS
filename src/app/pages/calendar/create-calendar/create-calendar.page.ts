import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
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
        {day: "Monday", open: "empty", closing: "empty"},
        {day: "Tuesday", open: "empty", closing: "empty"},
        {day: "Wednesday", open: "empty", closing: "empty"},
        {day: "Thursday", open: "empty", closing: "empty"},
        {day: "Friday", open: "empty", closing: "empty"},
        {day: "Saturday", open: "empty", closing: "empty"},
        {day: "Sunday", open: "empty", closing: "empty"},
    ];

    constructor(private route: ActivatedRoute,
        private calendarService: CalendarService,
        private toastCtrl: ToastController) {
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
    }

    /*////////////////////////////////////////////////////////*/

    contactForm = new FormGroup({
        calendarName: new FormControl("", Validators.required),
        openingHours: new FormControl('', Validators.required),
        closingHours: new FormControl('', Validators.required),
        daysOfWeek: new FormArray([]),
    });

    dessertOptions: string[] = ["Monday", "Tuesday", "Wednesday",
                                "Thursday", "Friday", "Saturday", "Sunday"];

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
        return this.contactForm.controls.daysOfWeek as FormArray;
    }
    async showToast(msg :string) {
        let toast =  await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.onDidDismiss();
        await toast.present();
    }

    setData() {
        console.log(this.contactForm.value);
        const openingHour = this.contactForm.value.openingHours;
        const closingHour = this.contactForm.value.closingHours;
        const calendarName = this.contactForm.value.calendarName;

        const array = this.contactForm.value.daysOfWeek;

        array.forEach((element, index) => {
            //let nameDay = [this.options[index].day];
            //console.log(nameDay);

            if (element === true) {
                this.options[index] = {day: this.options[index].day, open: openingHour, closing: closingHour};
                this.validForm = true;
            }
        });

        console.log('what is options ');
        console.log(this.options);
        console.log(this.options[0].open);


    }

    saveData() {
        console.log("save data ");
        const calendarName = this.contactForm.value.calendarName;

        let calendar: Calendar = {
            idBusiness: this.selectedBusinessId,
            nameCalendar: calendarName,
            schedule: this.options,
            break: ['attempt'],
            
        };
        
        /*{
         id?: string;
         idBusiness: string;
         nameCalendar: string;
         options: string;
         break: string;
         }
         */

        this.calendarService.addCalendar(calendar).then(value => {

            console.log("pridane do db");
            console.log(value);
            this.showToast("Calendar successfully created")

        }).catch((error) => {
            console.log(error);
            this.showToast("Something is wrong")
        });
    }

}
