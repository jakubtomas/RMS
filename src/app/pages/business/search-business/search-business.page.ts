import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Business} from "../../../interfaces/business";
import {BusinessService} from "../../../services/business.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

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
  orderByName: string = "asc";



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
    this.firebaseErrorMessage = null;
    this.typesOrganization = this.getTypesOrganization();

    this.getAllBusinesses();

    this.registerForm = new FormGroup(
        {/*todo doplnit */
          nameOrganization: new FormControl('', ),
          city: new FormControl('', ),
          street: new FormControl('', ),
          typeOrganization: new FormControl('', Validators.required),
        });



    this.registerForm.setValue({
      nameOrganization: "",
      city: "",
      street: "",
      typeOrganization: ""
    });
  }

  onSubmit() {
    let searchData = {
      nameOrganization: this.nameOrganization.value,
      city: this.city.value,
      nameStreetWithNumber: this.street.value,
      typeOfOrganization: this.typeOrganization.value
    };
    console.log(searchData);
    
  }
  getTypesOrganization() {
    return this.businessService.typesOfOrganization;
  }


  getAllBusinesses() {

    // send default value
    this.businessService.getAllBusinesses(this.orderByName).subscribe(value=> {
      console.log(value);
      this.businesses = value;

    }, error => {
      console.log("error");
      console.log(error);
    })
  }

  chooseBusiness(business: Business) {
    console.log("call the function");
    console.log(business.id);

    console.log('business is  ' + business.nameOrganization);

    if (business.id !== null) {
      //this.router.navigate(['/detail-business', {businessId: business.id}])
      this.router.navigate(['/detail-business'], { queryParams: { businessId: business.id}})
    }
  }



}
