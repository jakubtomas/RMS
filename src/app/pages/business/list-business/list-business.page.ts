import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";
import {Observable} from "rxjs";

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
export class ListBusinessPage implements OnInit {

    items: Item[];
    messageFirebase: string;
    private orderBy: string = 'nameOrganization';
    private businessPermission;
    directionOrderBy: string = 'asc';
    businesses$: Observable<Business[]> = // todo change function getAllMyBusinesss delete paramter
        this.businessService.getAllMyBusinesses("mock");


    constructor(private route: ActivatedRoute,
        private businessService: BusinessService,
        private router: Router) {
    }

    ngOnInit() {
        //this.getAllBusinesses();
        //when we go again this page ionic maybe have function
        // vyriesit problem tu je ze tato funkcia sa nezavola vzdy ked sa prekliknem na tuto page
        //pretoze si uklada info b stranke
        this.messageFirebase = null;


        this.route.queryParams.subscribe((params: Params) => {

            if (params['deletedBusiness']) {
                this.messageFirebase = 'Business successfully deleted'
            }

            if (params['createdBusiness'] != undefined) {
                this.messageFirebase = 'Business successfully created'
            }
        }, error => {
            console.log("you got error ");
            console.log(error);
        });

    }

    //todo is essential thing set messagefirebase to null in another function which we call


    getItems(): void {
        this.businessService.getItems().subscribe(value => {
            console.log(value);
            this.items = value;
        })
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
            // this.getAllBusinesses();
        }

        console.log('click order by name');

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
    private getAllBusinessesPermission(): void {
        this.businessService.getBusinessPermissions()
            .subscribe(permission => {
                console.log(permission);

                // take id local storage or else
                const userId = localStorage.getItem('idUser');
                console.log(userId);
                /*
                 const array = permission.filter(value => value.idUser == userId);
                 console.log(array);*/
                this.businessPermission = permission.filter(value => value.idUser == userId);

                // this.getAllMyBusinesses();
            }, error => {
                console.log("error");
                console.log(error);
            })
    }

    /*private getAllMyBusinesses() {
     this.businessPermission.forEach(value => {
     this.businessService.getOneBusiness(value.idOrganization).subscribe(oneBusiness => {
     this.myBusinesses.push(oneBusiness);
     console.log("priradeny zazname");

     }, error => {
     console.log("error");
     console.log(error);
     })
     });
     console.log('all my businesses ');

     console.log(this.myBusinesses);

     }*/

    /// write condition if my list business filter according to my idlist
//     getAllBusinesses():void {
//
//         this.businessService.getAllMyBusinesses(this.orderBy).subscribe(business => {
//             console.log(business);
//             this.businesses = business;
//
//         }, error => {
//             console.log("error");
//             console.log(error);
//         })
//
// }
    chooseBusiness(business: Business): void {
        console.log("call ssearthe function");
        console.log(business.id);

        console.log('business is  ' + business.nameOrganization);

        if (business.id !== null) {
            //this.router.navigate(['/detail-business', {businessId: business.id}])
            this.router.navigate(['/detail-business'], {queryParams: {businessId: business.id}})
        }
    }


}
