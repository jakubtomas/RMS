import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-create-calendar',
    templateUrl: './create-calendar.page.html',
    styleUrls: ['./create-calendar.page.scss'],
})
export class CreateCalendarPage implements OnInit {

    messageFirebase: string;
    registerForm: FormGroup;
     result = [
        {day: "Monday", open: "date", closing: "date"},
        {day: "Tuesday", open: "date", closing: "date"},
        {day: "Wednesday", open: "date", closing: "date"},
        {day: "Thursday", open: "date", closing: "date"},
        {day: "Friday", open: "date", closing: "date"},
        {day: "Saturday", open: "date", closing: "date"},
        {day: "Sunday", open: "date", closing: "date"},
    ];

    constructor(private route: ActivatedRoute,
    ) {
        this.dessertOptions.forEach(() => {
            this.ordersFormArray.push(new FormControl(false))
        })
    }

    get nameCalendar(): FormControl {
        return this.registerForm.get('nameCalendar') as FormControl;
    }

    get openingHours(): FormControl {
        return this.registerForm.get('openingHours') as FormControl;
    }

    ngOnInit() {
        this.messageFirebase = null;

        if (this.route.snapshot.paramMap.get('createdBusiness')) {
            this.messageFirebase = 'Business successfully created'
        }

        this.registerForm = new FormGroup(
            {
                nameCalendar: new FormControl('', Validators.required),
                openingHours: new FormControl('', Validators.required),
                closingHours: new FormControl('', Validators.required),

            }
        );
    }

    /*////////////////////////////////////////////////////////*/

    contactForm = new FormGroup({
        firstName: new FormControl("", Validators.required),
        openingHours: new FormControl('', Validators.required),
        closingHours: new FormControl('', Validators.required),
        options: new FormArray([]),
    });

    dessertOptions: string[] = ["Monday", "Tuesday", "Wednesday",
                                "Thursday", "Friday", "Saturday", "Sunday"];

    get ordersFormArray() {
        return this.contactForm.controls.options as FormArray;
    }

    submitForm() {
        console.log(this.contactForm.value);
        const openingHour = this.contactForm.value.openingHours;
        const closingHour = this.contactForm.value.closingHours;
        console.log(openingHour);
        console.log("--------------------------------------------");

        const array = this.contactForm.value.options;
        // todo spracovat hodnoti
        //nastavit do dalsej tabulky bod alebo nad formularoom , zmenit farb
        // alebo priradit cilsla

        //zoberiem casi a pridym to k hodnotam na zaklade poradie a dam to do spodneho formulara
        // vytvorim object alebo daco take
        // monday opening and closign

        // create array



        array.forEach((element, index) => {
            console.log(element + " plus " + index);

            let nameDay = [this.result[index].day];
            console.log(nameDay);

            if (element === true) {
                this.result[index] = {day: nameDay[0], open: openingHour, closing: openingHour};
            }

            //if element true change value in result
        });

        console.log('what is result ');

        console.log(this.result);
        console.log(this.result[0].open);
        

    }


}
