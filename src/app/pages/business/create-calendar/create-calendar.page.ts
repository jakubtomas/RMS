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

            }
        );
    }

    /*////////////////////////////////////////////////////////*/
    contactForm = new FormGroup({
        firstName: new FormControl("", Validators.required),
        lastName: new FormControl("", Validators.required),
        options: new FormArray([]),
    });
    dessertOptions: string[] = ["Monday", "Tuesday", "Wednesday",
                                "Thursday", "Friday", "Saturday", "Sunday"];

    get ordersFormArray() {
        return this.contactForm.controls.options as FormArray;
    }

    submitForm() {
        console.log(this.contactForm.value);
    }


}
