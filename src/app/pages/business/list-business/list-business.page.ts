import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {BusinessService} from "../../../services/business.service";
import {Business} from "../../../interfaces/business";

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
    businesses: Business[];
    messageFirebase: string;

    orderByName: string = "asc";

    constructor(private route: ActivatedRoute,
                private businessService: BusinessService,
                private router: Router) {
    }

    ngOnInit() {
        this.getAllBusinesses();

        //when we go again this page ionic maybe have function
        // vyriesit problem tu je ze tato funkcia sa nezavola vzdy ked sa prekliknem na tuto page
        //pretoze si uklada info b stranke
        this.messageFirebase = null;


        this.route.queryParams.subscribe((params: Params) => {
            console.log('Parameter  ' + JSON.stringify(params));
            if (params['deletedBusiness']) {
              this.messageFirebase= 'Business successfully deleted'
            }

            if (params['createdBusiness'] != undefined) {
                this.messageFirebase = 'Business successfully created'
            }
        },  error => {
            console.log("you got error ");
            console.log(error);
        });

    }
    //todo is essential thing set messagefirbase to null in another function which we call


    getItems() {
        this.businessService.getItems().subscribe(value => {
            console.log(value);
            this.items = value;
        })
    }

    changeOrderByName() {
        if (this.orderByName === "asc") {
            this.orderByName = "desc";
        } else {
            this.orderByName = "asc";
        }
        this.getAllBusinesses();
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
