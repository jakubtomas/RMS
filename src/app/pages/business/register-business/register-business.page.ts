import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";

@Component({
    selector: 'app-register-business',
    templateUrl: './register-business.page.html',
    styleUrls: ['./register-business.page.scss'],
})
export class RegisterBusinessPage implements OnInit {

    registerForm: FormGroup;

    successMsg: string = '';
    errorMsg: string = '';
    firebaseErrorMessage: string;


    get nameOrganization(): FormControl {
        return this.registerForm.get('nameOrganization') as FormControl;
    }

    get ownerName(): FormControl {
        return this.registerForm.get('ownerName') as FormControl;
    }

    get phoneNumber(): FormControl {
        return this.registerForm.get('phoneNumber') as FormControl;
    }

    get zipCode(): FormControl {
        return this.registerForm.get('zipCode') as FormControl;
    }

    get city(): FormControl {
        return this.registerForm.get('city') as FormControl;
    }

    get street(): FormControl {
        return this.registerForm.get('street') as FormControl;
    }

    get openingHours(): FormControl {
        return this.registerForm.get('openingHours') as FormControl;
    }

    get endingHours(): FormControl {
        return this.registerForm.get('endingHours') as FormControl;
    }

    get typeOrganization(): FormControl {
        return this.registerForm.get('typeOrganization') as FormControl;
    }


    constructor(private businessService: BusinessService) {
    }

    ngOnInit() {
        this.firebaseErrorMessage = null;
        this.registerForm = new FormGroup(
            {
                nameOrganization: new FormControl('', Validators.required),
                /*todo delete */ownerName: new FormControl('', Validators.required),
                phoneNumber: new FormControl('', Validators.required),
                zipCode: new FormControl('', Validators.required),
                city: new FormControl('', Validators.required),
                street: new FormControl('', Validators.required),
                openingHours: new FormControl('', [
                    Validators.required,
                ]),
                endingHours: new FormControl('', [
                    Validators.required,
                ]),
                typeOrganization: new FormControl('', Validators.required),
            }
            // this.passwordMatchValidator
        );

        this.registerForm.setValue({
            nameOrganization: "mnau coffe kosice",
            ownerName: 'jankohrakos',
            phoneNumber: "0950478654",
            zipCode: "014440",
            city: "Presov",
            street: 'presovska 58',
            openingHours: '08:00',
            endingHours: '19:30',
            typeOrganization: "wellnes"
        })


    }

    //todo notes which value from opening,closing hours will save ??????
    onSubmit() {
        console.log('resutl');

        /*
                console.log(this.registerForm);
                console.log("----------------------------------------");
                console.log(this.registerForm.controls);

                console.log("----------------------------------------");
                console.log(this.registerForm.controls.city.value);
                // busi
        */

        console.log(this.registerForm.controls.openingHours.value);

        let businessData: Business = {

            nameOrganization: this.nameOrganization.value,
            phoneNumber: this.phoneNumber.value,
            zipCode: this.zipCode.value,
            city: this.city.value,
            nameStreetWithNumber: this.street.value,
            openingHours: this.openingHours.value,
            endingHours: this.endingHours.value,
            TypeOfOrganization: this.typeOrganization.value
        };


        this.businessService.create(businessData).then((res) => {
            console.log(res);

            console.log("response from server to save data ");


        }).catch((error) => {
            console.log("resposne error ");
            console.log(error);

        });


    }

}
