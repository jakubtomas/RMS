import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Business } from '../../../interfaces/business';
import { BusinessService } from '../../../services/business.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SearchBusiness } from '../../../interfaces/searchBusiness';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

export type AllowedProperties =
  | 'city'
  | 'id'
  | 'idOwner'
  | 'nameOrganization'
  | 'nameStreetWithNumber'
  | 'phoneNumber'
  | 'typeOfOrganization'
  | 'zipCode';
@Component({
  selector: 'app-search-business',
  templateUrl: './search-business.page.html',
  styleUrls: ['./search-business.page.scss'],
})
export class SearchBusinessPage implements OnInit {
  registerForm: FormGroup;
  typesOrganization: Array<any>;
  orderBy: AllowedProperties = 'nameOrganization';
  searching = false;

  noResultMessage = false;
  searchBusinessError: string;
  businesses$: Observable<Business[]>;

  constructor(
    private businessService: BusinessService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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

  ngOnInit() {
    this.typesOrganization = this.getTypesOrganization();
    this.registerForm = new FormGroup({
      nameOrganization: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      typeOrganization: new FormControl('', Validators.required),
    });

    this.registerForm.setValue({
      nameOrganization: null,
      city: null,
      zipCode: null,
      typeOrganization: null,
    });
  }

  onSubmit(): void {
    this.searching = true;
    const searchValues: SearchBusiness = {
      nameOrganization: this.capitalizeFirstLetter(this.nameOrganization.value),
      city: this.capitalizeFirstLetter(this.city.value),
      zipCode: this.zipCode.value,
      typeOfOrganization: this.typeOrganization.value,
    };

    this.getSearchedBusinesses(searchValues);
  }

  getTypesOrganization(): { name: string }[] {
    return this.businessService.typesOfOrganization;
  }

  toggleSortOrder(property: AllowedProperties): void {
    if (this.orderBy === property) {
      // Reverse the order if it's already sorted by the same property
      this.businesses$ = this.businesses$.pipe(
        map((businesses) => businesses.reverse())
      );
    } else {
      this.orderBy = property;
      // Sort by the specified property
      this.businesses$ = this.businesses$.pipe(
        map((businesses) =>
          businesses.sort((a, b) => a[property].localeCompare(b[property]))
        )
      );
    }
  }

  getSearchedBusinesses(searchValues: SearchBusiness): void {
    this.searching = true;

    this.businesses$ = this.businessService
      .getSearchedBusinesses(searchValues)
      .pipe(
        tap({
          next: (business: Business[]) => {
            console.log(business);
            this.searching = false;
          },
          error: () => {
            this.searchBusinessError =
              'Problem with server. Please try again or refresh page.';
          },
        })
      );
  }

  selectDetailsBusiness(business: Business): void {
    if (business.id !== null) {
      this.router.navigate(['/detail-business'], {
        queryParams: { businessId: business.id },
      });
    }
  }
  private capitalizeFirstLetter(name: string): string {
    // return name;
    if (name !== undefined && name !== null && name.length > 0) {
      return name.replace(/^./, name[0].toUpperCase());
    }
    return name;
  }
}
