import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {error} from "selenium-webdriver";
import {Router} from '@angular/router';
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

    /*get openingHours(): FormControl {
        return this.registerForm.get('openingHours') as FormControl;
    }

    get endingHours(): FormControl {
        return this.registerForm.get('endingHours') as FormControl;
    }*/

    get typeOrganization(): FormControl {
        return this.registerForm.get('typeOrganization') as FormControl;
    }


    constructor(private businessService: BusinessService,
                private router: Router) {
    }

    ngOnInit() {

        this.createdNewBusiness = false;

        this.firebaseErrorMessage = null;
        this.registerForm = new FormGroup(
            {
                nameOrganization: new FormControl('', Validators.required),
                /*todo delete */ownerName: new FormControl('', Validators.required),
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


        this.businessService.addBusiness(businessData).then(value => {
            console.log("save Into business successfully done");
            console.log('ID business organization' + value.id);

            let businessPermissionObject:BusinessPermission = {
                idUser: localStorage.getItem('idUser'),
                idOrganization: value.id,
            };
            
            this.businessService.addBusinessPermission(businessPermissionObject).then(value => {
                console.log('-------------------------------');
                console.log("save into businessPermission ");
                console.log('id businessPermission' + value.id);

                this.createdNewBusiness = true;
                //this.router.navigate(['/dashboard', {createdBusiness: true}]);
            }).catch((error) => {
                console.log(error);
                //todo delete from organization
            });


        }).catch((error) => {
            console.log("error you got error ");

            console.log(error);
            this.firebaseErrorMessage = 'Something is wrong.'
        })

        /*
                this.businessService.create(businessData).then((res) => {
                    console.log(res);
        
                    console.log("response from server to save data ");
        
        
                }).catch((error) => {
                    console.log("resposne error ");
                    console.log(error);
        
                });
        */
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
