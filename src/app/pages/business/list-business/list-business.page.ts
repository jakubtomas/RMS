import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {Observable} from "rxjs";
import {filter, map} from "rxjs/operators";

interface Item {
    id?: string;
    name?: string;
    age?: number;
}

@Component({
    selector: 'app-list-business',
    templateUrl: './list-business.page.html',
    styleUrls: ['./list-business.page.scss'],
})
export class ListBusinessPage implements OnInit, OnDestroy {

    items: Item[];
    messageFirebase: string;
    private orderBy: string = 'nameOrganization';
    private businessPermission;
    directionOrderBy: string = 'asc';
    businesses: Business[];

    // businesses$: Observable<Business[]> = //
    //     this.businessService.getAllMyBusinesses("mock").pipe(
    //         map(businesses=> businesses.filter((business) => business.nameOrganization))
    //     );


    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router) {
    }

    ngOnInit() {
       // this.getAllMyBusinesses();
        this.messageFirebase = null;

        this.route.queryParams.subscribe((params: Params) => {

            console.log(' dostal som parametre ');
            
            this.getAllMyBusinesses();
            if (params['deletedBusiness']) {
                this.messageFirebase = 'Business successfully deleted'
            }

            if (params['createdBusiness'] != undefined) {
                this.messageFirebase = 'Business successfully created';
                console.log(' Business created ');

            }
        }, error => {
            console.log("you got error ");
            console.log(error);
        });

    }


    orderByName(): void {
        if (this.orderBy === 'nameOrganization') {

            if (this.directionOrderBy === 'desc') {
                this.directionOrderBy = 'asc';
            } else {
                this.directionOrderBy = 'desc';
            }
        } else {
            this.orderBy = 'nameOrganization';
            this.directionOrderBy = 'asc';
        }
    }

    orderByAddress(): void {
        if (this.orderBy === 'city') {

            if (this.directionOrderBy === 'desc') {
                this.directionOrderBy = 'asc';
            } else {
                this.directionOrderBy = 'desc';
            }
        } else {
            this.orderBy = 'city';
            this.directionOrderBy = 'asc';
            //   this.getAllBusinesses();
        }
        console.log('click order by address');

    }


    // get all ID business which are my /
    private getAllMyBusinesses(): void {
        this.businessService.getAllMyBusinesses()
            .subscribe(businesses => {

                //businesses.map(businesses=> businesses.filter((business) => business.nameOrganization))
                console.log('vypis businessoov ');
                console.log(businesses);
                this.businesses = businesses.filter((business) => business.nameOrganization)

            }, error => {
                console.log("error");
                console.log(error);
            })
    }

    chooseBusiness(business: Business): void {
        console.log("call ssearthe function");
        console.log(business.id);

        console.log('business is  ' + business.nameOrganization);

        if (business.id !== null) {
            //this.router.navigate(['/detail-business', {businessId: business.id}])
            this.router.navigate(['/detail-business'],
                {queryParams: {businessId: business.id}})
        }
    }

    ngOnDestroy(): void {
        this.messageFirebase = '';

        //   businesses$.pipe()
    }


}
