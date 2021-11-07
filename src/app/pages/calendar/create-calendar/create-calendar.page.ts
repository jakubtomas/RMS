import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-calendar',
  templateUrl: './create-calendar.page.html',
  styleUrls: ['./create-calendar.page.scss'],
})
export class CreateCalendarPage implements OnInit {


  messageFirebase: string;
  validForm: boolean = false;
  //registerForm: FormGroup;
  result = [
    {day: "Monday", open: "empty", closing: "empty"},
    {day: "Tuesday", open: "empty", closing: "empty"},
    {day: "Wednesday", open: "empty", closing: "empty"},
    {day: "Thursday", open: "empty", closing: "empty"},
    {day: "Friday", open: "empty", closing: "empty"},
    {day: "Saturday", open: "empty", closing: "empty"},
    {day: "Sunday", open: "empty", closing: "empty"},
  ];

  constructor(private route: ActivatedRoute,
  ) {
    this.dessertOptions.forEach(() => {
      this.ordersFormArray.push(new FormControl(false))
    })
  }


  ngOnInit() {
    this.messageFirebase = null;

    if (this.route.snapshot.paramMap.get('createdBusiness')) {
      this.messageFirebase = 'Business successfully created'
    }
  }

  /*////////////////////////////////////////////////////////*/

  contactForm = new FormGroup({
    calendarName: new FormControl("", Validators.required),
    openingHours: new FormControl('', Validators.required),
    closingHours: new FormControl('', Validators.required),
    options: new FormArray([]),
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
    return this.contactForm.controls.options as FormArray;
  }

  setData() {
    console.log(this.contactForm.value);
    const openingHour = this.contactForm.value.openingHours;
    const closingHour = this.contactForm.value.closingHours;
    const calendarName = this.contactForm.value.calendarName;

    const array = this.contactForm.value.options;

    array.forEach((element, index) => {
      console.log(element + " plus " + index);
      let nameDay = [this.result[index].day];
      console.log(nameDay);
      if (element === true) {
        this.result[index] = {day: nameDay[0], open: openingHour, closing: closingHour};
        this.validForm = true;
      }
    });

    console.log('what is result ');
    console.log(this.result);
    console.log(this.result[0].open);


  }

  saveData() {
    console.log("save data ");
  // create object
    // save object into db
    //promise
  }

}
