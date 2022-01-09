import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Business} from "../../../interfaces/business";
import {BusinessService} from "../../../services/business.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SearchBusiness} from "../../../interfaces/searchBusiness";

@Component({
    selector: 'app-search-business',
    templateUrl: './search-business.page.html',
    styleUrls: ['./search-business.page.scss'],
})
export class SearchBusinessPage implements OnInit {


    registerForm: FormGroup;
    businesses: Business[];
    business: Business;
    businessId: string;
    firebaseErrorMessage: string;
    typesOrganization: object = null;
    orderBy: string = 'nameOrganization';

    noResultMessage: boolean = false;


    get nameOrganization(): FormControl {
        return this.registerForm.get('nameOrganization') as FormControl;
    }


    get zipCode(): FormControl {
        return this.registerForm.get('zipCode') as FormControl;
    }

    get city(): FormControl {
        return this.registerForm.get('city') as FormControl;
    }


    get typeOrganization(): FormControl {
        return this.registerForm.get('typeOrganization') as FormControl;
    }

    constructor(private businessService: BusinessService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.firebaseErrorMessage = null;
        this.typesOrganization = this.getTypesOrganization();
        this.registerForm = new FormGroup(
            {/*todo doplnit */
                nameOrganization: new FormControl(''),
                city: new FormControl(''),
                zipCode: new FormControl(''),
                typeOrganization: new FormControl('', Validators.required),
            });

        this.registerForm.setValue({
            nameOrganization: null,
            city: null,
            zipCode: null,
            typeOrganization: null
        });

        console.log(this.registerForm);
    }

    onSubmit() {

        let searchValues:  SearchBusiness = {
            nameOrganization: this.nameOrganization.value,
            city: this.city.value,
            zipCode: this.zipCode.value,
            typeOfOrganization: this.typeOrganization.value
        };
        this.getSearchedBusinesses(searchValues);

    }

    getTypesOrganization() {
        return this.businessService.typesOfOrganization;
    }

    orderByName() {
        if (this.orderBy === 'nameOrganization') {
          this.businesses.reverse();
        } else {
          this.orderBy = 'nameOrganization';
        }
    }

    orderByAddress() {

        if (this.orderBy === 'city') {
          this.businesses.reverse();
        } else {
          this.orderBy = 'city';
        //  this.getAllBusinesses();
        }
    }


    getSearchedBusinesses(searchValues: SearchBusiness) {
        console.log("permisionso");
        
       // this.businessService.getAllOwnerBusinesses(); // todo delete
        this.businessService.getSearchedBusinesses(searchValues).subscribe(value => {
            console.log(value);
            this.businesses = value;

                if (this.businesses.length === 0) {
                    this.noResultMessage = true;
                } else {
                    this.noResultMessage = false;
                }

        })
    }


    chooseBusiness(business: Business) {
        console.log("call the function");
        console.log(business.id);

        console.log('business is  ' + business.nameOrganization);

        if (business.id !== null) {
            //this.router.navigate(['/detail-business', {businessId: business.id}])
            this.router.navigate(['/detail-business'], {queryParams: {businessId: business.id}})
        }
    }


}
