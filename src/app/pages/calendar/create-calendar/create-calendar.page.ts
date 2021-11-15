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

    //component data
    ionTitle: string;
    ionButton: string;


    options: Day[] = [
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
        this.isUpdateCalendar = false;

        this.route.queryParams.subscribe((params: Params) => {
            if (params['businessId'] != undefined) {
                this.selectedBusinessId = params['businessId'];
            }
            console.log(params['docCalendarId'] + " docCalendar");
            console.log(params['UpdateCalendar'] + "is Update Calendar");

            if ((params['docCalendarId'] != undefined) && params['updateCalendar']) {
                this.docIdCalendar = params['docCalendarId'];

                this.getOneCalendar(params['docCalendarId']);
                this.isUpdateCalendar = true;
            } else {
                console.log("nemam id");
            }
            this.setValuesForPage();
        });

    }


    setValuesForPage() {
        if (this.isUpdateCalendar) {
            this.ionTitle = 'Update calendar';
            this.ionButton = 'Update';
        } else {
            this.ionTitle = 'Create calendar';
            this.ionButton = 'Create';

        }
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
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss();
        await toast.present();
    }

    setData() {
        console.log(this.contactForm.value);
        const openingHour = this.contactForm.value.openingHours;
        const closingHour = this.contactForm.value.closingHours;

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

    getOneCalendar(docCalendarId: string) {
        this.calendarService.getOneCalendar(docCalendarId).subscribe(calendar$ => {
            console.log(calendar$);

            this.calendar = calendar$;
            this.options = calendar$.week;

            this.contactForm.setValue({
                calendarName: calendar$.nameCalendar,
                openingHours: "",
                closingHours: "",
                options: [false, false, false, false, false, false, false,]
            })
        }, error => {
            console.log("you got error ");
            console.log(error);
        })
    }

    //set new value into function
    updateCalendars() {
        const calendarName = this.contactForm.value.calendarName;
        let updateCalendar: Calendar = {
            idBusiness: this.calendar.idBusiness,
            nameCalendar: calendarName,
            week: this.options,
            break: 'hello',
        };
        // create data according the creat calendar ts
        this.calendarService.updateCalendar(this.docIdCalendar, updateCalendar).then(() => {
            console.log("uspesny update ");
            this.router.navigate(['/detail-business'], {queryParams: {businessId: updateCalendar.id}})
            this.showToast("The Update Is Done Successfully")

        }).catch((error) => {
            console.log("error you got error ");
            console.log(error);
            // this.messageFirebase = "Something is wrong";
        });

    }
}
