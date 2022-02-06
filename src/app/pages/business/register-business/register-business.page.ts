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

    business: Business;
    businessId: string;
    firebaseErrorMessage: string;
    createdNewBusiness: boolean = false;
    updateBusinessPage: boolean = false;
    typesOrganization: object = null;

   //component data
    ionTitle: string;
    ionButton: string;

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


        this.route.queryParams.subscribe((params: Params) => {

            if (params['businessId'] != undefined) {

                let businessId = params['businessId'];
                this.updateBusinessPage = true;
                this.setValuesForPage();
                this.getOneBusinessForUpdate(businessId)
            }
        });


        this.registerForm = new FormGroup(
            {
                nameOrganization: new FormControl('', Validators.required),
                phoneNumber: new FormControl('', Validators.required),
                zipCode: new FormControl('', Validators.required),
                city: new FormControl('', Validators.required),
                street: new FormControl('', Validators.required),
                typeOrganization: new FormControl('', Validators.required),
            }

        );
        this.setRegisterFormValues();
    }

    setValuesForPage():void {
        if (this.updateBusinessPage) {
            this.ionTitle = 'Update business';
            this.ionButton = 'Update';
        } else {
            this.ionTitle = 'Registration business';
            this.ionButton = 'Register';
        }
    }

    onSubmit():void {

        let businessData: Business = {
            idOwner: localStorage.getItem('idUser'),
            nameOrganization: this.nameOrganization.value,
            phoneNumber: this.phoneNumber.value,
            zipCode: this.zipCode.value,
            city: this.city.value,
            nameStreetWithNumber: this.street.value,
            typeOfOrganization: this.typeOrganization.value
        };

        if (this.updateBusinessPage) {
            this.updateBusiness(businessData)
        } else {
            this.createBusiness(businessData);
        }

    }

    createBusiness(businessData: Business): void {
        this.businessService.addBusiness(businessData).then(() => {
            this.createdNewBusiness = true;
            this.router.navigate(['/list-business'], { queryParams:  {createdBusiness: true}});
        }).catch((error) => {
            console.log(error);
            this.firebaseErrorMessage = 'Something is wrong.'
        });
    }

    updateBusiness(businessData: Business): void {
        this.businessService.updateBusiness(businessData, this.businessId).then(() => {
            this.router.navigate(['/detail-business'], { queryParams: { businessId: this.businessId, updateDone: true}})
        }).catch((error) => {
            console.log(error);
            this.firebaseErrorMessage = "Something is wrong"
        });
    }

    getTypesOrganization() {
        return this.businessService.typesOfOrganization;
    }

    getOneBusinessForUpdate(businessId: string):void {

        this.businessId = businessId;
         this.businessService.getOneBusiness(businessId).subscribe((business) => {
             this.business = business;
             this.setRegisterFormValues();
         });
    }

    setRegisterFormValues(): void {
        if (this.business != undefined) {

            this.registerForm.setValue({
                nameOrganization: this.business.nameOrganization,
                phoneNumber: this.business.phoneNumber,
                zipCode: this.business.zipCode,
                city: this.business.city,
                street: this.business.nameStreetWithNumber,
                typeOrganization: this.business.typeOfOrganization
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
                typeOrganization: null
            });

        }
    }

    getItems() {
        this.businessService.getItems().subscribe(value => {
            console.log(value);

        })
    }

}
