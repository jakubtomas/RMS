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
          nameOrganization: new FormControl('', ),
          city: new FormControl('', ),
          zipCode: new FormControl('', ),
          typeOrganization: new FormControl('', Validators.required),
        });



    this.registerForm.setValue({
      nameOrganization: null,
      city: null,
      zipCode: null,
      typeOrganization: null
    });
  }

  onSubmit() {
    let searchData = {
      nameOrganization: this.nameOrganization.value,
      city: this.city.value,
      zipCode: this.zipCode.value,
      typeOfOrganization: this.typeOrganization.value
    };
    console.log(searchData);

    this.getAllBusinesses();
  }
  getTypesOrganization() {
    return this.businessService.typesOfOrganization;
  }

  orderByName() {
    if (this.orderBy === 'nameOrganization') {
      this.businesses.reverse();
    } else {
      this.orderBy = 'nameOrganization';
      this.getAllBusinesses();
    }
  }

  orderByAddress() {

    if (this.orderBy === 'city') {
      this.businesses.reverse();
    } else {
      this.orderBy = 'city';
      this.getAllBusinesses();
    }
  }

  //todo create function
  // filter data accordiing the input type cityz name and so on



  getAllBusinesses() {

    // send default value
    // todo zmena parameter get all business
    this.businessService.getAllBusinesses(this.orderBy).subscribe(value=> {
      console.log(value);
      this.businesses = value;

      // create filter
      console.log(this.businesses);

      this.businesses= value.filter(oneBusiness => oneBusiness.typeOfOrganization === this.typeOrganization.value);
      console.log("after filter");
      console.log(this.businesses);

      //todo maybe use regex for searching string
      if (this.nameOrganization.value !== null) {
         this.businesses= this.businesses.filter(oneBusiness => oneBusiness.nameOrganization.includes(this.nameOrganization.value));

      }

      if (this.city.value !== null) {
        this.businesses= this.businesses.filter(oneBusiness => oneBusiness.city.includes(this.city.value));
      }

      if (this.zipCode.value !== null) {
        this.businesses= this.businesses.filter(oneBusiness => oneBusiness.zipCode.includes(this.zipCode.value));
      }

      if (this.businesses.length === 0) {
        this.noResultMessage = true;
      } else {
        this.noResultMessage = false;
      }

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
