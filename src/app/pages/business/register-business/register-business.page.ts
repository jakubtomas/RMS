import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {error} from "selenium-webdriver";
import {ActivatedRoute, Params, Router} from '@angular/router';
import {BusinessPermission} from "../../../interfaces/businessPermission";


interface User {
    id: number;
    first: string;
    last: string;
}
@Component({
               selector: 'app-register-business',
               templateUrl: './register-business.page.html',
               styleUrls: ['./register-business.page.scss'],
           })
export class RegisterBusinessPage implements OnInit {

    registerForm: FormGroup;

    business: Business;
    businessId: string;
    firebaseErrorMessage: string;
    createdNewBusiness: boolean = false;
    updateBusinessPage: boolean = false;
    typesOrganization: object = null;
    ionTitle: string;
    ionButton: string;

    selectedOption: string = "Health Care";



    users: User[] = [
        {
            id: 1,
            first: 'Alice',
            last: 'Smith',
        },
        {
            id: 2,
            first: 'Bob',
            last: 'Davis',
        },
        {
            id: 3,
            first: 'Charlie',
            last: 'Rosenburg',
        }
    ];

    compareWith(o1: User, o2: User) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    customAlertOptions: any = {
        header: 'Pizza Toppings',
        subHeader: 'Select your toppings',
        message: '$1.00 per topping',
        translucent: true
    };

    customPopoverOptions: any = {
        header: 'Hair Color',
        subHeader: 'Select your hair color',
        message: 'Only select your dominant hair color'
    };

    customActionSheetOptions: any = {
        header: 'Colors',
        subHeader: 'Select your favorite color'
    };


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
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.setValuesForPage();
        this.updateBusinessPage = false;
        this.firebaseErrorMessage = null;
        this.typesOrganization = this.getTypesOrganization();


        this.route.params.subscribe((params: Params) => {
            console.log('Parameter  ' + JSON.stringify(params));
            console.log('daj my sem ten parameter  ' + params['businessId']);

            if (params['businessId'] != undefined) {
                let businessId = params['businessId'];
                console.log('dostal som id for update ' + params['businessId']);

                this.updateBusinessPage = true;
                this.setValuesForPage();

                //todo problem je ze funkcia ngonINt ako nespusti  po druhy krat ked
                //nacitam data

                //todo zobrat hodnoty cez observable alebo subject alebo behavior subject
                //todo alebo priamo znova volat funkcio getOnebusiness s paramterom id business


                //todo dane hodnoty nastavit do formulura
                //todo napisat podmienku pre update /register button
                //todo aj pre nadpis update registrtion
                this.getOneBusinessForUpdate(businessId)
            }
        });


        this.registerForm = new FormGroup(
            {/*todo doplnit */
                nameOrganization: new FormControl('', Validators.required),
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
        this.setRegisterFormValues();


    }

    setValuesForPage() {
        if (this.updateBusinessPage) {
            this.ionTitle = 'Update business/organization';
            this.ionButton = 'Update';
        } else {
            this.ionTitle = 'Registration business/organization';
            this.ionButton = 'Register';

        }
    }

    onSubmit() {

        // fetch data
        let businessData: Business = {

            nameOrganization: this.nameOrganization.value,
            phoneNumber: this.phoneNumber.value,
            zipCode: this.zipCode.value,
            city: this.city.value,
            nameStreetWithNumber: this.street.value,
            typeOfOrganization: this.typeOrganization.value
        };

        if (this.updateBusinessPage) {
            // update function
            console.log("Update business page true ");
            console.log("-----------------------------");
            console.log(businessData);
            
           // this.updateBusiness(businessData)

        } else {
            this.createBusiness(businessData);
        }

    }

    createBusiness(businessData: Business): void {
        this.businessService.addBusiness(businessData).then(value => {

            console.log('id businessPermission' + value.id);

            this.createdNewBusiness = true;
            //todo redirect na page list of business wiht new value from DB business where can create calendar
            this.router.navigate(['/list-business', {createdBusiness: true}]);
        }).catch((error) => {
            console.log("error you got error ");

            console.log(error);
            this.firebaseErrorMessage = 'Something is wrong.'
            //todo maybe do delete values from db because one value unsuccessfully save
        });
    }

    updateBusiness(businessData: Business): void {
        this.businessService.updateBusiness(businessData, this.businessId).then(value => {

            //potrebne idecko
            console.log("spravil si update ");


            // redirect to detail buisinne s with message
            //   this.router.navigate(['/detail-business', {businessId: businessData.id, updateDone: true}]);

        }).catch((error) => {
            console.log(error);

        });
    }

    getTypesOrganization() {
        return this.businessService.typesOfOrganization;
    }


    getBusinessList() {
        this.businessService.getBusinessList().subscribe(value => {
            console.log('pocet zaznamov ' + value.length)
        })
    }

    getOneBusinessForUpdate(businessId: string) {
        this.businessId = businessId;


        this.businessService.getOneBusiness(businessId).subscribe((business) => {
            this.business = business;
            //put value into the Form
            this.setRegisterFormValues();

        });
    }

    setRegisterFormValues(): void {
        if (this.business != undefined) {

            console.log('we have set gregistreformavlue ');


            this.registerForm.setValue({
                                           nameOrganization: this.business.nameOrganization,
                                           phoneNumber: this.business.phoneNumber,
                                           zipCode: this.business.zipCode,
                                           city: this.business.city,
                                           street: this.business.nameStreetWithNumber,
                                           /* openingHours: '08:00',
                                            endingHours: '19:30',*/
                                           typeOrganization: this.typesOrganization
                                       });
        } else {
            // todo delete after develop mode
            console.log("nastavauje register Form ");

            this.registerForm.setValue({
                                           nameOrganization: "mnau coffe kosice",
                                           phoneNumber: "0950478654",
                                           zipCode: "014440",
                                           city: "Presov",
                                           street: 'presovska 42',
                                           typeOrganization: "wellnes"
                                       });

        }
    }

    getItems() {
        this.businessService.getItems().subscribe(value => {
            console.log(value);

        })
    }

}
