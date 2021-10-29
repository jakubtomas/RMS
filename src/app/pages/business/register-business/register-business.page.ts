import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {error} from "selenium-webdriver";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BusinessPermission} from "../../../interfaces/businessPermission";

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
    createdNewBusiness: boolean = false;

    typesOrganization: object = null;

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


    get typeOrganization(): FormControl {
        return this.registerForm.get('typeOrganization') as FormControl;
    }


    constructor(private businessService: BusinessService,
                private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit() {


        this.route.params.subscribe((params: Params) => {
            console.log('Parameter  ' + JSON.stringify(params));
            console.log('daj my sem ten parameter  ' + params['updateBusiness']);

            if (params['updateBusiness']) {

                //todo zobrat hodnoty cez observable alebo subject alebo behavior subject
                //todo alebo priamo znova volat funkcio getOnebusiness s paramterom id business
                //todo dane hodnoty nastavit do formulura
                //todo napisat podmienku pre update /register button
                //todo aj pre nadpis update registrtion
            this.businessService.businessObservable.subscribe(value => {
                console.log("update buisnes ");
                
                console.log(value);
                
            })
            }
        });


        this.createdNewBusiness = false;

        this.firebaseErrorMessage = null;


        this.typesOrganization = this.getTypesOrganization();

        this.registerForm = new FormGroup(
            {/*todo doplnit */
                nameOrganization: new FormControl('', Validators.required),
                ownerName: new FormControl('', Validators.required),
                phoneNumber: new FormControl('', Validators.required),
                zipCode: new FormControl('', Validators.required),
                city: new FormControl('', Validators.required),
                street: new FormControl('', Validators.required),
                /*openingHours: new FormControl('', [
                    Validators.required,
                ]),
                endingHours: new FormControl('', [
                    Validators.required,
                ]),*/
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
            street: 'presovska 42',
            /* openingHours: '08:00',
             endingHours: '19:30',*/
            typeOrganization: "wellnes"
        })


    }

    //todo notes which value from opening,closing hours will save ??????
    onSubmit() {

        let businessData: Business = {
            nameOrganization: this.nameOrganization.value,
            phoneNumber: this.phoneNumber.value,
            zipCode: this.zipCode.value,
            city: this.city.value,
            nameStreetWithNumber: this.street.value,
            typeOfOrganization: this.typeOrganization.value
        };

// this. create busines ´true a este router
        this.businessService.addBusiness(businessData).then(value => {
            //todo delete console
            console.log('-------------------------------');
            console.log("save into businessPermission ");
            console.log('id businessPermission' + value.id);

            this.createdNewBusiness = true;
            //todo redirect na page list of business wiht new value from DB business where can create calendar
            this.router.navigate(['/list-business', {createdBusiness: true}]);
        }).catch((error) => {
            console.log("error you got error ");

            console.log(error);
            this.firebaseErrorMessage = 'Something is wrong.'
            //todo maybe do delete values from db because one value unsuccessfully save
        })
    }

    getTypesOrganization() {
        return this.businessService.typesOfOrganization;
    }


    getBusinessList() {
        this.businessService.getBusinessList().subscribe(value => {
            console.log('pocet zaznamov ' + value.length)
        })
    }

    getOneBusiness() {
        this.businessService.getNewBusiness().subscribe(value => {
            console.log("Get One business");

            console.log(value)
        })
    }

    getItems() {
        this.businessService.getItems().subscribe(value => {
            console.log(value);

        })
    }

}
